import { MenuItemProps } from "./Sidebar/SidebarItem";

const BottomNav: React.FC<{ menuItems: MenuItemProps[] }> = ({ menuItems }) => {
  return (
    <div className="sticky top-0 block bg-gray-900 md:hidden">
      <div className="flex">
        {menuItems.filter(item => item.onClick !== undefined).map((item, index) => (
          <div className="flex-1 group" key={index}>
            <span onClick={item.onClick} className="cursor-pointer flex items-center justify-center text-center mx-auto px-4 pt-4 w-full text-gray-400 group-hover:text-slate-200">
              <i className="size-10 mb-1 flex flex-col items-center">{item.icon}</i>
              <span className="absolute block w-5 bottom-0 mx-auto h-1 group-hover:bg-slate-200 rounded-full"></span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BottomNav;

{/* <div class="px-7 bg-white shadow-lg rounded-2xl mb-5">
<div class="flex">
    <div class="flex-1 group">
        <a href="#" class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500 border-b-2 border-transparent group-hover:border-indigo-500">
            <span class="block px-1 pt-1 pb-2">
                <i class="far fa-home text-2xl pt-1 mb-1 block"></i>
                <span class="block text-xs pb-1">Home</span>
            </span>
        </a>
    </div>
    <div class="flex-1 group">
        <a href="#" class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500 border-b-2 border-transparent group-hover:border-indigo-500">
            <span class="block px-1 pt-1 pb-2">
                <i class="far fa-compass text-2xl pt-1 mb-1 block"></i>
                <span class="block text-xs pb-1">Explore</span>
            </span>
        </a>
    </div>
    <div class="flex-1 group">
        <a href="#" class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500 border-b-2 border-transparent group-hover:border-indigo-500">
            <span class="block px-1 pt-1 pb-2">
                <i class="far fa-search text-2xl pt-1 mb-1 block"></i>
                <span class="block text-xs pb-1">Search</span>
            </span>
        </a>
    </div>
    <div class="flex-1 group">
        <a href="#" class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500 border-b-2 border-transparent group-hover:border-indigo-500">
            <span class="block px-1 pt-1 pb-2">
                <i class="far fa-cog text-2xl pt-1 mb-1 block"></i>
                <span class="block text-xs pb-1">Settings</span>
            </span>
        </a>
    </div>
</div>
</div> */}