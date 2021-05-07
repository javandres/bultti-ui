import React, { useCallback, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import FileUploadInput from './FileUploadInput'
import styled from 'styled-components/macro'
import { Uploader } from '../../util/useUploader'

const ErrorMessage = styled.span`
  display: flex;
  margin-top: 1rem;
  margin-bottom: -0.5rem;
  line-height: 1.4;
  width: 100%;
`

export type PropTypes<TData> = {
  uploader?: Uploader<TData> // (file: File, variables?: { [key: string]: any }) => void
  label?: string
  className?: string
  onChange: (files: File[]) => void
  value: File[]
  disabled?: boolean
}

const UploadFile = observer(
  <TData extends unknown>({
    uploader,
    label = 'Valitse tiedosto',
    className,
    onChange,
    value,
    disabled = false,
  }: PropTypes<TData>) => {
    const prevUpload = useRef<string | null>('')
    const [upload, state = { loading: false, called: false, uploadError: undefined }] =
      uploader || []

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
        !state.uploadError &&
        state.called &&
        upload
      ) {
        prevUpload.current = null
        upload(null)
      }
    }, [
      disabled,
      value,
      upload,
      state.called,
      state.loading,
      state.uploadError,
      prevUpload.current,
    ])

    let onReset = useCallback(() => {
      prevUpload.current = null
    }, [prevUpload])

    return (
      <FileUploadInput
        value={value}
        onChange={onChange}
        className={className}
        label={label}
        disabled={disabled}
        loading={state.loading}
        onReset={onReset}>
        {state.uploadError && <ErrorMessage>{state.uploadError.message}</ErrorMessage>}
      </FileUploadInput>
    )
  }
)

export default UploadFile
