import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { PageTitle } from '../common/components/PageTitle'
import { Page } from '../common/components/common'
import { RouteComponentProps } from '@reach/router'
import InspectionDateForm from '../inspection/inspectionDate/InspectionDateForm'
import { Button } from '../common/components/Button'
import InspectionDateList from '../inspection/inspectionDate/InsectionDateList'
import { useRefetch } from '../util/useRefetch'
import { useQueryData } from '../util/useQueryData'
import { allInspectionDatesQuery } from '../inspection/inspectionDate/inspectionDateQuery'
import { orderBy } from 'lodash'
import { Text } from '../util/translate'

const InspectionDatesPage = styled.div`
  padding: 0 1rem 1rem 1rem;
`

const InspectionDateListWrapper = styled.div`
  padding: 1rem;
  background-color: white;
`

const NewInspectionButtonWrapper = styled.div`
  margin-top: 1rem;
`

export type PropTypes = RouteComponentProps

const InspectionDatePage: React.FC<PropTypes> = observer(() => {
  let loading = false
  let [isInspectionDateFormVisible, setInspectionDateFormVisibility] = useState<boolean>(false)

  let {
    data: inspectionDatesQueryResult,
    loading: areInspectionDatesLoading,
    refetch: refetchInspectionDates,
  } = useQueryData(allInspectionDatesQuery)

  let refetch = useRefetch(refetchInspectionDates)

  let sortedInspectionDates = useMemo(
    () => orderBy(inspectionDatesQueryResult || [], 'startDate', 'desc'),
    [inspectionDatesQueryResult]
  )

  return (
    <Page>
      <PageTitle loading={loading} onRefresh={refetch}>
        <Text>inspection_date.page.header</Text>
      </PageTitle>
      <InspectionDatesPage>
        <InspectionDateListWrapper>
          <InspectionDateList
            inspectionDates={sortedInspectionDates}
            isLoading={areInspectionDatesLoading}
          />
          <NewInspectionButtonWrapper>
            <Button onClick={() => setInspectionDateFormVisibility(true)}>
              <Text>inspection_date.page.new_inspection_button</Text>
            </Button>
          </NewInspectionButtonWrapper>
        </InspectionDateListWrapper>
        {isInspectionDateFormVisible && (
          <InspectionDateForm
            closeInspectionDateList={() => setInspectionDateFormVisibility(false)}
            refetchInspectionDateList={refetch}
          />
        )}
      </InspectionDatesPage>
    </Page>
  )
})

export default InspectionDatePage
