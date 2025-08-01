import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Heart, Settings, MessageCircle, Gift, Star, Crown, Sparkles, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function ConnectionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'matches' | 'likes' | 'gifts'>('matches');

  const matches = [
    {
      id: 'match-1',
      name: 'Sarah',
      age: 24,
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      isNew: true,
      lastMessage: 'Hey! How are you?',
      time: '2m ago',
      matchType: 'like'
    },
    {
      id: 'match-2',
      name: 'Alex',
      age: 27,
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      isNew: false,
      lastMessage: 'That sounds great!',
      time: '1h ago',
      matchType: 'gift'
    },
    {
      id: 'match-3',
      name: 'Maya',
      age: 26,
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      isNew: true,
      lastMessage: null,
      time: '3h ago',
      matchType: 'like'
    },
  ];

  const likes = [
    {
      id: 'like-1',
      name: 'Jessica',
      age: 23,
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'like',
      time: '5m ago'
    },
    {
      id: 'like-2',
      name: 'David',
      age: 29,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'superlike',
      time: '1h ago'
    },
    {
      id: 'like-3',
      name: 'Luna',
      age: 22,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'like',
      time: '2h ago'
    },
    {
      id: 'like-4',
      name: 'Marcus',
      age: 30,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'superlike',
      time: '4h ago'
    },
  ];

  const gifts = [
    {
      id: 'gift-1',
      name: 'Emma',
      age: 25,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      gift: 'Red Rose',
      giftImage: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=400',
      message: 'You seem amazing! 🌹',
      time: '30m ago',
      status: 'pending'
    },
    {
      id: 'gift-2',
      name: 'Oliver',
      age: 28,
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      gift: 'Coffee',
      giftImage: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
      message: 'Would love to grab coffee with you!',
      time: '2h ago',
      status: 'pending'
    },
  ];

  const renderMatch = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.matchCard}
      onPress={() => {
        console.log('Opening match profile:', item.name);
        // Navigate to profile or messages
        router.push({
          pathname: '/messages/conversation',
          params: {
            conversationId: `match-${item.id}`,
            name: item.name,
            image: item.image,
            isOnline: 'true'
          }
        });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.matchImageContainer}>
        <Image source={{ uri: item.image }} style={styles.matchImage} />
        {item.isNew && (
          <LinearGradient
            colors={['#E94E87', '#FF6B9D']}
            style={styles.newBadge}
          >
            <Sparkles size={12} color="#FFFFFF" />
          </LinearGradient>
        )}
        {item.matchType === 'gift' && (
          <View style={styles.giftMatchBadge}>
            <Gift size={12} color="#8B5A3C" />
          </View>
        )}
      </View>
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.name}, {item.age}</Text>
        {item.lastMessage ? (
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
        ) : (
          <Text style={styles.noMessage}>Say hello! 👋</Text>
        )}
        <View style={styles.matchTimeContainer}>
          <Clock size={12} color="#9CA3AF" />
          <Text style={styles.matchTime}>{item.time}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.messageButton}
        onPress={() => {
          console.log('Opening message with:', item.name);
          router.push({
            pathname: '/messages/conversation',
            params: {
              conversationId: `match-${item.id}`,
              name: item.name,
              image: item.image,
              isOnline: 'true'
            }
          });
        }}
      >
        <MessageCircle size={20} color="#E94E87" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderLike = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.likeCard}>
      <Image source={{ uri: item.image }} style={styles.likeImage} />
      {item.type === 'superlike' && (
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.superlikeBadge}
        >
          <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
        </LinearGradient>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
        style={styles.likeOverlay}
      >
        <View style={styles.likeActions}>
          <TouchableOpacity style={styles.passButton}>
            <Text style={styles.passText}>Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton}>
            <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={styles.likeInfo}>
        <Text style={styles.likeName}>{item.name}, {item.age}</Text>
        <View style={styles.likeTimeContainer}>
          <Clock size={10} color="#9CA3AF" />
          <Text style={styles.likeTime}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGift = ({ item }: { item: any }) => (
    <View style={styles.giftCard}>
      <LinearGradient
        colors={['#FEF7CD', '#FEF3C7']}
        style={styles.giftCardGradient}
      >
        <View style={styles.giftHeader}>
          <View style={styles.giftSenderInfo}>
            <Image source={{ uri: item.image }} style={styles.giftSenderImage} />
            <View style={styles.giftSenderDetails}>
              <Text style={styles.giftSenderName}>{item.name}, {item.age}</Text>
              <View style={styles.giftTimeContainer}>
                <Clock size={12} color="#92400E" />
                <Text style={styles.giftTime}>{item.time}</Text>
              </View>
            </View>
          </View>
          <View style={styles.giftBadge}>
            <Crown size={16} color="#D97706" />
          </View>
        </View>
        
        <View style={styles.giftContent}>
          <View style={styles.giftImageContainer}>
            <Image source={{ uri: item.giftImage }} style={styles.giftItemImage} />
          </View>
          <View style={styles.giftDetails}>
            <Text style={styles.giftType}>Sent you: {item.gift}</Text>
            <Text style={styles.giftMessage}>"{item.message}"</Text>
          </View>
        </View>
        
        <View style={styles.giftActions}>
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton}>
            <LinearGradient
              colors={['#E94E87', '#FF6B9D']}
              style={styles.acceptButtonGradient}
            >
              <Text style={styles.acceptText}>Accept Gift</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'matches': return matches.length;
      case 'likes': return likes.length;
      case 'gifts': return gifts.length;
      default: return 0;
    }
  };

  const getNewCount = (tab: string) => {
    switch (tab) {
      case 'matches': return matches.filter(m => m.isNew).length;
      case 'likes': return likes.length; // All likes are considered "new"
      case 'gifts': return gifts.filter(g => g.status === 'pending').length;
      default: return 0;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Connections</Text>
          <Text style={styles.headerSubtitle}>
            Your matches, likes, and gifts all in one place
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#E94E87" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['matches', 'likes', 'gifts'] as const).map((tab) => {
          const count = getTabCount(tab);
          const newCount = getNewCount(tab);
          
          return (
            <TouchableOpacity 
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <View style={styles.tabContent}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                </Text>
                {newCount > 0 && (
                  <View style={styles.newCountBadge}>
                    <Text style={styles.newCountText}>{newCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'matches' && (
          <FlatList
            data={matches}
            renderItem={renderMatch}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        {activeTab === 'likes' && (
          <View style={styles.likesGrid}>
            {likes.map((like) => (
              <View key={like.id} style={styles.likeGridItem}>
                {renderLike({ item: like })}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'gifts' && (
          <FlatList
            data={gifts}
            renderItem={renderGift}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        {/* Empty States */}
        {activeTab === 'matches' && matches.length === 0 && (
          <View style={styles.emptyState}>
            <Heart size={64} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>Start swiping to find your perfect match!</Text>
          </View>
        )}

        {activeTab === 'likes' && likes.length === 0 && (
          <View style={styles.emptyState}>
            <Heart size={64} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No likes yet</Text>
            <Text style={styles.emptySubtitle}>People who like you will appear here</Text>
          </View>
        )}

        {activeTab === 'gifts' && gifts.length === 0 && (
          <View style={styles.emptyState}>
            <Gift size={64} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No gifts yet</Text>
            <Text style={styles.emptySubtitle}>Gifts from admirers will appear here</Text>
          </View>
        )}
      </ScrollView>
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
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#E94E87',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  newCountBadge: {
    backgroundColor: '#FF6B9D',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  newCountText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  matchImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  giftMatchBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B5A3C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  noMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E94E87',
    marginBottom: 4,
  },
  matchTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 12,
  },
  likesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  likeGridItem: {
    width: '48%',
  },
  likeCard: {
    aspectRatio: 0.75,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  likeImage: {
    width: '100%',
    height: '100%',
  },
  superlikeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  likeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  likeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  passText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  likeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(233, 78, 135, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 12,
    alignItems: 'center',
  },
  likeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  likeTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  giftCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  giftCardGradient: {
    padding: 20,
  },
  giftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  giftSenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  giftSenderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  giftSenderDetails: {
    flex: 1,
  },
  giftSenderName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 4,
  },
  giftTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  giftTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
  },
  giftBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftContent: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  giftImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  giftItemImage: {
    width: '100%',
    height: '100%',
  },
  giftDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  giftType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  giftMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#A16207',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  giftActions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D97706',
  },
  declineText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#D97706',
  },
  acceptButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  acceptButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
  },
});