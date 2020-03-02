import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import UploadFile from '../common/inputs/UploadFile'
import readExcelFile from 'read-excel-file'

const EquipmentCatalogueView = styled.div``

export type PropTypes = {}

const ParseEquipmentCatalogue: React.FC<PropTypes> = observer(() => {
  const [fileValue, setFileValue] = useState<File[]>([])

  useEffect(() => {
    if (fileValue[0]) {
      readExcelFile(fileValue[0]).then((rows) => {
        let headers = []
      })
    }
  }, [fileValue])

  return (
    <EquipmentCatalogueView>
      <UploadFile label="Valitse kalustoluettelo" value={fileValue} onChange={setFileValue} />
    </EquipmentCatalogueView>
  )
})

export default ParseEquipmentCatalogue
