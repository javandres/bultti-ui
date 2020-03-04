import { useEffect, useState } from 'react'
import readExcelFile from 'read-excel-file'

export const useEquipmentCatalogueParser = (file: File | null) => {
  const [parsedData, setParsedData] = useState<any[]>([])

  useEffect(() => {
    if (file) {
      readExcelFile(file).then((rows) => {
        let headers = []
      })
    }
  }, [file])

  return parsedData
}
