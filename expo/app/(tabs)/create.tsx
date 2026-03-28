import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, TextInput, Dimensions, Alert, Platform, ScrollView, FlatList, Modal, Animated } from "react-native";
import { Video, Mic, Upload, X, Play, Globe, Users, Lock, Camera, MicOff, VideoOff, RotateCcw, Settings, Volume2, Zap, Shield, Timer, Filter, Sparkles, Heart, Star, Gift, MessageCircle, Eye, Wifi, WifiOff, Sun, Moon, Palette, Sliders, Headphones, Monitor, Smartphone, Pause, SkipBack, SkipForward, MoreHorizontal, Maximize, Minimize, Music, FileVideo, Mic2, Check, ArrowLeft, Crop, Scissors, Sticker, Type, Wand2, Layout, MicIcon, Eraser, ImageIcon, Hash, AtSign, Save, Send, Folder, Radio, CheckCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import colors from "@/constants/colors";
import { useChobiStore } from "@/hooks/use-chobi-store";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function CreateScreen() {
  const router = useRouter();
  const { setActiveNavTab } = useChobiStore();
  const [selectedOption, setSelectedOption] = useState<'video' | 'audio' | 'upload'>('video');
  const [title, setTitle] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);
  const [audioQuality, setAudioQuality] = useState<'normal' | 'high'>('normal');
  const [videoQuality, setVideoQuality] = useState<'720p' | '1080p'>('720p');
  const [beautyMode, setBeautyMode] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [stabilization, setStabilization] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [giftsEnabled, setGiftsEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'wifi' | 'mobile'>('wifi');
  const [streamDelay, setStreamDelay] = useState<'low' | 'normal' | 'high'>('normal');
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [echoReduction, setEchoReduction] = useState(true);
  const [noiseReduction, setNoiseReduction] = useState(true);
  
  // New states for video upload workflow
  const [currentStep, setCurrentStep] = useState<'main' | 'media-picker' | 'camera-capture' | 'editor' | 'publish'>('main');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'photo' | 'video'>('video');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  
  // Editor states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [cropDimensions, setCropDimensions] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [videoTrimRange, setVideoTrimRange] = useState({ start: 0, end: 100 });
  const [stickers, setStickers] = useState<any[]>([]);
  const [textOverlays, setTextOverlays] = useState<any[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [voiceRecording, setVoiceRecording] = useState<any>(null);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [erasedAreas, setErasedAreas] = useState<any[]>([]);
  const [imageStickers, setImageStickers] = useState<any[]>([]);
  
  // Camera effects states
  const [cameraLighting, setCameraLighting] = useState(false);
  const [cameraBeauty, setCameraBeauty] = useState(false);
  const [cameraFilter, setCameraFilter] = useState(false);
  
  // Editor states
  const [editedMedia, setEditedMedia] = useState<any>(null);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  
  // Publish states
  const [publishTitle, setPublishTitle] = useState('');
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [mentions, setMentions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [publishPrivacy, setPublishPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [reuseAllowed, setReuseAllowed] = useState(true);
  const [saveToStudio, setSaveToStudio] = useState(true);

  const handleClose = () => {
    if (currentStep !== 'main') {
      setCurrentStep('main');
      setSelectedMedia(null);
      setEditedMedia(null);
    } else {
      setActiveNavTab("home");
      router.push('/(tabs)');
    }
  };

  const handleStartBroadcast = () => {
    switch (selectedOption) {
      case 'video':
        // رفع فيديو - no action for start button (hidden)
        break;
      case 'audio':
        // صوتي - opens audio stream
        router.push("/audio-stream");
        break;
      case 'upload':
        // بث فيديو - opens live video streaming for host
        router.push("/video-stream");
        break;
    }
  };

  const handleCameraOpen = () => {
    if (selectedOption === 'video') {
      setCurrentStep('camera-capture');
    } else {
      // Original functionality for other options
      openCamera();
    }
  };
  
  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'نحتاج إلى إذن الكاميرا لفتح الكاميرا');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0]);
        setCurrentStep('editor');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء فتح الكاميرا');
    }
  };
  
  const handleRecordToggle = async () => {
    if (!cameraRef.current) return;
    
    try {
      if (isRecording) {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        if (recordingType === 'photo') {
          const photo = await cameraRef.current.takePictureAsync();
          setSelectedMedia(photo);
          setCurrentStep('editor');
        } else {
          setIsRecording(true);
          const video = await cameraRef.current.recordAsync();
          setSelectedMedia(video);
          setIsRecording(false);
          setCurrentStep('editor');
        }
      }
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
    }
  };

  const handleAlbumOpen = () => {
    if (selectedOption === 'video') {
      setCurrentStep('media-picker');
    } else {
      // Original functionality for other options
      openGallery();
    }
  };
  
  const openGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('خطأ', 'نحتاج إلى إذن الوصول للمعرض لفتح الملفات');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0]);
        setCurrentStep('editor');
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء فتح المعرض');
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0]);
        setCurrentStep('editor');
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الملف');
    }
  };
  
  const handlePublish = () => {
    Alert.alert('نجح', 'تم نشر المحتوى بنجاح!');
    setCurrentStep('main');
    setSelectedMedia(null);
    setEditedMedia(null);
    setPublishTitle('');
    setThumbnail(null);
    setMentions([]);
    setHashtags([]);
  };
  
  const handleSaveProject = () => {
    Alert.alert('نجح', 'تم حفظ المشروع بنجاح!');
  };

  const getPrivacyIcon = () => {
    switch (privacy) {
      case 'public': return <Globe color={colors.white} size={16} />;
      case 'friends': return <Users color={colors.white} size={16} />;
      case 'private': return <Lock color={colors.white} size={16} />;
    }
  };

  const getPrivacyText = () => {
    switch (privacy) {
      case 'public': return 'عام';
      case 'friends': return 'الأصدقاء';
      case 'private': return 'خاص';
    }
  };

  const renderAudioInterface = () => (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.gradientBackground} />
      <Image 
        source={{ uri: 'https://r2-pub.chobi.com/attachments/sldkwl9h4qg0qdduws9og' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Close Button */}
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <X color="#FFFFFF" size={24} />
      </TouchableOpacity>
      
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.titleCard}>
          <View style={styles.titleContent}>
            <Text style={styles.titleLabel}>إضافة عنوان</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="سماح الوصول للموقع"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.titleImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face' }}
              style={styles.titleImage}
            />
            <Text style={styles.changeText}>تغيير</Text>
          </View>
        </View>
      </View>
      
      {/* Profile Image - moved below title and reduced size by 40% */}
      <View style={styles.audioProfileSection}>
        <View style={styles.audioProfileContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face' }}
            style={styles.audioProfileImage}
          />
        </View>
      </View>
      
      {/* Six Icons - moved to center */}
      <View style={styles.audioIconsCenter}>
        <View style={styles.audioIconsRow}>
          <TouchableOpacity style={styles.audioIconButton}>
            <View style={styles.audioIconCircle}>
              <Mic color="#FFFFFF" size={18} />
            </View>
            <Text style={styles.audioIconText}>ميكروفون</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.audioIconButton}>
            <View style={styles.audioIconCircle}>
              <Settings color="#FFFFFF" size={18} />
            </View>
            <Text style={styles.audioIconText}>الإعدادات</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.audioIconButton}>
            <View style={styles.audioIconCircle}>
              <Volume2 color="#FFFFFF" size={18} />
            </View>
            <Text style={styles.audioIconText}>الصوت</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.audioIconsRow}>
          <TouchableOpacity style={styles.audioIconButton}>
            <View style={styles.audioIconCircle}>
              <Headphones color="#FFFFFF" size={18} />
            </View>
            <Text style={styles.audioIconText}>سماعات</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.audioIconButton}>
            <View style={styles.audioIconCircle}>
              <Music color="#FFFFFF" size={18} />
            </View>
            <Text style={styles.audioIconText}>موسيقى</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.audioIconButton}>
            <View style={styles.audioIconCircle}>
              <Sparkles color="#FFFFFF" size={18} />
            </View>
            <Text style={styles.audioIconText}>مؤثرات</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Start Button - positioned above bottom tabs by 20px */}
      <TouchableOpacity style={styles.startButtonAudio} onPress={handleStartBroadcast}>
        <Text style={styles.startButtonTextAudio}>بدء البث</Text>
      </TouchableOpacity>
      
      {/* Bottom Tabs */}
      <View style={styles.bottomTabsNew}>
        <TouchableOpacity onPress={() => setSelectedOption('audio')} style={styles.tabButtonNew}>
          <Mic2 color={selectedOption === 'audio' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'audio' && styles.activeTabTextNew]}>صوتي</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption('video')} style={styles.tabButtonNew}>
          <Upload color={selectedOption === 'video' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'video' && styles.activeTabTextNew]}>رفع فيديو</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption('upload')} style={styles.tabButtonNew}>
          <Video color={selectedOption === 'upload' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'upload' && styles.activeTabTextNew]}>بث فيديو</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderVideoInterface = () => (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.gradientBackground} />
      <Image 
        source={{ uri: 'https://r2-pub.chobi.com/attachments/sldkwl9h4qg0qdduws9og' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Side Panel */}
      <View style={styles.sidePanel}>
        <TouchableOpacity style={styles.sidePanelButton}>
          <MoreHorizontal color="#FFFFFF" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sidePanelButton}>
          <Maximize color="#FFFFFF" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sidePanelButton}>
          <Camera color="#FFFFFF" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sidePanelButton}>
          <RotateCcw color="#FFFFFF" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sidePanelButton}>
          <Sparkles color="#FFFFFF" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sidePanelButton}>
          <Mic color="#FFFFFF" size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sidePanelButton}>
          <Timer color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
      
      {/* Top Title */}
      <View style={styles.videoTopTitle}>
        <Text style={styles.videoTitleText}>الموسيقى و الأصوات</Text>
      </View>
      
      {/* Close Button */}
      <TouchableOpacity onPress={handleClose} style={styles.videoCloseButton}>
        <X color="#FFFFFF" size={24} />
      </TouchableOpacity>
      
      {/* Center Section - empty now */}
      <View style={styles.videoCenterSection}>
        {/* Empty center */}
      </View>
      
      {/* Bottom Controls - moved up 30% */}
      <View style={styles.videoBottomControlsRaised}>
        <View style={styles.videoControlLeft}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face' }}
            style={styles.videoAvatar}
          />
          <Text style={styles.videoAvatarText}>المؤثرات</Text>
        </View>
        
        <TouchableOpacity style={styles.videoRecordButton} onPress={handleCameraOpen}>
          <View style={styles.recordButtonInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.videoControlRight} onPress={handleAlbumOpen}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' }}
            style={styles.videoAvatar}
          />
          <Text style={styles.videoAvatarText}>الألبوم</Text>
        </TouchableOpacity>
      </View>
      
      {/* NO Start Button for video interface - removed as requested */}
      
      {/* Bottom Tabs */}
      <View style={styles.bottomTabsNew}>
        <TouchableOpacity onPress={() => setSelectedOption('audio')} style={styles.tabButtonNew}>
          <Mic2 color={selectedOption === 'audio' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'audio' && styles.activeTabTextNew]}>صوتي</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption('video')} style={styles.tabButtonNew}>
          <Upload color={selectedOption === 'video' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'video' && styles.activeTabTextNew]}>رفع فيديو</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption('upload')} style={styles.tabButtonNew}>
          <Video color={selectedOption === 'upload' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'upload' && styles.activeTabTextNew]}>بث فيديو</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderUploadInterface = () => (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.gradientBackground} />
      <Image 
        source={{ uri: 'https://r2-pub.chobi.com/attachments/sldkwl9h4qg0qdduws9og' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Close Button */}
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <X color="#FFFFFF" size={24} />
      </TouchableOpacity>
      
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.titleCard}>
          <View style={styles.titleContent}>
            <Text style={styles.titleLabel}>إضافة عنوان</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="سماح الوصول للموقع"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.titleImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face' }}
              style={styles.titleImage}
            />
            <Text style={styles.changeText}>تغيير</Text>
          </View>
        </View>
        
        <View style={styles.contentTypeBar}>
          <TouchableOpacity style={styles.contentTypeBarButton}>
            <SkipBack color="#FFFFFF" size={16} />
          </TouchableOpacity>
          <Text style={styles.contentTypeBarText}>حدد نوعية المحتوى</Text>
          <TouchableOpacity style={styles.contentTypeBarButton}>
            <MoreHorizontal color="#FFFFFF" size={16} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Control Icons Grid - moved to center */}
      <View style={styles.controlsGridCenter}>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.gridControl}>
            <SkipBack color="#FFFFFF" size={22} />
            <Text style={styles.gridControlText}>مراة</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridControl}>
            <Camera color="#FFFFFF" size={22} />
            <Text style={styles.gridControlText}>عكس</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridControl}>
            <Sparkles color="#FFFFFF" size={22} />
            <Text style={styles.gridControlText}>المؤثرات</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridControl}>
            <RotateCcw color="#FFFFFF" size={22} />
            <Text style={styles.gridControlText}>تحميل</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.gridControl}>
            <Settings color="#FFFFFF" size={22} />
            <Text style={styles.gridControlText}>الإعدادات</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridControl}>
            <Mic color="#FFFFFF" size={22} />
            <Text style={styles.gridControlText}>ميكروفون</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridControl}>
            <Volume2 color="#FFFFFF" size={22} />
            <Text style={styles.gridControlText}>الصوت</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridControl}>
            <FileVideo color="#FFFFFF" size={22} />
            <Text style={styles.gridControlText}>ملف</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Start Button for upload interface */}
      <TouchableOpacity style={styles.startButtonUpload} onPress={handleStartBroadcast}>
        <Text style={styles.startButtonTextUpload}>بدء البث</Text>
      </TouchableOpacity>
      
      {/* Bottom Tabs */}
      <View style={styles.bottomTabsNew}>
        <TouchableOpacity onPress={() => setSelectedOption('audio')} style={styles.tabButtonNew}>
          <Mic2 color={selectedOption === 'audio' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'audio' && styles.activeTabTextNew]}>صوتي</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption('video')} style={styles.tabButtonNew}>
          <Upload color={selectedOption === 'video' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'video' && styles.activeTabTextNew]}>رفع فيديو</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedOption('upload')} style={styles.tabButtonNew}>
          <Video color={selectedOption === 'upload' ? "#8A2BE2" : "#FFFFFF"} size={16} />
          <Text style={[styles.tabTextNew, selectedOption === 'upload' && styles.activeTabTextNew]}>بث فيديو</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // 2️⃣ Media Picker Interface
  const renderMediaPickerInterface = () => (
    <View style={styles.container}>
      <View style={styles.gradientBackground} />
      <Image 
        source={{ uri: 'https://r2-pub.chobi.com/attachments/sldkwl9h4qg0qdduws9og' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <ArrowLeft color="#FFFFFF" size={24} />
      </TouchableOpacity>
      
      <View style={styles.mediaPickerHeader}>
        <Text style={styles.mediaPickerTitle}>اختيار صورة أو فيديو</Text>
      </View>
      
      <View style={styles.mediaPickerOptions}>
        <TouchableOpacity style={styles.mediaOption} onPress={openGallery}>
          <Folder color="#8A2BE2" size={40} />
          <Text style={styles.mediaOptionText}>فتح من ملفات الجهاز</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mediaOption} onPress={openGallery}>
          <ImageIcon color="#8A2BE2" size={40} />
          <Text style={styles.mediaOptionText}>فتح من الاستوديو</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mediaOption} onPress={() => setCurrentStep('camera-capture')}>
          <Camera color="#8A2BE2" size={40} />
          <Text style={styles.mediaOptionText}>التقاط فتح الكاميرا</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.effectsButton}>
        <Sparkles color="#FFFFFF" size={20} />
        <Text style={styles.effectsButtonText}>✨ المؤثرات</Text>
      </TouchableOpacity>
      
      {selectedMedia && (
        <View style={styles.mediaPreview}>
          <Text style={styles.previewTitle}>معاينة الملف</Text>
          <TouchableOpacity style={styles.continueButton} onPress={() => setCurrentStep('editor')}>
            <CheckCircle color="#FFFFFF" size={20} />
            <Text style={styles.continueButtonText}>✔️ متابعة</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  // 3️⃣ Camera Capture Interface
  const renderCameraCaptureInterface = () => {
    if (!cameraPermission) {
      return (
        <View style={styles.container}>
          <View style={styles.gradientBackground} />
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>نحتاج إلى إذن الكاميرا</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
              <Text style={styles.permissionButtonText}>منح الإذن</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    if (!cameraPermission.granted) {
      return (
        <View style={styles.container}>
          <View style={styles.gradientBackground} />
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>نحتاج إلى إذن الكاميرا لفتح الكاميرا</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
              <Text style={styles.permissionButtonText}>منح الإذن</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.cameraContainer}>
        {Platform.OS !== 'web' ? (
          <CameraView 
            ref={cameraRef}
            style={styles.camera}
            facing={frontCamera ? 'front' : 'back'}
          />
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Camera color="#FFFFFF" size={60} />
            <Text style={styles.cameraPlaceholderText}>الكاميرا غير متاحة على الويب</Text>
          </View>
        )}
        
        <TouchableOpacity onPress={handleClose} style={styles.cameraCloseButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        
        <View style={styles.cameraBottomControls}>
          <View style={styles.recordingTypeSelector}>
            <TouchableOpacity 
              style={[styles.typeButton, recordingType === 'photo' && styles.activeTypeButton]}
              onPress={() => setRecordingType('photo')}
            >
              <Text style={[styles.typeButtonText, recordingType === 'photo' && styles.activeTypeButtonText]}>صورة</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeButton, recordingType === 'video' && styles.activeTypeButton]}
              onPress={() => setRecordingType('video')}
            >
              <Text style={[styles.typeButtonText, recordingType === 'video' && styles.activeTypeButtonText]}>فيديو</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.captureButton, isRecording && styles.recordingButton]} 
            onPress={handleRecordToggle}
          >
            <View style={[styles.captureButtonInner, isRecording && styles.recordingButtonInner]} />
          </TouchableOpacity>
          
          <View style={styles.cameraEffectsNew}>
            <TouchableOpacity 
              style={[styles.effectButtonNew, cameraLighting && styles.activeEffectButton]} 
              onPress={() => setCameraLighting(!cameraLighting)}
            >
              <View style={[styles.effectCircle, cameraLighting && styles.activeEffectCircle]}>
                <Sun color="#FFFFFF" size={18} />
              </View>
              <Text style={styles.effectButtonTextNew}>إضاءة</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.effectButtonNew, cameraBeauty && styles.activeEffectButton]} 
              onPress={() => setCameraBeauty(!cameraBeauty)}
            >
              <View style={[styles.effectCircle, cameraBeauty && styles.activeEffectCircle]}>
                <Wand2 color="#FFFFFF" size={18} />
              </View>
              <Text style={styles.effectButtonTextNew}>جمال</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.effectButtonNew, cameraFilter && styles.activeEffectButton]} 
              onPress={() => setCameraFilter(!cameraFilter)}
            >
              <View style={[styles.effectCircle, cameraFilter && styles.activeEffectCircle]}>
                <Sparkles color="#FFFFFF" size={18} />
              </View>
              <Text style={styles.effectButtonTextNew}>فلتر</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {selectedMedia && (
          <TouchableOpacity style={styles.saveButton} onPress={() => setCurrentStep('editor')}>
            <CheckCircle color="#FFFFFF" size={20} />
            <Text style={styles.saveButtonText}>✔️ حفظ</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  // Editor tool handlers
  const handleCropTool = () => {
    setSelectedTool('crop');
    Alert.alert('قص الحجم', 'تم تفعيل أداة قص الحجم. يمكنك الآن تحديد المنطقة المطلوبة.');
  };
  
  const handleTrimTool = () => {
    setSelectedTool('trim');
    Alert.alert('قص الفيديو', 'تم تفعيل أداة قص الفيديو. يمكنك الآن تحديد الجزء المطلوب من الفيديو.');
  };
  
  const handleStickerTool = () => {
    setSelectedTool('sticker');
    const stickerEmojis = ['😊', '❤️', '🔥', '✨', '🎉', '👍', '😍', '🤩', '💯', '🚀'];
    const randomEmoji = stickerEmojis[Math.floor(Math.random() * stickerEmojis.length)];
    const newSticker = { 
      id: Date.now(), 
      x: Math.random() * 60 + 20, // Random position between 20-80%
      y: Math.random() * 60 + 20, 
      type: randomEmoji,
      scale: 1,
      rotation: 0
    };
    setStickers([...stickers, newSticker]);
    Alert.alert('إضافة ملصقات', 'تم إضافة ملصق جديد. يمكنك تحريكه وتغيير حجمه بالإيماءات.');
  };
  
  const handleTextTool = () => {
    setSelectedTool('text');
    const textSamples = ['نص جديد', 'مرحبا', 'رائع!', 'جميل', 'مذهل'];
    const colors = ['#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const randomText = textSamples[Math.floor(Math.random() * textSamples.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newText = { 
      id: Date.now(), 
      x: Math.random() * 60 + 20, // Random position between 20-80%
      y: Math.random() * 60 + 20, 
      text: randomText, 
      color: randomColor, 
      size: 20,
      scale: 1,
      rotation: 0
    };
    setTextOverlays([...textOverlays, newText]);
    Alert.alert('إضافة نص', 'تم إضافة نص جديد. يمكنك تحريكه وتغيير حجمه بالإيماءات.');
  };
  
  const handleFilterTool = () => {
    setSelectedTool('filter');
    const filters = ['vintage', 'black_white', 'sepia', 'bright', 'contrast'];
    const randomFilter = filters[Math.floor(Math.random() * filters.length)];
    setAppliedFilter(randomFilter);
    Alert.alert('فلاتر', `تم تطبيق فلتر ${randomFilter}. يمكنك تجربة فلاتر أخرى.`);
  };
  
  const handleTemplateTool = () => {
    setSelectedTool('template');
    const templates = ['modern', 'classic', 'creative', 'minimal', 'colorful'];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setSelectedTemplate(randomTemplate);
    Alert.alert('قوالب جاهزة', `تم تطبيق قالب ${randomTemplate}. يمكنك تخصيص العناصر.`);
  };
  
  const handleVoiceRecordTool = () => {
    setSelectedTool('voice');
    Alert.alert('تسجيل صوتي', 'بدء تسجيل التعليق الصوتي. اضغط مرة أخرى للتوقف.');
  };
  
  const handleEnhanceTool = () => {
    setSelectedTool('enhance');
    setIsEnhanced(!isEnhanced);
    Alert.alert('تحسين الجودة HD', isEnhanced ? 'تم إلغاء تحسين الجودة' : 'تم تحسين الجودة إلى HD');
  };
  
  const handleEraserTool = () => {
    setSelectedTool('eraser');
    Alert.alert('ممحاة ذكية AI', 'تم تفعيل الممحاة الذكية. اضغط على العنصر المراد إزالته.');
  };
  
  const handleImageStickerTool = () => {
    setSelectedTool('image_sticker');
    Alert.alert('إضافة صورة كملصق', 'اختر صورة من الجهاز لإضافتها كملصق.');
  };
  
  const handleMediaPress = () => {
    if (selectedMedia?.type?.includes('video')) {
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  
  // 4️⃣ Editor Interface
  const renderEditorInterface = () => (
    <View style={styles.editorContainer}>
      {selectedMedia && (
        <TouchableOpacity style={styles.mediaFullScreen} onPress={handleMediaPress} activeOpacity={0.9}>
          {selectedMedia.type?.includes('video') ? (
            <View style={styles.videoContainer}>
              <Image 
                source={{ uri: selectedMedia.uri || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop' }}
                style={styles.fullScreenMedia}
                resizeMode="cover"
              />
              {!isVideoPlaying && (
                <View style={styles.videoOverlay}>
                  <TouchableOpacity style={styles.playButton} onPress={handleMediaPress}>
                    <Play color="#FFFFFF" size={40} fill="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedMedia.type?.includes('video') && (
                <TouchableOpacity style={styles.smallPlayButton} onPress={handleMediaPress}>
                  {isVideoPlaying ? (
                    <Pause color="#FFFFFF" size={16} />
                  ) : (
                    <Play color="#FFFFFF" size={16} fill="#FFFFFF" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Image 
              source={{ uri: selectedMedia.uri || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop' }}
              style={styles.fullScreenMedia}
              resizeMode="cover"
            />
          )}
          
          {/* Render stickers with gesture handling */}
          {stickers.map(sticker => (
            <GestureWrapper 
              key={sticker.id} 
              initialX={sticker.x} 
              initialY={sticker.y}
              onUpdate={(x: number, y: number, scale: number, rotation: number) => {
                const updatedStickers = stickers.map((s: any) => 
                  s.id === sticker.id ? { ...s, x, y, scale, rotation } : s
                );
                setStickers(updatedStickers);
              }}
            >
              <Text style={[styles.stickerText, { 
                transform: [{ scale: sticker.scale || 1 }, { rotate: `${sticker.rotation || 0}deg` }] 
              }]}>
                {sticker.type}
              </Text>
            </GestureWrapper>
          ))}
          
          {/* Render text overlays with gesture handling */}
          {textOverlays.map(text => (
            <GestureWrapper 
              key={text.id} 
              initialX={text.x} 
              initialY={text.y}
              onUpdate={(x: number, y: number, scale: number, rotation: number) => {
                const updatedTexts = textOverlays.map((t: any) => 
                  t.id === text.id ? { ...t, x, y, scale, rotation } : t
                );
                setTextOverlays(updatedTexts);
              }}
            >
              <Text style={[styles.overlayText, { 
                color: text.color, 
                fontSize: text.size,
                transform: [{ scale: text.scale || 1 }, { rotate: `${text.rotation || 0}deg` }] 
              }]}>
                {text.text}
              </Text>
            </GestureWrapper>
          ))}
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => setCurrentStep('camera-capture')} style={styles.editorCloseButton}>
        <ArrowLeft color="#FFFFFF" size={24} />
      </TouchableOpacity>
      
      <View style={styles.editorTopBar}>
        <TouchableOpacity style={styles.musicButton}>
          <Music color="#FFFFFF" size={20} />
          <Text style={styles.musicButtonText}>الموسيقى والأصوات</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.editorSidePanelNew}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.editorToolNew} onPress={handleCropTool}>
            <View style={[styles.toolCircle, selectedTool === 'crop' && styles.activeTool]}>
              <Crop color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>قص</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleTrimTool}>
            <View style={[styles.toolCircle, selectedTool === 'trim' && styles.activeTool]}>
              <Scissors color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>تقطيع</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleStickerTool}>
            <View style={[styles.toolCircle, selectedTool === 'sticker' && styles.activeTool]}>
              <Sticker color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>ملصقات</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleTextTool}>
            <View style={[styles.toolCircle, selectedTool === 'text' && styles.activeTool]}>
              <Type color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>نص</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleFilterTool}>
            <View style={[styles.toolCircle, selectedTool === 'filter' && styles.activeTool]}>
              <Filter color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>فلاتر</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleTemplateTool}>
            <View style={[styles.toolCircle, selectedTool === 'template' && styles.activeTool]}>
              <Layout color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>قوالب</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleVoiceRecordTool}>
            <View style={[styles.toolCircle, selectedTool === 'voice' && styles.activeTool]}>
              <MicIcon color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>صوت</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleEnhanceTool}>
            <View style={[styles.toolCircle, selectedTool === 'enhance' && styles.activeTool]}>
              <Maximize color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>تحسين</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleEraserTool}>
            <View style={[styles.toolCircle, selectedTool === 'eraser' && styles.activeTool]}>
              <Eraser color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>ممحاة</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editorToolNew} onPress={handleImageStickerTool}>
            <View style={[styles.toolCircle, selectedTool === 'image_sticker' && styles.activeTool]}>
              <ImageIcon color="#FFFFFF" size={16} />
            </View>
            <Text style={styles.toolText}>صورة</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <TouchableOpacity style={styles.applyEditsButton} onPress={() => setCurrentStep('publish')}>
        <CheckCircle color="#FFFFFF" size={20} />
        <Text style={styles.applyEditsButtonText}>✔️ تطبيق التعديلات</Text>
      </TouchableOpacity>
    </View>
  );
  
  // 5️⃣ Publish Interface
  const renderPublishInterface = () => (
    <View style={styles.publishContainer}>
      <View style={styles.gradientBackground} />
      <Image 
        source={{ uri: 'https://r2-pub.chobi.com/attachments/sldkwl9h4qg0qdduws9og' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <TouchableOpacity onPress={() => setCurrentStep('editor')} style={styles.closeButton}>
        <ArrowLeft color="#FFFFFF" size={24} />
      </TouchableOpacity>
      
      <ScrollView style={styles.publishScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.publishHeaderNew}>
          <Text style={styles.publishTitleNew}>النشر</Text>
        </View>
        
        <View style={styles.publishFormNew}>
          <View style={styles.formGroupNew}>
            <Text style={styles.formLabelNew}>إدخال العنوان</Text>
            <TextInput
              style={styles.formInputNew}
              placeholder="أدخل عنوان المحتوى"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={publishTitle}
              onChangeText={setPublishTitle}
            />
          </View>
          
          <View style={styles.formGroupNew}>
            <Text style={styles.formLabelNew}>اختيار صورة مصغرة (Thumbnail)</Text>
            <TouchableOpacity style={styles.thumbnailSelectorNew}>
              <ImageIcon color="#8A2BE2" size={18} />
              <Text style={styles.thumbnailTextNew}>اختيار صورة مصغرة</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroupNew}>
            <Text style={styles.formLabelNew}>الإشارة إلى الأشخاص @</Text>
            <TextInput
              style={styles.formInputNew}
              placeholder="@اسم_المستخدم"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>
          
          <View style={styles.formGroupNew}>
            <Text style={styles.formLabelNew}>إضافة هاشتاجات #</Text>
            <TextInput
              style={styles.formInputNew}
              placeholder="#هاشتاج"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>
          
          <View style={styles.formGroupNew}>
            <Text style={styles.formLabelNew}>إعدادات الخصوصية</Text>
            <View style={styles.privacyOptionsNew}>
              <TouchableOpacity 
                style={[styles.privacyOptionNew, publishPrivacy === 'public' && styles.activePrivacyOptionNew]}
                onPress={() => setPublishPrivacy('public')}
              >
                <Globe color={publishPrivacy === 'public' ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.privacyOptionTextNew, publishPrivacy === 'public' && styles.activePrivacyOptionTextNew]}>🌍 عام</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.privacyOptionNew, publishPrivacy === 'followers' && styles.activePrivacyOptionNew]}
                onPress={() => setPublishPrivacy('followers')}
              >
                <Users color={publishPrivacy === 'followers' ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.privacyOptionTextNew, publishPrivacy === 'followers' && styles.activePrivacyOptionTextNew]}>👥 متابعين</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.privacyOptionNew, publishPrivacy === 'private' && styles.activePrivacyOptionNew]}
                onPress={() => setPublishPrivacy('private')}
              >
                <Lock color={publishPrivacy === 'private' ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.privacyOptionTextNew, publishPrivacy === 'private' && styles.activePrivacyOptionTextNew]}>🔒 أنا فقط</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroupNew}>
            <Text style={styles.formLabelNew}>إعدادات التعليقات</Text>
            <View style={styles.toggleOptionsNew}>
              <TouchableOpacity 
                style={[styles.toggleOptionNew, commentsEnabled && styles.activeToggleOptionNew]}
                onPress={() => setCommentsEnabled(true)}
              >
                <MessageCircle color={commentsEnabled ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.toggleOptionTextNew, commentsEnabled && styles.activeToggleOptionTextNew]}>💬 سماح</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.toggleOptionNew, !commentsEnabled && styles.activeToggleOptionNew]}
                onPress={() => setCommentsEnabled(false)}
              >
                <X color={!commentsEnabled ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.toggleOptionTextNew, !commentsEnabled && styles.activeToggleOptionTextNew]}>🚫 إيقاف</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroupNew}>
            <Text style={styles.formLabelNew}>إعدادات إعادة الاستخدام</Text>
            <View style={styles.toggleOptionsNew}>
              <TouchableOpacity 
                style={[styles.toggleOptionNew, reuseAllowed && styles.activeToggleOptionNew]}
                onPress={() => setReuseAllowed(true)}
              >
                <RotateCcw color={reuseAllowed ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.toggleOptionTextNew, reuseAllowed && styles.activeToggleOptionTextNew]}>🔁 سماح</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.toggleOptionNew, !reuseAllowed && styles.activeToggleOptionNew]}
                onPress={() => setReuseAllowed(false)}
              >
                <X color={!reuseAllowed ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.toggleOptionTextNew, !reuseAllowed && styles.activeToggleOptionTextNew]}>🚫 عدم السماح</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroupNew}>
            <Text style={styles.formLabelNew}>حفظ في الاستوديو</Text>
            <View style={styles.toggleOptionsNew}>
              <TouchableOpacity 
                style={[styles.toggleOptionNew, saveToStudio && styles.activeToggleOptionNew]}
                onPress={() => setSaveToStudio(true)}
              >
                <CheckCircle color={saveToStudio ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.toggleOptionTextNew, saveToStudio && styles.activeToggleOptionTextNew]}>✅ نعم</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.toggleOptionNew, !saveToStudio && styles.activeToggleOptionNew]}
                onPress={() => setSaveToStudio(false)}
              >
                <X color={!saveToStudio ? "#8A2BE2" : "#FFFFFF"} size={16} />
                <Text style={[styles.toggleOptionTextNew, !saveToStudio && styles.activeToggleOptionTextNew]}>❌ لا</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.publishButtonsNew}>
          <TouchableOpacity style={styles.saveProjectButtonNew} onPress={handleSaveProject}>
            <Save color="#FFFFFF" size={16} />
            <Text style={styles.saveProjectButtonTextNew}>💾 حفظ في المشاريع</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.publishButtonNew} onPress={handlePublish}>
            <Send color="#FFFFFF" size={16} />
            <Text style={styles.publishButtonTextNew}>🚀 نشر إلى Chobi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {currentStep === 'main' && (
        <>
          {selectedOption === 'audio' && renderAudioInterface()}
          {selectedOption === 'video' && renderVideoInterface()}
          {selectedOption === 'upload' && renderUploadInterface()}
        </>
      )}
      {currentStep === 'media-picker' && renderMediaPickerInterface()}
      {currentStep === 'camera-capture' && renderCameraCaptureInterface()}
      {currentStep === 'editor' && renderEditorInterface()}
      {currentStep === 'publish' && renderPublishInterface()}
    </SafeAreaView>
  );
}

// Gesture Wrapper Component for handling pan and pinch gestures
interface GestureWrapperProps {
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  onUpdate?: (x: number, y: number, scale: number, rotation: number) => void;
}

const GestureWrapper = ({ children, initialX = 0, initialY = 0, onUpdate }: GestureWrapperProps) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef({ x: initialX || 0, y: initialY || 0 });
  const lastScale = useRef(1);
  const lastRotation = useRef(0);

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: false }
  );

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: false }
  );

  const onRotationGestureEvent = Animated.event(
    [{ nativeEvent: { rotation: rotation } }],
    { useNativeDriver: false }
  );

  const onPanHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const newX = lastOffset.current.x + (event.nativeEvent.translationX / width) * 100;
      const newY = lastOffset.current.y + (event.nativeEvent.translationY / height) * 100;
      
      // Keep within bounds
      const boundedX = Math.max(0, Math.min(90, newX));
      const boundedY = Math.max(0, Math.min(90, newY));
      
      lastOffset.current.x = boundedX;
      lastOffset.current.y = boundedY;
      
      translateX.setOffset(0);
      translateX.setValue(0);
      translateY.setOffset(0);
      translateY.setValue(0);
      
      if (onUpdate) {
        onUpdate(boundedX, boundedY, lastScale.current, lastRotation.current);
      }
    }
  };
  
  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      lastScale.current = Math.max(0.5, Math.min(3, lastScale.current * event.nativeEvent.scale));
      scale.setOffset(lastScale.current);
      scale.setValue(1);
      
      if (onUpdate) {
        onUpdate(lastOffset.current.x, lastOffset.current.y, lastScale.current, lastRotation.current);
      }
    }
  };

  const onRotationHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      lastRotation.current += event.nativeEvent.rotation;
      rotation.setOffset(lastRotation.current);
      rotation.setValue(0);
      
      if (onUpdate) {
        onUpdate(lastOffset.current.x, lastOffset.current.y, lastScale.current, lastRotation.current);
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
    >
      <Animated.View 
        style={[
          styles.gestureContainer,
          {
            left: `${lastOffset.current.x}%`,
            top: `${lastOffset.current.y}%`,
            transform: [
              { translateX },
              { translateY },
              { scale: Animated.multiply(scale, lastScale.current) },
              { rotate: Animated.add(rotation, lastRotation.current).interpolate({
                inputRange: [0, 2 * Math.PI],
                outputRange: ['0deg', '360deg']
              }) }
            ]
          }
        ]}
      >
        <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}
        >
          <Animated.View>
            {children}
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  
  // Audio Interface Styles
  topSection: {
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  titleCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContent: {
    flex: 1,
  },
  titleLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  titleInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  titleImageContainer: {
    alignItems: 'center',
  },
  titleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 4,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  
  // Audio Profile Section - moved below title and reduced size by 40%
  audioProfileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  audioProfileContainer: {
    width: 72, // reduced from 120 by 40%
    height: 72, // reduced from 120 by 40%
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  audioProfileImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  
  // Audio Icons Center - improved layout in center of screen
  audioIconsCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -100, // moved up 10% more (from -80 to -100)
  },
  audioIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32, // reduced spacing by 20% (from 40 to 32)
    paddingHorizontal: 20,
  },
  audioIconButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  audioIconCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  audioIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Start Button for Audio - positioned above bottom tabs by 20px
  startButtonAudio: {
    backgroundColor: '#8A2BE2',
    marginHorizontal: 15,
    borderRadius: 20, // reduced from 25 (20% thinner)
    paddingVertical: 13, // reduced from 16 (20% thinner)
    alignItems: 'center',
    position: 'absolute',
    bottom: 85, // moved down 15% from 100
    left: 0,
    right: 0,
  },
  startButtonTextAudio: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  
  startButtonNew: {
    backgroundColor: '#8A2BE2',
    marginHorizontal: 15,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  startButtonTextNew: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Start Button for Upload
  startButtonUpload: {
    backgroundColor: '#8A2BE2',
    marginHorizontal: 15,
    borderRadius: 20, // reduced from 25 (20% thinner)
    paddingVertical: 13, // reduced from 16 (20% thinner)
    alignItems: 'center',
    position: 'absolute',
    bottom: 85, // moved down 15% from 100
    left: 0,
    right: 0,
  },
  startButtonTextUpload: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Video Interface Styles
  sidePanel: {
    position: 'absolute',
    right: 20,
    top: 100,
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 5,
  },
  sidePanelButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  videoTopTitle: {
    alignItems: 'center',
    marginTop: 80,
  },
  videoTitleText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  videoCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  videoCenterSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBottomControlsNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  videoBottomControlsRaised: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 140, // moved up 30%
  },
  videoBottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  videoControlLeft: {
    alignItems: 'center',
  },
  videoControlRight: {
    alignItems: 'center',
  },
  videoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  videoAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  videoRecordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8A2BE2',
  },
  
  // Upload Interface Styles
  contentTypeBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  contentTypeBarButton: {
    padding: 4,
  },
  contentTypeBarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  controlsGrid: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  controlsGridCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: -80, // moved up 10% more (from -60 to -80)
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    width: '100%',
    paddingHorizontal: 10,
  },
  gridControl: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gridControlText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Bottom Tabs - transparent and smaller icons
  bottomTabsNew: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(0,0,0,0.3)', // transparent
  },
  tabButtonNew: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTextNew: {
    color: '#FFFFFF',
    fontSize: 10, // smaller icons
    fontWeight: '500',
    marginTop: 3,
  },
  activeTabTextNew: {
    color: '#8A2BE2',
    fontWeight: '700',
  },
  
  // Media Picker Styles
  mediaPickerHeader: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
  mediaPickerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  mediaPickerOptions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  mediaOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    marginVertical: 15,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mediaOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  effectsButton: {
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 40,
    marginBottom: 20,
  },
  effectsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mediaPreview: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Camera Capture Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  cameraPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  cameraCloseButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  cameraBottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  recordingTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeTypeButton: {
    backgroundColor: '#8A2BE2',
  },
  typeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTypeButtonText: {
    fontWeight: '700',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  recordingButton: {
    backgroundColor: '#FF0000',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8A2BE2',
  },
  recordingButtonInner: {
    backgroundColor: '#FFFFFF',
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  cameraEffects: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  effectButton: {
    alignItems: 'center',
    padding: 10,
  },
  effectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 5,
  },
  cameraEffectsNew: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  effectButtonNew: {
    alignItems: 'center',
    padding: 8,
  },
  effectCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeEffectButton: {
    // Active state styling handled by circle
  },
  activeEffectCircle: {
    backgroundColor: 'rgba(138, 43, 226, 0.7)',
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
  effectButtonTextNew: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Editor Styles
  editorContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mediaFullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullScreenMedia: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  smallPlayButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stickerOverlay: {
    position: 'absolute',
    zIndex: 5,
  },
  stickerText: {
    fontSize: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gestureContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  textOverlay: {
    position: 'absolute',
    zIndex: 5,
  },
  overlayText: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  editorCloseButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  editorTopBar: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  musicButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  musicButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  editorSidePanelNew: {
    position: 'absolute',
    right: 15,
    top: 80, // moved up to top of screen
    bottom: 120,
    width: 60, // slightly wider to accommodate text
    zIndex: 5,
  },
  editorToolNew: {
    alignItems: 'center',
    marginVertical: 6, // reduced spacing to fit all tools
  },
  toolCircle: {
    width: 35, // smaller icons
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toolText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '500',
    marginTop: 3,
    textAlign: 'center',
  },
  activeTool: {
    backgroundColor: 'rgba(138, 43, 226, 0.8)',
    borderColor: '#8A2BE2',
  },
  editorSidePanel: {
    position: 'absolute',
    right: 10,
    top: 150,
    bottom: 100,
    width: 80,
    zIndex: 5,
  },
  editorTool: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editorToolText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
  },
  applyEditsButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
  },
  applyEditsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Publish Styles
  publishContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  publishScrollView: {
    flex: 1,
    paddingTop: 100,
  },
  publishHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  publishTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  publishForm: {
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 25,
  },
  formLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'right',
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'right',
  },
  thumbnailSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  thumbnailText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  privacyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privacyOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activePrivacyOption: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    borderColor: '#8A2BE2',
  },
  privacyOptionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  activePrivacyOptionText: {
    color: '#8A2BE2',
    fontWeight: '700',
  },
  toggleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeToggleOption: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    borderColor: '#8A2BE2',
  },
  toggleOptionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  activeToggleOptionText: {
    color: '#8A2BE2',
    fontWeight: '700',
  },
  publishButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  saveProjectButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginRight: 10,
  },
  saveProjectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // New Publish Styles - Compact Design
  publishHeaderNew: {
    alignItems: 'center',
    marginBottom: 20,
  },
  publishTitleNew: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  publishFormNew: {
    paddingHorizontal: 20,
  },
  formGroupNew: {
    marginBottom: 18,
  },
  formLabelNew: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  formInputNew: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'right',
  },
  thumbnailSelectorNew: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  thumbnailTextNew: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
  privacyOptionsNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privacyOptionNew: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activePrivacyOptionNew: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    borderColor: '#8A2BE2',
  },
  privacyOptionTextNew: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  activePrivacyOptionTextNew: {
    color: '#8A2BE2',
    fontWeight: '700',
  },
  toggleOptionsNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleOptionNew: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeToggleOptionNew: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    borderColor: '#8A2BE2',
  },
  toggleOptionTextNew: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  activeToggleOptionTextNew: {
    color: '#8A2BE2',
    fontWeight: '700',
  },
  publishButtonsNew: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 25,
    justifyContent: 'space-between',
  },
  saveProjectButtonNew: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  saveProjectButtonTextNew: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  publishButtonNew: {
    flex: 1,
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  publishButtonTextNew: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});