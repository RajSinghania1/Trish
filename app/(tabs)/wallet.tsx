import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Banknote, Gift, TrendingUp, Clock, CircleCheck as CheckCircle, Circle as XCircle, Settings, Zap } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AddFundsModal from '@/components/AddFundsModal';
import PointPackagesModal from '@/components/PointPackagesModal';

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  transaction_type: 'credit' | 'debit';
  created_at: string;
  status?: 'completed' | 'pending' | 'failed';
}

export default function WalletScreen() {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData>({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showPackages, setShowPackages] = useState(false);

  const loadWalletData = async () => {
    if (!user?.id) return;

    try {
      // Load wallet balance
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        console.error('Error loading wallet:', walletError);
        return;
      }

      // Load transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (transactionsError) {
        console.error('Error loading transactions:', transactionsError);
        return;
      }

      setWalletData({
        balance: wallet?.balance || 0,
        transactions: transactions || []
      });
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  const handleAddFunds = async (amount: number, paymentMethod: string) => {
    if (!user?.id) return;

    try {
      // In a real app, you would process the payment here
      // For demo purposes, we'll simulate a successful transaction
      
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          amount: amount,
          description: `Added funds via ${paymentMethod}`,
          transaction_type: 'credit'
        });

      if (transactionError) {
        Alert.alert('Error', 'Failed to add funds. Please try again.');
        return;
      }

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .upsert({
          user_id: user.id,
          balance: walletData.balance + amount
        }, {
          onConflict: 'user_id'
        });

      if (walletError) {
        Alert.alert('Error', 'Failed to update balance. Please contact support.');
        return;
      }

      Alert.alert('Success', `Successfully added ${amount} points to your wallet!`);
      loadWalletData();
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handlePurchaseGift = async (giftPrice: number, giftName: string) => {
    if (walletData.balance < giftPrice) {
      Alert.alert('Insufficient Funds', 'You don\'t have enough points to purchase this gift.');
      return false;
    }

    try {
      // Deduct points from wallet
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user!.id,
          amount: -giftPrice,
          description: `Purchased ${giftName}`,
          transaction_type: 'debit'
        });

      if (transactionError) {
        Alert.alert('Error', 'Failed to process purchase. Please try again.');
        return false;
      }

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: walletData.balance - giftPrice })
        .eq('user_id', user!.id);

      if (walletError) {
        Alert.alert('Error', 'Failed to update balance. Please contact support.');
        return false;
      }

      loadWalletData();
      return true;
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.transaction_type === 'credit') {
      return <ArrowDownLeft size={20} color="#10B981" />;
    } else {
      return <ArrowUpRight size={20} color="#EF4444" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#10B981" />;
      case 'pending':
        return <Clock size={16} color="#F59E0B" />;
      case 'failed':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <CheckCircle size={16} color="#10B981" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Wallet</Text>
          <Text style={styles.headerSubtitle}>Manage your points and transactions</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#E94E87" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={['#E94E87', '#FF6B9D']}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceHeader}>
              <WalletIcon size={32} color="#FFFFFF" />
              <Text style={styles.balanceLabel}>Available Points</Text>
            </View>
            <Text style={styles.balanceAmount}>{walletData.balance.toLocaleString()}</Text>
            <Text style={styles.balanceSubtext}>≈ ${(walletData.balance / 100).toFixed(2)} USD</Text>
            
            <View style={styles.balanceActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowAddFunds(true)}
              >
                <Plus size={20} color="#E94E87" />
                <Text style={styles.actionButtonText}>Add Funds</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowPackages(true)}
              >
                <Zap size={20} color="#E94E87" />
                <Text style={styles.actionButtonText}>Packages</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>
              {walletData.transactions.filter(t => t.transaction_type === 'credit').length}
            </Text>
            <Text style={styles.statLabel}>Deposits</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Gift size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>
              {walletData.transactions.filter(t => t.transaction_type === 'debit').length}
            </Text>
            <Text style={styles.statLabel}>Gifts Sent</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>
              {walletData.transactions.filter(t => 
                new Date(t.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length}
            </Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {walletData.transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <WalletIcon size={48} color="#E5E7EB" />
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySubtitle}>
                Add funds to your wallet to get started
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {walletData.transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    {getTransactionIcon(transaction)}
                  </View>
                  
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <View style={styles.transactionMeta}>
                      <Text style={styles.transactionDate}>
                        {formatDate(transaction.created_at)}
                      </Text>
                      {getStatusIcon(transaction.status)}
                    </View>
                  </View>
                  
                  <View style={styles.transactionAmount}>
                    <Text style={[
                      styles.transactionAmountText,
                      transaction.transaction_type === 'credit' 
                        ? styles.creditAmount 
                        : styles.debitAmount
                    ]}>
                      {transaction.transaction_type === 'credit' ? '+' : '-'}
                      {Math.abs(transaction.amount).toLocaleString()}
                    </Text>
                    <Text style={styles.transactionAmountSubtext}>points</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Funds Modal */}
      <AddFundsModal
        visible={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        onAddFunds={handleAddFunds}
        currentBalance={walletData.balance}
      />

      {/* Point Packages Modal */}
      <PointPackagesModal
        visible={showPackages}
        onClose={() => setShowPackages(false)}
        onPurchase={handleAddFunds}
        currentBalance={walletData.balance}
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
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#E94E87',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceGradient: {
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  balanceLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  balanceAmount: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  balanceSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  transactionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  creditAmount: {
    color: '#10B981',
  },
  debitAmount: {
    color: '#EF4444',
  },
  transactionAmountSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
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