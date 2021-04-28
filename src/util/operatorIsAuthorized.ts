import { Operator, User, UserRole } from '../schema-types'

export const operatorIsAuthorized = (
  operator: Operator | null | undefined,
  user: User | null | undefined
) => {
  if (operator && user && user.role === UserRole.Operator) {
    const userOperators = user.operatorIds || []
    const selectedOperatorId = operator.id

    return userOperators.includes(selectedOperatorId)
  } else if (operator && user) {
    return true
  }

  return false
}
