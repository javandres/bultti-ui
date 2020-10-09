import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { usePostInspectionBaseRequirements } from './executionRequirementUtils'
import { Inspection } from '../schema-types'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { InspectionContext } from '../inspection/InspectionContext'

const PostInspectionExecutionRequirementsView = styled.div``

export type PropTypes = {}

const PostInspectionExecutionRequirements = observer(({}: PropTypes) => {
  const inspection = useContext(InspectionContext)

  let { data: baseRequirements, loading, refetch } = usePostInspectionBaseRequirements(
    inspection?.id
  )

  console.log(baseRequirements)

  return (
    <ExpandableSection
      headerContent={
        <>
          <HeaderMainHeading>Suoritevaatimukset</HeaderMainHeading>
          <HeaderSection style={{ padding: '0.5rem 0.75rem', justifyContent: 'center' }}>
            {baseRequirements?.length !== 0 && (
              <Button
                loading={loading}
                style={{ marginLeft: 'auto' }}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSize.SMALL}
                onClick={refetch}>
                Päivitä
              </Button>
            )}
          </HeaderSection>
        </>
      }>
      <PostInspectionExecutionRequirementsView>
        Requirements here
      </PostInspectionExecutionRequirementsView>
    </ExpandableSection>
  )
})

export default PostInspectionExecutionRequirements
