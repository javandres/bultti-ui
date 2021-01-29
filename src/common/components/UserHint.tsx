import React, { CSSProperties } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'

type size = 'small' | 'medium' | 'large'

const UserHintView = styled.div<{ size: size }>`
  font-size: ${(p) =>
    p.size === 'small' ? '1rem' : p.size === 'medium' ? '1.25rem' : '1.5rem'};
  font-weight: bold;
  cursor: pointer;
  border-radius: 50%;
  border: solid 1px var(--light-grey);
  width: ${(p) =>
    p.size === 'small' ? '1.25rem' : p.size === 'medium' ? '1.5rem' : '1.75rem'};
  height: ${(p) =>
    p.size === 'small' ? '1.25rem' : p.size === 'medium' ? '1.5rem' : '1.75rem'};
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
`

export type PropTypes = {
  hintText: string
  size?: size
  style?: CSSProperties
  className?: string
}

const UserHint = observer(({ hintText, size = 'small', style, className }: PropTypes) => {
  if (hintText.length === 0) return null
  return (
    <UserHintView title={hintText} size={size} style={style} className={className}>
      ?
    </UserHintView>
  )
})

export default UserHint
