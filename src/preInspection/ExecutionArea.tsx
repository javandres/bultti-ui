import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useCollectionState } from '../utils/useCollectionState'
import { EquipmentCollection, OperatingArea, OperatingUnit } from '../schema-types'
import { round } from '../utils/round'
import Table from '../common/components/Table'
import { omit } from 'lodash'
import gql from 'graphql-tag'
import EquipmentCatalogue from './EquipmentCatalogue'

const ExecutionRequirementsAreaContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--lighter-grey);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: 0;
  }
`

const TableHeading = styled.h5`
  margin-bottom: 0.5rem;
`

export type AreaPropTypes = {
  area: OperatingArea
  operatingUnits: OperatingUnit[]
}

export const uploadEquipmentCatalogueMutation = gql`
  mutation uploadEquipmentCatalogue(
    $file: Upload
    $inspectionId: String!
    $area: OperatingArea!
  ) {
    uploadEquipmentCatalogue(file: $file, inspectionId: $inspectionId, area: $area) {
      operatorId
      operatingUnit
      make
      model
      type
      count
      seats
      emissionClass
      age
    }
  }
`

const executionRequirementColumnLabels = {
  operatingUnitId: 'Kilpailukohde',
  age: 'Ikä',
  executionMeters: 'Suorite / viikko',
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

const combinedColumnLabels = {
  label: 'Selite',
  ...omit(executionRequirementColumnLabels, ['operatingUnitId', 'age', 'executionMeters']),
}

const ExecutionArea: React.FC<AreaPropTypes> = observer(({ operatingUnits, area }) => {
  const [
    equipment,
    { add: addEquipment, remove: removeEquipment, update: updateEquipment },
  ] = useCollectionState<EquipmentCollection>([])

  const executionRequirements = (operatingUnits || []).map((opUnit) => {
    // noinspection UnnecessaryLocalVariableJS
    const requirementRow = {
      operatingUnitId: opUnit.id,
      age: 7.5,
      executionMeters: `${round((opUnit.weeklyExecutionMeters || 0) / 1000)} km`,
    }

    // TODO: Add uploaded execution equipment data
    /*for (let i = 1; i <= 10; i++) {
        requirementRow[i] = ''
      }*/

    return requirementRow
  })

  const combinedForArea = useMemo(() => {
    const combinedKm = {
      label: 'Km yht',
      total: '0 km',
    }

    const combinedExecutionRequirements = {
      label: 'Vaatimus %',
      total: '0%',
    }

    const combinedSanctionThresholds = {
      label: 'Sanktioraja %',
      total: '',
    }

    for (let i = 1; i <= 10; i++) {
      combinedKm[i] = 0
      combinedExecutionRequirements[i] = '0%'
      combinedSanctionThresholds[i] = '0%'
    }

    return [combinedKm, combinedExecutionRequirements, combinedSanctionThresholds]
  }, [executionRequirements])
  return (
    <ExecutionRequirementsAreaContainer>
      <TableHeading>Ajoneuvot</TableHeading>
      <EquipmentCatalogue
        equipment={equipment}
        addEquipment={addEquipment}
        removeEquipment={removeEquipment}
        updateEquipment={updateEquipment}
      />
      {executionRequirements && (
        <>
          <TableHeading>Kilpailukohteet</TableHeading>
          <Table
            columnLabels={executionRequirementColumnLabels}
            columnOrder={['operatingUnitId']}
            keyFromItem={(item) => item.operatingUnitId}
            items={executionRequirements}
          />
          <TableHeading>Seuranta-alue yhteensä</TableHeading>
          <Table
            columnLabels={combinedColumnLabels}
            columnOrder={['label']}
            items={combinedForArea}
          />
        </>
      )}
    </ExecutionRequirementsAreaContainer>
  )
})

export default ExecutionArea
