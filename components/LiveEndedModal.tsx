import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { X, HelpCircle } from 'lucide-react-native';

interface LiveEndedModalProps {
  visible: boolean;
  onClose: () => void;
  streamData: {
    startTime: string;
    endTime: string;
    duration: string;
    earnings: string;
    viewers: number;
    newFollowers: number;
    supporters: number;
    pcu: number;
    comments: number;
  };
}

const { width, height } = Dimensions.get('window');

export default function LiveEndedModal({ visible, onClose, streamData }: LiveEndedModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        {/* Header with close button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={28} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>انتهى البث</Text>
          <Text style={styles.timeRange}>
            01/08 17:44 - 01/08 17:45
          </Text>
        </View>

        {/* Data Label */}
        <View style={styles.dataLabelSection}>
          <Text style={styles.dataLabel}>بيانات</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {/* First Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>$0.00</Text>
              <View style={styles.statLabelRow}>
                <Text style={styles.statLabel}>الربح</Text>
                <HelpCircle size={14} color="#666666" />
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>01:30</Text>
              <Text style={styles.statLabel}>المدة</Text>
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>المشاهدين</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>متابعين جدد</Text>
            </View>
          </View>

          {/* Third Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <View style={styles.statLabelRow}>
                <Text style={styles.statLabel}>PCU</Text>
                <HelpCircle size={14} color="#666666" />
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>الداعمين</Text>
            </View>
          </View>

          {/* Fourth Row - Comments (full width) */}
          <View style={styles.fullWidthCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>التعليقات</Text>
          </View>
        </View>

        {/* Bottom Home Indicator */}
        <View style={styles.homeIndicator} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: StatusBar.currentHeight || 44,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    padding: 4,
  },
  titleSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeRange: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
  dataLabelSection: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  dataLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  statsContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontWeight: '500',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullWidthCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#ffffff',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 34,
  },
});