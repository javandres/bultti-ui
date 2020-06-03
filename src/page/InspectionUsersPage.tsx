import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useInspectionById } from '../preInspection/inspectionUtils'
import { RouteComponentProps } from '@reach/router'
import { FlexRow, Page } from '../common/components/common'
import { PageTitle } from '../common/components/Typography'
import { LoadingDisplay } from '../common/components/Loading'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { useRefetch } from '../util/useRefetch'
import { InspectionType } from '../schema-types'
import { useStateValue } from '../state/useAppState'
import { requireOperatorUser } from '../util/userRoles'
import { ErrorView, MessageContainer } from '../common/components/Messages'

const InspectionUsersPageView = styled(Page)``

const PageContent = styled.div`
  padding: 1rem;
`

const HeaderRow = styled(FlexRow)`
  margin: -1rem 0 1rem;
  padding: 0 1rem;
  min-height: 35px;
  align-items: center;
`

const ListHeading = styled.h4`
  margin: 0 1rem 0 0;
`

export type PropTypes = {
  inspectionId?: string
} & RouteComponentProps

const InspectionUsersPage = observer(({ inspectionId }: PropTypes) => {
  var [user] = useStateValue('user')

  let { data: inspection, loading: inspectionLoading, refetch } = useInspectionById(
    inspectionId
  )

  let refetchInspection = useRefetch(refetch)

  let allUsers = inspection?.userRelations || []

  let userIsAuthorized = requireOperatorUser(user, inspection?.operatorId)

  return (
    <InspectionUsersPageView>
      <PageTitle>Tarkastuksen käyttäjät</PageTitle>
      <LoadingDisplay loading={inspectionLoading} />
      {!userIsAuthorized && (
        <MessageContainer>
          <ErrorView>Käyttäjällä ei ole valtuuksia tälle tarkastukselle.</ErrorView>
        </MessageContainer>
      )}
      {inspection && userIsAuthorized && (
        <>
          <HeaderRow>
            <ListHeading>
              {inspection.inspectionType === InspectionType.Pre
                ? 'Ennakkotarkastus'
                : 'Jälkitarkastus'}
              , {inspection.operator.operatorName} / {inspection.season.id}
            </ListHeading>
            <Button
              style={{ marginLeft: 'auto' }}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}
              onClick={refetchInspection}>
              Päivitä
            </Button>
          </HeaderRow>
          <PageContent>
            {allUsers.map((rel) => (
              <div>
                <strong>{rel.relatedBy}</strong>
                <br />
                <span
                  style={{ fontWeight: user.email === rel.user.email ? 'bold' : 'normal' }}>
                  {rel.user.email}
                </span>
              </div>
            ))}
          </PageContent>
        </>
      )}
    </InspectionUsersPageView>
  )
})

export default InspectionUsersPage
