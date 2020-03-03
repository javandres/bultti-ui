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

const UploadWrapper = styled.div<{ hasData?: boolean; backgroundColor?: string }>`
  position: relative;
  padding: ${(p) => (p.hasData ? '1rem' : '2rem 1rem')};
  margin-bottom: 1rem;
  border-radius: 1rem;
  background: ${(p) => p.backgroundColor || 'var(--lightest-blue)'};
  outline: none;
`

const LabelText = styled.span`
  padding: 0.4rem 1rem 0.4rem;
  margin-right: 1rem;
  background: transparent;
  color: var(--blue);
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  flex: 0 0 auto;
  cursor: pointer;
  letter-spacing: -0.6px;
  border-radius: 2.5rem;
  border: 1px solid var(--blue);
  transform: scale(1);
  transition: transform 0.1s ease-out;

  &:hover {
    transform: scale(1.025);
  }
`

const InstructionText = styled.span`
  font-size: 0.875rem;
  display: inline-block;
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
  uploader?: any // (file: File, variables?: { [key: string]: any }) => void
  label?: string
  className?: string
  onChange: (files: File[]) => void
  value: File[]
}

const UploadFile: React.FC<PropTypes> = observer(
  ({ uploader = [], label = 'Valitse tiedosto', className, onChange, value }) => {
    const [upload, state = { called: false }] = uploader || []

    useEffect(() => {
      if (value && value.length !== 0) {
        const firstFile = value[0]

        if (firstFile && upload) {
          upload(firstFile)
        }
      } else if (state.called && upload) {
        upload(null)
      }
    }, [value, upload, state.called])

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
        {!!state.loading && <Loading />}
        <UploadWrapper
          {...getRootProps({
            hasData: state.data && state.data.length !== 0,
            backgroundColor: state.error
              ? 'var(--light-red)'
              : state.data && state.data.length !== 0
              ? 'var(--lighter-green)'
              : '#f5f5f5',
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
