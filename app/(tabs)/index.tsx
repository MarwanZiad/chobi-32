import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ViewToken,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import VideoPlayer from '@/components/VideoPlayer';
import { feedVideos } from '@/mocks/feed-videos';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videos] = useState(feedVideos);
  const insets = useSafeAreaInsets();
  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index;
        if (index !== null) {
          setActiveVideoIndex(index);
        }
      }
    }
  ).current;

  const handleLike = useCallback((videoId: string) => {
    console.log('Liked video:', videoId);
  }, []);

  const handleComment = useCallback((videoId: string) => {
    console.log('Comment on video:', videoId);
  }, []);

  const handleFollow = useCallback((userId: string) => {
    console.log('Follow user:', userId);
  }, []);

  const renderVideo = ({ item, index }: { item: typeof feedVideos[0]; index: number }) => {
    return (
      <View style={[styles.videoWrapper, { height: screenHeight }]}>
        <VideoPlayer
          video={item}
          isActive={index === activeVideoIndex}
          onLike={() => handleLike(item.id)}
          onComment={() => handleComment(item.id)}
          onFollow={() => handleFollow(item.user.id)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        removeClippedSubviews
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        getItemLayout={(_, index) => ({
          length: screenHeight,
          offset: screenHeight * index,
          index,
        })}
      />
      
      {/* Header Overlay */}
      <SafeAreaView style={styles.headerOverlay} pointerEvents="box-none">
        <View style={[styles.header, { paddingTop: insets.top }]} pointerEvents="none">
          {/* Header content will be added here */}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoWrapper: {
    width: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});