import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { SectionHeading } from '../common/components/common'
import { FormColumn, FormWrapper } from '../common/components/form'
import ExecutionRequirements from '../executionRequirement/ExecutionRequirements'
import { TabChildProps } from '../common/components/Tabs'
import PreInspectionMeta from './PreInspectionMeta'
import { ButtonStyle } from '../common/components/Button'
import { PreInspectionContext } from './PreInspectionContext'

const PreviewPreInspectionView = styled.div``

export type PropTypes = {
  publishPreInspection: (publishId: string) => unknown
} & TabChildProps

const PreviewPreInspection: React.FC<PropTypes> = observer(({ publishPreInspection }) => {
  let preInspection = useContext(PreInspectionContext)

  let onPublish = useCallback(() => {
    if (preInspection) {
      publishPreInspection(preInspection.id)
    }
  }, [preInspection, publishPreInspection])

  return (
    <PreviewPreInspectionView>
      <PreInspectionMeta
        isLoading={false}
        buttonStyle={ButtonStyle.NORMAL}
        buttonAction={onPublish}
        buttonLabel="Julkaise"
      />
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
