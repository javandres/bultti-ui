import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import {
  getInspectionTypeStrings,
  useFetchInspections,
  useInspectionReports,
} from '../inspection/inspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Page } from '../common/components/common'
import { RouteComponentProps } from '@reach/router'
import { ControlGroup } from '../common/components/form'
import { useStateValue } from '../state/useAppState'
import { InspectionStatus, InspectionType, Season } from '../schema-types'
import SelectSeason from '../common/input/SelectSeason'
import { LoadingDisplay } from '../common/components/Loading'
import Dropdown from '../common/input/Dropdown'
import { orderBy } from 'lodash'
import { PageTitle } from '../common/components/PageTitle'
import InspectionIndexItem from '../inspection/InspectionIndexItem'
import { getReadableDate } from '../util/formatDate'

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
  padding: 0 1rem;
`

const defaultSelectedDate = { label: 'Kaikki', value: 'kaikki' }

export type PropTypes = {
  inspectionType: InspectionType
} & RouteComponentProps

const InspectionReportIndexPage: React.FC<PropTypes> = observer(({ inspectionType }) => {
  let [{ operator, inspections }, loading, refetch] = useFetchInspections(inspectionType)

  let [globalSeason] = useStateValue('globalSeason')

  let [selectedSeason, setSelectedSeason] = useState<Season | null>(globalSeason)
  let [selectedDate, setSelectedDate] = useState<{ value: string; label: string }>(
    defaultSelectedDate
  )

  useEffect(() => {
    setSelectedSeason(globalSeason)
  }, [globalSeason])

  let openReports = useInspectionReports()

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
        label: getReadableDate(p.startDate),
      })),
    ],
    [inspectionsList]
  )

  let typeStrings = getInspectionTypeStrings(inspectionType)

  return (
    <InspectionReportIndexPageView>
      <PageTitle loading={loading} onRefresh={refetch}>
        {typeStrings.prefix}tarkastuksien raportit
      </PageTitle>
      {!operator && (
        <MessageContainer>
          <MessageView>Valitse liikennöitsijä.</MessageView>
        </MessageContainer>
      )}
      <LoadingDisplay loading={loading} />
      {inspections.length !== 0 && (
        <>
          <FilterBar style={{ margin: '1rem' }}>
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
    </InspectionReportIndexPageView>
  )
})

export default InspectionReportIndexPage
