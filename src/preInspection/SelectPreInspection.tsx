import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionStatus, PreInspection } from '../schema-types'
import Loading from '../common/components/Loading'
import { orderBy } from 'lodash'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import {
  FlexRow,
  MessageContainer,
  MessageView,
  SubSectionHeading,
} from '../common/components/common'
import { useStateValue } from '../state/useAppState'
import { useCreatePreInspection, useRemovePreInspection } from './preInspectionUtils'
import { parseISO, format } from 'date-fns'
import { READABLE_DATE_FORMAT } from '../constants'

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

const InspectionTitle = styled(SubSectionHeading)`
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
      : 'var(--light-green)'};
  color: white;
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
  preInspections?: PreInspection[]
  refetchPreInspections: () => unknown
  loading?: boolean
  onSelect: (value: PreInspection | null) => unknown
}

/**
 * - Display current in-production pre-inspection
 * - Display current draft pre-inspection
 * - Create a new pre-inspection draft (if no pre-inspection exists for the operator/season combo)
 * - Create a new pre-inspection draft that extends the in-production version
 * - Delete the current draft
 */

const SelectPreInspection: React.FC<PropTypes> = observer(
  ({ preInspections = [], refetchPreInspections, loading = false, onSelect }) => {
    var [season] = useStateValue('globalSeason')
    var [operator] = useStateValue('globalOperator')

    // The highest version among current pre-inspections
    let maxVersion = useMemo(
      () =>
        preInspections.reduce(
          (maxVersion, { version }) => (version > maxVersion ? version : maxVersion),
          1
        ),
      [preInspections]
    )

    let [removePreInspection, { loading: removeLoading }] = useRemovePreInspection(
      refetchPreInspections
    )

    // Initialize the form by creating a pre-inspection on the server and getting the ID.
    let createPreInspection = useCreatePreInspection(operator, season)

    let onCreatePreInspection = useCallback(async () => {
      let createdPreInspection = await createPreInspection()

      if (createdPreInspection) {
        onSelect(createdPreInspection)
      }

      await refetchPreInspections()
    }, [createPreInspection, refetchPreInspections, onSelect])

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
              {!preInspections.some((pi) => pi.status === InspectionStatus.Draft) && (
                <PreInspectionItem key="new" status="new">
                  <ItemContent style={{ marginTop: 0 }}>
                    Tällä hetkellä ei ole keskeneräisiä ennakkotarkastuksia, joten voit luoda uuden.
                  </ItemContent>
                  {preInspections.some((pi) => pi.status === InspectionStatus.InProduction) && (
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
              {orderBy(preInspections, 'version', 'desc').map((preInspection) => (
                <PreInspectionItem key={preInspection.id} status={preInspection.status}>
                  <ItemContent>
                    <InspectionTitle>
                      {preInspection.operator.operatorName}, {preInspection.season.id}
                    </InspectionTitle>
                    <InspectionVersion>{preInspection.version}</InspectionVersion>
                    <InspectionStatusDisplay status={preInspection.status}>
                      {preInspection.status === InspectionStatus.Draft
                        ? 'Muokattavissa'
                        : 'Tuotannossa'}
                    </InspectionStatusDisplay>
                    <InspectionPeriodDisplay>
                      <DateTitle>Tuotantojakso</DateTitle>
                      <StartDate>
                        {format(parseISO(preInspection.startDate), READABLE_DATE_FORMAT)}
                      </StartDate>
                      <EndDate>
                        {format(parseISO(preInspection.endDate), READABLE_DATE_FORMAT)}
                      </EndDate>
                    </InspectionPeriodDisplay>
                  </ItemContent>
                  <ButtonRow>
                    {preInspection.status === InspectionStatus.Draft ? (
                      <>
                        <Button
                          buttonStyle={ButtonStyle.NORMAL}
                          size={ButtonSize.MEDIUM}
                          onClick={() => onSelect(preInspection)}>
                          Muokkaa
                        </Button>
                        <Button
                          style={{ marginLeft: 'auto', marginRight: 0 }}
                          loading={removeLoading}
                          buttonStyle={ButtonStyle.REMOVE}
                          size={ButtonSize.MEDIUM}
                          onClick={() => removePreInspection(preInspection)}>
                          Poista
                        </Button>
                      </>
                    ) : preInspection.status === InspectionStatus.InProduction ? (
                      <>
                        {preInspection.version >= maxVersion && (
                          <Button
                            buttonStyle={ButtonStyle.NORMAL}
                            size={ButtonSize.MEDIUM}
                            onClick={onCreatePreInspection}>
                            Korvaa
                          </Button>
                        )}
                        <Button buttonStyle={ButtonStyle.NORMAL} size={ButtonSize.MEDIUM}>
                          Raportit
                        </Button>
                      </>
                    ) : null}
                  </ButtonRow>
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
