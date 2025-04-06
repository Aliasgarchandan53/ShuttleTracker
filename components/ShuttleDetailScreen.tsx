import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Shuttle } from '../types/types';

type Props = {
  route: RouteProp<RootStackParamList, 'ShuttleDetail'>;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShuttleDetail'>;

const ShuttleDetailScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { shuttle } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{shuttle.from} ➜ {shuttle.to}</Text>
      <Text>Status: {shuttle.active ? 'Running' : 'Not Running'}</Text>

      <Button
        title="View on Map"
        onPress={() => navigation.navigate('Map', { shuttle })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default ShuttleDetailScreen;
