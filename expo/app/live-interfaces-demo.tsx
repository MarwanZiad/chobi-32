import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import LiveEndedModal from '@/components/LiveEndedModal';
import RealTimePerformancePanel from '@/components/RealTimePerformancePanel';

export default function LiveInterfacesDemo() {
  const [showEndedModal, setShowEndedModal] = useState<boolean>(false);
  const [showPerformancePanel, setShowPerformancePanel] = useState<boolean>(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const mockStreamData = {
    startTime: '01/08 17:44',
    endTime: '01/08 17:45',
    duration: '01:30',
    earnings: '$0.00',
    viewers: 0,
    newFollowers: 0,
    supporters: 0,
    pcu: 0,
    comments: 2,
  };

  const mockPerformanceData = {
    duration: '00:00:09',
    viewers: 0,
    newFollowers: 0,
    supporters: 0,
    diamonds: 0,
  };

  const handleShowPerformancePanel = () => {
    setShowPerformancePanel(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClosePerformancePanel = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPerformancePanel(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Live Interfaces Demo',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
        }} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>واجهات البث المباشر</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowEndedModal(true)}
        >
          <Text style={styles.buttonText}>عرض شاشة انتهاء البث</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleShowPerformancePanel}
        >
          <Text style={styles.buttonText}>عرض لوحة الأداء في الوقت الفعلي</Text>
        </TouchableOpacity>
        
        <Text style={styles.note}>
          • شاشة انتهاء البث تظهر عند إغلاق البث المباشر{'\n'}
          • لوحة الأداء تظهر عند السحب من الحافة اليسرى للشاشة
        </Text>
      </View>

      <LiveEndedModal
        visible={showEndedModal}
        onClose={() => setShowEndedModal(false)}
        streamData={mockStreamData}
      />

      <RealTimePerformancePanel
        visible={showPerformancePanel}
        onClose={handleClosePerformancePanel}
        slideAnim={slideAnim}
        performanceData={mockPerformanceData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  note: {
    fontSize: 14,
    color: '#888',
    textAlign: 'right',
    lineHeight: 22,
    marginTop: 40,
    paddingHorizontal: 10,
  },
});