import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Home, Flame, Plus as PlusIcon, Award, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import colors from "@/constants/colors";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const router = useRouter();
  
  const handleTabPress = (tab: string) => {
    onTabChange(tab);
    
    // Navigate to the appropriate screen
    switch (tab) {
      case "home":
        router.push("/(tabs)/");
        break;
      case "discover":
        router.push("/(tabs)/discover");
        break;
      case "create":
        router.push("/(tabs)/create");
        break;
      case "events":
        router.push("/(tabs)/events");
        break;
      case "profile":
        router.push("/(tabs)/profile");
        break;
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress("home")}
        testID="nav-home"
      >
        <Home color={activeTab === "home" ? colors.white : colors.tabInactive} size={24} />
        <Text style={[styles.tabText, { color: activeTab === "home" ? colors.white : colors.tabInactive }]}>الرئيسية</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress("discover")}
        testID="nav-discover"
      >
        <Flame color={activeTab === "discover" ? colors.white : colors.tabInactive} size={24} />
        <Text style={[styles.tabText, { color: activeTab === "discover" ? colors.white : colors.tabInactive }]}>اكتشف</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.centerButton}
        onPress={() => handleTabPress("create")}
        testID="nav-create"
      >
        <PlusIcon color={colors.white} size={32} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress("events")}
        testID="nav-events"
      >
        <Award color={activeTab === "events" ? colors.white : colors.tabInactive} size={24} />
        <Text style={[styles.tabText, { color: activeTab === "events" ? colors.white : colors.tabInactive }]}>الفعاليات</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress("profile")}
        testID="nav-profile"
      >
        <User color={activeTab === "profile" ? colors.white : colors.tabInactive} size={24} />
        <Text style={[styles.tabText, { color: activeTab === "profile" ? colors.white : colors.tabInactive }]}>البروفايل</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.background,
    paddingBottom: 20, // For home indicator area
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomNavigation;