import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { session, loading } = useAuth();

  const checkOnboardingStatus = async () => {
    if (!session?.user?.id) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, age, interests, images')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error || !profile) {
        // No profile found, redirect to onboarding
        router.replace('/onboarding/photo-upload');
        return;
      }

      // Check if profile is complete
      const isComplete = profile.name && 
                        profile.age && 
                        profile.interests?.length >= 3 && 
                        profile.images?.length >= 3;

      if (isComplete) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/photo-upload');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      router.replace('/onboarding/photo-upload');
    }
  };

  useEffect(() => {
    // On web, we need to be more aggressive about navigation
    const shouldNavigate = Platform.OS === 'web' ? !loading : (rootNavigationState?.key && !loading);
    
    if (shouldNavigate) {
      if (session) {
        // Check if user has completed onboarding
        checkOnboardingStatus();
      } else {
        // User is not authenticated, go to splash/onboarding
        router.replace('/splash');
      }
    }
  }, [rootNavigationState?.key, session, loading]);

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