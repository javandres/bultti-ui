import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { AnyFunction } from '../types/common'
import { Button, ButtonSize } from './Button'

const FunctionBarView = styled.div`
  padding: 0.5rem 1rem;
  background: var(--light-grey);
`

const FunctionButton = styled(Button)``

export type FunctionDef = {
  label: string
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
        <FunctionButton key={fn.label} onClick={fn.action} size={ButtonSize.MEDIUM}>
          {fn.label}
        </FunctionButton>
      ))}
    </FunctionBarView>
  )
})

export default FunctionBar
