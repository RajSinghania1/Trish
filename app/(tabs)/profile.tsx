import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Settings, MapPin, CreditCard as Edit3, Heart, MessageCircle, Star, Camera, Plus, X, ChevronRight, Shield, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import LocationPicker from '@/components/LocationPicker';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('New York, NY');
  
  const [interests, setInterests] = useState<string[]>([]);
  const availableInterests = [
    'Photography', 'Travel', 'Coffee', 'Art', 'Music', 'Hiking',
    'Cooking', 'Reading', 'Fitness', 'Dancing', 'Movies', 'Gaming',
    'Nature', 'Fashion', 'Technology', 'Sports', 'Wine', 'Yoga'
  ];
  
  const [selectedInterests, setSelectedInterests] = useState(interests);
  
  useEffect(() => {
    loadUserProfile();
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        setUserProfile(profile);
        setInterests(profile.interests || []);
        setSelectedInterests(profile.interests || []);
        setCurrentLocation(profile.location || 'New York, NY');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#E94E87" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification Status */}
        <View style={styles.verificationCard}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.verificationGradient}
          >
            <View style={styles.verificationHeader}>
              <Shield size={24} color="#FFFFFF" />
              <Text style={styles.verificationTitle}>Verified Profile</Text>
            </View>
            <Text style={styles.verificationSubtitle}>
              Your profile has been verified for authenticity
            </Text>
            <View style={styles.verificationBadges}>
              <View style={styles.verificationBadge}>
                <Text style={styles.badgeText}>✓ Email</Text>
              </View>
              <View style={styles.verificationBadge}>
                <Text style={styles.badgeText}>✓ Phone</Text>
              </View>
              <View style={styles.verificationBadge}>
                <Text style={styles.badgeText}>✓ Photo</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ 
                uri: userProfile?.images?.[0] || 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400' 
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.verifiedBadge}>
              <Shield size={12} color="#10B981" />
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile?.name || 'User'}, {userProfile?.age || 25}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#6B7280" />
              <TouchableOpacity onPress={() => setShowLocationPicker(true)}>
                <Text style={styles.location}>{userProfile?.location || currentLocation}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bio}>
              {userProfile?.bio || 'Welcome to my profile!'}
            </Text>
            
            {/* Interests */}
            <View style={styles.interestsContainer}>
              {interests.slice(0, 4).map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
              {interests.length > 4 && (
                <TouchableOpacity style={styles.moreInterestsTag}>
                  <Text style={styles.moreInterestsText}>+{interests.length - 4}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Premium Upgrade Card */}
        <TouchableOpacity style={styles.premiumCard}>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.premiumGradient}
          >
            <View style={styles.premiumContent}>
              <Crown size={24} color="#FFFFFF" />
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumSubtitle}>Unlock unlimited likes and super features</Text>
              </View>
              <ChevronRight size={20} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <LinearGradient
              colors={['#E94E87', '#FF6B9D']}
              style={styles.statGradient}
            >
              <Heart size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statItem}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.statGradient}
            >
              <MessageCircle size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statItem}>
            <LinearGradient
              colors={['#F59E0B', '#FBBF24']}
              style={styles.statGradient}
            >
              <Star size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Super Likes</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowEditModal(true)}>
            <View style={styles.menuIconContainer}>
              <Edit3 size={20} color="#E94E87" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Settings size={20} color="#6B7280" />
            </View>
            <Text style={styles.menuText}>Discovery Settings</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Heart size={20} color="#F59E0B" />
            </View>
            <Text style={styles.menuText}>Liked You</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>3</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Shield size={20} color="#10B981" />
            </View>
            <Text style={styles.menuText}>Privacy & Safety</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={signOut}>
            <View style={styles.menuIconContainer}>
              <Settings size={20} color="#EF4444" />
            </View>
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Sign Out</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.editSection}>
              <Text style={styles.editSectionTitle}>Photos</Text>
              <View style={styles.photosGrid}>
                {/* Current Photos */}
                {userProfile?.images?.map((imageUri, index) => (
                  <View key={`photo-${index}`} style={styles.photoSlot}>
                    <Image source={{ uri: imageUri }} style={styles.photoImage} />
                    <TouchableOpacity style={styles.removePhotoButton}>
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                    {index === 0 && (
                      <View style={styles.mainPhotoBadge}>
                        <Text style={styles.mainPhotoText}>Main</Text>
                      </View>
                    )}
                  </View>
                ))}
                
                {/* Add Photo Slots */}
                {Array.from({ length: Math.max(0, 6 - (userProfile?.images?.length || 0)) }, (_, index) => (
                  <TouchableOpacity 
                    key={`add-${index}`} 
                    style={[
                      styles.addPhotoButton,
                      index === 0 && (!userProfile?.images || userProfile.images.length === 0) && styles.mainPhotoSlot
                    ]}
                  >
                    <Plus size={24} color={index === 0 && (!userProfile?.images || userProfile.images.length === 0) ? "#E94E87" : "#9CA3AF"} />
                    <Text style={[
                      styles.addPhotoText,
                      index === 0 && (!userProfile?.images || userProfile.images.length === 0) && styles.mainPhotoText
                    ]}>
                      {index === 0 && (!userProfile?.images || userProfile.images.length === 0) ? 'Main Photo' : 'Add Photo'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.editSection}>
              <Text style={styles.editSectionTitle}>About</Text>
              <TextInput
                style={styles.bioInput}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                defaultValue="Photographer and coffee enthusiast ☕ Love exploring hidden gems in the city and weekend getaways to the mountains."
              />
            </View>
            
            <View style={styles.editSection}>
              <Text style={styles.editSectionTitle}>Interests</Text>
              <TouchableOpacity 
                style={styles.editInterestsButton}
                onPress={() => setShowInterestsModal(true)}
              >
                <Text style={styles.editInterestsText}>Edit Interests</Text>
                <ChevronRight size={16} color="#E94E87" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Interests Modal */}
      <Modal
        visible={showInterestsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInterestsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowInterestsModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Interests</Text>
            <TouchableOpacity onPress={() => setShowInterestsModal(false)}>
              <Text style={styles.saveButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
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
                    styles.interestChipText,
                    selectedInterests.includes(interest) && styles.selectedInterestText
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Location Picker Modal */}
      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={setCurrentLocation}
        currentLocation={currentLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  verificationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  verificationGradient: {
    padding: 20,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  verificationTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  verificationSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  verificationBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  verificationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 8,
    right: '35%',
    backgroundColor: '#E94E87',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: '35%',
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
  },
  bio: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  interestText: {
    fontSize: 14,
    color: '#E94E87',
    fontFamily: 'Inter-Medium',
  },
  moreInterestsTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  moreInterestsText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  premiumCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Medium',
  },
  newBadge: {
    backgroundColor: '#E94E87',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  newBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  saveButton: {
    fontSize: 16,
    color: '#E94E87',
    fontFamily: 'Inter-SemiBold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  editSection: {
    marginBottom: 24,
  },
  editSectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  photoSlot: {
    width: '48%',
    aspectRatio: 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPhotoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#E94E87',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mainPhotoText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  addPhotoButton: {
    width: '48%',
    aspectRatio: 0.75,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mainPhotoSlot: {
    borderColor: '#E94E87',
    backgroundColor: '#FEF2F2',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  bioInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  editInterestsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editInterestsText: {
    fontSize: 16,
    color: '#E94E87',
    fontFamily: 'Inter-Medium',
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
  interestChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
});