import { User, UserRole } from '../schema-types'

export function requireUser(user?: User | null): boolean {
  // Make sure we actually have a user and they are active
  return !!user && user.role !== UserRole.Blocked
}

export function requireAdminUser(user?: User | null): boolean {
  return requireUser(user) && user?.role === UserRole.Admin
}

export function requireHSLUser(user?: User | null): boolean {
  return (
    requireUser(user) &&
    [UserRole.Hsl, UserRole.Admin].includes(user?.role || UserRole.Blocked)
  )
}

export function requireOperatorUser(user?: User | null, operatorId?: number): boolean {
  if (!requireUser(user)) {
    return false
  }

  if (requireHSLUser(user)) {
    return true
  }

  if (!operatorId) {
    return false
  }

  return user?.role === UserRole.Operator && (user?.operatorIds || []).includes(operatorId)
}
