import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionStatus, InspectionType } from '../schema-types'
import Loading from '../common/components/Loading'
import { orderBy } from 'lodash'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { FlexRow } from '../common/components/common'
import { useStateValue } from '../state/useAppState'
import { useCreateInspection, useEditInspection } from './inspectionUtils'
import { format, parseISO } from 'date-fns'
import { READABLE_DATE_FORMAT } from '../constants'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { SubHeading } from '../common/components/Typography'
import InspectionActions from './InspectionActions'

const SelectPreInspectionView = styled.div``

const PreInspectionItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 0 0 1rem;
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

type StatusProps = { status?: InspectionStatus | 'new' }

const PreInspectionItem = styled.div<StatusProps>`
  padding: 0.75rem 1rem 0;
  border-radius: 5px;
  margin-bottom: 1rem;
  background: white;
  border: 2px solid
    ${(p) =>
      p.status === 'new'
        ? 'var(--blue)'
        : p.status === InspectionStatus.Draft
        ? 'var(--lighter-grey)'
        : p.status === InspectionStatus.InReview
        ? 'var(--yellow)'
        : 'var(--light-green)'};
  font-family: inherit;
  margin-right: 1rem;
  text-align: left;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(33.333% - 1rem);
`

const ItemContent = styled.div`
  margin-bottom: 1rem;
  line-height: 1.4;
  position: relative;
`

const ButtonRow = styled.div`
  margin: auto -1rem 0;
  padding: 0.75rem 1rem 0.75rem;
  border-top: 1px solid var(--lighter-grey);
  background: var(--white-grey);
  display: flex;
  align-items: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  > * {
    margin-right: 1rem;
  }
`

const InspectionTitle = styled(SubHeading)`
  margin-bottom: 1rem;
`

const InspectionVersion = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.2rem 0.6rem;
  border-radius: 5px;
  background: var(--lighter-grey);
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const InspectionStatusDisplay = styled.div<StatusProps>`
  padding: 0.25rem 0;
  text-align: center;
  background: ${(p) =>
    p.status === InspectionStatus.Draft
      ? 'var(--blue)'
      : p.status === InspectionStatus.InReview
      ? 'var(--yellow)'
      : 'var(--light-green)'};
  color: ${(p) => (p.status === InspectionStatus.InReview ? 'var(--dark-grey)' : 'white')};
  margin: 0 0 1rem;
  border-radius: 5px;
`

const InspectionPeriodDisplay = styled.div``

const StartDate = styled.span`
  margin-right: 0.75rem;

  &:after {
    content: '➔';
    display: inline-block;
    margin-left: 0.75rem;
  }
`

const EndDate = styled(StartDate)`
  &:after {
    content: '';
  }
`

const DateTitle = styled.h6`
  font-size: 0.75rem;
  margin-top: 0;
  margin-bottom: 0.25rem;
`

export type PropTypes = {
  inspections?: Inspection[]
  refetchPreInspections: () => unknown
  loading?: boolean
}

/**
 * - Display current in-production pre-inspection
 * - Display current draft pre-inspection
 * - Create a new pre-inspection draft (if no pre-inspection exists for the operator/season combo)
 * - Create a new pre-inspection draft that extends the in-production version
 * - Delete the current draft
 */

const SelectPreInspection: React.FC<PropTypes> = observer(
  ({ inspections = [], refetchPreInspections, loading = false }) => {
    var [season] = useStateValue('globalSeason')
    var [operator] = useStateValue('globalOperator')

    var editInspection = useEditInspection(InspectionType.Pre)

    // Initialize the form by creating a pre-inspection on the server and getting the ID.
    let createPreInspection = useCreateInspection(operator, season, InspectionType.Pre)

    let onCreatePreInspection = useCallback(async () => {
      let createdPreInspection = await createPreInspection()

      if (createdPreInspection) {
        editInspection(createdPreInspection)
      }

      await refetchPreInspections()
    }, [createPreInspection, refetchPreInspections, editInspection])

    return (
      <SelectPreInspectionView>
        {!operator || !season ? (
          <MessageContainer>
            <MessageView>Valitse liikennöitsijä ja kausi.</MessageView>
          </MessageContainer>
        ) : (
          <>
            <HeaderRow>
              <ListHeading>
                {operator.operatorName} / {typeof season === 'string' ? season : season?.id}
              </ListHeading>
              {loading && <Loading size={25} inline={true} />}
              <Button
                style={{ marginLeft: 'auto' }}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSize.SMALL}
                onClick={() => refetchPreInspections()}>
                Päivitä
              </Button>
            </HeaderRow>
            <PreInspectionItems>
              {!inspections.some((pi) => pi.status === InspectionStatus.Draft) && (
                <PreInspectionItem key="new" status="new">
                  <ItemContent style={{ marginTop: 0 }}>
                    Tällä hetkellä ei ole keskeneräisiä ennakkotarkastuksia, joten voit luoda
                    uuden.
                  </ItemContent>
                  {inspections.some((pi) => pi.status === InspectionStatus.InProduction) && (
                    <ItemContent>
                      Uusi ennakkotarkastus korvaa nykyisen tuotannossa-olevan tarkastuksen.
                    </ItemContent>
                  )}
                  <ButtonRow>
                    <Button
                      buttonStyle={ButtonStyle.NORMAL}
                      size={ButtonSize.MEDIUM}
                      onClick={onCreatePreInspection}>
                      Uusi ennakkotarkastus
                    </Button>
                  </ButtonRow>
                </PreInspectionItem>
              )}
              {orderBy(inspections, 'version', 'desc').map((inspection) => (
                <PreInspectionItem key={inspection.id} status={inspection.status}>
                  <ItemContent>
                    <InspectionTitle>
                      {inspection.operator.operatorName}, {inspection.season.id}
                    </InspectionTitle>
                    <InspectionVersion>{inspection.version}</InspectionVersion>
                    <InspectionStatusDisplay status={inspection.status}>
                      {inspection.status === InspectionStatus.Draft
                        ? 'Muokattavissa'
                        : inspection.status === InspectionStatus.InReview
                        ? 'Hyväksyttävänä'
                        : 'Tuotannossa'}
                    </InspectionStatusDisplay>
                    <InspectionPeriodDisplay>
                      <DateTitle>Tuotantojakso</DateTitle>
                      <StartDate>
                        {format(parseISO(inspection.startDate), READABLE_DATE_FORMAT)}
                      </StartDate>
                      <EndDate>
                        {format(parseISO(inspection.endDate), READABLE_DATE_FORMAT)}
                      </EndDate>
                    </InspectionPeriodDisplay>
                  </ItemContent>
                  <InspectionActions
                    onRefresh={refetchPreInspections}
                    inspection={inspection}
                  />
                </PreInspectionItem>
              ))}
            </PreInspectionItems>
          </>
        )}
      </SelectPreInspectionView>
    )
  }
)

export default SelectPreInspection
