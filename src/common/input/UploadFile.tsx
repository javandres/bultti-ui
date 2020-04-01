import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Loading from '../components/Loading'
import { useDropzone } from 'react-dropzone'
import { CircleCheckmark } from '../icon/CircleCheckmark'
import { CrossThick } from '../icon/CrossThick'

const UploadView = styled.div`
  margin: 0.5rem 0;
`

const UploadInput = styled.input``

const UploadWrapper = styled.div<{ hasData?: boolean; isError?: boolean; isOk?: boolean }>`
  position: relative;
  padding: ${(p) => (p.hasData ? '1rem' : '2rem 1rem')};
  border-radius: 1rem;
  background: ${(p) =>
    p.isError ? 'var(--light-red)' : p.isOk ? 'var(--lighter-green)' : 'var(--white-grey)'};
  outline: none;
`

const LabelText = styled.span<{ disabled?: boolean }>`
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
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
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
  color: inherit;
`

const IconWrapper = styled.span`
  margin-right: 1rem;
  display: flex;
  align-items: center;
`

const ErrorMessage = styled.span`
  display: flex;
  margin-top: 1rem;
  margin-bottom: -0.5rem;
`

const FileLoading = styled(Loading)`
  margin-left: 1rem;
`

export type PropTypes = {
  uploader?: any // (file: File, variables?: { [key: string]: any }) => void
  label?: string
  className?: string
  onChange: (files: File[]) => void
  value: File[]
  disabled?: boolean
}

const UploadFile: React.FC<PropTypes> = observer(
  ({ uploader = [], label = 'Valitse tiedosto', className, onChange, value, disabled = false }) => {
    const prevUpload = useRef<string | null>('')
    const [upload, state = { loading: false, called: false, error: undefined }] = uploader || []

    useEffect(() => {
      if (!disabled && value && value.length !== 0) {
        const firstFile = value[0]

        if (firstFile && firstFile.name !== prevUpload.current && upload && !state.loading) {
          prevUpload.current = firstFile.name
          upload(firstFile).then(({ data: result, error }) => {
            // Reset the input if there was no result and not errors.
            if ((!result || (Array.isArray(result) && result.length === 0)) && !error) {
              onChange([])
            }
          })
        }
      } else if (
        !disabled &&
        prevUpload.current !== null &&
        !state.loading &&
        !state.error &&
        state.called &&
        upload
      ) {
        prevUpload.current = null
        upload(null)
      }
    }, [disabled, value, upload, state.called, state.loading, prevUpload.current])

    const onDrop = useCallback(
      (acceptedFiles) => {
        if (!disabled) {
          onChange([...acceptedFiles])
        }
      },
      [onChange, disabled]
    )

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      disabled,
      multiple: false,
      preventDropOnDocument: true,
    })

    return (
      <UploadView className={className}>
        <UploadWrapper
          {...getRootProps({
            hasData: state.data && state.data.length !== 0,
            isError: !!state.error,
            isOk: state.data && state.data.length !== 0,
          })}>
          <UploadInput {...getInputProps()} />
          {value.length !== 0 ? (
            <>
              <CurrentFile>
                <IconWrapper>
                  {state.error ? (
                    <CrossThick width="1.5rem" height="1.5rem" fill="red" />
                  ) : (
                    <CircleCheckmark width="1.5rem" height="1.5rem" />
                  )}
                </IconWrapper>
                {value[0].name}
                {state.loading && <FileLoading inline={true} />}
              </CurrentFile>
              {state.error && <ErrorMessage>{state.error.message}</ErrorMessage>}
            </>
          ) : (
            <>
              <LabelText disabled={disabled}>{label}</LabelText>
              <InstructionText>Vedä tiedosto tähän tai valitse klikkaamalla.</InstructionText>
            </>
          )}
        </UploadWrapper>
      </UploadView>
    )
  }
)

export default UploadFile
