import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  FlatList,
  Dimensions,
  Image,
  Linking,
} from 'react-native';
import { X, Search, Play, ExternalLink } from 'lucide-react-native';

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
  views?: string;
  publishedAt?: string;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);

  // Popular videos database
  const popularVideos: VideoResult[] = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up',
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
      duration: '3:33',
      channel: 'Rick Astley',
      views: '1.3B views',
      publishedAt: '2009',
    },
    {
      id: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      thumbnail: `https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg`,
      duration: '4:42',
      channel: 'Luis Fonsi',
      views: '8.2B views',
      publishedAt: '2017',
    },
    {
      id: 'JGwWNGJdvx8',
      title: 'Ed Sheeran - Shape of You',
      thumbnail: `https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg`,
      duration: '4:24',
      channel: 'Ed Sheeran',
      views: '6B views',
      publishedAt: '2017',
    },
    {
      id: 'OPf0YbXqDm0',
      title: 'Mark Ronson - Uptown Funk ft. Bruno Mars',
      thumbnail: `https://img.youtube.com/vi/OPf0YbXqDm0/mqdefault.jpg`,
      duration: '4:31',
      channel: 'Mark Ronson',
      views: '5B views',
      publishedAt: '2014',
    },
    {
      id: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      thumbnail: `https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg`,
      duration: '4:13',
      channel: 'officialpsy',
      views: '4.9B views',
      publishedAt: '2012',
    },
    {
      id: 'fRh_vgS2dFE',
      title: 'Justin Bieber - Sorry',
      thumbnail: `https://img.youtube.com/vi/fRh_vgS2dFE/mqdefault.jpg`,
      duration: '3:26',
      channel: 'Justin Bieber',
      views: '3.7B views',
      publishedAt: '2015',
    },
    {
      id: 'RgKAFK5djSk',
      title: 'Wiz Khalifa - See You Again ft. Charlie Puth',
      thumbnail: `https://img.youtube.com/vi/RgKAFK5djSk/mqdefault.jpg`,
      duration: '3:58',
      channel: 'Wiz Khalifa',
      views: '6.1B views',
      publishedAt: '2015',
    },
    {
      id: 'hTWKbfoikeg',
      title: 'Nirvana - Smells Like Teen Spirit',
      thumbnail: `https://img.youtube.com/vi/hTWKbfoikeg/mqdefault.jpg`,
      duration: '4:39',
      channel: 'Nirvana',
      views: '1.8B views',
      publishedAt: '2009',
    },
    {
      id: '60ItHLz5WEA',
      title: 'Alan Walker - Faded',
      thumbnail: `https://img.youtube.com/vi/60ItHLz5WEA/mqdefault.jpg`,
      duration: '3:33',
      channel: 'Alan Walker',
      views: '3.5B views',
      publishedAt: '2015',
    },
    {
      id: 'YQHsXMglC9A',
      title: 'Adele - Hello',
      thumbnail: `https://img.youtube.com/vi/YQHsXMglC9A/mqdefault.jpg`,
      duration: '4:55',
      channel: 'Adele',
      views: '3.1B views',
      publishedAt: '2015',
    },
  ];

  // Search videos
  const searchVideos = useCallback(async (query: string) => {
    if (!query.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال كلمة البحث');
      return;
    }

    setIsLoading(true);
    console.log('🔍 البحث في YouTube عن:', query);

    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter based on search query
      let results: VideoResult[];
      
      if (query.toLowerCase() === 'all' || query === '*') {
        results = popularVideos;
      } else {
        results = popularVideos.filter(video => 
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.channel.toLowerCase().includes(query.toLowerCase())
        );
      }

      // If no results, show some suggestions
      if (results.length === 0) {
        results = popularVideos.slice(0, 3);
        Alert.alert(
          'نتائج البحث', 
          `لم يتم العثور على نتائج لـ "${query}"\nعرض فيديوهات مقترحة`
        );
      }

      setSearchResults(results);
      setIsLoading(false);
    } catch (error) {
      console.error('خطأ في البحث:', error);
      setIsLoading(false);
      Alert.alert('خطأ', 'حدث خطأ في البحث');
    }
  }, []);

  // Play video
  const playVideo = useCallback((video: VideoResult) => {
    console.log('▶️ تشغيل الفيديو:', video.id, video.title);
    setCurrentVideoId(video.id);
    setCurrentVideoTitle(video.title);
    setShowPlayer(true);
    
    // Show embed on web, open YouTube app on mobile
    if (Platform.OS === 'web') {
      // Will show iframe embed
    } else {
      // Open in YouTube app or browser
      const youtubeURL = `https://www.youtube.com/watch?v=${video.id}`;
      Linking.openURL(youtubeURL).catch(() => {
        Alert.alert('خطأ', 'لا يمكن فتح YouTube');
      });
    }
  }, []);

  // Open in external app
  const openInYouTube = useCallback((videoId: string) => {
    const youtubeURL = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(youtubeURL).catch(() => {
      Alert.alert('خطأ', 'لا يمكن فتح YouTube');
    });
  }, []);

  // Close player
  const closePlayer = useCallback(() => {
    setShowPlayer(false);
    setCurrentVideoId('');
    setCurrentVideoTitle('');
  }, []);

  // Render video item
  const renderVideoItem = ({ item }: { item: VideoResult }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => playVideo(item)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: item.thumbnail }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.channelName}>{item.channel}</Text>
        <View style={styles.videoMeta}>
          {item.views && <Text style={styles.metaText}>{item.views}</Text>}
          {item.publishedAt && <Text style={styles.metaText}> • {item.publishedAt}</Text>}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={() => openInYouTube(item.id)}
      >
        <ExternalLink size={16} color="#fff" />
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
          <TouchableOpacity 
            onPress={() => searchVideos('all')} 
            style={styles.refreshButton}
          >
            <Text style={styles.refreshText}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Web Player */}
        {showPlayer && currentVideoId && Platform.OS === 'web' && (
          <View style={styles.playerWrapper}>
            <View style={styles.playerHeader}>
              <Text style={styles.nowPlaying} numberOfLines={1}>
                {currentVideoTitle}
              </Text>
              <TouchableOpacity onPress={closePlayer} style={styles.closePlayerButton}>
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.webPlayerContainer}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&playsinline=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0 }}
              />
            </View>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder='ابحث في YouTube... (اكتب "all" لعرض الكل)'
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

        {/* Results */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF0000" />
            <Text style={styles.loadingText}>جاري البحث في YouTube...</Text>
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
                <Text style={styles.emptySubtext}>اكتب "all" لعرض الفيديوهات الشائعة</Text>
                <TouchableOpacity 
                  style={styles.suggestButton}
                  onPress={() => searchVideos('all')}
                >
                  <Play size={16} color="#fff" />
                  <Text style={styles.suggestText}>عرض الفيديوهات الشائعة</Text>
                </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  refreshButton: {
    padding: 8,
  },
  refreshText: {
    fontSize: 20,
  },
  playerWrapper: {
    backgroundColor: '#000',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#1a1a1a',
  },
  nowPlaying: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginRight: 12,
  },
  closePlayerButton: {
    padding: 4,
  },
  webPlayerContainer: {
    width: screenWidth,
    height: screenWidth * 0.5625, // 16:9 aspect ratio
    backgroundColor: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    overflow: 'hidden',
    position: 'relative' as const,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute' as const,
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold' as const,
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
    lineHeight: 18,
  },
  channelName: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 2,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#888',
    fontSize: 11,
  },
  playButton: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    padding: 10,
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
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  suggestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  suggestText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});