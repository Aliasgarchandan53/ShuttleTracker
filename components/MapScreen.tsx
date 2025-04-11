import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  View,
  Text,
  Button,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import axios from 'axios';

const SERVER_URL = 'http://172.17.16.26:3000/location';

const MapScreen = () => {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any | null>(null);
  const [receivedData, setReceivedData] = useState<string[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
    }
  };

  const checkBluetoothStatus = async () => {
    const enabled = await RNBluetoothClassic.isBluetoothEnabled();
    setBluetoothEnabled(enabled);
  };

  const scanDevices = async () => {
    try {
      await requestPermissions();
      const available = await RNBluetoothClassic.getBondedDevices();
      setDevices(available);
      setError('');
    } catch (err: any) {
      console.error('Error listing devices:', err);
      setError(err.message);
    }
  };

  const connectToDevice = async (device: any) => {
    try {
      const connected = await RNBluetoothClassic.connectToDevice(device.address);
      if (connected) {
        setConnectedDevice(device);
        startReading();
      }
    } catch (err: any) {
      console.error('Connection failed', err);
      setError('Connection failed: ' + err.message);
    }
  };

  const startReading = () => {
    if (!connectedDevice) return;
  
    const sub = RNBluetoothClassic.onDeviceRead(connectedDevice.address, (event: { data: string }) => {
      console.log('Received:', event.data);
      setReceivedData(prev => [...prev, event.data]);
    });
  
    setSubscription(sub);
  };
  

  const fetchLocationFromServer = async () => {
    try {
      setLoading(true);
      const res = await axios.get(SERVER_URL, { timeout: 10000 });
      if (res.data.latitude && res.data.longitude) {
        setLocation({ latitude: res.data.latitude, longitude: res.data.longitude });
        setError('');
      } else {
        setError('Invalid location data');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBluetoothStatus();
    if (!bluetoothEnabled) {
      fetchLocationFromServer();
    }
  }, [bluetoothEnabled]);

  useEffect(() => {
    return () => {
      if (subscription) subscription.remove();
    };
  }, [subscription]);

  if (bluetoothEnabled) {
    // Bluetooth-based GPS mode
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Button title="Scan Bluetooth Devices" onPress={scanDevices} />

        <FlatList
          data={devices}
          keyExtractor={(item) => item.address}
          renderItem={({ item }) => (
            <View style={styles.deviceItem}>
              <Text>{item.name}</Text>
              <Button title="Connect" onPress={() => connectToDevice(item)} />
            </View>
          )}
        />

        {connectedDevice && (
          <View>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>Connected to: {connectedDevice.name}</Text>
          </View>
          <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE} 
            style={styles.map}
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
          </MapView>
        </View>
        </View>
        )}

        {/* {error && <Text style={styles.errorText}> {error}</Text>} */}

        {/* {receivedData.length > 0 ? (
          <View style={styles.dataBox}>
            <Text style={styles.dataTitle}> Received GPS Data:</Text>
            {receivedData.map((data, idx) => (
              <Text key={idx}>{data}</Text>
            ))}
          </View>
        ) : (
          <Text>No GPS data received yet.</Text>
        )} */}
      </ScrollView>
    );
  }

  // // Internet-based GPS mode
  // return (
  //   <View style={styles.container}>
  //     {loading ? (
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color="#0000ff" />
  //         <Text>Fetching location from server...</Text>
  //       </View>
  //     ) : location ? (
  //       <View style={styles.locationBox}>
  //         <Text style={styles.coordLabel}>📍 Latitude: <Text style={styles.coord}>{location.latitude}</Text></Text>
  //         <Text style={styles.coordLabel}>📍 Longitude: <Text style={styles.coord}>{location.longitude}</Text></Text>
  //       </View>
  //     ) : (
  //       <Text>No location data available.</Text>
  //     )}

  //     {error !== '' && (
  //       <Text style={styles.errorText}> {error}</Text>
  //     )}

  //     <Button title="Refresh Now" onPress={fetchLocationFromServer} />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', height: 200 },
  deviceItem: { marginVertical: 10 },
  statusBox: { marginVertical: 20 },
  statusText: { fontWeight: 'bold' },
  dataBox: { marginTop: 20 },
  dataTitle: { fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', marginTop: 10 },
  locationBox: { marginTop: 30 },
  coordLabel: { fontSize: 16, fontWeight: '600' },
  coord: { fontWeight: 'normal' },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
