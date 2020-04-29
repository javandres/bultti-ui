import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { usePreInspections } from '../preInspection/preInspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Page, PageTitle } from '../common/components/common'
import { RouteComponentProps } from '@reach/router'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { ControlGroup } from '../common/components/form'
import { useStateValue } from '../state/useAppState'
import { Season } from '../schema-types'
import SelectSeason from '../common/input/SelectSeason'
import { LoadingDisplay } from '../common/components/Loading'
import Dropdown from '../common/input/Dropdown'

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

export type PropTypes = RouteComponentProps

const PreInspectionReportIndexPage: React.FC<PropTypes> = observer(() => {
  let [{ operator, preInspections }, loading, refetch] = usePreInspections()

  let [globalSeason] = useStateValue('globalSeason')

  let [selectedSeason, setSelectedSeason] = useState<Season | null>(globalSeason)
  let [selectedDate, setSelectedDate] = useState<string>('Kaikki')

  useEffect(() => {
    setSelectedSeason(globalSeason)
  }, [globalSeason])

  let startDateOptions = useMemo(() => ['Kaikki', ...preInspections.map((p) => p.startDate)], [
    preInspections,
  ])

  console.log(startDateOptions)

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
      )}
    </PreInspectionReportIndexPageView>
  )
})

export default PreInspectionReportIndexPage
