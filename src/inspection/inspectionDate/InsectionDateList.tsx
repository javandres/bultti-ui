import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionDate } from '../../schema-types'
import { Text } from '../../util/translate'
import { RemoveButton } from '../../common/components/Button'
import { LoadingDisplay } from '../../common/components/Loading'
import { useMutationData } from '../../util/useMutationData'
import { removeInspectionDateMutation } from './inspectionDateQuery'

const Header = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
  &:last-of-type {
    border-bottom: none;
  }
`
const ListItemDates = styled.div``

interface PropTypes {
  inspectionDates: InspectionDate[]
  isLoading: boolean
  refetchInspectionDateList: () => unknown
}

const InspectionDateList: React.FC<PropTypes> = observer(
  ({ inspectionDates, isLoading, refetchInspectionDateList }) => {
    const [removeInspectionDate] = useMutationData(removeInspectionDateMutation)

    const removeItem = async (inspectionDate: InspectionDate) => {
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
      <>
        <Header>
          <Text>inspection_date.list.header</Text>
        </Header>
        {isLoading ? (
          <LoadingDisplay />
        ) : (
          <>
            {inspectionDates.length === 0 && <Text>inspection_date.list.noResults</Text>}
            {inspectionDates.map((inspectionDate: InspectionDate, index: number) => {
              return (
                <ListItem key={index}>
                  <ListItemDates>
                    {inspectionDate.startDate} - {inspectionDate.endDate}
                  </ListItemDates>
                  <RemoveButton onClick={() => removeItem(inspectionDate)} />
                </ListItem>
              )
            })}
          </>
        )}
      </>
    )
  }
)

export default InspectionDateList
