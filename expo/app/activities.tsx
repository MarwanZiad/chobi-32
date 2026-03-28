import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle,
  UserPlus,
  Share,
  Play,
  Users,
  Clock,
  Zap
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'share' | 'mention' | 'live_join';
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content?: string;
  timestamp: string;
  isRead: boolean;
  targetContent?: {
    type: 'video' | 'live';
    thumbnail?: string;
    title?: string;
  };
}

export default function ActivitiesScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'like',
        user: {
          id: 'user1',
          name: 'أحمد محمد',
          username: '@ahmed123',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        timestamp: '2024-01-20T10:30:00Z',
        isRead: false,
        targetContent: {
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
          title: 'فيديو رائع',
        },
      },
      {
        id: '2',
        type: 'comment',
        user: {
          id: 'user2',
          name: 'فاطمة علي',
          username: '@fatima_ali',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        },
        content: 'فيديو رائع! أحببت المحتوى كثيراً',
        timestamp: '2024-01-20T09:15:00Z',
        isRead: false,
        targetContent: {
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
          title: 'تعلم البرمجة',
        },
      },
      {
        id: '3',
        type: 'follow',
        user: {
          id: 'user3',
          name: 'محمد سالم',
          username: '@mohammed_salem',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        },
        timestamp: '2024-01-20T08:45:00Z',
        isRead: true,
      },
      {
        id: '4',
        type: 'live_join',
        user: {
          id: 'user4',
          name: 'سارة أحمد',
          username: '@sara_ahmed',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        },
        timestamp: '2024-01-20T07:30:00Z',
        isRead: true,
        targetContent: {
          type: 'live',
          title: 'بث مباشر - نقاش تقني',
        },
      },
      {
        id: '5',
        type: 'share',
        user: {
          id: 'user5',
          name: 'خالد يوسف',
          username: '@khalid_youssef',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        },
        timestamp: '2024-01-19T22:15:00Z',
        isRead: true,
        targetContent: {
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
          title: 'نصائح في التصوير',
        },
      },
      {
        id: '6',
        type: 'mention',
        user: {
          id: 'user6',
          name: 'نور الدين',
          username: '@nour_aldin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        content: 'شكراً لك @marwan على المحتوى الرائع!',
        timestamp: '2024-01-19T20:00:00Z',
        isRead: true,
        targetContent: {
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
          title: 'درس في التطوير',
        },
      },
    ];

    setActivities(mockActivities);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadActivities();
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, isRead: true }
          : activity
      )
    );
  };

  const markAllAsRead = () => {
    setActivities(prev => 
      prev.map(activity => ({ ...activity, isRead: true }))
    );
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'like':
        return <Heart color={colors.error} size={20} fill={colors.error} />;
      case 'comment':
        return <MessageCircle color={colors.primary} size={20} />;
      case 'follow':
        return <UserPlus color={colors.success} size={20} />;
      case 'share':
        return <Share color={colors.secondary} size={20} />;
      case 'mention':
        return <MessageCircle color={colors.warning} size={20} />;
      case 'live_join':
        return <Zap color={colors.error} size={20} />;
      default:
        return <Heart color={colors.primary} size={20} />;
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
      case 'share':
        return 'شارك منشورك';
      case 'mention':
        return 'ذكرك في تعليق';
      case 'live_join':
        return 'انضم إلى بثك المباشر';
      default:
        return 'تفاعل مع محتواك';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `${diffInMinutes} د`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} س`;
    return `${Math.floor(diffInMinutes / 1440)} ي`;
  };

  const filteredActivities = filter === 'unread' 
    ? activities.filter(activity => !activity.isRead)
    : activities;

  const unreadCount = activities.filter(activity => !activity.isRead).length;

  const renderActivity = (activity: Activity) => (
    <TouchableOpacity
      key={activity.id}
      style={[
        styles.activityItem,
        !activity.isRead && styles.unreadActivity
      ]}
      onPress={() => markAsRead(activity.id)}
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

      {activity.targetContent && (
        <View style={styles.targetContent}>
          {activity.targetContent.thumbnail ? (
            <Image 
              source={{ uri: activity.targetContent.thumbnail }}
              style={styles.contentThumbnail}
              contentFit='cover'
            />
          ) : (
            <View style={styles.liveIndicator}>
              <Zap color={colors.white} size={16} />
            </View>
          )}
          {activity.targetContent.type === 'video' && (
            <View style={styles.playIcon}>
              <Play color={colors.white} size={12} fill={colors.white} />
            </View>
          )}
        </View>
      )}

      {!activity.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/')}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>الأنشطة</Text>
        
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllRead}>قراءة الكل</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'all' && styles.activeFilterTab
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            filter === 'all' && styles.activeFilterText
          ]}>
            الكل ({activities.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'unread' && styles.activeFilterTab
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[
            styles.filterText,
            filter === 'unread' && styles.activeFilterText
          ]}>
            غير مقروءة ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Activities List */}
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
        {filteredActivities.length > 0 ? (
          filteredActivities.map(renderActivity)
        ) : (
          <View style={styles.emptyState}>
            <Clock color={colors.textSecondary} size={48} />
            <Text style={styles.emptyTitle}>لا توجد أنشطة</Text>
            <Text style={styles.emptyDescription}>
              {filter === 'unread' 
                ? 'لا توجد أنشطة غير مقروءة'
                : 'ستظهر هنا جميع التفاعلات مع محتواك'
              }
            </Text>
          </View>
        )}
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
  markAllRead: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.white,
    fontWeight: '600',
  },
  content: {
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
    borderRadius: 12,
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
  targetContent: {
    position: 'relative',
    marginLeft: 12,
  },
  contentThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  liveIndicator: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -6 }, { translateY: -6 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 4,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});