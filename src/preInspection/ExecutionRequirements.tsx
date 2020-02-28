import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useUploader } from '../utils/useUploader'
import gql from 'graphql-tag'
import UploadFile from '../common/inputs/UploadFile'
import { ExecutionEquipment, OperatingArea, OperatingUnit } from '../schema-types'
import Table from '../common/components/Table'
import { FlexRow } from '../common/components/common'
import { Button } from '../common/components/Button'

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
}

const uploadEquipmentCatalogueMutation = gql`
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

const ExecutionRequirementsArea: React.FC<AreaPropTypes> = observer(({ area }) => {
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

  return (
    <ExecutionRequirementsAreaContainer>
      <UploadFile
        label="Valitse kalustoluettelo"
        uploader={uploader}
        value={uploadValue}
        onChange={setUploadValue}
      />
      {equipmentData && (
        <FlexRow>
          <ResetButton onClick={onReset}>Reset</ResetButton>
        </FlexRow>
      )}
      {equipmentData && <Table items={equipmentData} />}
    </ExecutionRequirementsAreaContainer>
  )
})

const ExecutionRequirements: React.FC<PropTypes> = observer(({operatingUnits}) => {
  console.log(operatingUnits)

  return (
    <ExecutionRequirementsView>
      <AreaHeading>Keskusta</AreaHeading>
      <ExecutionRequirementsArea area={OperatingArea.Center} />
      <AreaHeading>Muu</AreaHeading>
      <ExecutionRequirementsArea area={OperatingArea.Other} />
    </ExecutionRequirementsView>
  )
})

export default ExecutionRequirements
