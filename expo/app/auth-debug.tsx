import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/use-auth-store';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function AuthDebugScreen() {
  const { user, isLoggedIn, isLoading, hasCompletedOnboarding, login, logout } = useAuth();

  const handleTestLogin = async () => {
    const testUser = {
      id: 'test-user-123',
      name: 'مستخدم تجريبي',
      username: '@test_user',
      email: 'test@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      bio: 'هذا حساب تجريبي للاختبار',
      followers: 500,
      following: 200,
      posts: 25,
      isVerified: true,
      level: 5,
      coins: 1000,
      joinedDate: new Date().toISOString(),
    };

    const result = await login(testUser, 'test@example.com');
    if (result.success) {
      Alert.alert('نجح', 'تم تسجيل الدخول بنجاح');
    } else {
      Alert.alert('خطأ', result.error || 'فشل في تسجيل الدخول');
    }
  };

  const handleTestLogout = async () => {
    const result = await logout();
    if (result.success) {
      Alert.alert('نجح', 'تم تسجيل الخروج بنجاح');
    } else {
      Alert.alert('خطأ', result.error || 'فشل في تسجيل الخروج');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>اختبار المصادقة</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حالة المصادقة الحالية</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>مسجل الدخول: {isLoggedIn ? 'نعم' : 'لا'}</Text>
            <Text style={styles.infoText}>جاري التحميل: {isLoading ? 'نعم' : 'لا'}</Text>
            <Text style={styles.infoText}>اكتمل الإعداد: {hasCompletedOnboarding ? 'نعم' : 'لا'}</Text>
          </View>
        </View>

        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>بيانات المستخدم</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>الاسم: {user.name}</Text>
              <Text style={styles.infoText}>اسم المستخدم: {user.username}</Text>
              <Text style={styles.infoText}>البريد: {user.email}</Text>
              <Text style={styles.infoText}>المتابعون: {user.followers}</Text>
              <Text style={styles.infoText}>يتابع: {user.following}</Text>
              <Text style={styles.infoText}>المنشورات: {user.posts}</Text>
              <Text style={styles.infoText}>موثق: {user.isVerified ? 'نعم' : 'لا'}</Text>
              <Text style={styles.infoText}>المستوى: {user.level}</Text>
              <Text style={styles.infoText}>العملات: {user.coins}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختبارات</Text>
          <TouchableOpacity style={styles.button} onPress={handleTestLogin}>
            <Text style={styles.buttonText}>تسجيل دخول تجريبي</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleTestLogout}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>تسجيل الخروج</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.buttonText}>الذهاب للتطبيق</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.buttonText}>شاشة تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#fff',
  },
});