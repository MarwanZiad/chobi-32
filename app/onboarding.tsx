import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, Play, Users, Star, Gift } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth-store';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'مرحباً بك في Chobi Live',
    subtitle: 'تطبيق البث المباشر الأول',
    description: 'اكتشف عالماً جديداً من البث المباشر والتفاعل مع المبدعين من جميع أنحاء العالم',
    icon: Play,
    color: '#ff6b6b',
  },
  {
    id: 2,
    title: 'تواصل مع المجتمع',
    subtitle: 'انضم إلى ملايين المستخدمين',
    description: 'تفاعل مع البثوث المباشرة، شارك في المحادثات، وكوّن صداقات جديدة',
    icon: Users,
    color: '#4ecdc4',
  },
  {
    id: 3,
    title: 'اكسب النجوم والهدايا',
    subtitle: 'نظام مكافآت مميز',
    description: 'احصل على النجوم من خلال التفاعل وأرسل الهدايا لمبدعيك المفضلين',
    icon: Gift,
    color: '#45b7d1',
  },
  {
    id: 4,
    title: 'كن نجماً',
    subtitle: 'ابدأ بثك الخاص',
    description: 'شارك مواهبك مع العالم وابني جمهورك الخاص من المتابعين المخلصين',
    icon: Star,
    color: '#f9ca24',
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { completeOnboarding } = useAuth();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      
      // Animate fade out and in
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await completeOnboarding();
    router.replace('/auth/login');
  };

  const handleDotPress = (index: number) => {
    setCurrentSlide(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={[styles.slide, { width }]}>
      <Animated.View style={[styles.slideContent, { opacity: fadeAnim }]}>
        <View style={[styles.iconContainer, { backgroundColor: slide.color + '20' }]}>
          <slide.icon size={80} color={slide.color} />
        </View>
        
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={[styles.subtitle, { color: slide.color }]}>{slide.subtitle}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </Animated.View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentSlide ? slides[currentSlide].color : '#333',
              width: index === currentSlide ? 24 : 8,
            },
          ]}
          onPress={() => handleDotPress(index)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>تخطي</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slideIndex);
        }}
        scrollEventThrottle={16}
      >
        {slides.map(renderSlide)}
      </ScrollView>

      <View style={styles.footer}>
        {renderDots()}
        
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: slides[currentSlide].color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'ابدأ الآن' : 'التالي'}
          </Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});