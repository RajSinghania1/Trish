import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Bell, Heart, MessageCircle, Gift, Star, Settings, CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  color: string;
}

export default function NotificationsScreen() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'matches',
      title: 'New Matches',
      description: 'Get notified when someone likes you back',
      icon: Heart,
      enabled: true,
      color: '#E94E87'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Never miss a message from your matches',
      icon: MessageCircle,
      enabled: true,
      color: '#3B82F6'
    },
    {
      id: 'gifts',
      title: 'Gifts',
      description: 'Know when someone sends you a gift',
      icon: Gift,
      enabled: true,
      color: '#8B5A3C'
    },
    {
      id: 'likes',
      title: 'Likes',
      description: 'See who liked your profile',
      icon: Star,
      enabled: false,
      color: '#F59E0B'
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Special offers and app updates',
      icon: Bell,
      enabled: false,
      color: '#8B5CF6'
    }
  ]);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionGranted(status === 'granted');
  };

  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: false,
        },
      });

      setPermissionGranted(status === 'granted');

      if (status === 'granted') {
        // Configure notification behavior
        await Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
      } else {
        Alert.alert(
          'Notifications Disabled',
          'You can enable notifications later in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      Alert.alert('Error', 'Failed to request notification permission.');
    }
  };

  const toggleNotificationSetting = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleSkip = () => {
    router.push('/onboarding/complete');
  };

  const handleContinue = () => {
    if (permissionGranted === null) {
      // Permission not yet requested
      requestNotificationPermission().then(() => {
        router.push('/onboarding/complete');
      });
    } else {
      router.push('/onboarding/complete');
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Open Settings',
        'Go to Settings > Notifications > Trish to manage notification preferences.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Open Settings',
        'Go to Settings > Apps > Trish > Notifications to manage notification preferences.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#E94E87', '#FF6B9D']}
              style={[styles.progressFill, { width: '80%' }]}
            />
          </View>
          <Text style={styles.progressText}>4 of 5</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Stay Connected</Text>
        <Text style={styles.subtitle}>
          Enable notifications to never miss a match, message, or special moment.
        </Text>

        {/* Permission Status */}
        <View style={[
          styles.permissionCard,
          permissionGranted === true && styles.permissionCardGranted,
          permissionGranted === false && styles.permissionCardDenied
        ]}>
          <View style={styles.permissionHeader}>
            <View style={[
              styles.permissionIcon,
              permissionGranted === true && styles.permissionIconGranted,
              permissionGranted === false && styles.permissionIconDenied
            ]}>
              {permissionGranted === true ? (
                <CheckCircle size={24} color="#10B981" />
              ) : permissionGranted === false ? (
                <X size={24} color="#EF4444" />
              ) : (
                <Bell size={24} color="#E94E87" />
              )}
            </View>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>
                {permissionGranted === true 
                  ? 'Notifications Enabled' 
                  : permissionGranted === false 
                    ? 'Notifications Disabled'
                    : 'Enable Notifications'
                }
              </Text>
              <Text style={styles.permissionDescription}>
                {permissionGranted === true 
                  ? 'You\'ll receive notifications based on your preferences below'
                  : permissionGranted === false 
                    ? 'You can enable notifications in your device settings'
                    : 'Allow notifications to stay updated with your matches'
                }
              </Text>
            </View>
          </View>

          {permissionGranted === false && (
            <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
              <Settings size={16} color="#E94E87" />
              <Text style={styles.settingsButtonText}>Open Settings</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why Enable Notifications?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Heart size={20} color="#E94E87" />
              <Text style={styles.benefitText}>Never miss a new match</Text>
            </View>
            <View style={styles.benefitItem}>
              <MessageCircle size={20} color="#3B82F6" />
              <Text style={styles.benefitText}>Respond to messages quickly</Text>
            </View>
            <View style={styles.benefitItem}>
              <Gift size={20} color="#8B5A3C" />
              <Text style={styles.benefitText}>Get notified about gifts</Text>
            </View>
            <View style={styles.benefitItem}>
              <Star size={20} color="#F59E0B" />
              <Text style={styles.benefitText}>Stay engaged with your connections</Text>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Notification Preferences</Text>
          <Text style={styles.settingsSubtitle}>
            Choose what notifications you'd like to receive
          </Text>

          <View style={styles.settingsList}>
            {notificationSettings.map(setting => {
              const IconComponent = setting.icon;
              return (
                <View key={setting.id} style={styles.settingItem}>
                  <View style={styles.settingContent}>
                    <View style={[styles.settingIcon, { backgroundColor: `${setting.color}20` }]}>
                      <IconComponent size={20} color={setting.color} />
                    </View>
                    <View style={styles.settingDetails}>
                      <Text style={styles.settingTitle}>{setting.title}</Text>
                      <Text style={styles.settingDescription}>{setting.description}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      setting.enabled && styles.toggleEnabled
                    ]}
                    onPress={() => toggleNotificationSetting(setting.id)}
                  >
                    <View style={[
                      styles.toggleThumb,
                      setting.enabled && styles.toggleThumbEnabled
                    ]} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 Privacy & Control</Text>
          <Text style={styles.privacyText}>
            • You can change these settings anytime in your profile{'\n'}
            • We respect your privacy and won't spam you{'\n'}
            • Notifications are sent only for meaningful interactions{'\n'}
            • You can disable all notifications in your device settings
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={['#E94E87', '#FF6B9D']}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>
              {permissionGranted === null ? 'Enable Notifications' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  permissionCardGranted: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  permissionCardDenied: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionIconGranted: {
    backgroundColor: '#DCFCE7',
  },
  permissionIconDenied: {
    backgroundColor: '#FEE2E2',
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E94E87',
    gap: 8,
  },
  settingsButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingDetails: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleEnabled: {
    backgroundColor: '#E94E87',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleThumbEnabled: {
    alignSelf: 'flex-end',
  },
  privacyCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0284C7',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});