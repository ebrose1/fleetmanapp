import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiService from '../services/api';
import { Vehicle, Employee } from '../types';
import {
  validateFleetNumber,
  validateEmployeeNumber,
  validateOdometer,
} from '../utils/validation';

export const VehicleSelectionScreen: React.FC<{
  navigation: any;
  route: any;
}> = ({ navigation, route }) => {
  const { inspectionType } = route.params;

  const [fleetNumber, setFleetNumber] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [odometer, setOdometer] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [lastOdometer, setLastOdometer] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [employeesData, vehiclesData] = await Promise.all([
        apiService.getEmployees(),
        apiService.getVehicles(),
      ]);
      setEmployees(employeesData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert(
        'Offline Mode',
        'Could not load employee/vehicle lists. You can still enter information manually, and it will sync when connected.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFleetNumberChange = async (text: string) => {
    setFleetNumber(text);
    
    // If we have 6 digits, try to fetch last odometer
    if (text.length === 6) {
      const vehicle = vehicles.find(v => v.fleetNumber === text);
      if (vehicle) {
        try {
          const lastReading = await apiService.getLastOdometer(vehicle.id);
          setLastOdometer(lastReading);
        } catch (error) {
          console.log('Could not fetch last odometer');
        }
      }
    }
  };

  const handleContinue = () => {
    // Validate fleet number
    if (!validateFleetNumber(fleetNumber)) {
      Alert.alert('Invalid Fleet Number', 'Fleet number must be 6 digits');
      return;
    }

    // Find vehicle by fleet number
    const vehicle = vehicles.find((v) => v.fleetNumber === fleetNumber);
    if (!vehicle) {
      Alert.alert(
        'Vehicle Not Found',
        `Vehicle ${fleetNumber} not found in database. Please check the number.`
      );
      return;
    }

    // Validate employee number
    if (!validateEmployeeNumber(employeeNumber)) {
      Alert.alert('Invalid Employee Number', 'Please select an employee');
      return;
    }

    // Find employee
    const employee = employees.find((e) => e.employeeNumber === employeeNumber);
    if (!employee) {
      Alert.alert(
        'Employee Not Found',
        'Selected employee not found in database'
      );
      return;
    }

    // Validate odometer
    const odometerValue = parseInt(odometer, 10);
    const odometerValidation = validateOdometer(odometerValue, lastOdometer);
    if (!odometerValidation.isValid) {
      Alert.alert('Invalid Odometer', odometerValidation.error || 'Invalid reading');
      return;
    }

    // Navigate to inspection screen
    if (inspectionType === 'pre-trip') {
      navigation.navigate('PreTripInspection', {
        vehicleId: vehicle.id,
        fleetNumber: vehicle.fleetNumber,
        employeeNumber: employee.employeeNumber,
        driverName: employee.fullName,
        odometer: odometerValue,
      });
    } else {
      navigation.navigate('PostTripInspection', {
        vehicleId: vehicle.id,
        fleetNumber: vehicle.fleetNumber,
        employeeNumber: employee.employeeNumber,
        driverName: employee.fullName,
        odometer: odometerValue,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>
          {inspectionType === 'pre-trip' ? 'Pre-Trip' : 'Post-Trip'} Inspection
        </Text>
        <Text style={styles.subtitle}>
          Enter vehicle and driver information
        </Text>

        {/* Fleet Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Fleet Number *</Text>
          <TextInput
            style={styles.input}
            value={fleetNumber}
            onChangeText={handleFleetNumberChange}
            placeholder="e.g., 445673"
            keyboardType="numeric"
            maxLength={6}
          />
          {lastOdometer !== null && (
            <Text style={styles.hint}>
              Last recorded odometer: {lastOdometer} miles
            </Text>
          )}
        </View>

        {/* Employee Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Driver Name *</Text>
          {employees.length > 0 ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={employeeNumber}
                onValueChange={setEmployeeNumber}
                style={styles.picker}
              >
                <Picker.Item label="Select your name..." value="" />
                {employees.map((emp) => (
                  <Picker.Item
                    key={emp.id}
                    label={emp.fullName}
                    value={emp.employeeNumber}
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={employeeNumber}
              onChangeText={setEmployeeNumber}
              placeholder="Employee Number"
            />
          )}
        </View>

        {/* Odometer Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Odometer Reading *</Text>
          <TextInput
            style={styles.input}
            value={odometer}
            onChangeText={setOdometer}
            placeholder="Current mileage"
            keyboardType="numeric"
          />
          <Text style={styles.hint}>
            Enter the current mileage reading. For corrections after submission,
            use the Mileage Log tab.
          </Text>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Inspection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});