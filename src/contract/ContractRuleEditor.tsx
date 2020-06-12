import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ContractInput, ContractRuleInput } from '../schema-types'
import ExpandableSection, {
  ContentWrapper,
  ExpandToggle,
} from '../common/components/ExpandableSection'
import { useQueryData } from '../util/useQueryData'
import { defaultContractRulesQuery } from './contractQueries'
import { createRuleId, mergeRules } from './contractUtils'
import { groupBy } from 'lodash'
import Input from '../common/input/Input'

const ContractRuleEditorView = styled(ExpandableSection)`
  margin-top: -2.75rem;
  border: 0;
  background: transparent;

  ${ContentWrapper} {
    padding: 0;
  }

  ${ExpandToggle} {
    padding: 1rem;
    border-radius: 0.25rem;
    background: var(--white-grey);
    margin-bottom: 0.5rem;
  }
`

const CategoryTitle = styled.h4`
  text-transform: capitalize;
  font-size: 1.1rem;
  padding: 1rem;
  margin: 0;
  border-bottom: 1px solid var(--lighter-grey);
`

const RuleCategory = styled.div`
  margin: 1rem 0;
  border: 1px solid var(--lighter-grey);
  border-radius: 0.5rem;

  &:first-child {
    margin-top: 0;
  }
`

const RuleRow = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--lighter-grey);

  &:nth-child(even) {
    background: var(--white-grey);
  }

  &:last-child {
    border-bottom: 0;
  }
`

const RuleName = styled(Input)`
  margin-bottom: 1rem;
`

const RuleDescription = styled(Input)``

const RuleInputs = styled.div`
  margin: 1rem 0;
  flex: 1 1 50%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
`

const RuleInputWrapper = styled.div`
  flex: 1 1 auto;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
`

export type PropTypes = {
  contract: ContractInput
  onChange: (rules: ContractRuleInput[]) => unknown
}

// Rule categories for which editing rule names is allowed.
const allowNameEdit = ['equipmentType']

const ContractRuleEditor = observer(({ contract, onChange }: PropTypes) => {
  let { data: defaultRules, loading: defaultRulesLoading } = useQueryData(
    defaultContractRulesQuery
  )

  let rules: ContractRuleInput[] = useMemo(
    () => mergeRules(contract?.rules || [], defaultRules || []),
    [defaultRules, contract]
  )

  let [pendingRules, setPendingRules] = useState<ContractRuleInput[]>([])

  useEffect(() => {
    if (pendingRules.length === 0 && rules.length !== 0) {
      setPendingRules(rules)
    }
  }, [pendingRules, rules])

  let onRulesChange = useCallback(() => {}, [])

  return (
    <ContractRuleEditorView>
      {Object.entries(groupBy(pendingRules, 'category')).map(([category, rules]) => {
        return (
          <RuleCategory key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            {rules.map((rule) => (
              <RuleRow key={createRuleId(rule)}>
                <RuleName label="Säännön nimi" value={rule.name} />
                <RuleDescription label="Kuvaus" value={rule.description} />
                <RuleInputs>
                  <RuleInputWrapper>
                    <Input value={rule.condition || ''} label="Ehto" name="condition" />
                  </RuleInputWrapper>
                  <RuleInputWrapper>
                    <Input value={rule.value || ''} label="Arvo" name="value" />
                  </RuleInputWrapper>
                </RuleInputs>
              </RuleRow>
            ))}
          </RuleCategory>
        )
      })}
    </ContractRuleEditorView>
  )
})

export default ContractRuleEditor
