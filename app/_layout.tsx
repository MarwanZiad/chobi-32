import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ChobiContext } from "@/hooks/use-chobi-store";
import { ChatProvider, useChat } from "@/hooks/use-chat-store";
import { AppProvider } from "@/hooks/use-app-store";
import { NotificationProvider } from "@/hooks/use-notifications";
import { AuthProvider, useAuth } from "@/hooks/use-auth-store";
import { StreamProvider } from "@/hooks/use-stream-store";
import CallScreen from "@/components/CallScreen";
import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLoggedIn, isLoading, hasCompletedOnboarding } = useAuth();

  console.log('RootLayoutNav state:', { isLoggedIn, isLoading, hasCompletedOnboarding });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="privacy-settings" options={{ headerShown: false }} />
          <Stack.Screen name="activities" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="chats" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="live-streams" options={{ headerShown: false }} />
          <Stack.Screen name="live-viewer/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="audio-viewer/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="video-stream" options={{ headerShown: false }} />
          <Stack.Screen name="audio-stream" options={{ headerShown: false }} />
          <Stack.Screen name="video-upload" options={{ headerShown: false }} />
          <Stack.Screen name="crown-stories" options={{ headerShown: false }} />
          <Stack.Screen name="pk-challenges" options={{ headerShown: false }} />
          <Stack.Screen name="room-tools-demo" options={{ headerShown: false }} />
          <Stack.Screen name="user-navigation-demo" options={{ headerShown: false }} />
          <Stack.Screen name="test-backend" options={{ headerShown: false }} />
          <Stack.Screen name="auth-debug" options={{ headerShown: false }} />
        </>
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="auth-debug" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

function CallScreenWrapper() {
  const { activeCall } = useChat();
  const [showCallScreen, setShowCallScreen] = useState<boolean>(false);

  useEffect(() => {
    setShowCallScreen(!!activeCall);
  }, [activeCall]);

  return (
    <CallScreen 
      visible={showCallScreen} 
      onClose={() => setShowCallScreen(false)} 
    />
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <NotificationProvider>
              <ChatProvider>
                <StreamProvider>
                  <ChobiContext>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <RootLayoutNav />
                      <CallScreenWrapper />
                    </GestureHandlerRootView>
                  </ChobiContext>
                </StreamProvider>
              </ChatProvider>
            </NotificationProvider>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
});