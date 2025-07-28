import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  onPress?: () => void;
  variant?: 'default' | 'circle'; // default: plain, circle: blue circle
};

export default function SettingsButton({ onPress, variant = 'default' }: Props) {
  if (variant === 'circle') {
    return (
      <TouchableOpacity onPress={onPress} style={styles.circleWrapper}>
        <View style={styles.circle}>
          <Feather name="settings" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.plain}>
      <Feather name="settings" size={22} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  plain: {
    // for login page, default 
  },
  circleWrapper: {
  alignSelf: 'flex-end',
  marginBottom: 16,
},

  circle: {
    backgroundColor: '#2196f3',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
