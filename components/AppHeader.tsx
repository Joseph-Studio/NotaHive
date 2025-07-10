import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function AppHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Welcome{'\n'}To{'\n'}Students{'\n'}Notes</Text>
      <Image source={require('../assets/shrek.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
},

  title: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Cochin',
    marginBottom: 10,
  },
  image: {
    width: 120,
    height: 120,
  },
});
