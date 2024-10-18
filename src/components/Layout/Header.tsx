import React from 'react';

const Header: React.FC<{ icon?: React.ReactNode, children?: React.ReactNode }> = ({ icon, children }) => {
  return (
    <div className="sticky bg-background py-5 h-16 w-full md:hidden flex items-center justify-center">
      <div className="flex items-center">
        {icon && <span className="w-10 h-10 flex-shrink-0">{icon}</span>}
        <div className="ml-3">{children}</div>
      </div>
    </div>
  )
}

export default Header;