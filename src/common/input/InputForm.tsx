import React from 'react'
import { observer } from 'mobx-react-lite'
import { ActionsWrapper, ControlledFormView, FieldLabel, FieldWrapper } from './ItemForm'
import { Button, ButtonStyle } from '../components/buttons/Button'
import { useWatchDirtyForm } from '../../util/promptUnsavedChanges'

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
  testId?: string
}

const InputForm: React.FC<PropTypes> = observer(
  ({ onDone, onCancel, doneLabel, doneDisabled, fields, children: buttons, testId }) => {
    useWatchDirtyForm(!doneDisabled)

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
              data-cy={`${testId}_done`}
              style={{ marginRight: '1rem' }}
              disabled={doneDisabled}
              onClick={onDone}>
              {doneLabel || 'Tallenna'}
            </Button>
            <Button
              data-cy={`${testId}_cancel`}
              buttonStyle={ButtonStyle.SECONDARY_REMOVE}
              onClick={onCancel}>
              Peruuta
            </Button>
          </ActionsWrapper>
        </FieldWrapper>
      </ControlledFormView>
    )
  }
)

export default InputForm
