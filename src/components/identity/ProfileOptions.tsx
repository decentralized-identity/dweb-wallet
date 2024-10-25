import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import {
  ChevronDownIcon,
  FolderArrowDownIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/16/solid';

const ProfileOptions: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
  onBackup: () => void;
}> = ({ onBackup, onDelete, onEdit }) => {

  return (
    <div className="flex flex-col mt-5 mr-3">
      <Menu>
          <MenuButton className="flex divide-x overflow-hidden divide-foreground-600 inline-flex items-center rounded-md bg-foreground text-sm/6 font-semibold text-background shadow-inner shadow-background/10">
            <div className="active:bg-foreground-800 pl-3 h-full flex pr-3 items-center cursor-pointer" onClick={onEdit}>
              <PencilIcon className="size-4 mr-2 fill-background/30" /> Edit Profile
            </div>
            <ChevronDownIcon className="size-8 px-2 fill-background/60 hover:bg-foreground-700 active:bg-foreground-800" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom"
            className="mt-1 overflow-hidden origin-top-right divide-y-2 bg-primary/10 divide-primary-800/20 rounded text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              <button className="group flex w-full items-center gap-2 py-2 pb-1 px-4 data-[focus]:bg-background/10" onClick={onBackup}>
                <FolderArrowDownIcon className="size-4 fill-foreground/70" />
                Backup Identity
              </button>
            </MenuItem>
            <MenuItem>
              <button className="group flex w-full items-center gap-2 py-2 pt-1 px-4 data-[focus]:bg-background/10" onClick={onDelete}>
                <TrashIcon className="size-4 fill-foreground/70" />
                Delete Identity
              </button>
            </MenuItem>
          </MenuItems>
      </Menu>
    </div>
  )
}

export default ProfileOptions;