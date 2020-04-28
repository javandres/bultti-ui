import React, { CSSProperties, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button } from '../common/components/Button'
import { SERVER_URL } from '../constants'
import { saveAs } from 'file-saver'

export type PropTypes = {
  inspectionId: string
  inspectionType: 'preinspection' | 'postInspection'
  reportName: string
  className?: string
  style?: CSSProperties
}

const DownloadReport = observer(
  ({ className, style, inspectionId, inspectionType, reportName }: PropTypes) => {
    let [loading, setLoading] = useState(false)

    let onDownloadReport = useCallback(async () => {
      setLoading(true)

      let url = `${SERVER_URL}/report/${inspectionType}/${inspectionId}/${reportName}/excel`
      let response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      let contentHeader = response.headers.get('Content-Disposition') || ''
      let regex = /filename="(.+?(?="))/g // Extract filename from header
      let name = (regex.exec(contentHeader) || ['', ''])[1] || 'raportti.xlsx'

      let fileBlob = await response.blob()
      saveAs(fileBlob, name)

      setLoading(false)
    }, [inspectionId, inspectionType, reportName])

    return (
      <Button loading={loading} className={className} style={style} onClick={onDownloadReport}>
        Download excel
      </Button>
    )
  }
)

export default DownloadReport
