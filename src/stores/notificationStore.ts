import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NotificationStore, Notification } from './types';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  notifications: [],
  hasUnread: false,
};

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      addNotification: (notification) => {
        const newNotification: Notification = {
          id: uuidv4(),
          timestamp: new Date(),
          read: false,
          ...notification,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          hasUnread: true,
        }));
      },

      markAsRead: (notificationId: string) => {
        set((state) => {
          const notifications = state.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification
          );

          return {
            notifications,
            hasUnread: notifications.some((notification) => !notification.read),
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
          hasUnread: false,
        }));
      },

      removeNotification: (notificationId: string) => {
        set((state) => {
          const notifications = state.notifications.filter(
            (notification) => notification.id !== notificationId
          );

          return {
            notifications,
            hasUnread: notifications.some((notification) => !notification.read),
          };
        });
      },

      clearAll: () => {
        set(initialState);
      },
    }),
    { name: 'notification-store' }
  )
);
