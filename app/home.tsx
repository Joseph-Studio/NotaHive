import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SettingsButton from '../components/SettingsButton';
import UserHeader from '../components/UserHeader';

export const sections = [
    { label: 'My Day', route: 'myday', count: 0 },
    { label: 'Important', route: 'important', count: 0 },
    { label: 'Assignments', route: 'assignments', count: 0 },
    { label: 'Tasks', route: 'tasks', count: 0 },
    { label: 'All Notes', route: 'allnotes', count: 0 },
];

export default function HomePage() {
  const { username } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <UserHeader username={username as string} />
      <ScrollView style={styles.menu}>
        {sections.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push({ pathname: `/${item.route}`, params: { username } })}
          >
            <Text style={styles.menuText}>{item.label}</Text>
            <Text style={styles.count}>
              {item.count === 0 ? '0' : String(item.count).padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SettingsButton variant="circle" onPress={() => console.log('Home settings')} />

      <TouchableOpacity style={styles.newNote} onPress={() => router.push({ pathname: `/newnote`, params: { username } })}>
        <Text style={styles.newNoteText}>+ New Note</Text>
      </TouchableOpacity>
    </View>
  );
}

export const updateSectionCount = (route: string, increase: number) => {
  const section = sections.find(s => s.route === route);
  if (section) {
    section.count = section.count + increase;
  }
  const allNotesSection = sections.find(s => s.route === 'allnotes');
  if (allNotesSection) {
    allNotesSection.count = allNotesSection.count + increase;
  }
};

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
