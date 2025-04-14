import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
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
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import axios from 'axios';
// const SERVER_URL = 'http://172.17.16.26:3000/location';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = () => {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any | null>(null);
  const [receivedData, setReceivedData] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>({
    latitude: 0,
    longitude: 0,
  });
  const [region, setRegion] = useState<{
    latitude: any;
    longitude: any;
    latitudeDelta: number;
    longitudeDelta: number;
  }>({
    latitude: location?.latitude,
    longitude: location?.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(false);
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('Position:', position);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError('');
      },
      error => {
        console.log('Location error:', error.code, error.message);
        setError(error.message);
      },
    );
  };
  // const requestLocationPermission = async () => {
  //   try {
  //     const status = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Tracker app permission',
  //         message: 'Tracker needs to access your location',
  //         buttonNeutral: 'Ask me later',
  //         buttonNegative: 'No',
  //         buttonPositive: 'Allow',
  //       },
  //     );
  //     if (status === PermissionsAndroid.RESULTS.GRANTED) {
  //       Alert.alert('location permission granted');
  //       getLocation();
  //     }
  //   } catch (error) {
  //     setError('Permission error');
  //   }
  // };

  //zoom map
  const mapRef = useRef<any | null>(null);

  const zoomIn = () => {
    mapRef.current.animateToRegion(
      {
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      },
      500,
    );
  };

  const zoomOut = () => {
    mapRef.current.animateToRegion(
      {
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      },
      500,
    );
  };

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
      const connected = await RNBluetoothClassic.connectToDevice(
        device.address,
      );
      if (connected) {
        setConnectedDevice(device);
        startReading();

        // // Delay to ensure state is settled
        // if (device.name === 'HC-05' || device.name === 'ALI_S_MACHINE') {
        //   setTimeout(async () => {
        //     getLocation();
        //   }, 5000);  // give React time to stabilize state
        // }
      }
    } catch (err: any) {
      console.error('Connection failed', err);
      setError('Connection failed: ' + err.message);
    }
  };

  const startReading = () => {
    if (!connectedDevice) return;

    const sub = RNBluetoothClassic.onDeviceRead(
      connectedDevice.address,
      (event: {data: string}) => {
        console.log('Received:', event.data);
        setReceivedData(prev => [...prev, event.data]);
      },
    );
  };

  useEffect(() => {
    checkBluetoothStatus();
  }, []);

  useEffect(() => {
    if (location) {
      const newRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 500);
      }
    }
  }, [location]);

  if (bluetoothEnabled) {
    // Bluetooth-based GPS mode
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {!connectedDevice && (
          <Button title="Scan Bluetooth Devices" onPress={scanDevices} />
        )}

        {!connectedDevice && (
          <FlatList
            data={devices}
            keyExtractor={item => item.address}
            renderItem={({item}) => (
              <View style={styles.deviceItem}>
                <Text>{item.name}</Text>
                <Button title="Connect" onPress={() => connectToDevice(item)} />
              </View>
            )}
          />
        )}
        {connectedDevice && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              Connected to: {connectedDevice.name}
            </Text>
            {(location?.latitude==0 && location.longitude==0) && <TouchableOpacity
              style={{
                width: '90%',
                height: 50,
                margin: 20,
                backgroundColor: 'darkgreen',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
              onPress={getLocation}>
              <Text style={{color: '#fff'}}>Get Live Location</Text>
            </TouchableOpacity>}
          </View>
        )}
        {connectedDevice && location && (
          <View style={styles.mapContainer}>
            <MapView
              provider="google"
              style={styles.map}
              ref={mapRef}
              region={region}>
              <Marker coordinate={location} />
            </MapView>
          </View>
        )}

        {error && <Text style={styles.errorText}> {error}</Text>}

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
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  deviceItem: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#e0f0ff',
    borderRadius: 8,
    elevation: 2,
  },
  statusBox: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#d4edda',
    borderRadius: 8,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#155724',
  },
  dataBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
  locationBox: {
    marginTop: 30,
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
  },
  coordLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  coord: {
    fontWeight: 'normal',
    color: '#333',
  },
  mapContainer: {
    height: 400,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    backgroundColor: '#ccc',
  },
  map: {
    height: '100%',
    width: '100%',
  },
});

export default MapScreen;
