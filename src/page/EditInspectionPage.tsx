import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import PreInspectionEditor from '../preInspection/PreInspectionEditor'
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
import { ErrorView, MessageContainer, MessageView } from '../common/components/Messages'
import { useRefetch } from '../util/useRefetch'
import { InspectionStatus, InspectionType } from '../schema-types'
import InspectionActions from '../inspection/InspectionActions'
import { text, translate } from '../util/translate'
import { PageTitle } from '../common/components/PageTitle'
import PostInspectionEditor from '../postInspection/PostInspectionEditor'

const EditInspectionView = styled(Page)`
  background-color: white;
`

const EditInspectionWrapper = styled(Page)`
  background-color: var(--white-grey);
`

const InspectionActionsRow = styled(InspectionActions)`
  border-top: 0;
  margin: 0 0 0.5rem;
  padding: 0.5rem 0.7rem 1rem;
`

const StatusBox = styled.div`
  margin: -0.75rem 0.7rem 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
`

export type PropTypes = {
  inspectionId?: string
  inspectionType: InspectionType
} & RouteComponentProps

const EditInspectionPage: React.FC<PropTypes> = observer(
  ({ inspectionId = '', inspectionType }) => {
    var [season] = useStateValue('globalSeason')
    var [operator] = useStateValue('globalOperator')
    var editInspection = useEditInspection(inspectionType)

    let {
      data: inspection,
      loading: inspectionLoading,
      refetch: refetchInspection,
    } = useInspectionById(inspectionId)

    let refetch = useRefetch(refetchInspection)
    let hasErrors = inspection?.inspectionErrors?.length !== 0

    let typeStrings = getInspectionTypeStrings(inspectionType)

    return (
      <EditInspectionView>
        <InspectionContext.Provider value={inspection || null}>
          <PageTitle loading={inspectionLoading} onRefresh={refetch}>
            Uusi {typeStrings.prefixLC}tarkastus
          </PageTitle>
          {!operator || !season ? (
            <MessageContainer>
              <MessageView>Valitse liikennöitsijä ja kausi.</MessageView>
            </MessageContainer>
          ) : !inspection && !inspectionLoading ? (
            <MessageContainer>
              <MessageView>Haettu {typeStrings.prefixLC}tarkastus ei löytynyt.</MessageView>
              <Button onClick={() => editInspection()}>Takaisin</Button>
            </MessageContainer>
          ) : (
            <>
              {inspection && (
                <>
                  <StatusBox
                    style={{
                      backgroundColor: getInspectionStatusColor(inspection),
                      borderColor: getInspectionStatusColor(inspection),
                      color:
                        inspection.status === InspectionStatus.InReview
                          ? 'var(--dark-grey)'
                          : 'white',
                    }}>
                    <strong>{translate(inspection.status)}</strong>
                  </StatusBox>
                  <InspectionActionsRow
                    inspectionType={inspectionType}
                    inspection={inspection}
                    onRefresh={refetch}
                    disabledActions={hasErrors ? ['submit', 'publish'] : []}
                  />
                </>
              )}
              {hasErrors && (
                <MessageContainer>
                  {(inspection?.inspectionErrors || []).map((err) => (
                    <ErrorView key={err}>{text(err)}</ErrorView>
                  ))}
                </MessageContainer>
              )}
              <EditInspectionWrapper>
                {inspection?.status === InspectionStatus.InProduction ? (
                  <PreInspectionEditor refetchData={refetch} />
                ) : inspectionType === InspectionType.Pre ? (
                  <Tabs>
                    <PreInspectionEditor
                      name="create"
                      path="/"
                      label="Muokkaa"
                      loading={inspectionLoading}
                      refetchData={refetch}
                    />
                    <InspectionPreview
                      inspectionType={InspectionType.Pre}
                      inspection={inspection}
                      path="preview"
                      name="preview"
                      label="Esikatsele"
                    />
                  </Tabs>
                ) : (
                  <Tabs>
                    <PostInspectionEditor
                      name="create"
                      path="/"
                      label="Muokkaa"
                      loading={inspectionLoading}
                      refetchData={refetch}
                    />
                    <InspectionPreview
                      inspectionType={InspectionType.Post}
                      inspection={inspection}
                      path="preview"
                      name="preview"
                      label="Esikatsele"
                    />
                  </Tabs>
                )}
              </EditInspectionWrapper>
            </>
          )}
        </InspectionContext.Provider>
      </EditInspectionView>
    )
  }
)

export default EditInspectionPage
