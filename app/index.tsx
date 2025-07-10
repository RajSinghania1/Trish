import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Platform } from 'react-native';

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { session, loading } = useAuth();

  useEffect(() => {
    // On web, we need to be more aggressive about navigation
    const shouldNavigate = Platform.OS === 'web' ? !loading : (rootNavigationState?.key && !loading);
    
    if (shouldNavigate) {
      if (session) {
        // User is authenticated, go to main app
        router.replace('/(tabs)');
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