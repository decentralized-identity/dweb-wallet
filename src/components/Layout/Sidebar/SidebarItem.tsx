export interface SidebarItemProps {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  pattern?: RegExp;
  bottom?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, onClick, children, active = false, bottom = false }) => {
  const activeClass = active ?
    `text-gray-100 bg-gray-700 bg-opacity-25` :
    `text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100`;
  
  const dynamicClsss = onClick ? `cursor-pointer ${activeClass} pb-2 pt-2`: 'cursor-default';

  return (
    <div 
      className={`relative ${bottom ? 'mt-auto' : ''} flex items-center ${dynamicClsss}`}
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
