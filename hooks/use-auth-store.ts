import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

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
  USER_DATA: 'user_data',
  IS_LOGGED_IN: 'isLoggedIn',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  USER_EMAIL: 'userEmail',
  USER_NAME: 'userName',
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
        const [isLoggedIn, userData, onboardingCompleted] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN),
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
          AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
        ]);

        console.log('Auth data loaded:', { isLoggedIn, hasUserData: !!userData, onboardingCompleted });

        if (isMounted) {
          const parsedUser = userData ? JSON.parse(userData) : null;
          
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
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
        AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, email),
        AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, userData.name),
      ]);

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
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.IS_LOGGED_IN,
        STORAGE_KEYS.USER_EMAIL,
        STORAGE_KEYS.USER_NAME,
      ]);

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
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      
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
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
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
      const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      
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