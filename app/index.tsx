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

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking profile:', error);
        // On error, go to main app with basic profile
        await createBasicProfile(session.user.id);
        router.replace('/(tabs)');
        return;
      }

      if (!profile) {
        // No profile found, create basic profile and go to main app
        await createBasicProfile(session.user.id);
        router.replace('/(tabs)');
        return;
      }

      // Profile exists, go to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // On any error, create basic profile and continue to main app
      if (session?.user?.id) {
        await createBasicProfile(session.user.id);
      }
      router.replace('/(tabs)');
    }
  };

  const createBasicProfile = async (userId: string) => {
    try {
      const defaultName = session?.user?.email?.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') || 'User';
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: session?.user?.email || '',
          name: defaultName,
          age: 25,
          location: 'New York, NY',
          bio: 'Welcome to my profile!',
          interests: ['Photography', 'Travel', 'Coffee'],
          images: ['https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400'],
          superlikes_count: 5,
        }, {
          onConflict: 'id'
        });

      if (!profileError) {
        // Create wallet with initial balance
        await supabase
          .from('wallets')
          .upsert({
            user_id: userId,
            balance: 100
          }, {
            onConflict: 'user_id'
          });

        // Add welcome transaction
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: userId,
            amount: 100,
            description: 'Welcome bonus',
            transaction_type: 'credit'
          });
      }
    } catch (error) {
      console.error('Error creating basic profile:', error);
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