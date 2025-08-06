import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ChevronRight, Heart, Wifi } from 'lucide-react-native';

interface StreamStatusModalProps {
  visible: boolean;
  onClose: () => void;
  streamDuration: string;
  viewersCount: number;
  newFollowersCount: number;
  supportersCount: number;
  touchesCount: number;
}

export default function StreamStatusModal({
  visible,
  onClose,
  streamDuration = '00:00:09',
  viewersCount = 0,
  newFollowersCount = 0,
  supportersCount = 0,
  touchesCount = 0,
}: StreamStatusModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ChevronRight size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>الأداء في الوقت الحالي</Text>
        </View>

        {/* Network Status */}
        <View style={styles.networkStatus}>
          <View style={styles.networkIndicator}>
            <View style={styles.signalBars}>
              <View style={[styles.bar, styles.bar1]} />
              <View style={[styles.bar, styles.bar2]} />
              <View style={[styles.bar, styles.bar3]} />
            </View>
            <Text style={styles.networkText}>اتصال الشبكة</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>المدة</Text>
            <Text style={styles.duration}>{streamDuration}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>المشاهدين</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>متابعين جدد</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>الداعمين</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>اللمسات</Text>
              <View style={styles.touchesContainer}>
                <Heart size={16} color="#FF1493" fill="#FF1493" />
                <Text style={styles.statValue}>--</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>نصائح</Text>
          <Text style={styles.tipsText}>
            انضموا الآن! دعوة لمتابعيك الذين يتلقون جميع إشعاراتك
            والجزء المخصص صالحة لمدة 5 دقائق فقط
          </Text>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>دعوة</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  networkStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  networkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  bar: {
    width: 3,
    backgroundColor: '#00FF00',
    marginRight: 1,
    borderRadius: 1,
  },
  bar1: {
    height: 6,
  },
  bar2: {
    height: 10,
  },
  bar3: {
    height: 14,
  },
  networkText: {
    color: '#00FF00',
    fontSize: 14,
  },
  durationContainer: {
    alignItems: 'flex-end',
  },
  durationLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  duration: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  statLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  touchesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsContainer: {
    margin: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
  },
  tipsText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: 20,
  },
  inviteButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});