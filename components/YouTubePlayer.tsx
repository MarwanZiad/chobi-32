import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { X, Search, Play, Pause, SkipForward, SkipBack, Maximize2, Volume2 } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface YouTubePlayerModalProps {
  visible: boolean;
  onClose: () => void;
}

interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [volume, setVolume] = useState(100);
  const playerRef = useRef<any>(null);

  // محاكاة نتائج البحث (في الإنتاج، استخدم YouTube Data API)
  const searchVideos = useCallback(async (query: string) => {
    if (!query.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال كلمة البحث');
      return;
    }

    setIsLoading(true);
    console.log('🔍 البحث عن:', query);

    // محاكاة نتائج البحث
    setTimeout(() => {
      const mockResults: VideoResult[] = [
        {
          id: 'dQw4w9WgXcQ',
          title: 'Rick Astley - Never Gonna Give You Up',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          duration: '3:33',
          channel: 'Rick Astley',
        },
        {
          id: 'kJQP7kiw5Fk',
          title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
          thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
          duration: '4:42',
          channel: 'Luis Fonsi',
        },
        {
          id: 'JGwWNGJdvx8',
          title: 'Ed Sheeran - Shape of You',
          thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg',
          duration: '4:24',
          channel: 'Ed Sheeran',
        },
        {
          id: 'OPf0YbXqDm0',
          title: 'Mark Ronson - Uptown Funk ft. Bruno Mars',
          thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/mqdefault.jpg',
          duration: '4:31',
          channel: 'Mark Ronson',
        },
        {
          id: '9bZkp7q19f0',
          title: 'PSY - GANGNAM STYLE',
          thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg',
          duration: '4:13',
          channel: 'officialpsy',
        },
      ].filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.channel.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults.length > 0 ? mockResults : [
        {
          id: 'dQw4w9WgXcQ',
          title: query + ' - نتيجة البحث',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '3:00',
          channel: 'قناة تجريبية',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const playVideo = useCallback((videoId: string) => {
    console.log('▶️ تشغيل الفيديو:', videoId);
    setCurrentVideoId(videoId);
    setShowPlayer(true);
    setIsPlaying(true);
    Alert.alert('تشغيل', `جاري تشغيل الفيديو: ${videoId}`);
  }, []);

  const onStateChange = useCallback((state: string) => {
    console.log('📺 حالة المشغل:', state);
    if (state === 'ended') {
      setIsPlaying(false);
      Alert.alert('انتهى', 'انتهى تشغيل الفيديو');
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    console.log('⏯️ تبديل التشغيل/الإيقاف');
  }, []);

  const seekForward = useCallback(async () => {
    if (playerRef.current) {
      const currentTime = await playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10, true);
      console.log('⏩ التقديم 10 ثواني');
    }
  }, []);

  const seekBackward = useCallback(async () => {
    if (playerRef.current) {
      const currentTime = await playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(0, currentTime - 10), true);
      console.log('⏪ الرجوع 10 ثواني');
    }
  }, []);

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value);
    console.log('🔊 مستوى الصوت:', value);
    // في الإنتاج، يمكنك التحكم في مستوى الصوت الفعلي
  }, []);

  const renderVideoItem = ({ item }: { item: VideoResult }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => playVideo(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        <Text style={styles.thumbnailPlaceholder}>📹</Text>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.channelName}>{item.channel}</Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={() => playVideo(item.id)}>
        <Play size={20} color="#fff" fill="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>YouTube Player</Text>
          <View style={{ width: 40 }} />
        </View>

        {showPlayer && currentVideoId ? (
          <View style={styles.playerContainer}>
            <YoutubePlayer
              ref={playerRef}
              height={220}
              width={screenWidth}
              play={isPlaying}
              videoId={currentVideoId}
              onChangeState={onStateChange}
              webViewStyle={styles.webView}
              webViewProps={{
                allowsFullscreenVideo: true,
                mediaPlaybackRequiresUserAction: false,
              }}
            />
            
            <View style={styles.controls}>
              <TouchableOpacity onPress={seekBackward} style={styles.controlButton}>
                <SkipBack size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
                {isPlaying ? (
                  <Pause size={28} color="#fff" fill="#fff" />
                ) : (
                  <Play size={28} color="#fff" fill="#fff" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity onPress={seekForward} style={styles.controlButton}>
                <SkipForward size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.volumeContainer}>
              <Volume2 size={20} color="#fff" />
              <Text style={styles.volumeText}>{volume}%</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث في YouTube..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => searchVideos(searchQuery)}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => searchVideos(searchQuery)}
          >
            <Search size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF0000" />
            <Text style={styles.loadingText}>جاري البحث...</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>ابحث عن فيديوهات YouTube</Text>
              </View>
            }
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1a1a1a',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerContainer: {
    backgroundColor: '#000',
  },
  webView: {
    backgroundColor: '#000',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    gap: 24,
  },
  controlButton: {
    padding: 8,
  },
  playPauseButton: {
    backgroundColor: '#FF0000',
    borderRadius: 30,
    padding: 12,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    gap: 8,
  },
  volumeText: {
    color: '#fff',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#1a1a1a',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  resultsList: {
    padding: 16,
  },
  videoItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 120,
    height: 68,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailPlaceholder: {
    fontSize: 24,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  channelName: {
    color: '#999',
    fontSize: 12,
  },
  playButton: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});