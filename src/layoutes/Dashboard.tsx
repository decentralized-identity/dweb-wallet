import React from "react";
import Sidebar from '@/components/Layout/Sidebar/Sidebar';
import Content from '@/components/Layout/Content';
import Header from '@/components/Layout/Header';
import BottomNav from '@/components/Layout/BottomNav';
import { useNavigate, Outlet } from "react-router-dom";
import { useAgent } from '@/contexts/Context';
import { MenuItemProps } from "@/components/Layout/Sidebar/SidebarItem";
import SnackBar from "@/components/Layout/Snackbar";

const DashboardLayout: React.FC = () => {
  const { lock } = useAgent();
  const navigate = useNavigate();

  const identityMenu: MenuItemProps = {
    onClick: () => navigate('/'),
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>),
    children: (<span>Identities</span>),
    pattern: /(^\/$)|(^\/identity\/*.+)/
  };

  const searchMenu: MenuItemProps = {
    onClick: () => navigate('/search'),
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>),
    children: (<span>Find DIDs</span>),
    pattern: /^\/search?(\/*.)/
  };

  const appConnectMenu: MenuItemProps = {
    onClick: () => navigate('/app-connect'),
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>),
    children: (<span>App Connect</span>),
    pattern: /^\/app-connect$/
  };

  const createIdentityMenu: MenuItemProps = {
    onClick: () => navigate('/identities/create'),
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
    </svg>),
    children: (<span>Create Identity</span>),
    pattern: /^\/identities\/create$/
  };

  const importIdentityMenu: MenuItemProps = {
    onClick: () => navigate('/identities/import'),
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>),
    children: (<span>Import Identities</span>),
    pattern: /^\/identities\/import$/
  };

  const logoutMenu: MenuItemProps = {
    onClick: async () => {
      await lock();
      navigate('/');
    },
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-4 7a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" />
    </svg>),
    children: (<span>Log Out</span>),
  };

  const sidebarMenuItems = [identityMenu, searchMenu, {
    children: <div className="h-1 w-full border-b border-background pt-3" />
  }, appConnectMenu, createIdentityMenu, importIdentityMenu, {
    children: <div className="h-1 w-full border-b border-background" />,
    bottom: true
  }, logoutMenu];

  const bottomNavMenuItems = [identityMenu, searchMenu, appConnectMenu, createIdentityMenu, importIdentityMenu];

  const logoIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
  </svg>);

  const header = <span className="text-2xl text-white">Dweb Wallet</span>;

  return (
    <div className="w-full flex h-svh max-h-svh font-roboto">
      <Sidebar
        icon={logoIcon}
        header={header}
        items={sidebarMenuItems}
      />
      <div className="flex h-full flex-1 flex-col">
        <div className="flex h-full flex-col justify-start overflow-y-scroll">
          <Header icon={logoIcon}>{header}</Header>
          <Content>
            <Outlet />
          </Content>
        </div>
        <BottomNav menuItems={bottomNavMenuItems} />
      </div>
      <SnackBar />
    </div>
  );
}


export default DashboardLayout;