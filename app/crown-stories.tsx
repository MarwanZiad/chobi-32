import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import StoriesBar from '@/components/StoriesBar';
import LiveStreamsBar from '@/components/LiveStreamsBar';
import BottomNavigation from '@/components/BottomNavigation';
import { useChobiStore } from '@/hooks/use-chobi-store';
import colors from '@/constants/colors';

export default function CrownStoriesScreen() {
  const { activeNavTab, setActiveNavTab } = useChobiStore();

  const handleBackPress = () => {
    router.back();
  };

  const handleExitToMain = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'القصص والبث المباشر',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ArrowLeft color={colors.text} size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleExitToMain} style={styles.exitButton}>
              <X color={colors.text} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>القصص</Text>
          <StoriesBar showAddStory={true} />
        </View>
        
        {/* Live Streams Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>البث المباشر</Text>
          <LiveStreamsBar />
        </View>
      </ScrollView>
      
      <BottomNavigation 
        activeTab={activeNavTab} 
        onTabChange={setActiveNavTab} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  exitButton: {
    padding: 8,
    marginRight: 8,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});