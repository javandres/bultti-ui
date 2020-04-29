import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import {
  usePreInspectionReports,
  usePreInspections,
} from '../preInspection/preInspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Page, PageTitle } from '../common/components/common'
import { RouteComponentProps } from '@reach/router'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
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

const StartDate = styled.span`
  margin-right: 0.75rem;
  display: inline-block;
  font-size: 1rem;

  &:after {
    content: '➔';
    display: inline-block;
    margin-left: 0.75rem;
  }
`

const EndDate = styled(StartDate)`
  &:after {
    content: '';
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

const PreInspectionDates = styled.div``

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
  transition: transform 0.1s ease-out;

  &:hover {
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

export type PropTypes = RouteComponentProps

const PreInspectionReportIndexPage: React.FC<PropTypes> = observer(() => {
  let [{ operator, preInspections }, loading, refetch] = usePreInspections()

  let [globalSeason] = useStateValue('globalSeason')

  let [selectedSeason, setSelectedSeason] = useState<Season | null>(globalSeason)
  let [selectedDate, setSelectedDate] = useState<string>('Kaikki')

  useEffect(() => {
    setSelectedSeason(globalSeason)
  }, [globalSeason])

  let startDateOptions = useMemo(
    () => [
      'Kaikki',
      ...preInspections
        .filter((p) => p.status === InspectionStatus.InProduction)
        .map((p) => p.startDate),
    ],
    [preInspections]
  )

  let openReports = usePreInspectionReports()

  let preInspectionsList = useMemo(() => {
    console.log(selectedSeason, selectedDate)

    let filteredList = preInspections.filter((p) => {
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

      if (selectedDate && selectedDate !== 'Kaikki' && selectedDate !== p.startDate) {
        return false
      }

      return true
    })

    return orderBy(filteredList, 'startDate', 'desc')
  }, [preInspections, selectedSeason, selectedDate])

  return (
    <PreInspectionReportIndexPageView>
      <PageTitle>
        Ennakkotarkastuksien raportit
        <Button
          style={{ marginLeft: 'auto' }}
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSize.SMALL}
          onClick={refetch}>
          Päivitä
        </Button>
      </PageTitle>
      {!operator && (
        <MessageContainer>
          <MessageView>Valitse liikennöitsijä.</MessageView>
        </MessageContainer>
      )}
      <LoadingDisplay loading={loading} />
      {preInspections.length !== 0 && (
        <>
          <FilterBar>
            <FilterControlGroup>
              <SelectSeason
                enableAll={true}
                label="Aikataulukausi"
                onSelect={setSelectedSeason}
                value={selectedSeason}
              />
            </FilterControlGroup>
            <FilterControlGroup>
              <Dropdown
                label="Valitse tuotantopäivämäärä"
                selectedItem={selectedDate}
                items={startDateOptions}
                onSelect={setSelectedDate}
              />
            </FilterControlGroup>
          </FilterBar>
          <PreInspectionListWrapper>
            {preInspectionsList.map((preInspection) => (
              <PreInspectionListItem
                key={preInspection.id}
                onClick={() => openReports(preInspection.id)}>
                <InspectionVersion>{preInspection.version}</InspectionVersion>
                <PreInspectionTitle>
                  {preInspection.operator.operatorName} / {preInspection.seasonId}
                </PreInspectionTitle>
                <PreInspectionDates>
                  <StartDate>
                    {format(parseISO(preInspection.startDate), READABLE_DATE_FORMAT)}
                  </StartDate>
                  <EndDate>
                    {format(parseISO(preInspection.endDate), READABLE_DATE_FORMAT)}
                  </EndDate>
                </PreInspectionDates>
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
