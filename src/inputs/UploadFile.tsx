import React, { ChangeEventHandler, useEffect } from 'react'
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
  className?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  value: null | FileList
}

const UploadFile: React.FC<PropTypes> = observer(
  ({ uploader, label = 'Valitse tiedosto', className, onChange, value }) => {
    const [upload, state] = uploader

    useEffect(() => {
      if (value) {
        const firstFile = value[0]

        if (firstFile) {
          upload(firstFile)
        }
      }
    }, [value])

    return (
      <UploadView className={className}>
        {!!state.fetching && <Loading />}
        <UploadLabel htmlFor="upload">{label}</UploadLabel>
        <UploadInput type="file" onChange={onChange} name="upload" />
      </UploadView>
    )
  }
)

export default UploadFile
