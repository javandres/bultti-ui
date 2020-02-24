import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Loading from '../components/Loading'
import { useDropzone } from 'react-dropzone'
import { Button } from '../components/Button'

const UploadView = styled.div`
  margin: 0.5rem 0;
`

const UploadInput = styled.input``

const UploadWrapper = styled.div`
  display: block;
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 1rem;
  background: var(--lighter-blue);
  outline: none;
`

const LabelText = styled.span`
  display: block;
`

const InstructionText = styled.span`
  font-size: 0.875rem;
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid var(--blue);
  border-radius: 1rem;
`

const CurrentFile = styled.span`
  display: block;
`

export type PropTypes = {
  uploader: any // (file: File, variables?: { [key: string]: any }) => void
  label?: string
  className?: string
  onChange: (files: File[]) => void
  onReset?: () => void
  value: File[]
}

const UploadFile: React.FC<PropTypes> = observer(
  ({ uploader, label = 'Valitse tiedosto', className, onChange, value, onReset }) => {
    const [upload, state] = uploader

    useEffect(() => {
      if (value) {
        const firstFile = value[0]

        if (firstFile) {
          upload(firstFile)
        }
      }
    }, [value])

    const onDrop = useCallback(
      (acceptedFiles) => {
        onChange([...acceptedFiles])
      },
      [onChange]
    )

    const onResetFiles = useCallback(() => {
      onChange([])
      upload(null)

      if (onReset) {
        onReset()
      }
    }, [onChange, onReset])

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      multiple: false,
      preventDropOnDocument: true,
    })

    return (
      <UploadView className={className}>
        {!!state.fetching && <Loading />}
        <UploadWrapper {...getRootProps()}>
          <UploadInput {...getInputProps()} />
          {value.length !== 0 ? (
            <CurrentFile>{value[0].name}</CurrentFile>
          ) : (
            <LabelText>{label}</LabelText>
          )}
          <InstructionText>Vedä tiedosto tähän tai valitse klikkaamalla.</InstructionText>
        </UploadWrapper>
        {value.length !== 0 && <Button onClick={onResetFiles}>Reset</Button>}
      </UploadView>
    )
  }
)

export default UploadFile
