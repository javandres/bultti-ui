import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { usePreInspectionReports, usePreInspections } from '../preInspection/inspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Page } from '../common/components/common'
import { RouteComponentProps } from '@reach/router'
import { ControlGroup } from '../common/components/form'
import { useStateValue } from '../state/useAppState'
import { InspectionStatus, Season } from '../schema-types'
import SelectSeason from '../common/input/SelectSeason'
import { LoadingDisplay } from '../common/components/Loading'
import Dropdown from '../common/input/Dropdown'
import { format, parseISO } from 'date-fns'
import { READABLE_DATE_FORMAT } from '../constants'
import { ArrowRight } from '../common/icon/ArrowRight'
import { orderBy } from 'lodash'
import DateRangeDisplay from '../common/components/DateRangeDisplay'
import { PageTitle } from '../common/components/PageTitle'

const PreInspectionReportIndexPageView = styled(Page)``

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

const GoToReportsButton = styled.div`
  background: transparent;
  border: 0;
  flex: 0;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  border-top-right-radius: 0.5rem;
  margin-left: auto;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
`

const PreInspectionListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`

const PreInspectionTitle = styled.h4`
  margin: 0 1rem 0 0;
`

const PreInspectionDates = styled(DateRangeDisplay)``

const PreInspectionListItem = styled.button`
  font-family: inherit;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--lighter-grey);
  padding: 1rem 0.5rem 1rem 1rem;
  margin-bottom: 1rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--dark-grey);
  transform: scale(1);
  transition: all 0.1s ease-out;

  &:hover {
    background-color: #fafafa;
    transform: ${({ disabled = false }) => (!disabled ? 'scale(1.01)' : 'scale(1)')};
  }
`

const InspectionVersion = styled.div`
  padding: 0.2rem 0.6rem;
  width: 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  background: var(--lighter-grey);
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  user-select: none;
`

const defaultSelectedDate = { label: 'Kaikki', value: 'kaikki' }

export type PropTypes = RouteComponentProps

const PreInspectionReportIndexPage: React.FC<PropTypes> = observer(() => {
  let [{ operator, inspections }, loading, refetch] = usePreInspections()

  let [globalSeason] = useStateValue('globalSeason')

  let [selectedSeason, setSelectedSeason] = useState<Season | null>(globalSeason)
  let [selectedDate, setSelectedDate] = useState<{ value: string; label: string }>(
    defaultSelectedDate
  )

  useEffect(() => {
    setSelectedSeason(globalSeason)
  }, [globalSeason])

  let openReports = usePreInspectionReports()

  let inspectionsList = useMemo(() => {
    let filteredList = inspections.filter((p) => {
      if (p.status !== InspectionStatus.InProduction) {
        return false
      }

      if (
        selectedSeason &&
        selectedSeason.id !== 'Kaikki' &&
        selectedSeason.id !== p.seasonId
      ) {
        return false
      }

      if (
        selectedDate &&
        selectedDate.value !== 'kaikki' &&
        selectedDate.value !== p.startDate
      ) {
        return false
      }

      return true
    })

    return orderBy(filteredList, 'startDate', 'desc')
  }, [inspections, selectedSeason, selectedDate])

  let startDateOptions = useMemo(
    () => [
      defaultSelectedDate,
      ...inspectionsList.map((p) => ({
        value: p.startDate,
        label: format(parseISO(p.startDate), READABLE_DATE_FORMAT),
      })),
    ],
    [inspectionsList]
  )

  return (
    <PreInspectionReportIndexPageView>
      <PageTitle loading={loading} onRefresh={refetch}>
        Ennakkotarkastuksien raportit
      </PageTitle>
      {!operator && (
        <MessageContainer>
          <MessageView>Valitse liikennöitsijä.</MessageView>
        </MessageContainer>
      )}
      <LoadingDisplay loading={loading} />
      {inspections.length !== 0 && (
        <>
          <FilterBar>
            <FilterControlGroup>
              <SelectSeason
                enableAll={true}
                label="Valitse aikataulukausi"
                onSelect={setSelectedSeason}
                value={selectedSeason}
              />
            </FilterControlGroup>
            <FilterControlGroup>
              <Dropdown
                label="Valitse tuotantopäivämäärä"
                selectedItem={selectedDate}
                items={startDateOptions}
                itemToLabel="label"
                itemToString="value"
                onSelect={setSelectedDate}
              />
            </FilterControlGroup>
          </FilterBar>
          <PreInspectionListWrapper>
            {inspectionsList.map((inspection) => (
              <PreInspectionListItem
                key={inspection.id}
                onClick={() => openReports(inspection.id)}>
                <InspectionVersion>{inspection.version}</InspectionVersion>
                <PreInspectionTitle>
                  {inspection.operator.operatorName} / {inspection.seasonId}
                </PreInspectionTitle>
                <PreInspectionDates
                  startDate={inspection.startDate}
                  endDate={inspection.endDate}
                />
                <GoToReportsButton>
                  <ArrowRight fill="var(--blue)" width="1.5rem" height="1.5rem" />
                </GoToReportsButton>
              </PreInspectionListItem>
            ))}
          </PreInspectionListWrapper>
        </>
      )}
    </PreInspectionReportIndexPageView>
  )
})

export default PreInspectionReportIndexPage
