import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/api_real';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || (!isLogin && !name)) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await loginUser(email);
      } else {
        result = await registerUser(name, email);
      }

      if (result && result.success) {
        await AsyncStorage.setItem('userId', result.user_id.toString());
        await AsyncStorage.setItem('userName', result.name);
        navigation.replace('HomeTabs'); // Redirects to the main app interface
      } else {
        // Fallback safely if result.error is undefined
        Alert.alert('Authentication Failed', result?.error || 'Invalid response from server.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to the server. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
        
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{ marginTop: 20 }}>
          <Text style={styles.toggleText}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 4 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4A90E2', marginBottom: 25, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  toggleText: { color: '#666', textAlign: 'center', fontSize: 16 }
});