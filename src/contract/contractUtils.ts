import { ContractRule } from '../schema-types'

export function createRuleId(rule: ContractRule) {
  return `${rule.category}:${rule.name}`
}

export function createRuleValueId(rule: ContractRule) {
  return `${createRuleId(rule)}:${rule.condition || 'value'}/${rule.value}`
}

export function mergeRules(targetSet: ContractRule[], sourceSet: ContractRule[]) {
  // If no rules in the target set, we need to initialize the ruleset with the source set.
  if (targetSet.length === 0) {
    return sourceSet
  }

  let nextRules: ContractRule[] = []

  // Loop through the rules that should exist and pick only changed rules from the source array.
  // This way rules which have been removed, added or had their names changed persist correctly.
  for (let rule of targetSet) {
    let ruleId = createRuleId(rule)
    // Get a source rule based on name and category.
    let sourceRule = sourceSet.find((sourceRule) => createRuleId(sourceRule) === ruleId)

    // Choose the sourceRule if the value is different.
    if (sourceRule && createRuleValueId(sourceRule) !== createRuleValueId(rule)) {
      nextRules.push(sourceRule)
    } else {
      nextRules.push(rule)
    }
  }

  return nextRules
}
