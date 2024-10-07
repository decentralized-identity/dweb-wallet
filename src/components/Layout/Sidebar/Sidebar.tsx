import React, { useMemo, useState } from 'react';

import SidebarHeader from './SidebarHeader';
import SidebarItem from './SidebarItem';

const Sidebar: React.FC<{
  header: React.ReactNode;
  icon?: React.ReactNode;
  items: {
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    icon: React.ReactNode;
    children: React.ReactNode
  }[]
}> = ({ icon, header, items }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarClass = useMemo(() => {
    return sidebarOpen ? `w-64` : `w-16`;
  }, [ sidebarOpen ]);

  return (
    <div className={`${sidebarClass} fixed inset-y-0 left-0 z-30 overflow-y-auto transition duration-300 ease-in-out transform bg-gray-900 md:translate-x-0 md:static md:inset-0`}>
      <SidebarHeader icon={icon} onClick={() => setSidebarOpen(!sidebarOpen)} open={sidebarOpen}>
        {header}
      </SidebarHeader>
      <nav className="mt-10">
        {items.map(item => <SidebarItem open={sidebarOpen} icon={item.icon} onClick={item.onClick}>{item.children}</SidebarItem>)}
      </nav>
    </div>
  )
}

export default Sidebar;