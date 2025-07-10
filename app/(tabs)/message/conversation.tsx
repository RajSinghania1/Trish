import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Gift, Heart, MoveVertical as MoreVertical, Phone, Video, Crown } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: 'text' | 'gift';
  gift?: {
    name: string;
    image: string;
    price: number;
  };
}

export default function ConversationScreen() {
  const router = useRouter();
  const { conversationId, name, image, isOnline } = useLocalSearchParams<{
    conversationId: string;
    name: string;
    image: string;
    isOnline: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey! How are you doing today?',
      senderId: 'other',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: '2',
      content: 'I\'m doing great! Just finished a photography session. How about you?',
      senderId: 'me',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text'
    },
    {
      id: '3',
      content: 'That sounds amazing! I love photography too.',
      senderId: 'other',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    {
      id: '4',
      content: '🎁 Sent you a gift',
      senderId: 'other',
      timestamp: new Date(Date.now() - 900000),
      type: 'gift',
      gift: {
        name: 'Red Rose',
        image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=400',
        price: 5.99
      }
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Simulate typing indicator
  useEffect(() => {
    if (Math.random() > 0.7) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: 'me',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate response
    setTimeout(() => {
      const responses = [
        'That\'s interesting!',
        'I totally agree with you',
        'Tell me more about that',
        'Sounds like fun!',
        'I\'d love to hear more'
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        senderId: 'other',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, response]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000 + Math.random() * 2000);
  };

  const handleGiftPress = () => {
    Alert.alert(
      'Send Gift',
      'Gift feature coming soon! You\'ll be able to send thoughtful gifts to make connections even more special.',
      [{ text: 'OK' }]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === 'me';
    
    if (item.type === 'gift') {
      return (
        <View style={[styles.messageContainer, styles.giftMessageContainer]}>
          <LinearGradient
            colors={['#1A1A1A', '#2D2D2D']}
            style={styles.giftMessage}
          >
            <View style={styles.giftHeader}>
              <Crown size={16} color="#D4AF37" />
              <Text style={styles.giftLabel}>Gift Sent</Text>
            </View>
            {item.gift && (
              <>
                <Image source={{ uri: item.gift.image }} style={styles.giftImage} />
                <View style={styles.giftInfo}>
                  <Text style={styles.giftName}>{item.gift.name}</Text>
                  <Text style={styles.giftPrice}>${item.gift.price}</Text>
                </View>
              </>
            )}
            <Text style={styles.giftText}>{item.content}</Text>
            <Text style={styles.messageTime}>
              {formatTime(item.timestamp)}
            </Text>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <LinearGradient
          colors={isMyMessage ? ['#E94E87', '#FF6B9D'] : ['#2D2D2D', '#3D3D3D']}
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessage : styles.otherMessage
          ]}
        >
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
        </LinearGradient>
        <Text style={[
          styles.messageTime,
          isMyMessage ? styles.myMessageTime : styles.otherMessageTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <LinearGradient
        colors={['#2D2D2D', '#3D3D3D']}
        style={styles.typingBubble}
      >
        <View style={styles.typingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient
        colors={['#1A1A1A', '#0F0F0F']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#E94E87" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: image || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.avatar}
              />
              {isOnline === 'true' && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{name || 'Unknown'}</Text>
              <Text style={styles.userStatus}>
                {isOnline === 'true' ? 'Active now' : 'Last seen recently'}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Phone size={20} color="#E94E87" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Video size={20} color="#E94E87" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MoreVertical size={20} color="#E94E87" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={() => (
          <View style={styles.emptyMessages}>
            <Heart size={48} color="#E94E87" />
            <Text style={styles.emptyTitle}>Start the conversation!</Text>
            <Text style={styles.emptySubtitle}>
              Send a message to {name} and begin your chat
            </Text>
          </View>
        )}
      />

      {/* Typing Indicator */}
      {isTyping && renderTypingIndicator()}

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#8B8B8B"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity style={styles.giftButton} onPress={handleGiftPress}>
            <Gift size={20} color="#E94E87" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.sendButton,
              newMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <LinearGradient
              colors={newMessage.trim() ? ['#E94E87', '#FF6B9D'] : ['#3D3D3D', '#2D2D2D']}
              style={styles.sendButtonGradient}
            >
              <Send size={16} color={newMessage.trim() ? '#FFFFFF' : '#8B8B8B'} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 78, 135, 0.2)',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E94E87',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  userStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B8B8B',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 78, 135, 0.2)',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  giftMessageContainer: {
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessage: {
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#8B8B8B',
  },
  giftMessage: {
    borderRadius: 16,
    padding: 16,
    maxWidth: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  giftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  giftLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  giftImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  giftInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  giftName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    flex: 1,
  },
  giftPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#E94E87',
  },
  giftText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B8B8B',
    lineHeight: 20,
    marginBottom: 8,
  },
  typingContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  typingBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B8B8B',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
    backgroundColor: '#0F0F0F',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2D2D2D',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    maxHeight: 100,
    paddingVertical: 8,
  },
  giftButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 78, 135, 0.2)',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  sendButtonActive: {},
  sendButtonInactive: {},
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessages: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8B8B8B',
    marginTop: 8,
    textAlign: 'center',
  },
});