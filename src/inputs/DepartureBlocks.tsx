import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import UploadFile from './UploadFile'
import Loading from '../components/Loading'
import { useUploader } from '../utils/useUploader'
import gql from 'graphql-tag'

const uploadDepartureBlocksMutation = gql`
  mutation uploadDepartureBlocks($file: Upload!, $inspectionId: String!) {
    uploadDepartureBlocks(file: $file, inspectionId: $inspectionId) {
      id
      departureTime
      departureType
      direction
      routeId
      vehicleId
    }
  }
`

const DepartureBlocksView = styled.div``

export type PropTypes = {
  children?: React.ReactNode
}

const DepartureBlocks: React.FC<PropTypes> = observer(({ children }) => {
  const departureBlocksUploader = useUploader(uploadDepartureBlocksMutation, {
    variables: {
      inspectionId: '123',
    },
  })

  const [
    ,
    { data: departureBlockData, loading: departureBlocksLoading },
  ] = departureBlocksUploader

  return (
    <DepartureBlocksView>
      <UploadFile uploader={departureBlocksUploader} />
      {departureBlocksLoading ? (
        <Loading />
      ) : (
        <pre>
          <code>{JSON.stringify(departureBlockData, null, 2)}</code>
        </pre>
      )}
    </DepartureBlocksView>
  )
})

export default DepartureBlocks
