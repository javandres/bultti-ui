import { Operator, User, UserRole } from '../schema-types'

export const operatorIsAuthorized = (operator: Operator | null, user: User | null) => {
  if (operator && user && user.role === UserRole.OperatorUser) {
    const userOperators = user.operatorIds || []
    const selectedOperatorId = operator.id

    return userOperators.includes(selectedOperatorId)
  } else if (operator && user) {
    return true
  }

  return false
}
