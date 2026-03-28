import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Video, 
  MoreHorizontal,
  ArrowLeft,
  Plus,
  Users,
  Settings
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useChat } from '@/hooks/use-chat-store';

import LiveStreamsBar from '@/components/LiveStreamsBar';
import UserAvatar from '@/components/UserAvatar';
import UserName from '@/components/UserName';
import colors from '@/constants/colors';

export default function ChatsScreen() {
  const router = useRouter();
  const { chats, users, getUserById, createChat } = useChat();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chats' | 'calls'>('chats');

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    
    const otherParticipant = chat.participants.find(id => id !== 'current-user');
    const user = otherParticipant ? getUserById(otherParticipant) : null;
    
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatLastSeen = (date?: Date) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ar', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    return date.toLocaleDateString('ar', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderChatItem = ({ item: chat }: { item: any }) => {
    const otherParticipant = chat.participants.find((id: string) => id !== 'current-user');
    const user = otherParticipant ? getUserById(otherParticipant) : null;
    
    if (!user) return null;

    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${chat.id}`)}
      >
        <View style={styles.avatarContainer}>
          <UserAvatar 
            userId={user.id}
            imageUrl={user.avatar}
            size={50}
            testID={`chat-avatar-${chat.id}`}
          />
          {user.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <UserName 
              userId={user.id}
              username={user.name}
              textStyle={styles.userName}
              testID={`chat-username-${chat.id}`}
            />
            <Text style={styles.messageTime}>
              {chat.lastMessage ? formatMessageTime(chat.lastMessage.timestamp) : ''}
            </Text>
          </View>
          
          <View style={styles.chatPreview}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {chat.lastMessage?.content || 'لا توجد رسائل'}
            </Text>
            {chat.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
              </View>
            )}
          </View>
          
          {!user.isOnline && user.lastSeen && (
            <Text style={styles.lastSeen}>
              آخر ظهور {formatLastSeen(user.lastSeen)}
            </Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal color={colors.textSecondary} size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderCallItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar}
          contentFit='cover'
        />
      </View>
      
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.callInfo}>
          <Text style={styles.callType}>
            {item.type === 'video' ? 'مكالمة فيديو' : 'مكالمة صوتية'}
          </Text>
          <Text style={styles.callTime}>{item.time}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.callButton}>
        {item.type === 'video' ? (
          <Video color={colors.primary} size={24} />
        ) : (
          <Phone color={colors.primary} size={24} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const mockCalls = [
    {
      id: '1',
      name: 'أحمد محمد',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      type: 'video',
      time: '10:30 ص',
      status: 'missed'
    },
    {
      id: '2',
      name: 'فاطمة علي',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      type: 'audio',
      time: 'أمس',
      status: 'completed'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>الرسائل</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Plus color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Settings color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color={colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder='البحث في الرسائل...'
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Live Streams Bar */}
      <LiveStreamsBar />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <MessageCircle 
            color={activeTab === 'chats' ? colors.primary : colors.textSecondary} 
            size={20} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'chats' && styles.activeTabText
          ]}>
            الدردشات
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'calls' && styles.activeTab]}
          onPress={() => setActiveTab('calls')}
        >
          <Phone 
            color={activeTab === 'calls' ? colors.primary : colors.textSecondary} 
            size={20} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'calls' && styles.activeTabText
          ]}>
            المكالمات
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'chats' ? (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <FlatList
            data={mockCalls}
            renderItem={renderCallItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MessageCircle color={colors.white} size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.background,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chatPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  lastSeen: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callType: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  callTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  callButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});