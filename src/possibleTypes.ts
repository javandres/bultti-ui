export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Inspection: ['PreInspection', 'PostInspection'],
  },
}
export default result
