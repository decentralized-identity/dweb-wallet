import React from 'react';
import { useSnackbar } from "@/contexts/Context";
import { InformationCircleIcon } from '@heroicons/react/16/solid';

const SnackBar: React.FC = () => {
  const { snackbarItem } = useSnackbar();

  return (
    <div className="absolute bottom-0 left-0 right-0 h-0 text-center flex flex-col items-center">
      <div className={`absolute flex flex-col gap-1 bottom-[100%] pb-5`}>
        {snackbarItem && (
          <div className="p-2 px-6 bg-background items-center text-slate-200 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
            <InformationCircleIcon className="size-6 mr-3 -ml-2" />
            <span className="text-left flex-auto">{snackbarItem.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnackBar;