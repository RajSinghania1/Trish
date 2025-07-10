import { useState, useEffect, useCallback } from 'react';
import { chatService, Message, Conversation } from '@/lib/chatService';
import { useAuth } from '@/contexts/AuthContext';

export function useChat(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load messages for a conversation
  const loadMessages = useCallback(async (convId: string) => {
    if (!convId || convId === 'new') return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: loadError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          gift:gifts(*)
        `)
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (loadError) {
        setError('Failed to load messages');
        console.error('Error loading messages:', loadError);
        return;
      }

      setMessages(data || []);
      
      // Mark conversation as read
      if (user?.id) {
        await chatService.markConversationAsRead(convId, user.id);
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Send a message
  const sendMessage = useCallback(async (content: string, convId?: string) => {
    if (!user?.id || !content.trim()) return false;
    
    const targetConversationId = convId || conversationId;
    if (!targetConversationId || targetConversationId === 'new') return false;

    try {
      setSending(true);
      setError(null);

      const message = await chatService.sendMessage(
        targetConversationId,
        user.id,
        content.trim()
      );

      if (message) {
        setMessages(prev => [...prev, message]);
        return true;
      } else {
        setError('Failed to send message');
        return false;
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      return false;
    } finally {
      setSending(false);
    }
  }, [user?.id, conversationId]);

  // Send a gift message
  const sendGiftMessage = useCallback(async (
    giftId: string, 
    message: string, 
    convId?: string
  ) => {
    if (!user?.id) return false;
    
    const targetConversationId = convId || conversationId;
    if (!targetConversationId || targetConversationId === 'new') return false;

    try {
      setSending(true);
      setError(null);

      const giftMessage = await chatService.sendGiftMessage(
        targetConversationId,
        user.id,
        giftId,
        message
      );

      if (giftMessage) {
        setMessages(prev => [...prev, giftMessage]);
        return true;
      } else {
        setError('Failed to send gift');
        return false;
      }
    } catch (err) {
      setError('Failed to send gift');
      console.error('Error sending gift:', err);
      return false;
    } finally {
      setSending(false);
    }
  }, [user?.id, conversationId]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId || conversationId === 'new' || !user?.id) return;

    const handleNewMessage = (message: Message) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    const handleError = (error: any) => {
      console.error('Real-time message error:', error);
      setError('Connection error');
    };

    // Subscribe to messages
    const channel = chatService.subscribeToMessages(
      conversationId,
      user.id,
      handleNewMessage,
      handleError
    );

    // Load initial messages
    loadMessages(conversationId);

    return () => {
      chatService.unsubscribeFromMessages(conversationId);
    };
  }, [conversationId, user?.id, loadMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    sendGiftMessage,
    loadMessages,
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadConversations = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: loadError } = await supabase
        .from('conversations')
        .select(`
          *,
          user1:profiles!conversations_user1_id_fkey(*),
          user2:profiles!conversations_user2_id_fkey(*)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (loadError) {
        setError('Failed to load conversations');
        console.error('Error loading conversations:', loadError);
        return;
      }

      setConversations(data || []);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    loadConversations,
  };
}