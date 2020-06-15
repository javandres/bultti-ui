import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ContractInput, ContractRuleInput, RuleType } from '../schema-types'
import ExpandableSection, {
  ContentWrapper,
  ExpandToggle,
} from '../common/components/ExpandableSection'
import { useQueryData } from '../util/useQueryData'
import { defaultContractRulesQuery } from './contractQueries'
import { createRuleId } from './contractUtils'
import { groupBy, omit } from 'lodash'
import Input, { TextInput } from '../common/input/Input'
import Dropdown from '../common/input/Dropdown'
import { FlexRow } from '../common/components/common'
import { Button } from '../common/components/Button'
import producer from 'immer'

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

const CategoryFooter = styled(FlexRow)`
  padding: 0.75rem 1rem;
  justify-content: flex-end;
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

// Rule categories for which editing rule names and adding/removing rules is allowed.
const categoryAllowFullEdit = ['equipmentType']

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
  onChange: (nextRule: PendingRule) => unknown
}

const RuleEditorRow = ({ rule, onChange }: RowProps) => {
  let [ruleUpdateBuffer, setBuffer] = useState<PendingRule | null>(null)

  useEffect(() => {
    setBuffer({ ...rule })
  }, [rule])

  let onChangeProp = useCallback(
    (prop) => (evtOrValue) => {
      let nextVal = evtOrValue?.target?.value || evtOrValue

      setBuffer((currentRule) => {
        let nextRule = { ...(currentRule || rule) }
        nextRule[prop] = nextVal
        return nextRule
      })
    },
    [rule]
  )

  let flushBuffer = useCallback(() => {
    if (ruleUpdateBuffer) {
      onChange(ruleUpdateBuffer)
    }
  }, [ruleUpdateBuffer, onChange])

  return (
    <RuleRow onBlur={flushBuffer}>
      {rule._isNew && (
        <Dropdown
          style={{ marginBottom: '1rem' }}
          items={categoryAllowFullEdit}
          onSelect={onChangeProp('category')}
          label="Kategoria"
          selectedItem={ruleUpdateBuffer?.category || categoryAllowFullEdit[0]}
        />
      )}
      <RuleInputGroup>
        <RuleInputWrapper>
          <RuleName
            onChange={onChangeProp('name')}
            disabled={
              !(
                rule._isNew ||
                !ruleUpdateBuffer?.name ||
                categoryAllowFullEdit.includes(ruleUpdateBuffer?.category || '')
              )
            }
            label="Säännön nimi"
            value={ruleUpdateBuffer?.name || ''}
          />
        </RuleInputWrapper>
        {rule._isNew && (
          <RuleInputWrapper>
            <Dropdown
              items={Object.values(RuleType)}
              onSelect={onChangeProp('type')}
              label="Säännön tyyppi"
              selectedItem={ruleUpdateBuffer?.type || RuleType.ScalarValue}
            />
          </RuleInputWrapper>
        )}
      </RuleInputGroup>
      <RuleDescription
        label="Kuvaus"
        value={ruleUpdateBuffer?.description || ''}
        onChange={onChangeProp('description')}
      />
      <RuleInputGroup>
        <RuleInputWrapper>
          <Input
            value={ruleUpdateBuffer?.condition || ''}
            label="Ehto"
            name="condition"
            onChange={onChangeProp('condition')}
          />
        </RuleInputWrapper>
        <RuleInputWrapper>
          <Input
            value={ruleUpdateBuffer?.value || ''}
            label="Arvo"
            name="value"
            onChange={onChangeProp('value')}
          />
        </RuleInputWrapper>
      </RuleInputGroup>
    </RuleRow>
  )
}

const ContractRuleEditor = observer(({ contract, onChange }: PropTypes) => {
  let isDirty = useRef(false)
  let { data: defaultRules } = useQueryData(defaultContractRulesQuery)

  // Populate the rules editor
  let rules: ContractRuleInput[] = useMemo(
    () =>
      ((contract?.rules || []).length === 0
        ? defaultRules || []
        : contract?.rules
      ).map((defRule) => omit(defRule, ['__typename'])),
    [defaultRules, contract.rules]
  )

  let [pendingRules, setPendingRules] = useState<ContractRuleInput[]>([])
  let [newPendingRule, setNewPendingRule] = useState<PendingRule | null>(null)

  useEffect(() => {
    if (rules.length !== 0) {
      setPendingRules(rules)
      isDirty.current = false
    }
  }, [rules])

  useEffect(() => {
    if (pendingRules.length !== 0 && isDirty.current) {
      onChange(pendingRules)
    }
  }, [pendingRules, isDirty.current])

  let onRuleChange = useCallback((rule: ContractRuleInput) => {
    let ruleId = createRuleId(rule)

    setPendingRules(
      producer((draftRules) => {
        let draftRuleIndex = draftRules.findIndex((dr) => createRuleId(dr) === ruleId)

        if (draftRuleIndex !== -1) {
          draftRules.splice(draftRuleIndex, 1, rule)
        }
      })
    )

    isDirty.current = true
  }, [])

  let onCreateNewRule = useCallback(() => {
    setNewPendingRule((currentPending) => {
      if (!currentPending) {
        return createPendingRule()
      }

      return currentPending
    })
  }, [])

  let onSaveNewRule = useCallback(() => {
    setPendingRules((currentRules) => {
      if (!newPendingRule) {
        return currentRules
      }

      let nextRules = [...currentRules]
      nextRules.push(omit(newPendingRule, '_isNew'))

      return nextRules
    })

    setNewPendingRule(null)
    isDirty.current = true
  }, [newPendingRule])

  return (
    <ContractRuleEditorView>
      {newPendingRule ? (
        <RuleCategory>
          <CategoryTitle>{newPendingRule?.category || 'Ei kategoriaa'}</CategoryTitle>
          <RuleEditorRow rule={newPendingRule} onChange={setNewPendingRule} />
          <CategoryFooter>
            <Button onClick={onSaveNewRule}>Lisää sääntö</Button>
          </CategoryFooter>
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
            {rules.map((rule) => (
              <RuleEditorRow rule={rule} onChange={onRuleChange} key={createRuleId(rule)} />
            ))}
          </RuleCategory>
        )
      })}
    </ContractRuleEditorView>
  )
})

export default ContractRuleEditor
