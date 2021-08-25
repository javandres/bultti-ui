import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, ButtonSize, ButtonStyle } from '../common/components/buttons/Button'
import { useStateValue } from '../state/useAppState'
import ExpandableSection, {
  HeaderMainHeading,
  HeaderSection,
} from '../common/components/ExpandableSection'
import { useMutationData } from '../util/useMutationData'
import { useQueryData } from '../util/useQueryData'
import { LoadingDisplay } from '../common/components/Loading'
import { useRefetch } from '../util/useRefetch'
import UserRelations from '../common/components/UserRelations'
import { contractUserRelationsQuery, toggleContractUserSubscription } from './contractQueries'
import { ContractUserRelation } from '../schema-types'
import { Text } from '../util/translate'

export type PropTypes = {
  contractId: string
  className?: string
}

const ContractUsers: React.FC<PropTypes> = observer(({ contractId, className }) => {
  var [user] = useStateValue('user')

  let { data: contractRelations, loading: relationsLoading, refetch } = useQueryData<
    ContractUserRelation[]
  >(contractUserRelationsQuery, {
    skip: !contractId,
    variables: {
      contractId,
    },
  })

  let refetchRelations = useRefetch(refetch)

  let [toggleSubscribed, { loading: userSubscribedLoading }] = useMutationData(
    toggleContractUserSubscription
  )

  let onToggleSubscribed = useCallback(async () => {
    if (user) {
      await toggleSubscribed({
        variables: {
          contractId,
          userId: user.id,
        },
      })

      refetchRelations()
    }
  }, [contractId, user, toggleSubscribed, refetchRelations])

  return (
    <ExpandableSection
      className={className}
      headerContent={
        <>
          <HeaderMainHeading>
            <Text>contractUsers_title</Text>
          </HeaderMainHeading>
          <HeaderSection style={{ padding: '0.5rem 0.75rem', justifyContent: 'center' }}>
            <Button
              style={{ marginLeft: 'auto' }}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSize.SMALL}
              onClick={refetchRelations}>
              <Text>update</Text>
            </Button>
          </HeaderSection>
        </>
      }>
      <LoadingDisplay loading={relationsLoading} />
      <UserRelations
        relations={contractRelations}
        loading={userSubscribedLoading}
        onToggleSubscribed={onToggleSubscribed}
      />
    </ExpandableSection>
  )
})

export default ContractUsers
