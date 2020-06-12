import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ContractInput, ContractRuleInput, RuleType } from '../schema-types'
import ExpandableSection, {
  ContentWrapper,
  ExpandToggle,
} from '../common/components/ExpandableSection'
import { useQueryData } from '../util/useQueryData'
import { defaultContractRulesQuery } from './contractQueries'
import { createRuleId, mergeRules } from './contractUtils'
import { groupBy } from 'lodash'
import Input, { TextInput } from '../common/input/Input'
import Dropdown from '../common/input/Dropdown'
import { FlexRow } from '../common/components/common'
import { Button } from '../common/components/Button'

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

  ${TextInput}:disabled {
    border: 0;
    background: transparent;
    padding: 0.5rem 0 0.75rem;
  }
`

const RuleDescription = styled(Input)`
  margin-bottom: 1rem;
`

const RuleInputGroup = styled.div`
  flex: 1 1 100%;
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

type PendingRule = ContractRuleInput & { _isNew?: boolean }

function createPendingRule(): PendingRule {
  return {
    _isNew: true,
    category: '',
    condition: '',
    description: '',
    name: '',
    options: '',
    type: RuleType.ScalarValue,
    value: '',
  }
}

type RowProps = {
  rule: PendingRule
  onChange: (prop: string) => (evtOrValue: string | ChangeEvent) => unknown
}

const RuleEditorRow = ({ rule, onChange }: RowProps) => {
  return (
    <RuleRow key={createRuleId(rule)}>
      {rule._isNew && (
        <Dropdown
          style={{ marginBottom: '1rem' }}
          items={allowNameEdit}
          onSelect={onChange('category')}
          label="Kategoria"
          selectedItem={rule.category || allowNameEdit[0]}
        />
      )}
      <RuleInputGroup>
        <RuleInputWrapper>
          <RuleName
            onChange={onChange('name')}
            disabled={!rule._isNew && !allowNameEdit.includes(rule.category || '')}
            label="Säännön nimi"
            value={rule.name}
          />
        </RuleInputWrapper>
        {rule._isNew && (
          <RuleInputWrapper>
            <Dropdown
              items={Object.values(RuleType)}
              onSelect={onChange('type')}
              label="Säännön tyyppi"
              selectedItem={rule.type || RuleType.ScalarValue}
            />
          </RuleInputWrapper>
        )}
      </RuleInputGroup>
      <RuleDescription label="Kuvaus" value={rule.description} />
      <RuleInputGroup>
        <RuleInputWrapper>
          <Input value={rule.condition || ''} label="Ehto" name="condition" />
        </RuleInputWrapper>
        <RuleInputWrapper>
          <Input value={rule.value || ''} label="Arvo" name="value" />
        </RuleInputWrapper>
      </RuleInputGroup>
    </RuleRow>
  )
}

const ContractRuleEditor = observer(({ contract, onChange }: PropTypes) => {
  let { data: defaultRules, loading: defaultRulesLoading } = useQueryData(
    defaultContractRulesQuery
  )

  let rules: ContractRuleInput[] = useMemo(
    () => mergeRules(contract?.rules || [], defaultRules || []),
    [defaultRules, contract]
  )

  let [pendingRules, setPendingRules] = useState<ContractRuleInput[]>([])
  let [newPendingRule, setNewPendingRule] = useState<PendingRule | null>(null)

  useEffect(() => {
    if (pendingRules.length === 0 && rules.length !== 0) {
      setPendingRules(rules)
    }
  }, [pendingRules, rules])

  let createRuleChangeHandler = useCallback(
    (rule: ContractRuleInput) => (prop: string) => (evtOrValue) => {
      let nextVal = evtOrValue?.target?.value || evtOrValue

      setPendingRules((currentRules) => {
        let nextPendingRules = [...currentRules]
        rule[prop] = nextVal
        return nextPendingRules
      })
    },
    []
  )

  let onCreateNewRule = useCallback(() => {
    setNewPendingRule((currentPending) => {
      if (!currentPending) {
        return createPendingRule()
      }

      return currentPending
    })
  }, [])

  let onNewRuleChange = useCallback(
    (prop) => (evtOrValue) => {
      let nextVal = evtOrValue?.target?.value || evtOrValue
      setNewPendingRule((currentRule) => {
        let nextRule = !currentRule ? createPendingRule() : { ...currentRule }
        nextRule[prop] = nextVal
        return nextRule
      })
    },
    []
  )

  return (
    <ContractRuleEditorView>
      {newPendingRule ? (
        <RuleCategory>
          <CategoryTitle>{newPendingRule?.category || 'Ei kategoriaa'}</CategoryTitle>
          <RuleEditorRow rule={newPendingRule} onChange={onNewRuleChange} />
        </RuleCategory>
      ) : (
        <FlexRow>
          <Button onClick={onCreateNewRule}>Uusi sääntö</Button>
        </FlexRow>
      )}
      {Object.entries(groupBy(pendingRules, 'category')).map(([category, rules]) => {
        return (
          <RuleCategory key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            {rules.map((rule) => {
              let onRuleChange = createRuleChangeHandler(rule)
              return <RuleEditorRow rule={rule} onChange={onRuleChange} />
            })}
          </RuleCategory>
        )
      })}
    </ContractRuleEditorView>
  )
})

export default ContractRuleEditor
