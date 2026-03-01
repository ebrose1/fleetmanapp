import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeScreen } from './app/screens/HomeScreen';
import { VehicleSelectionScreen } from './app/screens/VehicleSelectionScreen';
import { PreTripInspectionScreen } from './app/screens/PreTripInspectionScreen';
import { PostTripInspectionScreen } from './app/screens/PostTripInspectionScreen';
import { initDatabase } from './app/services/database';
import { startAutoSync } from './app/services/sync';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    // Initialize database on app start
    initDatabase()
      .then(() => {
        console.log('Database initialized');
        // Start auto-sync
        startAutoSync();
      })
      .catch((error) => {
        console.error('Database initialization failed:', error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VehicleSelection"
            component={VehicleSelectionScreen}
            options={{ title: 'Vehicle Selection' }}
          />
          <Stack.Screen
            name="PreTripInspection"
            component={PreTripInspectionScreen}
            options={{ title: 'Pre-Trip Inspection' }}
          />
          <Stack.Screen
            name="PostTripInspection"
            component={PostTripInspectionScreen}
            options={{ title: 'Post-Trip Inspection' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}