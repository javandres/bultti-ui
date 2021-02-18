import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Info } from '../icon/Info'
import { Button, ButtonSize, ButtonStyle } from './Button'
import { Checkmark2 } from '../icon/Checkmark2'
import { CrossThick } from '../icon/CrossThick'

export const FormSaveToolbarView = styled.div<{ floating?: boolean }>`
  position: ${(p) => (p.floating ? 'fixed' : 'static')};
  bottom: 1rem;
  border-radius: ${(p) => (p.floating ? '0.5rem' : 0)};
  background: white;
  padding: ${(p) => (p.floating ? '1rem' : '1rem 1rem 1.25rem')};
  margin: ${(p) => (p.floating ? 0 : '0 -1rem 1.25rem -1rem')};
  right: ${(p) => (p.floating ? '2rem' : 'auto')};
  left: ${(p) => (p.floating ? '2rem' : 'auto')};
  width: ${(p) =>
    p.floating
      ? 'calc(100% - 3.5rem)'
      : 'calc(100% + 2rem)'}; // Remove sidebar width when floating.
  z-index: 200;
  font-size: 1rem;
  box-shadow: ${(p) => (p.floating ? '0 0 10px rgba(0,0,0,0.2)' : 'none')};
  border: ${(p) => (p.floating ? '1px solid var(--lighter-grey)' : 0)};
  border-bottom: 1px solid var(--lighter-grey);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  transition: padding 0.2s ease-out, left 0.2s ease-out, bottom 0.2s ease-out;
`
export const ToolbarDescription = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.75rem;
  }
`
export const CancelButton = styled(Button)`
  position: static;
  display: flex;
  color: var(--red);
  background: white;
`
export const SaveButton = styled(Button)`
  background: var(--green);
  margin-right: 1rem;
`

export type PropTypes = {
  onSave: () => unknown
  onCancel: () => unknown
  floating?: boolean
  infoMessage?: string
  saveLabel?: string
  cancelLabel?: string
}

const FormSaveToolbar = observer(
  ({
    cancelLabel = 'Peruuta',
    infoMessage = 'Muista tallentaa tekemäsi muutokset.',
    onCancel,
    onSave,
    saveLabel = 'Tallenna muutokset',
    floating = true,
  }: PropTypes) => {
    return (
      <FormSaveToolbarView floating={floating}>
        <ToolbarDescription>
          <Info fill="var(--dark-grey)" width={20} height={20} />
          {infoMessage}
        </ToolbarDescription>
        <SaveButton onClick={onSave} size={ButtonSize.MEDIUM} buttonStyle={ButtonStyle.NORMAL}>
          <Checkmark2 fill="white" width="0.5rem" height="0.5rem" />
          {saveLabel}
        </SaveButton>
        <CancelButton
          onClick={onCancel}
          size={ButtonSize.MEDIUM}
          buttonStyle={ButtonStyle.SECONDARY_REMOVE}>
          <CrossThick fill="var(--red)" width="0.5rem" height="0.5rem" />
          {cancelLabel}
        </CancelButton>
      </FormSaveToolbarView>
    )
  }
)

export default FormSaveToolbar
