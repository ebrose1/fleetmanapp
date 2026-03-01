import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { syncInspections } from '../services/sync';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Try to sync on mount
    handleSync();

    return () => clearInterval(timer);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncInspections();
      if (result.success > 0) {
        Alert.alert(
          'Sync Complete',
          `Successfully synced ${result.success} inspection(s)`
        );
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isPostTripTime = () => {
    const hour = currentTime.getHours();
    return hour >= 14; // After 2 PM suggest post-trip
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Vehicle Inspection Reports</Text>
        <Text style={styles.subtitle}>Welcome, Driver</Text>
        <Text style={styles.description}>
          Complete your daily vehicle inspection reports here
        </Text>

        <Text style={styles.time}>Current Time: {formatTime(currentTime)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('VehicleSelection', {
                inspectionType: 'pre-trip',
              })
            }
          >
            <Text style={styles.buttonTitle}>Pre-Trip Inspection</Text>
            <Text style={styles.buttonSubtitle}>
              Complete before starting your route
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              isPostTripTime() && styles.buttonRecommended,
            ]}
            onPress={() =>
              navigation.navigate('VehicleSelection', {
                inspectionType: 'post-trip',
              })
            }
          >
            <Text style={styles.buttonTitle}>Post-Trip Inspection</Text>
            <Text style={styles.buttonSubtitle}>
              Complete after returning to base
            </Text>
            {isPostTripTime() && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended Now</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionItem}>
            • Complete your pre-trip inspection before leaving the depot
          </Text>
          <Text style={styles.instructionItem}>
            • Complete your post-trip inspection when returning to base
          </Text>
          <Text style={styles.instructionItem}>
            • Report any issues immediately to management
          </Text>
          <Text style={styles.instructionItem}>
            • Ensure your odometer reading is accurate
          </Text>
          <Text style={styles.instructionItem}>
            • All fields marked with * are required
          </Text>
        </View>

        {syncing && (
          <Text style={styles.syncStatus}>Syncing data...</Text>
        )}
      </View>

      <Text style={styles.footer}>FleetPro Driver Portal</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  time: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 32,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonRecommended: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  recommendedBadge: {
    marginTop: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  recommendedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  instructionItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  syncStatus: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
    marginTop: 16,
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    paddingVertical: 16,
  },
});