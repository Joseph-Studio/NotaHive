import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DD</Text>
        </View>
        <View>
          <Text style={styles.name}>Darshan Dahal ⌄</Text>
          <Text style={styles.email}>darshandahal304@gmail.com</Text>
        </View>
      </View>

      {/* List Menu */}
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

      <TouchableOpacity style={styles.settingsButton}>
        <Text style={styles.settingsGear}>⚙️</Text>
      </TouchableOpacity>

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
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: '#d81b60',
    borderRadius: 30,
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    color: '#fff',
    fontWeight: '700',
  },
  email: {
    color: '#bbb',
    fontSize: 12,
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
  settingsButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  settingsGear: {
    fontSize: 28,
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
