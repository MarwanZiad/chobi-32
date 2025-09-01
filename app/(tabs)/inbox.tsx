import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { Search, Camera, Edit } from 'lucide-react-native';
import colors from '@/constants/colors';
import { router } from 'expo-router';

interface Chat {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  time: string;
  unread: number;
}

const mockChats: Chat[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'سارة أحمد',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      isOnline: true,
    },
    lastMessage: 'شوفت الفيديو الجديد؟ 😍',
    time: 'الآن',
    unread: 2,
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'محمد خالد',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      isOnline: false,
    },
    lastMessage: 'هههههه والله ضحكتني',
    time: '5 د',
    unread: 0,
  },
  {
    id: '3',
    user: {
      id: 'u3',
      name: 'فاطمة علي',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      isOnline: true,
    },
    lastMessage: 'أرسلت لك فيديو',
    time: '15 د',
    unread: 1,
  },
  {
    id: '4',
    user: {
      id: 'u4',
      name: 'عبدالله حسن',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      isOnline: false,
    },
    lastMessage: 'متى نتقابل؟',
    time: '1 س',
    unread: 0,
  },
  {
    id: '5',
    user: {
      id: 'u5',
      name: 'نور الدين',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      isOnline: true,
    },
    lastMessage: 'شكراً على المتابعة 🙏',
    time: '2 س',
    unread: 0,
  },
  {
    id: '6',
    user: {
      id: 'u6',
      name: 'مريم سالم',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      isOnline: false,
    },
    lastMessage: 'الفيديو حلو جداً',
    time: 'أمس',
    unread: 0,
  },
];

export default function InboxScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats] = useState(mockChats);

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الرسائل</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Camera size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Edit size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="البحث في الرسائل..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  chatList: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00FF00',
    borderWidth: 2,
    borderColor: colors.background,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF4458',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCount: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});