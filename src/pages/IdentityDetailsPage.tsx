import IdentityDetails from "@/components/identity/IdentityDetails";
import { useIdentities } from "@/contexts/Context"
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const IdentityDetailsPage: React.FC = () => {
  const { didUri } = useParams();
  const { selectedIdentity, selectIdentity } = useIdentities();

  useEffect(() => {
    if (didUri !== selectedIdentity?.didUri) {
      selectIdentity(didUri);
    }
  });

  if (!didUri || !selectedIdentity) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return <IdentityDetails />
}

export default IdentityDetailsPage;