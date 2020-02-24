import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Loading from '../components/Loading'
import { useDropzone } from 'react-dropzone'
import { CircleCheckmark } from '../icons/CircleCheckmark'

const UploadView = styled.div`
  margin: 0.5rem 0;
`

const UploadInput = styled.input``

const UploadWrapper = styled.div<{ backgroundColor?: string }>`
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 1rem;
  background: ${(p) => p.backgroundColor || 'var(--lighter-blue)'};
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
  display: flex;
  align-items: center;
  font-weight: bold;

  svg {
    margin-right: 0.5rem;
  }
`

export type PropTypes = {
  uploader: any // (file: File, variables?: { [key: string]: any }) => void
  label?: string
  className?: string
  onChange: (files: File[]) => void
  value: File[]
}

const UploadFile: React.FC<PropTypes> = observer(
  ({ uploader, label = 'Valitse tiedosto', className, onChange, value }) => {
    const [upload, state] = uploader

    useEffect(() => {
      if (value && value.length !== 0) {
        const firstFile = value[0]

        if (firstFile) {
          upload(firstFile)
        }
      } else {
        upload(null)
      }
    }, [value])

    const onDrop = useCallback(
      (acceptedFiles) => {
        onChange([...acceptedFiles])
      },
      [onChange]
    )

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      multiple: false,
      preventDropOnDocument: true,
    })

    return (
      <UploadView className={className}>
        {!!state.fetching && <Loading />}
        <UploadWrapper
          {...getRootProps({
            backgroundColor: state.error
              ? 'var(--light-red)'
              : state.data && state.data.length !== 0
              ? 'var(--lighter-green)'
              : 'var(--lighter-blue)',
          })}>
          <UploadInput {...getInputProps()} />
          {value.length !== 0 ? (
            <CurrentFile>
              <CircleCheckmark width="1.5rem" height="1.5rem" />
              {value[0].name}
            </CurrentFile>
          ) : (
            <>
              <LabelText>{label}</LabelText>
              <InstructionText>Vedä tiedosto tähän tai valitse klikkaamalla.</InstructionText>
            </>
          )}
        </UploadWrapper>
      </UploadView>
    )
  }
)

export default UploadFile
