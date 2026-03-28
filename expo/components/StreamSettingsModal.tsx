import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Settings,
  RotateCcw,
  Bell,
  Users,
  MessageCircle,
  Gift,
  Ban,
  Shield,
  UserCheck,
  Volume2,
  Package,
  UserPlus,
  UserX,
  Headphones,
} from 'lucide-react-native';

interface StreamSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const StreamSettingsModal: React.FC<StreamSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const [allowComments, setAllowComments] = useState<boolean>(true);
  const [allowUpdates, setAllowUpdates] = useState<boolean>(true);
  const [allowMultipleGuests, setAllowMultipleGuests] = useState<boolean>(true);
  const [allowQuestions, setAllowQuestions] = useState<boolean>(true);
  const [muteGifts, setMuteGifts] = useState<boolean>(false);
  const [allowGiftSupport, setAllowGiftSupport] = useState<boolean>(true);
  const [allowLuckybox, setAllowLuckybox] = useState<boolean>(true);

  const SettingItem = ({
    title,
    icon,
    value,
    onValueChange,
    hasSwitch = true,
    hasArrow = false,
    onPress,
  }: {
    title: string;
    icon: React.ReactNode;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    hasSwitch?: boolean;
    hasArrow?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!hasArrow && !onPress}
    >
      <Text style={styles.settingTitle}>{title}</Text>
      <View style={styles.settingRight}>
        {hasSwitch && value !== undefined && onValueChange && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#48484a', true: '#9C27B0' }}
            thumbColor={value ? '#ffffff' : '#f4f3f4'}
            style={styles.switch}
          />
        )}
        {hasArrow && (
          <View style={styles.arrowContainer}>
            {icon}
            <ChevronLeft size={16} color="#8e8e93" style={styles.chevron} />
          </View>
        )}
        {!hasSwitch && !hasArrow && icon}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>الإعدادات</Text>
            <ChevronRight size={20} color="#8e8e93" />
          </View>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          هذه الإعدادات تنطبق على جميع غرف البث المباشر
        </Text>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Comment Settings */}
          <SettingItem
            title="إعدادات التعليقات"
            icon={<Settings size={20} color="#8e8e93" />}
            hasSwitch={false}
            hasArrow={true}
            onPress={() => console.log('إعدادات التعليقات')}
          />

          {/* Allow for All */}
          <SettingItem
            title="السماح للجميع"
            icon={<Users size={20} color="#8e8e93" />}
            hasSwitch={false}
            hasArrow={true}
            onPress={() => console.log('السماح للجميع')}
          />

          {/* Add Stream Subscriber */}
          <SettingItem
            title="إضافة الستريمر المُشترك"
            icon={<UserPlus size={20} color="#8e8e93" />}
            hasSwitch={false}
            hasArrow={true}
            onPress={() => console.log('إضافة الستريمر المشترك')}
          />

          {/* Allow Updates */}
          <SettingItem
            title="السماح بتلقي التحديثات"
            icon={<Bell size={20} color="#9C27B0" />}
            value={allowUpdates}
            onValueChange={setAllowUpdates}
          />

          {/* Allow Multiple Guests */}
          <SettingItem
            title="السماح بتعدد الضيوف"
            icon={<Users size={20} color="#9C27B0" />}
            value={allowMultipleGuests}
            onValueChange={setAllowMultipleGuests}
          />

          {/* Allow Questions */}
          <SettingItem
            title="السماح للمتابعين بكتابة أسئلتهم"
            icon={<MessageCircle size={20} color="#9C27B0" />}
            value={allowQuestions}
            onValueChange={setAllowQuestions}
          />

          {/* Mute Gifts */}
          <SettingItem
            title="إلغاء كتم صوت الهدايا"
            icon={<Volume2 size={20} color="#9C27B0" />}
            value={muteGifts}
            onValueChange={setMuteGifts}
          />

          {/* Allow Gift Support */}
          <SettingItem
            title="السماح بدعم الهدايا"
            icon={<Gift size={20} color="#9C27B0" />}
            value={allowGiftSupport}
            onValueChange={setAllowGiftSupport}
          />

          {/* Allow Luckybox */}
          <SettingItem
            title='السماح بخاصية "Luckybox"'
            icon={<Package size={20} color="#9C27B0" />}
            value={allowLuckybox}
            onValueChange={setAllowLuckybox}
          />

          {/* Blocked from Comments */}
          <SettingItem
            title="الممنوعين من التعليقات"
            icon={<UserX size={20} color="#8e8e93" />}
            hasSwitch={false}
            hasArrow={true}
            onPress={() => console.log('الممنوعين من التعليقات')}
          />

          {/* Blocked Accounts */}
          <SettingItem
            title="حسابات محظورة"
            icon={<Shield size={20} color="#8e8e93" />}
            hasSwitch={false}
            hasArrow={true}
            onPress={() => console.log('حسابات محظورة')}
          />

          {/* Moderators */}
          <SettingItem
            title="المشرفين"
            icon={<UserCheck size={20} color="#8e8e93" />}
            hasSwitch={false}
            hasArrow={true}
            onPress={() => console.log('المشرفين')}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#48484a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'right',
    paddingHorizontal: 20,
    paddingVertical: 12,
    lineHeight: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    textAlign: 'right',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 8,
  },
});

export default StreamSettingsModal;