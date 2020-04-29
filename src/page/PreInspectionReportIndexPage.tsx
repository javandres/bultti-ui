import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

const PreInspectionReportIndexPageView = styled.div``

export type PropTypes = {
  children?: React.ReactNode
}

const PreInspectionReportIndexPage = observer(({ children }: PropTypes) => {
  return (
    <PreInspectionReportIndexPageView>
      <></>
    </PreInspectionReportIndexPageView>
  )
})

export default PreInspectionReportIndexPage
