import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import {
  Sparkles,
  Star,
  BarChart3,
  Sliders,
  MessageCircle,
  Coffee,
  SkipForward,
  Camera,
  MicOff,
  ChevronLeft,
  TrendingUp,
} from 'lucide-react-native';

interface StreamOptimizationModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const StreamOptimizationModal: React.FC<StreamOptimizationModalProps> = ({
  visible,
  onClose,
}) => {
  const [beautifyEnabled, setBeautifyEnabled] = useState<boolean>(false);
  const [effectsEnabled, setEffectsEnabled] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [mirrorEnabled, setMirrorEnabled] = useState<boolean>(false);
  const [reverseEnabled, setReverseEnabled] = useState<boolean>(false);
  const [muteEnabled, setMuteEnabled] = useState<boolean>(false);
  const [performanceEnabled, setPerformanceEnabled] = useState<boolean>(true);

  const optimizationItems = [
    {
      id: 'beautify',
      title: 'تجميل',
      icon: <Sparkles size={24} color="#fff" />,
      value: beautifyEnabled,
      onToggle: setBeautifyEnabled,
    },
    {
      id: 'effects',
      title: 'المؤثرات',
      icon: <Star size={24} color="#fff" />,
      value: effectsEnabled,
      onToggle: setEffectsEnabled,
    },
    {
      id: 'audio',
      title: 'تغيير الصوت',
      icon: <BarChart3 size={24} color="#fff" />,
      value: audioEnabled,
      onToggle: setAudioEnabled,
    },
    {
      id: 'sound-effects',
      title: 'مؤثرات صوتية',
      icon: <Sliders size={24} color="#fff" />,
      value: true,
      onToggle: () => {},
    },
    {
      id: 'comments',
      title: 'التعليقات',
      icon: <MessageCircle size={24} color="#fff" />,
      value: true,
      onToggle: () => {},
    },
    {
      id: 'pause-stream',
      title: 'إيقاف البث مؤقتاً',
      icon: <Coffee size={24} color="#fff" />,
      value: false,
      onToggle: () => {},
    },
    {
      id: 'mirror',
      title: 'مرآة',
      icon: <SkipForward size={24} color="#fff" />,
      value: mirrorEnabled,
      onToggle: setMirrorEnabled,
    },
    {
      id: 'reverse',
      title: 'عكس',
      icon: <Camera size={24} color="#fff" />,
      value: reverseEnabled,
      onToggle: setReverseEnabled,
    },
    {
      id: 'mute',
      title: 'كتم الصوت',
      icon: <MicOff size={24} color="#fff" />,
      value: muteEnabled,
      onToggle: setMuteEnabled,
    },
    {
      id: 'performance',
      title: 'الأداء في الوقت الحالي',
      icon: <TrendingUp size={24} color="#fff" />,
      value: performanceEnabled,
      onToggle: setPerformanceEnabled,
    },
  ];

  const renderOptimizationItem = (item: any) => {
    return (
      <View key={item.id} style={styles.optimizationItem}>
        <View style={styles.itemLeft}>
          <View style={styles.iconContainer}>{item.icon}</View>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
        <View style={styles.itemRight}>
          {item.id === 'sound-effects' || item.id === 'comments' || item.id === 'pause-stream' ? (
            <TouchableOpacity style={styles.chevronButton}>
              <ChevronLeft size={20} color="#666" />
            </TouchableOpacity>
          ) : (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#3a3a3c', true: '#34c759' }}
              thumbColor={item.value ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3a3a3c"
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>الأدوات</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.optimizationList}>
              {optimizationItems.map(renderOptimizationItem)}
            </View>
          </ScrollView>

          <View style={styles.bottomIndicator} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2c2c2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  optimizationList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  optimizationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2c2c2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  itemRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronButton: {
    padding: 8,
  },
  bottomIndicator: {
    width: 36,
    height: 5,
    backgroundColor: '#3a3a3c',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default StreamOptimizationModal;