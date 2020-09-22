import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import SelectDate from '../common/input/SelectDate'
import Input from '../common/input/Input'
import { ControlGroup, FormColumn, InputLabel } from '../common/components/form'
import { Inspection } from '../schema-types'
import { InspectionContext } from '../inspection/InspectionContext'
import { MessageContainer, MessageView } from '../common/components/Messages'
import ExpandableSection, { HeaderMainHeading } from '../common/components/ExpandableSection'
import { FlexRow } from '../common/components/common'

export type PropTypes = {
  isEditable: boolean
  onUpdateValue: (name: string) => (value: any) => void
}

const PostInspectionConfig: React.FC<PropTypes> = observer(({ onUpdateValue, isEditable }) => {
  let inspection: null | Inspection = useContext(InspectionContext)

  return (
    <ExpandableSection
      headerContent={
        <HeaderMainHeading style={{ borderRight: 0 }}>Perustiedot</HeaderMainHeading>
      }>
      {!inspection ? (
        <MessageContainer>
          <MessageView>Jälkitarkastus ei valittu.</MessageView>
        </MessageContainer>
      ) : (
        <FlexRow>
          <FormColumn>
            <InputLabel theme="light">Tuotantojakso</InputLabel>
            <ControlGroup>
              <SelectDate
                name="production_start"
                value={inspection.startDate}
                minDate={inspection.minStartDate}
                maxDate={inspection.season.endDate}
                onChange={onUpdateValue('startDate')}
                label="Alku"
                disabled={!isEditable}
                alignDatepicker="left"
              />
              <Input
                value={inspection.endDate}
                label="Loppu"
                subLabel={true}
                disabled={true}
              />
            </ControlGroup>
          </FormColumn>
          <FormColumn>
            <InputLabel theme="light">Tarkastusjakso</InputLabel>
            <ControlGroup>
              <SelectDate
                name="inspection_start"
                value={inspection.inspectionStartDate}
                onChange={onUpdateValue('inspectionStartDate')}
                label="Alku"
                disabled={!isEditable}
              />
              <SelectDate
                name="inspection_end"
                value={inspection.inspectionEndDate}
                minDate={inspection.inspectionStartDate}
                onChange={onUpdateValue('inspectionEndDate')}
                label="Loppu"
                disabled={!isEditable}
                alignDatepicker="right"
              />
            </ControlGroup>
          </FormColumn>
        </FlexRow>
      )}
    </ExpandableSection>
  )
})

export default PostInspectionConfig
