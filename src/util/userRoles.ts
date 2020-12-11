import { User, UserRole } from '../schema-types'

export function hasAdminAccessRights(user?: User | null): boolean {
  return user?.role === UserRole.Admin
}

export function hasHSLUserAccessRights(user?: User | null): boolean {
  if (hasAdminAccessRights(user)) {
    return true
  }
  return user?.role === UserRole.Hsl
}

export function hasOperatorUserAccessRights(user?: User | null, operatorId?: number): boolean {
  if (hasHSLUserAccessRights(user)) {
    return true
  }

  if (!operatorId) {
    return false
  }

  return user?.role === UserRole.Operator && (user?.operatorIds || []).includes(operatorId)
}
