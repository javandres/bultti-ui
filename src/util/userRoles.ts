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
  return hasOperatorUserAccessRights(user)
}

export function useHasAccessRights({
  allowedRoles,
  operatorId,
}: {
  allowedRoles: UserRole[]
  operatorId?: number
}): boolean {
  const [user] = useStateValue('user')

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

function hasAdminAccessRights(user?: User): boolean {
  return !!user && user.role === UserRole.Admin
}

function hasHSLUserAccessRights(user?: User): boolean {
  return !!user && user.role === UserRole.Hsl
}

function hasOperatorUserAccessRights(user?: User, operatorId?: number): boolean {
  if (!operatorId) {
    return false
  }
  return (
    !!user && user.role === UserRole.Operator && (user.operatorIds || []).includes(operatorId)
  )
}
