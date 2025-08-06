import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  Switch,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
  Vibration,
  StatusBar,
} from 'react-native';
import Slider from '@react-native-community/slider';

import {
  X,
  Video,
  Mic,
  Upload,
  Settings,
  Camera,
  Volume2,
  Users,
  Shield,
  Globe,
  Download,
  Youtube,
  Music,
  Radio,
  Play,
  Pause,
  RotateCcw,
  Wifi,
  WifiOff,
  UserCheck,
  UserX,
  Headphones,
  Speaker,
  Search,
  Plus,
  Minus,
  RotateCw,
  Eye,
  EyeOff,
  Zap,
  ZapOff,
  CheckCircle,
  XCircle,
  Star,
  Heart,
  Gift,
  Crown,
  Sparkles,
  Filter,
  Sliders,
  MonitorSpeaker,
  Waves,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  VolumeX,
  Bluetooth,
  Cast,
  Share2,
  Bookmark,
  TrendingUp,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Gauge,
  Timer,
  Clock,
  Calendar,
  MapPin,
  Flag,
  AlertTriangle,
  CheckCircle2,
  Info,
  HelpCircle,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Sunrise,
} from 'lucide-react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

type MediaRoomProps = {
  visible: boolean;
  onClose: () => void;
};

type ToolType = 'youtube' | 'video' | 'music' | 'audio' | 'quality' | 'camera' | 'volume' | 'audience' | 'moderators' | 'network' | 'record' | 'live' | 'settings';

const MediaRoomScreen = ({ visible, onClose }: MediaRoomProps) => {
  // Core States
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [activePopup, setActivePopup] = useState<ToolType | null>(null);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  
  // Audio & Video States
  const [volume, setVolume] = useState<number>(75);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [audioQuality, setAudioQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [noiseReduction, setNoiseReduction] = useState<boolean>(true);
  const [echoCancel, setEchoCancel] = useState<boolean>(true);
  
  // Network & Quality States
  const [networkStatus, setNetworkStatus] = useState<'connected' | 'disconnected' | 'unstable'>('connected');
  const [cameraMode, setCameraMode] = useState<'front' | 'back' | 'dual' | 'beauty'>('front');
  const [streamQuality, setStreamQuality] = useState<'360p' | '480p' | '720p' | '1080p' | '4K'>('720p');
  const [bitrate, setBitrate] = useState<number>(2500);
  const [fps, setFps] = useState<number>(30);
  
  // YouTube States
  const [youtubeSearch, setYoutubeSearch] = useState<string>('');
  const [youtubeSearchResults, setYoutubeSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedYoutubeVideo, setSelectedYoutubeVideo] = useState<any>(null);
  const [showStreamOptions, setShowStreamOptions] = useState<boolean>(false);
  const [youtubeVolume, setYoutubeVolume] = useState<number>(50);
  
  // Audience & Moderation States
  const [audienceCount, setAudienceCount] = useState<number>(0);
  const [moderatorsList, setModeratorsList] = useState<string[]>(['المدير الرئيسي', 'مشرف المحتوى']);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [chatFilters, setChatFilters] = useState<string[]>(['كلمات غير لائقة', 'روابط مشبوهة']);
  
  // Advanced States
  const [beautyMode, setBeautyMode] = useState<boolean>(false);
  const [autoFocus, setAutoFocus] = useState<boolean>(true);
  const [stabilization, setStabilization] = useState<boolean>(true);
  const [lowLightMode, setLowLightMode] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [liveViewers, setLiveViewers] = useState<number>(0);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'critical'>('excellent');
  const [uploadSpeed, setUploadSpeed] = useState<string>('5.2 Mbps');
  const [downloadSpeed, setDownloadSpeed] = useState<string>('8.7 Mbps');
  const [ping, setPing] = useState<number>(45);
  const [cpuUsage, setCpuUsage] = useState<number>(35);
  const [memoryUsage, setMemoryUsage] = useState<number>(42);
  const [batteryLevel, setBatteryLevel] = useState<number>(78);
  const [temperature, setTemperature] = useState<number>(38);
  
  // UI States
  const [notifications, setNotifications] = useState<boolean>(true);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [currentYouTubeVideo, setCurrentYouTubeVideo] = useState<any>(null);
  const [isYouTubeVideoPlaying, setIsYouTubeVideoPlaying] = useState<boolean>(false);
  const [newModeratorName, setNewModeratorName] = useState<string>('');
  const [isAddingModerator, setIsAddingModerator] = useState<boolean>(false);
  
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Enhanced Mock Data
  const mockAudience = [
    { id: '1', name: 'أحمد محمد', avatar: '👨', isOnline: true, joinTime: '10:30', country: '🇸🇦', vip: true, gifts: 150, level: 25 },
    { id: '2', name: 'فاطمة علي', avatar: '👩', isOnline: true, joinTime: '10:25', country: '🇦🇪', vip: false, gifts: 25, level: 12 },
    { id: '3', name: 'محمد سالم', avatar: '👨', isOnline: false, joinTime: '10:15', country: '🇪🇬', vip: true, gifts: 300, level: 45 },
    { id: '4', name: 'نور الهدى', avatar: '👩', isOnline: true, joinTime: '10:35', country: '🇯🇴', vip: false, gifts: 75, level: 18 },
    { id: '5', name: 'عبدالله أحمد', avatar: '👨', isOnline: true, joinTime: '10:20', country: '🇰🇼', vip: true, gifts: 200, level: 32 },
    { id: '6', name: 'سارة أحمد', avatar: '👩', isOnline: true, joinTime: '10:40', country: '🇧🇭', vip: false, gifts: 50, level: 15 },
    { id: '7', name: 'علي محمود', avatar: '👨', isOnline: true, joinTime: '10:45', country: '🇴🇲', vip: true, gifts: 400, level: 52 },
    { id: '8', name: 'مريم سالم', avatar: '👩', isOnline: false, joinTime: '10:10', country: '🇶🇦', vip: false, gifts: 10, level: 8 },
  ];

  // Enhanced YouTube Mock Data
  const mockYouTubeVideos = [
    { id: '1', title: 'أغنية شعبية مشهورة - النسخة الأصلية', duration: '3:45', views: '2.5M', thumbnail: '🎵', channel: 'قناة الموسيقى العربية', quality: '4K', likes: '125K', category: 'موسيقى' },
    { id: '2', title: 'موسيقى هادئة للبث المباشر - مزيج رائع', duration: '5:20', views: '1.8M', thumbnail: '🎶', channel: 'موسيقى هادئة', quality: '1080p', likes: '89K', category: 'استرخاء' },
    { id: '3', title: 'أغاني تراثية عربية أصيلة', duration: '4:15', views: '950K', thumbnail: '🎼', channel: 'التراث العربي الأصيل', quality: '720p', likes: '45K', category: 'تراث' },
    { id: '4', title: 'موسيقى إلكترونية حديثة - ريمكس 2024', duration: '6:30', views: '3.2M', thumbnail: '🎧', channel: 'الموسيقى الحديثة', quality: '4K', likes: '200K', category: 'إلكترونية' },
    { id: '5', title: 'أصوات الطبيعة المريحة للاسترخاء', duration: '8:15', views: '1.2M', thumbnail: '🌿', channel: 'أصوات طبيعية', quality: '1080p', likes: '67K', category: 'طبيعة' },
    { id: '6', title: 'موسيقى كلاسيكية عالمية مختارة', duration: '7:22', views: '800K', thumbnail: '🎻', channel: 'الكلاسيكية العالمية', quality: '720p', likes: '38K', category: 'كلاسيكية' },
    { id: '7', title: 'أغاني حماسية للتحفيز والطاقة', duration: '4:55', views: '1.5M', thumbnail: '🔥', channel: 'الحماس والطاقة', quality: '1080p', likes: '95K', category: 'حماسية' },
    { id: '8', title: 'موسيقى للتأمل والاسترخاء العميق', duration: '12:30', views: '600K', thumbnail: '🧘', channel: 'التأمل والاسترخاء', quality: '720p', likes: '28K', category: 'تأمل' },
  ];

  // Enhanced Music Library
  const mockMusicTracks = [
    { id: '1', name: 'موسيقى هادئة للاسترخاء', duration: '4:30', isPlaying: false, genre: 'هادئة', mood: '😌', popularity: 95, bpm: 70 },
    { id: '2', name: 'موسيقى حماسية للطاقة', duration: '3:45', isPlaying: false, genre: 'حماسية', mood: '🔥', popularity: 88, bpm: 128 },
    { id: '3', name: 'موسيقى كلاسيكية راقية', duration: '5:20', isPlaying: false, genre: 'كلاسيكية', mood: '🎼', popularity: 92, bpm: 90 },
    { id: '4', name: 'موسيقى شرقية أصيلة', duration: '4:15', isPlaying: false, genre: 'شرقية', mood: '🎵', popularity: 90, bpm: 110 },
    { id: '5', name: 'موسيقى إلكترونية حديثة', duration: '6:10', isPlaying: false, genre: 'إلكترونية', mood: '🎧', popularity: 85, bpm: 140 },
    { id: '6', name: 'موسيقى جاز ناعمة', duration: '5:45', isPlaying: false, genre: 'جاز', mood: '🎷', popularity: 78, bpm: 95 },
    { id: '7', name: 'موسيقى لو فاي للتركيز', duration: '7:20', isPlaying: false, genre: 'لو فاي', mood: '☕', popularity: 82, bpm: 85 },
    { id: '8', name: 'موسيقى أمبيانت للخلفية', duration: '9:15', isPlaying: false, genre: 'أمبيانت', mood: '🌙', popularity: 75, bpm: 60 },
  ];

  const [musicTracks, setMusicTracks] = useState(mockMusicTracks);
  const [currentMusicTrack, setCurrentMusicTrack] = useState<any>(null);

  // Enhanced Room Tools with new features
  const roomTools = [
    {
      id: 'youtube' as ToolType,
      icon: Youtube,
      title: 'يوتيوب',
      emoji: '📺',
      color: '#FF0000',
      description: 'بحث وبث محتوى يوتيوب',
      premium: false,
    },
    {
      id: 'video' as ToolType,
      icon: Video,
      title: 'فيديو',
      emoji: '🎥',
      color: '#8B5CF6',
      description: 'رفع وبث الفيديوهات',
      premium: false,
    },
    {
      id: 'music' as ToolType,
      icon: Music,
      title: 'موسيقى',
      emoji: '🎵',
      color: '#10B981',
      description: 'مكتبة موسيقية متقدمة',
      premium: false,
    },
    {
      id: 'audio' as ToolType,
      icon: Mic,
      title: 'الصوت',
      emoji: '🎤',
      color: '#F59E0B',
      description: 'تحكم متقدم بالصوت',
      premium: false,
    },
    {
      id: 'quality' as ToolType,
      icon: Settings,
      title: 'جودة البث',
      emoji: '⚙️',
      color: '#6B7280',
      description: 'إعدادات الجودة والأداء',
      premium: true,
    },
    {
      id: 'camera' as ToolType,
      icon: Camera,
      title: 'الكاميرا',
      emoji: '📷',
      color: '#3B82F6',
      description: 'تحكم ذكي بالكاميرا',
      premium: true,
    },
    {
      id: 'volume' as ToolType,
      icon: Volume2,
      title: 'مستوى الصوت',
      emoji: '🔊',
      color: '#EF4444',
      description: 'تحكم دقيق بالصوت',
      premium: false,
    },
    {
      id: 'audience' as ToolType,
      icon: Users,
      title: 'الجمهور',
      emoji: '👥',
      color: '#8B5CF6',
      description: 'إدارة وتحليل الجمهور',
      premium: true,
    },
    {
      id: 'moderators' as ToolType,
      icon: Shield,
      title: 'المشرفين',
      emoji: '🛡️',
      color: '#059669',
      description: 'إدارة المشرفين والأمان',
      premium: true,
    },
    {
      id: 'network' as ToolType,
      icon: Globe,
      title: 'الشبكة',
      emoji: '🌐',
      color: '#0EA5E9',
      description: 'مراقبة الشبكة والأداء',
      premium: true,
    },
    {
      id: 'record' as ToolType,
      icon: Download,
      title: 'التسجيل',
      emoji: '📥',
      color: '#7C3AED',
      description: 'تسجيل وحفظ البث',
      premium: false,
    },
    {
      id: 'live' as ToolType,
      icon: Radio,
      title: 'البث المباشر',
      emoji: '🔴',
      color: '#DC2626',
      description: 'تحكم كامل بالبث',
      premium: false,
    },
    {
      id: 'settings' as ToolType,
      icon: Settings,
      title: 'الإعدادات',
      emoji: '⚙️',
      color: '#374151',
      description: 'إعدادات شاملة',
      premium: false,
    },
  ];

  // Haptic feedback function
  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
  }, []);

  // Pulse animation for live indicator
  useEffect(() => {
    if (isLiveActive) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isLiveActive, pulseAnim]);

  // Enhanced real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLiveActive) {
        // Update viewer count with more realistic fluctuation
        setAudienceCount(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
        setLiveViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 8) - 3));
        
        // Simulate network quality changes
        const qualities = ['excellent', 'good', 'poor', 'critical'] as const;
        const weights = [0.6, 0.25, 0.12, 0.03]; // Probability weights
        const randomValue = Math.random();
        let cumulativeWeight = 0;
        let selectedQuality: typeof qualities[number] = qualities[0];
        
        for (let i = 0; i < qualities.length; i++) {
          cumulativeWeight += weights[i];
          if (randomValue <= cumulativeWeight) {
            selectedQuality = qualities[i];
            break;
          }
        }
        setConnectionQuality(selectedQuality);
        
        // Update network speeds
        const uploadSpeeds = ['4.2 Mbps', '5.8 Mbps', '6.3 Mbps', '3.9 Mbps', '7.1 Mbps', '2.8 Mbps'];
        const downloadSpeeds = ['7.5 Mbps', '9.2 Mbps', '8.8 Mbps', '6.4 Mbps', '10.1 Mbps', '5.9 Mbps'];
        setUploadSpeed(uploadSpeeds[Math.floor(Math.random() * uploadSpeeds.length)]);
        setDownloadSpeed(downloadSpeeds[Math.floor(Math.random() * downloadSpeeds.length)]);
        
        // Update system metrics
        setPing(Math.floor(Math.random() * 100) + 20);
        setCpuUsage(Math.floor(Math.random() * 40) + 20);
        setMemoryUsage(Math.floor(Math.random() * 30) + 35);
        setTemperature(Math.floor(Math.random() * 15) + 35);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Recording timer
  useEffect(() => {
    let recordingInterval: ReturnType<typeof setInterval> | undefined;
    if (isRecording) {
      recordingInterval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [isRecording]);

  // Modal animations
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      // Reset states when closing
      setActivePopup(null);
      setSelectedTool(null);
      setShowStreamOptions(false);
    }
  }, [visible, slideAnim, scaleAnim]);

  // Enhanced tool selection handler
  const handleToolSelect = useCallback((toolId: ToolType) => {
    triggerHaptic();
    console.log(`🎯 تم اختيار الأداة: ${toolId}`);
    
    switch (toolId) {
      case 'youtube':
        setYoutubeSearchResults(mockYouTubeVideos);
        setActivePopup(toolId);
        setSelectedTool(toolId);
        console.log('📺 فتح واجهة يوتيوب المتقدمة للبحث والبث');
        break;
        
      case 'video':
        handleVideoSelection();
        setActivePopup(toolId);
        setSelectedTool(toolId);
        console.log('🎥 فتح مكتبة الفيديوهات المتقدمة');
        break;
        
      case 'music':
        if (!isMusicPlaying && !currentMusicTrack) {
          const recommendedTrack = musicTracks.find(track => track.popularity > 90) || musicTracks[0];
          setCurrentMusicTrack(recommendedTrack);
          setMusicTracks(prev => prev.map(track => 
            track.id === recommendedTrack.id ? { ...track, isPlaying: true } : track
          ));
        }
        setIsMusicPlaying(!isMusicPlaying);
        setActivePopup(toolId);
        setSelectedTool(toolId);
        console.log(`🎵 الموسيقى: ${!isMusicPlaying ? 'تم التشغيل' : 'تم الإيقاف'}`);
        break;
        
      case 'audio':
        setIsAudioOn(!isAudioOn);
        setActivePopup(toolId);
        setSelectedTool(toolId);
        console.log(`🎤 الصوت: ${!isAudioOn ? 'تم التشغيل' : 'تم الكتم'}`);
        Alert.alert('🎤 الميكروفون', `تم ${!isAudioOn ? 'تشغيل' : 'كتم'} الميكروفون بجودة ${audioQuality}`);
        break;
        
      case 'live':
        if (isLiveActive) {
          handleEndLive();
        } else {
          setIsLiveActive(true);
          setAudienceCount(Math.floor(Math.random() * 100) + 50);
          setLiveViewers(Math.floor(Math.random() * 200) + 100);
          console.log('🔴 تم تنشيط البث المباشر بجودة', streamQuality);
          Alert.alert('🔴 البث المباشر', `تم تنشيط البث المباشر بجودة ${streamQuality} و ${fps} إطار/ثانية`);
        }
        setActivePopup(toolId);
        setSelectedTool(toolId);
        break;
        
      case 'record':
        setIsRecording(!isRecording);
        setActivePopup(toolId);
        setSelectedTool(toolId);
        console.log(`📥 التسجيل: ${!isRecording ? 'تم البدء' : 'تم الإيقاف'} بجودة ${streamQuality}`);
        Alert.alert('📥 التسجيل', `تم ${!isRecording ? 'بدء' : 'إيقاف'} التسجيل بجودة ${streamQuality}`);
        break;
        
      default:
        setActivePopup(toolId);
        setSelectedTool(toolId);
        console.log(`⚙️ فتح إعدادات ${toolId}`);
    }
  }, [isMusicPlaying, currentMusicTrack, musicTracks, isAudioOn, audioQuality, isLiveActive, streamQuality, fps, isRecording, triggerHaptic]);

  // Enhanced video selection
  const handleVideoSelection = async () => {
    try {
      const mockVideo = {
        name: 'فيديو_عالي_الجودة_4K.mp4',
        uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        size: 15728640, // 15MB
        duration: '2:45',
        resolution: '1920x1080',
        format: 'MP4',
        bitrate: '5000 kbps'
      };
      
      setSelectedVideo(mockVideo);
      setIsVideoPlaying(true);
      console.log('🎥 تم اختيار فيديو عالي الجودة:', mockVideo.name);
      Alert.alert('✅ نجح', `تم اختيار الفيديو: ${mockVideo.name}\nالجودة: ${mockVideo.resolution}\nالحجم: ${(mockVideo.size / 1024 / 1024).toFixed(1)} MB`);
    } catch (error) {
      console.error('❌ خطأ في اختيار الفيديو:', error);
      Alert.alert('❌ خطأ', 'حدث خطأ أثناء اختيار الفيديو. يرجى المحاولة مرة أخرى.');
    }
  };

  // Enhanced YouTube search
  const handleYouTubeSearch = useCallback(() => {
    if (!youtubeSearch.trim()) {
      setYoutubeSearchResults(mockYouTubeVideos);
      return;
    }
    
    setIsSearching(true);
    console.log('🔍 البحث المتقدم في يوتيوب عن:', youtubeSearch);
    
    setTimeout(() => {
      const filteredResults = mockYouTubeVideos.filter(video => 
        video.title.toLowerCase().includes(youtubeSearch.toLowerCase()) || 
        video.channel.toLowerCase().includes(youtubeSearch.toLowerCase()) ||
        video.category.toLowerCase().includes(youtubeSearch.toLowerCase())
      );
      
      if (filteredResults.length === 0) {
        const searchResults = [
          { 
            id: 'search1', 
            title: `نتائج البحث المتقدمة عن "${youtubeSearch}"`, 
            duration: '4:32', 
            views: '1.2M', 
            thumbnail: '🔍', 
            channel: 'نتائج البحث الذكية',
            quality: '1080p',
            likes: '65K',
            category: 'بحث'
          },
          { 
            id: 'search2', 
            title: `${youtubeSearch} - محتوى مقترح بالذكاء الاصطناعي`, 
            duration: '6:15', 
            views: '890K', 
            thumbnail: '🤖', 
            channel: 'الاقتراحات الذكية',
            quality: '4K',
            likes: '42K',
            category: 'ذكي'
          },
          { 
            id: 'search3', 
            title: `أفضل ${youtubeSearch} لهذا العام - مجموعة مختارة`, 
            duration: '8:45', 
            views: '2.1M', 
            thumbnail: '⭐', 
            channel: 'المحتوى المميز',
            quality: '1080p',
            likes: '156K',
            category: 'مميز'
          },
        ];
        setYoutubeSearchResults(searchResults);
      } else {
        setYoutubeSearchResults(filteredResults);
      }
      
      setIsSearching(false);
    }, 1200);
  }, [youtubeSearch]);

  // Enhanced YouTube video selection
  const handleYouTubeVideoSelect = useCallback((video: any) => {
    setSelectedYoutubeVideo(video);
    setShowStreamOptions(true);
    triggerHaptic();
    console.log('📺 تم اختيار فيديو يوتيوب عالي الجودة:', video.title, `- جودة ${video.quality}`);
  }, [triggerHaptic]);

  // Enhanced streaming functions
  const handleStreamAudio = useCallback(() => {
    setCurrentYouTubeVideo(selectedYoutubeVideo);
    setIsYouTubeVideoPlaying(true);
    setShowStreamOptions(false);
    setActivePopup(null);
    setSelectedTool(null);
    console.log('🎵 بدء بث الصوت عالي الجودة:', selectedYoutubeVideo.title);
    Alert.alert(
      '🎵 بث الصوت عالي الجودة', 
      `تم بدء بث الصوت من يوتيوب\n\n📺 ${selectedYoutubeVideo.title}\n📊 ${selectedYoutubeVideo.views} مشاهدة\n⏱️ ${selectedYoutubeVideo.duration}\n🎯 جودة: ${selectedYoutubeVideo.quality}\n👍 ${selectedYoutubeVideo.likes} إعجاب`
    );
  }, [selectedYoutubeVideo]);

  const handleStreamVideo = useCallback(() => {
    setCurrentYouTubeVideo(selectedYoutubeVideo);
    setIsYouTubeVideoPlaying(true);
    setShowStreamOptions(false);
    setActivePopup(null);
    setSelectedTool(null);
    console.log('📺 بدء بث الفيديو بجودة كاملة:', selectedYoutubeVideo.title);
    Alert.alert(
      '📺 بث الفيديو بجودة كاملة', 
      `تم بدء بث الفيديو كاملاً من يوتيوب\n\n📺 ${selectedYoutubeVideo.title}\n📊 ${selectedYoutubeVideo.views} مشاهدة\n⏱️ ${selectedYoutubeVideo.duration}\n🎯 جودة: ${selectedYoutubeVideo.quality}\n👍 ${selectedYoutubeVideo.likes} إعجاب`
    );
  }, [selectedYoutubeVideo]);

  // Enhanced music functions
  const handleMusicTrackSelect = useCallback((track: any) => {
    setCurrentMusicTrack(track);
    setIsMusicPlaying(true);
    setMusicTracks(prev => prev.map(t => 
      t.id === track.id ? { ...t, isPlaying: true } : { ...t, isPlaying: false }
    ));
    triggerHaptic();
    console.log('🎵 تم اختيار مقطوعة موسيقية:', track.name, `- ${track.genre} - ${track.bpm} BPM`);
    Alert.alert('🎵 الموسيقى', `تم تشغيل: ${track.name}\nالنوع: ${track.genre} ${track.mood}\nالشعبية: ${track.popularity}%\nالإيقاع: ${track.bpm} BPM`);
  }, [triggerHaptic]);

  // Enhanced moderator functions
  const handleAddModerator = useCallback(() => {
    if (Platform.OS === 'web') {
      const name = prompt('أدخل اسم المشرف الجديد:');
      if (name && name.trim()) {
        setModeratorsList(prev => [...prev, name.trim()]);
        console.log('🛡️ تم إضافة مشرف جديد:', name.trim());
        Alert.alert('✅ نجح', `تم إضافة المشرف: ${name.trim()}\nإجمالي المشرفين: ${moderatorsList.length + 1}`);
      }
    } else {
      setIsAddingModerator(true);
    }
  }, [moderatorsList.length]);

  const confirmAddModerator = useCallback(() => {
    if (newModeratorName.trim()) {
      setModeratorsList(prev => [...prev, newModeratorName.trim()]);
      console.log('🛡️ تم إضافة مشرف جديد:', newModeratorName.trim());
      Alert.alert('✅ نجح', `تم إضافة المشرف: ${newModeratorName.trim()}\nإجمالي المشرفين: ${moderatorsList.length + 1}`);
      setNewModeratorName('');
      setIsAddingModerator(false);
      triggerHaptic();
    }
  }, [newModeratorName, moderatorsList.length, triggerHaptic]);

  // Enhanced utility functions
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getConnectionIcon = useCallback(() => {
    switch (connectionQuality) {
      case 'excellent': return <SignalHigh size={24} color="#10B981" />;
      case 'good': return <SignalMedium size={24} color="#F59E0B" />;
      case 'poor': return <SignalLow size={24} color="#EF4444" />;
      case 'critical': return <Signal size={24} color="#DC2626" />;
      default: return <Wifi size={24} color="#6B7280" />;
    }
  }, [connectionQuality]);

  const getConnectionText = useCallback(() => {
    switch (connectionQuality) {
      case 'excellent': return 'ممتازة';
      case 'good': return 'جيدة';
      case 'poor': return 'ضعيفة';
      case 'critical': return 'حرجة';
      default: return 'غير معروفة';
    }
  }, [connectionQuality]);

  const handleEndLive = useCallback(() => {
    Alert.alert(
      '⚠️ إنهاء البث المباشر',
      `هل أنت متأكد من إنهاء البث المباشر؟\n\nالمشاهدون الحاليون: ${liveViewers}\nإجمالي المشاهدات: ${audienceCount}\nمدة البث: ${formatTime(recordingDuration)}`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إنهاء البث',
          style: 'destructive',
          onPress: () => {
            setIsLiveActive(false);
            setAudienceCount(0);
            setLiveViewers(0);
            triggerHaptic();
            console.log('🔴 تم إنهاء البث المباشر');
            Alert.alert('✅ تم الإنهاء', 'تم إنهاء البث المباشر بنجاح');
          }
        }
      ]
    );
  }, [liveViewers, audienceCount, recordingDuration, formatTime, triggerHaptic]);

  // Enhanced popup content renderer
  const renderPopupContent = () => {
    if (!activePopup) return null;

    const tool = roomTools.find(t => t.id === activePopup);
    
    switch (activePopup) {
      case 'youtube':
        return (
          <ScrollView style={styles.popupScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.toolDetails}>
              <View style={styles.toolHeader}>
                <Text style={styles.detailTitle}>📺 مركز يوتيوب المتقدم</Text>
                <Text style={styles.toolDescription}>بحث ذكي وبث عالي الجودة</Text>
              </View>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="ابحث عن فيديو، قناة، أو فئة..."
                  value={youtubeSearch}
                  onChangeText={setYoutubeSearch}
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={handleYouTubeSearch}
                />
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={handleYouTubeSearch}
                >
                  <Search size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {currentYouTubeVideo && (
                <View style={styles.currentVideoContainer}>
                  <View style={styles.currentVideoHeader}>
                    <Text style={styles.currentVideoTitle}>🔴 يتم البث الآن</Text>
                    <View style={styles.liveIndicator}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>مباشر</Text>
                    </View>
                  </View>
                  <View style={styles.currentVideoInfo}>
                    <View style={styles.videoThumbnail}>
                      <Text style={styles.thumbnailEmoji}>{currentYouTubeVideo.thumbnail || '🎥'}</Text>
                    </View>
                    <View style={styles.videoDetails}>
                      <Text style={styles.currentVideoName}>{currentYouTubeVideo.title}</Text>
                      <Text style={styles.videoStats}>
                        {currentYouTubeVideo.views} مشاهدة • {currentYouTubeVideo.duration} • {currentYouTubeVideo.quality}
                      </Text>
                      <Text style={styles.videoChannel}>📺 {currentYouTubeVideo.channel}</Text>
                    </View>
                    <View style={styles.videoControls}>
                      <TouchableOpacity 
                        style={styles.playPauseButton}
                        onPress={() => setIsYouTubeVideoPlaying(!isYouTubeVideoPlaying)}
                      >
                        {isYouTubeVideoPlaying ? (
                          <Pause size={16} color="#FFFFFF" />
                        ) : (
                          <Play size={16} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.playPauseButton, { backgroundColor: '#EF4444' }]}
                        onPress={() => {
                          setCurrentYouTubeVideo(null);
                          setIsYouTubeVideoPlaying(false);
                        }}
                      >
                        <X size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.volumeControlContainer}>
                    <Text style={styles.volumeLabel}>مستوى صوت يوتيوب: {youtubeVolume}%</Text>
                    {Platform.OS === 'web' ? (
                      <input
                        type="range"
                        style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', outline: 'none' }}
                        min={0}
                        max={100}
                        value={youtubeVolume}
                        onChange={(e) => setYoutubeVolume(parseInt(e.target.value))}
                      />
                    ) : (
                      <Slider
                        style={styles.volumeSlider}
                        minimumValue={0}
                        maximumValue={100}
                        value={youtubeVolume}
                        onValueChange={setYoutubeVolume}
                        minimumTrackTintColor="#FF0000"
                        maximumTrackTintColor="#E5E7EB"
                        thumbTintColor="#FF0000"
                      />
                    )}
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>🎯 نتائج البحث المتقدمة ({youtubeSearchResults.length}):</Text>
              <View style={styles.videosList}>
                {isSearching ? (
                  <View style={styles.searchingContainer}>
                    <ActivityIndicator size="large" color="#FF0000" />
                    <Text style={styles.searchingText}>جاري البحث الذكي...</Text>
                  </View>
                ) : (
                  youtubeSearchResults.map((video) => (
                    <TouchableOpacity 
                      key={video.id} 
                      style={[
                        styles.videoItem,
                        currentYouTubeVideo?.id === video.id && styles.selectedVideoItem
                      ]}
                      onPress={() => handleYouTubeVideoSelect(video)}
                    >
                      <View style={styles.videoThumbnailSmall}>
                        <Text style={styles.thumbnailEmojiSmall}>{video.thumbnail}</Text>
                        <View style={styles.qualityBadge}>
                          <Text style={styles.qualityText}>{video.quality}</Text>
                        </View>
                      </View>
                      <View style={styles.videoInfo}>
                        <Text style={styles.videoTitle}>{video.title}</Text>
                        <Text style={styles.videoChannel}>📺 {video.channel}</Text>
                        <View style={styles.videoMetrics}>
                          <Text style={styles.videoDuration}>👁️ {video.views}</Text>
                          <Text style={styles.videoDuration}>⏱️ {video.duration}</Text>
                          <Text style={styles.videoDuration}>👍 {video.likes}</Text>
                        </View>
                        <Text style={styles.videoCategory}>🏷️ {video.category}</Text>
                      </View>
                      <View style={styles.videoActions}>
                        <Play size={16} color={currentYouTubeVideo?.id === video.id ? '#FF0000' : '#8B5CF6'} />
                        {currentYouTubeVideo?.id === video.id && (
                          <View style={styles.playingIndicator}>
                            <Text style={styles.playingText}>يتم التشغيل</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        );

      case 'audio':
        return (
          <ScrollView style={styles.popupScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.toolDetails}>
              <View style={styles.toolHeader}>
                <Text style={styles.detailTitle}>🎤 مركز التحكم الصوتي المتقدم</Text>
                <Text style={styles.toolDescription}>تحكم احترافي بجودة الصوت</Text>
              </View>
              
              <View style={styles.audioControls}>
                <View style={styles.audioStatus}>
                  <Animated.View style={[
                    styles.audioIndicator,
                    { 
                      backgroundColor: isAudioOn ? '#10B981' : '#EF4444',
                      transform: [{ scale: isAudioOn ? pulseAnim : 1 }]
                    }
                  ]}>
                    <Mic size={32} color="#FFFFFF" />
                  </Animated.View>
                  <Text style={[
                    styles.audioStatusText,
                    { color: isAudioOn ? '#10B981' : '#EF4444' }
                  ]}>
                    {isAudioOn ? 'الميكروفون نشط' : 'الميكروفون مكتوم'}
                  </Text>
                  <Text style={styles.audioQualityText}>
                    جودة الصوت: {audioQuality.toUpperCase()} • {noiseReduction ? 'إلغاء الضوضاء مفعل' : 'إلغاء الضوضاء معطل'}
                  </Text>
                </View>
                
                <View style={styles.audioButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.audioButton,
                      { backgroundColor: isAudioOn ? '#EF4444' : '#10B981' }
                    ]}
                    onPress={() => {
                      setIsAudioOn(!isAudioOn);
                      triggerHaptic();
                      console.log(`🎤 الصوت: ${!isAudioOn ? 'تم التشغيل' : 'تم الكتم'}`);
                    }}
                  >
                    {isAudioOn ? (
                      <>
                        <VolumeX size={16} color="#FFFFFF" />
                        <Text style={styles.audioButtonText}>كتم الصوت</Text>
                      </>
                    ) : (
                      <>
                        <Mic size={16} color="#FFFFFF" />
                        <Text style={styles.audioButtonText}>تشغيل الصوت</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                
                <View style={styles.audioSettings}>
                  <Text style={styles.audioSettingsTitle}>⚙️ الإعدادات المتقدمة:</Text>
                  
                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>جودة الصوت</Text>
                      <Text style={styles.settingDescription}>اختر جودة التسجيل والبث</Text>
                    </View>
                    <View style={styles.qualitySelector}>
                      {(['low', 'medium', 'high', 'ultra'] as const).map((quality) => (
                        <TouchableOpacity
                          key={quality}
                          style={[
                            styles.qualityOption,
                            audioQuality === quality && styles.qualityOptionActive
                          ]}
                          onPress={() => {
                            setAudioQuality(quality);
                            triggerHaptic();
                          }}
                        >
                          <Text style={[
                            styles.qualityOptionText,
                            audioQuality === quality && styles.qualityOptionTextActive
                          ]}>
                            {quality === 'low' ? 'منخفضة' : 
                             quality === 'medium' ? 'متوسطة' : 
                             quality === 'high' ? 'عالية' : 'فائقة'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>إلغاء الضوضاء</Text>
                      <Text style={styles.settingDescription}>تقليل الأصوات الخلفية تلقائياً</Text>
                    </View>
                    <Switch
                      value={noiseReduction}
                      onValueChange={(value) => {
                        setNoiseReduction(value);
                        triggerHaptic();
                      }}
                      trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  
                  <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>إلغاء الصدى</Text>
                      <Text style={styles.settingDescription}>منع تكرار الصوت والصدى</Text>
                    </View>
                    <Switch
                      value={echoCancel}
                      onValueChange={(value) => {
                        setEchoCancel(value);
                        triggerHaptic();
                      }}
                      trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  
                  <View style={styles.audioMetrics}>
                    <Text style={styles.metricsTitle}>📊 مقاييس الصوت الحية:</Text>
                    <View style={styles.metricsGrid}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>مستوى الإدخال</Text>
                        <Text style={styles.metricValue}>-12 dB</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>معدل العينة</Text>
                        <Text style={styles.metricValue}>48 kHz</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>عمق البت</Text>
                        <Text style={styles.metricValue}>24-bit</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>زمن التأخير</Text>
                        <Text style={styles.metricValue}>8 ms</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'music':
        return (
          <ScrollView style={styles.popupScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.toolDetails}>
              <View style={styles.toolHeader}>
                <Text style={styles.detailTitle}>🎵 مكتبة الموسيقى الذكية</Text>
                <Text style={styles.toolDescription}>مجموعة متنوعة من الموسيقى عالية الجودة</Text>
              </View>
              
              {currentMusicTrack && (
                <View style={styles.currentMusicContainer}>
                  <View style={styles.currentMusicHeader}>
                    <Text style={styles.currentMusicTitle}>🎶 الآن يتم التشغيل</Text>
                    <View style={styles.musicControls}>
                      <TouchableOpacity 
                        style={styles.musicControlButton}
                        onPress={() => {
                          setIsMusicPlaying(!isMusicPlaying);
                          setMusicTracks(prev => prev.map(track => 
                            track.id === currentMusicTrack.id ? { ...track, isPlaying: !isMusicPlaying } : track
                          ));
                        }}
                      >
                        {isMusicPlaying ? (
                          <Pause size={16} color="#FFFFFF" />
                        ) : (
                          <Play size={16} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.musicControlButton, { backgroundColor: '#8B5CF6' }]}
                        onPress={() => {
                          // Skip to next track
                          const currentIndex = musicTracks.findIndex(t => t.id === currentMusicTrack.id);
                          const nextTrack = musicTracks[(currentIndex + 1) % musicTracks.length];
                          handleMusicTrackSelect(nextTrack);
                        }}
                      >
                        <SkipForward size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.currentMusicInfo}>
                    <View style={styles.musicDetails}>
                      <Text style={styles.currentMusicName}>{currentMusicTrack.name}</Text>
                      <Text style={styles.musicGenre}>{currentMusicTrack.genre} {currentMusicTrack.mood}</Text>
                      <View style={styles.musicStats}>
                        <Text style={styles.musicDuration}>⏱️ {currentMusicTrack.duration}</Text>
                        <Text style={styles.musicDuration}>🎵 {currentMusicTrack.bpm} BPM</Text>
                        <Text style={styles.musicDuration}>⭐ {currentMusicTrack.popularity}%</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              
              <Text style={styles.sectionTitle}>🎼 اختر من المكتبة الموسيقية ({musicTracks.length} مقطوعة):</Text>
              <View style={styles.musicList}>
                {musicTracks.map((track) => (
                  <TouchableOpacity 
                    key={track.id} 
                    style={[
                      styles.musicItem,
                      currentMusicTrack?.id === track.id && styles.selectedMusicItem
                    ]}
                    onPress={() => handleMusicTrackSelect(track)}
                  >
                    <View style={styles.musicIcon}>
                      <Text style={styles.musicMoodEmoji}>{track.mood}</Text>
                    </View>
                    <View style={styles.musicInfo}>
                      <Text style={styles.musicTitle}>{track.name}</Text>
                      <Text style={styles.musicGenreText}>{track.genre}</Text>
                      <View style={styles.musicMetrics}>
                        <Text style={styles.musicMetric}>⏱️ {track.duration}</Text>
                        <Text style={styles.musicMetric}>🎵 {track.bpm}</Text>
                        <Text style={styles.musicMetric}>⭐ {track.popularity}%</Text>
                      </View>
                    </View>
                    <View style={styles.musicStatus}>
                      {currentMusicTrack?.id === track.id && isMusicPlaying ? (
                        <View style={styles.playingIndicator}>
                          <Text style={styles.playingText}>يتم التشغيل</Text>
                          <View style={styles.playingDots}>
                            <View style={[styles.playingDot, styles.playingDot1]} />
                            <View style={[styles.playingDot, styles.playingDot2]} />
                            <View style={[styles.playingDot, styles.playingDot3]} />
                          </View>
                        </View>
                      ) : (
                        <Play size={16} color="#10B981" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        );

      case 'quality':
        return (
          <ScrollView style={styles.popupScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.toolDetails}>
              <View style={styles.toolHeader}>
                <Text style={styles.detailTitle}>⚙️ مركز جودة البث المتقدم</Text>
                <Text style={styles.toolDescription}>تحكم دقيق في جودة الفيديو والأداء</Text>
              </View>
              
              <View style={styles.qualityControls}>
                <View style={styles.qualitySection}>
                  <Text style={styles.qualitySectionTitle}>📺 جودة الفيديو</Text>
                  <View style={styles.qualityGrid}>
                    {(['360p', '480p', '720p', '1080p', '4K'] as const).map((quality) => (
                      <TouchableOpacity
                        key={quality}
                        style={[
                          styles.qualityButton,
                          streamQuality === quality && styles.qualityButtonActive
                        ]}
                        onPress={() => {
                          setStreamQuality(quality);
                          triggerHaptic();
                          // Adjust bitrate based on quality
                          const bitrateMap = { '360p': 1000, '480p': 1500, '720p': 2500, '1080p': 4000, '4K': 8000 };
                          setBitrate(bitrateMap[quality]);
                        }}
                      >
                        <Text style={[
                          styles.qualityButtonText,
                          streamQuality === quality && styles.qualityButtonTextActive
                        ]}>
                          {quality}
                        </Text>
                        <Text style={[
                          styles.qualityButtonSubtext,
                          streamQuality === quality && styles.qualityButtonSubtextActive
                        ]}>
                          {quality === '360p' ? 'أساسية' : 
                           quality === '480p' ? 'جيدة' : 
                           quality === '720p' ? 'عالية' : 
                           quality === '1080p' ? 'فائقة' : 'احترافية'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.qualitySection}>
                  <Text style={styles.qualitySectionTitle}>🎬 معدل الإطارات (FPS)</Text>
                  <View style={styles.fpsSelector}>
                    {[24, 30, 60].map((fpsValue) => (
                      <TouchableOpacity
                        key={fpsValue}
                        style={[
                          styles.fpsButton,
                          fps === fpsValue && styles.fpsButtonActive
                        ]}
                        onPress={() => {
                          setFps(fpsValue);
                          triggerHaptic();
                        }}
                      >
                        <Text style={[
                          styles.fpsButtonText,
                          fps === fpsValue && styles.fpsButtonTextActive
                        ]}>
                          {fpsValue} FPS
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.qualitySection}>
                  <Text style={styles.qualitySectionTitle}>📊 معدل البت (Bitrate)</Text>
                  <View style={styles.bitrateContainer}>
                    <Text style={styles.bitrateValue}>{bitrate.toLocaleString()} kbps</Text>
                    {Platform.OS === 'web' ? (
                      <input
                        type="range"
                        style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', outline: 'none' }}
                        min={500}
                        max={10000}
                        step={100}
                        value={bitrate}
                        onChange={(e) => setBitrate(parseInt(e.target.value))}
                      />
                    ) : (
                      <Slider
                        style={styles.bitrateSlider}
                        minimumValue={500}
                        maximumValue={10000}
                        step={100}
                        value={bitrate}
                        onValueChange={setBitrate}
                        minimumTrackTintColor="#8B5CF6"
                        maximumTrackTintColor="#E5E7EB"
                        thumbTintColor="#8B5CF6"
                      />
                    )}
                    <View style={styles.bitrateLabels}>
                      <Text style={styles.bitrateLabel}>500k</Text>
                      <Text style={styles.bitrateLabel}>10M</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.performanceMetrics}>
                  <Text style={styles.metricsTitle}>📈 مقاييس الأداء الحية:</Text>
                  <View style={styles.metricsGrid}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>استخدام المعالج</Text>
                      <Text style={[styles.metricValue, { color: cpuUsage > 70 ? '#EF4444' : '#10B981' }]}>
                        {cpuUsage}%
                      </Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>استخدام الذاكرة</Text>
                      <Text style={[styles.metricValue, { color: memoryUsage > 80 ? '#EF4444' : '#10B981' }]}>
                        {memoryUsage}%
                      </Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>درجة الحرارة</Text>
                      <Text style={[styles.metricValue, { color: temperature > 45 ? '#EF4444' : '#10B981' }]}>
                        {temperature}°C
                      </Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>البطارية</Text>
                      <Text style={[styles.metricValue, { color: batteryLevel < 20 ? '#EF4444' : '#10B981' }]}>
                        {batteryLevel}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'network':
        return (
          <ScrollView style={styles.popupScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.toolDetails}>
              <View style={styles.toolHeader}>
                <Text style={styles.detailTitle}>🌐 مركز مراقبة الشبكة المتقدم</Text>
                <Text style={styles.toolDescription}>مراقبة شاملة لحالة الاتصال والأداء</Text>
              </View>
              
              <View style={styles.networkStatus}>
                {networkStatus === 'connected' ? (
                  <View style={styles.networkConnected}>
                    <View style={styles.connectionIndicator}>
                      {getConnectionIcon()}
                      <Text style={[styles.connectionQuality, { color: 
                        connectionQuality === 'excellent' ? '#10B981' : 
                        connectionQuality === 'good' ? '#F59E0B' : 
                        connectionQuality === 'poor' ? '#EF4444' : '#DC2626'
                      }]}>
                        جودة الاتصال: {getConnectionText()}
                      </Text>
                    </View>
                    
                    <View style={styles.networkStats}>
                      <View style={styles.networkStatItem}>
                        <Text style={styles.networkStatLabel}>سرعة الرفع</Text>
                        <Text style={styles.networkStatValue}>{uploadSpeed}</Text>
                      </View>
                      <View style={styles.networkStatItem}>
                        <Text style={styles.networkStatLabel}>سرعة التحميل</Text>
                        <Text style={styles.networkStatValue}>{downloadSpeed}</Text>
                      </View>
                      <View style={styles.networkStatItem}>
                        <Text style={styles.networkStatLabel}>زمن الاستجابة</Text>
                        <Text style={[styles.networkStatValue, { color: ping > 100 ? '#EF4444' : '#10B981' }]}>
                          {ping}ms
                        </Text>
                      </View>
                      <View style={styles.networkStatItem}>
                        <Text style={styles.networkStatLabel}>استقرار الاتصال</Text>
                        <Text style={styles.networkStatValue}>
                          {connectionQuality === 'excellent' ? '98%' : 
                           connectionQuality === 'good' ? '85%' : 
                           connectionQuality === 'poor' ? '65%' : '40%'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.networkActions}>
                      <TouchableOpacity 
                        style={styles.testConnectionButton}
                        onPress={() => {
                          triggerHaptic();
                          console.log('🧪 اختبار سرعة الاتصال');
                          Alert.alert('🧪 اختبار الاتصال', 'جاري اختبار سرعة الاتصال والاستقرار...');
                        }}
                      >
                        <Zap size={16} color="#FFFFFF" />
                        <Text style={styles.testConnectionText}>اختبار السرعة</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.testConnectionButton, { backgroundColor: '#8B5CF6' }]}
                        onPress={() => {
                          triggerHaptic();
                          console.log('🔧 تحسين الاتصال');
                          Alert.alert('🔧 تحسين الاتصال', 'جاري تحسين إعدادات الشبكة...');
                        }}
                      >
                        <Settings size={16} color="#FFFFFF" />
                        <Text style={styles.testConnectionText}>تحسين الاتصال</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.networkDisconnected}>
                    <WifiOff size={48} color="#EF4444" />
                    <Text style={styles.networkText}>انقطاع في الاتصال</Text>
                    <Text style={styles.networkSubtext}>تحقق من اتصالك بالإنترنت وحاول مرة أخرى</Text>
                    <TouchableOpacity 
                      style={styles.reconnectButton}
                      onPress={() => {
                        setNetworkStatus('connected');
                        triggerHaptic();
                        console.log('🔄 تم إعادة الاتصال بالشبكة');
                        Alert.alert('✅ نجح', 'تم إعادة الاتصال بالشبكة بنجاح');
                      }}
                    >
                      <RotateCw size={16} color="#FFFFFF" />
                      <Text style={styles.reconnectText}>إعادة الاتصال</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        );

      default:
        return (
          <View style={styles.toolDetails}>
            <View style={styles.toolHeader}>
              <Text style={styles.detailTitle}>✅ {tool?.title}</Text>
              <Text style={styles.toolDescription}>{tool?.description}</Text>
            </View>
            <Text style={styles.detailDescription}>الأداة تعمل بشكل صحيح ومتاحة للاستخدام</Text>
          </View>
        );
    }
  };

  // Enhanced floating popup
  const renderFloatingPopup = () => {
    if (!activePopup) return null;

    return (
      <Modal visible={true} animationType="fade" transparent>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
        <View style={styles.floatingPopupOverlay}>
          <TouchableOpacity 
            style={styles.floatingPopupBackdrop} 
            activeOpacity={1} 
            onPress={() => {
              setActivePopup(null);
              setSelectedTool(null);
            }}
          />
          <Animated.View style={[
            styles.floatingPopupContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <View style={styles.floatingPopupHeader}>
              <View style={styles.popupTitleContainer}>
                <Text style={styles.floatingPopupTitle}>
                  {roomTools.find(tool => tool.id === activePopup)?.title}
                </Text>
                {roomTools.find(tool => tool.id === activePopup)?.premium && (
                  <View style={styles.premiumBadge}>
                    <Crown size={12} color="#FFD700" />
                    <Text style={styles.premiumText}>PRO</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity 
                style={styles.floatingPopupClose}
                onPress={() => {
                  setActivePopup(null);
                  setSelectedTool(null);
                  triggerHaptic();
                }}
              >
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.floatingPopupContent}>
              {renderPopupContent()}
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.4)" barStyle="light-content" />
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.bottomSheet,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Enhanced Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#000000" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>غرفة الوسائط المتقدمة</Text>
              <Text style={styles.subtitle}>تحكم احترافي في البث المباشر</Text>
            </View>
            <View style={styles.headerStats}>
              {isLiveActive && (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>مباشر</Text>
                </View>
              )}
            </View>
          </View>

          {/* Enhanced Tools Grid */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.toolsGrid}>
              {roomTools.map((tool, index) => {
                const IconComponent = tool.icon;
                const isSelected = selectedTool === tool.id;
                let isActive = false;
                
                // Determine active state for each tool
                switch (tool.id) {
                  case 'live':
                    isActive = isLiveActive;
                    break;
                  case 'record':
                    isActive = isRecording;
                    break;
                  case 'video':
                    isActive = selectedVideo !== null && isVideoPlaying;
                    break;
                  case 'audio':
                    isActive = isAudioOn;
                    break;
                  case 'music':
                    isActive = isMusicPlaying;
                    break;
                  case 'network':
                    isActive = networkStatus === 'connected';
                    break;
                  case 'youtube':
                    isActive = currentYouTubeVideo !== null && isYouTubeVideoPlaying;
                    break;
                  default:
                    isActive = isSelected;
                }
                
                return (
                  <TouchableOpacity
                    key={tool.id}
                    style={[
                      styles.toolItem,
                      isSelected && styles.toolItemSelected
                    ]}
                    onPress={() => {
                      if (tool.id === 'live' && isLiveActive) {
                        handleEndLive();
                      } else {
                        handleToolSelect(tool.id);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.toolIconContainer,
                      { 
                        backgroundColor: isActive ? tool.color : '#F8F9FA',
                        borderColor: isActive ? tool.color : '#E5E7EB'
                      }
                    ]}>
                      <IconComponent 
                        size={22} 
                        color={isActive ? '#FFFFFF' : '#374151'} 
                      />
                      {tool.premium && (
                        <View style={styles.premiumIndicator}>
                          <Crown size={8} color="#FFD700" />
                        </View>
                      )}
                    </View>
                    
                    <Text style={[
                      styles.toolTitle,
                      { color: isActive ? tool.color : '#374151' }
                    ]}>
                      {tool.title}
                    </Text>
                    
                    {isActive && (
                      <Animated.View style={[
                        styles.activeDot,
                        { 
                          backgroundColor: tool.color,
                          transform: [{ scale: tool.id === 'live' ? pulseAnim : 1 }]
                        }
                      ]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {/* Status Bar */}
            {(isLiveActive || isRecording || currentYouTubeVideo || currentMusicTrack) && (
              <View style={styles.statusBar}>
                <Text style={styles.statusTitle}>🔥 الحالة النشطة:</Text>
                <View style={styles.statusItems}>
                  {isLiveActive && (
                    <View style={styles.statusItem}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>بث م��اشر • {liveViewers} مشاهد</Text>
                    </View>
                  )}
                  {isRecording && (
                    <View style={styles.statusItem}>
                      <Download size={12} color="#EF4444" />
                      <Text style={styles.statusText}>تسجيل • {formatTime(recordingDuration)}</Text>
                    </View>
                  )}
                  {currentYouTubeVideo && (
                    <View style={styles.statusItem}>
                      <Youtube size={12} color="#FF0000" />
                      <Text style={styles.statusText}>يوتيوب • {currentYouTubeVideo.title.substring(0, 20)}...</Text>
                    </View>
                  )}
                  {currentMusicTrack && (
                    <View style={styles.statusItem}>
                      <Music size={12} color="#10B981" />
                      <Text style={styles.statusText}>موسيقى • {currentMusicTrack.name.substring(0, 20)}...</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </Animated.View>
        
        {/* Enhanced Floating Popup */}
        {renderFloatingPopup()}
        
        {/* Enhanced YouTube Stream Options Modal */}
        <Modal visible={showStreamOptions} animationType="fade" transparent>
          <StatusBar backgroundColor="rgba(0, 0, 0, 0.6)" barStyle="light-content" />
          <View style={styles.streamOptionsOverlay}>
            <Animated.View style={[
              styles.streamOptionsModal,
              { transform: [{ scale: scaleAnim }] }
            ]}>
              <Text style={styles.streamOptionsTitle}>🎯 اختر نوع البث المتقدم</Text>
              {selectedYoutubeVideo && (
                <View style={styles.selectedVideoPreview}>
                  <View style={styles.videoThumbnailSmall}>
                    <Text style={styles.thumbnailEmojiSmall}>{selectedYoutubeVideo.thumbnail}</Text>
                    <View style={styles.qualityBadge}>
                      <Text style={styles.qualityText}>{selectedYoutubeVideo.quality}</Text>
                    </View>
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle}>{selectedYoutubeVideo.title}</Text>
                    <Text style={styles.videoChannel}>📺 {selectedYoutubeVideo.channel}</Text>
                    <View style={styles.videoMetrics}>
                      <Text style={styles.videoDuration}>👁️ {selectedYoutubeVideo.views}</Text>
                      <Text style={styles.videoDuration}>⏱️ {selectedYoutubeVideo.duration}</Text>
                      <Text style={styles.videoDuration}>👍 {selectedYoutubeVideo.likes}</Text>
                    </View>
                  </View>
                </View>
              )}
              
              <View style={styles.streamOptionsButtons}>
                <TouchableOpacity 
                  style={[styles.streamOptionButton, styles.audioStreamButton]}
                  onPress={handleStreamAudio}
                >
                  <Volume2 size={24} color="#FFFFFF" />
                  <View style={styles.streamOptionContent}>
                    <Text style={styles.streamOptionText}>بث الصوت فقط</Text>
                    <Text style={styles.streamOptionDescription}>تشغيل الصوت في الخلفية بجودة عالية</Text>
                  </View>
                  <Sparkles size={16} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.streamOptionButton, styles.videoStreamButton]}
                  onPress={handleStreamVideo}
                >
                  <Video size={24} color="#FFFFFF" />
                  <View style={styles.streamOptionContent}>
                    <Text style={styles.streamOptionText}>بث الفيديو كاملاً</Text>
                    <Text style={styles.streamOptionDescription}>تشغيل الفيديو بأعلى جودة متاحة</Text>
                  </View>
                  <Crown size={16} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.cancelStreamButton}
                onPress={() => {
                  setShowStreamOptions(false);
                  setSelectedYoutubeVideo(null);
                  triggerHaptic();
                }}
              >
                <Text style={styles.cancelStreamText}>إلغاء</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: screenHeight * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 25,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FAFAFA',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    paddingBottom: 20,
  },
  toolItem: {
    width: (screenWidth - 56) / 4,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  toolItemSelected: {
    transform: [{ scale: 1.05 }],
  },
  toolIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  premiumIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  toolTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 13,
    marginTop: 2,
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusBar: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  statusItems: {
    gap: 6,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Enhanced Floating Popup Styles
  floatingPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  floatingPopupBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingPopupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    maxHeight: screenHeight * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 30,
    overflow: 'hidden',
  },
  floatingPopupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  popupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  floatingPopupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  premiumText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#D97706',
  },
  floatingPopupClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingPopupContent: {
    maxHeight: screenHeight * 0.65,
  },
  popupScrollView: {
    flex: 1,
  },
  toolDetails: {
    padding: 24,
  },
  toolHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  detailDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
  },
  // Enhanced Search Styles
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#FFFFFF',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF0000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Enhanced Video Styles
  currentVideoContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  currentVideoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentVideoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  currentVideoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  videoThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailEmoji: {
    fontSize: 20,
  },
  videoDetails: {
    flex: 1,
  },
  currentVideoName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  videoStats: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  videoChannel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  videoControls: {
    flexDirection: 'row',
    gap: 6,
  },
  playPauseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeControlContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  volumeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  volumeSlider: {
    width: '100%',
    height: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  videosList: {
    gap: 8,
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  searchingText: {
    fontSize: 14,
    color: '#FF0000',
    fontWeight: '600',
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    gap: 12,
  },
  selectedVideoItem: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FF0000',
  },
  videoThumbnailSmall: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailEmojiSmall: {
    fontSize: 16,
  },
  qualityBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1F2937',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  qualityText: {
    fontSize: 6,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  videoMetrics: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  videoDuration: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  videoCategory: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
  videoActions: {
    alignItems: 'center',
    gap: 4,
  },
  playingIndicator: {
    alignItems: 'center',
  },
  playingText: {
    fontSize: 8,
    color: '#10B981',
    fontWeight: '600',
  },
  playingDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  playingDot: {
    width: 3,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 1.5,
  },
  playingDot1: {
    opacity: 0.4,
  },
  playingDot2: {
    opacity: 0.7,
  },
  playingDot3: {
    opacity: 1,
  },
  // Enhanced Audio Styles
  audioControls: {
    alignItems: 'center',
    gap: 24,
  },
  audioStatus: {
    alignItems: 'center',
    gap: 16,
  },
  audioIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  audioStatusText: {
    fontSize: 18,
    fontWeight: '700',
  },
  audioQualityText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  audioButtons: {
    width: '100%',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    gap: 10,
  },
  audioButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  audioSettings: {
    width: '100%',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  audioSettingsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  settingDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  qualitySelector: {
    flexDirection: 'row',
    gap: 4,
  },
  qualityOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  qualityOptionActive: {
    backgroundColor: '#10B981',
  },
  qualityOptionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  qualityOptionTextActive: {
    color: '#FFFFFF',
  },
  audioMetrics: {
    marginTop: 16,
  },
  metricsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  // Enhanced Music Styles
  currentMusicContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  currentMusicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentMusicTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  musicControls: {
    flexDirection: 'row',
    gap: 6,
  },
  musicControlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentMusicInfo: {
    gap: 8,
  },
  musicDetails: {
    flex: 1,
  },
  currentMusicName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  musicGenre: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 6,
  },
  musicStats: {
    flexDirection: 'row',
    gap: 12,
  },
  musicDuration: {
    fontSize: 11,
    color: '#6B7280',
  },
  musicList: {
    gap: 8,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    gap: 12,
  },
  selectedMusicItem: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  musicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicMoodEmoji: {
    fontSize: 18,
  },
  musicInfo: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  musicGenreText: {
    fontSize: 11,
    color: '#10B981',
    marginBottom: 4,
  },
  musicMetrics: {
    flexDirection: 'row',
    gap: 8,
  },
  musicMetric: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  musicStatus: {
    alignItems: 'center',
  },
  // Enhanced Quality Styles
  qualityControls: {
    gap: 24,
  },
  qualitySection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
  },
  qualitySectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  qualityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  qualityButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  qualityButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  qualityButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  qualityButtonTextActive: {
    color: '#FFFFFF',
  },
  qualityButtonSubtext: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  qualityButtonSubtextActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  fpsSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  fpsButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  fpsButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  fpsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  fpsButtonTextActive: {
    color: '#FFFFFF',
  },
  bitrateContainer: {
    alignItems: 'center',
    gap: 8,
  },
  bitrateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  bitrateSlider: {
    width: '100%',
    height: 40,
  },
  bitrateLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bitrateLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  performanceMetrics: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
  },
  // Enhanced Network Styles
  networkStatus: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  networkConnected: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  connectionIndicator: {
    alignItems: 'center',
    marginBottom: 16,
  },
  connectionQuality: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  networkStats: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  networkStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  networkStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  networkStatValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  networkActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  testConnectionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#10B981',
    borderRadius: 16,
    gap: 8,
  },
  testConnectionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  networkDisconnected: {
    alignItems: 'center',
    gap: 12,
  },
  networkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  networkSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  reconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    marginTop: 12,
    gap: 8,
  },
  reconnectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Enhanced Stream Options Modal Styles
  streamOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  streamOptionsModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 30,
  },
  streamOptionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  selectedVideoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  streamOptionsButtons: {
    gap: 16,
    marginBottom: 24,
  },
  streamOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  audioStreamButton: {
    backgroundColor: '#10B981',
  },
  videoStreamButton: {
    backgroundColor: '#8B5CF6',
  },
  streamOptionContent: {
    flex: 1,
  },
  streamOptionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  streamOptionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cancelStreamButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelStreamText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default MediaRoomScreen;