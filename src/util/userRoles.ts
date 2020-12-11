import { UserRole } from '../schema-types'
import { useStateValue } from '../state/useAppState'

export function useHasAdminAccessRights(): boolean {
  const [user] = useStateValue('user')

  return user && user.role === UserRole.Admin
}

export function useHasHSLUserAccessRights(): boolean {
  const [user] = useStateValue('user')
  let hasAdminAccessRights = useHasAdminAccessRights()

  if (hasAdminAccessRights) {
    return true
  }

  return user && user.role === UserRole.Hsl
}

export function useHasOperatorUserAccessRights(operatorId?: number): boolean {
  const [user] = useStateValue('user')
  let hasHSLUserAccessRights = useHasHSLUserAccessRights()

  if (hasHSLUserAccessRights) {
    return true
  }

  if (!operatorId) {
    return false
  }

  return (
    user && user.role === UserRole.Operator && (user.operatorIds || []).includes(operatorId)
  )
}
