import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Camera, 
  Edit3,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Link
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

export default function EditProfileScreen() {
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: 'مروان',
    username: 'marwan',
    email: 'marwan@example.com',
    phone: '+966501234567',
    bio: 'مطور تطبيقات | محب للتكنولوجيا',
    location: 'الرياض، السعودية',
    website: 'https://marwan.dev',
    birthDate: '1995-05-15',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  });

  const handleSave = () => {
    Alert.alert(
      'حفظ التغييرات',
      'تم حفظ التغييرات بنجاح',
      [{ text: 'موافق', onPress: () => router.back() }]
    );
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'تغيير الصورة الشخصية',
      'اختر مصدر الصورة',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'الكاميرا', onPress: () => console.log('Camera') },
        { text: 'المعرض', onPress: () => console.log('Gallery') },
      ]
    );
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    IconComponent: any,
    placeholder?: string,
    multiline?: boolean
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputHeader}>
        <IconComponent color={colors.primary} size={20} />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.textInput, multiline && styles.textInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>
        
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Save color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profileData.avatar }}
              style={styles.avatar}
              contentFit='cover'
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleChangeAvatar}>
              <Camera color={colors.white} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>تغيير الصورة الشخصية</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {renderInputField(
            'الاسم',
            profileData.name,
            (text) => setProfileData({ ...profileData, name: text }),
            User,
            'أدخل اسمك'
          )}

          {renderInputField(
            'اسم المستخدم',
            profileData.username,
            (text) => setProfileData({ ...profileData, username: text }),
            Edit3,
            'أدخل اسم المستخدم'
          )}

          {renderInputField(
            'البريد الإلكتروني',
            profileData.email,
            (text) => setProfileData({ ...profileData, email: text }),
            Mail,
            'أدخل بريدك الإلكتروني'
          )}

          {renderInputField(
            'رقم الهاتف',
            profileData.phone,
            (text) => setProfileData({ ...profileData, phone: text }),
            Phone,
            'أدخل رقم هاتفك'
          )}

          {renderInputField(
            'النبذة الشخصية',
            profileData.bio,
            (text) => setProfileData({ ...profileData, bio: text }),
            Edit3,
            'اكتب نبذة عن نفسك',
            true
          )}

          {renderInputField(
            'الموقع',
            profileData.location,
            (text) => setProfileData({ ...profileData, location: text }),
            MapPin,
            'أدخل موقعك'
          )}

          {renderInputField(
            'الموقع الإلكتروني',
            profileData.website,
            (text) => setProfileData({ ...profileData, website: text }),
            Link,
            'أدخل رابط موقعك'
          )}

          {renderInputField(
            'تاريخ الميلاد',
            profileData.birthDate,
            (text) => setProfileData({ ...profileData, birthDate: text }),
            Calendar,
            'YYYY-MM-DD'
          )}
        </View>

        {/* Privacy Settings */}
        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>إعدادات الخصوصية</Text>
          
          <TouchableOpacity style={styles.privacyItem}>
            <Text style={styles.privacyText}>حساب خاص</Text>
            <View style={styles.switchContainer}>
              <View style={styles.switch} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.privacyItem}>
            <Text style={styles.privacyText}>إظهار الحالة النشطة</Text>
            <View style={styles.switchContainer}>
              <View style={[styles.switch, styles.switchActive]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSave}>
          <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
        </TouchableOpacity>
      </ScrollView>
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
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.surface,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  changePhotoText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  privacySection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
  },
  privacyText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  switchContainer: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
  switchActive: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  saveButtonLarge: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});