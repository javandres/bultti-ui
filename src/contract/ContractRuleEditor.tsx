import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Contract } from '../schema-types'

const ContractRuleEditorView = styled.div``

export type PropTypes = {
  contract: Contract
}

const ContractRuleEditor = observer(({ contract }: PropTypes) => {
  return <ContractRuleEditorView>Rule editor WIP</ContractRuleEditorView>
})

export default ContractRuleEditor
