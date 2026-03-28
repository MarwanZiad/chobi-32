import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  FlipHorizontal,
  Settings,
  Filter,
  Volume2,
  Music,
  Sparkles,
  Gift,
  MessageCircle,
  Users,
  UserPlus,
  Ban,
  UserMinus,
  X,
  Check,
  Sliders,
  Image as ImageIcon,
  Share,
  MoreHorizontal,
  Bell,
  Heart,
  Star,
  Crown,
  Zap,
  Flame,
  Diamond,
  Coins,
  TrendingUp,
  Activity,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Save,
  Download,
  Upload,
  RefreshCw,
  RotateCw,
  Maximize,
  Minimize,
  PauseCircle,
  PlayCircle,
  StopCircle,
  Circle,
  Square,
  Hexagon,
  Triangle,
} from 'lucide-react-native';
import { useStream } from '@/hooks/use-stream-store';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';

interface StreamControlsProps {
  streamType: 'video' | 'audio';
  onClose: () => void;
}

export default function StreamControls({ streamType, onClose }: StreamControlsProps) {
  const stream = useStream();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState(stream.settings.videoQuality);
  const [selectedAudioQuality, setSelectedAudioQuality] = useState(stream.settings.audioQuality);
  const [beautyLevel, setBeautyLevel] = useState(stream.settings.beautyLevel);
  const [micVolume, setMicVolume] = useState(stream.settings.micVolume);
  const [speakerVolume, setSpeakerVolume] = useState(stream.settings.speakerVolume);
  const [bassLevel, setBassLevel] = useState(stream.settings.bassLevel);
  const [trebleLevel, setTrebleLevel] = useState(stream.settings.trebleLevel);
  const [echoLevel, setEchoLevel] = useState(stream.settings.echoLevel);
  const [streamTitle, setStreamTitle] = useState(stream.settings.streamTitle);
  const [streamCategory, setStreamCategory] = useState(stream.settings.streamCategory);
  const [viewerLimit, setViewerLimit] = useState(stream.settings.viewerLimit.toString());
  const [maxGuests, setMaxGuests] = useState(stream.settings.maxGuests.toString());

  const handleHaptic = useCallback(async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS !== 'web') {
      const style = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      };
      await Haptics.impactAsync(style[type]);
    }
  }, []);

  const handleToggleMute = useCallback(async () => {
    await handleHaptic('medium');
    stream.toggleMute();
    Alert.alert(
      stream.isMuted ? 'تشغيل الصوت' : 'كتم الصوت',
      stream.isMuted ? 'تم تشغيل الميكروفون' : 'تم كتم الميكروفون'
    );
  }, [stream, handleHaptic]);

  const handleToggleVideo = useCallback(async () => {
    if (streamType === 'video') {
      await handleHaptic('medium');
      stream.toggleVideo();
      Alert.alert(
        stream.isVideoOn ? 'إيقاف الفيديو' : 'تشغيل الفيديو',
        stream.isVideoOn ? 'تم إيقاف الكاميرا' : 'تم تشغيل الكاميرا'
      );
    }
  }, [stream, streamType, handleHaptic]);

  const handleToggleCamera = useCallback(async () => {
    if (streamType === 'video') {
      await handleHaptic('medium');
      stream.toggleCamera();
      Alert.alert('تبديل الكاميرا', stream.isFrontCamera ? 'تم التبديل للكاميرا الخلفية' : 'تم التبديل للكاميرا الأمامية');
    }
  }, [stream, streamType, handleHaptic]);

  const handleToggleRecording = useCallback(async () => {
    await handleHaptic('heavy');
    stream.toggleRecording();
  }, [stream, handleHaptic]);

  const handleSaveSettings = useCallback(async () => {
    await handleHaptic('medium');
    await stream.updateSettings({
      videoQuality: selectedQuality,
      audioQuality: selectedAudioQuality,
      beautyLevel,
      micVolume,
      speakerVolume,
      bassLevel,
      trebleLevel,
      echoLevel,
      streamTitle,
      streamCategory,
      viewerLimit: parseInt(viewerLimit) || 0,
      maxGuests: parseInt(maxGuests) || 8,
    });
    Alert.alert('الإعدادات', 'تم حفظ الإعدادات بنجاح');
    setActiveModal(null);
  }, [
    stream,
    selectedQuality,
    selectedAudioQuality,
    beautyLevel,
    micVolume,
    speakerVolume,
    bassLevel,
    trebleLevel,
    echoLevel,
    streamTitle,
    streamCategory,
    viewerLimit,
    maxGuests,
    handleHaptic,
  ]);

  const renderVideoQualityModal = () => (
    <Modal visible={activeModal === 'video-quality'} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>جودة الفيديو</Text>
            <TouchableOpacity onPress={() => setActiveModal(null)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[styles.qualityOption, selectedQuality === quality && styles.qualityOptionActive]}
                onPress={() => {
                  setSelectedQuality(quality);
                  handleHaptic('light');
                }}
              >
                <View style={styles.qualityInfo}>
                  <Text style={styles.qualityTitle}>
                    {quality === 'low' ? 'منخفضة' : quality === 'medium' ? 'متوسطة' : quality === 'high' ? 'عالية' : 'فائقة'}
                  </Text>
                  <Text style={styles.qualityDescription}>
                    {quality === 'low' ? '480p - استهلاك أقل للبيانات' :
                     quality === 'medium' ? '720p - جودة جيدة' :
                     quality === 'high' ? '1080p - جودة عالية' :
                     '4K - أفضل جودة'}
                  </Text>
                </View>
                {selectedQuality === quality && <Check size={20} color="#00ff00" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Text style={styles.saveButtonText}>حفظ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAudioSettingsModal = () => (
    <Modal visible={activeModal === 'audio-settings'} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>إعدادات الصوت</Text>
            <TouchableOpacity onPress={() => setActiveModal(null)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>مستوى الميكروفون</Text>
              <View style={styles.sliderContainer}>
                <Mic size={20} color="#666" />
                <Slider
                  style={styles.slider}
                  value={micVolume}
                  onValueChange={setMicVolume}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#00ff00"
                  maximumTrackTintColor="#333"
                  thumbTintColor="#00ff00"
                />
                <Text style={styles.sliderValue}>{Math.round(micVolume)}%</Text>
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>مستوى السماعة</Text>
              <View style={styles.sliderContainer}>
                <Volume2 size={20} color="#666" />
                <Slider
                  style={styles.slider}
                  value={speakerVolume}
                  onValueChange={setSpeakerVolume}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#00ff00"
                  maximumTrackTintColor="#333"
                  thumbTintColor="#00ff00"
                />
                <Text style={styles.sliderValue}>{Math.round(speakerVolume)}%</Text>
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>مستوى الباس</Text>
              <View style={styles.sliderContainer}>
                <Music size={20} color="#666" />
                <Slider
                  style={styles.slider}
                  value={bassLevel}
                  onValueChange={setBassLevel}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#ffd700"
                  maximumTrackTintColor="#333"
                  thumbTintColor="#ffd700"
                />
                <Text style={styles.sliderValue}>{Math.round(bassLevel)}%</Text>
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>الترددات العالية</Text>
              <View style={styles.sliderContainer}>
                <Zap size={20} color="#666" />
                <Slider
                  style={styles.slider}
                  value={trebleLevel}
                  onValueChange={setTrebleLevel}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#00bfff"
                  maximumTrackTintColor="#333"
                  thumbTintColor="#00bfff"
                />
                <Text style={styles.sliderValue}>{Math.round(trebleLevel)}%</Text>
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>مستوى الصدى</Text>
              <View style={styles.sliderContainer}>
                <RefreshCw size={20} color="#666" />
                <Slider
                  style={styles.slider}
                  value={echoLevel}
                  onValueChange={setEchoLevel}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#ff69b4"
                  maximumTrackTintColor="#333"
                  thumbTintColor="#ff69b4"
                />
                <Text style={styles.sliderValue}>{Math.round(echoLevel)}%</Text>
              </View>
            </View>

            <View style={styles.toggleSection}>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>تقليل الضوضاء</Text>
                <Switch
                  value={stream.settings.noiseReduction}
                  onValueChange={(value) => stream.updateSettings({ noiseReduction: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>التحكم التلقائي بالكسب</Text>
                <Switch
                  value={stream.settings.autoGainControl}
                  onValueChange={(value) => stream.updateSettings({ autoGainControl: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>إلغاء الصدى</Text>
                <Switch
                  value={stream.settings.echoCancellation}
                  onValueChange={(value) => stream.updateSettings({ echoCancellation: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Text style={styles.saveButtonText}>حفظ الإعدادات</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderStreamSettingsModal = () => (
    <Modal visible={activeModal === 'stream-settings'} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>إعدادات البث</Text>
            <TouchableOpacity onPress={() => setActiveModal(null)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>عنوان البث</Text>
              <TextInput
                style={styles.textInput}
                value={streamTitle}
                onChangeText={setStreamTitle}
                placeholder="أدخل عنوان البث..."
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>فئة البث</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                {['عام', 'ألعاب', 'موسيقى', 'رياضة', 'تعليم', 'طبخ', 'سفر'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.categoryChip, streamCategory === category && styles.categoryChipActive]}
                    onPress={() => {
                      setStreamCategory(category);
                      handleHaptic('light');
                    }}
                  >
                    <Text style={[styles.categoryText, streamCategory === category && styles.categoryTextActive]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>حد المشاهدين</Text>
              <TextInput
                style={styles.textInput}
                value={viewerLimit}
                onChangeText={setViewerLimit}
                placeholder="0 = غير محدود"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>عدد الضيوف الأقصى</Text>
              <TextInput
                style={styles.textInput}
                value={maxGuests}
                onChangeText={setMaxGuests}
                placeholder="8"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.toggleSection}>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>السماح بالتعليقات</Text>
                <Switch
                  value={stream.settings.allowComments}
                  onValueChange={(value) => stream.updateSettings({ allowComments: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>السماح بالهدايا</Text>
                <Switch
                  value={stream.settings.allowGifts}
                  onValueChange={(value) => stream.updateSettings({ allowGifts: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>السماح بالضيوف</Text>
                <Switch
                  value={stream.settings.allowGuests}
                  onValueChange={(value) => stream.updateSettings({ allowGuests: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>الوضع الخاص</Text>
                <Switch
                  value={stream.settings.privateMode}
                  onValueChange={(value) => stream.updateSettings({ privateMode: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>تسجيل البث</Text>
                <Switch
                  value={stream.settings.recordStream}
                  onValueChange={(value) => stream.updateSettings({ recordStream: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>الحفظ في المعرض</Text>
                <Switch
                  value={stream.settings.saveToGallery}
                  onValueChange={(value) => stream.updateSettings({ saveToGallery: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>إشعار المتابعين</Text>
                <Switch
                  value={stream.settings.notifyFollowers}
                  onValueChange={(value) => stream.updateSettings({ notifyFollowers: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>تقييد العمر</Text>
                <Switch
                  value={stream.settings.ageRestriction}
                  onValueChange={(value) => stream.updateSettings({ ageRestriction: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>العلامة المائية</Text>
                <Switch
                  value={stream.settings.watermark}
                  onValueChange={(value) => stream.updateSettings({ watermark: value })}
                  trackColor={{ false: '#333', true: '#00ff00' }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Text style={styles.saveButtonText}>حفظ الإعدادات</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.mainControls}>
          <TouchableOpacity
            style={[styles.controlButton, stream.isMuted && styles.controlButtonActive]}
            onPress={handleToggleMute}
          >
            {stream.isMuted ? <MicOff size={24} color="#ff4444" /> : <Mic size={24} color="#fff" />}
            <Text style={styles.controlLabel}>{stream.isMuted ? 'صوت مغلق' : 'صوت مفتوح'}</Text>
          </TouchableOpacity>

          {streamType === 'video' && (
            <>
              <TouchableOpacity
                style={[styles.controlButton, !stream.isVideoOn && styles.controlButtonActive]}
                onPress={handleToggleVideo}
              >
                {stream.isVideoOn ? <Video size={24} color="#fff" /> : <VideoOff size={24} color="#ff4444" />}
                <Text style={styles.controlLabel}>{stream.isVideoOn ? 'فيديو مفتوح' : 'فيديو مغلق'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={handleToggleCamera}>
                <FlipHorizontal size={24} color="#fff" />
                <Text style={styles.controlLabel}>تبديل الكاميرا</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.controlButton, stream.isRecording && styles.controlButtonRecording]}
            onPress={handleToggleRecording}
          >
            <Circle size={24} color={stream.isRecording ? '#ff0000' : '#fff'} fill={stream.isRecording ? '#ff0000' : 'none'} />
            <Text style={styles.controlLabel}>{stream.isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secondaryControls}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setActiveModal('video-quality')}>
            <TrendingUp size={20} color="#fff" />
            <Text style={styles.secondaryLabel}>الجودة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => setActiveModal('audio-settings')}>
            <Sliders size={20} color="#fff" />
            <Text style={styles.secondaryLabel}>الصوت</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => setActiveModal('stream-settings')}>
            <Settings size={20} color="#fff" />
            <Text style={styles.secondaryLabel}>الإعدادات</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Eye size={16} color="#00ff00" />
            <Text style={styles.statValue}>{stream.stats.viewers}</Text>
            <Text style={styles.statLabel}>مشاهد</Text>
          </View>

          <View style={styles.statItem}>
            <Heart size={16} color="#ff69b4" />
            <Text style={styles.statValue}>{stream.stats.likes}</Text>
            <Text style={styles.statLabel}>إعجاب</Text>
          </View>

          <View style={styles.statItem}>
            <MessageCircle size={16} color="#00bfff" />
            <Text style={styles.statValue}>{stream.stats.comments}</Text>
            <Text style={styles.statLabel}>تعليق</Text>
          </View>

          <View style={styles.statItem}>
            <Gift size={16} color="#ffd700" />
            <Text style={styles.statValue}>{stream.stats.gifts}</Text>
            <Text style={styles.statLabel}>هدية</Text>
          </View>

          <View style={styles.statItem}>
            <Coins size={16} color="#ffa500" />
            <Text style={styles.statValue}>{stream.stats.earnings}</Text>
            <Text style={styles.statLabel}>أرباح</Text>
          </View>
        </View>

        <View style={styles.networkStats}>
          <View style={styles.networkStatItem}>
            <Activity size={14} color="#00ff00" />
            <Text style={styles.networkStatText}>FPS: {stream.stats.fps.toFixed(1)}</Text>
          </View>

          <View style={styles.networkStatItem}>
            <Wifi size={14} color="#00ff00" />
            <Text style={styles.networkStatText}>Bitrate: {stream.stats.bitrate}</Text>
          </View>

          <View style={styles.networkStatItem}>
            <Zap size={14} color="#ffd700" />
            <Text style={styles.networkStatText}>Latency: {stream.stats.latency}ms</Text>
          </View>
        </View>
      </View>

      {renderVideoQualityModal()}
      {renderAudioSettingsModal()}
      {renderStreamSettingsModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
    borderRadius: 16,
    margin: 16,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 80,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
  controlButtonRecording: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  secondaryLabel: {
    color: '#fff',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  statLabel: {
    color: '#999',
    fontSize: 10,
  },
  networkStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  networkStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  networkStatText: {
    color: '#999',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  qualityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 8,
  },
  qualityOptionActive: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  qualityInfo: {
    flex: 1,
  },
  qualityTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  qualityDescription: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    color: '#fff',
    fontSize: 14,
    minWidth: 40,
    textAlign: 'right',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  categoryText: {
    color: '#999',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#00ff00',
  },
  toggleSection: {
    marginTop: 16,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#00ff00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});