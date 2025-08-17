import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DialogState {
  [key: string]: boolean;
}

interface DialogContextType {
  isDialogOpen: (dialogId: string) => boolean;
  openDialog: (dialogId: string) => void;
  closeDialog: (dialogId: string) => void;
  toggleDialog: (dialogId: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialogStates, setDialogStates] = useState<DialogState>({});

  const isDialogOpen = useCallback((dialogId: string) => {
    return dialogStates[dialogId] || false;
  }, [dialogStates]);

  const openDialog = useCallback((dialogId: string) => {
    setDialogStates(prev => ({ ...prev, [dialogId]: true }));
  }, []);

  const closeDialog = useCallback((dialogId: string) => {
    setDialogStates(prev => ({ ...prev, [dialogId]: false }));
  }, []);

  const toggleDialog = useCallback((dialogId: string) => {
    setDialogStates(prev => ({ ...prev, [dialogId]: !prev[dialogId] }));
  }, []);

  return (
    <DialogContext.Provider value={{
      isDialogOpen,
      openDialog,
      closeDialog,
      toggleDialog
    }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
