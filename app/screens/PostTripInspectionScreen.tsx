import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { InspectionForm } from '../components/InspectionForm';
import { PhotoCapture } from '../components/PhotoCapture';
import { InspectionData } from '../types';
import { saveInspectionLocally } from '../services/database';
import { syncInspections } from '../services/sync';

export const PostTripInspectionScreen: React.FC<{
  navigation: any;
  route: any;
}> = ({ navigation, route }) => {
  const { vehicleId, fleetNumber, employeeNumber, driverName, odometer } =
    route.params;

  const [inspectionData, setInspectionData] = useState<Partial<InspectionData>>(
    {}
  );
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (field: keyof InspectionData, value: any) => {
    setInspectionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const detectWarnings = (): string[] => {
    const warnings: string[] = [];

    // Check all boolean fields for "No" answers
    Object.entries(inspectionData).forEach(([key, value]) => {
      if (value === false) {
        const readable = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());
        warnings.push(readable);
      }
    });

    return warnings;
  };

  const handleSubmit = async () => {
    const warnings = detectWarnings();

    if (warnings.length > 0) {
      Alert.alert(
        'Issues Detected',
        `The following issues were found:\n\n${warnings
          .slice(0, 5)
          .join('\n')}${warnings.length > 5 ? '\n... and more' : ''}\n\nThese will be flagged for manager review.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit Anyway', onPress: () => submitInspection() },
        ]
      );
    } else {
      submitInspection();
    }
  };

  const submitInspection = async () => {
    setSubmitting(true);

    try {
      const completeData: InspectionData = {
        vehicleId,
        fleetNumber,
        employeeNumber,
        driverName,
        inspectionType: 'post-trip',
        inspectionDate: new Date().toISOString(),
        odometer,
        ...inspectionData,
        photoUrls: photos,
      };

      // Save locally first
      await saveInspectionLocally({ ...completeData, synced: false });

      // Try to sync immediately
      await syncInspections();

      Alert.alert(
        'Inspection Submitted',
        'Your post-trip inspection has been saved. Have a great day!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to save inspection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post-Trip Inspection</Text>
        <Text style={styles.headerSubtitle}>
          Vehicle: {fleetNumber} • Driver: {driverName}
        </Text>
      </View>

      <InspectionForm
        inspectionType="post-trip"
        data={inspectionData}
        onChange={handleFieldChange}
      />

      <View style={styles.footer}>
        <PhotoCapture photos={photos} onPhotosChange={setPhotos} />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Inspection</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});