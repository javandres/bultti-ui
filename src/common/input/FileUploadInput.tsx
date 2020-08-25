import React, { ReactChild, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { CrossThick } from '../icon/CrossThick'
import { CircleCheckmark } from '../icon/CircleCheckmark'
import { Button, ButtonStyle } from '../components/Button'
import { FlexRow } from '../components/common'
import Loading from '../components/Loading'
import { useDropzone } from 'react-dropzone'

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
  transition: padding 0.2s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  align-self: center;
`

const IconWrapper = styled.span`
  margin-right: 1rem;
  display: flex;
  align-items: center;
`

const UploadContentWrapper = styled(FlexRow)`
  width: 100%;
`

const FileLoading = styled(Loading)`
  margin-right: 1rem;
`

export type PropTypes = {
  onChange: (files: File[]) => void
  onReset?: () => unknown
  value: File[]
  label?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  hasData?: boolean
  hasError?: boolean
  children?: ReactChild
}

const FileUploadInput = observer(
  ({
    value,
    onChange,
    disabled,
    label,
    className,
    loading = false,
    onReset,
    hasData = false,
    hasError = false,
    children,
  }: PropTypes) => {
    const onDrop = useCallback(
      (acceptedFiles) => {
        if (!disabled && !loading) {
          onChange([...acceptedFiles])
        }
      },
      [onChange, disabled, loading]
    )

    const onResetField = useCallback(
      (e) => {
        e.stopPropagation()

        onChange([])

        if (onReset) {
          onReset()
        }
      },
      [onChange, onReset]
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
            hasData: hasData || loading,
            isError: hasError,
            isOk: hasData,
          })}>
          <UploadInput {...getInputProps()} />
          {value.length !== 0 ? (
            <>
              <UploadContentWrapper>
                <CurrentFile>
                  {loading ? (
                    <FileLoading inline={true} />
                  ) : (
                    <IconWrapper>
                      {hasError ? (
                        <CrossThick width="1.5rem" height="1.5rem" fill="red" />
                      ) : (
                        <CircleCheckmark width="1.5rem" height="1.5rem" />
                      )}
                    </IconWrapper>
                  )}
                  {value[0].name}
                </CurrentFile>
                {!loading && !disabled && (
                  <Button
                    style={{ marginLeft: 'auto' }}
                    buttonStyle={ButtonStyle.SECONDARY_REMOVE}
                    onClick={onResetField}>
                    Tyhjennä
                  </Button>
                )}
              </UploadContentWrapper>
              {children}
            </>
          ) : (
            <UploadContentWrapper>
              <LabelText disabled={disabled}>{label}</LabelText>
              <InstructionText>Vedä tiedosto tähän tai valitse klikkaamalla.</InstructionText>
            </UploadContentWrapper>
          )}
        </UploadWrapper>
      </UploadView>
    )
  }
)

export default FileUploadInput
