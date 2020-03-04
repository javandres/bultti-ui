import { useEffect, useState } from 'react'
import readExcelFile from 'read-excel-file'
import { equipmentRowsNet } from '../common/neuralnets/equipmentRows'
import { toString } from 'lodash'

const getEquipmentRows = () => {
  const net = equipmentRowsNet()

  return (rows) => {
    return rows.map((row) => net.run(row.map((val) => toString(val))))
  }
}

export const useEquipmentCatalogueParser = (file: File | null) => {
  const [parsedData, setParsedData] = useState<any[]>([])

  useEffect(() => {
    if (file) {
      const equipmentRowsParser = getEquipmentRows()

      readExcelFile(file, { getSheets: true })
        .then((sheets) => {
          console.log(sheets)
          return Promise.all(sheets.map(({ name }) => readExcelFile(file, { sheet: name })))
        })
        .then((sheets) => {
          const equipmentRows = sheets.map((rows) => equipmentRowsParser(rows))
          console.log(equipmentRows)
        })
    }
  }, [file])

  return parsedData
}
