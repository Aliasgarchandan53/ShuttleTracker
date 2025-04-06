import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';

type Props = {
  route: RouteProp<RootStackParamList, 'Map'>;
};

const MapScreen: React.FC<Props> = ({ route }) => {
  const { shuttle } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map for Shuttle:</Text>
      <Text style={styles.subtitle}>{shuttle.from} ➜ {shuttle.to}</Text>
      <View style={styles.mapPlaceholder}>
        <Text>[Map Placeholder]</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  mapPlaceholder: {
    backgroundColor: '#e0e0e0',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default MapScreen;
