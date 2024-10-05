import { useAgent } from "@/contexts/Context";
import { DragOverIdentitiesProvider } from "@/contexts/DragOverIdentities";
import AddOrEditIdentityPage from "@/pages/AddOrEditIdentityPage";
import DWebConnect from "@/pages/DwebConnect";
import IdentitiesListPage from "@/pages/IdentitiesListPage";
import IdentityDetailsPage from "@/pages/IdentityDetailsPage";
import ImportIdentityPage from "@/pages/ImportIdentityPage";
import SearchIdentitiesPage from "@/pages/SearchIdentitiesPage";
import { PeopleOutline, PersonAddAlt, SearchOutlined } from "@mui/icons-material";
import { Box, Container, Typography } from "@mui/material";
import { AppProvider, DashboardLayout, Navigation, NotificationsProvider, } from "@toolpad/core"
import { Download, LockIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"

const Dashboard:React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const router = useMemo(() => {
    return {
      navigate: (path: string | URL) => navigate(path),
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
    }
  }, [ location, navigate ]);

  const navigation:Navigation =[{
    kind: 'page',
    title: 'Identities',
    icon: <PeopleOutline />,
    pattern: '{identity/:didUri}*'
  }, {
    kind: 'page',
    title: 'Find DIDs',
    icon: <SearchOutlined />,
    segment: 'search',
    pattern: 'search{/:didUri}*'
  }, {
    kind: 'divider',
  }, {
    kind: 'page',
    title: 'Create Identity',
    icon: <PersonAddAlt />,
    segment: 'identities/create',
  }, {
    kind: 'page',
    title: 'Import Identitites',
    icon: <Download />,
    segment: 'identities/import',
  }, {
    kind: 'divider'
  },{
    kind: 'page',
    title: 'Log Out',
    icon: <LockIcon />,
    segment: 'logout'
  }]

  return (
    <AppProvider
      branding={{
        title: 'Dweb Wallet',
        logo: <Box sx={{ mr: 2 }}><img src="/logo.png" alt="Dweb Wallet" /></Box>
      }}
      router={router}
      navigation={navigation}
    >
      <DragOverIdentitiesProvider>
        <DashboardLayout>
          <NotificationsProvider>
            <Routes>
              <Route index element={<IdentitiesListPage />} />
              <Route path="/search" element={<SearchIdentitiesPage />} />
              <Route path= "/search/:didUri" element={<SearchIdentitiesPage />} />
              <Route path="/identity/edit/:didUri" element={<AddOrEditIdentityPage edit />} />
              <Route path="/identities/create" element={<AddOrEditIdentityPage />} />
              <Route path="/identities/import" element={<ImportIdentityPage />} />
              <Route path="/identity/:didUri" element={<IdentityDetailsPage />} />
              <Route path="/dweb-connect" element={<DWebConnect />} />
              <Route path="/logout" element={<LogoutPage />} />
            </Routes>
          </NotificationsProvider>
        </DashboardLayout>
      </DragOverIdentitiesProvider>
    </AppProvider>
  )
}

/**
 * Could not see a sane way to hijack the click of a menu item instead of it pointing to a page.
 * So, I created a logout page that will log the user out and redirect to the home page.
 *
 * We can likely customize the `Account` API for the MUI DashboardLayout to display wallet account information
 * as well as managing locking, seed backup, etc.
 * https://mui.com/toolpad/core/api/account/
 */
const LogoutPage = () => {
  const { lock } = useAgent();
  const navigate = useNavigate();

  useEffect(() => {
    lock();
    return () => {
      navigate('/');
    }
  });

  return (<Container sx={{ display: 'flex', flexDirection: 'col', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
    <Typography sx={{ mb: '50%' }} variant="h4">Logging Out...</Typography>
  </Container>)
}

export default Dashboard;