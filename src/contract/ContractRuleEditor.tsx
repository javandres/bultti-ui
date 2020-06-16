import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { ContractInput, ContractRule, ContractRuleInput, RuleType } from '../schema-types'
import { useQueryData } from '../util/useQueryData'
import { defaultContractRulesQuery } from './contractQueries'
import { createRuleId } from './contractUtils'
import { groupBy } from 'lodash'
import Input, { TextInput } from '../common/input/Input'
import Dropdown from '../common/input/Dropdown'
import { FlexRow } from '../common/components/common'
import { Button, ButtonStyle, RemoveButton } from '../common/components/Button'
import producer from 'immer'
import produce from 'immer'
import { CrossThick } from '../common/icon/CrossThick'

const ContractRuleEditorView = styled.div``

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

  & > * {
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
`

const RuleCategory = styled.div`
  margin: 0;
  border-top: 1px solid var(--lighter-grey);
`

const ToolRow = styled(FlexRow)`
  border-top: 1px solid var(--lighter-grey);
  padding: 1rem;
`

const RuleRow = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--lighter-grey);
  position: relative;

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
  width: 100%;
`

const RuleInputGroup = styled.div`
  flex: 1 1 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
`

const RuleInputWrapper = styled.div`
  flex: 1 0 calc(50% - 1rem);
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
`

const RemoveRuleButton = styled(RemoveButton)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`

export type PropTypes = {
  contract: ContractInput
  onChange: (rules: ContractRuleInput[]) => unknown
}

// Rule categories for which editing rule names and adding/removing rules is allowed.
const categoryAllowFullEdit = ['equipmentType']

type PendingRule = ContractRuleInput & { _isNew?: boolean }

export function createRuleInput(rule?: ContractRule): ContractRuleInput {
  return {
    category: rule?.category || categoryAllowFullEdit[0] || '',
    condition: rule?.condition || '',
    description: rule?.description || '',
    name: rule?.name || '',
    options: rule?.options || '',
    type: rule?.type || RuleType.ScalarValue,
    value: rule?.value || '',
  }
}

function createPendingRule(): PendingRule {
  return { ...createRuleInput(), _isNew: true }
}

type RowProps = {
  rule: PendingRule
  onChange: (nextRule: PendingRule) => unknown
  onRemove?: (rule: PendingRule) => unknown
  useBuffer?: boolean
}

const RuleEditorRow = ({ rule, onChange, onRemove, useBuffer = true }: RowProps) => {
  let [ruleUpdateBuffer, setBuffer] = useState<PendingRule | null>(null)

  useEffect(() => {
    setBuffer({ ...rule })
  }, [rule])

  let onChangeProp = useCallback(
    (prop: string) => (evtOrValue) => {
      let nextVal = evtOrValue?.target?.value || evtOrValue

      let createNextRule = produce((draftRule) => {
        draftRule[prop] = nextVal
      })

      if (useBuffer) {
        setBuffer(createNextRule)
      } else {
        onChange(createNextRule(rule))
      }
    },
    [rule, useBuffer, onChange]
  )

  let flushBuffer = useCallback(() => {
    if (ruleUpdateBuffer && useBuffer) {
      onChange(ruleUpdateBuffer)
    }
  }, [ruleUpdateBuffer, onChange, useBuffer])

  return (
    <RuleRow onBlur={flushBuffer}>
      <div>
        {rule._isNew && (
          <Dropdown
            style={{ marginBottom: '1rem' }}
            items={categoryAllowFullEdit}
            onSelect={onChangeProp('category')}
            label="Kategoria"
            selectedItem={ruleUpdateBuffer?.category}
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
        <RuleInputGroup>
          <RuleDescription
            label="Kuvaus"
            value={ruleUpdateBuffer?.description || ''}
            onChange={onChangeProp('description')}
          />
        </RuleInputGroup>
        <RuleInputGroup>
          {rule.type === RuleType.ConditionalValue && (
            <RuleInputWrapper>
              <Input
                value={ruleUpdateBuffer?.condition || ''}
                label="Ehto"
                name="condition"
                onChange={onChangeProp('condition')}
              />
            </RuleInputWrapper>
          )}
          <RuleInputWrapper>
            <Input
              value={ruleUpdateBuffer?.value || ''}
              label="Arvo"
              name="value"
              onChange={onChangeProp('value')}
            />
          </RuleInputWrapper>
        </RuleInputGroup>
      </div>
      {onRemove && categoryAllowFullEdit.includes(rule.category) && (
        <RemoveRuleButton onClick={() => onRemove(rule)}>
          <CrossThick fill="white" width="0.5rem" height="0.5rem" />
        </RemoveRuleButton>
      )}
    </RuleRow>
  )
}

const ContractRuleEditor = observer(({ contract, onChange }: PropTypes) => {
  let { data: defaultRules } = useQueryData(defaultContractRulesQuery)

  // Populate the rules editor. If no rules in the contract, use the default rules.
  // Remove __typename from all rule objects by creating rule input objects.
  let rules: ContractRuleInput[] = useMemo(
    () =>
      ((contract?.rules || []).length === 0 ? defaultRules || [] : contract?.rules).map(
        createRuleInput
      ),
    [defaultRules, contract.rules]
  )

  let [newPendingRule, setNewPendingRule] = useState<PendingRule | undefined>(undefined)

  let onRuleChange = useCallback(
    (rule: ContractRuleInput) => {
      let ruleId = createRuleId(rule)

      let createNextValue = producer((draftRules) => {
        let draftRuleIndex = draftRules.findIndex((dr) => createRuleId(dr) === ruleId)

        if (draftRuleIndex !== -1) {
          draftRules.splice(draftRuleIndex, 1, rule)
        } else {
          draftRules.push(rule)
        }
      })

      onChange(createNextValue(rules))
    },
    [rules]
  )

  let onCreateNewRule = useCallback(() => {
    setNewPendingRule((currentPending) => {
      if (!currentPending) {
        return createPendingRule()
      }

      return currentPending
    })
  }, [])

  let newRuleIsValid = useMemo(
    () =>
      // It needs to have a name
      newPendingRule?.name &&
      // And a defined value (can be '' or falsy but not undefined)
      typeof newPendingRule?.value !== 'undefined' &&
      // And a category
      newPendingRule?.category &&
      // And if the ruleType is conditional, it needs to have a condition.
      (newPendingRule?.type !== RuleType.ConditionalValue ||
        (newPendingRule?.type === RuleType.ConditionalValue && !!newPendingRule?.condition)) &&
      // And if the ruleType is enum or multi, it needs to have options.
      (![RuleType.EnumValue, RuleType.MultiValue].includes(newPendingRule?.type || '') ||
        ([RuleType.EnumValue, RuleType.MultiValue].includes(newPendingRule?.type || '') &&
          newPendingRule?.options)),
    [newPendingRule]
  )

  let onSaveNewRule = useCallback(() => {
    if (newRuleIsValid) {
      onRuleChange(createRuleInput(newPendingRule))
      setNewPendingRule(undefined)
    }
  }, [newPendingRule, newRuleIsValid, onRuleChange])

  let onRemoveRule = useCallback(
    (rule) => {
      let createNextValue = produce((draftRules) => {
        let ruleId = createRuleId(rule)
        let ruleIdx = draftRules.findIndex((r) => createRuleId(r) === ruleId)

        if (ruleIdx !== -1) {
          draftRules.splice(ruleIdx, 1)
        }
      })

      onChange(createNextValue(rules))
    },
    [rules]
  )

  let rulesByCategory = useMemo(() => Object.entries(groupBy(rules, 'category')), [rules])

  return (
    <ContractRuleEditorView>
      {newPendingRule ? (
        <RuleCategory>
          <CategoryTitle>{newPendingRule?.category || 'Ei kategoriaa'}</CategoryTitle>
          <RuleEditorRow
            rule={newPendingRule}
            onChange={setNewPendingRule}
            useBuffer={false}
          />
          <CategoryFooter>
            <Button disabled={!newRuleIsValid} onClick={onSaveNewRule}>
              Lisää sääntö
            </Button>
            <Button
              onClick={() => setNewPendingRule(undefined)}
              buttonStyle={ButtonStyle.SECONDARY_REMOVE}>
              Peruuta
            </Button>
          </CategoryFooter>
        </RuleCategory>
      ) : (
        <ToolRow>
          <Button onClick={onCreateNewRule}>Uusi sääntö</Button>
        </ToolRow>
      )}
      {rulesByCategory.map(([category, rules]) => {
        return (
          <RuleCategory key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            {rules.map((rule) => (
              <RuleEditorRow
                onRemove={onRemoveRule}
                rule={rule}
                onChange={onRuleChange}
                useBuffer={true}
                key={createRuleId(rule)}
              />
            ))}
          </RuleCategory>
        )
      })}
    </ContractRuleEditorView>
  )
})

export default ContractRuleEditor
