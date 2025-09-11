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
  email: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
  level?: number;
  coins?: number;
  joinedDate?: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEYS = {
  USER_DATA: 'ud',
  IS_LOGGED_IN: 'li',
  ONBOARDING_COMPLETED: 'oc',
  USER_EMAIL: 'ue',
  USER_NAME: 'un',
} as const;

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    hasCompletedOnboarding: false,
  });

  // تحميل بيانات المصادقة عند بدء التطبيق
  useEffect(() => {
    let isMounted = true;
    
    const loadAuthData = async () => {
      try {
        console.log('Loading auth data...');
        
        // Load data sequentially to avoid storage conflicts
        const isLoggedIn = await safeStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
        const userData = await safeStorage.getItem(STORAGE_KEYS.USER_DATA);
        const onboardingCompleted = await safeStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);

        console.log('Auth data loaded:', { isLoggedIn, hasUserData: !!userData, onboardingCompleted });

        if (isMounted) {
          let parsedUser = null;
          try {
            parsedUser = userData ? JSON.parse(userData) : null;
          } catch (parseError) {
            console.warn('Failed to parse user data, resetting:', parseError);
            await safeStorage.removeItem(STORAGE_KEYS.USER_DATA);
          }
          
          setAuthState({
            user: parsedUser,
            isLoggedIn: isLoggedIn === 'true',
            isLoading: false,
            hasCompletedOnboarding: onboardingCompleted === 'true',
          });
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        if (isMounted) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadAuthData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // تسجيل الدخول
  const login = async (userData: User, email: string) => {
    try {
      console.log('Logging in user:', userData.name);
      
      // Save data sequentially to avoid conflicts
      await safeStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      await safeStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      await safeStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      await safeStorage.setItem(STORAGE_KEYS.USER_NAME, userData.name);

      setAuthState(prev => ({
        ...prev,
        user: userData,
        isLoggedIn: true,
      }));

      console.log('Login successful');
      return { success: true };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'فشل في حفظ بيانات المستخدم' };
    }
  };

  // تسجيل الخروج
  const logout = async () => {
    try {
      console.log('Logging out user...');
      
      // Remove items individually to avoid multiRemove issues
      await safeStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await safeStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
      await safeStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
      await safeStorage.removeItem(STORAGE_KEYS.USER_NAME);

      setAuthState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        hasCompletedOnboarding: true, // الاحتفاظ بحالة الإعداد الأولي
      });

      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: 'فشل في تسجيل الخروج' };
    }
  };

  // تحديث بيانات المستخدم
  const updateUser = async (updates: Partial<User>) => {
    if (!authState.user) return { success: false, error: 'لا يوجد مستخدم مسجل' };

    try {
      const updatedUser = { ...authState.user, ...updates };
      await safeStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'فشل في تحديث البيانات' };
    }
  };

  // إكمال الإعداد الأولي
  const completeOnboarding = async () => {
    try {
      await safeStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      setAuthState(prev => ({ ...prev, hasCompletedOnboarding: true }));
      return { success: true };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return { success: false, error: 'فشل في حفظ حالة الإعداد' };
    }
  };

  // التحقق من صحة الجلسة
  const validateSession = async () => {
    try {
      const isLoggedIn = await safeStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      const userData = await safeStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (isLoggedIn === 'true' && userData) {
        const user = JSON.parse(userData);
        setAuthState(prev => ({
          ...prev,
          user,
          isLoggedIn: true,
        }));
        return { valid: true, user };
      } else {
        await logout();
        return { valid: false };
      }
    } catch (error) {
      console.error('Error validating session:', error);
      await logout();
      return { valid: false };
    }
  };

  // إعادة تعيين كلمة المرور (محاكاة)
  const resetPassword = async (email: string) => {
    try {
      // محاكاة طلب إعادة تعيين كلمة المرور
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: 'فشل في إرسال رابط إعادة التعيين' };
    }
  };

  // تنسيق الأرقام للعرض
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // الحصول على معلومات المستخدم المنسقة
  const getUserDisplayInfo = () => {
    if (!authState.user) return null;
    
    return {
      ...authState.user,
      followersFormatted: formatNumber(authState.user.followers),
      followingFormatted: formatNumber(authState.user.following),
      postsFormatted: formatNumber(authState.user.posts),
    };
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
    completeOnboarding,
    validateSession,
    resetPassword,
    formatNumber,
    getUserDisplayInfo,
  };
});

// خطافات مساعدة للوصول السريع
export const useUserData = () => {
  const { user, updateUser, getUserDisplayInfo } = useAuth();
  return { user, updateUser, getUserDisplayInfo };
};

export const useAuthStatus = () => {
  const { isLoggedIn, isLoading, hasCompletedOnboarding } = useAuth();
  return { isLoggedIn, isLoading, hasCompletedOnboarding };
};

export const useAuthActions = () => {
  const { login, logout, validateSession, resetPassword, completeOnboarding } = useAuth();
  return { login, logout, validateSession, resetPassword, completeOnboarding };
};