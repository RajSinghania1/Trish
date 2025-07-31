import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Camera, X, RotateCcw, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 60) / 2;
const MIN_PHOTOS = 3;
const MAX_PHOTOS = 6;

interface Photo {
  id: string;
  uri: string;
  compressed?: string;
}

export default function PhotoUploadScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to upload photos.',
        [{ text: 'OK' }]
      );
    }
  };

  const compressImage = async (uri: string): Promise<string> => {
    try {
      const result = await manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      return result.uri;
    } catch (error) {
      console.error('Image compression failed:', error);
      return uri;
    }
  };

  const pickImage = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Maximum Photos', `You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        const compressedUri = await compressImage(result.assets[0].uri);
        
        const newPhoto: Photo = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          compressed: compressedUri,
        };

        setPhotos(prev => [...prev, newPhoto]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Maximum Photos', `You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera access to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        const compressedUri = await compressImage(result.assets[0].uri);
        
        const newPhoto: Photo = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          compressed: compressedUri,
        };

        setPhotos(prev => [...prev, newPhoto]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [removed] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, removed);
    setPhotos(newPhotos);
  };

  const replacePhoto = async (id: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        const compressedUri = await compressImage(result.assets[0].uri);
        
        setPhotos(prev => prev.map(photo => 
          photo.id === id 
            ? { ...photo, uri: result.assets[0].uri, compressed: compressedUri }
            : photo
        ));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to replace photo. Please try again.');
    }
  };

  const handleContinue = () => {
    if (photos.length < MIN_PHOTOS) {
      Alert.alert(
        'More Photos Needed',
        `Please upload at least ${MIN_PHOTOS} photos to continue.`
      );
      return;
    }

    // Save photos to context or storage
    router.push('/onboarding/date-of-birth');
  };

  const renderPhotoSlot = (index: number) => {
    const photo = photos[index];
    
    if (photo) {
      return (
        <View key={photo.id} style={styles.photoContainer}>
          <Image source={{ uri: photo.compressed || photo.uri }} style={styles.photo} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removePhoto(photo.id)}
          >
            <X size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.replaceButton}
            onPress={() => replacePhoto(photo.id)}
          >
            <RotateCcw size={16} color="#FFFFFF" />
          </TouchableOpacity>
          {index === 0 && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Main</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={`empty-${index}`}
        style={[
          styles.emptyPhotoSlot,
          index < MIN_PHOTOS && styles.requiredPhotoSlot
        ]}
        onPress={pickImage}
      >
        <Camera size={32} color={index < MIN_PHOTOS ? "#E94E87" : "#9CA3AF"} />
        <Text style={[
          styles.emptyPhotoText,
          index < MIN_PHOTOS && styles.requiredPhotoText
        ]}>
          {index < MIN_PHOTOS ? 'Required' : 'Optional'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#E94E87', '#FF6B9D']}
              style={[styles.progressFill, { width: '20%' }]}
            />
          </View>
          <Text style={styles.progressText}>1 of 5</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Your Photos</Text>
        <Text style={styles.subtitle}>
          Upload at least {MIN_PHOTOS} photos to show your personality. Your first photo will be your main profile picture.
        </Text>

        {/* Photo Requirements */}
        <View style={styles.requirementsCard}>
          <View style={styles.requirementItem}>
            {photos.length >= MIN_PHOTOS ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <AlertCircle size={20} color="#F59E0B" />
            )}
            <Text style={[
              styles.requirementText,
              photos.length >= MIN_PHOTOS && styles.requirementMet
            ]}>
              {photos.length}/{MIN_PHOTOS} minimum photos uploaded
            </Text>
          </View>
          <Text style={styles.requirementSubtext}>
            • Use clear, recent photos of yourself{'\n'}
            • Avoid group photos or heavily filtered images{'\n'}
            • Photos are automatically compressed for optimal quality
          </Text>
        </View>

        {/* Photo Grid */}
        <View style={styles.photoGrid}>
          {Array.from({ length: MAX_PHOTOS }, (_, index) => renderPhotoSlot(index))}
        </View>

        {/* Upload Options */}
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <LinearGradient
              colors={['#E94E87', '#FF6B9D']}
              style={styles.uploadButtonGradient}
            >
              <Camera size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
            <View style={styles.uploadButtonOutline}>
              <Camera size={20} color="#E94E87" />
              <Text style={styles.uploadButtonOutlineText}>Take Photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Photo Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Photo Tips</Text>
          <Text style={styles.tipsText}>
            • Show your face clearly in good lighting{'\n'}
            • Include full body shots and close-ups{'\n'}
            • Show your interests and hobbies{'\n'}
            • Smile and be authentic!
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            photos.length >= MIN_PHOTOS ? styles.continueButtonActive : styles.continueButtonInactive
          ]}
          onPress={handleContinue}
          disabled={photos.length < MIN_PHOTOS || loading}
        >
          <Text style={[
            styles.continueButtonText,
            photos.length >= MIN_PHOTOS ? styles.continueButtonTextActive : styles.continueButtonTextInactive
          ]}>
            {loading ? 'Processing...' : 'Continue'}
          </Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  requirementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  requirementMet: {
    color: '#10B981',
  },
  requirementSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.3,
    borderRadius: 16,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replaceButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#E94E87',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  primaryBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  emptyPhotoSlot: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.3,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  requiredPhotoSlot: {
    borderColor: '#E94E87',
    backgroundColor: '#FEF2F2',
  },
  emptyPhotoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  requiredPhotoText: {
    color: '#E94E87',
  },
  uploadOptions: {
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  uploadButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E94E87',
    borderRadius: 16,
    gap: 12,
  },
  uploadButtonOutlineText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E94E87',
  },
  tipsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#047857',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#E94E87',
  },
  continueButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  continueButtonTextActive: {
    color: '#FFFFFF',
  },
  continueButtonTextInactive: {
    color: '#9CA3AF',
  },
});