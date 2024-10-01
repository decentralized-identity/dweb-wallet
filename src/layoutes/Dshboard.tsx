import AddOrEditIdentityPage from "@/pages/AddOrEditIdentityPage";
import DWebConnect from "@/pages/DwebConnect";
import IdentitiesListPage from "@/pages/IdentitiesListPage";
import IdentityDetailsPage from "@/pages/IdentityDetailsPage";
import SearchIdentitiesPage from "@/pages/SearchIdentitiesPage";
import { PeopleOutline, PersonAddAlt, SearchOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import { AppProvider, DashboardLayout, Navigation } from "@toolpad/core"
import { Download } from "lucide-react";
import { Route, Routes, useNavigate } from "react-router-dom"

const Dashboard:React.FC = () => {
  const navigate = useNavigate();

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
  }]

  return (
    <AppProvider
      branding={{
        title: 'Dweb Wallet',
        logo: <Box sx={{ mr: 2 }}><img src="/logo.png" alt="Dweb Wallet" /></Box>
      }}
      router={{
        navigate: (path) => navigate(path),
        pathname: window.location.pathname,
        searchParams: new URLSearchParams(window.location.search),
      }}
      navigation={navigation}
    >
      <DashboardLayout>
        <Routes>
          <Route index element={<IdentitiesListPage />} />
          <Route path="/search" element={<SearchIdentitiesPage />} />
          <Route path= "/search/:didUri" element={<SearchIdentitiesPage />} />
          <Route path="/identity/edit/:didUri" element={<AddOrEditIdentityPage edit />} />
          <Route path="/identities/create" element={<AddOrEditIdentityPage />} />
          <Route path="/identities/import" element={<div>Coming Soon</div>} />
          <Route path="/identity/:didUri" element={<IdentityDetailsPage />} />
          <Route path="/dweb-connect" element={<DWebConnect />} />
        </Routes>
      </DashboardLayout>
    </AppProvider>
  )
}

export default Dashboard;