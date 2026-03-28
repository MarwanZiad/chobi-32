import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

// Safe storage utility
const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error);
      return null;
    }
  },
  
  async setItem(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set item ${key}:`, error);
      return false;
    }
  },
  
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item ${key}:`, error);
      return false;
    }
  }
};

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
}

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  autoplay: boolean;
  dataSaver: boolean;
  language: string;
  soundEnabled: boolean;
}

interface AppState {
  user: User | null;
  settings: AppSettings;
  isLoading: boolean;
  activeTab: string;
  unreadNotifications: number;
  unreadMessages: number;
}

const defaultSettings: AppSettings = {
  darkMode: true,
  notifications: true,
  autoplay: true,
  dataSaver: false,
  language: 'ar',
  soundEnabled: true,
};

const defaultUser: User = {
  id: 'current-user',
  name: 'مروان',
  username: '@marwan',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  bio: 'مطور تطبيقات | محب للتكنولوجيا',
  followers: 1250,
  following: 890,
  posts: 45,
  isVerified: true,
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [appState, setAppState] = useState<AppState>({
    user: defaultUser,
    settings: defaultSettings,
    isLoading: true,
    activeTab: 'home',
    unreadNotifications: 3,
    unreadMessages: 5,
  });

  // Load settings from AsyncStorage
  useEffect(() => {
    let isMounted = true;
    
    const loadSettings = async () => {
      try {
        // Use shorter keys and load sequentially
        const savedSettings = await safeStorage.getItem('as');
        const savedUser = await safeStorage.getItem('ud');
        
        if (isMounted) {
          if (savedSettings) {
            try {
              const settings = JSON.parse(savedSettings);
              setAppState(prev => ({ ...prev, settings }));
            } catch (parseError) {
              console.warn('Failed to parse app settings, using defaults:', parseError);
              await safeStorage.removeItem('as');
            }
          }
          
          if (savedUser) {
            try {
              const user = JSON.parse(savedUser);
              setAppState(prev => ({ ...prev, user }));
            } catch (parseError) {
              console.warn('Failed to parse user data, using default:', parseError);
              await safeStorage.removeItem('ud');
            }
          }
          
          setAppState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading app data:', error);
        if (isMounted) {
          setAppState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadSettings();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Save settings to AsyncStorage
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...appState.settings, ...newSettings };
      await safeStorage.setItem('as', JSON.stringify(updatedSettings));
      setAppState(prev => ({ ...prev, settings: updatedSettings }));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = { ...appState.user, ...userData } as User;
      await safeStorage.setItem('ud', JSON.stringify(updatedUser));
      setAppState(prev => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Set active tab
  const setActiveTab = (tab: string) => {
    setAppState(prev => ({ ...prev, activeTab: tab }));
  };

  // Update notification count
  const updateNotificationCount = (count: number) => {
    setAppState(prev => ({ ...prev, unreadNotifications: count }));
  };

  // Update message count
  const updateMessageCount = (count: number) => {
    setAppState(prev => ({ ...prev, unreadMessages: count }));
  };

  // Clear all data (logout)
  const clearAppData = async () => {
    try {
      // Remove items individually to avoid multiRemove issues
      await safeStorage.removeItem('as');
      await safeStorage.removeItem('ud');
      setAppState({
        user: null,
        settings: defaultSettings,
        isLoading: false,
        activeTab: 'home',
        unreadNotifications: 0,
        unreadMessages: 0,
      });
    } catch (error) {
      console.error('Error clearing app data:', error);
    }
  };

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return {
    ...appState,
    updateSettings,
    updateUser,
    setActiveTab,
    updateNotificationCount,
    updateMessageCount,
    clearAppData,
    formatNumber,
  };
});

// Helper hooks for specific functionality
export const useUserData = () => {
  const { user, updateUser } = useApp();
  return { user, updateUser };
};

export const useAppSettings = () => {
  const { settings, updateSettings } = useApp();
  return { settings, updateSettings };
};

export const useNavigation = () => {
  const { activeTab, setActiveTab } = useApp();
  return { activeTab, setActiveTab };
};

export const useNotifications = () => {
  const { unreadNotifications, unreadMessages, updateNotificationCount, updateMessageCount } = useApp();
  return { 
    unreadNotifications, 
    unreadMessages, 
    updateNotificationCount, 
    updateMessageCount 
  };
};