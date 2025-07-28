import React from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SettingsButton from '../components/SettingsButton';
import UserHeader from '../components/UserHeader';
import globalStyles from '../styles/globalStyles';
import BackButton from '../components/BackButton';

export default function Assignments() {
  const { username } = useLocalSearchParams();

  return (
    <View style={globalStyles.container}>
      <UserHeader username={username as string} />

      <View style={globalStyles.content}>
        <Text style={globalStyles.text}>This is the Assignment screen</Text>
      </View>

      <BackButton onPress={() => router.push({ pathname: `./home`, params: { username } })} variant="circle" />
      <SettingsButton variant="circle" onPress={() => console.log('Settings from Assignments')} />
    </View>
  );
}
