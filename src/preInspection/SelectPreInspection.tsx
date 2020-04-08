import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQueryData } from '../util/useQueryData'
import {
  InitialPreInspectionInput,
  InspectionStatus,
  Operator,
  PreInspection,
  Season,
} from '../schema-types'
import {
  createPreInspectionMutation,
  preInspectionsByOperatorAndSeasonQuery,
  removePreInspectionMutation,
} from './preInspectionQueries'
import { useMutationData } from '../util/useMutationData'
import { PageLoading } from '../common/components/Loading'
import { orderBy } from 'lodash'
import { Button, ButtonSize, ButtonStyle } from '../common/components/Button'
import { pickGraphqlData } from '../util/pickGraphqlData'
import { MessageContainer, MessageView } from '../common/components/common'

const SelectPreInspectionView = styled.div``

const PreInspectionItems = styled.div`
  display: flex;
  padding: 0 0 0 1rem;
`

const PreInspectionItem = styled.div`
  padding: 0.75rem 1rem 0;
  border-radius: 5px;
  margin-bottom: 1rem;
  background: white;
  border: 1px solid var(--blue);
  font-family: inherit;
  text-align: left;
  line-height: 1.4;
  width: 20rem;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
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
  justify-content: space-between;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`

export type PropTypes = {
  operator: Operator | null
  season: Season | null
  onSelect: (value: PreInspection | null) => unknown
  currentPreInspection: PreInspection | null
}

/**
 * - Display current in-production pre-inspection
 * - Display current draft pre-inspection
 * - Create a new pre-inspection draft (if no pre-inspection exists for the operator/season combo)
 * - Create a new pre-inspection draft that extends the in-production version
 * - Delete the current draft
 */

const SelectPreInspection: React.FC<PropTypes> = observer(
  ({ operator, season, onSelect, currentPreInspection }) => {
    let { data: preInspectionsData, loading, refetch } = useQueryData<PreInspection>(
      preInspectionsByOperatorAndSeasonQuery,
      {
        skip: !operator || !season,
        notifyOnNetworkStatusChange: true,
        variables: {
          operatorId: operator?.id,
          seasonId: season?.id,
        },
      }
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

          await refetch()
        }
      },
      [removePreInspection, refetch]
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

        await refetch()

        let newPreInspection = pickGraphqlData(createResult.data)

        if (newPreInspection) {
          onSelect(newPreInspection)
        } else {
          console.error(createResult.errors)
        }
      }
    }, [season, operator, createLoading, refetch, onSelect])

    let preInspections = useMemo(() => preInspectionsData || [], [preInspectionsData])

    return (
      <SelectPreInspectionView>
        {(loading || createLoading) && <PageLoading />}
        {!operator || !season ? (
          <MessageContainer>
            <MessageView>Valitse liikennöitsijä ja kausi.</MessageView>
          </MessageContainer>
        ) : (
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
                    size={ButtonSize.MEDIUM}
                    onClick={onCreatePreInspection}>
                    Uusi ennakkotarkastus
                  </Button>
                </ButtonRow>
              </PreInspectionItem>
            )}
            {orderBy(preInspections, 'version').map((preInspection) => (
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
                  {preInspection.status === InspectionStatus.Draft && (
                    <>
                      <Button
                        buttonStyle={ButtonStyle.NORMAL}
                        size={ButtonSize.MEDIUM}
                        onClick={() => onSelect(preInspection)}>
                        Muokkaa
                      </Button>
                      <Button
                        loading={removeLoading}
                        buttonStyle={ButtonStyle.REMOVE}
                        size={ButtonSize.MEDIUM}
                        onClick={() => onRemove(preInspection)}>
                        Poista
                      </Button>
                    </>
                  )}
                  {preInspection.status === InspectionStatus.InProduction && (
                    <>
                      <Button
                        buttonStyle={ButtonStyle.NORMAL}
                        size={ButtonSize.MEDIUM}
                        onClick={onCreatePreInspection}>
                        Korvaa
                      </Button>
                    </>
                  )}
                </ButtonRow>
              </PreInspectionItem>
            ))}
          </PreInspectionItems>
        )}
      </SelectPreInspectionView>
    )
  }
)

export default SelectPreInspection
