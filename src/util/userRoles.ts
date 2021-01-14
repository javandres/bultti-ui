import { UserRole } from '../schema-types'
import { useStateValue } from '../state/useAppState'

export function useHasAdminAccessRights(): boolean {
  const [user] = useStateValue('user')

  return user && user.role === UserRole.Admin
}

export function useHasHSLUserAccessRights(): boolean {
  const [user] = useStateValue('user')

  if (useHasAdminAccessRights()) {
    return true
  }

  return user && user.role === UserRole.Hsl
}

export function useHasOperatorUserAccessRights(operatorId?: number): boolean {
  const [user] = useStateValue('user')

  if (useHasHSLUserAccessRights()) {
    return true
  }

  if (!operatorId) {
    return false
  }

  return (
    user && user.role === UserRole.Operator && (user.operatorIds || []).includes(operatorId)
  )
}
