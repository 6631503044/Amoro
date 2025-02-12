import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc} from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../../Backend/firebaseConfig'; 
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  console.log('SignupScreen rendered'); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User created:', user.uid);

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        password: password,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      console.error('Error during sign-up:', error);
      Alert.alert('Error', error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or continue with email</Text>
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="google" size={20} color="red" />
        <Text style={styles.socialButtonText}>Login with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="apple" size={20} color="black" />
        <Text style={styles.socialButtonText}>Login with Apple</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or have account already?</Text>
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDECE4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#F28B82',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 10,
    color: '#888',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '100%',
    justifyContent: 'center',
  },
  socialButtonText: {
    marginLeft: 10,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#F28B82',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
