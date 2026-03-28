import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal
} from 'react-native';
import { Image } from 'expo-image';
import UserAvatar from '@/components/UserAvatar';
import UserName from '@/components/UserName';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Send,
  Paperclip,
  Camera,
  Mic,
  MicOff,
  Image as ImageIcon,
  Trash2,
  Copy,
  Reply,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useChat } from '@/hooks/use-chat-store';
import colors from '@/constants/colors';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { 
    getChatMessages, 
    sendMessage, 
    deleteMessage, 
    markMessagesAsRead, 
    getUserById, 
    chats,
    startCall,
    sendTemporaryMessage,
    setTypingIndicator,
    currentUserId
  } = useChat();

  const [messageText, setMessageText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showMessageOptions, setShowMessageOptions] = useState<boolean>(false);
  const [replyToMessage, setReplyToMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chatId = Array.isArray(id) ? id[0] : id;
  const chat = chats.find(c => c.id === chatId);
  const messages = getChatMessages(chatId);
  
  const otherParticipant = chat?.participants.find(pid => pid !== currentUserId);
  const otherUser = otherParticipant ? getUserById(otherParticipant) : null;

  useEffect(() => {
    if (chatId) {
      markMessagesAsRead(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatId) return;

    const content = messageText.trim();
    setMessageText('');
    
    // Clear typing indicator
    setTypingIndicator(chatId, false);
    
    try {
      await sendMessage(chatId, content, 'text');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('خطأ', 'فشل في إرسال الرسالة');
    }
  };

  const handleTextChange = (text: string) => {
    setMessageText(text);
    
    if (!chatId) return;

    // Set typing indicator
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      setTypingIndicator(chatId, true);
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      setTypingIndicator(chatId, false);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTypingIndicator(chatId, false);
    }, 2000);
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('إذن مطلوب', 'نحتاج إذن للوصول إلى معرض الصور');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && chatId) {
      const asset = result.assets[0];
      const messageType = asset.type === 'video' ? 'video' : 'image';
      
      try {
        await sendMessage(chatId, asset.fileName || 'ملف مرفق', messageType, asset.uri);
      } catch (error) {
        console.error('Error sending media:', error);
        Alert.alert('خطأ', 'فشل في إرسال الملف');
      }
    }
  };

  const handleCameraPicker = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('إذن مطلوب', 'نحتاج إذن للوصول إلى الكاميرا');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && chatId) {
      const asset = result.assets[0];
      
      try {
        await sendMessage(chatId, 'صورة من الكاميرا', 'image', asset.uri);
      } catch (error) {
        console.error('Error sending camera image:', error);
        Alert.alert('خطأ', 'فشل في إرسال الصورة');
      }
    }
  };

  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('إذن مطلوب', 'نحتاج إذن للوصول إلى الميكروفون');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('خطأ', 'فشل في بدء التسجيل');
    }
  };

  const stopRecording = async () => {
    if (!recording || !chatId) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      }

      const uri = recording.getURI();
      if (uri) {
        await sendMessage(chatId, 'رسالة صوتية', 'audio', uri);
      }
      
      setRecording(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('خطأ', 'فشل في إيقاف التسجيل');
    }
  };

  const handleLongPressMessage = (messageId: string) => {
    setSelectedMessage(messageId);
    setShowMessageOptions(true);
  };

  const handleDeleteMessage = (deleteFor: 'sender' | 'everyone') => {
    if (selectedMessage) {
      deleteMessage(selectedMessage, deleteFor);
      setShowMessageOptions(false);
      setSelectedMessage(null);
    }
  };

  const handleReplyToMessage = () => {
    setReplyToMessage(selectedMessage);
    setShowMessageOptions(false);
    setSelectedMessage(null);
  };

  const handleSendTemporary = async () => {
    if (!messageText.trim() || !chatId) return;

    const content = messageText.trim();
    setMessageText('');
    
    try {
      await sendTemporaryMessage(chatId, content, 5); // 5 minutes expiration
    } catch (error) {
      console.error('Error sending temporary message:', error);
      Alert.alert('خطأ', 'فشل في إرسال الرسالة المؤقتة');
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('ar', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const renderMessage = ({ item: message }: { item: any }) => {
    const isMyMessage = message.senderId === currentUserId;
    const isDeleted = message.isDeleted;
    
    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage
        ]}
        onLongPress={() => handleLongPressMessage(message.id)}
      >
        {!isMyMessage && otherUser && (
          <UserAvatar 
            userId={otherUser.id}
            imageUrl={otherUser.avatar}
            size={32}
            testID={`message-avatar-${message.id}`}
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          isDeleted && styles.deletedMessage
        ]}>
          {replyToMessage === message.replyTo && (
            <View style={styles.replyContainer}>
              <Text style={styles.replyText}>رد على رسالة</Text>
            </View>
          )}
          
          {isDeleted ? (
            <Text style={styles.deletedText}>
              {message.deletedFor === 'everyone' ? 'تم حذف هذه الرسالة' : 'حذفت هذه الرسالة'}
            </Text>
          ) : (
            <>
              {message.type === 'text' && (
                <Text style={[
                  styles.messageText,
                  isMyMessage ? styles.myMessageText : styles.otherMessageText
                ]}>
                  {message.content}
                </Text>
              )}
              
              {message.type === 'image' && message.mediaUrl && (
                <View>
                  <Image 
                    source={{ uri: message.mediaUrl }} 
                    style={styles.messageImage}
                    contentFit='cover'
                  />
                  {message.content !== 'صورة من الكاميرا' && message.content !== 'ملف مرفق' && (
                    <Text style={[
                      styles.messageText,
                      isMyMessage ? styles.myMessageText : styles.otherMessageText
                    ]}>
                      {message.content}
                    </Text>
                  )}
                </View>
              )}
              
              {message.type === 'audio' && (
                <View style={styles.audioMessage}>
                  <Mic color={isMyMessage ? colors.white : colors.primary} size={16} />
                  <Text style={[
                    styles.messageText,
                    isMyMessage ? styles.myMessageText : styles.otherMessageText
                  ]}>
                    رسالة صوتية
                  </Text>
                </View>
              )}
            </>
          )}
          
          <View style={styles.messageFooter}>
            {message.isTemporary && (
              <Clock color={colors.textSecondary} size={12} />
            )}
            <Text style={styles.messageTime}>
              {formatMessageTime(message.timestamp)}
            </Text>
            {isMyMessage && (
              <View style={styles.messageStatus}>
                {message.isRead ? (
                  <CheckCheck color={colors.primary} size={14} />
                ) : message.isDelivered ? (
                  <CheckCheck color={colors.textSecondary} size={14} />
                ) : (
                  <Check color={colors.textSecondary} size={14} />
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!chat || !otherUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>الدردشة غير موجودة</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userInfo} onPress={() => router.push(`/user/${otherUser.id}`)}>
            <UserAvatar 
              userId={otherUser.id}
              imageUrl={otherUser.avatar}
              size={40}
              testID={`chat-header-avatar-${otherUser.id}`}
            />
            <View>
              <UserName 
                userId={otherUser.id}
                username={otherUser.name}
                disabled={true}
                textStyle={styles.headerName}
                testID={`chat-header-name-${otherUser.id}`}
              />
              <Text style={styles.headerStatus}>
                {otherUser.isOnline ? 'متصل الآن' : 'غير متصل'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => startCall(otherUser.id, 'audio')}
            >
              <Phone color={colors.text} size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => startCall(otherUser.id, 'video')}
            >
              <Video color={colors.text} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MoreVertical color={colors.text} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          {replyToMessage && (
            <View style={styles.replyPreview}>
              <Text style={styles.replyPreviewText}>الرد على رسالة</Text>
              <TouchableOpacity onPress={() => setReplyToMessage(null)}>
                <Text style={styles.cancelReply}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton} onPress={handleImagePicker}>
              <Paperclip color={colors.textSecondary} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachButton} onPress={handleCameraPicker}>
              <Camera color={colors.textSecondary} size={20} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              placeholder='اكتب رسالة...'
              placeholderTextColor={colors.textSecondary}
              value={messageText}
              onChangeText={handleTextChange}
              multiline
              maxLength={1000}
            />
            
            {messageText.trim() ? (
              <View style={styles.sendButtons}>
                <TouchableOpacity 
                  style={styles.tempButton} 
                  onPress={handleSendTemporary}
                >
                  <Clock color={colors.textSecondary} size={16} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Send color={colors.white} size={18} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
              >
                {isRecording ? (
                  <MicOff color={colors.white} size={20} />
                ) : (
                  <Mic color={colors.textSecondary} size={20} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Message Options Modal */}
        <Modal
          visible={showMessageOptions}
          transparent={true}
          animationType='fade'
          onRequestClose={() => setShowMessageOptions(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            onPress={() => setShowMessageOptions(false)}
          >
            <View style={styles.messageOptionsContainer}>
              <TouchableOpacity style={styles.optionButton} onPress={handleReplyToMessage}>
                <Reply color={colors.text} size={20} />
                <Text style={styles.optionText}>رد</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton}>
                <Copy color={colors.text} size={20} />
                <Text style={styles.optionText}>نسخ</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton} 
                onPress={() => handleDeleteMessage('sender')}
              >
                <Trash2 color={colors.text} size={20} />
                <Text style={styles.optionText}>حذف لي</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton} 
                onPress={() => handleDeleteMessage('everyone')}
              >
                <Trash2 color='#FF4444' size={20} />
                <Text style={[styles.optionText, { color: '#FF4444' }]}>حذف للجميع</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  deletedMessage: {
    backgroundColor: colors.border,
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.text,
  },
  deletedText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  messageStatus: {
    marginLeft: 4,
  },
  replyContainer: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 8,
    marginBottom: 4,
  },
  replyText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  replyPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyPreviewText: {
    color: colors.text,
    fontSize: 14,
  },
  cancelReply: {
    color: colors.primary,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
  },
  sendButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  tempButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageOptionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginTop: 50,
  },
});