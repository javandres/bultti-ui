import { Operator, User, UserRole } from '../schema-types'

export const operatorIsAuthorized = (operator: Operator | null, user: User | null) => {
  if (operator && user && user.role === UserRole.OperatorUser) {
    const userOperators = user.operatorIds || []

    console.log(userOperators)

    const selectedOperatorId = operator.id

    return userOperators.includes(selectedOperatorId)
  }

  return true
}
