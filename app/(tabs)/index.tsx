import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Кликов: {count}</Text>
      <Pressable style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>Клик!</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212',
  },
  counter: {
    fontSize: 36, color: 'white', marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50', paddingVertical: 20, paddingHorizontal: 40, borderRadius: 10,
  },
  buttonText: {
    color: 'white', fontSize: 24,
  },
});
