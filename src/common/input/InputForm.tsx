import React from 'react'
import { observer } from 'mobx-react-lite'
import { ActionsWrapper, ControlledFormView, FieldLabel, FieldWrapper } from './ItemForm'
import { Button } from '../components/Button'

export interface FieldConfigType {
  label: string
  field: React.ReactChild
}

export type PropTypes = {
  children?: React.ReactNode
  fields: Array<FieldConfigType>
  onCancel: () => void
  onDone: () => void
  doneLabel?: string
  doneDisabled?: boolean
}

const InputForm: React.FC<PropTypes> = observer(
  ({ onDone, onCancel, doneLabel, doneDisabled, fields, children: buttons }) => {
    return (
      <ControlledFormView>
        {fields.map(({ label, field }) => {
          return (
            <FieldWrapper key={label}>
              <FieldLabel>{label}</FieldLabel>
              {field}
            </FieldWrapper>
          )
        })}
        <FieldWrapper
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginLeft: 'auto',
          }}>
          {buttons}
          <ActionsWrapper>
            <Button
              style={{ marginRight: '1rem' }}
              theme="light"
              transparent={true}
              onClick={onCancel}>
              Peruuta
            </Button>
            <Button disabled={doneDisabled} onClick={onDone}>
              {doneLabel || 'Tallenna'}
            </Button>
          </ActionsWrapper>
        </FieldWrapper>
      </ControlledFormView>
    )
  }
)

export default InputForm
