export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Inspection: ['PostInspection', 'PreInspection'],
  },
}
export default result
