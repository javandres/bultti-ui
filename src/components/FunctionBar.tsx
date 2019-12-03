import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { AnyFunction } from '../types/common'
import { Button, ButtonSize } from './Button'

const FunctionBarView = styled.div`
  padding: 0.75rem 1rem;
  background: var(--light-grey);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  
  svg {
    display: block;
    margin-right: 0.75rem;
  }
`

const FunctionButton = styled(Button)``

export type FunctionDef = {
  label: React.ReactNode | string
  name: string
  active?: boolean
  action: AnyFunction
}

export type FunctionBarProps = {
  functions: FunctionDef[]
}

const FunctionBar: React.FC<FunctionBarProps> = observer(({ functions }) => {
  return (
    <FunctionBarView>
      {functions.map((fn) => (
        <FunctionButton key={fn.name} onClick={fn.action} size={ButtonSize.MEDIUM}>
          {fn.label}
        </FunctionButton>
      ))}
    </FunctionBarView>
  )
})

export default FunctionBar
