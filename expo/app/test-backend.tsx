import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { trpc } from '@/lib/trpc';

export default function TestBackend() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testHiRoute = async () => {
    try {
      setLoading(true);
      const result = await trpc.example.hi.query();
      addResult(`✅ Hi Route: ${result.message}`);
    } catch (error) {
      addResult(`❌ Hi Route Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testStreamingAPI = async () => {
    try {
      setLoading(true);
      
      // Test creating a session
      const session = await trpc.streaming.createSession.mutate({
        title: "اختبار البث المباشر",
        description: "جلسة اختبار للتأكد من عمل النظام",
        type: "video",
        category: "test"
      });
      addResult(`✅ Create Session: ${session.session.title}`);
      
      // Test getting active sessions
      const activeSessions = await trpc.streaming.getActiveSessions.query({
        type: "all",
        limit: 5
      });
      addResult(`✅ Active Sessions: ${activeSessions.sessions.length} sessions found`);
      
    } catch (error) {
      addResult(`❌ Streaming API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testChatAPI = async () => {
    try {
      setLoading(true);
      
      // Test sending a message
      const message = await trpc.chat.sendMessage.mutate({
        sessionId: "session_test",
        message: "مرحباً! هذه رسالة اختبار 👋",
        type: "text"
      });
      addResult(`✅ Send Message: ${message.message.message}`);
      
      // Test getting messages
      const messages = await trpc.chat.getMessages.query({
        sessionId: "session_test",
        limit: 10
      });
      addResult(`✅ Get Messages: ${messages.messages.length} messages found`);
      
    } catch (error) {
      addResult(`❌ Chat API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testGiftsAPI = async () => {
    try {
      setLoading(true);
      
      // Test getting available gifts
      const gifts = await trpc.gifts.getAvailableGifts.query();
      addResult(`✅ Available Gifts: ${gifts.totalGifts} gifts found`);
      
      // Test sending a gift
      const giftTransaction = await trpc.gifts.sendGift.mutate({
        sessionId: "session_test",
        giftId: "gift_rose",
        recipientId: "user_test",
        quantity: 1,
        message: "هدية جميلة! 🌹"
      });
      addResult(`✅ Send Gift: ${giftTransaction.transaction.giftName}`);
      
    } catch (error) {
      addResult(`❌ Gifts API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testUsersAPI = async () => {
    try {
      setLoading(true);
      
      // Test getting user profile
      const profile = await trpc.users.getProfile.query({});
      addResult(`✅ User Profile: ${profile.profile.username}`);
      
      // Test updating profile
      const updatedProfile = await trpc.users.updateProfile.mutate({
        displayName: "مستخدم اختبار",
        bio: "هذا ملف شخصي للاختبار 🧪"
      });
      addResult(`✅ Update Profile: ${updatedProfile.message}`);
      
    } catch (error) {
      addResult(`❌ Users API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testNotificationsAPI = async () => {
    try {
      setLoading(true);
      
      // Test getting notifications
      const notifications = await trpc.notifications.getNotifications.query({
        type: "all",
        limit: 10
      });
      addResult(`✅ Notifications: ${notifications.notifications.length} notifications, ${notifications.unreadCount} unread`);
      
    } catch (error) {
      addResult(`❌ Notifications API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAnalyticsAPI = async () => {
    try {
      setLoading(true);
      
      // Test getting stream stats
      const stats = await trpc.analytics.getStreamStats.query({
        period: "week"
      });
      addResult(`✅ Stream Stats: ${stats.stats.overview.totalStreams} total streams`);
      
    } catch (error) {
      addResult(`❌ Analytics API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAllAPIs = async () => {
    setResults([]);
    addResult("🚀 بدء اختبار جميع APIs...");
    
    await testHiRoute();
    await testStreamingAPI();
    await testChatAPI();
    await testGiftsAPI();
    await testUsersAPI();
    await testNotificationsAPI();
    await testAnalyticsAPI();
    
    addResult("✅ انتهى اختبار جميع APIs!");
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'اختبار البنية الخلفية' }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>🧱 اختبار البنية الخلفية</Text>
        <Text style={styles.subtitle}>اختبار جميع APIs المتاحة</Text>
      </View>

      <ScrollView style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]} 
          onPress={testAllAPIs}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ جاري الاختبار...' : '🚀 اختبار جميع APIs'}
          </Text>
        </TouchableOpacity>

        <View style={styles.separator}>
          <Text style={styles.separatorText}>أو اختبار API محدد:</Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testStreamingAPI}
          disabled={loading}
        >
          <Text style={styles.buttonText}>📡 اختبار البث المباشر</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testChatAPI}
          disabled={loading}
        >
          <Text style={styles.buttonText}>💬 اختبار الدردشة</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testGiftsAPI}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🎁 اختبار الهدايا</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testUsersAPI}
          disabled={loading}
        >
          <Text style={styles.buttonText}>👥 اختبار المستخدمين</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testNotificationsAPI}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🔔 اختبار الإشعارات</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={testAnalyticsAPI}
          disabled={loading}
        >
          <Text style={styles.buttonText}>📊 اختبار التحليلات</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
          <Text style={styles.clearButtonText}>🗑️ مسح النتائج</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>📋 النتائج:</Text>
        <ScrollView style={styles.resultsScroll}>
          {results.map((result, index) => (
            <Text key={index} style={[
              styles.resultText,
              result.includes('❌') && styles.errorResult,
              result.includes('✅') && styles.successResult
            ]}>
              {result}
            </Text>
          ))}
          {results.length === 0 && (
            <Text style={styles.noResults}>لم يتم تشغيل أي اختبارات بعد</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    padding: 15,
  },
  button: {
    backgroundColor: '#6c5ce7',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#00b894',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    alignItems: 'center',
    marginVertical: 15,
  },
  separatorText: {
    fontSize: 14,
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
  },
  clearButton: {
    backgroundColor: '#e17055',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    maxHeight: 200,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
    marginBottom: 10,
    color: '#212529',
  },
  resultsScroll: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  resultText: {
    fontSize: 13,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6c5ce7',
    fontFamily: 'monospace',
  },
  successResult: {
    borderLeftColor: '#00b894',
    backgroundColor: '#d1f2eb',
  },
  errorResult: {
    borderLeftColor: '#e17055',
    backgroundColor: '#fadbd8',
  },
  noResults: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});