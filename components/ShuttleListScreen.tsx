import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Shuttle, FilterMap } from '../types/types';

const shuttleData: Shuttle[] = [
  { id: '1', from: 'Campus', to: 'Gate 1', active: true },
  { id: '2', from: 'Campus', to: 'Gate 2', active: false },
  { id: '3', from: 'Hostel', to: 'Main Block', active: true },
];

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShuttleList'>;

const ShuttleListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [filters, setFilters] = useState<FilterMap>({});

  const applyFilters = (shuttle: Shuttle) => {
    if (Object.keys(filters).length === 0) return true;
    return filters[shuttle.to];
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={shuttleData.filter(applyFilters)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ShuttleDetail', { shuttle: item })}
          >
            <Text style={styles.title}>Shuttle S{item.id} : {item.from} ➜ {item.to}</Text>
            <Text>Status: {item.active ? 'Running' : 'Not Running'}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddShuttle')}
        >
          <Text style={styles.buttonText}>+ Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Filter')}
        >
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default ShuttleListScreen;
