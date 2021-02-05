import styled from 'styled-components/macro'
import { Column } from './common'
import { ThemeTypes } from '../../type/common'
import { observer } from 'mobx-react-lite'
import UserHint from './UserHint'
import { CSSProperties } from 'react'

export const FormColumn = styled(Column)`
  padding: 1rem 0;
  margin-right: 1.5rem;

  &:last-child {
    margin-right: 0;
  }
`

export const ControlGroup = styled.div`
  margin: 0 0 2rem;
  display: flex;
  flex-wrap: nowrap;

  &:last-child {
    margin-bottom: 0;
  }

  > * {
    flex: 1 1 50%;
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
`

const InputLabelWrapper = styled.label<{
  theme?: ThemeTypes
  subLabel?: boolean
  hintText?: string
}>`
  display: flex;
  justify-content: space-between;
  font-size: ${(p) => (p.subLabel ? '0.65rem' : '0.875rem')};
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme = 'light' }) => (theme === 'light' ? 'var(--dark-grey)' : '#eeeeee')};
  margin: 0;
  padding-bottom: 0.5rem;
`

type PropTypes = {
  theme?: ThemeTypes
  subLabel?: boolean
  hintText?: string
  style?: CSSProperties
  className?: string
}

export const InputLabel: React.FC<PropTypes> = observer(
  ({ theme = 'light', subLabel, hintText, children, style = {}, className }) => {
    return (
      <InputLabelWrapper theme={theme} subLabel={subLabel} style={style} className={className}>
        {children}
        {hintText && <UserHint hintText={hintText} />}
      </InputLabelWrapper>
    )
  }
)
