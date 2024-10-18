export interface MenuItemProps {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  pattern?: RegExp;
  bottom?: boolean;
}

const SidebarItem: React.FC<MenuItemProps> = ({ icon, onClick, children, active = false, bottom = false }) => {
  const activeClass = active ?
    `text-background bg-background bg-opacity-10 cursor-default` :
    `text-background hover:bg-background hover:bg-opacity-20 cursor-pointer`;
  
  const dynamicClass = onClick ? `${activeClass} pb-2 pt-2`: 'cursor-default';

  return (
    <div 
      className={`relative ${bottom ? 'mt-auto' : ''} flex items-center ${dynamicClass}`}
      onClick={onClick}
    >
      {icon && <div className={`
        inline-flex items-center justify-center 
        transition-all duration-200 ease-linear ml-6 mr-3
      `}>
        {<span className="w-6 h-6">{icon}</span>}
      </div>}
      <div className={`opacity-100 w-full`}>
        {children}
      </div>
    </div>
  )
}

export default SidebarItem;
