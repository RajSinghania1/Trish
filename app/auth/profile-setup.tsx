import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Camera, Calendar } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const steps = [
    { title: 'Profile details', subtitle: 'Add your basic information' },
    { title: 'I am a', subtitle: 'Select your gender' },
    { title: 'Your interests', subtitle: 'What are you passionate about?' },
    { title: 'Find friends', subtitle: 'Connect with like-minded people' },
    { title: 'Notifications', subtitle: 'Stay updated with matches' },
  ];

  const genderOptions = ['Woman', 'Man', 'Choose another'];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSkip = () => {
    if (currentStep === steps.length - 1) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    
    try {
      // Redirect to comprehensive onboarding instead
      router.replace('/onboarding/photo-upload');
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First name</Text>
              <TextInput
                style={styles.input}
                value={profileData.firstName}
                onChangeText={(text) => setProfileData({ ...profileData, firstName: text })}
                placeholder="David"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last name</Text>
              <TextInput
                style={styles.input}
                value={profileData.lastName}
                onChangeText={(text) => setProfileData({ ...profileData, lastName: text })}
                placeholder="Peterson"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity style={styles.birthdayButton}>
              <Calendar size={20} color="#E94E87" />
              <Text style={styles.birthdayButtonText}>Choose birthday date</Text>
            </TouchableOpacity>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.genderOptions}>
              {genderOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.genderOption,
                    profileData.gender === option && styles.genderOptionSelected
                  ]}
                  onPress={() => setProfileData({ ...profileData, gender: option })}
                >
                  <Text style={[
                    styles.genderOptionText,
                    profileData.gender === option && styles.genderOptionTextSelected
                  ]}>
                    {option}
                  </Text>
                  {profileData.gender === option && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.comingSoon}>Coming Soon</Text>
            <Text style={styles.comingSoonSubtitle}>
              This feature will be available in the next update
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{steps[currentStep].title}</Text>
        
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (currentStep === 0 && (!profileData.firstName || !profileData.lastName)) ||
            (currentStep === 1 && !profileData.gender)
              ? styles.continueButtonInactive
              : styles.continueButtonActive
          ]}
          onPress={handleNext}
          disabled={
            isLoading ||
            (currentStep === 0 && (!profileData.firstName || !profileData.lastName)) ||
            (currentStep === 1 && !profileData.gender)
          }
        >
          <Text style={[
            styles.continueButtonText,
            (currentStep === 0 && (!profileData.firstName || !profileData.lastName)) ||
            (currentStep === 1 && !profileData.gender)
              ? styles.continueButtonTextInactive
              : styles.continueButtonTextActive
          ]}>
            {isLoading ? 'Setting up...' : currentStep === steps.length - 1 ? 'Confirm' : 'Continue'}
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  skipText: {
    fontSize: 16,
    color: '#E94E87',
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 40,
  },
  stepContainer: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImagePlaceholder: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E94E87',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  birthdayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  birthdayButtonText: {
    fontSize: 16,
    color: '#E94E87',
    fontFamily: 'Inter-SemiBold',
  },
  genderOptions: {
    gap: 16,
  },
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  genderOptionSelected: {
    backgroundColor: '#E94E87',
    borderColor: '#E94E87',
  },
  genderOptionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  genderOptionTextSelected: {
    color: '#FFFFFF',
  },
  checkmark: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  comingSoon: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoonSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#E94E87',
  },
  continueButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  continueButtonTextActive: {
    color: '#FFFFFF',
  },
  continueButtonTextInactive: {
    color: '#9CA3AF',
  },
});