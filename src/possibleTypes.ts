
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }

      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "ReportEntityUnion": [
      "Departure",
      "Equipment",
      "DeparturePair",
      "ProcurementUnit",
      "OperatorBlockDeparture",
      "ExecutionRequirement"
    ]
  }
};

      export default result;
    