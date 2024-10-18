import React from 'react';

import SidebarHeader from './SidebarHeader';
import SidebarItem, { MenuItemProps } from './SidebarItem';
import { useLocation } from 'react-router-dom';

const Sidebar: React.FC<{
  header: React.ReactNode;
  icon?: React.ReactNode;
  items: MenuItemProps[];
}> = ({ icon, header, items }) => {
  const location = useLocation();

  return (
    <div className={`hidden h-full md:block bg-primary`}>
      <nav className="flex flex-col h-full">
        <SidebarHeader icon={icon}>
          {header}
        </SidebarHeader>
        {items.map((item, index) => (
          <SidebarItem key={index} bottom={item.bottom} active={item.pattern ? !!location.pathname.match(item.pattern) : false} icon={item.icon} onClick={item.onClick}>
            {item.children}
          </SidebarItem>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar;