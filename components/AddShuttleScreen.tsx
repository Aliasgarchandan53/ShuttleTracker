import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import useShuttleStore from '../stores/ShuttleStore';

type Props = {
  navigation: any;
};

const AddShuttleScreen: React.FC<Props> = ({ navigation }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [id,setId] = useState('');

  const addShuttle = useShuttleStore((state:any)=>state.addShuttle)
  const handleAdd = () => {
    addShuttle({
      id:id,
      from:from,
      to:to,
      active:true
    })
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Shuttle Id"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />
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
    backgroundColor:'#000',
  },
});

export default AddShuttleScreen;
