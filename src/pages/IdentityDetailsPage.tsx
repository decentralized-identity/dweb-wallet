import IdentityDetails from "@/components/identity/IdentityDetails";
import { useIdentities } from "@/contexts/Context"
import { PageContainer } from "@toolpad/core";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

const IdentityDetailsPage: React.FC = () => {
  const { didUri } = useParams();
  const { selectedIdentity, selectIdentity } = useIdentities();

  useEffect(() => {
    if (didUri !== selectedIdentity?.didUri) {
      selectIdentity(didUri);
    }
  });

  const title = useMemo(() => {
    return selectedIdentity?.profile.social?.displayName
     ? `${selectedIdentity.profile.social?.displayName} (${selectedIdentity.persona})` : 'Loading...';
  }, [ selectedIdentity ]);

  const breadCrumbs = useMemo(() => {
    return selectedIdentity ? [{ title: 'Identities', path: '/identity' }, { title: selectedIdentity.persona, path: `/identity/${didUri}` }] : [];
  }, [ selectedIdentity, didUri ]);

  return <PageContainer title={title} breadCrumbs={breadCrumbs}>
    <IdentityDetails />
  </PageContainer>
}

export default IdentityDetailsPage;