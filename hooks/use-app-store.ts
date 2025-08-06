import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

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
        const savedSettings = await AsyncStorage.getItem('app_settings');
        const savedUser = await AsyncStorage.getItem('user_data');
        
        if (isMounted) {
          if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setAppState(prev => ({ ...prev, settings }));
          }
          
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setAppState(prev => ({ ...prev, user }));
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
      await AsyncStorage.setItem('app_settings', JSON.stringify(updatedSettings));
      setAppState(prev => ({ ...prev, settings: updatedSettings }));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = { ...appState.user, ...userData } as User;
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
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
      await AsyncStorage.multiRemove(['app_settings', 'user_data']);
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