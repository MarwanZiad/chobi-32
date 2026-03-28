import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from "react-native";
import { 
  X, 
  Upload, 
  Video, 
  Image as ImageIcon,
  Music,
  Settings,
  Eye,
  Users
} from "lucide-react-native";
import { useRouter } from "expo-router";
import colors from "@/constants/colors";

export default function VideoUploadScreen() {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hashtags, setHashtags] = useState<string>("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [selectedVideo, setSelectedVideo] = useState<boolean>(false);

  const handleClose = () => {
    // Navigate to main menu instead of just going back
    router.push('/(tabs)/');
  };

  const selectVideo = () => {
    setSelectedVideo(true);
  };

  const uploadVideo = () => {
    console.log("Uploading video...");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X color={colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>رفع فيديو</Text>
        <TouchableOpacity 
          onPress={uploadVideo}
          style={[styles.uploadButton, !selectedVideo && styles.disabledButton]}
          disabled={!selectedVideo}
        >
          <Text style={styles.uploadButtonText}>نشر</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختر الفيديو</Text>
          <TouchableOpacity 
            style={[styles.videoSelector, selectedVideo && styles.videoSelected]}
            onPress={selectVideo}
          >
            {selectedVideo ? (
              <View style={styles.selectedVideoContainer}>
                <Video color={colors.primary} size={40} />
                <Text style={styles.selectedVideoText}>تم اختيار الفيديو</Text>
              </View>
            ) : (
              <View style={styles.uploadContainer}>
                <Upload color={colors.tabInactive} size={40} />
                <Text style={styles.uploadText}>اضغط لاختيار فيديو</Text>
                <Text style={styles.uploadSubtext}>من معرض الصور</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Video Details */}
        {selectedVideo && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>عنوان الفيديو</Text>
              <TextInput
                style={styles.textInput}
                placeholder="أدخل عنوان الفيديو..."
                placeholderTextColor={colors.tabInactive}
                value={title}
                onChangeText={setTitle}
                multiline
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الوصف</Text>
              <TextInput
                style={[styles.textInput, styles.descriptionInput]}
                placeholder="أدخل وصف الفيديو..."
                placeholderTextColor={colors.tabInactive}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الهاشتاغات</Text>
              <TextInput
                style={styles.textInput}
                placeholder="#مثال #فيديو #محتوى"
                placeholderTextColor={colors.tabInactive}
                value={hashtags}
                onChangeText={setHashtags}
              />
            </View>

            {/* Privacy Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>إعدادات الخصوصية</Text>
              <View style={styles.privacyOptions}>
                <TouchableOpacity 
                  style={[styles.privacyOption, privacy === "public" && styles.selectedPrivacy]}
                  onPress={() => setPrivacy("public")}
                >
                  <Users color={privacy === "public" ? colors.primary : colors.tabInactive} size={20} />
                  <Text style={[styles.privacyText, privacy === "public" && styles.selectedPrivacyText]}>
                    عام
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.privacyOption, privacy === "private" && styles.selectedPrivacy]}
                  onPress={() => setPrivacy("private")}
                >
                  <Eye color={privacy === "private" ? colors.primary : colors.tabInactive} size={20} />
                  <Text style={[styles.privacyText, privacy === "private" && styles.selectedPrivacyText]}>
                    خاص
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Additional Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>خيارات إضافية</Text>
              
              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <ImageIcon color={colors.white} size={20} />
                  <Text style={styles.optionText}>إضافة صورة مصغرة</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <Music color={colors.white} size={20} />
                  <Text style={styles.optionText}>إضافة موسيقى</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <Settings color={colors.white} size={20} />
                  <Text style={styles.optionText}>إعدادات متقدمة</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  closeButton: {
    padding: 5,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: colors.tabInactive,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  videoSelector: {
    backgroundColor: "#2A2A2A",
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    borderStyle: "dashed",
  },
  videoSelected: {
    borderColor: colors.primary,
    backgroundColor: "#1A1A2E",
  },
  uploadContainer: {
    alignItems: "center",
  },
  uploadText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  uploadSubtext: {
    color: colors.tabInactive,
    fontSize: 14,
    marginTop: 5,
  },
  selectedVideoContainer: {
    alignItems: "center",
  },
  selectedVideoText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  textInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 15,
    color: colors.white,
    fontSize: 16,
    textAlignVertical: "top",
  },
  descriptionInput: {
    height: 100,
  },
  privacyOptions: {
    flexDirection: "row",
    gap: 15,
  },
  privacyOption: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPrivacy: {
    borderColor: colors.primary,
    backgroundColor: "#1A1A2E",
  },
  privacyText: {
    color: colors.tabInactive,
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedPrivacyText: {
    color: colors.primary,
  },
  optionItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  optionText: {
    color: colors.white,
    fontSize: 16,
  },
});