import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InitialPreInspectionInput, InspectionStatus, PreInspection } from '../schema-types'
import Loading from '../common/components/Loading'
import { orderBy } from 'lodash'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { FlexRow, MessageContainer, MessageView } from '../common/components/common'
import { useStateValue } from '../state/useAppState'
import { useMutationData } from '../util/useMutationData'
import { createPreInspectionMutation, removePreInspectionMutation } from './preInspectionQueries'
import { pickGraphqlData } from '../util/pickGraphqlData'

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

const PreInspectionItem = styled.div`
  padding: 0.75rem 1rem 0;
  border-radius: 5px;
  margin-bottom: 1rem;
  background: white;
  border: 1px solid var(--blue);
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

    // The highest version of
    let maxVersion = useMemo(
      () =>
        preInspections.reduce(
          (maxVersion, { version }) => (version > maxVersion ? version : maxVersion),
          1
        ),
      [preInspections]
    )

    let [createPreInspection, { loading: createLoading }] = useMutationData(
      createPreInspectionMutation
    )

    let [removePreInspection, { loading: removeLoading }] = useMutationData(
      removePreInspectionMutation
    )

    let onRemove = useCallback(
      async (preInspection) => {
        if (preInspection) {
          await removePreInspection({
            variables: {
              preInspectionId: preInspection.id,
            },
          })

          await refetchPreInspections()
        }
      },
      [removePreInspection, refetchPreInspections]
    )

    // Initialize the form by creating a pre-inspection on the server and getting the ID.
    let onCreatePreInspection = useCallback(async () => {
      // A pre-inspection can be created when there is not one currently existing or loading
      if (operator && season && !createLoading) {
        // InitialPreInspectionInput requires operator and season ID.
        let preInspectionInput: InitialPreInspectionInput = {
          operatorId: operator.id,
          seasonId: season.id,
          startDate: season.startDate,
          endDate: season.endDate,
        }

        let createResult = await createPreInspection({
          variables: {
            preInspectionInput,
          },
        })

        await refetchPreInspections()

        let newPreInspection = pickGraphqlData(createResult.data)

        if (newPreInspection) {
          onSelect(newPreInspection)
        } else {
          console.error(createResult.errors)
        }
      }
    }, [season, operator, createLoading, refetchPreInspections, onSelect])

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
                {operator.operatorName} / {season.id}
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
                <PreInspectionItem key="new">
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
                <PreInspectionItem key={preInspection.id}>
                  <ItemContent>
                    ID: {preInspection.id}
                    <br />
                    Version: {preInspection.version}
                    <br />
                    Start date: {preInspection.startDate}
                    <br />
                    End date: {preInspection.endDate}
                    <br />
                    Status: {preInspection.status}
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
                          onClick={() => onRemove(preInspection)}>
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
