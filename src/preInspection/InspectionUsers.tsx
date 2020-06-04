import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useStateValue } from '../state/useAppState'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { PreInspectionContext } from './PreInspectionContext'

const UserList = styled.div``

const UserRow = styled.div`
  margin: 0 0 1.5rem;
`

const RowTitle = styled.h5`
  margin: 0 0 0.5rem;
`

const TitleTimestamp = styled.span``

const RowUserValue = styled.div``

export type PropTypes = {
  inspectionId?: string
} & RouteComponentProps

const InspectionUsers = observer(({ inspectionId }: PropTypes) => {
  var [user] = useStateValue('user')
  var inspection = useContext(PreInspectionContext)

  let allUsers = inspection?.userRelations || []

  return (
    <ExpandableSection
      headerContent={
        <>
          <HeaderMainHeading>Käyttäjät</HeaderMainHeading>
          <HeaderSection style={{ padding: '0.5rem 0.75rem', justifyContent: 'center' }}>
            <Button
              style={{ marginLeft: 'auto' }}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}
              onClick={() => {}}>
              Päivitä
            </Button>
          </HeaderSection>
        </>
      }>
      {inspection && (
        <UserList>
          {allUsers.map((rel) => (
            <UserRow>
              <RowTitle>
                <TitleTimestamp>{rel.updatedAt}</TitleTimestamp>
                {rel.relatedBy}
              </RowTitle>
              <RowUserValue>
                {rel.user.name}, {rel.user.organisation}, {rel.user.email}
              </RowUserValue>
            </UserRow>
          ))}
        </UserList>
      )}
    </ExpandableSection>
  )
})

export default InspectionUsers
