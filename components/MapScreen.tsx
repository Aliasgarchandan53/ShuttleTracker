import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { BluetoothDevice } from '../types/types';

const MapScreen = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [error, setError] = useState('');
  const [receivedData, setReceivedData] = useState<string[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
    }
  };

  const scanDevices = async () => {
    try {
      await requestPermissions();
      const available = await RNBluetoothClassic.getBondedDevices();
      setDevices(available);
      setError('');
    } catch (error: any) {
      console.error('Error listing devices:', error);
      setError(error.message);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      const connected = await (RNBluetoothClassic as any).connectToDevice(device.address);
      if (connected) {
        setConnectedDevice(device);
        startReading(); // Start listening to data
      }
    } catch (error:any) {
      console.error('Connection failed', error);
      setError('Connection failed: ' + error.message);
    }
  };

  const startReading = async () => {
    const sub = (RNBluetoothClassic as any).onDataReceived((event: { data: string }) => {
      console.log('Received:', event.data);
      setReceivedData(prev => [...prev, event.data]);
    });
    setSubscription(sub);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (subscription) subscription.remove();
    };
  }, [subscription]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button title="Scan Bluetooth Devices" onPress={scanDevices} />

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.name}</Text>
            <Button title="Connect" onPress={() => connectToDevice(item)} />
          </View>
        )}
      />

      {connectedDevice && (
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Connected to: {connectedDevice.name}</Text>
        </View>
      )}

      {error && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: 'red' }}>Connection error: {error}</Text>
        </View>
      )}

      {receivedData.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>📍 Received GPS Data:</Text>
          {receivedData.map((data, index) => (
            <Text key={index}>{data}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default MapScreen;



// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../types/types';
// import { useShuttleStore } from '../store/useShuttleStore'; // Zustand store with live location

// type Props = {
//   route: RouteProp<RootStackParamList, 'Map'>;
// };

// const MapScreen: React.FC<Props> = ({ route }) => {
//   const { shuttle } = route.params;

//   // Assume the shuttle store has location data
//   const liveLocation = useShuttleStore((state) => state.liveLocation);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Map for Shuttle:</Text>
//       <Text style={styles.subtitle}>{shuttle.from} ➜ {shuttle.to}</Text>

//       <MapView
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         region={{
//           latitude: liveLocation?.latitude || 12.9716, // fallback to BLR
//           longitude: liveLocation?.longitude || 77.5946,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >
//         {liveLocation && (
//           <Marker
//             coordinate={{
//               latitude: liveLocation.latitude,
//               longitude: liveLocation.longitude,
//             }}
//             title="Shuttle Location"
//             description={`${shuttle.from} ➜ ${shuttle.to}`}
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   title: { fontSize: 22, fontWeight: 'bold', padding: 16 },
//   subtitle: { fontSize: 16, paddingHorizontal: 16 },
//   map: {
//     flex: 1,
//     margin: 16,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
// });

// export default MapScreen;
