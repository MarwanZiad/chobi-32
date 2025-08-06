import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Mic, Video, Upload } from 'lucide-react-native';
import RoomToolsModal from '@/components/RoomToolsModal';

type ContentType = 'audio' | 'video' | 'upload';

export default function RoomToolsDemo() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [contentType, setContentType] = useState<ContentType>('video');

  const handleShowModal = (type: ContentType) => {
    setContentType(type);
    setShowModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'أدوات الغرفة',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { color: '#333' }
        }} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>واجهة أدوات الغرفة</Text>
        <Text style={styles.subtitle}>اختر نوع المحتوى لعرض الأدوات المناسبة</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.audioButton]}
            onPress={() => handleShowModal('audio')}
            activeOpacity={0.8}
          >
            <Mic size={24} color="#fff" />
            <Text style={styles.buttonText}>بث صوتي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.videoButton]}
            onPress={() => handleShowModal('video')}
            activeOpacity={0.8}
          >
            <Video size={24} color="#fff" />
            <Text style={styles.buttonText}>بث فيديو</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
            onPress={() => handleShowModal('upload')}
            activeOpacity={0.8}
          >
            <Upload size={24} color="#fff" />
            <Text style={styles.buttonText}>رفع فيديو</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RoomToolsModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        contentType={contentType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  audioButton: {
    backgroundColor: '#8B5CF6',
  },
  videoButton: {
    backgroundColor: '#007AFF',
  },
  uploadButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});