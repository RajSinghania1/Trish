import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Zap, Crown, Star, Gift } from 'lucide-react-native';

interface PointPackagesModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: (amount: number, paymentMethod: string) => void;
  currentBalance: number;
}

interface PointPackage {
  id: string;
  points: number;
  price: number;
  bonus: number;
  popular?: boolean;
  bestValue?: boolean;
  icon: any;
  color: string[];
}

export default function PointPackagesModal({ visible, onClose, onPurchase, currentBalance }: PointPackagesModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<PointPackage | null>(null);
  const [loading, setLoading] = useState(false);

  const packages: PointPackage[] = [
    {
      id: 'starter',
      points: 100,
      price: 0.99,
      bonus: 0,
      icon: Zap,
      color: ['#10B981', '#34D399']
    },
    {
      id: 'popular',
      points: 500,
      price: 4.99,
      bonus: 50,
      popular: true,
      icon: Star,
      color: ['#F59E0B', '#FBBF24']
    },
    {
      id: 'premium',
      points: 1000,
      price: 9.99,
      bonus: 150,
      icon: Crown,
      color: ['#8B5CF6', '#A78BFA']
    },
    {
      id: 'ultimate',
      points: 2500,
      price: 19.99,
      bonus: 500,
      bestValue: true,
      icon: Gift,
      color: ['#E94E87', '#FF6B9D']
    }
  ];

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const totalPoints = selectedPackage.points + selectedPackage.bonus;
      await onPurchase(totalPoints, 'Credit Card');
      
      Alert.alert(
        'Purchase Successful!',
        `You've received ${totalPoints} points!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  const renderPackage = (pkg: PointPackage) => {
    const IconComponent = pkg.icon;
    const isSelected = selectedPackage?.id === pkg.id;
    
    return (
      <TouchableOpacity
        key={pkg.id}
        style={[
          styles.packageCard,
          isSelected && styles.selectedPackage
        ]}
        onPress={() => setSelectedPackage(pkg)}
      >
        <LinearGradient
          colors={isSelected ? pkg.color : ['#FFFFFF', '#F8FAFC']}
          style={styles.packageGradient}
        >
          {/* Badge */}
          {(pkg.popular || pkg.bestValue) && (
            <View style={[
              styles.badge,
              pkg.popular && styles.popularBadge,
              pkg.bestValue && styles.bestValueBadge
            ]}>
              <Text style={styles.badgeText}>
                {pkg.popular ? 'POPULAR' : 'BEST VALUE'}
              </Text>
            </View>
          )}

          {/* Icon */}
          <View style={[
            styles.iconContainer,
            { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#F3F4F6' }
          ]}>
            <IconComponent 
              size={24} 
              color={isSelected ? '#FFFFFF' : pkg.color[0]} 
            />
          </View>

          {/* Points */}
          <Text style={[
            styles.pointsText,
            { color: isSelected ? '#FFFFFF' : '#1F2937' }
          ]}>
            {pkg.points.toLocaleString()}
          </Text>

          {/* Bonus */}
          {pkg.bonus > 0 && (
            <Text style={[
              styles.bonusText,
              { color: isSelected ? 'rgba(255,255,255,0.9)' : '#10B981' }
            ]}>
              +{pkg.bonus} bonus
            </Text>
          )}

          {/* Price */}
          <Text style={[
            styles.priceText,
            { color: isSelected ? '#FFFFFF' : '#1F2937' }
          ]}>
            ${pkg.price}
          </Text>

          {/* Total */}
          <Text style={[
            styles.totalText,
            { color: isSelected ? 'rgba(255,255,255,0.8)' : '#6B7280' }
          ]}>
            {(pkg.points + pkg.bonus).toLocaleString()} total points
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

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
                <Zap size={20} color="#FFFFFF" />
                <Text style={styles.title}>Point Packages</Text>
              </View>
              <Text style={styles.subtitle}>Choose your perfect package</Text>
              <Text style={styles.balanceText}>
                Current balance: {currentBalance.toLocaleString()} pts
              </Text>
            </View>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        {/* Packages */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.packagesGrid}>
            {packages.map(renderPackage)}
          </View>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Why buy points?</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Gift size={20} color="#E94E87" />
                <Text style={styles.benefitText}>Send amazing gifts to your matches</Text>
              </View>
              <View style={styles.benefitItem}>
                <Star size={20} color="#E94E87" />
                <Text style={styles.benefitText}>Stand out with premium features</Text>
              </View>
              <View style={styles.benefitItem}>
                <Crown size={20} color="#E94E87" />
                <Text style={styles.benefitText}>Unlock exclusive content</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        {selectedPackage && (
          <View style={styles.footer}>
            <View style={styles.selectedPackageInfo}>
              <Text style={styles.selectedPackageTitle}>
                {(selectedPackage.points + selectedPackage.bonus).toLocaleString()} Points
              </Text>
              <Text style={styles.selectedPackagePrice}>
                ${selectedPackage.price}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.purchaseButton,
                loading && styles.purchaseButtonDisabled
              ]}
              onPress={handlePurchase}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#D1D5DB', '#D1D5DB'] : ['#E94E87', '#FF6B9D']}
                style={styles.purchaseButtonGradient}
              >
                <Text style={[
                  styles.purchaseButtonText,
                  loading && styles.purchaseButtonTextDisabled
                ]}>
                  {loading ? 'Processing...' : 'Purchase Package'}
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
    marginTop: 4,
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
  content: {
    flex: 1,
    padding: 20,
  },
  packagesGrid: {
    gap: 16,
    marginBottom: 32,
  },
  packageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedPackage: {
    shadowColor: '#E94E87',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  packageGradient: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadge: {
    backgroundColor: '#F59E0B',
  },
  bestValueBadge: {
    backgroundColor: '#10B981',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  bonusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  benefitsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 16,
  },
  selectedPackageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPackageTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  selectedPackagePrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#E94E87',
  },
  purchaseButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  purchaseButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {},
  purchaseButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  purchaseButtonTextDisabled: {
    color: '#9CA3AF',
  },
});