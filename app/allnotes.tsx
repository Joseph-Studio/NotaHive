import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SettingsButton from '../components/SettingsButton';
import UserHeader from '../components/UserHeader';
import globalStyles from '../styles/globalStyles';

export default function AllNotes() {
  const { username } = useLocalSearchParams();

  return (
    <View style={globalStyles.container}>
      <UserHeader username={username as string} />

      <View style={globalStyles.content}>
        <Text style={globalStyles.text}>This is the My Day screen</Text>
      </View>

      <SettingsButton variant="circle" onPress={() => console.log('Settings from All Notes')} />
    </View>
  );
}
