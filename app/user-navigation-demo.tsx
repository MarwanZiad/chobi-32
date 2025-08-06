import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import UserAvatar from '@/components/UserAvatar';
import UserName from '@/components/UserName';
import { users } from '@/mocks/users';

export default function UserNavigationDemo() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>عرض توضيحي للتنقل للملفات الشخصية</Text>
        <View />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اضغط على أي صورة ملف شخصي أو اسم مستخدم للانتقال إلى الملف الشخصي</Text>
          
          <Text style={styles.description}>
            تم تطبيق هذه الميزة في جميع أنحاء التطبيق:
          </Text>
          
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• شريط القصص (Stories Bar)</Text>
            <Text style={styles.featureItem}>• شريط البث المباشر (Live Streams Bar)</Text>
            <Text style={styles.featureItem}>• الإشعارات (Notifications)</Text>
            <Text style={styles.featureItem}>• الرسائل (Chats)</Text>
            <Text style={styles.featureItem}>• التعليقات (Comments)</Text>
            <Text style={styles.featureItem}>• جميع شاشات التطبيق الأخرى</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أمثلة تفاعلية:</Text>
          
          {users.slice(0, 5).map((user, index) => (
            <View key={user.id} style={styles.userExample}>
              <View style={styles.userRow}>
                <UserAvatar 
                  userId={user.id}
                  imageUrl={user.imageUrl}
                  size={60}
                  testID={`demo-avatar-${user.id}`}
                />
                
                <View style={styles.userInfo}>
                  <UserName 
                    userId={user.id}
                    username={user.username}
                    arabicUsername={user.arabicUsername}
                    isVerified={user.accountType === 'verified'}
                    textStyle={styles.userName}
                    testID={`demo-username-${user.id}`}
                  />
                  <Text style={styles.userHandle}>{user.handle}</Text>
                  {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
                  {user.level && (
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>المستوى {user.level}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>كيف يعمل:</Text>
          <View style={styles.howItWorks}>
            <Text style={styles.stepText}>1. اضغط على أي صورة ملف شخصي أو اسم مستخدم</Text>
            <Text style={styles.stepText}>2. سيتم الانتقال تلقائياً إلى صفحة الملف الشخصي للمستخدم</Text>
            <Text style={styles.stepText}>3. يمكنك عرض معلومات المستخدم، متابعته، أو إرسال رسالة</Text>
            <Text style={styles.stepText}>4. استخدم زر الرجوع للعودة إلى الشاشة السابقة</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الميزات المتاحة في الملف الشخصي:</Text>
          <View style={styles.profileFeatures}>
            <Text style={styles.featureItem}>• عرض معلومات المستخدم الكاملة</Text>
            <Text style={styles.featureItem}>• إحصائيات المتابعين والمتابعة</Text>
            <Text style={styles.featureItem}>• مجموعة الفيديوهات المنشورة</Text>
            <Text style={styles.featureItem}>• زر المتابعة/إلغاء المتابعة</Text>
            <Text style={styles.featureItem}>• إرسال رسالة مباشرة</Text>
            <Text style={styles.featureItem}>• مشاركة الملف الشخصي</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureList: {
    marginLeft: 8,
  },
  featureItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  userExample: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  howItWorks: {
    marginLeft: 8,
  },
  stepText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  profileFeatures: {
    marginLeft: 8,
  },
});