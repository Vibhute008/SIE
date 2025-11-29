'use client';

import { useState } from 'react';

export interface AlertState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlert({
      isOpen: true,
      message,
      type
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return {
    alert,
    showAlert,
    hideAlert
  };
};