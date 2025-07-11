import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SettingsButton from '../components/SettingsButton';
import UserHeader from '../components/UserHeader';

export default function HomePage() {
  const { username } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <UserHeader username={username as string} />

      <ScrollView style={styles.menu}>
        {[
          { label: 'My Day', count: 13 },
          { label: 'Important', count: 5 },
          { label: 'Assignments', count: 3 },
          { label: 'Tasks', count: 2 },
          { label: 'All Notes', count: 15 },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Text style={styles.menuText}>{item.label}</Text>
            <Text style={styles.count}>{String(item.count).padStart(2, '0')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SettingsButton variant="circle" onPress={() => console.log('Home settings')} />

      <TouchableOpacity style={styles.newNote}>
        <Text style={styles.newNoteText}>+ New Note</Text>
      </TouchableOpacity>
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
  menu: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2e2e2e',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  menuText: {
    color: '#fff',
    fontWeight: '600',
  },
  count: {
    color: '#fff',
    fontWeight: '600',
  },
  newNote: {
    backgroundColor: '#2e2e2e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  newNoteText: {
    color: '#fff',
    fontWeight: '600',
  },
});
