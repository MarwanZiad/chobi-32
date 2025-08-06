import React, { useState } from 'react';
import { useUserData, useAppSettings } from '@/hooks/use-app-store';
import { useAuth } from '@/hooks/use-auth-store';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Switch } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  HelpCircle, 
  Info, 
  LogOut,
  ChevronRight,
  Settings as SettingsIcon,
  Lock,
  Eye,
  UserCheck,
  MessageSquare,
  Heart,
  Share2,
  Moon,
  Smartphone,
  Download,
  Wifi,
  Volume2,
  Camera,
  Mic,
  Users,
  Star,
  Gift,
  CreditCard,
  BarChart3,
  FileText,
  AlertTriangle,
  Mail,
  Phone
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useUserData();
  const { settings, updateSettings } = useAppSettings();
  const { logout } = useAuth();
  
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [autoPlay, setAutoPlay] = useState(settings.autoplay);
  const [dataUsage, setDataUsage] = useState(settings.dataSaver);

  const currentUser = {
    name: user?.name || 'مروان',
    username: user?.username || '@marwan',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    followers: user?.followers ? `${(user.followers / 1000).toFixed(1)}K` : '1.2K',
    following: user?.following?.toString() || '234',
    likes: user?.posts ? `${user.posts}` : '45'
  };

  const accountOptions = [
    {
      id: 'profile',
      title: 'إدارة الحساب',
      icon: User,
      onPress: () => router.push('/edit-profile'),
    },
    {
      id: 'privacy',
      title: 'الخصوصية',
      icon: Shield,
      onPress: () => router.push('/privacy-settings'),
    },
    {
      id: 'security',
      title: 'الأمان',
      icon: Lock,
      onPress: () => handleSecurity(),
    },
  ];

  const contentOptions = [
    {
      id: 'preferences',
      title: 'تفضيلات المحتوى',
      icon: Heart,
      onPress: () => handleContentPreferences(),
    },
    {
      id: 'language',
      title: 'اللغة',
      icon: Globe,
      onPress: () => handleLanguageSettings(),
    },
    {
      id: 'captions',
      title: 'التسميات التوضيحية',
      icon: FileText,
      onPress: () => handleCaptions(),
    },
  ];

  const cacheOptions = [
    {
      id: 'storage',
      title: 'تحرير مساحة التخزين',
      icon: Smartphone,
      onPress: () => handleStorage(),
      subtitle: '2.1 GB مستخدم'
    },
    {
      id: 'downloads',
      title: 'إدارة التنزيلات',
      icon: Download,
      onPress: () => handleDownloads(),
    },
  ];

  const supportOptions = [
    {
      id: 'report',
      title: 'الإبلاغ عن مشكلة',
      icon: AlertTriangle,
      onPress: () => handleReportProblem(),
    },
    {
      id: 'help',
      title: 'مركز المساعدة',
      icon: HelpCircle,
      onPress: () => handleHelpCenter(),
    },
    {
      id: 'community',
      title: 'إرشادات المجتمع',
      icon: Users,
      onPress: () => handleCommunityGuidelines(),
    },
    {
      id: 'terms',
      title: 'الشروط والأحكام',
      icon: FileText,
      onPress: () => handleTerms(),
    },
    {
      id: 'about',
      title: 'حول',
      icon: Info,
      onPress: () => handleAboutApp(),
    },
  ];

  const handleSecurity = () => {
    Alert.alert('الأمان', 'إعدادات الأمان والحماية');
  };

  const handleContentPreferences = () => {
    Alert.alert('تفضيلات المحتوى', 'تخصيص المحتوى المعروض لك');
  };

  const handleLanguageSettings = () => {
    Alert.alert(
      'اللغة',
      'اختر اللغة المفضلة لديك',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'العربية', onPress: () => console.log('Arabic selected') },
        { text: 'English', onPress: () => console.log('English selected') },
      ]
    );
  };

  const handleCaptions = () => {
    Alert.alert('التسميات التوضيحية', 'إعدادات الترجمة والتسميات');
  };

  const handleStorage = () => {
    Alert.alert('تحرير مساحة التخزين', 'إدارة ملفات التطبيق المؤقتة');
  };

  const handleDownloads = () => {
    Alert.alert('إدارة التنزيلات', 'عرض وإدارة الفيديوهات المحفوظة');
  };

  const handleReportProblem = () => {
    Alert.alert('الإبلاغ عن مشكلة', 'أخبرنا عن أي مشكلة تواجهها');
  };

  const handleHelpCenter = () => {
    Alert.alert('مركز المساعدة', 'الأسئلة الشائعة والمساعدة');
  };

  const handleCommunityGuidelines = () => {
    Alert.alert('إرشادات المجتمع', 'قواعد وإرشادات استخدام التطبيق');
  };

  const handleTerms = () => {
    Alert.alert('الشروط والأحكام', 'شروط الاستخدام وسياسة الخصوصية');
  };

  const handleAboutApp = () => {
    Alert.alert(
      'حول التطبيق',
      'CHOBI v1.0.0\n\nتطبيق للبث المباشر والتواصل الاجتماعي\n\n© 2024 جميع الحقوق محفوظة',
      [{ text: 'موافق' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تسجيل الخروج', 
          style: 'destructive', 
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              router.replace('/auth/login');
            } else {
              Alert.alert('خطأ', result.error || 'فشل في تسجيل الخروج');
            }
          }
        },
      ]
    );
  };

  const renderSettingItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.settingItem} onPress={item.onPress}>
      <View style={styles.settingLeft}>
        <item.icon color={colors.text} size={22} />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <ChevronRight color={colors.textSecondary} size={18} />
    </TouchableOpacity>
  );

  const renderToggleItem = (title: string, value: boolean, onToggle: (value: boolean) => void, IconComponent: React.ComponentType<{ color: string; size: number }>) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <IconComponent color={colors.text} size={22} />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.surface : colors.textSecondary}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>الإعدادات</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <TouchableOpacity style={styles.profileSection} onPress={() => router.push('/edit-profile')}>
          <Image 
            source={{ uri: currentUser.avatar }}
            style={styles.profileAvatar}
            contentFit='cover'
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.profileUsername}>{currentUser.username}</Text>
            <View style={styles.profileStats}>
              <Text style={styles.profileStat}>{currentUser.followers} متابع</Text>
              <Text style={styles.profileStat}>•</Text>
              <Text style={styles.profileStat}>{currentUser.likes} إعجاب</Text>
            </View>
          </View>
          <ChevronRight color={colors.textSecondary} size={20} />
        </TouchableOpacity>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الحساب</Text>
          <View style={styles.sectionContent}>
            {accountOptions.map(renderSettingItem)}
          </View>
        </View>

        {/* Content & Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المحتوى والعرض</Text>
          <View style={styles.sectionContent}>
            {renderToggleItem('الوضع الليلي', darkMode, async (value) => {
              setDarkMode(value);
              await updateSettings({ darkMode: value });
            }, Moon)}
            {contentOptions.map(renderSettingItem)}
            {renderToggleItem('تشغيل تلقائي', autoPlay, async (value) => {
              setAutoPlay(value);
              await updateSettings({ autoplay: value });
            }, Camera)}
          </View>
        </View>

        {/* Cache & Cellular */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التخزين والبيانات</Text>
          <View style={styles.sectionContent}>
            {renderToggleItem('توفير البيانات', dataUsage, async (value) => {
              setDataUsage(value);
              await updateSettings({ dataSaver: value });
            }, Wifi)}
            {cacheOptions.map(renderSettingItem)}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإشعارات</Text>
          <View style={styles.sectionContent}>
            {renderToggleItem('الإشعارات', notifications, async (value) => {
              setNotifications(value);
              await updateSettings({ notifications: value });
            }, Bell)}
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('إعدادات الإشعارات', 'تخصيص أنواع الإشعارات')}>
              <View style={styles.settingLeft}>
                <Volume2 color={colors.text} size={22} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>إعدادات الإشعارات</Text>
                </View>
              </View>
              <ChevronRight color={colors.textSecondary} size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الدعم والمعلومات</Text>
          <View style={styles.sectionContent}>
            {supportOptions.map(renderSettingItem)}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color={colors.error} size={22} />
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  profileStat: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bottomPadding: {
    height: 40,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
  },
});