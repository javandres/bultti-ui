import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components/macro'
import { Page, PageContainer } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import Tabs from '../common/components/Tabs'
import InspectionPreview from '../inspection/InspectionPreview'
import { InspectionContext } from '../inspection/InspectionContext'
import { Button } from '../common/components/buttons/Button'
import { useStateValue } from '../state/useAppState'
import {
  getInspectionStatusColor,
  getInspectionStatusName,
  getInspectionTypeStrings,
  useInspectionById,
  useNavigateToInspection,
} from '../inspection/inspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import {
  InspectionErrorUpdate,
  InspectionStatus,
  InspectionStatusUpdate,
  InspectionType,
  PostInspection,
} from '../schema-types'
import InspectionActions from '../inspection/InspectionActions'
import { text, Text } from '../util/translate'
import { PageTitle } from '../common/components/PageTitle'
import InspectionEditor from '../inspection/InspectionEditor'
import { useSubscription } from '@apollo/client'
import {
  inspectionErrorSubscription,
  inspectionStatusSubscription,
} from '../inspection/inspectionQueries'
import { pickGraphqlData } from '../util/pickGraphqlData'
import SanctionsContainer from '../postInspection/SanctionsContainer'
import { useShowErrorNotification } from '../util/useShowNotification'
import { operatorIsValid } from '../common/input/SelectOperator'
import { seasonIsValid } from '../common/input/SelectSeason'
import { RouteChildrenProps, useParams } from 'react-router-dom'

const EditInspectionView = styled(Page)`
  background-color: white;
  display: flex;
  height: 100%;
  flex-direction: column;
`

const EditInspectionPageContainer = styled(PageContainer)`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0;
  flex: 1;
`

const EditInspectionWrapper = styled(Page)`
  background-color: var(--white-grey);
  padding-top: 0.75rem;
  border-top: 1px solid var(--lighter-grey);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-bottom: 0;
  min-height: auto;
  flex: 1;
`

const InspectionActionsRow = styled(InspectionActions)`
  border-top: 0;
  margin: 0;
  padding: 0.5rem 1rem;
`

const InspectionStatusContainer = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  margin-left: 0.5rem;
`

const InspectionTypeContainer = styled.span`
  text-transform: capitalize;
`

const InspectionNameTitle = styled.span`
  font-weight: normal;
  margin-left: 0.75rem;
`

export type PropTypes = {
  inspectionType: InspectionType
} & RouteChildrenProps

const EditInspectionPage: React.FC<PropTypes> = observer(({ inspectionType }) => {
  let { inspectionId = '' } = useParams<{ inspectionId?: string }>()

  var [globalSeason] = useStateValue('globalSeason')
  var [globalOperator] = useStateValue('globalOperator')

  var showErrorNotification = useShowErrorNotification()
  var navigateToInspection = useNavigateToInspection(inspectionType)

  let { data: inspection, loading: isInspectionLoading, refetch } = useInspectionById(
    inspectionId
  )

  const { data: statusUpdateData } = useSubscription<InspectionStatusUpdate>(
    inspectionStatusSubscription,
    {
      shouldResubscribe: true,
      variables: { inspectionId },
    }
  )

  const { data: errorUpdateData } = useSubscription<InspectionErrorUpdate>(
    inspectionErrorSubscription,
    {
      shouldResubscribe: true,
      variables: { inspectionId },
    }
  )

  // Show any errors
  useEffect(() => {
    let errorUpdate = pickGraphqlData(errorUpdateData)

    if (errorUpdate) {
      showErrorNotification(errorUpdate.message)
    }
  }, [errorUpdateData])

  // Add updated status on inspection if it did update.
  inspection = useMemo(() => {
    let statusUpdate = pickGraphqlData(statusUpdateData)

    if (!inspection || !statusUpdate || inspection.status === statusUpdate.status) {
      return inspection
    }

    return { ...inspection, status: statusUpdate.status }
  }, [inspection, statusUpdateData])

  let typeStrings = getInspectionTypeStrings(inspectionType)
  let inspectionGenericName = inspection
    ? `${inspection.operator.operatorName}/${inspection.seasonId}`
    : ''

  let inspectionName = inspection
    ? inspection.name
      ? `${inspection.name} (${inspectionGenericName})`
      : inspectionGenericName
    : ''

  return (
    <EditInspectionView>
      <InspectionContext.Provider value={inspection || null}>
        <PageTitle loading={isInspectionLoading} onRefresh={refetch}>
          <InspectionTypeContainer>
            {inspection?.status !== InspectionStatus.InProduction
              ? typeStrings.prefixLC
              : typeStrings.prefix}
            tarkastus
          </InspectionTypeContainer>
          <InspectionNameTitle>{inspectionName}</InspectionNameTitle>
          {inspection && (
            <InspectionStatusContainer
              style={{
                backgroundColor: getInspectionStatusColor(inspection.status),
                borderColor: getInspectionStatusColor(inspection.status),
                color:
                  inspection.status === InspectionStatus.InReview
                    ? 'var(--dark-grey)'
                    : 'white',
              }}>
              <strong>{getInspectionStatusName(inspection.status)}</strong>
            </InspectionStatusContainer>
          )}
        </PageTitle>
        <EditInspectionPageContainer>
          {!operatorIsValid(globalOperator) || !seasonIsValid(globalSeason) ? (
            <MessageContainer style={{ margin: '1rem' }}>
              <MessageView>
                <Text>inspectionPage_selectOperatorAndSeason</Text>
              </MessageView>
            </MessageContainer>
          ) : !inspection && !isInspectionLoading ? (
            <MessageContainer style={{ margin: '1rem' }}>
              <MessageView>
                <Text
                  keyValueMap={{
                    inspection: typeStrings.prefix,
                  }}>
                  inspectionPage_inspectionNotFound
                </Text>
              </MessageView>
              <Button onClick={() => navigateToInspection()}>
                <Text>back</Text>
              </Button>
            </MessageContainer>
          ) : (
            inspection && (
              <>
                <InspectionActionsRow inspection={inspection} onRefresh={refetch} />
                <EditInspectionWrapper>
                  {inspection?.status === InspectionStatus.InProduction ? (
                    <InspectionEditor inspection={inspection} refetchData={refetch} />
                  ) : (
                    <Tabs>
                      <InspectionEditor
                        default={true}
                        name="create"
                        path="/"
                        label={text('inspectionPage_inspectionInformation')}
                        loading={isInspectionLoading}
                        refetchData={refetch}
                        inspection={inspection}
                      />
                      {inspection.status === InspectionStatus.Sanctionable && (
                        <SanctionsContainer
                          inspection={inspection as PostInspection}
                          name="sanction"
                          path="sanctions"
                          label={text('inspectionPage_sanctions')}
                        />
                      )}
                      <InspectionPreview
                        inspection={inspection}
                        path="results"
                        name="results"
                        label={text('inspectionPage_results')}
                      />
                    </Tabs>
                  )}
                </EditInspectionWrapper>
              </>
            )
          )}
        </EditInspectionPageContainer>
      </InspectionContext.Provider>
    </EditInspectionView>
  )
})

export default EditInspectionPage
