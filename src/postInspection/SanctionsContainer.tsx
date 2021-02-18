import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { Inspection, Sanction, SanctionsResponse } from '../schema-types'
import { defaultPageConfig, useTableState } from '../common/table/useTableState'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { Text } from '../util/translate'
import { FlexRow, PageSection } from '../common/components/common'
import { useMutationData } from '../util/useMutationData'
import { gql } from '@apollo/client'
import { createPageState, PageMeta } from '../common/table/tableUtils'
import StatefulTable from '../common/table/StatefulTable'
import { CellValType, EditValue, RenderInputType } from '../common/table/Table'
import { TabChildProps } from '../common/components/Tabs'

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
    <input
      type="checkbox"
      value={val + ''}
      onChange={() => onChange(val)}
      checked={val !== 0}
      name="sanctionable"
    />
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
  mutation setSanction($sanctionId: String!, $sanctionValue: Float!) {
    setSanctionValue(sanctionId: $sanctionId, sanctionValue: $sanctionValue) {
      id
      appliedSanctionAmount
    }
  }
`

export type PropTypes = {
  inspection: Inspection
} & TabChildProps

const SanctionsContainer = observer(({ inspection }: PropTypes) => {
  let tableState = useTableState()
  let { filters = [], sort = [], page = defaultPageConfig } = tableState
  let [pendingValues, setPendingValues] = useState<EditValue<Sanction>[]>([])

  let requestVars = useRef({
    inspectionId: inspection.id,
    filters,
    sort,
    page,
  })

  let { data: sanctionsData, loading, refetch } = useQueryData<SanctionsResponse>(
    sanctionsQuery,
    {
      fetchPolicy: 'network-only',
      skip: !inspection,
      variables: { ...requestVars.current },
    }
  )

  let [execSetSanctionMutation, { loading: setSanctionLoading }] = useMutationData(
    setSanctionMutation
  )

  let onChangeSanction = useCallback(
    (key: keyof Sanction, value: CellValType, item: Sanction) => {
      setPendingValues((currentValues) => {
        let existingEditValueIndex = currentValues.findIndex(
          (val) => val.key === key && val.itemId === item.id
        )

        let setValue = value

        if (existingEditValueIndex !== -1) {
          currentValues.splice(existingEditValueIndex, 1)
          // Toggle value only if already editing it
          setValue = value === item.sanctionAmount ? 0 : item.sanctionAmount
        }

        let editValue = { item, itemId: item.id, key, value: setValue }
        return [...currentValues, editValue]
      })
    },
    []
  )

  let onSaveSanctions = useCallback(async () => {
    if (pendingValues.length === 0) {
      return
    }

    setPendingValues([])

    for (let updateValue of pendingValues) {
      await execSetSanctionMutation({
        variables: updateValue,
      })
    }
  }, [pendingValues])

  let onCancelEdit = useCallback(() => {
    setPendingValues([])
  }, [])

  let onUpdateFetchProps = useCallback(() => {
    requestVars.current.filters = filters
    refetch({ ...requestVars.current, sort, page })
  }, [refetch, requestVars.current, filters, sort, page])

  // Trigger the refetch when sort or page state changes. Does NOT react to
  // filter state, which is triggered separately with a button.
  useEffect(() => {
    onUpdateFetchProps()
  }, [sort, page])

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

  let sanctionPageState: PageMeta = useMemo(() => createPageState(sanctionsData), [
    sanctionsData,
  ])

  let isLoading = loading || setSanctionLoading || false

  return (
    <PostInspectionSanctionsView>
      <FunctionsRow>
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={onUpdateFetchProps}>
          <Text>update</Text>
        </Button>
      </FunctionsRow>
      <PageSection>
        <StatefulTable<Sanction>
          loading={isLoading}
          items={sanctionDataItems}
          pageMeta={sanctionPageState}
          tableState={tableState}
          onUpdate={onUpdateFetchProps}
          columnLabels={sanctionColumnLabels}
          keyFromItem={(item) => item.id}
          renderInput={renderSanctionInput}
          maxHeight={window.innerHeight * 0.65}
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
