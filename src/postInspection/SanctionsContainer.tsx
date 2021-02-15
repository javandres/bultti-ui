import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import { Inspection } from '../schema-types'
import { defaultPageConfig, ReportStateCtx } from '../report/ReportStateContext'
import ReportView from '../report/ReportView'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { Text } from '../util/translate'
import { FlexRow } from '../common/components/common'
import { ReportStats } from '../type/report'
import { useMutationData } from '../util/useMutationData'
import { gql } from '@apollo/client'

const ReportFunctionsRow = styled(FlexRow)`
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: -0.25rem -1rem 0;
`

let sanctionColumnLabels = {
  sanctionableType: 'Sanktioitava kohde',
  entityIdentifier: 'Tunnus',
  sanctionAmount: 'Sanktiomäärä',
  appliedSanctionAmount: 'Sovellettu sanktiomäärä',
  sanctionReason: 'Sanktioperuste',
  sanctionableKilometers: 'Sanktioitavat kilometrit',
}

let sanctionsQuery = gql`
  query sanctions($inspectionId: String!) {
    inspectionSanctions(inspectionId: $inspectionId) {
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
}

const SanctionsContainer = observer(({ inspection }: PropTypes) => {
  let { filters = [], sort = [], page = defaultPageConfig } = useContext(ReportStateCtx)

  let requestVars = useRef({
    inspectionId: inspection.id,
    filters,
    sort,
    page,
  })

  let { data: sanctionsData, loading, refetch } = useQueryData(sanctionsQuery, {
    skip: !inspection,
    variables: { ...requestVars.current },
  })

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

  let sanctionDataItems = useMemo(() => sanctionsData?.sanctionsData || [], [sanctionsData])

  let sanctionStats: ReportStats = useMemo(
    () => ({
      totalCount: sanctionsData?.totalCount || 0,
      pages: sanctionsData?.pages || 0,
      filteredCount: sanctionsData?.filteredCount || sanctionsData?.totalCount || 0,
      currentPage: sanctionsData?.page?.page || 0,
      pageSize: sanctionsData?.page?.pageSize || 0,
      itemsOnPage: sanctionsData?.sanctionsData?.length,
    }),
    [sanctionsData]
  )

  return (
    <>
      <ReportFunctionsRow>
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={onUpdateFetchProps}>
          <Text>update</Text>
        </Button>
      </ReportFunctionsRow>
      <ReportView
        reportType="list"
        loading={loading}
        items={sanctionDataItems}
        reportStats={sanctionStats}
        onUpdate={onUpdateFetchProps}
        columnLabels={sanctionColumnLabels}
      />
    </>
  )
})

export default SanctionsContainer
