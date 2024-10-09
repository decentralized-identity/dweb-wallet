import React from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

const ProfileTabs:React.FC<{ sections: { title: string, children?: React.ReactNode }[], showInactive?: boolean }> = ({ sections, showInactive = true }) => {

  const filteredSections = showInactive ? sections : sections.filter(({ children }) => typeof children !== 'undefined');

  return (
    <TabGroup className="w-full">
      <TabList className="flex bg-gray-300 border-2 border-x-0 border-y-gray-500 h-12">
        {filteredSections.map(({ title, children }) => (
          <Tab
            key={title}
            disabled={typeof children === 'undefined'}
            className="py-1 px-6 font-semibold text-gray-600 focus:outline-none border-gray-300 border-b-2 data-[disabled]:text-gray-500 data-[selected]:border-gray-900 data-[selected]:text-gray-900 data-[selected]:data-[hover]:text-gray-700 data-[hover]:bg-slate-300 data-[hover]:text-slate-600 data-[focus]:outline-1 data-[focus]:outline-gray-900"
          >
            {title}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-3">
        {filteredSections.map(({ title, children }) => (
          <TabPanel key={title} className={"min-h-96"}>
            {children}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  )
}

export default ProfileTabs;