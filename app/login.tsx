import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <AppHeader />

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.signInTitle}>Sign in</Text>
          <TouchableOpacity>
            <Feather name="settings" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Username Field */}
        <Text style={styles.label}>User name</Text>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your user name"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Password Field */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#888"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Remember & Forgot */}
        <View style={styles.rememberRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setRemember(!remember)}
          >
            <View style={styles.checkboxBox}>
              {remember && <View style={styles.checkboxCheck} />}
            </View>
            <Text style={styles.rememberLabel}>Remember me</Text>
          </TouchableOpacity>

          <Text style={styles.forgotText}>Forgot Password ?</Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Register */}
        <Text style={styles.registerText}>
          Don’t have an Account? <Text style={styles.registerLink}>Register</Text>
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#320b86',
  },
  card: {
    flex: 1,
    backgroundColor: '#eee',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 6,
  },
  eyeIcon: {
    marginLeft: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxCheck: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
  },
  rememberLabel: {
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    color: '#555',
  },
  loginBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    color: '#000',
  },
});
