import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SettingsButton from '../components/SettingsButton';
import UserHeader from '../components/UserHeader';

export default function Assignments() {
  const { username } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <UserHeader username={username as string} />

      <View style={styles.content}>
        <Text style={styles.text}>This is the My Day screen</Text>
      </View>

      <SettingsButton variant="circle" onPress={() => console.log('Settings from My Day')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
