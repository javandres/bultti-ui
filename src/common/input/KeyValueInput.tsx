import React, { useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Dictionary } from 'lodash'
import { TextInput } from './Input'

const KeyValueInputView = styled.div``

const KeyValueRow = styled.div`
  display: flex;
`

const InputWrapper = styled.div`
  flex: 1 1 50%;

  &:first-child {
    padding-right: 0.5rem;
  }

  &:last-child {
    padding-left: 0.5rem;
  }
`

const KeyInput = styled(TextInput)``

const ValueInput = styled(TextInput)``

export type ValuesType = Dictionary<string>

export type PropTypes = {
  onChange: (values: ValuesType) => unknown
  values: ValuesType
}

const KeyValueInput = observer(({ onChange, values }: PropTypes) => {
  let keyValuePairs = useMemo(() => {
    if (!values || Object.keys(values).length === 0) {
      return [['', '']]
    }

    return Object.entries(values)
  }, [values])

  return (
    <KeyValueInputView>
      {keyValuePairs.map(([key, value]) => {
        return (
          <KeyValueRow>
            <InputWrapper>
              <KeyInput value={key} theme="light" />
            </InputWrapper>
            <InputWrapper>
              <ValueInput value={value} theme="light" />
            </InputWrapper>
          </KeyValueRow>
        )
      })}
    </KeyValueInputView>
  )
})

export default KeyValueInput
