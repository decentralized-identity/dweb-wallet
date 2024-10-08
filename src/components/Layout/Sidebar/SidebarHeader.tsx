const SidebarHeader: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({ icon, children, onClick }) => {
  return (
    <div className="flex items-center justify-between px-4 py-5 mb-3 mr-6" onClick={onClick}>
      <div className="flex items-center">
        {icon && <span className="w-10 h-10 flex-shrink-0">{icon}</span>}
        <div className="ml-3">{children}</div>
      </div>
    </div>
  )
}

export default SidebarHeader;