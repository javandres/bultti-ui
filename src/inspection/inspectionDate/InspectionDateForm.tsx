import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { InspectionDateInput } from '../../schema-types'
import ItemForm from '../../common/input/ItemForm'
import { useMutationData } from '../../util/useMutationData'
import { createInspectionDateMutation } from './inspectionDateQuery'
import { Text, text } from '../../util/translate'
import SelectDate from '../../common/input/SelectDate'

const InspectionDateFormContainer = styled.div`
  background-color: white;
  padding: 1rem;
`

const Header = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`

const inspectionDateLabels = {
  startDate: text('start_date'),
  endDate: text('end_date'),
}

interface PropTypes {
  closeInspectionDateList: () => void
  refetchInspectionDateList: () => unknown
}

const InspectionDateForm: React.FC<PropTypes> = observer(
  ({ closeInspectionDateList, refetchInspectionDateList }) => {
    const [pendingInspectionDate, setPendingInspectionDate] = useState<
      Partial<InspectionDateInput>
    >({
      startDate: '',
      endDate: '',
    })

    let [createInspectionDate] = useMutationData(createInspectionDateMutation)

    let onDone = async () => {
      let inspectionDateInput: InspectionDateInput = {
        startDate: pendingInspectionDate.startDate,
        endDate: pendingInspectionDate.endDate,
      }

      await createInspectionDate({
        variables: {
          inspectionDateInput,
        },
      })

      refetchInspectionDateList()
      closeInspectionDateList()
    }

    let onChange = (key, nextValue) => {
      setPendingInspectionDate((currentVal) => {
        return {
          ...currentVal,
          [key]: nextValue,
        }
      })
    }

    let renderInput = (key: string, val: any, onChange) => {
      return <SelectDate onChange={onChange} value={val as string} label="" name={key} />
    }

    // TODO: implement better validation
    let isValid: boolean = useMemo(() => {
      return (
        pendingInspectionDate.startDate.length > 0 && pendingInspectionDate.endDate.length > 0
      )
    }, [pendingInspectionDate])

    return (
      <InspectionDateFormContainer>
        <Header>
          <Text>inspection_date.form.header</Text>
        </Header>
        <ItemForm
          item={pendingInspectionDate}
          labels={inspectionDateLabels}
          renderInput={renderInput}
          onDone={onDone}
          onChange={onChange}
          onCancel={() => closeInspectionDateList()}
          doneDisabled={!isValid}
          keyFromItem={(item) => item.id}
        />
      </InspectionDateFormContainer>
    )
  }
)

export default InspectionDateForm
