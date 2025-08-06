import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, ImageBackground } from 'react-native';
import { 
  Share, 
  Mic, 
  Video, 
  Settings, 
  Sliders, 
  Radio, 
  Download, 
  Camera, 
  Zap, 
  Shield, 
  Users, 
  Volume2,
  X,
  MoreHorizontal,
  Maximize,
  RotateCcw,
  Sparkles,
  Album,
  Circle,
  Wand2,
  User,
  Upload
} from 'lucide-react-native';
import StreamSettingsModal from './StreamSettingsModal';

interface RoomToolsModalProps {
  visible: boolean;
  onClose: () => void;
  contentType?: 'audio' | 'video' | 'upload';
}

interface ToolItem {
  icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
}

const { width, height } = Dimensions.get('window');

export default function RoomToolsModal({ visible, onClose, contentType = 'video' }: RoomToolsModalProps) {
  const [showStreamSettings, setShowStreamSettings] = useState<boolean>(false);

  const handleStreamSettingsPress = () => {
    setShowStreamSettings(true);
  };

  const renderContent = () => {
    if (contentType === 'audio') {
      return (
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=800&fit=crop' }}
          style={styles.fullScreenContainer}
          blurRadius={8}
        >
          <View style={styles.overlay}>
            {/* Header */}
            <View style={styles.audioHeader}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="white" />
              </TouchableOpacity>
              
              <View style={styles.audioHeaderContent}>
                <View style={styles.profileSection}>
                  <View style={styles.profileImage}>
                    <User size={16} color="white" />
                  </View>
                  <Text style={styles.profileName}>اسم الحساب</Text>
                </View>
                
                <View style={styles.titleSection}>
                  <Text style={styles.liveTitle}>عنوان البث</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Side Controls */}
            <View style={styles.audioSideControls}>
              <TouchableOpacity style={styles.sideControlButton}>
                <Maximize size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <Camera size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <RotateCcw size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <Sparkles size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <Mic size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <Settings size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Audio Tools - Above Start Button */}
            <View style={styles.audioToolsContainer}>
              <View style={styles.audioToolsRow}>
                <TouchableOpacity style={styles.audioTool}>
                  <Volume2 size={24} color="white" />
                  <Text style={styles.audioToolLabel}>الصوت</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audioTool}>
                  <Mic size={24} color="white" />
                  <Text style={styles.audioToolLabel}>ميكروفون</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audioTool}>
                  <User size={24} color="white" />
                  <Text style={styles.audioToolLabel}>البروفايل</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.audioToolsRow}>
                <TouchableOpacity style={styles.audioTool}>
                  <Radio size={24} color="white" />
                  <Text style={styles.audioToolLabel}>موسيقى</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audioTool}>
                  <Sliders size={24} color="white" />
                  <Text style={styles.audioToolLabel}>مازج</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audioTool}>
                  <Zap size={24} color="white" />
                  <Text style={styles.audioToolLabel}>فلتر</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Start Button */}
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>بدء البث</Text>
            </TouchableOpacity>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem}>
                <Mic size={20} color="white" />
                <Text style={styles.navLabel}>صوتي</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Video size={20} color="white" />
                <Text style={styles.navLabel}>بث فيديو</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Upload size={20} color="white" />
                <Text style={styles.navLabel}>رفع فيديو</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      );
    }

    if (contentType === 'upload') {
      return (
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=800&fit=crop' }}
          style={styles.fullScreenContainer}
          blurRadius={8}
        >
          <View style={styles.overlay}>
            {/* Header */}
            <View style={styles.audioHeader}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="white" />
              </TouchableOpacity>
              
              <View style={styles.audioHeaderContent}>
                <View style={styles.profileSection}>
                  <View style={styles.profileImage}>
                    <User size={16} color="white" />
                  </View>
                  <Text style={styles.profileName}>اسم الحساب</Text>
                </View>
                
                <View style={styles.titleSection}>
                  <Text style={styles.liveTitle}>عنوان البث</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Side Controls */}
            <View style={styles.audioSideControls}>
              <TouchableOpacity style={styles.sideControlButton}>
                <Maximize size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <Camera size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <RotateCcw size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <Sparkles size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <Mic size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideControlButton}>
                <Settings size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Upload Tools - Raised 24px */}
            <View style={styles.uploadToolsContainer}>
              <TouchableOpacity style={styles.uploadTool}>
                <Album size={32} color="white" />
                <Text style={styles.uploadToolLabel}>الألبوم</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadToolCenter}>
                <Circle size={48} color="white" fill="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadTool}>
                <Wand2 size={32} color="white" />
                <Text style={styles.uploadToolLabel}>المؤثرات</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Navigation - No Start Button */}
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem}>
                <Mic size={20} color="white" />
                <Text style={styles.navLabel}>صوتي</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Video size={20} color="white" />
                <Text style={styles.navLabel}>بث فيديو</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Upload size={20} color="white" />
                <Text style={styles.navLabel}>رفع فيديو</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      );
    }

    // Default video content
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=800&fit=crop' }}
        style={styles.fullScreenContainer}
        blurRadius={8}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.audioHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.audioHeaderContent}>
              <View style={styles.profileSection}>
                <View style={styles.profileImage}>
                  <User size={16} color="white" />
                </View>
                <Text style={styles.profileName}>اسم الحساب</Text>
              </View>
              
              <View style={styles.titleSection}>
                <Text style={styles.liveTitle}>عنوان البث</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Side Controls */}
          <View style={styles.audioSideControls}>
            <TouchableOpacity style={styles.sideControlButton}>
              <Maximize size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideControlButton}>
              <Camera size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideControlButton}>
              <RotateCcw size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideControlButton}>
              <Sparkles size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideControlButton}>
              <Mic size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideControlButton}>
              <Settings size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Video Tools */}
          <View style={styles.uploadToolsContainer}>
            <TouchableOpacity style={styles.uploadTool}>
              <Album size={32} color="white" />
              <Text style={styles.uploadToolLabel}>الألبوم</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadToolCenter}>
              <Circle size={48} color="white" fill="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadTool}>
              <Wand2 size={32} color="white" />
              <Text style={styles.uploadToolLabel}>المؤثرات</Text>
            </TouchableOpacity>
          </View>

          {/* Start Button */}
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>بدء البث</Text>
          </TouchableOpacity>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Mic size={20} color="white" />
              <Text style={styles.navLabel}>صوتي</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Upload size={20} color="white" />
              <Text style={styles.navLabel}>رفع فيديو</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Video size={20} color="white" />
              <Text style={styles.navLabel}>بث فيديو</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {renderContent()}
      
      <StreamSettingsModal
        visible={showStreamSettings}
        onClose={() => setShowStreamSettings(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  audioHeaderContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  profileName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  titleSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  liveTitle: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  moreButton: {
    padding: 8,
  },
  audioSideControls: {
    position: 'absolute',
    right: 16,
    top: 140,
    alignItems: 'center',
  },
  sideControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  audioToolsContainer: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  audioToolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  audioTool: {
    alignItems: 'center',
    width: 80,
  },
  audioToolLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  uploadToolsContainer: {
    position: 'absolute',
    bottom: 164,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  uploadTool: {
    alignItems: 'center',
  },
  uploadToolCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadToolLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    bottom: 100,
    left: 15,
    right: 15,
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navLabel: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
});