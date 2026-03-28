import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePK } from '@/hooks/use-pk-store';
import { trpc } from '@/lib/trpc';
import type { User } from '@/types/user';
import type { DatabaseUser } from '@/backend/database/models';
import { Sword, Users, Clock, Search, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CreatePKChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  sessionId?: string;
}

export default function CreatePKChallengeModal({ visible, onClose, sessionId }: CreatePKChallengeModalProps) {
  const { createChallenge, isLoading } = usePK();
  const [challengeType, setChallengeType] = useState<'1v1' | '4player'>('1v1');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [duration, setDuration] = useState<number>(300); // 5 minutes default
  const [selectedUsers, setSelectedUsers] = useState<DatabaseUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUserSearch, setShowUserSearch] = useState<boolean>(false);

  // Get users for selection
  const usersQuery = trpc.users.searchUsers.useQuery(
    { query: searchQuery },
    { enabled: showUserSearch && searchQuery.length > 0 }
  );

  const allUsersQuery = trpc.users.getAllUsers.useQuery(undefined, {
    enabled: showUserSearch,
  });

  const handleCreateChallenge = async () => {
    if (!title.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال عنوان التحدي');
      return;
    }

    const requiredUsers = challengeType === '1v1' ? 1 : 3;
    if (selectedUsers.length !== requiredUsers) {
      Alert.alert('خطأ', `يرجى اختيار ${requiredUsers} ${challengeType === '1v1' ? 'منافس' : 'منافسين'}`);
      return;
    }

    try {
      const result = await createChallenge({
        challengedUserIds: selectedUsers.map(u => u.id),
        type: challengeType,
        title: title.trim(),
        description: description.trim() || undefined,
        duration,
        sessionId,
      });

      if (result.success) {
        Alert.alert('نجح', 'تم إنشاء التحدي وإرسال الدعوات بنجاح!');
        resetForm();
        onClose();
      }
    } catch (error) {
      Alert.alert('خطأ', error instanceof Error ? error.message : 'فشل في إنشاء التحدي');
    }
  };

  const resetForm = () => {
    setChallengeType('1v1');
    setTitle('');
    setDescription('');
    setDuration(300);
    setSelectedUsers([]);
    setSearchQuery('');
    setShowUserSearch(false);
  };

  const handleUserSelect = (user: DatabaseUser) => {
    const maxUsers = challengeType === '1v1' ? 1 : 3;
    
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else if (selectedUsers.length < maxUsers) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      Alert.alert('تحذير', `يمكنك اختيار ${maxUsers} ${challengeType === '1v1' ? 'منافس' : 'منافسين'} فقط`);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} دقيقة`;
  };

  const availableUsers = searchQuery 
    ? usersQuery.data?.users || []
    : allUsersQuery.data?.users || [];

  const onlineUsers = availableUsers.filter((user: DatabaseUser) => user.isOnline);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.title}>إنشاء تحدي PK</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Challenge Type */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>نوع التحدي</Text>
                <View style={styles.typeContainer}>
                  <TouchableOpacity
                    style={[styles.typeButton, challengeType === '1v1' && styles.typeButtonActive]}
                    onPress={() => {
                      setChallengeType('1v1');
                      setSelectedUsers([]);
                    }}
                  >
                    <Sword size={20} color={challengeType === '1v1' ? '#667eea' : 'white'} />
                    <Text style={[styles.typeText, challengeType === '1v1' && styles.typeTextActive]}>
                      1 ضد 1
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.typeButton, challengeType === '4player' && styles.typeButtonActive]}
                    onPress={() => {
                      setChallengeType('4player');
                      setSelectedUsers([]);
                    }}
                  >
                    <Users size={20} color={challengeType === '4player' ? '#667eea' : 'white'} />
                    <Text style={[styles.typeText, challengeType === '4player' && styles.typeTextActive]}>
                      4 لاعبين
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Title */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>عنوان التحدي</Text>
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="أدخل عنوان التحدي..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  maxLength={50}
                />
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>الوصف (اختياري)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="أدخل وصف التحدي..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>

              {/* Duration */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>مدة التحدي</Text>
                <View style={styles.durationContainer}>
                  {[180, 300, 600, 900].map((seconds) => (
                    <TouchableOpacity
                      key={seconds}
                      style={[styles.durationButton, duration === seconds && styles.durationButtonActive]}
                      onPress={() => setDuration(seconds)}
                    >
                      <Clock size={16} color={duration === seconds ? '#667eea' : 'white'} />
                      <Text style={[styles.durationText, duration === seconds && styles.durationTextActive]}>
                        {formatDuration(seconds)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* User Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  اختر {challengeType === '1v1' ? 'المنافس' : 'المنافسين'} 
                  ({selectedUsers.length}/{challengeType === '1v1' ? 1 : 3})
                </Text>
                
                {!showUserSearch ? (
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => setShowUserSearch(true)}
                  >
                    <Search size={20} color="white" />
                    <Text style={styles.searchButtonText}>البحث عن المستخدمين</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.userSearchContainer}>
                    <View style={styles.searchInputContainer}>
                      <Search size={20} color="rgba(255, 255, 255, 0.6)" />
                      <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="ابحث عن مستخدم..."
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      />
                    </View>
                    
                    <ScrollView style={styles.usersList} nestedScrollEnabled>
                      {onlineUsers.map((user: DatabaseUser) => (
                        <TouchableOpacity
                          key={user.id}
                          style={[
                            styles.userItem,
                            selectedUsers.find(u => u.id === user.id) && styles.userItemSelected
                          ]}
                          onPress={() => handleUserSelect(user)}
                        >
                          <View style={styles.userAvatar}>
                            <Text style={styles.userAvatarText}>
                              {user.username.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.username}</Text>
                            <Text style={styles.userLevel}>المستوى {user.level}</Text>
                          </View>
                          {user.isVerified && (
                            <Text style={styles.verifiedBadge}>✓</Text>
                          )}
                          <View style={styles.onlineIndicator} />
                        </TouchableOpacity>
                      ))}
                      
                      {onlineUsers.length === 0 && (
                        <Text style={styles.noUsersText}>
                          {searchQuery ? 'لا توجد نتائج' : 'لا يوجد مستخدمون متصلون'}
                        </Text>
                      )}
                    </ScrollView>
                  </View>
                )}

                {/* Selected Users */}
                {selectedUsers.length > 0 && (
                  <View style={styles.selectedUsersContainer}>
                    <Text style={styles.selectedUsersTitle}>المستخدمون المختارون:</Text>
                    {selectedUsers.map((user) => (
                      <View key={user.id} style={styles.selectedUserItem}>
                        <Text style={styles.selectedUserName}>{user.username}</Text>
                        <TouchableOpacity
                          onPress={() => setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))}
                        >
                          <X size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Create Button */}
            <TouchableOpacity
              style={[styles.createButton, isLoading && styles.createButtonDisabled]}
              onPress={handleCreateChallenge}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#666', '#888'] : ['#4ECDC4', '#44A08D']}
                style={styles.createGradient}
              >
                <Sword size={20} color="white" />
                <Text style={styles.createButtonText}>
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء التحدي'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 15,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: 'white',
  },
  typeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  typeTextActive: {
    color: '#667eea',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  durationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
  },
  durationButtonActive: {
    backgroundColor: 'white',
  },
  durationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  durationTextActive: {
    color: '#667eea',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 15,
    gap: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  userSearchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  usersList: {
    maxHeight: 200,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 5,
  },
  userItemSelected: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  userLevel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  verifiedBadge: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
  },
  noUsersText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectedUsersContainer: {
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  selectedUsersTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 5,
  },
  selectedUserName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});