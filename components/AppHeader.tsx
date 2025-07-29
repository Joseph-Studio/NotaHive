import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function AppHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Welcome{'\n'}To</Text>
      <Image source={require('../assets/NotaHiveLogo2.png')} style={styles.image} />
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
    width: 300,
    height: 300,
  },
});
