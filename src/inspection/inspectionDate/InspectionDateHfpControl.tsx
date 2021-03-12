import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionDate } from '../../schema-types'

const InspectionDateHfpControlView = styled.div``

export type PropTypes = {
  inspectionDate: InspectionDate
}

const InspectionDateHfpControl = observer(({ inspectionDate }: PropTypes) => {
  return <InspectionDateHfpControlView>Hfp panel</InspectionDateHfpControlView>
})

export default InspectionDateHfpControl
