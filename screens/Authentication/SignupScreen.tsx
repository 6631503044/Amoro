import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential} from 'firebase/auth';
import { doc, setDoc} from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../../Backend/firebaseConfig'; 
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = () => {
  console.log('SignupScreen rendered'); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Replace with your client ID
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      // Create a new Firebase credential with the Google access token
      const credential = GoogleAuthProvider.credential(id_token);

      // Sign in with the credential
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Success', 'You are now signed in with Google!');
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Error', 'Failed to sign in with Google');
        });
    }
  }, [response]);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User created:', user.uid);

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        username: username, 
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
        <FontAwesome name="envelope" size={20} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
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
      <TouchableOpacity
        disabled={!request}
        title="Login with Google"
        onPress={() => {
          promptAsync();
        }}
      >
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
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
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
