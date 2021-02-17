import React from 'react'
import styled from 'styled-components/macro'
import { useTooltip } from '../../util/useTooltip'
import { LoadingDisplay } from './Loading'
import { observer } from 'mobx-react-lite'
import { last } from 'lodash'
import { Trash } from '../icon/Trash'

export enum ButtonSize {
  SMALL,
  MEDIUM,
  LARGE,
}

export enum ButtonStyle {
  NORMAL,
  REMOVE,
  SECONDARY,
  SECONDARY_REMOVE,
  ACCEPT,
  DISABLED,
}

type StyledButtonProps = {
  size?: ButtonSize
  buttonStyle?: ButtonStyle
  loading?: boolean
  disabled?: boolean
  inverted?: boolean
} & React.PropsWithRef<JSX.IntrinsicElements['button']>

type ValueType = number | string

const size2Style = <T extends ValueType>(size: ButtonSize, ...values: T[]): T => {
  return values[size]
}

// Style values for each style type. Two color values are defined, the
// first for non-inverted cases and the second for when inverted=true.
const styleValues = {
  [ButtonStyle.NORMAL]: {
    color: ['white', 'var(--blue)'],
    borderColor: ['var(--blue)', 'white'],
    backgroundColor: ['var(--blue)', 'white'],
  },
  [ButtonStyle.SECONDARY]: {
    color: ['var(--blue)', 'white'],
    borderColor: ['var(--blue)', 'white'],
    backgroundColor: 'transparent',
  },
  [ButtonStyle.REMOVE]: {
    color: ['white', 'var(--red)'],
    borderColor: ['var(--red)', 'white'],
    backgroundColor: ['var(--red)', 'white'],
  },
  [ButtonStyle.ACCEPT]: {
    color: ['white', 'var(--light-green)'],
    borderColor: ['var(--light-green)', 'white'],
    backgroundColor: ['var(--light-green)', 'white'],
  },
  [ButtonStyle.SECONDARY_REMOVE]: {
    color: ['var(--red)', 'white'],
    borderColor: ['var(--red)', 'white'],
    backgroundColor: 'transparent',
  },
  [ButtonStyle.DISABLED]: {
    color: 'var(--grey)',
    borderColor: 'var(--light-grey)',
    backgroundColor: 'var(--lighter-grey)',
  },
}

const sizeValues = {
  [ButtonSize.SMALL]: {
    fontSize: '0.7rem',
    padding: `0.25rem 0.5rem 0.25rem 0.5rem`,
    loadingPaddingLeft: '1rem',
  },
  [ButtonSize.MEDIUM]: {
    fontSize: '0.875rem',
    padding: `0.4rem 1rem 0.4rem 1rem`,
    loadingPaddingLeft: '1.5rem',
  },
  [ButtonSize.LARGE]: {
    fontSize: '1rem',
    padding: `0.75rem 1.65em 0.75rem 1.65rem`,
    loadingPaddingLeft: '2.1rem',
  },
}

type ButtonColorStyle = {
  color: string
  borderColor: string
  backgroundColor: string
}

type ButtonSizeStyle = {
  fontSize: string
  padding: string
}

const props2style = (props: ButtonProps): ButtonSizeStyle & ButtonColorStyle => {
  let {
    size = ButtonSize.MEDIUM,
    buttonStyle = ButtonStyle.NORMAL,
    inverted = false,
    disabled = false,
    loading = false,
  } = props

  buttonStyle = disabled ? ButtonStyle.DISABLED : buttonStyle

  let selectedSizeValues = sizeValues[size]
  let selectedStyleValues = styleValues[buttonStyle]

  const getStyleVal = (which: keyof ButtonColorStyle) => {
    const vals = selectedStyleValues[which]
    const selectIndex = inverted ? 1 : 0
    return typeof vals === 'string' ? vals : vals[selectIndex]
  }

  let paddingParts = selectedSizeValues.padding.split(' ')
  let paddingLeft = loading
    ? selectedSizeValues.loadingPaddingLeft
    : (last(paddingParts) as string)

  paddingParts.splice(paddingParts.length - 1, 1, paddingLeft)

  return {
    color: getStyleVal('color'),
    borderColor: getStyleVal('borderColor'),
    backgroundColor: getStyleVal('backgroundColor'),
    fontSize: selectedSizeValues.fontSize,
    padding: paddingParts.join(' '),
  }
}

// Prevent props from being forwarded to the DOM element and triggering an error.
const DOMSafeButtonComponent = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ inverted, loading, buttonStyle, size, ...props }, ref) => <button ref={ref} {...props} />
)

export const StyledButton = styled(DOMSafeButtonComponent)<StyledButtonProps>`
  font-family: var(--font-family);
  font-size: ${(p) => props2style(p).fontSize};
  font-weight: 500;
  appearance: none;
  outline: none;
  border-radius: 2.5rem;
  border: 1px solid ${(p) => props2style(p).borderColor};
  background: ${(p) => props2style(p).backgroundColor};
  letter-spacing: -0.6px;
  padding: ${(p) => props2style(p).padding};
  color: ${(p) => props2style(p).color};
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  flex: 0 0 auto;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transform: scale(1);
  transition: background-color 0.2s ease-out, transform 0.1s ease-out;

  &:hover {
    transform: ${({ disabled = false }) => (!disabled ? 'scale(1.02)' : 'scale(1)')};
  }

  svg {
    display: block;
    margin-right: 0.75rem;
  }
`

export const StyledTextButton = styled(DOMSafeButtonComponent)<{ color?: string }>`
  font-family: var(--font-family);
  font-size: 0.875rem;
  text-decoration: underline;
  color: ${(p) => p.color || '#888'};
  appearance: none;
  outline: none;
  border: 0;
  padding: 0;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  flex: 0 0 auto;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.1s ease-out;
  background: transparent;

  &:hover {
    transform: scale(1.025);
  }
`

const ButtonLoading = styled(LoadingDisplay).attrs(() => ({ inline: true }))<{
  buttonSize: ButtonSize
}>`
  display: flex;
  margin-right: ${({ buttonSize = ButtonSize.MEDIUM }) =>
    size2Style(buttonSize, '0.45rem', '0.5rem', '0.75rem')};
  margin-left: ${({ buttonSize = ButtonSize.MEDIUM }) =>
    size2Style(buttonSize, '-0.45rem', '-0.75rem', '-1rem')};
`

export type ButtonProps = {
  helpText?: string
  loading?: boolean
} & StyledButtonProps

export const Button: React.FC<ButtonProps> = React.forwardRef(
  ({ helpText, children, loading, ...props }, ref: any) => {
    let style = props2style(props)

    return (
      <StyledButton {...props} loading={loading} {...useTooltip(helpText)} ref={ref}>
        <ButtonLoading
          loading={!!loading}
          color={style.color}
          size={typeof props.size !== 'undefined' ? size2Style(props.size, 10, 15, 18) : 15}
          buttonSize={typeof props.size !== 'undefined' ? props.size : ButtonSize.MEDIUM}
        />{' '}
        {children}
      </StyledButton>
    )
  }
)

export const TextButton: React.FC<ButtonProps> = observer(
  ({ helpText, children, loading, ...props }) => {
    return (
      <StyledTextButton {...props} loading={loading} {...useTooltip(helpText)}>
        {children}
      </StyledTextButton>
    )
  }
)

export const StyledRemoveButton = styled.button`
  outline: none;
  padding: 0.4rem 0.6rem;
  line-height: 1;
  border: 1px solid var(--red);
  border-radius: 0.25rem;
  background-color: white;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: scale(1);
  transition: all 0.1s ease-out;

  &:hover {
    background-color: var(--red);
    color: white;
    transform: scale(1.075);

    svg * {
      fill: white;
    }

    svg *.fill-inverse {
      fill: var(--red);
    }
  }
`

export type RemoveButtonProps = {
  children?: HTMLCollection | string
  onClick: (e?: React.MouseEvent) => void
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const RemoveButton = ({
  onClick,
  children,
  style,
  className,
  ...props
}: RemoveButtonProps) => {
  return (
    <StyledRemoveButton onClick={onClick} className={className} {...props}>
      <Trash fill="var(--red)" width="1rem" height="1rem" />
    </StyledRemoveButton>
  )
}
