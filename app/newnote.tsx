"use client"
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SettingsButton from '../components/SettingsButton';
import BackButton from '../components/BackButton';
import UserHeader from '../components/UserHeader';
import globalStyles from '../styles/globalStyles';
import NoteTypeDropdown, { NoteType } from '../components/NoteType';
import { sections, updateSectionCount } from './home';

export default function NewNotes() {
  const { username } = useLocalSearchParams();
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(true);
  const inputRef = React.useRef<TextInput>(null);
  const [selectedNoteType, setSelectedNoteType] = useState<NoteType>('MyDay');

  // If save, show note types to save after handle save. Else show default (aka: Add notes)

  return (
    <View style={globalStyles.container}>
      <UserHeader username={username as string} />

      <SafeAreaView style={globalStyles.content}>
        <Text style={styles.label}>New Note</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Type here..."
          value={text}
          onChangeText={setText}
          multiline={true}
          autoFocus
          onSubmitEditing={() => {
            setEditing(false);
            inputRef.current && inputRef.current.blur();
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Enter') {
              setEditing(false);
              inputRef.current && inputRef.current.blur();
            }
          }}
        />
        <NoteTypeDropdown selectedNoteType={selectedNoteType} setSelectedNoteType={setSelectedNoteType} />
      </SafeAreaView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: '#6200ee', borderRadius: 5 }}
          onPress={() => {
            if (text.trim() === '') {
              alert('Please enter some text before saving.');
              return;
            } else {
              updateSectionCount(selectedNoteType.toLowerCase(), 1);
              console.log(`Note saved as ${selectedNoteType}`);
              setText('');
              setEditing(true);
            }
            inputRef.current && inputRef.current.focus();
          }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Save Note</Text> 
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: '#f50057', borderRadius: 5 }}
          onPress={() => {
            setText('');
            setEditing(true);
            inputRef.current && inputRef.current.focus();
          }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Clear Note</Text>
        </TouchableOpacity>
      </View>

      <BackButton onPress={() => router.push({ pathname: `./home`, params: { username } })} variant="circle" />
      <SettingsButton variant="circle" onPress={() => console.log('Settings from New Notes')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20,
  },
  label: { 
    fontSize: 30, 
    marginBottom: 10,
    color: 'white',
    fontFamily: 'serif',
  },
  input: {
    height: '50%',
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    color:'white'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingInline : 30,
    paddingBottom: 20,
    backgroundColor: '#121212',
  },
});