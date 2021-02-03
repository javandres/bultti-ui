import React, { useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { PageTitle } from '../common/components/PageTitle'
import { Page, PageSection, PageContainer } from '../common/components/common'
import { RouteComponentProps } from '@reach/router'
import InspectionDateForm from '../inspection/inspectionDate/InspectionDateForm'
import { Button } from '../common/components/Button'
import InspectionDateList from '../inspection/inspectionDate/InsectionDateList'
import { useRefetch } from '../util/useRefetch'
import { useQueryData } from '../util/useQueryData'
import { allInspectionDatesQuery } from '../inspection/inspectionDate/inspectionDateQuery'
import { orderBy } from 'lodash'
import { Text } from '../util/translate'
import { InspectionDate } from '../schema-types'

const InspectionDatesPage = styled(Page)``

const InspectionDateListWrapper = styled(PageSection)``

const NewInspectionButtonWrapper = styled.div``

export type PropTypes = RouteComponentProps

const InspectionDatePage: React.FC<PropTypes> = observer(() => {
  let loading = false
  let [isInspectionDateFormVisible, setInspectionDateFormVisibility] = useState<boolean>(false)

  let {
    data: inspectionDatesQueryResult,
    loading: areInspectionDatesLoading,
    refetch: refetchInspectionDates,
  } = useQueryData<InspectionDate[]>(allInspectionDatesQuery)

  let refetch = useRefetch(refetchInspectionDates)

  let sortedInspectionDates = useMemo(
    () => orderBy(inspectionDatesQueryResult || [], 'startDate', 'desc'),
    [inspectionDatesQueryResult]
  )

  return (
    <InspectionDatesPage>
      <PageTitle loading={loading} onRefresh={refetch}>
        <Text>inspection_date.page.header</Text>
      </PageTitle>
      <PageContainer>
        <InspectionDateListWrapper>
          <InspectionDateList
            inspectionDates={sortedInspectionDates}
            isLoading={areInspectionDatesLoading}
            refetchInspectionDateList={refetch}
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
      </PageContainer>
    </InspectionDatesPage>
  )
})

export default InspectionDatePage
