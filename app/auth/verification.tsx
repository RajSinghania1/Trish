import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function Verification() {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && index === 3) {
      handleContinue();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    router.push('/auth/profile-setup');
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/profile-setup')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>00:42</Text>
        <Text style={styles.subtitle}>
          Type the verification code we've sent you
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.codeInput,
                digit ? styles.codeInputFilled : styles.codeInputEmpty
              ]}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendText}>Send again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            isCodeComplete ? styles.continueButtonActive : styles.continueButtonInactive
          ]}
          onPress={handleContinue}
          disabled={!isCodeComplete}
        >
          <Text style={[
            styles.continueButtonText,
            isCodeComplete ? styles.continueButtonTextActive : styles.continueButtonTextInactive
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
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 60,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    borderWidth: 2,
  },
  codeInputEmpty: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  codeInputFilled: {
    backgroundColor: '#E94E87',
    borderColor: '#E94E87',
    color: '#FFFFFF',
  },
  resendButton: {
    marginBottom: 60,
  },
  resendText: {
    fontSize: 16,
    color: '#E94E87',
    fontFamily: 'Inter-SemiBold',
  },
  continueButton: {
    width: '100%',
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