import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Video, 
  Mic, 
  Check, 
  X,
  Settings,
  Gift,
  Users,
  MessageCircle,
  Share,
  Filter,
  Volume2,
  Camera,
  Sparkles
} from 'lucide-react-native';
import { useStream } from '@/hooks/use-stream-store';

export default function StreamFeaturesDemo() {
  const router = useRouter();
  const stream = useStream();

  const features = [
    {
      category: 'البث المباشر',
      items: [
        { 
          name: 'بدء البث الفيديو', 
          icon: Video, 
          status: stream.isStreaming && stream.streamType === 'video',
          action: () => router.push('/video-stream')
        },
        { 
          name: 'بدء البث الصوتي', 
          icon: Mic, 
          status: stream.isStreaming && stream.streamType === 'audio',
          action: () => router.push('/audio-stream')
        },
      ]
    },
    {
      category: 'التحكم في البث',
      items: [
        { 
          name: 'كتم/تشغيل الصوت', 
          icon: Volume2, 
          status: !stream.isMuted,
          action: () => {
            stream.toggleMute();
            Alert.alert('الصوت', stream.isMuted ? 'تم تشغيل الصوت' : 'تم كتم الصوت');
          }
        },
        { 
          name: 'تشغيل/إيقاف الكاميرا', 
          icon: Camera, 
          status: stream.isVideoOn,
          action: () => {
            stream.toggleVideo();
            Alert.alert('الكاميرا', stream.isVideoOn ? 'تم إيقاف الكاميرا' : 'تم تشغيل الكاميرا');
          }
        },
        { 
          name: 'تبديل الكاميرا', 
          icon: Camera, 
          status: stream.isFrontCamera,
          action: () => {
            stream.toggleCamera();
            Alert.alert('الكاميرا', stream.isFrontCamera ? 'تم التبديل للكاميرا الخلفية' : 'تم التبديل للكاميرا الأمامية');
          }
        },
      ]
    },
    {
      category: 'الميزات التفاعلية',
      items: [
        { 
          name: 'إرسال هدية', 
          icon: Gift, 
          status: stream.settings.allowGifts,
          action: async () => {
            const success = await stream.sendGift('1', 'قلب', '❤️', 10);
            if (success) {
              Alert.alert('هدية', 'تم إرسال الهدية بنجاح! رصيدك الحالي: ' + stream.coinsBalance);
            }
          }
        },
        { 
          name: 'إرسال رسالة', 
          icon: MessageCircle, 
          status: stream.settings.allowComments,
          action: () => {
            stream.sendMessage('مرحباً من التجربة!');
            Alert.alert('رسالة', 'تم إرسال الرسالة. عدد الرسائل: ' + stream.messages.length);
          }
        },
        { 
          name: 'دعوة ضيف', 
          icon: Users, 
          status: stream.settings.allowGuests,
          action: () => {
            if (stream.viewers.length > 0) {
              stream.inviteGuest(stream.viewers[0].id);
            } else {
              Alert.alert('الضيوف', 'لا يوجد مشاهدين حالياً');
            }
          }
        },
      ]
    },
    {
      category: 'التأثيرات والفلاتر',
      items: [
        { 
          name: 'تطبيق فلتر فيديو', 
          icon: Filter, 
          status: stream.currentFilter !== 'none',
          action: () => {
            stream.applyVideoFilter('2');
            Alert.alert('فلتر', 'تم تطبيق فلتر الجمال');
          }
        },
        { 
          name: 'تشغيل مؤثر صوتي', 
          icon: Volume2, 
          status: false,
          action: () => {
            stream.playAudioEffect('1');
          }
        },
        { 
          name: 'وضع الجمال', 
          icon: Sparkles, 
          status: stream.settings.beautyMode,
          action: () => {
            stream.updateSettings({ beautyMode: !stream.settings.beautyMode });
            Alert.alert('وضع الجمال', stream.settings.beautyMode ? 'تم إيقاف وضع الجمال' : 'تم تفعيل وضع الجمال');
          }
        },
      ]
    },
    {
      category: 'الإعدادات',
      items: [
        { 
          name: 'جودة الفيديو', 
          icon: Settings, 
          status: stream.settings.videoQuality === 'high' || stream.settings.videoQuality === 'ultra',
          action: () => {
            const qualities = ['low', 'medium', 'high', 'ultra'] as const;
            const currentIndex = qualities.indexOf(stream.settings.videoQuality);
            const nextQuality = qualities[(currentIndex + 1) % qualities.length];
            stream.updateSettings({ videoQuality: nextQuality });
            Alert.alert('جودة الفيديو', `تم تغيير الجودة إلى ${nextQuality}`);
          }
        },
        { 
          name: 'التسجيل', 
          icon: Settings, 
          status: stream.isRecording,
          action: () => {
            stream.toggleRecording();
          }
        },
        { 
          name: 'السماح بالتعليقات', 
          icon: MessageCircle, 
          status: stream.settings.allowComments,
          action: () => {
            stream.updateSettings({ allowComments: !stream.settings.allowComments });
            Alert.alert('التعليقات', stream.settings.allowComments ? 'تم إيقاف التعليقات' : 'تم تفعيل التعليقات');
          }
        },
      ]
    },
    {
      category: 'الإحصائيات',
      items: [
        { 
          name: `المشاهدين: ${stream.stats.viewers}`, 
          icon: Users, 
          status: stream.stats.viewers > 0,
          action: () => Alert.alert('المشاهدين', `عدد المشاهدين الحالي: ${stream.stats.viewers}\nأعلى عدد مشاهدين: ${stream.stats.peakViewers}`)
        },
        { 
          name: `الأرباح: ${stream.stats.earnings} عملة`, 
          icon: Gift, 
          status: stream.stats.earnings > 0,
          action: () => Alert.alert('الأرباح', `إجمالي الأرباح: ${stream.stats.earnings} عملة\nعدد الهدايا: ${stream.stats.gifts}`)
        },
        { 
          name: `القلوب: ${stream.heartsCount}`, 
          icon: Gift, 
          status: stream.heartsCount > 0,
          action: () => Alert.alert('القلوب', `عدد القلوب: ${stream.heartsCount}\nالعملات المتبقية: ${stream.coinsBalance}`)
        },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <X size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>اختبار ميزات البث المباشر</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {features.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.featureItem}
                onPress={item.action}
              >
                <View style={styles.featureLeft}>
                  <View style={[styles.iconContainer, item.status && styles.iconContainerActive]}>
                    <item.icon size={20} color={item.status ? "white" : "#666"} />
                  </View>
                  <Text style={styles.featureName}>{item.name}</Text>
                </View>
                <View style={[styles.statusIndicator, item.status && styles.statusIndicatorActive]}>
                  {item.status ? (
                    <Check size={16} color="white" />
                  ) : (
                    <X size={16} color="#999" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>معلومات البث الحالي</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>حالة البث</Text>
              <Text style={styles.infoValue}>{stream.isStreaming ? 'مباشر' : 'متوقف'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>نوع البث</Text>
              <Text style={styles.infoValue}>{stream.streamType === 'video' ? 'فيديو' : 'صوتي'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>المدة</Text>
              <Text style={styles.infoValue}>{stream.stats.duration} ثانية</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>FPS</Text>
              <Text style={styles.infoValue}>{stream.stats.fps.toFixed(1)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bitrate</Text>
              <Text style={styles.infoValue}>{stream.stats.bitrate.toFixed(0)} kbps</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>التأخير</Text>
              <Text style={styles.infoValue}>{stream.stats.latency.toFixed(0)} ms</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/video-stream')}
        >
          <Video size={24} color="white" />
          <Text style={styles.primaryButtonText}>بدء بث فيديو جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.primaryButton, styles.secondaryButton]}
          onPress={() => router.push('/audio-stream')}
        >
          <Mic size={24} color="white" />
          <Text style={styles.primaryButtonText}>بدء بث صوتي جديد</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#111',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: '#8B5CF6',
  },
  featureName: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicatorActive: {
    backgroundColor: '#00FF88',
  },
  infoSection: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  infoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#FF4757',
    marginBottom: 40,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});