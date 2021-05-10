import React from 'react'
import { observer } from 'mobx-react-lite'
import { Page, PageContainer } from '../common/components/common'
import InspectionsList from '../inspection/InspectionsList'
import { Plus } from '../common/icon/Plus'
import { Button } from '../common/components/buttons/Button'
import { navigateWithQueryString } from '../util/urlValue'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { getInspectionTypeStrings, useFetchInspections } from '../inspection/inspectionUtils'
import { PageTitle } from '../common/components/PageTitle'
import { operatorIsValid } from '../common/input/SelectOperator'
import { InspectionType } from '../schema-types'
import { RouteChildrenProps } from 'react-router-dom'

type PropTypes = {
  children?: React.ReactNode
  inspectionType: InspectionType
} & RouteChildrenProps

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
        {!operatorIsValid(operator) ? (
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
