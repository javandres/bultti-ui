import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import {
  Inspection,
  Sanction,
  SanctionableEntity,
  SanctionException,
  SanctionsResponse,
  SanctionUpdate,
} from '../schema-types'
import { createResponseId, useTableState } from '../common/table/useTableState'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { text, Text } from '../util/translate'
import { FlexRow, PageSection } from '../common/components/common'
import { useMutationData } from '../util/useMutationData'
import { gql } from '@apollo/client'
import FilteredResponseTable from '../common/table/FilteredResponseTable'
import { TabChildProps } from '../common/components/Tabs'
import { navigateWithQueryString } from '../util/urlValue'
import { EditValue, RenderInputType } from '../common/table/tableUtils'
import { useLazyQueryData } from '../util/useLazyQueryData'
import { DEBUG, DEFAULT_DECIMALS } from '../constants'
import { round } from '../util/round'

const PostInspectionSanctionsView = styled.div`
  min-height: 100%;
  width: 100%;
  padding: 0 0.75rem 2rem;
  background-color: var(--white-grey);
`

const FunctionsRow = styled(FlexRow)`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: 0 -0.75rem 0;
  background: white;
`

const SanctionToggleLabel = styled.label`
  display: block;
  cursor: pointer;
  width: 100%;
`

const SanctionToggleInput = styled.input`
  display: block;
`

let sanctionColumnLabels = {
  sanctionableType: 'Sanktioitava kohde',
  entityIdentifier: 'Tunnus',
  sanctionAmount: 'Sanktiomäärä',
  sanctionReason: 'Sanktioperuste',
  sanctionableValue: 'Sanktioon johtava arvo',
  sanctionableKilometers: 'Kilometrisuorite',
  appliedSanctionAmount: 'Sanktioidaan',
  sanctionResultKilometers: 'Sanktioidut kilometrit',
  matchesException: 'Sanktiopoikkeus',
}

let renderSanctionInput: RenderInputType<Sanction> = (key: string, val: number, onChange) => {
  return (
    <SanctionToggleLabel>
      <SanctionToggleInput
        type="checkbox"
        value={val + ''}
        onChange={() => onChange(val)}
        checked={val !== 0}
        name="sanctionable"
      />
    </SanctionToggleLabel>
  )
}

let sanctionsQuery = gql`
  query sanctions(
    $inspectionId: String!
    $filters: [InputFilterConfig!]
    $sort: [InputSortConfig!]
  ) {
    inspectionSanctions(inspectionId: $inspectionId, filters: $filters, sort: $sort) {
      id
      inspectionId
      filteredCount
      totalCount
      sort {
        column
        order
      }
      filters {
        field
        filterValue
      }
      rows {
        id
        entityIdentifier
        inspectionId
        sanctionAmount
        sanctionReason
        sanctionableKilometers
        sanctionableType
        appliedSanctionAmount
        sanctionResultKilometers
        sanctionableValue
        matchesException {
          id
          departureProperty
          exceptionAppliesToReason
          exceptionValue
        }
      }
    }
  }
`

let setSanctionMutation = gql`
  mutation setSanction($sanctionUpdates: [SanctionUpdate!]!) {
    updateSanctions(sanctionUpdates: $sanctionUpdates) {
      id
      appliedSanctionAmount
      sanctionResultKilometers
    }
  }
`

let devLoadSanctions = gql`
  query runSanctioning($inspectionId: String!) {
    runSanctioning(inspectionId: $inspectionId) {
      id
    }
  }
`

let abandonSanctionsMutation = gql`
  mutation abandonSanctions($inspectionId: String!) {
    abandonSanctions(inspectionId: $inspectionId) {
      id
      status
    }
  }
`

export type PropTypes = {
  inspection: Inspection
} & TabChildProps

const SanctionsContainer = observer(({ inspection }: PropTypes) => {
  let tableState = useTableState()
  let { filters = [], sort = [] } = tableState
  let [pendingValues, setPendingValues] = useState<EditValue<Sanction, number>[]>([])

  let { data: sanctionsData, loading, refetch } = useQueryData<SanctionsResponse>(
    sanctionsQuery,
    {
      notifyOnNetworkStatusChange: true,
      skip: !inspection,
      partialRefetch: true,
      variables: {
        // Add a string variable that changes when the table state changes.
        // Without this it wouldn't refetch if eg. filters change.
        responseId: createResponseId({ filters, sort }),
        inspectionId: inspection.id,
        filters,
        sort,
      },
    }
  )

  let [execSetSanctionMutation, { loading: setSanctionLoading }] = useMutationData(
    setSanctionMutation,
    {
      update: (cache, { data: { updateSanctions } }) => {
        for (let update of updateSanctions) {
          let cacheId = cache.identify(update)
          cache.writeFragment({
            id: cacheId,
            data: {
              appliedSanctionAmount: update.appliedSanctionAmount,
              sanctionResultKilometers: update.sanctionResultKilometers,
            },
            fragment: gql`
              fragment SanctionFragment on Sanction {
                appliedSanctionAmount
                sanctionResultKilometers
              }
            `,
          })
        }
      },
    }
  )

  let [execAbandonSanctions, { loading: abandonSanctionsLoading }] = useMutationData(
    abandonSanctionsMutation,
    {
      variables: {
        inspectionId: inspection.id,
      },
    }
  )

  let onChangeSanction = useCallback((key: keyof Sanction, value: number, item: Sanction) => {
    setPendingValues((currentValues) => {
      let existingEditValueIndex = currentValues.findIndex(
        (val) => val.key === key && val.itemId === item.id
      )

      let setValue = value === item.sanctionAmount ? 0 : item.sanctionAmount

      if (existingEditValueIndex !== -1) {
        currentValues.splice(existingEditValueIndex, 1)
      }

      let editValue = { item, itemId: item.id, key, value: setValue }
      return [...currentValues, editValue]
    })
  }, [])

  let onSaveSanctions = useCallback(async () => {
    if (pendingValues.length === 0) {
      return
    }

    setPendingValues([])
    let updateValues: SanctionUpdate[] = []

    for (let editValue of pendingValues) {
      let updateValue: SanctionUpdate = {
        sanctionId: editValue.itemId,
        appliedSanctionAmount: editValue.value as number,
      }

      updateValues.push(updateValue)
    }

    await execSetSanctionMutation({
      variables: {
        sanctionUpdates: updateValues,
      },
    })
  }, [pendingValues])

  let onCancelEdit = useCallback(() => {
    setPendingValues([])
  }, [])

  let isLoading = loading || setSanctionLoading || false

  let onAbandonSanctions = useCallback(async () => {
    if (confirm(text('postInspection_confirmAbandonSanctions'))) {
      await execAbandonSanctions()
      navigateWithQueryString(`/post-inspection/edit/${inspection.id}/`)
    }
  }, [execAbandonSanctions, inspection])

  let [loadSanctions, { loading: devLoadingSanctions }] = useLazyQueryData(devLoadSanctions, {
    variables: { inspectionId: inspection?.id },
  })

  let renderValue = useCallback(
    (key: string, val: any, isHeader?: boolean, item?: Sanction) => {
      if (
        [
          'sanctionAmount',
          'sanctionableKilometers',
          'appliedSanctionAmount',
          'sanctionResultKilometers',
        ].includes(key)
      ) {
        return round(val, DEFAULT_DECIMALS)
      }

      if (key !== 'entityIdentifier' || isHeader || !item) {
        return val
      }

      let idParts = (val as string).split('_')

      switch (item.sanctionableType) {
        case SanctionableEntity.Departure:
          return `${idParts[0]} / ${idParts[1]} / ${idParts[2]} / ${idParts[3]}`
        case SanctionableEntity.EmissionClass:
          return `Alue: ${idParts[0]} Päästöluokka: ${idParts[1]}`
        case SanctionableEntity.Equipment:
          return `Kohde: ${idParts[0]} Ajoneuvon ikä: ${idParts[1]}`
        default:
          return val
      }
    },
    []
  )

  let transformItems = useCallback((items) => {
    return items.map((item) => {
      if (item.matchesException) {
        let exception: SanctionException = item.matchesException
        return {
          ...item,
          matchesException: `${exception.exceptionAppliesToReason}:${exception.departureProperty}:${exception.exceptionValue}`,
        }
      }

      return item
    })
  }, [])

  return (
    <PostInspectionSanctionsView>
      <FunctionsRow>
        <Button
          loading={abandonSanctionsLoading}
          buttonStyle={ButtonStyle.SECONDARY_REMOVE}
          size={ButtonSize.SMALL}
          onClick={onAbandonSanctions}>
          <Text>inspection_actions_abandonSanctions</Text>
        </Button>
        {DEBUG && (
          <Button
            loading={devLoadingSanctions}
            size={ButtonSize.SMALL}
            onClick={() => loadSanctions()}>
            DEV Load sanctions
          </Button>
        )}
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={() => refetch()}>
          <Text>update</Text>
        </Button>
      </FunctionsRow>
      <PageSection>
        <FilteredResponseTable<Sanction, number>
          loading={isLoading}
          data={sanctionsData}
          tableState={tableState}
          columnLabels={sanctionColumnLabels}
          keyFromItem={(item) => item.id}
          renderInput={renderSanctionInput}
          pendingValues={pendingValues}
          editableValues={['appliedSanctionAmount']}
          onSaveEdit={onSaveSanctions}
          onEditValue={onChangeSanction}
          onCancelEdit={onCancelEdit}
          isAlwaysEditable={true}
          renderValue={renderValue}
          transformItems={transformItems}
        />
      </PageSection>
    </PostInspectionSanctionsView>
  )
})

export default SanctionsContainer
