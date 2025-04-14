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
import useShuttleStore from '../stores/ShuttleStore';
import Feather from 'react-native-vector-icons/Feather'; // ✅ import icon

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShuttleList'>;

const ShuttleListScreen: React.FC = () => {
  const shuttles = useShuttleStore((state) => state.shuttles);
  const removeShuttle = useShuttleStore((state:any) => state.removeShuttle);
  const navigation = useNavigation<NavigationProp>();
  const [filters, setFilters] = useState<FilterMap>({});
  const applyFilters = (shuttle: Shuttle) => {
    if (Object.keys(filters).length === 0) return true;
    return filters[shuttle.to];
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={shuttles.filter(applyFilters)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ShuttleDetail', { shuttle: item })
              }
              style={styles.shuttleInfo}
            >
              <Text style={styles.title}>
                Shuttle S{item.id} : {item.from} ➜ {item.to}
              </Text>
              <Text>Status: {item.active ? 'Running' : 'Not Running'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeShuttle(item.id)}
            >
              <Text style={styles.deleteButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shuttleInfo: {
    flex: 1,
    paddingRight: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  deleteButtonText: {
    color: '#fff', textAlign: 'center', fontWeight: 'bold'
  },
  deleteButton:{
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
  },
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
