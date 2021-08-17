import React, { useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import {
  getInspectionTypeStrings,
  isPreInspection,
  useFetchInspections,
  useNavigateToInspectionReports,
} from '../inspection/inspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Page, PageContainer } from '../common/components/common'
import { ControlGroup } from '../common/components/form'
import { useStateValue } from '../state/useAppState'
import { Inspection, InspectionStatus, InspectionType } from '../schema-types'
import { LoadingDisplay } from '../common/components/Loading'
import Dropdown, { DefaultDropdownValueType } from '../common/input/Dropdown'
import { orderBy } from 'lodash'
import { PageTitle } from '../common/components/PageTitle'
import InspectionIndexItem from '../inspection/InspectionIndexItem'
import { getReadableDate } from '../util/formatDate'
import { text, Text } from '../util/translate'
import { operatorIsValid } from '../common/input/SelectOperator'
import { RouteChildrenProps } from 'react-router-dom'

const InspectionReportIndexPageView = styled(Page)``

const FilterBar = styled.div`
  margin-bottom: 1rem;
  padding: 0 1rem 1.5rem;
  border-bottom: 1px solid var(--lighter-grey);
  display: flex;
`

const FilterControlGroup = styled(ControlGroup)`
  margin-bottom: 0;
  flex: 1 1 50%;
  width: auto;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
`

const InspectionListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const defaultSelectedDate = { label: 'Kaikki', value: 'kaikki' }

export type PropTypes = {
  inspectionType: InspectionType
} & RouteChildrenProps

const InspectionReportIndexPage: React.FC<PropTypes> = observer(({ inspectionType }) => {
  let [{ operator, inspections }, loading, refetch] = useFetchInspections(inspectionType)

  let [globalSeason] = useStateValue('globalSeason')
  let [selectedDate, setSelectedDate] = useState<DefaultDropdownValueType>(defaultSelectedDate)

  let openReports = useNavigateToInspectionReports()

  let inspectionsList = useMemo(() => {
    let filteredList = inspections.filter((inspection) => {
      if (inspection.status !== InspectionStatus.InProduction) {
        return false
      }

      if (globalSeason && globalSeason.id !== inspection.seasonId) {
        return false
      }

      if (
        selectedDate &&
        selectedDate.value !== 'kaikki' &&
        selectedDate.value !==
          (isPreInspection(inspection) ? inspection.startDate : inspection.season.startDate)
      ) {
        return false
      }

      return true
    })

    return orderBy(filteredList, 'startDate', 'desc')
  }, [inspections, globalSeason, selectedDate])

  let startDateOptions = useMemo(
    () => [
      defaultSelectedDate,
      ...inspectionsList.map((inspection: Inspection) => {
        let startDate =
          (isPreInspection(inspection) ? inspection.startDate : inspection.season.startDate) ||
          ''

        return {
          value: startDate,
          label: getReadableDate(startDate),
        }
      }),
    ],
    [inspectionsList]
  )

  let typeStrings = getInspectionTypeStrings(inspectionType)

  return (
    <InspectionReportIndexPageView>
      <PageTitle loading={loading} onRefresh={refetch}>
        <Text keyValueMap={{ inspection: typeStrings.prefix }}>inspectionReports_heading</Text>
      </PageTitle>
      <PageContainer>
        {!operatorIsValid(operator) && (
          <MessageContainer>
            <MessageView>
              <Text>selectOperator</Text>
            </MessageView>
          </MessageContainer>
        )}
        <LoadingDisplay loading={loading} />
        {inspections.length !== 0 && (
          <>
            <FilterBar>
              <FilterControlGroup>
                <Dropdown
                  label={text('inspectionReports_selectDate')}
                  selectedItem={selectedDate}
                  items={startDateOptions}
                  itemToLabel="label"
                  itemToString="value"
                  onSelect={setSelectedDate}
                />
              </FilterControlGroup>
            </FilterBar>
            <InspectionListWrapper>
              {inspectionsList.map((inspection) => (
                <InspectionIndexItem
                  key={inspection.id}
                  inspection={inspection}
                  onClick={() => openReports(inspection.id, inspectionType)}
                />
              ))}
            </InspectionListWrapper>
          </>
        )}
      </PageContainer>
    </InspectionReportIndexPageView>
  )
})

export default InspectionReportIndexPage
