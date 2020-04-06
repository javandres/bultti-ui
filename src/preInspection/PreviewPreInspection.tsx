import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { SectionHeading } from '../common/components/common'
import { FormColumn, FormWrapper } from '../common/components/form'
import ExecutionRequirements from '../executionRequirement/ExecutionRequirements'
import { TabChildProps } from '../common/components/Tabs'

const PreviewPreInspectionView = styled.div``

export type PropTypes = {
  children?: React.ReactNode
} & TabChildProps

const PreviewPreInspection: React.FC<PropTypes> = observer(({ children }) => {
  return (
    <PreviewPreInspectionView>
      <SectionHeading theme="light">Suoritevaatimus</SectionHeading>
      <FormWrapper>
        <FormColumn width="100%" minWidth="510px">
          <ExecutionRequirements />
        </FormColumn>
      </FormWrapper>
    </PreviewPreInspectionView>
  )
})

export default PreviewPreInspection
