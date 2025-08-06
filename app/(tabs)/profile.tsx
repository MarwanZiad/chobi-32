import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Edit3, 
  Users, 
  Heart, 
  MessageCircle,
  Share,
  Settings,
  Play,
  Shield,
  Bell,
  ChevronRight,
  Wallet,
  Gift,
  CreditCard,
  Download,
  Upload,
  Receipt,
  Star,
  Crown,
  Coins,
  DollarSign,
  TrendingUp,
  Eye,
  Lock,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  Database,
  HelpCircle,
  LogOut,
  UserCheck,
  Award,
  Target,
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  Link,
  Mail,
  Phone,
  Camera,
  Video,
  Mic,
  Image as ImageIcon,
  FileText,
  Bookmark,
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Plus,
  Minus,
  RefreshCw,
  Filter,
  Search,
  SortAsc,
  Grid3X3,
  List,
  MoreHorizontal
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { getVideosForTab, Video } from '@/mocks/videos';
import { useAuth } from '@/hooks/use-auth-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, formatNumber } = useAuth();
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'likes' | 'bookmarks'>('videos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const videos = getVideosForTab('profile', 24);
    setUserVideos(videos);
  }, []);

  const currentUser = {
    id: user?.id || 'current-user',
    name: user?.name || 'مروان',
    username: user?.username || '@marwan',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    bio: user?.bio || 'مطور تطبيقات | محب للتكنولوجيا',
    followers: user?.followers || 1250,
    following: user?.following || 890,
    posts: user?.posts || 45,
    likes: user?.likes || 2340,
    bookmarks: user?.bookmarks || 156,
    level: user?.level || 12,
    coins: user?.coins || 5420,
    diamonds: user?.diamonds || 89,
    balance: user?.balance || 245.50,
    totalEarnings: user?.totalEarnings || 1250.75,
    isVerified: user?.isVerified || true,
    isPremium: user?.isPremium || true,
    joinDate: user?.joinDate || '2023-01-15',
    location: user?.location || 'الرياض، السعودية',
    website: user?.website || 'https://marwan.dev',
    email: user?.email || 'marwan@example.com',
    phone: user?.phone || '+966501234567'
  };



  const handleVideoPress = (video: Video) => {
    console.log('Video pressed:', video.title);
    // TODO: Navigate to video player
  };

  const handleTabChange = (tab: 'videos' | 'likes' | 'bookmarks') => {
    setActiveTab(tab);
  };

  const handleViewModeChange = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleWalletAction = (action: string) => {
    console.log('Wallet action:', action);
    Alert.alert('إجراء المحفظة', `تم تنفيذ: ${action}`);
  };

  const handleSettingsAction = (action: string) => {
    console.log('Settings action:', action);
    switch(action) {
      case 'privacy':
        router.push('/privacy-settings');
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      case 'activities':
        router.push('/activities');
        break;
      case 'edit-profile':
        router.push('/edit-profile');
        break;
      default:
        Alert.alert('الإعدادات', `تم اختيار: ${action}`);
    }
    setShowSettingsModal(false);
  };

  const renderVideoPost = (video: Video, index: number) => {
    if (viewMode === 'list') {
      return (
        <TouchableOpacity 
          key={video.id} 
          style={styles.listItem}
          onPress={() => handleVideoPress(video)}
        >
          <Image 
            source={{ uri: video.thumbnail }}
            style={styles.listThumbnail}
            contentFit='cover'
          />
          <View style={styles.listContent}>
            <Text style={styles.listTitle} numberOfLines={2}>{video.title}</Text>
            <Text style={styles.listStats}>
              {formatNumber(video.views)} مشاهدة • {video.duration}
            </Text>
            <View style={styles.listActions}>
              <View style={styles.listStatItem}>
                <Heart color={colors.textSecondary} size={14} />
                <Text style={styles.listStatText}>{formatNumber(video.likes)}</Text>
              </View>
              <View style={styles.listStatItem}>
                <MessageCircle color={colors.textSecondary} size={14} />
                <Text style={styles.listStatText}>{formatNumber(video.comments)}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.listMoreButton}>
            <MoreHorizontal color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        key={video.id} 
        style={styles.postItem}
        onPress={() => handleVideoPress(video)}
      >
        <Image 
          source={{ uri: video.thumbnail }}
          style={styles.postImage}
          contentFit='cover'
        />
        
        {/* Play button overlay */}
        <View style={styles.playOverlay}>
          <Play color={colors.white} size={20} fill={colors.white} />
        </View>
        
        {/* Duration badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        
        <View style={styles.postOverlay}>
          <View style={styles.postStats}>
            <View style={styles.statItem}>
              <Heart color={colors.white} size={14} />
              <Text style={styles.statText}>{formatNumber(video.likes)}</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle color={colors.white} size={14} />
              <Text style={styles.statText}>{formatNumber(video.comments)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSettingsModal = () => (
    <Modal
      visible={showSettingsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSettingsModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
            <XCircle color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>الإعدادات والتحكم</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          {/* Profile Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>إعدادات الملف الشخصي</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('edit-profile')}>
              <Edit3 color={colors.primary} size={20} />
              <Text style={styles.settingText}>تعديل الملف الشخصي</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('verification')}>
              <CheckCircle color={colors.primary} size={20} />
              <Text style={styles.settingText}>طلب التوثيق</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Privacy & Security */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>الخصوصية والأمان</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('privacy')}>
              <Shield color={colors.primary} size={20} />
              <Text style={styles.settingText}>إعدادات الخصوصية</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('blocked-users')}>
              <UserCheck color={colors.primary} size={20} />
              <Text style={styles.settingText}>المستخدمون المحظورون</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('two-factor')}>
              <Lock color={colors.primary} size={20} />
              <Text style={styles.settingText}>المصادقة الثنائية</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>الإشعارات والتنبيهات</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('notifications')}>
              <Bell color={colors.primary} size={20} />
              <Text style={styles.settingText}>إعدادات الإشعارات</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('push-notifications')}>
              <Smartphone color={colors.primary} size={20} />
              <Text style={styles.settingText}>الإشعارات الفورية</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>

          {/* App Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>إعدادات التطبيق</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('theme')}>
              <Moon color={colors.primary} size={20} />
              <Text style={styles.settingText}>المظهر والثيم</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('language')}>
              <Globe color={colors.primary} size={20} />
              <Text style={styles.settingText}>اللغة والمنطقة</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('data-usage')}>
              <Database color={colors.primary} size={20} />
              <Text style={styles.settingText}>استخدام البيانات</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Streaming Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>إعدادات البث</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('stream-quality')}>
              <Video color={colors.primary} size={20} />
              <Text style={styles.settingText}>جودة البث</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('audio-settings')}>
              <Volume2 color={colors.primary} size={20} />
              <Text style={styles.settingText}>إعدادات الصوت</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('camera-settings')}>
              <Camera color={colors.primary} size={20} />
              <Text style={styles.settingText}>إعدادات الكاميرا</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Support & Help */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>المساعدة والدعم</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('help')}>
              <HelpCircle color={colors.primary} size={20} />
              <Text style={styles.settingText}>مركز المساعدة</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('contact')}>
              <Mail color={colors.primary} size={20} />
              <Text style={styles.settingText}>تواصل معنا</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('report')}>
              <Flag color={colors.primary} size={20} />
              <Text style={styles.settingText}>الإبلاغ عن مشكلة</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Account Actions */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>إجراءات الحساب</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSettingsAction('logout')}>
              <LogOut color={colors.error} size={20} />
              <Text style={[styles.settingText, { color: colors.error }]}>تسجيل الخروج</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderWalletModal = () => (
    <Modal
      visible={showWalletModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowWalletModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowWalletModal(false)}>
            <XCircle color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>المحفظة والمدفوعات</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          {/* Balance Overview */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Wallet color={colors.primary} size={24} />
              <Text style={styles.balanceTitle}>الرصيد الحالي</Text>
            </View>
            <Text style={styles.balanceAmount}>${currentUser.balance.toFixed(2)}</Text>
            <View style={styles.balanceDetails}>
              <View style={styles.balanceItem}>
                <Coins color={colors.warning} size={16} />
                <Text style={styles.balanceText}>{formatNumber(currentUser.coins)} عملة</Text>
              </View>
              <View style={styles.balanceItem}>
                <Crown color={colors.primary} size={16} />
                <Text style={styles.balanceText}>{formatNumber(currentUser.diamonds)} ماسة</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletActionButton} onPress={() => handleWalletAction('deposit')}>
              <Upload color={colors.success} size={20} />
              <Text style={styles.walletActionText}>إيداع</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletActionButton} onPress={() => handleWalletAction('withdraw')}>
              <Download color={colors.error} size={20} />
              <Text style={styles.walletActionText}>سحب</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletActionButton} onPress={() => handleWalletAction('exchange')}>
              <RefreshCw color={colors.primary} size={20} />
              <Text style={styles.walletActionText}>تحويل</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletActionButton} onPress={() => handleWalletAction('gift')}>
              <Gift color={colors.warning} size={20} />
              <Text style={styles.walletActionText}>هدية</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Methods */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>طرق الدفع</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleWalletAction('add-card')}>
              <CreditCard color={colors.primary} size={20} />
              <Text style={styles.settingText}>إضافة بطاقة ائتمان</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleWalletAction('bank-account')}>
              <DollarSign color={colors.primary} size={20} />
              <Text style={styles.settingText}>ربط حساب بنكي</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Transaction History */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>السجل والفواتير</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleWalletAction('transactions')}>
              <Receipt color={colors.primary} size={20} />
              <Text style={styles.settingText}>سجل المعاملات</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleWalletAction('invoices')}>
              <FileText color={colors.primary} size={20} />
              <Text style={styles.settingText}>الفواتير</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleWalletAction('earnings')}>
              <TrendingUp color={colors.primary} size={20} />
              <Text style={styles.settingText}>الأرباح (${currentUser.totalEarnings.toFixed(2)})</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Gift & Rewards */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>الهدايا والمكافآت</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleWalletAction('received-gifts')}>
              <Gift color={colors.primary} size={20} />
              <Text style={styles.settingText}>الهدايا المستلمة</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleWalletAction('sent-gifts')}>
              <Heart color={colors.primary} size={20} />
              <Text style={styles.settingText}>الهدايا المرسلة</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => handleWalletAction('rewards')}>
              <Award color={colors.primary} size={20} />
              <Text style={styles.settingText}>المكافآت والإنجازات</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{currentUser.name}</Text>
          {currentUser.isVerified && (
            <CheckCircle color={colors.primary} size={16} />
          )}
          {currentUser.isPremium && (
            <Crown color={colors.warning} size={16} />
          )}
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Share color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowSettingsModal(true)}
            testID="settings-button"
          >
            <Settings color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: currentUser.avatar }}
                style={styles.profileAvatar}
                contentFit='cover'
              />
              <View style={styles.levelBadge}>
                <Star color={colors.warning} size={12} />
                <Text style={styles.levelText}>{currentUser.level}</Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{formatNumber(currentUser.posts)}</Text>
                <Text style={styles.statLabel}>منشور</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{formatNumber(currentUser.followers)}</Text>
                <Text style={styles.statLabel}>متابع</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{formatNumber(currentUser.following)}</Text>
                <Text style={styles.statLabel}>يتابع</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              {currentUser.isVerified && (
                <CheckCircle color={colors.primary} size={16} />
              )}
              {currentUser.isPremium && (
                <Crown color={colors.warning} size={16} />
              )}
            </View>
            <Text style={styles.profileUsername}>{currentUser.username}</Text>
            <Text style={styles.profileBio}>{currentUser.bio}</Text>
            
            {/* Additional Info */}
            <View style={styles.additionalInfo}>
              <View style={styles.infoItem}>
                <Calendar color={colors.textSecondary} size={14} />
                <Text style={styles.infoText}>انضم في {currentUser.joinDate}</Text>
              </View>
              {currentUser.location && (
                <View style={styles.infoItem}>
                  <MapPin color={colors.textSecondary} size={14} />
                  <Text style={styles.infoText}>{currentUser.location}</Text>
                </View>
              )}
              {currentUser.website && (
                <TouchableOpacity style={styles.infoItem}>
                  <Link color={colors.primary} size={14} />
                  <Text style={[styles.infoText, { color: colors.primary }]}>{currentUser.website}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Wallet Summary */}
          <View style={styles.walletSummary}>
            <TouchableOpacity 
              style={styles.walletItem}
              onPress={() => setShowWalletModal(true)}
            >
              <Wallet color={colors.primary} size={16} />
              <Text style={styles.walletText}>${currentUser.balance.toFixed(2)}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.walletItem}
              onPress={() => setShowWalletModal(true)}
            >
              <Coins color={colors.warning} size={16} />
              <Text style={styles.walletText}>{formatNumber(currentUser.coins)}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.walletItem}
              onPress={() => setShowWalletModal(true)}
            >
              <Crown color={colors.primary} size={16} />
              <Text style={styles.walletText}>{formatNumber(currentUser.diamonds)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Edit3 color={colors.text} size={16} />
              <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.walletButton}
              onPress={() => setShowWalletModal(true)}
            >
              <Wallet color={colors.primary} size={16} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setShowSettingsModal(true)}
              testID="profile-settings-button"
            >
              <Settings color={colors.text} size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsHeader}>
            <View style={styles.tabsButtons}>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'videos' && styles.activeTabButton]}
                onPress={() => handleTabChange('videos')}
              >
                <Video color={activeTab === 'videos' ? colors.primary : colors.textSecondary} size={16} />
                <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>الفيديوهات</Text>
                <Text style={[styles.tabCount, activeTab === 'videos' && styles.activeTabCount]}>({userVideos.length})</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'likes' && styles.activeTabButton]}
                onPress={() => handleTabChange('likes')}
              >
                <Heart color={activeTab === 'likes' ? colors.primary : colors.textSecondary} size={16} />
                <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>الإعجابات</Text>
                <Text style={[styles.tabCount, activeTab === 'likes' && styles.activeTabCount]}>({formatNumber(currentUser.likes)})</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'bookmarks' && styles.activeTabButton]}
                onPress={() => handleTabChange('bookmarks')}
              >
                <Bookmark color={activeTab === 'bookmarks' ? colors.primary : colors.textSecondary} size={16} />
                <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>المحفوظات</Text>
                <Text style={[styles.tabCount, activeTab === 'bookmarks' && styles.activeTabCount]}>({formatNumber(currentUser.bookmarks)})</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.viewControls}>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={handleViewModeChange}
              >
                {viewMode === 'grid' ? (
                  <List color={colors.textSecondary} size={20} />
                ) : (
                  <Grid3X3 color={colors.textSecondary} size={20} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewButton}>
                <Filter color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Content */}
          <View style={styles.tabContent}>
            {activeTab === 'videos' && (
              <View style={viewMode === 'grid' ? styles.postsGrid : styles.postsList}>
                {userVideos.map(renderVideoPost)}
              </View>
            )}
            
            {activeTab === 'likes' && (
              <View style={styles.emptyState}>
                <Heart color={colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>لا توجد إعجابات بعد</Text>
                <Text style={styles.emptyText}>الفيديوهات التي أعجبت بها ستظهر هنا</Text>
              </View>
            )}
            
            {activeTab === 'bookmarks' && (
              <View style={styles.emptyState}>
                <Bookmark color={colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>لا توجد محفوظات بعد</Text>
                <Text style={styles.emptyText}>الفيديوهات المحفوظة ستظهر هنا</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {renderSettingsModal()}
      {renderWalletModal()}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statColumn: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileInfo: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  shareButton: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsSection: {
    flex: 1,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 1,
  },
  postItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 6,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  durationText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '600',
  },
  postOverlay: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickSettings: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quickSettingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 12,
  },
  // New styles for advanced profile
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.warning,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 2,
    borderColor: colors.background,
  },
  levelText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  additionalInfo: {
    marginTop: 12,
    gap: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  walletSummary: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  walletButton: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingsSection: {
    marginVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  // Wallet modal styles
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    gap: 24,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  walletActionButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minWidth: 70,
    gap: 8,
  },
  walletActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  // Tabs styles
  tabsContainer: {
    flex: 1,
  },
  tabsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: colors.primary + '20',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeTabCount: {
    color: colors.primary,
  },
  viewControls: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  tabContent: {
    flex: 1,
  },
  postsList: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  listThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  listStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  listActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  listStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listStatText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  listMoreButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});