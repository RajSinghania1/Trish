import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { Heart, Sparkles, Users, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function OnboardingCompleteScreen() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleComplete = async () => {
    if (!user?.id) return;

    setLoading(true);
    
    try {
      // Load all onboarding data
      const [photosData, birthDate, interestsData, notificationSettings] = await Promise.all([
        AsyncStorage.getItem('onboarding_photos'),
        AsyncStorage.getItem('onboarding_birthdate'),
        AsyncStorage.getItem('onboarding_interests'),
        AsyncStorage.getItem('onboarding_notifications')
      ]);

      const photos = photosData ? JSON.parse(photosData) : [];
      const interests = interestsData ? JSON.parse(interestsData) : [];
      const birthDateObj = birthDate ? new Date(birthDate) : null;
      const age = birthDateObj ? calculateAge(birthDateObj) : null;

      // Generate a default name from email
      const defaultName = user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') || 'User';

      // Create user profile with complete onboarding data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          name: defaultName,
          age: age,
          location: 'New York, NY', // Default location
          bio: '',
          interests: interests.map((interest: any) => interest.name),
          images: photos.map((photo: any) => photo.uri),
          superlikes_count: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        Alert.alert('Error', 'Failed to create profile. Please try again.');
        return;
      }

      // Create wallet with initial balance
      const { error: walletError } = await supabase
        .from('wallets')
        .upsert({
          user_id: user.id,
          balance: 100 // Welcome bonus
        }, {
          onConflict: 'user_id'
        });

      if (walletError) {
        console.error('Error creating wallet:', walletError);
        // Don't block completion for wallet error, just log it
      }

      // Add welcome transaction
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          amount: 100,
          description: 'Welcome bonus',
          transaction_type: 'credit'
        });

      // Clear onboarding data from AsyncStorage
      await clearOnboardingData();

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const clearOnboardingData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('onboarding_photos'),
        AsyncStorage.removeItem('onboarding_birthdate'),
        AsyncStorage.removeItem('onboarding_interests'),
        AsyncStorage.removeItem('onboarding_notifications')
      ]);
    } catch (error) {
      console.error('Error clearing onboarding data:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#E94E87', '#D946EF', '#8B5CF6']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Celebration Animation Area */}
        <View style={styles.celebrationContainer}>
          <View style={styles.sparkleContainer}>
            <Sparkles size={32} color="#FFFFFF" style={styles.sparkle1} />
            <Sparkles size={24} color="rgba(255, 255, 255, 0.8)" style={styles.sparkle2} />
            <Sparkles size={28} color="rgba(255, 255, 255, 0.6)" style={styles.sparkle3} />
          </View>
          
          <View style={styles.mainIcon}>
            <LinearGradient
              colors={['#FFFFFF', 'rgba(255, 255, 255, 0.9)']}
              style={styles.iconCircle}
            >
              <Heart size={48} color="#E94E87" fill="#E94E87" />
            </LinearGradient>
          </View>
        </View>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>You're All Set! 🎉</Text>
          <Text style={styles.subtitle}>
            Welcome to Trish! Your profile is ready and you're about to discover amazing connections.
          </Text>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Users size={24} color="#FFFFFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Matching</Text>
              <Text style={styles.featureDescription}>
                Find people who share your interests
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <MessageCircle size={24} color="#FFFFFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real Conversations</Text>
              <Text style={styles.featureDescription}>
                Connect through meaningful messages
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Heart size={24} color="#FFFFFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Genuine Connections</Text>
              <Text style={styles.featureDescription}>
                Build relationships that matter
              </Text>
            </View>
          </View>
        </View>

        {/* Welcome Bonus */}
        <View style={styles.bonusContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.bonusCard}
          >
            <Sparkles size={20} color="#FFFFFF" />
            <Text style={styles.bonusText}>
              Welcome Bonus: 100 Points Added! 🎁
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleComplete}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>
              {loading ? 'Setting up your profile...' : 'Start Exploring'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Ready to find your perfect match?
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    alignItems: 'center',
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: 30,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 40,
    left: 20,
  },
  sparkle3: {
    position: 'absolute',
    top: 60,
    left: 40,
  },
  mainIcon: {
    marginTop: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  bonusContainer: {
    width: '100%',
    marginBottom: 20,
  },
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bonusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#E94E87',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});