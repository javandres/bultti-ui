import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

type size = 'small' | 'medium' | 'large'

const UserHintView = styled.div<{ size: size }>`
  font-size: ${(p) =>
    p.size === 'small' ? '1rem' : p.size === 'medium' ? '1.25rem' : '1.5rem'};
  font-weight: bold;
  cursor: pointer;
`

export type PropTypes = {
  hintText: string
  size?: size
}

const UserHint = observer(({ hintText, size = 'small' }: PropTypes) => {
  if (hintText.length === 0) return null
  return (
    <UserHintView title={hintText} size={size}>
      ?
    </UserHintView>
  )
})

export default UserHint
