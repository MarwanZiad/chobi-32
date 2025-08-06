import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth-store';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    if (!validateEmail(loginForm.email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);

    try {
      // محاكاة طلب تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 1500));

      // إنشاء بيانات المستخدم
      const userData = {
        id: `user_${Date.now()}`,
        name: 'مستخدم جديد',
        username: `@${loginForm.email.split('@')[0]}`,
        email: loginForm.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        bio: 'مرحباً بكم في ملفي الشخصي',
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 500),
        posts: Math.floor(Math.random() * 50),
        isVerified: Math.random() > 0.7,
        level: 1,
        coins: 100,
        joinedDate: new Date().toISOString(),
      };

      // تسجيل الدخول
      const result = await login(userData, loginForm.email);
      if (!result.success) {
        Alert.alert('خطأ', result.error || 'فشل في تسجيل الدخول');
        return;
      }

      Alert.alert('نجح', 'تم تسجيل الدخول بنجاح', [
        {
          text: 'موافق',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    if (!validateEmail(registerForm.email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!validatePassword(registerForm.password)) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      Alert.alert('خطأ', 'كلمات المرور غير متطابقة');
      return;
    }

    if (registerForm.username.length < 3) {
      Alert.alert('خطأ', 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    try {
      // محاكاة طلب التسجيل
      await new Promise(resolve => setTimeout(resolve, 2000));

      // إنشاء بيانات المستخدم الجديد
      const userData = {
        id: `user_${Date.now()}`,
        name: registerForm.name,
        username: `@${registerForm.username}`,
        email: registerForm.email,
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=100&h=100&fit=crop&crop=face`,
        bio: 'مرحباً بكم في ملفي الشخصي',
        followers: 0,
        following: 0,
        posts: 0,
        isVerified: false,
        level: 1,
        coins: 50,
        joinedDate: new Date().toISOString(),
      };

      // تسجيل الحساب الجديد
      const result = await login(userData, registerForm.email);
      if (!result.success) {
        Alert.alert('خطأ', result.error || 'فشل في إنشاء الحساب');
        return;
      }

      Alert.alert('نجح', 'تم إنشاء الحساب بنجاح', [
        {
          text: 'موافق',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      <Text style={styles.subtitle}>مرحباً بعودتك! سجل دخولك للمتابعة</Text>

      <View style={styles.inputContainer}>
        <Mail size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="البريد الإلكتروني"
          placeholderTextColor="#999"
          value={loginForm.email}
          onChangeText={(text) => setLoginForm(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
          textAlign="right"
        />
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.inputIcon}
        >
          {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          placeholderTextColor="#999"
          value={loginForm.password}
          onChangeText={(text) => setLoginForm(prev => ({ ...prev, password: text }))}
          secureTextEntry={!showPassword}
          textAlign="right"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={() => router.push('/auth/forgot-password')}
      >
        <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsLogin(false)}
      >
        <Text style={styles.switchText}>ليس لديك حساب؟ <Text style={styles.switchTextBold}>إنشاء حساب</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => router.push('/auth-debug')}
      >
        <Text style={styles.debugButtonText}>اختبار المصادقة</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRegisterForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>
      <Text style={styles.subtitle}>انضم إلينا وابدأ رحلتك معنا</Text>

      <View style={styles.inputContainer}>
        <User size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="الاسم الكامل"
          placeholderTextColor="#999"
          value={registerForm.name}
          onChangeText={(text) => setRegisterForm(prev => ({ ...prev, name: text }))}
          textAlign="right"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.atSymbol}>@</Text>
        <TextInput
          style={styles.input}
          placeholder="اسم المستخدم"
          placeholderTextColor="#999"
          value={registerForm.username}
          onChangeText={(text) => setRegisterForm(prev => ({ ...prev, username: text.toLowerCase() }))}
          autoCapitalize="none"
          textAlign="right"
        />
      </View>

      <View style={styles.inputContainer}>
        <Mail size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="البريد الإلكتروني"
          placeholderTextColor="#999"
          value={registerForm.email}
          onChangeText={(text) => setRegisterForm(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
          textAlign="right"
        />
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.inputIcon}
        >
          {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          placeholderTextColor="#999"
          value={registerForm.password}
          onChangeText={(text) => setRegisterForm(prev => ({ ...prev, password: text }))}
          secureTextEntry={!showPassword}
          textAlign="right"
        />
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.inputIcon}
        >
          {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="تأكيد كلمة المرور"
          placeholderTextColor="#999"
          value={registerForm.confirmPassword}
          onChangeText={(text) => setRegisterForm(prev => ({ ...prev, confirmPassword: text }))}
          secureTextEntry={!showConfirmPassword}
          textAlign="right"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>إنشاء الحساب</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsLogin(true)}
      >
        <Text style={styles.switchText}>لديك حساب بالفعل؟ <Text style={styles.switchTextBold}>تسجيل الدخول</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => router.push('/auth-debug')}
      >
        <Text style={styles.debugButtonText}>اختبار المصادقة</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.appName}>Chobi Live</Text>
            <Text style={styles.appTagline}>تطبيق البث المباشر الأول</Text>
          </View>

          {isLogin ? renderLoginForm() : renderRegisterForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginLeft: 12,
  },
  atSymbol: {
    color: '#666',
    fontSize: 16,
    marginLeft: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: '#999',
    fontSize: 14,
  },
  switchTextBold: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
  },
  debugButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  debugButtonText: {
    color: '#666',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});