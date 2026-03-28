import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  EyeOff,
  Lock,
  Users,
  MessageSquare,
  Heart,
  UserCheck,
  UserX,
  Bell,
  Search,
  Download
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  options?: string[];
  selectedOption?: string;
}

export default function PrivacySettingsScreen() {
  const router = useRouter();

  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: 'private_account',
      title: 'حساب خاص',
      description: 'عندما يكون حسابك خاصًا، يمكن للأشخاص الذين تقبلهم فقط رؤية صورك ومقاطع الفيديو الخاصة بك',
      icon: Lock,
      enabled: false,
    },
    {
      id: 'story_sharing',
      title: 'مشاركة القصص',
      description: 'السماح للآخرين بمشاركة قصصك',
      icon: Users,
      enabled: true,
    },
    {
      id: 'comments',
      title: 'التعليقات',
      description: 'من يمكنه التعليق على منشوراتك',
      icon: MessageSquare,
      enabled: true,
      options: ['الجميع', 'الأشخاص الذين أتابعهم', 'لا أحد'],
      selectedOption: 'الجميع',
    },
    {
      id: 'likes_visibility',
      title: 'إظهار الإعجابات',
      description: 'إظهار عدد الإعجابات على منشوراتك للآخرين',
      icon: Heart,
      enabled: true,
    },
    {
      id: 'online_status',
      title: 'الحالة النشطة',
      description: 'السماح للآخرين برؤية متى كنت نشطًا',
      icon: Eye,
      enabled: true,
    },
    {
      id: 'read_receipts',
      title: 'إيصالات القراءة',
      description: 'السماح للآخرين برؤية متى قرأت رسائلهم',
      icon: UserCheck,
      enabled: true,
    },
    {
      id: 'search_visibility',
      title: 'الظهور في البحث',
      description: 'السماح للآخرين بالعثور على حسابك عبر البحث',
      icon: Search,
      enabled: true,
    },
    {
      id: 'download_content',
      title: 'تحميل المحتوى',
      description: 'السماح للآخرين بتحميل مقاطع الفيديو الخاصة بك',
      icon: Download,
      enabled: false,
    },
  ]);

  const [blockedUsers] = useState([
    { id: '1', name: 'أحمد محمد', username: '@ahmed123' },
    { id: '2', name: 'سارة علي', username: '@sara_ali' },
  ]);

  const toggleSetting = (settingId: string) => {
    setPrivacySettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleOptionSelect = (settingId: string, option: string) => {
    setPrivacySettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, selectedOption: option }
          : setting
      )
    );
  };

  const handleBlockedUsers = () => {
    Alert.alert(
      'المستخدمون المحظورون',
      `لديك ${blockedUsers.length} مستخدم محظور`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'عرض القائمة', onPress: () => console.log('Show blocked users') },
      ]
    );
  };

  const handleDataDownload = () => {
    Alert.alert(
      'تحميل بياناتك',
      'سيتم إرسال رابط تحميل بياناتك إلى بريدك الإلكتروني خلال 48 ساعة',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'طلب التحميل', onPress: () => console.log('Request data download') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'حذف الحساب',
      'هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك نهائيًا.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف الحساب', 
          style: 'destructive', 
          onPress: () => console.log('Delete account') 
        },
      ]
    );
  };

  const renderPrivacySetting = (setting: PrivacySetting) => (
    <View key={setting.id} style={styles.settingContainer}>
      <View style={styles.settingHeader}>
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <setting.icon color={colors.primary} size={20} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingDescription}>{setting.description}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.switchContainer}
          onPress={() => toggleSetting(setting.id)}
        >
          <View style={[
            styles.switch, 
            setting.enabled && styles.switchActive
          ]}>
            <View style={[
              styles.switchThumb,
              setting.enabled && styles.switchThumbActive
            ]} />
          </View>
        </TouchableOpacity>
      </View>

      {setting.options && setting.enabled && (
        <View style={styles.optionsContainer}>
          {setting.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionItem,
                setting.selectedOption === option && styles.optionItemSelected
              ]}
              onPress={() => handleOptionSelect(setting.id, option)}
            >
              <Text style={[
                styles.optionText,
                setting.selectedOption === option && styles.optionTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>الخصوصية والأمان</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إعدادات الخصوصية</Text>
          {privacySettings.map(renderPrivacySetting)}
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إدارة الحساب</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleBlockedUsers}>
            <View style={styles.actionLeft}>
              <View style={styles.iconContainer}>
                <UserX color={colors.error} size={20} />
              </View>
              <View>
                <Text style={styles.actionTitle}>المستخدمون المحظورون</Text>
                <Text style={styles.actionDescription}>
                  {blockedUsers.length} مستخدم محظور
                </Text>
              </View>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleDataDownload}>
            <View style={styles.actionLeft}>
              <View style={styles.iconContainer}>
                <Download color={colors.primary} size={20} />
              </View>
              <View>
                <Text style={styles.actionTitle}>تحميل بياناتك</Text>
                <Text style={styles.actionDescription}>
                  احصل على نسخة من بياناتك
                </Text>
              </View>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المنطقة الخطرة</Text>
          
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <View style={styles.actionLeft}>
              <View style={[styles.iconContainer, styles.dangerIconContainer]}>
                <UserX color={colors.white} size={20} />
              </View>
              <View>
                <Text style={styles.dangerTitle}>حذف الحساب</Text>
                <Text style={styles.actionDescription}>
                  حذف حسابك وجميع بياناتك نهائيًا
                </Text>
              </View>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  settingContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIconContainer: {
    backgroundColor: colors.error,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  switchContainer: {
    padding: 4,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: colors.primary,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  optionsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  optionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionItemSelected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionArrow: {
    fontSize: 24,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});