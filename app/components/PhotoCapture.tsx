import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhoto } from '../services/cloudinary';

interface PhotoCaptureProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  photos,
  onPhotosChange,
}) => {
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to take photos'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Compress to reduce size
      });

      if (!result.canceled && result.assets[0]) {
        await handlePhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error('Camera error:', error);
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        await handlePhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select photo');
      console.error('Gallery error:', error);
    }
  };

  const handlePhotoSelected = async (uri: string) => {
    setUploading(true);
    try {
      const photoUrl = await uploadPhoto(uri);
      onPhotosChange([...photos, photoUrl]);
      Alert.alert('Success', 'Photo uploaded successfully');
    } catch (error) {
      Alert.alert('Upload Failed', 'Photo saved locally and will sync later');
      // Store local URI for now - we can upload during sync
      onPhotosChange([...photos, uri]);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const newPhotos = photos.filter((_, i) => i !== index);
          onPhotosChange(newPhotos);
        },
      },
    ]);
  };

  const showPhotoOptions = () => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Photos (Optional)</Text>
      <Text style={styles.hint}>
        Attach photos of any issues or damage found
      </Text>

      {photos.length > 0 && (
        <ScrollView
          horizontal
          style={styles.photoScrollView}
          showsHorizontalScrollIndicator={false}
        >
          {photos.map((photoUri, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photoThumbnail} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.addPhotoButton}
        onPress={showPhotoOptions}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addPhotoButtonText}>
            + Add Photo ({photos.length})
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  photoScrollView: {
    marginBottom: 12,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addPhotoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});