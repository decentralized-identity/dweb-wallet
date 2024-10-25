import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

const DialogBox: React.FC<{ children: React.ReactNode, open: boolean, setOpen: (value: boolean) => void }> = ({ children, open, setOpen }) => {

  return <Dialog open={open} onClose={setOpen} className="relative z-10">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-background bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
    />

    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel
          transition
          className="max-w-md transform overflow-hidden p-4 rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
        >
          {children}
        </DialogPanel>
      </div>
    </div>
  </Dialog>
}

export default DialogBox;