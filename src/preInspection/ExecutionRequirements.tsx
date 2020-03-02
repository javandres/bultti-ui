import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useUploader } from '../utils/useUploader'
import gql from 'graphql-tag'
import UploadFile from '../common/inputs/UploadFile'
import { ExecutionEquipment, OperatingArea, OperatingUnit } from '../schema-types'
import Table from '../common/components/Table'
import { FlexRow, FormMessage } from '../common/components/common'
import { Button } from '../common/components/Button'
import { get, groupBy } from 'lodash'
import { useQueryData } from '../utils/useQueryData'
import { operatingUnitQuery } from '../queries/operatingUnitsQuery'

const ExecutionRequirementsView = styled.div``
const ExecutionRequirementsAreaContainer = styled.div``

const AreaHeading = styled.h4`
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
      preInspectionId
      area
      operatorId
      operatingUnit
      class
      brand
      model
      type
      amount
      ratio
      seats
      emissionClass
      soundLevel
    }
  }
`

const executionRequirementColumnLabels = {
  operatingUnitId: 'Kilpailukohde',
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
}

const ExecutionRequirementsArea: React.FC<AreaPropTypes> = observer(
  ({ operatingUnits, area }) => {
    const [uploadValue, setUploadValue] = useState<File[]>([])

    const uploader = useUploader<ExecutionEquipment[]>(uploadEquipmentCatalogueMutation, {
      variables: {
        inspectionId: '123',
        area,
      },
    })

    const [, { data: equipmentData }] = uploader

    const onReset = useCallback(() => {
      setUploadValue([])
    }, [])

    const executionRequirements = (operatingUnits || []).map((opUnit) => {
      const requirementRow = { operatingUnitId: opUnit.id }

      // TODO: Add uploaded execution equipment data

      for (let i = 1; i <= 10; i++) {
        requirementRow[i] = ''
      }

      return requirementRow
    })

    return (
      <ExecutionRequirementsAreaContainer>
        <UploadFile
          label="Valitse kalustoluettelo"
          uploader={uploader}
          value={uploadValue}
          onChange={setUploadValue}
        />
        {equipmentData && (
          <FlexRow style={{ marginBottom: '1rem' }}>
            <ResetButton onClick={onReset}>Reset</ResetButton>
          </FlexRow>
        )}
        {equipmentData && <Table items={equipmentData} />}
        {executionRequirements && (
          <Table
            columnLabels={executionRequirementColumnLabels}
            columnOrder={['operatingUnitId']}
            keyFromItem={(item) => item.operatingUnitId}
            items={executionRequirements}
          />
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
