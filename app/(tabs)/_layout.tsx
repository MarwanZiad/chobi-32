import { Tabs } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="create" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="discover" />
        <Tabs.Screen name="events" />
      </Tabs>
    </>
  );
}