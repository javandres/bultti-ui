import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import gql from 'graphql-tag'
import { EquipmentCollection, OperatingArea, OperatingUnit } from '../schema-types'
import Table, { CellContent } from '../common/components/Table'
import { FlexRow, FormMessage } from '../common/components/common'
import { Button } from '../common/components/Button'
import { get, groupBy, omit } from 'lodash'
import { round } from '../utils/round'
import UploadFile from '../common/inputs/UploadFile'
import { useEquipmentCatalogue } from '../utils/ParseEquipmentCatalogue'
import EquipmentCollectionInput from './EquipmentCollectionInput'
import { useCollectionState } from '../utils/useCollectionState'

const ExecutionRequirementsView = styled.div``
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

const AreaHeading = styled.h4`
  margin-bottom: 0.5rem;
`

const TableHeading = styled.h5`
  margin-bottom: 0.5rem;
`

const ResetButton = styled(Button)`
  margin-left: auto;
`

export type PropTypes = {
  operatingUnits: OperatingUnit[] | null
}

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

const createEquipmentKey = (e: EquipmentCollection) =>
  !(e?.make && e?.model && e?.emissionClass && e?.type)
    ? null
    : `${e?.make}${e?.model}${e.emissionClass}${e.type}`

const ExecutionRequirementsArea: React.FC<AreaPropTypes> = observer(
  ({ operatingUnits, area }) => {
    const [uploadValue, setUploadValue] = useState<File[]>([])

    const [equipment, { add: addEquipment, update: updateEquipment }] = useCollectionState<
      EquipmentCollection
    >([])

    const equipmentCatalogue = useEquipmentCatalogue(uploadValue)

    const onReset = useCallback(() => {
      setUploadValue([])
    }, [])

    useEffect(() => {
      if (equipment.some(({ id }) => id === 'new')) {
        return
      }

      const inputRow: { _editable: boolean } & EquipmentCollection = {
        _editable: true,
        id: 'new',
        make: '',
        model: '',
        type: '',
        count: 0,
        seats: 0,
        emissionClass: '',
        age: 0,
      }

      addEquipment(inputRow)
    }, [equipment, addEquipment, equipmentCatalogue])

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

    const onEquipmentInputChange = useCallback(
      (item) => (nextValue, key) => {
        const onEdit = (nextItem) => {
          if (nextItem.id === 'new') {
            nextItem['id'] = createEquipmentKey(nextItem) || 'new'
          }

          return nextItem
        }

        updateEquipment(item, key, nextValue, onEdit)
      },
      [updateEquipment]
    )

    const renderEquipmentCell = useCallback(
      (val, key, item) =>
        item?._editable ? (
          <EquipmentCollectionInput
            value={val}
            valueName={key}
            onChange={onEquipmentInputChange(item)}
          />
        ) : (
          <CellContent>{val}</CellContent>
        ),
      []
    )

    return (
      <ExecutionRequirementsAreaContainer>
        <TableHeading>Ajoneuvot</TableHeading>
        <UploadFile
          label="Lisää kalustoluettelosta"
          value={uploadValue}
          onChange={setUploadValue}
        />
        {uploadValue && uploadValue.length !== 0 && (
          <FlexRow style={{ marginBottom: '1rem' }}>
            <ResetButton onClick={onReset}>Reset</ResetButton>
          </FlexRow>
        )}
        <Table items={equipment} renderCell={renderEquipmentCell} />
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
  }
)

const ExecutionRequirements: React.FC<PropTypes> = observer(({ operatingUnits = [] }) => {
  const areaUnits = groupBy(operatingUnits, 'operatingArea')

  return (
    <ExecutionRequirementsView>
      {operatingUnits?.length === 0 && (
        <FormMessage>
          Valitulla liikennöitsijällä ei ole voimassa-olevia kilpailukohteita.
        </FormMessage>
      )}
      {get(areaUnits, OperatingArea.Center, []).length !== 0 && (
        <>
          <AreaHeading>Keskusta</AreaHeading>
          <ExecutionRequirementsArea
            operatingUnits={areaUnits[OperatingArea.Center]}
            area={OperatingArea.Center}
          />
        </>
      )}
      {get(areaUnits, OperatingArea.Other, []).length !== 0 && (
        <>
          <AreaHeading>Muu</AreaHeading>
          <ExecutionRequirementsArea
            operatingUnits={areaUnits[OperatingArea.Other]}
            area={OperatingArea.Center}
          />
        </>
      )}
    </ExecutionRequirementsView>
  )
})

export default ExecutionRequirements
