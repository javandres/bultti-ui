export function isObjectLike(candidate: unknown): candidate is Record<string, unknown> {
  return candidate !== null && typeof candidate === 'object'
}
