import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Dictionary } from 'lodash'
import { TextInput } from './Input'

const KeyValueInputView = styled.div``

const KeyValueRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
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
  readOnly?: boolean
  readOnlyKeys?: string[]
  readOnlyValues?: string[]
}

const KeyValueInput = observer(
  ({
    onChange,
    values,
    readOnly = false,
    readOnlyKeys = [],
    readOnlyValues = [],
  }: PropTypes) => {
    let keyValuePairs = useMemo(() => {
      let entries = Object.entries(values || {})

      if (!readOnly && (!values || entries.length === 0 || !!entries[entries.length - 1][0])) {
        entries.push(['', ''])
      }

      return entries
    }, [values, readOnly])

    let onKeyChange = useCallback(
      (key) => (e) => {
        let inputValue = e.target.value
        let changedPairs

        if (!inputValue) {
          changedPairs = keyValuePairs.filter(([k]) => k !== key)
        } else {
          changedPairs = keyValuePairs.map(([k, v]) => [key === k ? inputValue : k, v])
        }

        onChange(Object.fromEntries(changedPairs))
      },
      [onChange, keyValuePairs]
    )

    let onValueChange = useCallback(
      (key) => (e) => {
        let inputValue = e.target.value
        let changedPairs = keyValuePairs.map(([k, v]) => [k, key === k ? inputValue : v])
        onChange(Object.fromEntries(changedPairs))
      },
      [keyValuePairs]
    )

    return (
      <KeyValueInputView>
        {keyValuePairs.length === 0 && <>(Ei arvoja)</>}
        {keyValuePairs.map(([key, value], index) => {
          let isReadOnlyKey = readOnly || readOnlyKeys.includes(key)
          let isReadOnlyValue = readOnly || readOnlyValues.includes(key)

          return (
            <KeyValueRow key={`kv_${index}`}>
              <InputWrapper>
                <KeyInput
                  disabled={isReadOnlyKey}
                  value={key}
                  theme="light"
                  onChange={onKeyChange(key)}
                />
              </InputWrapper>
              <InputWrapper>
                <ValueInput
                  disabled={isReadOnlyValue}
                  value={value}
                  theme="light"
                  onChange={onValueChange(key)}
                />
              </InputWrapper>
            </KeyValueRow>
          )
        })}
      </KeyValueInputView>
    )
  }
)

export default KeyValueInput
