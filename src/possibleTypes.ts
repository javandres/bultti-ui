
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }

      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "ReportEntityUnion": [
      "Departure",
      "MissingEquipment",
      "DeparturePair",
      "OperatorBlockDeparture",
      "ExecutionRequirement",
      "EmissionClassExecutionItem"
    ]
  }
};

      export default result;
    