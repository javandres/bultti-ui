import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { usePostInspectionBaseRequirements } from './executionRequirementUtils'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'
import Dropdown from '../common/input/Dropdown'
import { addWeeks, eachWeekOfInterval, format, parseISO } from 'date-fns'
import { FlexRow } from '../common/components/common'
import { READABLE_DATE_FORMAT } from '../constants'

const PostInspectionExecutionRequirementsView = styled.div`
  min-height: 300px;
`

export type PropTypes = {}

type WeekOption = { id: number; label: string }

const PostInspectionExecutionRequirements = observer(({}: PropTypes) => {
  const inspection = useContext(InspectionContext)
  let [currentWeek, setCurrentWeek] = useState(0)

  let { data: baseRequirements, loading, refetch } = usePostInspectionBaseRequirements(
    inspection?.id
  )

  let weekOptions = useMemo((): WeekOption[] => {
    if (!inspection) {
      return []
    }

    let inspectionPeriodInterval: Interval = {
      start: parseISO(inspection.inspectionStartDate),
      end: parseISO(inspection.inspectionEndDate),
    }

    let weeksInInspectionPeriod = eachWeekOfInterval(inspectionPeriodInterval, {
      weekStartsOn: 1,
    })

    return weeksInInspectionPeriod.map((weekStart, index) => ({
      id: index,
      label: `${index + 1}. ${format(weekStart, READABLE_DATE_FORMAT)} - ${format(
        addWeeks(weekStart, 1),
        READABLE_DATE_FORMAT
      )}`,
    }))
  }, [inspection])

  return (
    <ExpandableSection
      headerContent={
        <>
          <HeaderMainHeading>Suoritevaatimukset</HeaderMainHeading>
          <HeaderSection style={{ padding: '0.5rem 0.75rem', justifyContent: 'center' }}>
            {baseRequirements?.length !== 0 && (
              <Button
                loading={loading}
                style={{ marginLeft: 'auto' }}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSize.SMALL}
                onClick={refetch}>
                Päivitä
              </Button>
            )}
          </HeaderSection>
        </>
      }>
      <PostInspectionExecutionRequirementsView>
        <FlexRow>
          <Dropdown
            items={weekOptions}
            selectedItem={weekOptions.find((week) => week.id === currentWeek)}
            onSelect={(selected) => setCurrentWeek(selected.id)}
          />
        </FlexRow>
      </PostInspectionExecutionRequirementsView>
    </ExpandableSection>
  )
})

export default PostInspectionExecutionRequirements
