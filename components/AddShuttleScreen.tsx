import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';

type Props = {
  navigation: any;
};

const AddShuttleScreen: React.FC<Props> = ({ navigation }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleAdd = () => {
    console.log('Added:', { from, to });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="From"
        value={from}
        onChangeText={setFrom}
        style={styles.input}
      />
      <TextInput
        placeholder="To"
        value={to}
        onChangeText={setTo}
        style={styles.input}
      />
      <Button title="Add Shuttle" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    color:'#fff',
    backgroundColor:'#000'
  },
});

export default AddShuttleScreen;
