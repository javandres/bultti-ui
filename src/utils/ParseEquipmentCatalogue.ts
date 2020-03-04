import { useEffect, useState } from 'react'
import readExcelFile from 'read-excel-file'

export const useEquipmentCatalogue = (file: File[]) => {
  const [parsedData, setParsedData] = useState<any[]>([])

  useEffect(() => {
    if (file[0]) {
      readExcelFile(file[0]).then((rows) => {
        let headers = []
      })
    }
  }, [file])

  return parsedData
}
