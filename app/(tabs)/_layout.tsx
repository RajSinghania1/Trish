import { Tabs } from 'expo-router';
import { Heart, MessageCircle, User, Compass, Wallet } from 'lucide-react-native';
import AuthGuard from '@/components/AuthGuard';

export default function TabsLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
            height: 88,
            paddingBottom: 20,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#E94E87',
          tabBarInactiveTintColor: '#999999',
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Inter-Medium',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size }) => (
              <Compass size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="connections"
          options={{
            title: 'Connections',
            tabBarIcon: ({ color, size }) => (
              <Heart size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="message"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, size }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ color, size }) => (
              <Wallet size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}