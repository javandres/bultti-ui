import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ErrorView, MessageContainer, SectionHeading } from '../common/components/common'
import { FormColumn, FormWrapper } from '../common/components/form'
import ExecutionRequirements from '../executionRequirement/ExecutionRequirements'
import { TabChildProps } from '../common/components/Tabs'
import PreInspectionMeta from './PreInspectionMeta'
import { ButtonStyle } from '../common/components/Button'
import { PreInspectionContext } from './PreInspectionContext'
import { InspectionStatus } from '../schema-types'

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

  // Validate that the form has each dependent piece of data.
  let formCondition = useMemo(() => {
    return {
      preInspection: !!preInspection,
      status: preInspection?.status === InspectionStatus.Draft,
      operator: !!preInspection?.operator,
      startDate: !!preInspection?.startDate,
      season: !!preInspection?.season,
    }
  }, [preInspection])

  // Validation issues that affect the form at this moment
  let activeBlockers = Object.entries(formCondition)
    .filter(([, status]) => !status)
    .map(([key]) => key)

  return (
    <PreviewPreInspectionView>
      {activeBlockers.length !== 0 && (
        <MessageContainer style={{ marginBottom: '1rem' }}>
          {activeBlockers.map((blockerName) => (
            <ErrorView key={blockerName}>{blockerName}</ErrorView>
          ))}
        </MessageContainer>
      )}
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
