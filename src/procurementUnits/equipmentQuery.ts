import gql from 'graphql-tag'

export const EquipmentFragment = gql`
  fragment EquipmentFragment on Equipment {
    id
    make
    model
    operatorId
    registryDate
    registryNr
    co2
    emissionClass
    exteriorColor
    vehicleId
    type
  }
`
