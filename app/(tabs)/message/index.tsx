import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { MessageCircle, Search, Settings, Gift, Clock, Check, CheckCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function MessagesScreen() {
  const conversations = [
    {
      id: 1,
      name: 'Emma',
      lastMessage: 'Hey! How was your day?',
      time: '2m',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      unread: 2,
      isOnline: true,
      messageType: 'text',
      isRead: false,
    },
    {
      id: 2,
      name: 'Alex',
      lastMessage: 'That restaurant was amazing!',
      time: '1h',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      unread: 0,
      isOnline: false,
      messageType: 'text',
      isRead: true,
    },
    {
      id: 3,
      name: 'Sarah',
      lastMessage: '🎁 Sent you a gift',
      time: '3h',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      unread: 1,
      isOnline: true,
      messageType: 'gift',
      isRead: false,
    },
    {
      id: 4,
      name: 'Maya',
      lastMessage: 'See you tomorrow ✨',
      time: '1d',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      unread: 0,
      isOnline: false,
      messageType: 'text',
      isRead: true,
    },
  ];

  const activities = [
    {
      id: 'activity-1',
      name: 'You',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      isActive: true,
    },
    ...conversations.slice(0, 4).map(conv => ({
      id: `activity-${conv.id}`,
      name: conv.name,
      image: conv.image,
      isActive: conv.isOnline,
    }))
  ];

  const renderActivity = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.activityItem}
      onPress={() => {
        if (item.name !== 'You') {
          console.log('Opening chat with:', item.name);
          router.push({
            pathname: '/messages/conversation',
            params: {
              conversationId: item.id,
              name: item.name,
              image: item.image,
              isOnline: item.isActive.toString()
            }
          });
        }
      }}
      activeOpacity={item.name === 'You' ? 1 : 0.7}
    >
      <View style={styles.activityAvatarContainer}>
        <Image source={{ uri: item.image }} style={styles.activityAvatar} />
        {item.isActive && <View style={styles.onlineIndicator} />}
        {item.name === 'You' && (
          <LinearGradient
            colors={['#E94E87', '#FF6B9D']}
            style={styles.activityBorder}
          />
        )}
      </View>
      <Text style={styles.activityName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => {
        console.log('Navigating to conversation with:', item.name);
        router.push({
          pathname: '/messages/conversation',
          params: {
            conversationId: item.id.toString(),
            name: item.name,
            image: item.image,
            isOnline: item.isOnline.toString()
          }
        });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
        {item.messageType === 'gift' && (
          <View style={styles.giftBadge}>
            <Gift size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.conversationTime}>{item.time}</Text>
            {item.isRead && item.unread === 0 && (
              <CheckCheck size={14} color="#E94E87" />
            )}
          </View>
        </View>
        <View style={styles.messageContainer}>
          <Text style={[
            styles.lastMessage, 
            item.unread > 0 && styles.unreadMessage,
            item.messageType === 'gift' && styles.giftMessage
          ]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <LinearGradient
              colors={['#E94E87', '#FF6B9D']}
              style={styles.unreadBadge}
            >
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            {conversations.filter(c => c.unread > 0).length} new messages
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#E94E87" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Activities Section */}
      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>Active Now</Text>
        <FlatList
          data={activities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitiesList}
        />
      </View>

      {/* Messages Section */}
      <View style={styles.messagesSection}>
        <View style={styles.messagesSectionHeader}>
          <Text style={styles.sectionTitle}>Messages</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id.toString()}
          style={styles.conversationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MessageCircle size={64} color="#E5E7EB" />
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptySubtitle}>
                Start matching to begin conversations
              </Text>
            </View>
          )}
        />
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  activitiesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  activitiesList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  activityItem: {
    alignItems: 'center',
    gap: 8,
  },
  activityAvatarContainer: {
    position: 'relative',
  },
  activityAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  activityBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 35,
    zIndex: -1,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  activityName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  messagesSection: {
    flex: 1,
  },
  messagesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  giftBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B5A3C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  conversationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  unreadMessage: {
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  giftMessage: {
    color: '#8B5A3C',
    fontFamily: 'Inter-Medium',
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
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