import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import ReportStateContext from '../report/ReportStateContext'
import { TabChildProps } from '../common/components/Tabs'
import { Inspection } from '../schema-types'
import SanctionsContainer from './SanctionsContainer'

const PostInspectionSanctionsView = styled.div`
  min-height: 100%;
  padding: 0 1rem 2rem;
  background-color: white;
`

export type PropTypes = {
  inspection: Inspection
} & TabChildProps

const PostInspectionSanctions = observer(({ inspection }: PropTypes) => {
  return (
    <PostInspectionSanctionsView>
      {inspection && (
        <ReportStateContext>
          <SanctionsContainer inspection={inspection} />
        </ReportStateContext>
      )}
    </PostInspectionSanctionsView>
  )
})

export default PostInspectionSanctions
