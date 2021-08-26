import { User, UserRole } from '../schema-types'
import { useStateValue } from '../state/useAppState'

export function useHasAdminAccessRights(): boolean {
  const [user] = useStateValue('user')
  return hasAdminAccessRights(user)
}

export function useHasHSLUserAccessRights(): boolean {
  const [user] = useStateValue('user')
  return hasHSLUserAccessRights(user)
}

export function useHasOperatorUserAccessRights(operatorId: number): boolean {
  const [user] = useStateValue('user')
  return hasOperatorUserAccessRights(user, operatorId)
}

export function useHasAccessRights({
  allowedRoles,
  operatorId,
}: {
  allowedRoles: 'all' | UserRole[]
  operatorId?: number | 'all'
}): boolean {
  const [user] = useStateValue('user')
  return hasAccessRights({ user, allowedRoles, operatorId })
}

export function hasAccessRights({
  user,
  allowedRoles,
  operatorId,
}: {
  user?: User
  allowedRoles: 'all' | UserRole[]
  operatorId?: number | 'all'
}): boolean {
  if (!user) {
    return false
  }

  if (allowedRoles.length === 0) {
    throw new Error('hasAccessRights error: given allowedRoles list is empty.')
  }

  // Check for OPERATOR access rights
  if (allowedRoles === 'all' || allowedRoles.includes(UserRole.Operator)) {
    if (user.role === UserRole.Operator) {
      if (!operatorId) {
        // OperatorId (number or all) has to be given when allowing operator.'
        return false
      }
      return operatorId === 'all' || hasOperatorUserAccessRights(user, operatorId)
    }
  }

  // Check for ADMIN access rights
  if (
    (allowedRoles === 'all' || allowedRoles.includes(UserRole.Admin)) &&
    hasAdminAccessRights(user)
  ) {
    return true
  }

  // Check for HSL access rights
  return (
    (allowedRoles === 'all' || allowedRoles.includes(UserRole.Hsl)) &&
    hasHSLUserAccessRights(user)
  )
}

export function hasAdminAccessRights(user?: User): boolean {
  return !!user && user.role === UserRole.Admin
}

export function hasHSLUserAccessRights(user?: User): boolean {
  return !!user && user.role === UserRole.Hsl
}

export function hasOperatorUserAccessRights(
  user: User | undefined,
  operatorId: number
): boolean {
  if (!operatorId) {
    return false
  }

  return (
    !!user && user.role === UserRole.Operator && (user.operatorIds || []).includes(operatorId)
  )
}

export function isTestUser(user?: User) {
  if (!user) {
    return false
  }

  return user.hslIdGroups.includes('HSL-testing')
}

export function useIsTestUser() {
  const [user] = useStateValue('user')
  return isTestUser(user)
}
