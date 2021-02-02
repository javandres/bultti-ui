import React, { useEffect } from 'react'
import styled from 'styled-components/macro'
import { RouteComponentProps } from '@reach/router'
import { Page } from '../common/components/common'
import { observer } from 'mobx-react-lite'
import Tabs from '../common/components/Tabs'
import InspectionPreview from '../inspection/InspectionPreview'
import { InspectionContext } from '../inspection/InspectionContext'
import { Button } from '../common/components/Button'
import { useStateValue } from '../state/useAppState'
import {
  getInspectionStatusColor,
  getInspectionTypeStrings,
  useEditInspection,
  useInspectionById,
} from '../inspection/inspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { InspectionStatus, InspectionType } from '../schema-types'
import InspectionActions from '../inspection/InspectionActions'
import { text, Text, translate } from '../util/translate'
import { PageTitle } from '../common/components/PageTitle'
import InspectionEditor from '../inspection/InspectionEditor'
import { useSubscription } from '@apollo/client'
import { inspectionErrorSubscription } from '../inspection/inspectionQueries'
import { pickGraphqlData } from '../util/pickGraphqlData'

const EditInspectionView = styled(Page)`
  background-color: white;
  display: flex;
  height: 100%;
  flex-direction: column;
`

const EditInspectionWrapper = styled(Page)`
  background-color: var(--white-grey);
  padding-top: 0.75rem;
  border-top: 1px solid var(--lighter-grey);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-bottom: 0px;
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
  inspectionId?: string
  inspectionType: InspectionType
} & RouteComponentProps

const EditInspectionPage: React.FC<PropTypes> = observer(
  ({ inspectionId = '', inspectionType }) => {
    var [season] = useStateValue('globalSeason')
    var [operator] = useStateValue('globalOperator')
    var [, setErrorMessage] = useStateValue('errorMessage')
    var editInspection = useEditInspection(inspectionType)

    let { data: inspection, loading: inspectionLoading, refetch } = useInspectionById(
      inspectionId
    )

    const { data: errorUpdateData } = useSubscription(inspectionErrorSubscription, {
      shouldResubscribe: true,
      variables: { inspectionId },
    })

    useEffect(() => {
      let errorUpdate = pickGraphqlData(errorUpdateData)

      if (errorUpdate) {
        setErrorMessage(errorUpdate.message)
      }
    }, [errorUpdateData])

    let hasErrors = inspection?.inspectionErrors?.length !== 0
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
          <PageTitle loading={inspectionLoading} onRefresh={refetch}>
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
                  backgroundColor: getInspectionStatusColor(inspection),
                  borderColor: getInspectionStatusColor(inspection),
                  color:
                    inspection.status === InspectionStatus.InReview
                      ? 'var(--dark-grey)'
                      : 'white',
                }}>
                <strong>{translate(inspection.status)}</strong>
              </InspectionStatusContainer>
            )}
          </PageTitle>
          {!operator || !season ? (
            <MessageContainer>
              <MessageView>
                <Text>inspectionPage_selectOperatorAndSeason</Text>
              </MessageView>
            </MessageContainer>
          ) : !inspection && !inspectionLoading ? (
            <MessageContainer>
              <MessageView>Haettu {typeStrings.prefixLC}tarkastus ei löytynyt.</MessageView>
              <Button onClick={() => editInspection()}>
                <Text>back</Text>
              </Button>
            </MessageContainer>
          ) : (
            inspection && (
              <>
                <InspectionActionsRow
                  inspection={inspection}
                  onRefresh={refetch}
                  disabledActions={hasErrors ? ['submit', 'publish'] : []}
                />
                <EditInspectionWrapper>
                  {inspection?.status === InspectionStatus.InProduction ? (
                    <InspectionEditor inspection={inspection} refetchData={refetch} />
                  ) : (
                    <Tabs>
                      <InspectionEditor
                        name="create"
                        path="/"
                        label={text('inspectionPage_inspectionInformation')}
                        loading={inspectionLoading}
                        refetchData={refetch}
                        inspection={inspection}
                      />
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
        </InspectionContext.Provider>
      </EditInspectionView>
    )
  }
)

export default EditInspectionPage
