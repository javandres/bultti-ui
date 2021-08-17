import React, { CSSProperties, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { SERVER_URL } from '../constants'
import { saveAs } from 'file-saver'
import { Text } from '../util/translate'
import styled from 'styled-components/macro'
import { getAuthToken } from '../util/authToken'
import { InspectionType } from '../schema-types'

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

      // Require status 200 for the download. If the report is empty, the status
      // will be 204 but the "ok" will still be true.
      if (response.ok && response.status === 200) {
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
            <Text>downloadExcelRaport</Text>
          </Button>
        )}
      </DownloadWrapper>
    )
  }
)

export default DownloadReport
