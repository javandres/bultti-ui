import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { Inspection, Sanction, SanctionsResponse, SanctionUpdate } from '../schema-types'
import {
  createResponseId,
  defaultPageConfig,
  useTableState,
} from '../common/table/useTableState'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { text, Text } from '../util/translate'
import { FlexRow, PageSection } from '../common/components/common'
import { useMutationData } from '../util/useMutationData'
import { gql } from '@apollo/client'
import { createPageMeta, PageMeta } from '../common/table/tableUtils'
import StatefulTable from '../common/table/StatefulTable'
import { EditValue, RenderInputType } from '../common/table/Table'
import { TabChildProps } from '../common/components/Tabs'
import { navigateWithQueryString } from '../util/urlValue'

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
  sanctionableKilometers: 'Kilometrisuorite',
  appliedSanctionAmount: 'Sanktioidaan',
  sanctionResultKilometers: 'Sanktioidut kilometrit',
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
    $page: InputPageConfig
    $filters: [InputFilterConfig!]
    $sort: [InputSortConfig!]
  ) {
    inspectionSanctions(
      inspectionId: $inspectionId
      page: $page
      filters: $filters
      sort: $sort
    ) {
      id
      inspectionId
      filteredCount
      pages
      totalCount
      sort {
        column
        order
      }
      filters {
        field
        filterValue
      }
      page {
        page
        pageSize
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
      }
    }
  }
`

let setSanctionMutation = gql`
  mutation setSanction($sanctionUpdates: [SanctionUpdate!]!) {
    updateSanctions(sanctionUpdates: $sanctionUpdates) {
      id
      appliedSanctionAmount
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
  let { filters = [], sort = [], page = defaultPageConfig } = tableState
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
        responseId: createResponseId({ page, filters, sort }),
        inspectionId: inspection.id,
        filters,
        sort,
        page,
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
            },
            fragment: gql`
              fragment SanctionFragment on Sanction {
                appliedSanctionAmount
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

  let sanctionDataItems = useMemo(
    () =>
      (sanctionsData?.rows || []).map((sanction) => {
        // Set a virtual sanctionResultKilometers prop on all sanction rows.
        // This tells the user the concrete kilometer amount that is sanctioned.
        let sanctionResult =
          sanction.sanctionableKilometers * (sanction.appliedSanctionAmount / 100)

        return {
          ...sanction,
          sanctionResultKilometers: sanctionResult,
        }
      }),
    [sanctionsData]
  )

  let sanctionPageMeta: PageMeta = useMemo(() => createPageMeta(sanctionsData), [
    sanctionsData,
  ])

  let isLoading = loading || setSanctionLoading || false

  let onAbandonSanctions = useCallback(async () => {
    if (confirm(text('postInspection_confirmAbandonSanctions'))) {
      await execAbandonSanctions()
      navigateWithQueryString(`/post-inspection/edit/${inspection.id}/`)
    }
  }, [execAbandonSanctions, inspection])

  return (
    <PostInspectionSanctionsView>
      <FunctionsRow>
        <Button
          buttonStyle={ButtonStyle.SECONDARY_REMOVE}
          size={ButtonSize.SMALL}
          onClick={onAbandonSanctions}>
          <Text>inspection_actions_abandonSanctions</Text>
        </Button>
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={() => refetch()}>
          <Text>update</Text>
        </Button>
      </FunctionsRow>
      <PageSection>
        <StatefulTable<Sanction, number>
          loading={isLoading}
          items={sanctionDataItems}
          pageMeta={sanctionPageMeta}
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
        />
      </PageSection>
    </PostInspectionSanctionsView>
  )
})

export default SanctionsContainer
