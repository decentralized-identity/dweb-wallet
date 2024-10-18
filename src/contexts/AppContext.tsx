import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CryptoUtils } from '@web5/crypto';
import { SnackbarItem } from '@/types/app';

interface AppContextProps {
  snackbarItem?: SnackbarItem;
  addSnackbarItem: (item: SnackbarItem) => void;
}

export const AppContext = createContext<AppContextProps>({
  addSnackbarItem: () => {}
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbarItems, setSnackbarItems] = useState<Map<string, SnackbarItem>>(new Map());
  const [, setRemoveTimer] = useState<NodeJS.Timeout | undefined>(undefined);

  const removeSnackbarItem = useCallback((id: string) => {
    setSnackbarItems(prevItems => {
      const keys = Array.from(prevItems.keys());
      const nextKey = keys.length > 1 ? keys[1] : undefined;
      if (nextKey) {
        setRemoveTimer(setTimeout(() => removeSnackbarItem(nextKey), 3000));
      } else {
        setRemoveTimer(undefined);
      }

      const newItems = new Map(prevItems);
      newItems.delete(id);
      return newItems;
    });
  }, []);

  const addSnackbarItem = useCallback((item: SnackbarItem) => {
    const id = CryptoUtils.randomUuid();
    setSnackbarItems(prevItems => {
      const newItems = new Map(prevItems);
      newItems.set(id, item);
      return newItems;
    });

    setRemoveTimer(prevTimer => {
      if (!prevTimer) {
        return setTimeout(() => removeSnackbarItem(id), 3000);
      }
    });
  }, [removeSnackbarItem]);

  const snackbarItem = useMemo(() => {
    const keys = Array.from(snackbarItems.keys());
    if (keys.length > 0) {
      return snackbarItems.get(keys[0]);
    }
  }, [snackbarItems]);

  return (
    <AppContext.Provider value={{
      snackbarItem,
      addSnackbarItem
    }}>
      {children}
    </AppContext.Provider>
  );
};
