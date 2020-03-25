import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { groupBy } from 'lodash'
import { round } from '../util/round'
import Table from '../common/components/Table'
import { isNumeric } from '../util/isNumeric'
import { EquipmentQuotaGroup } from '../equipmentCatalogue/equipmentUtils'
import ValueDisplay from '../common/components/ValueDisplay'

const ExecutionRequirementsAreaContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
  }
`

export type PropTypes = {
  equipmentGroups: EquipmentQuotaGroup[]
  weeklyMeters: number
}

const requirementColumnLabels = {
  unit: 'Yksikkö',
  '1': 'Euro 3',
  '2': 'Euro 4',
  '3': 'Euro 3 CNG',
  '4': 'Euro 5',
  '5': 'EEV Di',
  '6': 'EEV eteho.',
  '7': 'EEV CNG',
  '8': 'Euro 6',
  '9': 'Euro 6 eteho.',
  '10': 'Sähkö',
  total: 'Yhteensä',
}

const RequirementsTable: React.FC<PropTypes> = observer(({ equipmentGroups, weeklyMeters }) => {
  let emissionClassGroups = useMemo(() => groupBy(equipmentGroups, 'emissionClass'), [
    equipmentGroups,
  ])

  const classRequirements = useMemo(
    () =>
      Object.entries(emissionClassGroups).map(([emissionClass, equipment]) => {
        const combinedPercentage: number = equipment.reduce(
          (total: number, { percentageQuota }) => (total += percentageQuota),
          0
        )

        const meters = round(weeklyMeters * (combinedPercentage / 100))

        return {
          emissionClass: parseInt(emissionClass, 10),
          meters,
          percentageQuota: combinedPercentage,
        }
      }),
    [emissionClassGroups, weeklyMeters]
  )

  let requirementRows = useMemo(() => {
    let meterRow = { unit: 'meters', total: 0 }
    let percentageRow = { unit: 'percentage', total: 0 }

    for (let i = 1; i <= 10; i++) {
      let currentRequirement = classRequirements.find((req) => req.emissionClass === i)

      meterRow[i] = currentRequirement?.meters || 0
      percentageRow[i] = currentRequirement?.percentageQuota || 0
    }

    meterRow.total = classRequirements.reduce(
      (total, { meters }) => (total += meters),
      meterRow.total
    )

    percentageRow.total = classRequirements.reduce(
      (total, { percentageQuota }) => (total += percentageQuota),
      percentageRow.total
    )

    return [meterRow, percentageRow]
  }, [classRequirements])

  let requirementValues = useMemo(() => {
    let combinedAge = equipmentGroups.reduce((total, { age }) => (total += age), 0)
    let combinedAgeWeighted = equipmentGroups.reduce(
      (total, { age, percentageQuota }) => (total += age * (percentageQuota / 100)),
      0
    )

    return {
      averageAge: round(combinedAge / equipmentGroups.length),
      averageAgeWeighted: round(combinedAgeWeighted / equipmentGroups.length),
    }
  }, [equipmentGroups])

  return (
    <ExecutionRequirementsAreaContainer>
      <ValueDisplay
        style={{ marginBottom: '1rem' }}
        item={requirementValues}
        labels={{ averageAge: 'Keski-ikä', averageAgeWeighted: 'Painotettu keski-ikä' }}
      />
      <Table
        items={requirementRows}
        columnLabels={requirementColumnLabels}
        columnOrder={['unit']}
        renderValue={(val, key, isHeader = false, item) => {
          if (isHeader || ['unit'].includes(key || '') || !isNumeric(val) || val === 0) {
            return val
          }

          let unit = item.unit === 'percentage' ? '%' : 'km'
          let useVal = item.unit === 'meters' ? round(val / 1000) : val
          return useVal + ' ' + unit
        }}
      />
    </ExecutionRequirementsAreaContainer>
  )
})

export default RequirementsTable
