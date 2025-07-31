import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Calendar, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MIN_AGE = 18;
const MAX_AGE = 100;

export default function DateOfBirthScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedDate();
  }, []);

  const loadSavedDate = async () => {
    try {
      const savedDate = await AsyncStorage.getItem('onboarding_birthdate');
      if (savedDate) {
        setSelectedDate(new Date(savedDate));
      }
    } catch (error) {
      console.error('Error loading saved date:', error);
    }
  };

  const saveDateData = async (date: Date) => {
    try {
      await AsyncStorage.setItem('onboarding_birthdate', date.toISOString());
    } catch (error) {
      console.error('Error saving date data:', error);
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

  const validateAge = (date: Date): string | null => {
    const age = calculateAge(date);
    
    if (age < MIN_AGE) {
      return `You must be at least ${MIN_AGE} years old to use this app.`;
    }
    
    if (age > MAX_AGE) {
      return 'Please enter a valid birth date.';
    }
    
    return null;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (date) {
      const validationError = validateAge(date);
      setError(validationError);
      
      if (!validationError) {
        setSelectedDate(date);
        saveDateData(date);
      }
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContinue = () => {
    if (!selectedDate) {
      setError('Please select your date of birth.');
      return;
    }

    const validationError = validateAge(selectedDate);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    router.push('/onboarding/interests');
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Date of Birth?',
      'Your age helps us find better matches. Are you sure you want to skip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          style: 'destructive',
          onPress: () => router.push('/onboarding/interests')
        }
      ]
    );
  };

  const getMaxDate = (): Date => {
    const today = new Date();
    return new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
  };

  const getMinDate = (): Date => {
    const today = new Date();
    return new Date(today.getFullYear() - MAX_AGE, 0, 1);
  };

  const age = selectedDate ? calculateAge(selectedDate) : null;
  const isValid = selectedDate && !error;

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
              style={[styles.progressFill, { width: '40%' }]}
            />
          </View>
          <Text style={styles.progressText}>2 of 5</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>When's Your Birthday?</Text>
        <Text style={styles.subtitle}>
          Your age will be displayed on your profile. You must be at least {MIN_AGE} to use this app.
        </Text>

        {/* Date Display */}
        <TouchableOpacity
          style={[
            styles.dateButton,
            selectedDate && styles.dateButtonSelected,
            error && styles.dateButtonError
          ]}
          onPress={() => setShowPicker(true)}
        >
          <Calendar size={24} color={selectedDate ? "#E94E87" : "#9CA3AF"} />
          <View style={styles.dateContent}>
            <Text style={[
              styles.dateText,
              selectedDate && styles.dateTextSelected
            ]}>
              {selectedDate ? formatDate(selectedDate) : 'Select your birth date'}
            </Text>
            {age && (
              <Text style={styles.ageText}>Age: {age}</Text>
            )}
          </View>
          {isValid && (
            <CheckCircle size={24} color="#10B981" />
          )}
        </TouchableOpacity>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Age Requirements */}
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Age Requirements</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <View style={[
                styles.requirementDot,
                age && age >= MIN_AGE && styles.requirementDotMet
              ]} />
              <Text style={[
                styles.requirementText,
                age && age >= MIN_AGE && styles.requirementTextMet
              ]}>
                Must be {MIN_AGE} or older
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <View style={[
                styles.requirementDot,
                selectedDate && styles.requirementDotMet
              ]} />
              <Text style={[
                styles.requirementText,
                selectedDate && styles.requirementTextMet
              ]}>
                Valid birth date required
              </Text>
            </View>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Privacy Notice</Text>
          <Text style={styles.privacyText}>
            Your exact birth date is kept private. Only your age will be shown to other users on your profile.
          </Text>
        </View>

        {/* Date Picker */}
        {showPicker && (
          <DateTimePicker
            value={selectedDate || getMaxDate()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={getMaxDate()}
            minimumDate={getMinDate()}
            style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
          />
        )}

        {Platform.OS === 'ios' && showPicker && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setShowPicker(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            isValid ? styles.continueButtonActive : styles.continueButtonInactive
          ]}
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text style={[
            styles.continueButtonText,
            isValid ? styles.continueButtonTextActive : styles.continueButtonTextInactive
          ]}>
            Continue
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
    marginBottom: 32,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    gap: 16,
  },
  dateButtonSelected: {
    borderColor: '#E94E87',
    backgroundColor: '#FEF2F2',
  },
  dateButtonError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  dateContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
  },
  dateTextSelected: {
    color: '#1F2937',
  },
  ageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E94E87',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    flex: 1,
  },
  requirementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requirementsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requirementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  requirementDotMet: {
    backgroundColor: '#10B981',
  },
  requirementText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  requirementTextMet: {
    color: '#10B981',
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
  iosPicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: '#E94E87',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 20,
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