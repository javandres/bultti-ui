import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components/macro'

const Container = styled.label`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  position: relative;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  cursor: pointer;
`

export const ToggleInput = styled.input`
  position: absolute;
  left: -9999px;
  opacity: 0;
  visibility: hidden;
`

export const ToggleMarker = styled.div<{ checked?: boolean; inverted?: boolean }>`
  position: absolute;
  top: 1px;
  left: 0;
  width: 16px;
  height: 16px;
  background-color: ${({ checked, inverted }) =>
    inverted && checked
      ? 'var(--blue)'
      : inverted && !checked
      ? 'white'
      : !inverted && !checked
      ? '#aaa'
      : 'white'};
  border: 1px solid ${({ checked }) => (!checked ? 'transparent' : 'var(--blue)')};
  border-radius: 15px;
  transition: transform 0.1s ease-out;
  transform: translate(2px, 0);
`

export const ToggleContainer = styled.div<{
  checked?: boolean
  isSwitch?: boolean
  inverted?: boolean
}>`
  position: relative;
  width: 35px;
  height: 20px;
  border: 1px solid
    ${({ isSwitch, inverted }) =>
      inverted ? 'white' : isSwitch ? 'var(--blue)' : 'var(--grey)'};
  background: ${({ isSwitch, inverted }) => (isSwitch || inverted ? 'var(--blue)' : 'white')};
  border-radius: 15px;
  transition: background 0.2s ease-out;
  flex: 0 0 35px;

  ${ToggleInput}:checked + & {
    background: ${({ inverted }) => (!inverted ? 'var(--blue)' : 'white')};
    border-color: ${({ inverted }) => (!inverted ? 'var(--blue)' : 'white')};

    ${ToggleMarker} {
      transform: translate(16px, 0);
    }
  }
`

const TextContainer = styled.div<{ disabled?: boolean; isPreLabel?: boolean }>`
  font-family: var(--font-family);
  flex: 1 1 40%;
  justify-content: flex-start;
  align-items: flex-start;
  color: ${({ disabled }) => (disabled ? 'var(--light-grey)' : 'inherit')};
  margin-left: ${({ isPreLabel = false }) => (isPreLabel ? '0' : '0.5rem')};
  margin-right: ${({ isPreLabel = false }) => (isPreLabel ? '0.5rem' : '0')};
  text-align: ${({ isPreLabel = false }) => (isPreLabel ? 'right' : 'left')};
  font-size: 0.75rem;
  white-space: nowrap;
  user-select: none;
`

type PropTypes = {
  type?: string
  checked: boolean
  name?: string
  onChange: (checked: boolean) => void
  value: string
  disabled?: boolean
  isSwitch?: boolean
  children?: React.ReactNode
  label?: React.ReactNode
  preLabel?: string
  className?: string
  inverted?: boolean
  testId?: string
}

const ToggleButton: React.FC<PropTypes> = observer(
  ({
    type = 'checkbox',
    checked,
    name,
    onChange,
    value,
    disabled = false,
    isSwitch = false,
    children,
    label = children,
    preLabel,
    className,
    inverted = false,
    testId = 'toggle-button',
  }) => {
    let onValueChange = useCallback(
      (e) => {
        let isChecked = e.target.checked
        onChange(isChecked)
      },
      [onChange]
    )

    return (
      <Container data-testid={testId} className={className}>
        {preLabel && <TextContainer isPreLabel={true}>{preLabel}</TextContainer>}
        <ToggleInput
          type={type}
          name={name}
          onChange={onValueChange}
          value={value}
          disabled={disabled}
          checked={checked}
        />
        <ToggleContainer isSwitch={isSwitch} checked={checked} inverted={inverted}>
          <ToggleMarker checked={!checked ? isSwitch : checked} inverted={inverted} />
        </ToggleContainer>
        <TextContainer>{label}</TextContainer>
      </Container>
    )
  }
)
export default ToggleButton
