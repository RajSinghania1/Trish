import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { session, loading } = useAuth();

  const checkOnboardingStatus = async () => {
    if (!session?.user?.id) return;

    try {
      // Check if user has completed onboarding
      const onboardingComplete = await AsyncStorage.getItem('onboarding_complete');
      
      // Check if user has a complete profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking profile:', error);
        // On error, start onboarding
        router.replace('/onboarding/photo-upload');
        return;
      }

      // If no profile exists or onboarding not complete, start onboarding
      if (!profile || !onboardingComplete) {
        router.replace('/onboarding/photo-upload');
        return;
      }

      // Check if profile is complete (has required fields)
      const isProfileComplete = profile.name && 
                               profile.age && 
                               profile.images && 
                               profile.images.length >= 3 &&
                               profile.interests && 
                               profile.interests.length >= 5;

      if (!isProfileComplete) {
        // Profile incomplete, continue onboarding
        router.replace('/onboarding/photo-upload');
        return;
      }

      // Profile complete, go to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // On any error, start onboarding to be safe
      router.replace('/onboarding/photo-upload');
    }
  };

  useEffect(() => {
    if (!loading) {
      if (session) {
        checkOnboardingStatus();
      } else {
        router.replace('/splash');
      }
    }
  }, [session, loading]);

  // Show loading screen while checking auth state
  if (loading) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});