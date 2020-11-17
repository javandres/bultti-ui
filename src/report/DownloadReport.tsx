import React, { CSSProperties, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { SERVER_URL } from '../constants'
import { saveAs } from 'file-saver'
import styled from 'styled-components'
import { InspectionType } from '../schema-types'
import { getAuthToken } from '../util/authToken'

const DownloadWrapper = styled.div`
  position: relative;
`

const ErrorButton = styled(Button).attrs(() => ({
  size: ButtonSize.MEDIUM,
  buttonStyle: ButtonStyle.SECONDARY,
}))`
  background: var(--lighter-red);
  border: 1px solid var(--light-red);
  color: var(--red);
`

export type PropTypes = {
  inspectionId: string
  inspectionType: InspectionType
  reportName: string
  className?: string
  style?: CSSProperties
}

const DownloadReport = observer(
  ({ className, style, inspectionId, inspectionType, reportName }: PropTypes) => {
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState('')

    let onDownloadReport = useCallback(async () => {
      setLoading(true)

      let url = `${SERVER_URL}/reports/${inspectionId}/${reportName}/excel`
      const token = getAuthToken()

      let response = await fetch(url, {
        method: 'GET',
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      })

      if (response.ok) {
        let contentHeader = response.headers.get('Content-Disposition') || ''
        let regex = /filename="(.+?(?="))/g // Extract filename from header
        let name = (regex.exec(contentHeader) || ['', ''])[1] || 'raportti.xlsx'

        let fileBlob = await response.blob()
        saveAs(fileBlob, name)
      } else {
        let errorText = response.statusText
        setError(`${response.status} - ${errorText}`)
      }

      setLoading(false)
    }, [inspectionId, inspectionType, reportName])

    return (
      <DownloadWrapper className={className} style={style}>
        {error ? (
          <ErrorButton onClick={() => setError('')}>{error}</ErrorButton>
        ) : (
          <Button loading={loading} onClick={onDownloadReport}>
            Download excel
          </Button>
        )}
      </DownloadWrapper>
    )
  }
)

export default DownloadReport
