import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Heart, X, Star, MessageCircle, Gift, Crown } from 'lucide-react-native';
import { router } from 'expo-router';
import GiftCatalog from '@/components/GiftCatalog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = screenHeight * 0.7;

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  location: string;
  interests: string[];
}

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 25,
    bio: 'Love hiking, coffee, and good conversations. Looking for someone to explore the city with!',
    images: [
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    ],
    location: 'San Francisco, CA',
    interests: ['Hiking', 'Coffee', 'Photography', 'Travel'],
  },
  {
    id: '2',
    name: 'Alex',
    age: 28,
    bio: 'Photographer and adventure seeker. Always up for trying new restaurants and exploring hidden gems.',
    images: [
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    ],
    location: 'Los Angeles, CA',
    interests: ['Photography', 'Food', 'Adventure', 'Art'],
  },
  {
    id: '3',
    name: 'Sarah',
    age: 26,
    bio: 'Yoga instructor and book lover. Seeking meaningful connections and deep conversations.',
    images: [
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    ],
    location: 'New York, NY',
    interests: ['Yoga', 'Reading', 'Meditation', 'Nature'],
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showGiftCatalog, setShowGiftCatalog] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(cardScale, {
          toValue: 0.95,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        rotation.setValue(gesture.dx / 10);
      },
      onPanResponderRelease: (_, gesture) => {
        Animated.spring(cardScale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();

        if (gesture.dx > 120) {
          // Swipe right - like
          swipeRight();
        } else if (gesture.dx < -120) {
          // Swipe left - pass
          swipeLeft();
        } else {
          // Return to center
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
          Animated.spring(rotation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: screenWidth + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -screenWidth - 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const nextCard = () => {
    setCurrentIndex((prev) => prev + 1);
    position.setValue({ x: 0, y: 0 });
    rotation.setValue(0);
  };

  const handleLike = () => {
    swipeRight();
  };

  const handlePass = () => {
    swipeLeft();
  };

  const handleSuperLike = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: -screenHeight - 100 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const handleGift = () => {
    if (currentIndex < profiles.length) {
      setSelectedProfile(profiles[currentIndex]);
      setShowGiftCatalog(true);
    }
  };

  const handleSendGift = (gift: any, message: string) => {
    console.log('Sending gift:', gift, 'with message:', message);
    
    // Process the gift purchase through wallet
    processGiftPurchase(gift, message);
  };

  const processGiftPurchase = async (gift: any, message: string) => {
    if (!user?.id || !selectedProfile) return;

    try {
      const giftPriceInPoints = Math.round(gift.price * 100);

      // Check wallet balance
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (walletError || !wallet || wallet.balance < giftPriceInPoints) {
        alert('Insufficient funds! Please add money to your wallet.');
        return;
      }

      // Deduct points from wallet
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          amount: -giftPriceInPoints,
          description: `Sent ${gift.name} to ${selectedProfile.name}`,
          transaction_type: 'debit'
        });

      if (transactionError) {
        alert('Failed to process gift purchase. Please try again.');
        return;
      }

      // Update wallet balance
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - giftPriceInPoints })
        .eq('user_id', user.id);

      if (updateError) {
        alert('Failed to update wallet balance. Please contact support.');
        return;
      }

      // Here you would also create the sent_gift record and handle the match creation
      // For now, we'll just show success and move to next card
      alert(`Successfully sent ${gift.name} to ${selectedProfile.name}!`);
      setShowGiftCatalog(false);
      nextCard();
    } catch (error) {
      console.error('Error processing gift purchase:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const openProfile = () => {
    if (currentIndex < profiles.length) {
      setSelectedProfile(profiles[currentIndex]);
      setShowProfileModal(true);
    }
  };

  const handleMessage = () => {
    setShowProfileModal(false);
    setTimeout(() => {
      router.push({
        pathname: '/messages/conversation',
        params: { userId: selectedProfile?.id },
      });
    }, 300);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  if (currentIndex >= profiles.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Heart size={64} color="#FF6B6B" />
          <Text style={styles.emptyTitle}>No more profiles!</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new matches
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <View style={styles.cardContainer}>
        {/* Next card (background) */}
        {currentIndex + 1 < profiles.length && (
          <View style={[styles.card, styles.nextCard]}>
            <Image
              source={{ uri: profiles[currentIndex + 1].images?.[0] || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }}
              style={styles.cardImage}
            />
          </View>
        )}

        {/* Current card */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotateInterpolate },
                { scale: cardScale },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity onPress={openProfile} style={styles.cardTouchable}>
            <Image
              source={{ uri: currentProfile.images[0] }}
              style={styles.cardImage}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>
                {currentProfile.name}, {currentProfile.age}
              </Text>
              <Text style={styles.cardLocation}>{currentProfile.location}</Text>
              <Text style={styles.cardBio} numberOfLines={2}>
                {currentProfile.bio}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <X size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.superLikeButton} onPress={handleSuperLike}>
          <Star size={20} color="#4A90E2" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.giftButton} onPress={handleGift}>
          <Crown size={20} color="#D4AF37" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Heart size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowProfileModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Profile</Text>
            <View style={styles.placeholder} />
          </View>

          {selectedProfile && (
            <ScrollView style={styles.modalContent}>
              <Image
                source={{ uri: selectedProfile.images?.[0] || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }}
                style={styles.modalImage}
              />
              
              <View style={styles.modalInfo}>
                <Text style={styles.modalName}>
                  {selectedProfile.name}, {selectedProfile.age}
                </Text>
                <Text style={styles.modalLocation}>
                  {selectedProfile.location}
                </Text>
                
                <Text style={styles.modalBio}>{selectedProfile.bio}</Text>
                
                <View style={styles.interestsContainer}>
                  <Text style={styles.interestsTitle}>Interests</Text>
                  <View style={styles.interestsTags}>
                    {selectedProfile.interests.map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalPassButton} onPress={() => setShowProfileModal(false)}>
              <X size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalMessageButton} onPress={handleMessage}>
              <MessageCircle size={20} color="#4A90E2" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalLikeButton} onPress={() => setShowProfileModal(false)}>
              <Heart size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      </SafeAreaView>

      <GiftCatalog
        visible={showGiftCatalog}
        onClose={() => setShowGiftCatalog(false)}
        onSendGift={handleSendGift}
        recipientName={selectedProfile?.name || 'Someone'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
  },
  nextCard: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  cardTouchable: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardInfo: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cardBio: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
    gap: 20,
  },
  passButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  giftButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  likeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 400,
  },
  modalInfo: {
    padding: 20,
  },
  modalName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalLocation: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  modalBio: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  interestsContainer: {
    marginTop: 8,
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  interestText: {
    fontSize: 14,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    gap: 30,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  modalPassButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMessageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});