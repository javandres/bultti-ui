import React, { useCallback, useEffect, useMemo, useRef } from 'react'
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
import { createPageState, PageState } from '../common/table/tableUtils'
import StatefulTable from '../common/table/StatefulTable'
import { CellContent } from '../common/table/Table'
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

let renderSanctionInput = (onChange) => (key: string, val: number, item?: Sanction) => {
  if (key !== 'appliedSanctionAmount') {
    return <CellContent>{val}</CellContent>
  }

  let onToggleCheckbox = (val) => {
    console.log(val)
  }

  return (
    <input
      type="checkbox"
      value={val + ''}
      onChange={onToggleCheckbox}
      checked={!!val && val === item?.sanctionAmount}
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

  let onSetSanction = useCallback((sanctionId: string, sanctionValue: number) => {
    execSetSanctionMutation({
      variables: {
        sanctionId,
        sanctionValue,
      },
    })
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

  let sanctionPageState: PageState = useMemo(() => createPageState(sanctionsData), [
    sanctionsData,
  ])

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
          loading={loading}
          items={sanctionDataItems}
          pageState={sanctionPageState}
          tableState={tableState}
          onUpdate={onUpdateFetchProps}
          columnLabels={sanctionColumnLabels}
          keyFromItem={(item) => item.id}
          renderCell={renderSanctionInput(onSetSanction)}
          maxHeight={window.innerHeight * 0.65}
        />
      </PageSection>
    </PostInspectionSanctionsView>
  )
})

export default SanctionsContainer
