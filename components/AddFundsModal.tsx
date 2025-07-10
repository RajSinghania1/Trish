import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, CreditCard, Banknote, Smartphone, Shield, Plus } from 'lucide-react-native';

interface AddFundsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFunds: (amount: number, paymentMethod: string) => Promise<void>;
  currentBalance: number;
}

const paymentMethods = [
  {
    id: 'credit_card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    fee: '2.9% + $0.30',
    processingTime: 'Instant'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: Banknote,
    description: 'Direct bank account transfer',
    fee: 'Free',
    processingTime: '1-3 business days'
  },
  {
    id: 'digital_wallet',
    name: 'Digital Wallet',
    icon: Smartphone,
    description: 'Apple Pay, Google Pay, PayPal',
    fee: '2.9%',
    processingTime: 'Instant'
  }
];

const quickAmounts = [100, 500, 1000, 2500, 5000, 10000];

export default function AddFundsModal({ visible, onClose, onAddFunds, currentBalance }: AddFundsModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('credit_card');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAddFunds = async () => {
    const numAmount = parseInt(amount);
    
    if (!numAmount || numAmount < 100) {
      Alert.alert('Invalid Amount', 'Minimum amount is 100 points ($1.00)');
      return;
    }

    if (numAmount > 100000) {
      Alert.alert('Invalid Amount', 'Maximum amount is 100,000 points ($1,000.00)');
      return;
    }

    setLoading(true);
    
    try {
      await onAddFunds(numAmount, selectedMethod);
      setAmount('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add funds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const selectedMethodData = paymentMethods.find(method => method.id === selectedMethod);
  const numAmount = parseInt(amount) || 0;
  const fee = selectedMethod === 'credit_card' ? Math.max(30, Math.round(numAmount * 0.029)) : 
               selectedMethod === 'digital_wallet' ? Math.round(numAmount * 0.029) : 0;
  const total = numAmount + fee;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Funds</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Balance */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>{currentBalance.toLocaleString()} points</Text>
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amount to Add</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text style={styles.amountSuffix}>points</Text>
            </View>
            <Text style={styles.amountSubtext}>
              ≈ ${(numAmount / 100).toFixed(2)} USD (1 point = $0.01)
            </Text>
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Select</Text>
            <View style={styles.quickAmountsGrid}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[
                    styles.quickAmountButton,
                    parseInt(amount) === quickAmount && styles.quickAmountButtonSelected
                  ]}
                  onPress={() => selectQuickAmount(quickAmount)}
                >
                  <Text style={[
                    styles.quickAmountText,
                    parseInt(amount) === quickAmount && styles.quickAmountTextSelected
                  ]}>
                    {quickAmount.toLocaleString()}
                  </Text>
                  <Text style={[
                    styles.quickAmountSubtext,
                    parseInt(amount) === quickAmount && styles.quickAmountSubtextSelected
                  ]}>
                    ${(quickAmount / 100).toFixed(0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethods}>
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentMethod,
                      selectedMethod === method.id && styles.paymentMethodSelected
                    ]}
                    onPress={() => setSelectedMethod(method.id)}
                  >
                    <View style={styles.paymentMethodIcon}>
                      <IconComponent size={24} color={selectedMethod === method.id ? '#E94E87' : '#6B7280'} />
                    </View>
                    <View style={styles.paymentMethodDetails}>
                      <Text style={[
                        styles.paymentMethodName,
                        selectedMethod === method.id && styles.paymentMethodNameSelected
                      ]}>
                        {method.name}
                      </Text>
                      <Text style={styles.paymentMethodDescription}>
                        {method.description}
                      </Text>
                      <View style={styles.paymentMethodMeta}>
                        <Text style={styles.paymentMethodFee}>Fee: {method.fee}</Text>
                        <Text style={styles.paymentMethodTime}>{method.processingTime}</Text>
                      </View>
                    </View>
                    {selectedMethod === method.id && (
                      <View style={styles.selectedIndicator}>
                        <View style={styles.selectedDot} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Transaction Summary */}
          {numAmount > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Points</Text>
                  <Text style={styles.summaryValue}>{numAmount.toLocaleString()}</Text>
                </View>
                {fee > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Processing Fee</Text>
                    <Text style={styles.summaryValue}>{fee} points</Text>
                  </View>
                )}
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryTotalLabel}>Total Cost</Text>
                  <Text style={styles.summaryTotalValue}>
                    ${(total / 100).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Shield size={20} color="#10B981" />
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We never store your payment details.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              (!numAmount || numAmount < 100 || loading) && styles.addButtonDisabled
            ]}
            onPress={handleAddFunds}
            disabled={!numAmount || numAmount < 100 || loading}
          >
            <LinearGradient
              colors={(!numAmount || numAmount < 100 || loading) ? ['#D1D5DB', '#D1D5DB'] : ['#E94E87', '#FF6B9D']}
              style={styles.addButtonGradient}
            >
              <Plus size={16} color={(!numAmount || numAmount < 100 || loading) ? "#9CA3AF" : "#FFFFFF"} />
              <Text style={[
                styles.addButtonText,
                (!numAmount || numAmount < 100 || loading) && styles.addButtonTextDisabled
              ]}>
                {loading ? 'Processing...' : `Add ${numAmount.toLocaleString()} Points`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  balanceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#E94E87',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    paddingVertical: 16,
  },
  amountSuffix: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  amountSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
  },
  quickAmountButtonSelected: {
    backgroundColor: '#E94E87',
    borderColor: '#E94E87',
  },
  quickAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickAmountTextSelected: {
    color: '#FFFFFF',
  },
  quickAmountSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickAmountSubtextSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  paymentMethodSelected: {
    borderColor: '#E94E87',
    backgroundColor: '#FEF2F2',
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentMethodNameSelected: {
    color: '#E94E87',
  },
  paymentMethodDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  paymentMethodMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  paymentMethodFee: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  paymentMethodTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E94E87',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E94E87',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginBottom: 0,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#E94E87',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#059669',
    lineHeight: 20,
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
  addButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonDisabled: {},
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  addButtonTextDisabled: {
    color: '#9CA3AF',
  },
});