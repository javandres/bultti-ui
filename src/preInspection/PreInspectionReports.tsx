import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { PreInspectionContext } from './PreInspectionContext'
import { ErrorView, MessageView } from '../common/components/common'
import styled from 'styled-components'

const PreInspectionReportsView = styled.div`
  min-height: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
`

export type PropTypes = {
  children?: React.ReactNode
}

const PreInspectionReports: React.FC<PropTypes> = observer(() => {
  let preInspection = useContext(PreInspectionContext)

  return (
    <PreInspectionReportsView>
      {!preInspection && <ErrorView>Ennakkotarkastus ei löydetty.</ErrorView>}
      {!!preInspection && <MessageView>Ei raportteja...</MessageView>}
    </PreInspectionReportsView>
  )
})

export default PreInspectionReports
