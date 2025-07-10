import { supabase } from './supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'gift';
  gift_id?: string;
  status?: 'sent' | 'delivered' | 'read';
  read_at?: string;
  created_at: string;
  sender?: any;
  gift?: any;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  match_type: 'like' | 'gift';
  last_message: string;
  last_message_at: string;
  created_at: string;
  user1?: any;
  user2?: any;
}

export class ChatService {
  private static instance: ChatService;
  private subscriptions: Map<string, any> = new Map();

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Subscribe to real-time messages for a conversation
  subscribeToMessages(
    conversationId: string, 
    userId: string,
    onMessage: (message: Message) => void,
    onError?: (error: any) => void
  ) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          try {
            const newMessage = payload.new as Message;
            
            // Fetch complete message data with relations
            const { data: completeMessage, error } = await supabase
              .from('messages')
              .select(`
                *,
                sender:profiles!messages_sender_id_fkey(*),
                gift:gifts(*)
              `)
              .eq('id', newMessage.id)
              .single();

            if (error) {
              console.error('Error fetching complete message:', error);
              onError?.(error);
              return;
            }

            // Only notify if message is not from current user
            if (newMessage.sender_id !== userId) {
              onMessage(completeMessage);
              
              // Auto-mark as read if user is viewing the conversation
              this.markMessageAsRead(newMessage.id);
            }
          } catch (error) {
            console.error('Error processing new message:', error);
            onError?.(error);
          }
        }
      )
      .subscribe();

    this.subscriptions.set(conversationId, channel);
    return channel;
  }

  // Unsubscribe from conversation messages
  unsubscribeFromMessages(conversationId: string) {
    const channel = this.subscriptions.get(conversationId);
    if (channel) {
      supabase.removeChannel(channel);
      this.subscriptions.delete(conversationId);
    }
  }

  // Send a text message
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          message_type: 'text',
          status: 'sent',
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `)
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      // Update conversation's last message
      await this.updateConversationLastMessage(conversationId, content);

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // Send a gift message
  async sendGiftMessage(
    conversationId: string,
    senderId: string,
    giftId: string,
    message: string
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: message,
          message_type: 'gift',
          gift_id: giftId,
          status: 'sent',
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          gift:gifts(*)
        `)
        .single();

      if (error) {
        console.error('Error sending gift message:', error);
        return null;
      }

      // Update conversation's last message
      await this.updateConversationLastMessage(conversationId, '🎁 Sent a gift');

      return data;
    } catch (error) {
      console.error('Error sending gift message:', error);
      return null;
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          status: 'read',
          read_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error marking message as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          status: 'read',
          read_at: new Date().toISOString(),
        })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .is('read_at', null);

      if (error) {
        console.error('Error marking conversation as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
  }

  // Get unread message count for a conversation
  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .is('read_at', null);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Update conversation's last message
  private async updateConversationLastMessage(
    conversationId: string,
    lastMessage: string
  ): Promise<void> {
    try {
      await supabase
        .from('conversations')
        .update({
          last_message: lastMessage,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Error updating conversation last message:', error);
    }
  }

  // Create or find existing conversation
  async createOrFindConversation(
    user1Id: string,
    user2Id: string
  ): Promise<Conversation | null> {
    try {
      // Try to find existing conversation
      const { data: existingConversation, error: findError } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
        .maybeSingle();

      if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding conversation:', findError);
        return null;
      }

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          user1_id: user1Id,
          user2_id: user2Id,
          last_message: '',
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating conversation:', createError);
        return null;
      }

      return newConversation;
    } catch (error) {
      console.error('Error creating/finding conversation:', error);
      return null;
    }
  }

  // Clean up all subscriptions
  cleanup() {
    this.subscriptions.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.subscriptions.clear();
  }
}

export const chatService = ChatService.getInstance();