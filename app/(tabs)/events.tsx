import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Award, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Trophy,
  Gift,
  Zap,
  Heart,
  MessageCircle,
  Share
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import BottomNavigation from '@/components/BottomNavigation';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'contest' | 'challenge' | 'live_event' | 'workshop';
  startDate: Date;
  endDate: Date;
  location?: string;
  isOnline: boolean;
  participants: number;
  maxParticipants?: number;
  prize?: string;
  organizer: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  thumbnail: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'ended';
}

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'event_join';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content?: string;
  timestamp: Date;
  isRead: boolean;
  event?: {
    id: string;
    title: string;
    thumbnail: string;
  };
}

export default function EventsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [dailyActivities, setDailyActivities] = useState<Activity[]>([]);
  const [weeklyEvents, setWeeklyEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEventsAndActivities();
  }, []);

  const loadEventsAndActivities = () => {
    // Weekly Events
    const mockWeeklyEvents: Event[] = [
      {
        id: '1',
        title: 'تحدي الطبخ الكبير',
        description: 'مسابقة طبخ شهرية للمبدعين في فن الطهي',
        type: 'contest',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-28'),
        isOnline: true,
        participants: 1250,
        maxParticipants: 2000,
        prize: '10,000 ريال + جوائز قيمة',
        organizer: {
          id: 'org1',
          name: 'أكاديمية الطبخ',
          avatar: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
          isVerified: true
        },
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        tags: ['طبخ', 'مسابقة', 'جوائز'],
        status: 'ongoing'
      },
      {
        id: '2',
        title: 'ورشة التصوير الاحترافي',
        description: 'تعلم أساسيات التصوير الاحترافي مع خبراء المجال',
        type: 'workshop',
        startDate: new Date('2024-01-25'),
        endDate: new Date('2024-01-25'),
        location: 'الرياض - مركز الملك عبدالعزيز الثقافي',
        isOnline: false,
        participants: 45,
        maxParticipants: 50,
        organizer: {
          id: 'org2',
          name: 'استوديو الضوء',
          avatar: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&h=100&fit=crop',
          isVerified: true
        },
        thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
        tags: ['تصوير', 'ورشة', 'تعليم'],
        status: 'upcoming'
      },
      {
        id: '3',
        title: 'بطولة الألعاب الإلكترونية',
        description: 'بطولة كبرى للألعاب الإلكترونية مع جوائز ضخمة',
        type: 'contest',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-02-17'),
        isOnline: true,
        participants: 3200,
        maxParticipants: 5000,
        prize: '50,000 ريال للفائز الأول',
        organizer: {
          id: 'org3',
          name: 'نادي الألعاب الإلكترونية',
          avatar: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
          isVerified: true
        },
        thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
        tags: ['ألعاب', 'بطولة', 'إلكترونية'],
        status: 'upcoming'
      },
      {
        id: '4',
        title: 'تحدي اللياقة البدنية',
        description: 'تحدي شهري للياقة البدنية والصحة العامة',
        type: 'challenge',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        isOnline: true,
        participants: 890,
        organizer: {
          id: 'org4',
          name: 'نادي الصحة واللياقة',
          avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
          isVerified: false
        },
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        tags: ['رياضة', 'صحة', 'تحدي'],
        status: 'ended'
      },
      {
        id: '5',
        title: 'مهرجان الموسيقى العربية',
        description: 'احتفالية كبرى للموسيقى العربية الأصيلة',
        type: 'live_event',
        startDate: new Date('2024-03-10'),
        endDate: new Date('2024-03-12'),
        location: 'جدة - مسرح الملك عبدالله',
        isOnline: false,
        participants: 2500,
        maxParticipants: 3000,
        organizer: {
          id: 'org5',
          name: 'دار الأوبرا السعودية',
          avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
          isVerified: true
        },
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        tags: ['موسيقى', 'مهرجان', 'ثقافة'],
        status: 'upcoming'
      }
    ];
    setWeeklyEvents(mockWeeklyEvents);

    // Daily Activities
    const mockDailyActivities: Activity[] = [
      {
        id: '1',
        type: 'event_join',
        user: {
          id: 'user1',
          name: 'أحمد محمد',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        timestamp: new Date('2024-01-20T10:30:00Z'),
        isRead: false,
        event: {
          id: '1',
          title: 'تحدي الطبخ الكبير',
          thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop'
        }
      },
      {
        id: '2',
        type: 'like',
        user: {
          id: 'user2',
          name: 'فاطمة علي',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        timestamp: new Date('2024-01-20T09:15:00Z'),
        isRead: false
      },
      {
        id: '3',
        type: 'comment',
        user: {
          id: 'user3',
          name: 'محمد سالم',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        content: 'رائع! متحمس للمشاركة في الفعالية',
        timestamp: new Date('2024-01-20T08:45:00Z'),
        isRead: true
      },
      {
        id: '4',
        type: 'follow',
        user: {
          id: 'user4',
          name: 'سارة أحمد',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        timestamp: new Date('2024-01-20T07:30:00Z'),
        isRead: true
      },
      {
        id: '5',
        type: 'like',
        user: {
          id: 'user5',
          name: 'خالد العتيبي',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
        },
        timestamp: new Date('2024-01-20T06:15:00Z'),
        isRead: false
      },
      {
        id: '6',
        type: 'comment',
        user: {
          id: 'user6',
          name: 'نورا الشمري',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
        },
        content: 'مشاركة رائعة! شكراً لك',
        timestamp: new Date('2024-01-20T05:45:00Z'),
        isRead: true
      },
      {
        id: '7',
        type: 'event_join',
        user: {
          id: 'user7',
          name: 'عبدالله القحطاني',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        timestamp: new Date('2024-01-20T04:30:00Z'),
        isRead: false,
        event: {
          id: '2',
          title: 'ورشة التصوير الاحترافي',
          thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&h=100&fit=crop'
        }
      },
      {
        id: '8',
        type: 'mention',
        user: {
          id: 'user8',
          name: 'ريم الدوسري',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        content: 'ذكرك في منشور عن الطبخ',
        timestamp: new Date('2024-01-20T03:15:00Z'),
        isRead: true
      }
    ];
    setDailyActivities(mockDailyActivities);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadEventsAndActivities();
      setRefreshing(false);
    }, 1000);
  };

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'contest':
        return <Trophy color={colors.warning} size={20} />;
      case 'challenge':
        return <Zap color={colors.primary} size={20} />;
      case 'live_event':
        return <Calendar color={colors.success} size={20} />;
      case 'workshop':
        return <Award color={colors.secondary} size={20} />;
      default:
        return <Calendar color={colors.primary} size={20} />;
    }
  };

  const getEventTypeLabel = (type: Event['type']) => {
    switch (type) {
      case 'contest':
        return 'مسابقة';
      case 'challenge':
        return 'تحدي';
      case 'live_event':
        return 'فعالية مباشرة';
      case 'workshop':
        return 'ورشة عمل';
      default:
        return 'فعالية';
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'ongoing':
        return colors.success;
      case 'upcoming':
        return colors.primary;
      case 'ended':
        return colors.textSecondary;
      default:
        return colors.primary;
    }
  };

  const getStatusLabel = (status: Event['status']) => {
    switch (status) {
      case 'ongoing':
        return 'جارية الآن';
      case 'upcoming':
        return 'قريباً';
      case 'ended':
        return 'انتهت';
      default:
        return 'قريباً';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `${diffInMinutes} د`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} س`;
    return `${Math.floor(diffInMinutes / 1440)} ي`;
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'like':
        return <Heart color={colors.error} size={16} fill={colors.error} />;
      case 'comment':
        return <MessageCircle color={colors.primary} size={16} />;
      case 'follow':
        return <Users color={colors.success} size={16} />;
      case 'mention':
        return <MessageCircle color={colors.warning} size={16} />;
      case 'event_join':
        return <Calendar color={colors.primary} size={16} />;
      default:
        return <Heart color={colors.primary} size={16} />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'like':
        return 'أعجب بمنشورك';
      case 'comment':
        return 'علق على منشورك';
      case 'follow':
        return 'بدأ بمتابعتك';
      case 'mention':
        return 'ذكرك في تعليق';
      case 'event_join':
        return activity.event ? `انضم إلى فعالية "${activity.event.title}"` : 'انضم إلى فعالية';
      default:
        return 'تفاعل مع محتواك';
    }
  };

  const renderEvent = (event: Event) => (
    <TouchableOpacity key={event.id} style={styles.eventCard}>
      <Image 
        source={{ uri: event.thumbnail }}
        style={styles.eventThumbnail}
        contentFit='cover'
      />
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventType}>
            {getEventTypeIcon(event.type)}
            <Text style={styles.eventTypeText}>{getEventTypeLabel(event.type)}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(event.status)}</Text>
          </View>
        </View>
        
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>{event.description}</Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Calendar color={colors.textSecondary} size={14} />
            <Text style={styles.eventDetailText}>{formatDate(event.startDate)}</Text>
          </View>
          
          {event.location && (
            <View style={styles.eventDetail}>
              <MapPin color={colors.textSecondary} size={14} />
              <Text style={styles.eventDetailText} numberOfLines={1}>{event.location}</Text>
            </View>
          )}
          
          <View style={styles.eventDetail}>
            <Users color={colors.textSecondary} size={14} />
            <Text style={styles.eventDetailText}>
              {event.participants} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''} مشارك
            </Text>
          </View>
        </View>
        
        {event.prize && (
          <View style={styles.prizeContainer}>
            <Gift color={colors.warning} size={16} />
            <Text style={styles.prizeText}>{event.prize}</Text>
          </View>
        )}
        
        <View style={styles.organizerInfo}>
          <Image 
            source={{ uri: event.organizer.avatar }}
            style={styles.organizerAvatar}
            contentFit='cover'
          />
          <Text style={styles.organizerName}>{event.organizer.name}</Text>
          {event.organizer.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.eventActions}>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>
              {event.status === 'ended' ? 'انتهت' : 'انضم الآن'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Share color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderActivity = (activity: Activity) => (
    <TouchableOpacity
      key={activity.id}
      style={[
        styles.activityItem,
        !activity.isRead && styles.unreadActivity
      ]}
    >
      <View style={styles.activityLeft}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: activity.user.avatar }}
            style={styles.userAvatar}
            contentFit='cover'
          />
          <View style={styles.activityIconContainer}>
            {getActivityIcon(activity.type)}
          </View>
        </View>

        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <Text style={styles.userName}>{activity.user.name}</Text>
            <Text style={styles.activityText}>{getActivityText(activity)}</Text>
          </View>
          
          {activity.content && (
            <Text style={styles.activityComment} numberOfLines={2}>
              &quot;{activity.content}&quot;
            </Text>
          )}
          
          <Text style={styles.timestamp}>{formatTimestamp(activity.timestamp)}</Text>
        </View>
      </View>

      {activity.event && (
        <View style={styles.eventThumbnailSmall}>
          <Image 
            source={{ uri: activity.event.thumbnail }}
            style={styles.eventImageSmall}
            contentFit='cover'
          />
        </View>
      )}

      {!activity.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
<Text style={styles.headerTitle}>اليوميات والفعاليات</Text>
        
        <TouchableOpacity>
          <Award color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'daily' && styles.activeTab
          ]}
          onPress={() => setActiveTab('daily')}
        >
          <Clock 
            color={activeTab === 'daily' ? colors.white : colors.textSecondary} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'daily' && styles.activeTabText
          ]}>
            اليوميات
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'weekly' && styles.activeTab
          ]}
          onPress={() => setActiveTab('weekly')}
        >
          <Calendar 
            color={activeTab === 'weekly' ? colors.white : colors.textSecondary} 
            size={20} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'weekly' && styles.activeTabText
          ]}>
            الفعاليات الأسبوعية
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {activeTab === 'daily' ? (
          <View style={styles.dailyContainer}>
            <View style={styles.sectionHeader}>
              <Clock color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>الأنشطة اليومية</Text>
              <Text style={styles.sectionSubtitle}>تفاعلاتك وأنشطتك اليوم</Text>
            </View>
            <View style={styles.activitiesContainer}>
              {dailyActivities.map(renderActivity)}
            </View>
          </View>
        ) : (
          <View style={styles.weeklyContainer}>
            <View style={styles.sectionHeader}>
              <Calendar color={colors.primary} size={24} />
              <Text style={styles.sectionTitle}>الفعاليات الأسبوعية</Text>
              <Text style={styles.sectionSubtitle}>فعاليات ومسابقات هذا الأسبوع</Text>
            </View>
            <View style={styles.eventsContainer}>
              {weeklyEvents.map(renderEvent)}
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNavigation 
        activeTab="events" 
        onTabChange={(tab) => {
          if (tab === 'home') router.push('/(tabs)');
          else if (tab === 'profile') router.push('/(tabs)/profile');
          else if (tab === 'discover') router.push('/(tabs)/discover');
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
    gap: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  dailyContainer: {
    flex: 1,
  },
  weeklyContainer: {
    flex: 1,
  },
  sectionHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  eventsContainer: {
    padding: 16,
    gap: 16,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventThumbnail: {
    width: '100%',
    height: 200,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventTypeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  prizeText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '600',
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  organizerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  organizerName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitiesContainer: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  unreadActivity: {
    backgroundColor: colors.surface,
  },
  activityLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  activityIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: colors.background,
  },
  activityContent: {
    flex: 1,
    paddingTop: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 4,
  },
  activityText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activityComment: {
    fontSize: 13,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: 4,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  eventThumbnailSmall: {
    marginLeft: 12,
  },
  eventImageSmall: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});