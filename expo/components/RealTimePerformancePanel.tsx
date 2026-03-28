import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { ChevronRight, Signal, Heart } from 'lucide-react-native';

interface RealTimePerformancePanelProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
  performanceData: {
    duration: string;
    viewers: number;
    newFollowers: number;
    supporters: number;
    diamonds: number;
  };
}

const { width, height } = Dimensions.get('window');

export default function RealTimePerformancePanel({ 
  visible, 
  onClose, 
  slideAnim, 
  performanceData 
}: RealTimePerformancePanelProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <Animated.View 
        style={[
          styles.panel,
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <ChevronRight size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.title}>الأداء في الوقت الحالي</Text>
        
        <View style={styles.networkStatus}>
          <Signal size={16} color="#4CAF50" />
          <Text style={styles.networkText}>اتصال الشبكة</Text>
          <Text style={styles.duration}>المدة {performanceData.duration}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>المشاهدين</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>متابعين جدد</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>الداعمين</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.diamondsContainer}>
                <Heart size={16} color="#E91E63" />
                <Text style={styles.statLabel}>الألماس</Text>
              </View>
              <Text style={styles.statValue}>--</Text>
            </View>
          </View>
        </View>
        
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.85,
    height: height,
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  networkText: {
    fontSize: 16,
    color: '#4CAF50',
    flex: 1,
    marginLeft: 8,
  },
  duration: {
    fontSize: 16,
    color: '#fff',
  },
  statsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  diamondsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'right',
  },
  tipsText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: 20,
  },
  inviteButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});