import IdentityDetails from "@/components/identity/IdentityDetails";
import { useIdentities } from "@/contexts/Context"
import { ProfileProvider } from "@/contexts/ProfileContext";
import { Box, CircularProgress } from '@mui/material';

const IdentityDetailsPage: React.FC = () => {
  const { selectedIdentity } = useIdentities();

  if (!selectedIdentity) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProfileProvider identity={selectedIdentity}>
      <IdentityDetails />
    </ProfileProvider>
  )
}

export default IdentityDetailsPage;