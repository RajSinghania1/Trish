import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Search, Plus, X, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MIN_INTERESTS = 5;

interface Interest {
  id: string;
  name: string;
  category: string;
}

const interestCategories = {
  'Sports & Fitness': [
    'Running', 'Gym', 'Yoga', 'Swimming', 'Cycling', 'Hiking', 'Rock Climbing',
    'Tennis', 'Basketball', 'Soccer', 'Golf', 'Skiing', 'Surfing', 'Boxing'
  ],
  'Music & Arts': [
    'Live Music', 'Concerts', 'Playing Guitar', 'Piano', 'Singing', 'Dancing',
    'Painting', 'Photography', 'Drawing', 'Sculpture', 'Theater', 'Museums'
  ],
  'Food & Drink': [
    'Cooking', 'Baking', 'Wine Tasting', 'Coffee', 'Craft Beer', 'Fine Dining',
    'Street Food', 'Vegetarian', 'Vegan', 'BBQ', 'Sushi', 'Pizza'
  ],
  'Travel & Adventure': [
    'Traveling', 'Backpacking', 'Road Trips', 'Camping', 'Beach', 'Mountains',
    'City Breaks', 'Cultural Tours', 'Adventure Sports', 'Photography Tours'
  ],
  'Entertainment': [
    'Movies', 'Netflix', 'Gaming', 'Board Games', 'Comedy Shows', 'Podcasts',
    'Reading', 'Books', 'Anime', 'TV Shows', 'Stand-up Comedy'
  ],
  'Lifestyle': [
    'Fashion', 'Shopping', 'Meditation', 'Wellness', 'Skincare', 'Fitness',
    'Healthy Living', 'Minimalism', 'Interior Design', 'Gardening'
  ],
  'Technology': [
    'Tech', 'Programming', 'AI', 'Gadgets', 'Apps', 'Startups', 'Crypto',
    'Web Design', 'Mobile Development', 'Innovation'
  ],
  'Social & Community': [
    'Volunteering', 'Charity Work', 'Community Events', 'Networking',
    'Public Speaking', 'Teaching', 'Mentoring', 'Social Causes'
  ]
};

export default function InterestsScreen() {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Sports & Fitness');

  useEffect(() => {
    loadSavedInterests();
  }, []);

  const loadSavedInterests = async () => {
    try {
      const savedInterests = await AsyncStorage.getItem('onboarding_interests');
      if (savedInterests) {
        setSelectedInterests(JSON.parse(savedInterests));
      }
    } catch (error) {
      console.error('Error loading saved interests:', error);
    }
  };

  const saveInterestsData = async (interests: Interest[]) => {
    try {
      await AsyncStorage.setItem('onboarding_interests', JSON.stringify(interests));
    } catch (error) {
      console.error('Error saving interests data:', error);
    }
  };
  const allInterests: Interest[] = Object.entries(interestCategories).flatMap(([category, interests]) =>
    interests.map(interest => ({
      id: `${category}-${interest}`,
      name: interest,
      category
    }))
  );

  const filteredInterests = allInterests.filter(interest =>
    interest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interest.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryInterests = searchQuery 
    ? filteredInterests 
    : allInterests.filter(interest => interest.category === activeCategory);

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests(prev => {
      const isSelected = prev.some(selected => selected.id === interest.id);
      let newInterests;
      if (isSelected) {
        newInterests = prev.filter(selected => selected.id !== interest.id);
      } else {
        newInterests = [...prev, interest];
      }
      saveInterestsData(newInterests);
      return newInterests;
    });
  };

  const addCustomInterest = () => {
    if (!customInterest.trim()) return;

    const newInterest: Interest = {
      id: `custom-${Date.now()}`,
      name: customInterest.trim(),
      category: 'Custom'
    };

    setSelectedInterests(prev => [...prev, newInterest]);
    setCustomInterest('');
    setShowCustomInput(false);
    saveInterestsData([...selectedInterests, newInterest]);
  };

  const removeInterest = (interestId: string) => {
    setSelectedInterests(prev => {
      const newInterests = prev.filter(interest => interest.id !== interestId);
      saveInterestsData(newInterests);
      return newInterests;
    });
  };

  const handleContinue = () => {
    if (selectedInterests.length < MIN_INTERESTS) {
      Alert.alert(
        'More Interests Needed',
        `Please select at least ${MIN_INTERESTS} interests to help us find better matches for you.`
      );
      return;
    }

    router.push('/onboarding/notifications');
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
              style={[styles.progressFill, { width: '60%' }]}
            />
          </View>
          <Text style={styles.progressText}>3 of 5</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What Are You Into?</Text>
        <Text style={styles.subtitle}>
          Select at least {MIN_INTERESTS} interests to help us find people you'll connect with.
        </Text>

        {/* Progress Indicator */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {selectedInterests.length}/{MIN_INTERESTS} interests selected
            </Text>
            {selectedInterests.length >= MIN_INTERESTS && (
              <CheckCircle size={20} color="#10B981" />
            )}
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <LinearGradient
                colors={['#E94E87', '#FF6B9D']}
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min((selectedInterests.length / MIN_INTERESTS) * 100, 100)}%` }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Selected Interests */}
        {selectedInterests.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.selectedTitle}>Your Interests</Text>
            <View style={styles.selectedInterests}>
              {selectedInterests.map(interest => (
                <View key={interest.id} style={styles.selectedInterest}>
                  <Text style={styles.selectedInterestText}>{interest.name}</Text>
                  <TouchableOpacity
                    onPress={() => removeInterest(interest.id)}
                    style={styles.removeButton}
                  >
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search interests..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        {!searchQuery && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesList}
          >
            {Object.keys(interestCategories).map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  activeCategory === category && styles.activeCategoryTab
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Interests Grid */}
        <View style={styles.interestsGrid}>
          {categoryInterests.map(interest => {
            const isSelected = selectedInterests.some(selected => selected.id === interest.id);
            return (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestChip,
                  isSelected && styles.selectedInterestChip
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.interestText,
                  isSelected && styles.selectedInterestChipText
                ]}>
                  {interest.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Interest */}
        <View style={styles.customSection}>
          {!showCustomInput ? (
            <TouchableOpacity
              style={styles.addCustomButton}
              onPress={() => setShowCustomInput(true)}
            >
              <Plus size={20} color="#E94E87" />
              <Text style={styles.addCustomText}>Add Custom Interest</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Enter your interest..."
                placeholderTextColor="#9CA3AF"
                value={customInterest}
                onChangeText={setCustomInterest}
                maxLength={30}
                autoFocus
              />
              <View style={styles.customActions}>
                <TouchableOpacity
                  style={styles.cancelCustomButton}
                  onPress={() => {
                    setShowCustomInput(false);
                    setCustomInterest('');
                  }}
                >
                  <Text style={styles.cancelCustomText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addCustomActionButton,
                    !customInterest.trim() && styles.addCustomActionButtonDisabled
                  ]}
                  onPress={addCustomInterest}
                  disabled={!customInterest.trim()}
                >
                  <Text style={[
                    styles.addCustomActionText,
                    !customInterest.trim() && styles.addCustomActionTextDisabled
                  ]}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for Better Matches</Text>
          <Text style={styles.tipsText}>
            • Be specific about your interests{'\n'}
            • Include both active and relaxing activities{'\n'}
            • Add interests you'd like to explore with someone{'\n'}
            • Don't worry, you can change these later
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedInterests.length >= MIN_INTERESTS ? styles.continueButtonActive : styles.continueButtonInactive
          ]}
          onPress={handleContinue}
          disabled={selectedInterests.length < MIN_INTERESTS}
        >
          <Text style={[
            styles.continueButtonText,
            selectedInterests.length >= MIN_INTERESTS ? styles.continueButtonTextActive : styles.continueButtonTextInactive
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
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  selectedSection: {
    marginBottom: 24,
  },
  selectedTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  selectedInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedInterest: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E94E87',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  selectedInterestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  removeButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingRight: 20,
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryTab: {
    backgroundColor: '#E94E87',
    borderColor: '#E94E87',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    whiteSpace: 'nowrap',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  interestChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedInterestChip: {
    backgroundColor: '#FEF2F2',
    borderColor: '#E94E87',
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedInterestChipText: {
    color: '#E94E87',
  },
  customSection: {
    marginBottom: 24,
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#E94E87',
    borderStyle: 'dashed',
    gap: 8,
  },
  addCustomText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  customInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  customInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    marginBottom: 16,
  },
  customActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelCustomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelCustomText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  addCustomActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E94E87',
    alignItems: 'center',
  },
  addCustomActionButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  addCustomActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  addCustomActionTextDisabled: {
    color: '#9CA3AF',
  },
  tipsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#047857',
    lineHeight: 20,
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