import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { observer } from 'mobx-react-lite'
import { InspectionDateInput } from '../../schema-types'
import ItemForm from '../../common/input/ItemForm'
import { useMutationData } from '../../util/useMutationData'
import { createInspectionDateMutation } from './inspectionDateQuery'
import { Text, text } from '../../util/translate'
import { PageSection } from '../../common/components/common'
import DatePicker from '../../common/input/DatePicker'

const InspectionDateFormContainer = styled(PageSection)``

const Header = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`

const inspectionDateLabels = {
  startDate: text('startDate'),
  endDate: text('endDate'),
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

    let onDone = useCallback(() => {
      let inspectionDateInput: InspectionDateInput = {
        startDate: pendingInspectionDate.startDate,
        endDate: pendingInspectionDate.endDate,
      }

      createInspectionDate({
        variables: {
          inspectionDateInput,
        },
      }).then(() => {
        closeInspectionDateList()
        refetchInspectionDateList()
      })
    }, [refetchInspectionDateList, closeInspectionDateList, pendingInspectionDate])

    let onChange = (key, nextValue) => {
      setPendingInspectionDate((currentVal) => {
        return {
          ...currentVal,
          [key]: nextValue,
        }
      })
    }

    let renderInput = (key: string, val: any, onChange) => {
      if (key === 'startDate') {
        return (
          <DatePicker
            onChange={onChange}
            value={val as string}
            label=""
            acceptableDayTypes={['Ma']}
            maxDate={pendingInspectionDate.endDate}
          />
        )
      }
      if (key === 'endDate') {
        return (
          <DatePicker
            onChange={onChange}
            value={val as string}
            label=""
            acceptableDayTypes={['Su']}
            minDate={pendingInspectionDate.startDate}
          />
        )
      }
      return <React.Fragment />
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
          <Text>inspectionDateForm_header</Text>
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
