import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { Inspection, InspectionType } from '../schema-types'
import { orderBy } from 'lodash'
import { FlexRow } from '../common/components/common'
import { useStateValue } from '../state/useAppState'
import {
  getInspectionTypeStrings,
  useCanEditInspection,
  useCreateInspection,
  useNavigateToInspection,
} from './inspectionUtils'
import { MessageContainer, MessageView } from '../common/components/Messages'
import { Plus } from '../common/icon/Plus'
import { LoadingDisplay } from '../common/components/Loading'
import InspectionCard from './InspectionCard'
import { Text } from '../util/translate'
import { operatorIsValid } from '../common/input/SelectOperator'
import { seasonIsValid } from '../common/input/SelectSeason'

const SelectInspectionView = styled.div`
  position: relative;
`

const InspectionItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 1rem 0 0;
`

const HeaderRow = styled(FlexRow)`
  padding: 0 1rem;
  min-height: 35px;
  align-items: center;
`

const ListHeading = styled.h4`
  margin: 0 1rem 0 0;
`

const NewInspection = styled.button`
  background: white;
  border: 3px dashed var(--lighter-grey);
  border-radius: 1rem;
  font-family: inherit;
  padding: 1rem;
  font-weight: bold;
  color: var(--light-grey);
  font-size: 1.5rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
  flex: 0 0 25rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.1s ease-out;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
  outline: 0;
  min-height: 13.3rem;

  * {
    margin: 0;
  }

  &:hover {
    box-shadow: 0 0 15px 3px rgba(0, 0, 0, 0.1);
    border-color: var(--light-grey);
  }
`

const ItemContent = styled.div`
  line-height: 1.4;
  position: relative;
`

export type PropTypes = {
  inspections?: Inspection[]
  inspectionType: InspectionType
  refetchInspections: () => unknown
  loading?: boolean
}

/**
 * - Display current in-production pre-inspection
 * - Display current draft pre-inspection
 * - Create a new pre-inspection draft (if no pre-inspection exists for the operator/season combo)
 * - Create a new pre-inspection draft that extends the in-production version
 * - Delete the current draft
 */

const SelectInspection: React.FC<PropTypes> = observer(
  ({ inspections = [], inspectionType, refetchInspections, loading = false }) => {
    var [globalSeason] = useStateValue('globalSeason')
    var [globalOperator] = useStateValue('globalOperator')

    let canCreateInspection = useCanEditInspection({
      inspectionType,
      operatorId: globalOperator.id,
    })

    var navigateToInspection = useNavigateToInspection(inspectionType)

    // Initialize the form by creating a pre-inspection on the server and getting the ID.
    let createInspection = useCreateInspection(globalOperator, globalSeason, inspectionType)

    let onCreateInspection = useCallback(async () => {
      let createdInspection = await createInspection()

      if (createdInspection) {
        navigateToInspection(createdInspection)
      }

      await refetchInspections()
    }, [createInspection, refetchInspections, navigateToInspection])

    let typeStrings = getInspectionTypeStrings(inspectionType)

    return (
      <SelectInspectionView>
        <LoadingDisplay loading={loading} />
        {!operatorIsValid(globalOperator) || !seasonIsValid(globalSeason) ? (
          <MessageContainer>
            <MessageView>
              <Text>inspectionPage_selectOperatorAndSeason</Text>
            </MessageView>
          </MessageContainer>
        ) : (
          <>
            <HeaderRow>
              <ListHeading>
                {globalOperator.operatorName} /{' '}
                {typeof globalSeason === 'string' ? globalSeason : globalSeason?.id}
              </ListHeading>
            </HeaderRow>
            <InspectionItems>
              {canCreateInspection && (
                <NewInspection
                  data-cy="create_new_pre_inspection"
                  onClick={onCreateInspection}>
                  <ItemContent>
                    <Plus fill="var(--lighter-grey)" width="4rem" height="4rem" />
                  </ItemContent>
                  <ItemContent style={{ marginTop: 0 }}>
                    <Text keyValueMap={{ prefix: typeStrings.prefixLC }}>
                      inspectionPage_createNewInspection
                    </Text>
                  </ItemContent>
                </NewInspection>
              )}
              {orderBy(inspections, ['inspectionStartDate', 'version'], ['desc', 'desc']).map(
                (inspection, idx) => (
                  <InspectionCard
                    testId={`pre_inspection_${idx}`}
                    key={inspection.id}
                    onRefresh={refetchInspections}
                    inspection={inspection}
                  />
                )
              )}
            </InspectionItems>
          </>
        )}
      </SelectInspectionView>
    )
  }
)

export default SelectInspection
