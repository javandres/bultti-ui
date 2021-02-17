import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { TabChildProps } from '../common/components/Tabs'
import { Inspection } from '../schema-types'
import SanctionsContainer from './SanctionsContainer'

const PostInspectionSanctionsView = styled.div`
  min-height: 100%;
  width: 100%;
  padding: 0 0.75rem 2rem;
  background-color: var(--white-grey);
`

export type PropTypes = {
  inspection: Inspection
} & TabChildProps

const PostInspectionSanctions = observer(({ inspection }: PropTypes) => {
  return (
    <PostInspectionSanctionsView>
      {inspection && <SanctionsContainer inspection={inspection} />}
    </PostInspectionSanctionsView>
  )
})

export default PostInspectionSanctions
