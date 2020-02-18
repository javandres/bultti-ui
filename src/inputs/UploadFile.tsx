import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Loading from '../components/Loading'

const UploadView = styled.div``

const UploadInput = styled.input`
  display: block;
  margin-top: 1rem;
`

const UploadLabel = styled.label`
  display: block;
`

type OnLoadingFunc = (loading: boolean) => void

export type PropTypes = {
  uploader: any // (file: File, variables?: { [key: string]: any }) => void
  label?: string
}

const UploadFile: React.FC<PropTypes> = observer(
  ({ uploader, label = 'Valitse tiedosto' }) => {
    const [upload, state] = uploader

    const onFileChange = useCallback((e) => {
      const file = e.target.files[0]

      if (file) {
        upload(file)
      }
    }, [])

    return (
      <UploadView>
        {!!state.fetching && <Loading />}
        <UploadLabel htmlFor="upload">{label}</UploadLabel>
        <UploadInput type="file" onChange={onFileChange} name="upload" />
      </UploadView>
    )
  }
)

export default UploadFile
