import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, FileSliders as Sliders } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterSettings) => void;
}

interface FilterSettings {
  ageRange: [number, number];
  distance: number;
  interests: string[];
  lookingFor: string[];
}

const availableInterests = [
  'Photography', 'Travel', 'Coffee', 'Art', 'Music', 'Hiking',
  'Cooking', 'Reading', 'Fitness', 'Dancing', 'Movies', 'Gaming',
  'Nature', 'Fashion', 'Technology', 'Sports', 'Wine', 'Yoga'
];

const lookingForOptions = [
  'Long-term relationship',
  'Something casual',
  'New friends',
  'Still figuring it out'
];

export default function FilterModal({ visible, onClose, onApplyFilters }: FilterModalProps) {
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
  const [distance, setDistance] = useState(25);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleLookingFor = (option: string) => {
    setSelectedLookingFor(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      ageRange,
      distance,
      interests: selectedInterests,
      lookingFor: selectedLookingFor
    });
    onClose();
  };

  const clearFilters = () => {
    setAgeRange([18, 35]);
    setDistance(25);
    setSelectedInterests([]);
    setSelectedLookingFor([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Age Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age Range</Text>
            <Text style={styles.sectionValue}>{ageRange[0]} - {ageRange[1]} years</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={65}
                value={ageRange[0]}
                onValueChange={(value) => setAgeRange([Math.round(value), ageRange[1]])}
                minimumTrackTintColor="#E94E87"
                maximumTrackTintColor="#E5E7EB"
                thumbStyle={styles.sliderThumb}
              />
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={65}
                value={ageRange[1]}
                onValueChange={(value) => setAgeRange([ageRange[0], Math.round(value)])}
                minimumTrackTintColor="#E94E87"
                maximumTrackTintColor="#E5E7EB"
                thumbStyle={styles.sliderThumb}
              />
            </View>
          </View>

          {/* Distance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maximum Distance</Text>
            <Text style={styles.sectionValue}>{distance} km</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={100}
              value={distance}
              onValueChange={(value) => setDistance(Math.round(value))}
              minimumTrackTintColor="#E94E87"
              maximumTrackTintColor="#E5E7EB"
              thumbStyle={styles.sliderThumb}
            />
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsGrid}>
              {availableInterests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest) && styles.selectedInterestChip
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.selectedInterestText
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Looking For */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <View style={styles.lookingForGrid}>
              {lookingForOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.lookingForChip,
                    selectedLookingFor.includes(option) && styles.selectedLookingForChip
                  ]}
                  onPress={() => toggleLookingFor(option)}
                >
                  <Text style={[
                    styles.lookingForText,
                    selectedLookingFor.includes(option) && styles.selectedLookingForText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  clearText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E94E87',
    marginBottom: 16,
  },
  sliderContainer: {
    gap: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#E94E87',
    width: 20,
    height: 20,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedInterestChip: {
    backgroundColor: '#E94E87',
    borderColor: '#E94E87',
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
  lookingForGrid: {
    gap: 12,
  },
  lookingForChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedLookingForChip: {
    backgroundColor: '#E94E87',
    borderColor: '#E94E87',
  },
  lookingForText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedLookingForText: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  applyButton: {
    backgroundColor: '#E94E87',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});