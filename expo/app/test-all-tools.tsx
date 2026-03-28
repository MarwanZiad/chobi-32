import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { 
  Play, 
  Settings, 
  Share2, 
  Image as ImageIcon, 
  Zap, 
  MessageCircle, 
  Users, 
  Radio,
  Youtube,
  Camera,
  Mic,
  Video,
  Gift,
  Filter,
  Volume2,
  Redo,
  UserPlus,
  Ban,
  VolumeX,
  Crown,
  Gamepad2,
  Palette,
  Music,
  Headphones
} from 'lucide-react-native';
import { YouTubePlayerModal } from '@/components/YouTubePlayer';
import { useStream } from '@/hooks/use-stream-store';
import { router } from 'expo-router';

interface ToolTest {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'streaming' | 'media' | 'social' | 'effects' | 'management';
  status: 'working' | 'partial' | 'demo';
  action: () => void;
}

export default function TestAllToolsScreen() {
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const {
    isStreaming,
    startStream,
    endStream,
    toggleMute,
    toggleVideo,
    toggleCamera,
    applyVideoFilter,
    playAudioEffect,
    sendGift,
    shareStream,
    toggleRecording,
    isMuted,
    isVideoOn,
    isRecording,
    stats,
    viewers,
    coinsBalance,
    heartsCount
  } = useStream();

  const testTools: ToolTest[] = [
    // Streaming Tools
    {
      id: 'start-video-stream',
      name: 'بدء البث المرئي',
      description: 'تشغيل البث المباشر بالفيديو والصوت',
      icon: <Video size={24} color="#fff" />,
      category: 'streaming',
      status: 'working',
      action: () => {
        if (isStreaming) {
          endStream();
        } else {
          startStream('video');
        }
      }
    },
    {
      id: 'start-audio-stream',
      name: 'بدء البث الصوتي',
      description: 'تشغيل البث المباشر بالصوت فقط',
      icon: <Radio size={24} color="#fff" />,
      category: 'streaming',
      status: 'working',
      action: () => {
        if (isStreaming) {
          endStream();
        } else {
          startStream('audio');
        }
      }
    },
    {
      id: 'toggle-mute',
      name: 'كتم/تشغيل الميكروفون',
      description: `الميكروفون حالياً: ${isMuted ? 'مكتوم' : 'مفعل'}`,
      icon: isMuted ? <VolumeX size={24} color="#ff4444" /> : <Mic size={24} color="#00ff00" />,
      category: 'streaming',
      status: 'working',
      action: toggleMute
    },
    {
      id: 'toggle-video',
      name: 'تشغيل/إيقاف الكاميرا',
      description: `الكاميرا حالياً: ${isVideoOn ? 'مفعلة' : 'معطلة'}`,
      icon: isVideoOn ? <Camera size={24} color="#00ff00" /> : <Camera size={24} color="#ff4444" />,
      category: 'streaming',
      status: 'working',
      action: toggleVideo
    },
    {
      id: 'toggle-camera',
      name: 'تبديل الكاميرا',
      description: 'التبديل بين الكاميرا الأمامية والخلفية',
      icon: <Camera size={24} color="#fff" />,
      category: 'streaming',
      status: 'working',
      action: toggleCamera
    },
    {
      id: 'toggle-recording',
      name: 'تسجيل البث',
      description: `التسجيل حالياً: ${isRecording ? 'مفعل' : 'معطل'}`,
      icon: <Redo size={24} color={isRecording ? "#ff0000" : "#fff"} />,
      category: 'streaming',
      status: 'working',
      action: toggleRecording
    },

    // Media Tools
    {
      id: 'youtube-player',
      name: 'مشغل YouTube',
      description: 'البحث وتشغيل فيديوهات YouTube داخل التطبيق',
      icon: <Youtube size={24} color="#ff0000" />,
      category: 'media',
      status: 'working',
      action: () => setShowYouTubeModal(true)
    },
    {
      id: 'share-stream',
      name: 'مشاركة البث',
      description: 'مشاركة رابط البث مع الآخرين',
      icon: <Share2 size={24} color="#fff" />,
      category: 'media',
      status: 'working',
      action: shareStream
    },

    // Effects Tools
    {
      id: 'video-filters',
      name: 'فلاتر الفيديو',
      description: 'تطبيق فلاتر جمالية على الفيديو',
      icon: <Filter size={24} color="#fff" />,
      category: 'effects',
      status: 'working',
      action: () => {
        const filters = ['1', '2', '3', '4', '5'];
        const randomFilter = filters[Math.floor(Math.random() * filters.length)];
        applyVideoFilter(randomFilter);
      }
    },
    {
      id: 'audio-effects',
      name: 'المؤثرات الصوتية',
      description: 'تشغيل أصوات تفاعلية (تصفيق، ضحك، موسيقى)',
      icon: <Volume2 size={24} color="#fff" />,
      category: 'effects',
      status: 'working',
      action: () => {
        const effects = ['1', '2', '3', '4', '5', '6', '7', '8'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        playAudioEffect(randomEffect);
      }
    },

    // Social Tools
    {
      id: 'send-gift',
      name: 'إرسال الهدايا',
      description: `الرصيد: ${coinsBalance} عملة | القلوب: ${heartsCount}`,
      icon: <Gift size={24} color="#ffd700" />,
      category: 'social',
      status: 'working',
      action: () => {
        sendGift('gift1', 'وردة', '🌹', 100);
      }
    },
    {
      id: 'viewer-management',
      name: 'إدارة المشاهدين',
      description: `المشاهدين الحاليين: ${viewers.length}`,
      icon: <Users size={24} color="#fff" />,
      category: 'management',
      status: 'working',
      action: () => {
        Alert.alert(
          'إدارة المشاهدين',
          `عدد المشاهدين: ${viewers.length}\nيمكنك حظر أو كتم أو دعوة المستخدمين`,
          [{ text: 'موافق' }]
        );
      }
    },

    // Navigation Tools
    {
      id: 'pk-challenges',
      name: 'تحديات PK',
      description: 'منافسات مباشرة مع مستخدمين آخرين',
      icon: <Crown size={24} color="#ffd700" />,
      category: 'social',
      status: 'working',
      action: () => router.push('/pk-challenges')
    },
    {
      id: 'room-tools',
      name: 'أدوات الغرفة',
      description: 'إعدادات وأدوات إدارة الغرفة',
      icon: <Settings size={24} color="#fff" />,
      category: 'management',
      status: 'working',
      action: () => router.push('/room-tools-demo')
    },
    {
      id: 'live-interfaces',
      name: 'واجهات البث المباشر',
      description: 'واجهات متقدمة لإدارة البث',
      icon: <Gamepad2 size={24} color="#fff" />,
      category: 'management',
      status: 'working',
      action: () => router.push('/live-interfaces-demo')
    },
    {
      id: 'stream-features',
      name: 'ميزات البث المتقدمة',
      description: 'أدوات تحكم متقدمة في البث',
      icon: <Zap size={24} color="#fff" />,
      category: 'streaming',
      status: 'working',
      action: () => router.push('/stream-features-demo')
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'streaming': return '#ff4458';
      case 'media': return '#ff6b35';
      case 'social': return '#4ecdc4';
      case 'effects': return '#a8e6cf';
      case 'management': return '#ffd93d';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return '#00ff00';
      case 'partial': return '#ffaa00';
      case 'demo': return '#0099ff';
      default: return '#666';
    }
  };

  const categories = ['streaming', 'media', 'social', 'effects', 'management'];
  const categoryNames = {
    streaming: 'أدوات البث',
    media: 'الوسائط',
    social: 'التفاعل الاجتماعي',
    effects: 'المؤثرات',
    management: 'الإدارة'
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'اختبار جميع الأدوات',
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Stats Header */}
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>إحصائيات البث الحالية</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.viewers}</Text>
              <Text style={styles.statLabel}>مشاهد</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.likes}</Text>
              <Text style={styles.statLabel}>إعجاب</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.comments}</Text>
              <Text style={styles.statLabel}>تعليق</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.gifts}</Text>
              <Text style={styles.statLabel}>هدية</Text>
            </View>
          </View>
          <View style={styles.streamStatus}>
            <View style={[styles.statusIndicator, { backgroundColor: isStreaming ? '#00ff00' : '#ff4444' }]} />
            <Text style={styles.statusText}>
              {isStreaming ? 'البث مفعل' : 'البث معطل'}
            </Text>
          </View>
        </View>

        {/* Tools by Category */}
        {categories.map(category => {
          const categoryTools = testTools.filter(tool => tool.category === category);
          return (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(category) }]} />
                <Text style={styles.categoryTitle}>{categoryNames[category as keyof typeof categoryNames]}</Text>
                <Text style={styles.categoryCount}>({categoryTools.length})</Text>
              </View>
              
              {categoryTools.map(tool => (
                <TouchableOpacity
                  key={tool.id}
                  style={styles.toolItem}
                  onPress={tool.action}
                  activeOpacity={0.7}
                >
                  <View style={styles.toolIcon}>
                    {tool.icon}
                  </View>
                  <View style={styles.toolInfo}>
                    <View style={styles.toolHeader}>
                      <Text style={styles.toolName}>{tool.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tool.status) }]}>
                        <Text style={styles.statusBadgeText}>
                          {tool.status === 'working' ? 'يعمل' : tool.status === 'partial' ? 'جزئي' : 'تجريبي'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.toolDescription}>{tool.description}</Text>
                  </View>
                  <Play size={16} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>كيفية الاستخدام:</Text>
          <Text style={styles.instructionText}>• اضغط على أي أداة لتجربتها</Text>
          <Text style={styles.instructionText}>• الأدوات الخضراء تعمل بشكل كامل</Text>
          <Text style={styles.instructionText}>• ستظهر رسائل تأكيد عند استخدام الأدوات</Text>
          <Text style={styles.instructionText}>• يمكنك مراقبة الإحصائيات في الأعلى</Text>
          <Text style={styles.instructionText}>• جميع الأدوات متوافقة مع الويب والموبايل</Text>
        </View>
      </ScrollView>

      {/* YouTube Player Modal */}
      <YouTubePlayerModal
        visible={showYouTubeModal}
        onClose={() => setShowYouTubeModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsHeader: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  streamStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
    flex: 1,
  },
  categoryCount: {
    color: '#999',
    fontSize: 14,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toolInfo: {
    flex: 1,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  toolName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold' as const,
  },
  toolDescription: {
    color: '#999',
    fontSize: 14,
    lineHeight: 18,
  },
  instructionsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  instructionsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 12,
  },
  instructionText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
});