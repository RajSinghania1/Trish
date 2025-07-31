import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Trish',
    description: 'Connect with verified users through our secure matching system designed for meaningful relationships.',
    color: '#E94E87',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Matches',
    description: 'Get better matches with people who have similar interests and goals.',
    color: '#8B5CF6',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Premium',
    description: 'Unlock premium features to enhance your dating experience.',
    color: '#D946EF',
  },
];

export default function OnboardingIndex() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const currentItem = onboardingData[currentIndex];

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/auth');
    }
  };

  const handleSkip = () => {
    router.push('/auth');
  };

  return (
    <View style={styles.container}>
      {/* Background Images */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.backgroundCard, styles.leftCard]}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
            style={styles.backgroundImage} 
          />
        </View>
        <View style={[styles.backgroundCard, styles.rightCard]}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
            style={styles.backgroundImage} 
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.mainCard}>
          <Image source={{ uri: currentItem.image }} style={styles.mainImage} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: currentItem.color }]}>
            {currentItem.title}
          </Text>
          <Text style={styles.description}>
            {currentItem.description}
          </Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
                index === currentIndex && { backgroundColor: currentItem.color }
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: currentItem.color }]}
          onPress={handleNext}
        >
          <Text style={styles.actionButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Create an account' : 'Continue'}
          </Text>
        </TouchableOpacity>

        {/* Bottom Text */}
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={[styles.signInText, { color: currentItem.color }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    flexDirection: 'row',
  },
  backgroundCard: {
    width: width * 0.3,
    height: height * 0.5,
    borderRadius: 20,
    overflow: 'hidden',
    opacity: 0.3,
  },
  leftCard: {
    position: 'absolute',
    left: -width * 0.15,
    top: height * 0.1,
    transform: [{ rotate: '-15deg' }],
  },
  rightCard: {
    position: 'absolute',
    right: -width * 0.15,
    top: height * 0.15,
    transform: [{ rotate: '15deg' }],
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    width: width * 0.7,
    height: width * 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
  },
  actionButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signInText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});