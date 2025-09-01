import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Search, 
  Flame, 
  TrendingUp,
  Hash,
  Play,
  Heart,
  MessageCircle,
  Users,
  Crown,
  Trophy,
  Star,
  Eye,
  Zap,
  Calendar,
  Radio,
  Video as VideoIcon,
  Mic,
  Bell,
  Plus,
  CalendarDays,
  BookOpen
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { getVideosForTab, Video } from '@/mocks/videos';
import BottomNavigation from '@/components/BottomNavigation';

const { width: screenWidth } = Dimensions.get('window');

interface StreamType {
  id: string;
  name: string;
  icon: any;
  color: string;
  count: number;
}

interface TopSupporter {
  id: string;
  name: string;
  avatar: string;
  totalGifts: number;
  level: number;
}

interface TopCreator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  totalViews: number;
  isVerified: boolean;
  category: string;
}

interface TrendingContent {
  id: string;
  title: string;
  thumbnail: string;
  creator: string;
  views: number;
  likes: number;
  duration: string;
  type: 'video' | 'live' | 'audio';
}

interface DailyDigest {
  id: string;
  title: string;
  image: string;
  type: 'journal' | 'event';
  author: string;
  time: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  likes: number;
  comments: number;
  time: string;
  mood: string;
}

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('stream-types');
  const [streamTypes, setStreamTypes] = useState<StreamType[]>([]);
  const [topSupporters, setTopSupporters] = useState<TopSupporter[]>([]);
  const [topCreators, setTopCreators] = useState<TopCreator[]>([]);
  const [todayContent, setTodayContent] = useState<TrendingContent[]>([]);
  const [topViewed, setTopViewed] = useState<TrendingContent[]>([]);
  const [topEngagement, setTopEngagement] = useState<TrendingContent[]>([]);
  const [trending, setTrending] = useState<TrendingContent[]>([]);
  const [dailyDigest, setDailyDigest] = useState<DailyDigest[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    loadDiscoverContent();
  }, []);

  const loadDiscoverContent = () => {
    // Stream Types
    const mockStreamTypes: StreamType[] = [
      { id: '1', name: 'بث مباشر', icon: Radio, color: '#FF4458', count: 1250 },
      { id: '2', name: 'بث صوتي', icon: Mic, color: '#9C27B0', count: 890 },
      { id: '3', name: 'فيديوهات', icon: VideoIcon, color: '#2196F3', count: 3420 },
      { id: '4', name: 'تحديات PK', icon: Zap, color: '#FF9800', count: 567 },
    ];
    setStreamTypes(mockStreamTypes);

    // Top Supporters
    const mockTopSupporters: TopSupporter[] = [
      {
        id: '1',
        name: 'محمد الكريم',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        totalGifts: 125000,
        level: 85
      },
      {
        id: '2',
        name: 'فاطمة النور',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        totalGifts: 98000,
        level: 72
      },
      {
        id: '3',
        name: 'أحمد السعيد',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        totalGifts: 87500,
        level: 68
      },
    ];
    setTopSupporters(mockTopSupporters);

    // Top Creators
    const mockTopCreators: TopCreator[] = [
      {
        id: '1',
        name: 'سارة المبدعة',
        username: '@sara_creative',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        followers: 2500000,
        totalViews: 15000000,
        isVerified: true,
        category: 'ترفيه'
      },
      {
        id: '2',
        name: 'خالد الفنان',
        username: '@khalid_artist',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        followers: 1800000,
        totalViews: 12000000,
        isVerified: true,
        category: 'فن'
      },
      {
        id: '3',
        name: 'نور الموسيقى',
        username: '@nour_music',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        followers: 1600000,
        totalViews: 10500000,
        isVerified: true,
        category: 'موسيقى'
      },
    ];
    setTopCreators(mockTopCreators);

    // Mock trending content
    const mockTrendingContent: TrendingContent[] = [
      {
        id: '1',
        title: 'تحدي الطبخ الجديد',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=400&fit=crop',
        creator: 'أحمد الطباخ',
        views: 125000,
        likes: 8900,
        duration: '15:30',
        type: 'video'
      },
      {
        id: '2',
        title: 'بث مباشر - أغاني عربية',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop',
        creator: 'فاطمة الموسيقية',
        views: 89000,
        likes: 12500,
        duration: 'مباشر',
        type: 'live'
      },
      {
        id: '3',
        title: 'بودكاست تقني',
        thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=400&fit=crop',
        creator: 'محمد التقني',
        views: 67000,
        likes: 5600,
        duration: '45:20',
        type: 'audio'
      },
    ];
    
    setTodayContent(mockTrendingContent);
    setTopViewed(mockTrendingContent.sort((a, b) => b.views - a.views));
    setTopEngagement(mockTrendingContent.sort((a, b) => b.likes - a.likes));
    setTrending(mockTrendingContent);

    // Daily Digest
    const mockDailyDigest: DailyDigest[] = [
      {
        id: '1',
        title: 'رحلة إلى الجبال',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        type: 'journal',
        author: 'أحمد المسافر',
        time: 'منذ ساعتين'
      },
      {
        id: '2',
        title: 'ورشة الطبخ الإيطالي',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        type: 'event',
        author: 'مطعم روما',
        time: 'غداً 7:00 م'
      },
      {
        id: '3',
        title: 'تجربة القهوة المختصة',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        type: 'journal',
        author: 'سارة القهوة',
        time: 'منذ 4 ساعات'
      },
    ];
    setDailyDigest(mockDailyDigest);

    // Upcoming Events
    const mockUpcomingEvents: UpcomingEvent[] = [
      {
        id: '1',
        title: 'معرض الفن المعاصر',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
        date: '15 ديسمبر',
        time: '6:00 م',
        location: 'مركز الفنون',
        attendees: 245
      },
      {
        id: '2',
        title: 'حفل موسيقي عربي',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        date: '18 ديسمبر',
        time: '8:00 م',
        location: 'دار الأوبرا',
        attendees: 890
      },
      {
        id: '3',
        title: 'ورشة التصوير',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
        date: '20 ديسمبر',
        time: '10:00 ص',
        location: 'استوديو النور',
        attendees: 67
      },
    ];
    setUpcomingEvents(mockUpcomingEvents);

    // Journal Entries
    const mockJournalEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'يوم جميل في الحديقة',
        content: 'قضيت اليوم في الحديقة النباتية، كان الطقس رائعاً والأزهار متفتحة بألوان زاهية...',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
        author: {
          name: 'فاطمة الطبيعة',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          username: '@fatima_nature'
        },
        likes: 234,
        comments: 45,
        time: 'منذ 3 ساعات',
        mood: '😊'
      },
      {
        id: '2',
        title: 'تجربة مطعم جديد',
        content: 'جربت اليوم مطعماً جديداً في وسط المدينة، الطعام كان لذيذاً جداً خاصة الكباب...',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        author: {
          name: 'محمد الطعام',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          username: '@mohammed_food'
        },
        likes: 189,
        comments: 32,
        time: 'منذ 5 ساعات',
        mood: '🤤'
      },
    ];
    setJournalEntries(mockJournalEntries);
  };

  const sections = [
    { id: 'stream-types', name: 'نوع البث', icon: Radio },
    { id: 'top-supporters', name: 'توب الداعمين', icon: Crown },
    { id: 'top-creators', name: 'توب المبدعين', icon: Trophy },
    { id: 'today', name: 'تصنيف اليوم', icon: Calendar },
    { id: 'top-viewed', name: 'أعلى مشاهدة', icon: Eye },
    { id: 'top-engagement', name: 'أعلى تفاعل', icon: Heart },
    { id: 'trending', name: 'رائج الآن', icon: Flame },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleContentPress = (content: TrendingContent) => {
    console.log('Content pressed:', content.title);
    if (content.type === 'live') {
      router.push(`/live-viewer/${content.id}`);
    } else if (content.type === 'audio') {
      router.push(`/audio-viewer/${content.id}`);
    } else {
      // Navigate to video player
    }
  };

  const handleCreatorPress = (creator: TopCreator) => {
    console.log('Creator pressed:', creator.name);
    router.push(`/user/${creator.id}`);
  };

  const handleStreamTypePress = (streamType: StreamType) => {
    console.log('Stream type pressed:', streamType.name);
    // TODO: Navigate to stream type category
  };

  const renderStreamType = (streamType: StreamType) => (
    <TouchableOpacity 
      key={streamType.id} 
      style={[styles.streamTypeCard, { borderLeftColor: streamType.color }]}
      onPress={() => handleStreamTypePress(streamType)}
    >
      <View style={[styles.streamTypeIcon, { backgroundColor: streamType.color }]}>
        <streamType.icon color={colors.white} size={24} />
      </View>
      <View style={styles.streamTypeInfo}>
        <Text style={styles.streamTypeName}>{streamType.name}</Text>
        <Text style={styles.streamTypeCount}>{formatNumber(streamType.count)} نشط</Text>
      </View>
      <View style={styles.streamTypeBadge}>
        <Text style={styles.streamTypeBadgeText}>مباشر</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTopSupporter = (supporter: TopSupporter, index: number) => (
    <TouchableOpacity key={supporter.id} style={styles.supporterCard}>
      <View style={styles.supporterRank}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
        {index < 3 && <Crown color={colors.warning} size={16} />}
      </View>
      <Image 
        source={{ uri: supporter.avatar }}
        style={styles.supporterAvatar}
        contentFit='cover'
      />
      <View style={styles.supporterInfo}>
        <Text style={styles.supporterName}>{supporter.name}</Text>
        <Text style={styles.supporterGifts}>{formatNumber(supporter.totalGifts)} هدية</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>LV {supporter.level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTopCreator = (creator: TopCreator, index: number) => (
    <TouchableOpacity 
      key={creator.id} 
      style={styles.creatorCard}
      onPress={() => handleCreatorPress(creator)}
    >
      <View style={styles.creatorRank}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
        {index < 3 && <Trophy color={colors.warning} size={16} />}
      </View>
      <Image 
        source={{ uri: creator.avatar }}
        style={styles.creatorAvatar}
        contentFit='cover'
      />
      <View style={styles.creatorInfo}>
        <View style={styles.creatorHeader}>
          <Text style={styles.creatorName}>{creator.name}</Text>
          {creator.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.creatorUsername}>{creator.username}</Text>
        <View style={styles.creatorStats}>
          <Text style={styles.creatorFollowers}>{formatNumber(creator.followers)} متابع</Text>
          <Text style={styles.creatorViews}>{formatNumber(creator.totalViews)} مشاهدة</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContentItem = (content: TrendingContent) => {
    const getTypeIcon = () => {
      switch (content.type) {
        case 'live': return <Radio color={colors.error} size={12} />;
        case 'audio': return <Mic color={colors.primary} size={12} />;
        default: return <Play color={colors.white} size={12} fill={colors.white} />;
      }
    };

    return (
      <TouchableOpacity 
        key={content.id} 
        style={styles.contentItem}
        onPress={() => handleContentPress(content)}
      >
        <Image 
          source={{ uri: content.thumbnail }}
          style={styles.contentThumbnail}
          contentFit='cover'
        />
        
        <View style={styles.contentOverlay}>
          {getTypeIcon()}
        </View>
        
        <View style={styles.contentDuration}>
          <Text style={styles.durationText}>{content.duration}</Text>
        </View>
        
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle} numberOfLines={2}>{content.title}</Text>
          <Text style={styles.contentCreator}>{content.creator}</Text>
          
          <View style={styles.contentStats}>
            <View style={styles.statItem}>
              <Eye color={colors.textSecondary} size={12} />
              <Text style={styles.statText}>{formatNumber(content.views)}</Text>
            </View>
            <View style={styles.statItem}>
              <Heart color={colors.textSecondary} size={12} />
              <Text style={styles.statText}>{formatNumber(content.likes)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'stream-types':
        return (
          <View style={styles.sectionContent}>
            {streamTypes.map(renderStreamType)}
          </View>
        );
      case 'top-supporters':
        return (
          <View style={styles.sectionContent}>
            {topSupporters.map(renderTopSupporter)}
          </View>
        );
      case 'top-creators':
        return (
          <View style={styles.sectionContent}>
            {topCreators.map(renderTopCreator)}
          </View>
        );
      case 'today':
        return (
          <View style={styles.contentGrid}>
            {todayContent.map(renderContentItem)}
          </View>
        );
      case 'top-viewed':
        return (
          <View style={styles.contentGrid}>
            {topViewed.map(renderContentItem)}
          </View>
        );
      case 'top-engagement':
        return (
          <View style={styles.contentGrid}>
            {topEngagement.map(renderContentItem)}
          </View>
        );
      case 'trending':
        return (
          <View style={styles.contentGrid}>
            {trending.map(renderContentItem)}
          </View>
        );
      default:
        return null;
    }
  };

  const renderDailyDigestItem = (item: DailyDigest) => (
    <TouchableOpacity key={item.id} style={styles.digestItem}>
      <Image 
        source={{ uri: item.image }}
        style={styles.digestImage}
        contentFit='cover'
      />
      <View style={styles.digestOverlay}>
        <View style={styles.digestTypeIcon}>
          {item.type === 'journal' ? 
            <BookOpen color={colors.white} size={16} /> : 
            <CalendarDays color={colors.white} size={16} />
          }
        </View>
        <View style={styles.digestInfo}>
          <Text style={styles.digestTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.digestAuthor}>{item.author}</Text>
          <Text style={styles.digestTime}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUpcomingEvent = (event: UpcomingEvent) => (
    <TouchableOpacity key={event.id} style={styles.eventCard}>
      <Image 
        source={{ uri: event.image }}
        style={styles.eventImage}
        contentFit='cover'
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
        <View style={styles.eventDetails}>
          <Text style={styles.eventDate}>{event.date}</Text>
          <Text style={styles.eventTime}>{event.time}</Text>
        </View>
        <Text style={styles.eventLocation}>{event.location}</Text>
        <View style={styles.eventAttendees}>
          <Users color={colors.textSecondary} size={14} />
          <Text style={styles.attendeesText}>{event.attendees} مهتم</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderJournalEntry = (entry: JournalEntry) => (
    <View key={entry.id} style={styles.journalCard}>
      <View style={styles.journalHeader}>
        <Image 
          source={{ uri: entry.author.avatar }}
          style={styles.authorAvatar}
          contentFit='cover'
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{entry.author.name}</Text>
          <Text style={styles.authorUsername}>{entry.author.username}</Text>
        </View>
        <View style={styles.journalMood}>
          <Text style={styles.moodEmoji}>{entry.mood}</Text>
        </View>
      </View>
      
      {entry.image && (
        <Image 
          source={{ uri: entry.image }}
          style={styles.journalImage}
          contentFit='cover'
        />
      )}
      
      <View style={styles.journalContent}>
        <Text style={styles.journalTitle}>{entry.title}</Text>
        <Text style={styles.journalText} numberOfLines={3}>{entry.content}</Text>
        
        <View style={styles.journalActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart color={colors.textSecondary} size={18} />
            <Text style={styles.actionText}>{entry.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle color={colors.textSecondary} size={18} />
            <Text style={styles.actionText}>{entry.comments}</Text>
          </TouchableOpacity>
          <Text style={styles.journalTime}>{entry.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.appLogo}>CHOBI</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Search color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Bell color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Daily Digest */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderNew}>
            <Text style={styles.sectionTitleNew}>خلاصة اليوم</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {dailyDigest.map(renderDailyDigestItem)}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderNew}>
            <Text style={styles.sectionTitleNew}>الفعاليات القادمة</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {upcomingEvents.map(renderUpcomingEvent)}
          </ScrollView>
        </View>

        {/* Category Filters */}
        <View style={styles.section}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <TouchableOpacity
                  key={section.id}
                  style={[
                    styles.categoryButton,
                    activeSection === section.id && styles.activeCategoryButton
                  ]}
                  onPress={() => setActiveSection(section.id)}
                >
                  <IconComponent 
                    color={activeSection === section.id ? colors.white : colors.textSecondary} 
                    size={16} 
                  />
                  <Text style={[
                    styles.categoryText,
                    activeSection === section.id && styles.activeCategoryText
                  ]}>
                    {section.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Dynamic Content */}
        <View style={styles.section}>
          {renderSectionContent()}
        </View>

        {/* Journal Entries Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderNew}>
            <Text style={styles.sectionTitleNew}>خلاصة اليوميات</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          {journalEntries.map(renderJournalEntry)}
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity 
          style={[styles.fab, styles.fabSecondary]}
          onPress={() => router.push('/(tabs)/events')}
        >
          <CalendarDays color={colors.white} size={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.fab, styles.fabPrimary]}
          onPress={() => router.push('/(tabs)/create')}
        >
          <Plus color={colors.white} size={24} />
        </TouchableOpacity>
      </View>

      <BottomNavigation 
        activeTab="discover" 
        onTabChange={(tab) => {
          if (tab === 'home') router.push('/(tabs)');
          else if (tab === 'profile') router.push('/(tabs)/profile');
          else if (tab === 'events') router.push('/(tabs)/events');
          else if (tab === 'create') router.push('/(tabs)/create');
        }} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Sticky Header
  stickyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flex: 1,
  },
  appLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitleNew: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  // Daily Digest
  horizontalScroll: {
    paddingLeft: 20,
  },
  horizontalScrollContent: {
    paddingRight: 20,
    gap: 16,
  },
  digestItem: {
    width: screenWidth * 0.7,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  digestImage: {
    width: '100%',
    height: '100%',
  },
  digestOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  digestTypeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  digestInfo: {
    marginTop: 8,
  },
  digestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  digestAuthor: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 2,
  },
  digestTime: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.7,
  },
  // Upcoming Events
  eventCard: {
    width: screenWidth * 0.6,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  eventLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeesText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Categories
  categoriesContainer: {
    paddingLeft: 20,
  },
  categoriesContent: {
    paddingRight: 20,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    minWidth: 100,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: colors.white,
    fontWeight: '600',
  },
  // Journal Entries
  journalCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  authorUsername: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  journalMood: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 8,
  },
  moodEmoji: {
    fontSize: 20,
  },
  journalImage: {
    width: '100%',
    height: 200,
  },
  journalContent: {
    padding: 16,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  journalText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  journalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  journalTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  // Floating Action Buttons
  floatingButtons: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabPrimary: {
    backgroundColor: colors.primary,
  },
  fabSecondary: {
    backgroundColor: colors.secondary,
  },

  sectionContent: {
    paddingVertical: 8,
  },
  // Stream Types
  streamTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  streamTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  streamTypeInfo: {
    flex: 1,
  },
  streamTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  streamTypeCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  streamTypeBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streamTypeBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Top Supporters
  supporterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  supporterRank: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 4,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  supporterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  supporterInfo: {
    flex: 1,
  },
  supporterName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  supporterGifts: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  levelBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Top Creators
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  creatorRank: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 4,
  },
  creatorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  creatorUsername: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  creatorStats: {
    flexDirection: 'row',
    gap: 12,
  },
  creatorFollowers: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  creatorViews: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // Content Grid
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  contentItem: {
    width: '50%',
    padding: 8,
  },
  contentThumbnail: {
    width: '100%',
    aspectRatio: 9/16,
    borderRadius: 12,
    marginBottom: 8,
  },
  contentOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  contentDuration: {
    position: 'absolute',
    bottom: 60,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  contentInfo: {
    paddingHorizontal: 4,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  contentCreator: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  contentStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});