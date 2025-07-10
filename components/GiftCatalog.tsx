import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Send, Heart, Star, Crown, Sparkles } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface GiftCatalogProps {
  visible: boolean;
  onClose: () => void;
  onSendGift: (gift: any, message: string) => void;
  recipientName: string;
}

export default function GiftCatalog({ visible, onClose, onSendGift, recipientName }: GiftCatalogProps) {
  const { user } = useAuth();
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load wallet balance when modal opens
  useEffect(() => {
    if (visible && user?.id) {
      loadWalletBalance();
    }
  }, [visible, user?.id]);

  const loadWalletBalance = async () => {
    if (!user?.id) return;

    try {
      const { data: wallet, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading wallet balance:', error);
        return;
      }

      setWalletBalance(wallet?.balance || 0);
    } catch (error) {
      console.error('Error loading wallet balance:', error);
    }
  };
  const gifts = [
    {
      id: 1,
      name: 'Red Rose',
      price: 5.99,
      image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'flowers',
      description: 'A beautiful red rose to show your affection'
    },
    {
      id: 2,
      name: 'Chocolate Box',
      price: 12.99,
      image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'sweets',
      description: 'Premium chocolate collection'
    },
    {
      id: 3,
      name: 'Coffee',
      price: 4.99,
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'drinks',
      description: 'Premium coffee blend'
    },
    {
      id: 4,
      name: 'Teddy Bear',
      price: 19.99,
      image: 'https://images.pexels.com/photos/236230/pexels-photo-236230.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'toys',
      description: 'Cute and cuddly teddy bear'
    },
    {
      id: 5,
      name: 'Jewelry',
      price: 49.99,
      image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'accessories',
      description: 'Beautiful jewelry piece'
    },
    {
      id: 6,
      name: 'Wine',
      price: 29.99,
      image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'drinks',
      description: 'Fine wine selection'
    }
  ];

  const categories = ['all', 'flowers', 'sweets', 'drinks', 'toys', 'accessories'];

  const filteredGifts = selectedCategory === 'all' 
    ? gifts 
    : gifts.filter(gift => gift.category === selectedCategory);

  const handleSendGift = () => {
    if (selectedGift && message.trim()) {
      // Check if user has sufficient balance
      const giftPriceInPoints = Math.round(selectedGift.price * 100); // Convert to points
      if (walletBalance < giftPriceInPoints) {
        alert(`Insufficient funds! You need ${giftPriceInPoints} points but only have ${walletBalance} points.`);
        return;
      }

      setLoading(true);
      onSendGift(selectedGift, message);
      setSelectedGift(null);
      setMessage('');
      setLoading(false);
    }
  };

  const renderCategoryTab = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryTab,
        selectedCategory === category && styles.activeCategoryTab
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.activeCategoryText
      ]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const renderGiftItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.giftItem,
        selectedGift?.id === item.id && styles.selectedGiftItem
      ]}
      onPress={() => setSelectedGift(item)}
    >
      <LinearGradient
        colors={selectedGift?.id === item.id ? ['#E94E87', '#FF6B9D'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.giftItemGradient}
      >
        <View style={styles.giftImageContainer}>
          <Image source={{ uri: item.image }} style={styles.giftImage} />
          {selectedGift?.id === item.id && (
            <View style={styles.selectedOverlay}>
              <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={styles.giftInfo}>
          <Text style={[
            styles.giftName,
            selectedGift?.id === item.id && styles.selectedGiftText
          ]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[
            styles.giftCategory,
            selectedGift?.id === item.id && styles.selectedGiftText
          ]}>
            {item.category}
          </Text>
          <Text style={[
            styles.giftPrice,
            selectedGift?.id === item.id && styles.selectedGiftPriceText
          ]}>
            ${item.price}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#E94E87', '#FF6B9D']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <View style={styles.headerTitleContainer}>
                <Crown size={20} color="#FFFFFF" />
                <Text style={styles.title}>Send Gift</Text>
              </View>
              <Text style={styles.subtitle}>to {recipientName}</Text>
              <Text style={styles.balanceText}>
                {walletBalance.toLocaleString()} pts
              </Text>
            </View>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map(renderCategoryTab)}
          </ScrollView>
        </View>

        {/* Gift Grid */}
        <FlatList
          data={filteredGifts}
          renderItem={renderGiftItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          style={styles.giftGrid}
          contentContainerStyle={styles.giftGridContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.giftRow}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Sparkles size={48} color="#E94E87" />
              <Text style={styles.emptyText}>No gifts in this category</Text>
            </View>
          )}
        />

        {/* Selected Gift Details */}
        {selectedGift && (
          <View style={styles.selectedGiftSection}>
            <View style={styles.selectedGiftHeader}>
              <Text style={styles.selectedGiftTitle}>Selected Gift</Text>
              <Text style={styles.selectedGiftPrice}>
                {Math.round(selectedGift.price * 100)} points
              </Text>
            </View>
            <Text style={styles.selectedGiftName}>{selectedGift.name}</Text>
            <Text style={styles.selectedGiftDescription}>{selectedGift.description}</Text>
            
            {/* Balance Check */}
            {walletBalance < Math.round(selectedGift.price * 100) && (
              <View style={styles.insufficientFundsWarning}>
                <Text style={styles.warningText}>
                  Insufficient funds! You need {Math.round(selectedGift.price * 100) - walletBalance} more points.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Message Input */}
        {selectedGift && (
          <View style={styles.messageSection}>
            <Text style={styles.messageLabel}>Add a personal message:</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Write your message..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={200}
            />
            <Text style={styles.charCount}>{message.length}/200</Text>
          </View>
        )}

        {/* Footer */}
        {selectedGift && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!selectedGift || !message.trim() || walletBalance < Math.round((selectedGift?.price || 0) * 100) || loading) && styles.sendButtonDisabled
              ]}
              onPress={handleSendGift}
              disabled={!selectedGift || !message.trim() || walletBalance < Math.round((selectedGift?.price || 0) * 100) || loading}
            >
              <LinearGradient
                colors={(!selectedGift || !message.trim() || walletBalance < Math.round((selectedGift?.price || 0) * 100) || loading) ? ['#D1D5DB', '#D1D5DB'] : ['#E94E87', '#FF6B9D']}
                style={styles.sendButtonGradient}
              >
                <Send size={16} color={(!selectedGift || !message.trim() || walletBalance < Math.round((selectedGift?.price || 0) * 100) || loading) ? "#9CA3AF" : "#FFFFFF"} />
                <Text style={[
                  styles.sendButtonText,
                  (!selectedGift || !message.trim() || walletBalance < Math.round((selectedGift?.price || 0) * 100) || loading) && styles.sendButtonTextDisabled
                ]}>
                  {loading ? 'Sending...' : `Send Gift (${Math.round((selectedGift?.price || 0) * 100)} pts)`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: {
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  balanceText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  activeCategoryTab: {
    backgroundColor: '#E94E87',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  giftGrid: {
    flex: 1,
  },
  giftGridContent: {
    padding: 20,
  },
  giftRow: {
    justifyContent: 'space-between',
  },
  giftItem: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  giftItemGradient: {
    padding: 12,
  },
  selectedGiftItem: {},
  giftImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  giftImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftInfo: {
    gap: 4,
  },
  giftName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    lineHeight: 18,
  },
  giftCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  giftPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#E94E87',
  },
  selectedGiftText: {
    color: '#FFFFFF',
  },
  selectedGiftPriceText: {
    color: '#FFFFFF',
  },
  selectedGiftSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  selectedGiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedGiftTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  selectedGiftPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#E94E87',
  },
  selectedGiftName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedGiftDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  insufficientFundsWarning: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    textAlign: 'center',
  },
  messageSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  messageLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 12,
  },
  messageInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  sendButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonDisabled: {},
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  sendButtonTextDisabled: {
    color: '#9CA3AF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});