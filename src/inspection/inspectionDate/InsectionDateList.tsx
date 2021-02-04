import React from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { InspectionDate } from '../../schema-types'
import { Text } from '../../util/translate'
import { RemoveButton } from '../../common/components/Button'
import { LoadingDisplay } from '../../common/components/Loading'
import { useMutationData } from '../../util/useMutationData'
import { removeInspectionDateMutation } from './inspectionDateQuery'
import DateRangeDisplay from '../../common/components/DateRangeDisplay'
import { MessageView } from '../../common/components/Messages'

const Header = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

const ListWrapper = styled.div`
  margin: 0 0 1rem;
`

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 -1rem;
  padding: 0.5rem 1rem;

  &:nth-child(even) {
    background: var(--white-grey);
  }
`

interface PropTypes {
  inspectionDates: InspectionDate[]
  isLoading: boolean
  refetchInspectionDateList: () => unknown
}

const InspectionDateList: React.FC<PropTypes> = observer(
  ({ inspectionDates, isLoading, refetchInspectionDateList }) => {
    let [removeInspectionDate] = useMutationData(removeInspectionDateMutation)

    let removeItem = async (inspectionDate: InspectionDate) => {
      // TODO: validate that inspection date is not being used at Inspections
      // or even better: don't display remove button if you cannot remove due to that reason ^
      if (
        confirm(
          `Haluatko varmasti poistaa tarkistuspäivämäärän ${inspectionDate.startDate} - ${inspectionDate.endDate}`
        )
      ) {
        await removeInspectionDate({
          variables: {
            id: inspectionDate.id,
          },
        })

        refetchInspectionDateList()
      }
    }
    return (
      <ListWrapper>
        <Header>
          <Text>inspectionDateList_header</Text>
        </Header>
        {isLoading ? (
          <LoadingDisplay />
        ) : (
          <>
            {inspectionDates.length === 0 && (
              <MessageView>
                <Text>inspectionDateList_noResults</Text>
              </MessageView>
            )}
            {inspectionDates.map((inspectionDate: InspectionDate, index: number) => {
              return (
                <ListItem key={index}>
                  <DateRangeDisplay
                    startDate={inspectionDate.startDate}
                    endDate={inspectionDate.endDate}
                  />
                  <RemoveButton onClick={() => removeItem(inspectionDate)} />
                </ListItem>
              )
            })}
          </>
        )}
      </ListWrapper>
    )
  }
)

export default InspectionDateList
