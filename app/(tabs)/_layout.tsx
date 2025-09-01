import { Tabs } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react-native";
import colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 0.5,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen 
          name="discover" 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Search size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen 
          name="create" 
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.createButton}>
                <Plus size={24} color={colors.background} strokeWidth={2.5} />
              </View>
            ),
          }}
        />
        <Tabs.Screen 
          name="inbox" 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MessageCircle size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: colors.white,
    width: 40,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});