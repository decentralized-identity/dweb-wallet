import React from 'react';
import { MenuItemProps } from "./Sidebar/SidebarItem";
import { useLocation } from 'react-router-dom';

const BottomNav: React.FC<{ menuItems: MenuItemProps[] }> = ({ menuItems }) => {
  const location = useLocation();

  const iconClass = (pattern?: RegExp) => pattern && location.pathname.match(pattern) ? 'cursor-default text-slate-100 bg-gray-800' : 'cursor-pointer group-hover:text-slate-200 text-gray-400';
  const hoverClass = (pattern?: RegExp) => pattern && location.pathname.match(pattern) ? 'w-10 bg-slate-200' : 'w-5 group-hover:bg-slate-200';

  const getChildText = (children: React.ReactNode): string => {
    if (typeof children === 'string') return children;
    if (React.isValidElement(children)) return getChildText(children.props.children);
    if (Array.isArray(children)) return children.map(getChildText).join('');
    return '';
  }

  return (
    <div className="sticky top-0 block bg-gray-900 md:hidden">
      <div className="flex">
        {menuItems.filter(item => item.onClick !== undefined).map((item, index) => (
          <div title={getChildText(item.children)} className="flex-1 group" key={index}>
            <span onClick={item.onClick} className={`${iconClass(item.pattern)} flex flex-col pb-4 items-center mx-auto px-4 pt-4 w-full`}>
              <div className="size-10">
                {item.icon}
              </div>
              <span className={`${hoverClass(item.pattern)} absolute block bottom-0 mx-auto h-1 rounded-full`}></span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BottomNav;