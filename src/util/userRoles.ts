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

export function useHasOperatorUserAccessRights(operatorId?: number): boolean {
  const [user] = useStateValue('user')
  return hasOperatorUserAccessRights(user, operatorId)
}

export function useHasAccessRights({
  allowedRoles,
  operatorId,
}: {
  allowedRoles: UserRole[]
  operatorId?: number
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
  allowedRoles: UserRole[]
  operatorId?: number
}): boolean {
  if (!user) {
    throw new Error('Current user not found.')
  }
  if (allowedRoles.length === 0) {
    throw new Error('Guard roles not working, given allowedRoles list is empty.')
  }
  if (allowedRoles.includes(UserRole.Admin) && hasAdminAccessRights(user)) {
    return true
  }
  if (allowedRoles.includes(UserRole.Hsl) && hasHSLUserAccessRights(user)) {
    return true
  }
  if (allowedRoles.includes(UserRole.Operator)) {
    return hasOperatorUserAccessRights(user, operatorId)
  }
  return false
}

export function hasAdminAccessRights(user?: User): boolean {
  return !!user && user.role === UserRole.Admin
}

export function hasHSLUserAccessRights(user?: User): boolean {
  return !!user && user.role === UserRole.Hsl
}

export function hasOperatorUserAccessRights(user?: User, operatorId?: number): boolean {
  if (!operatorId) {
    return false
  }
  return (
    !!user && user.role === UserRole.Operator && (user.operatorIds || []).includes(operatorId)
  )
}
