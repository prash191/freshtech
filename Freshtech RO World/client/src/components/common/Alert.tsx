import React, { useEffect } from 'react';
import { Snackbar, Alert as MuiAlert, AlertColor } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeNotification } from '@/store/slices/uiSlice';

const Alert: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  const handleAutoClose = (id: string, duration: number) => {
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, duration);
  };

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        handleAutoClose(notification.id, notification.duration);
      }
    });
  }, [notifications]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ zIndex: 9999 }}
        >
          <MuiAlert
            onClose={() => handleClose(notification.id)}
            severity={notification.type as AlertColor}
            variant="filled"
            sx={{
              minWidth: 300,
              '& .MuiAlert-message': {
                fontWeight: 500,
              },
            }}
          >
            {notification.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </>
  );
};

export default Alert;
