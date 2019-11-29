import styled from 'styled-components'
import { StyledButton } from './Button'

export const LoginButton = styled(StyledButton)`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  user-select: none;
  cursor: pointer;

  svg + .buttonText {
    margin-left: 10px;
  }
`
