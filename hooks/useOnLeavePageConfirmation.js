import Router from 'next/router';
import { useEffect, useCallback } from 'react';

export const useOnLeavePageConfirmation = (unsavedChanges) => {
  const handleRouteChangeStart = useCallback((url) => {
    const confirmLeave = window.confirm('You have unsaved changes. Do you really want to leave?');
    if (!confirmLeave) {
      // const errorEvent = new Event('routeChangeError');
      // window.dispatchEvent(errorEvent);
      throw 'Abort route change. Please ignore this error.';
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    if (unsavedChanges) {
      Router.events.on('routeChangeStart', handleRouteChangeStart);
      return () => {
        Router.events.off('routeChangeStart', handleRouteChangeStart);
      };
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);
};