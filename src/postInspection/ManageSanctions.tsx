import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { text, Text } from '../util/translate'
import { FlexRow, PageSection } from '../common/components/common'
import EditSanctions from './EditSanctions'
import { gql } from '@apollo/client'
import { PostInspection } from '../schema-types'
import { TabChildProps } from '../common/components/Tabs'
import { useMutationData } from '../util/useMutationData'
import { useNavigate } from '../util/urlValue'
import EditEquipmentDefectSanctions from './EditEquipmentDefectSanctions'
import { SectionHeading } from '../common/components/Typography'

const ManageSanctionsView = styled.div`
  min-height: 100%;
  width: 100%;
  padding: 0 0.75rem 2rem;
  background-color: var(--white-grey);
`

const FunctionsRow = styled(FlexRow)`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--lighter-grey);
  margin: 0 -0.75rem 0;
  background: white;
`

let abandonSanctionsMutation = gql`
  mutation abandonSanctions($inspectionId: String!) {
    abandonSanctions(inspectionId: $inspectionId) {
      id
      status
    }
  }
`

export type PropTypes = { inspection: PostInspection } & TabChildProps

const ManageSanctions: React.FC<PropTypes> = observer(({ inspection }) => {
  let [
    execAbandonSanctions,
    { loading: abandonSanctionsLoading },
  ] = useMutationData<PostInspection>(abandonSanctionsMutation, {
    variables: {
      inspectionId: inspection.id,
    },
  })

  let navigate = useNavigate()

  let onAbandonSanctions = useCallback(async () => {
    if (confirm(text('postInspection_confirmAbandonSanctions'))) {
      await execAbandonSanctions()
      navigate.push(`/post-inspection/edit/${inspection.id}/`)
    }
  }, [execAbandonSanctions, inspection, navigate])

  return (
    <ManageSanctionsView>
      <FunctionsRow>
        <Button
          loading={abandonSanctionsLoading}
          buttonStyle={ButtonStyle.SECONDARY_REMOVE}
          size={ButtonSize.SMALL}
          onClick={onAbandonSanctions}>
          <Text>inspection_actions_abandonSanctions</Text>
        </Button>
      </FunctionsRow>
      <SectionHeading>
        <Text>postInspection_heading_sanctions</Text>
      </SectionHeading>
      <PageSection>
        <EditSanctions inspection={inspection} />
      </PageSection>
      <SectionHeading>
        <Text>postInspection_heading_equipmentDefectSanctions</Text>
      </SectionHeading>
      <PageSection>
        <EditEquipmentDefectSanctions inspection={inspection} />
      </PageSection>
    </ManageSanctionsView>
  )
})

export default ManageSanctions
