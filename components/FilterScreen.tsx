import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';

const FilterScreen: React.FC = () => {
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({
    'Gate 1': true,
    'Gate 2': false,
    'Main Block': true,
  });

  const toggle = (selectedKey: string) => {
    const updatedFilters = Object.fromEntries(
      Object.keys(filters).map((key) => [key, key === selectedKey])
    );
    setFilters(updatedFilters);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(filters).map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Text>{key}</Text>
          <Switch value={value} onValueChange={() => toggle(key)} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
});

export default FilterScreen;
