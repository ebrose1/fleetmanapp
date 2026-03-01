import * as FileSystem from 'expo-file-system';

const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'fleet_inspections'; // We'll create this preset

export const uploadPhoto = async (photoUri: string): Promise<string> => {
  try {
    const formData = new FormData();
    
    // Read file and prepare for upload
    const fileInfo = await FileSystem.getInfoAsync(photoUri);
    if (!fileInfo.exists) {
      throw new Error('Photo file not found');
    }

    // Create file object for upload
    const file = {
      uri: photoUri,
      type: 'image/jpeg',
      name: `inspection-${Date.now()}.jpg`,
    } as any;

    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'fleet-inspections');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Returns the photo URL
  } catch (error) {
    console.error('Photo upload error:', error);
    throw error;
  }
};