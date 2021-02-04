import React from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from '@reach/router'
import { Page, PageContainer } from '../common/components/common'
import InspectionsList from '../inspection/InspectionsList'
import { Plus } from '../common/icon/Plus'
import { Button } from '../common/components/Button'
import { navigateWithQueryString } from '../util/urlValue'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { getInspectionTypeStrings, useFetchInspections } from '../inspection/inspectionUtils'
import { PageTitle } from '../common/components/PageTitle'
import { InspectionType } from '../schema-types'

type PropTypes = {
  children?: React.ReactNode
  inspectionType: InspectionType
} & RouteComponentProps

const InspectionsPage: React.FC<PropTypes> = observer(({ inspectionType }) => {
  let [{ operator, inspections }, loading, refetch] = useFetchInspections(inspectionType)

  let typeStrings = getInspectionTypeStrings(inspectionType)

  return (
    <Page>
      <PageTitle
        loading={loading}
        onRefresh={refetch}
        headerButtons={
          <Button
            onClick={() => navigateWithQueryString(`${typeStrings.path}-inspection/edit`)}>
            <Plus fill="white" width="1rem" height="1rem" />{' '}
            <span>Uusi {typeStrings.prefix}tarkastus</span>
          </Button>
        }>
        {typeStrings.prefix}tarkastukset
      </PageTitle>
      <PageContainer>
        {!operator ? (
          <MessageContainer>
            <MessageView>Valitse liikennöitsijä.</MessageView>
          </MessageContainer>
        ) : (
          inspections.length !== 0 && (
            <InspectionsList
              inspections={inspections}
              inspectionType={inspectionType}
              loading={loading}
              onUpdate={refetch}
            />
          )
        )}
      </PageContainer>
    </Page>
  )
})

export default InspectionsPage
