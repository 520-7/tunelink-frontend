// src/screens/SignupScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootStackParamList';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignup = () => {
    // Add signup logic here
    navigation.navigate('Onboarding'); // Redirect to Onboarding page after signup
  };

  return (
      <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/app-logo.png')} style={styles.logo} />
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          placeholder="Enter your email"
          style={styles.input}
          theme={{ colors: { text: '#FFFFFF', placeholder: '#FFFFFF' } }} // Set white text and placeholder
            textColor='white'
        />
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          placeholder="Enter your username"
          style={styles.input}
          theme={{ colors: { text: '#FFFFFF', placeholder: '#FFFFFF' } }} // Set white text and placeholder
            textColor='white'
         />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          placeholder="Enter your password"
          style={styles.input}
          theme={{ colors: { text: '#FFFFFF', placeholder: '#FFFFFF' } }} // Set white text and placeholder
          textColor='white'
        />

        <Button mode="contained" onPress={handleSignup} style={styles.signupButton}>
          Sign Up
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
    paddingTop: 150, // Move the content down further
  },
  logoContainer: {
    flex: 0.6, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, 
    height: 200, 
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1.4, 
    paddingHorizontal: 16,
    justifyContent: 'flex-start', 
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1a1a1a', // Dark background for inputs
    color: '#FFFFFF', // White text
  },
  signupButton: {
    backgroundColor: '#4D4D4D', 
    marginTop: 20,
  },
  link: {
    color: '#A8EB12',
    textAlign: 'center',
    marginTop: 20,
    },
    purpleGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(157, 82, 255, 0.6)', // Purple color with transparency
    borderRadius: 150, // Circle shape
    shadowColor: '#A8EB12',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60, // Glow effect
    zIndex: -1, // Keep it behind the rest of the content
  },
});

export default SignupScreen;