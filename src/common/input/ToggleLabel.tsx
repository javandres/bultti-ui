import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { LoadingDisplay } from '../components/Loading'

export const CheckboxLabel = styled.label<{ checked: boolean }>`
  padding: 0.3rem 0.5rem 0.3rem 0.75rem;
  display: flex;
  align-items: center;
  background: ${(p) => (p.checked ? 'var(--blue)' : 'white')};
  border: 1px solid ${(p) => (p.checked ? 'var(--blue)' : '#cccccc')};
  color: ${(p) => (p.checked ? 'white' : 'var(--dark-grey)')};
  border-radius: 2rem;
`

const LabelText = styled.span`
  margin-right: 0.25rem;
  user-select: none;
  display: inline-flex;
  align-items: center;
`

const CheckboxLoading = styled(LoadingDisplay).attrs(() => ({ inline: true }))`
  display: flex;
  margin-right: 0.45rem;
  margin-left: -0.45rem;
`

export type PropTypes = {
  children?: React.ReactNode
  checked: boolean
  label: string
  loading?: boolean
}

const ToggleLabel = observer(({ children, checked, label, loading = false }: PropTypes) => {
  let loadingColor = 'white'

  if (!checked) {
    loadingColor = 'var(--blue)'
  }

  return (
    <CheckboxLabel checked={checked}>
      <CheckboxLoading loading={loading} color={loadingColor} size={15} />{' '}
      <LabelText>{label}</LabelText>
      {children}
    </CheckboxLabel>
  )
})

export default ToggleLabel
