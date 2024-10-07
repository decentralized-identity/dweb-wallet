const SidebarItem: React.FC<{
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  active?: boolean;
}> = ({ icon, onClick, children, active = false, open = true }) => {
  const activeClass = active ? `text-gray-100 bg-gray-700 bg-opacity-25` : `text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100`
  const openClass = open ? 'px-6 py-2' : 'px-3 py-2 ml-1';

  return (
    <div className={`flex items-center mt-4 ${openClass} ${activeClass}`} onClick={onClick}>
      {icon && <span className={open ? 'w-6 h-6' : 'w-7 h-7'}>{icon}</span>}
      {open && <span className="mx-3">
        {children}
      </span>}
    </div>
  )
}

export default SidebarItem;
