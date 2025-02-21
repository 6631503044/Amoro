import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig'; // Make sure your Firebase config is properly set up
import {doc, getDoc} from 'firebase/firestore'



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [testdata, setTestdata] = useState(null);
  const [testdataError, setTestdataError] = useState('');
  

  const fetchTestDocument = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', 'jNcFdpEN5gdD1xhA1frLuHHj1oe2','tasks','task001'));
      setTestdata(docSnap.data());
      setTestdataError('');
    } catch (error) {
      setTestdata(null);
      setTestdataError('Access denied: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      fetchTestDocument();
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetchTestDocument();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchTestDocument();
      } catch (error) {
        console.error('Initial fetch error:', error);
      }
    };
    
    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button title="Login" onPress={handleLogin} />
      <Text></Text>
      <Button title="Logout" onPress={handleLogout} />

      {user && (
        <View style={styles.userContainer}>
          <Button title="Logout" onPress={handleLogout} />
          <Text style={styles.userInfo}>User Data:</Text>
          <Text>Email: {user.email}</Text>
          <Text>UID: {user.uid}</Text>
          <Text>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</Text>
          <Text>Last Login: {user.metadata.lastSignInTime}</Text>
        </View>
      )}
      {testdata && (
        <View style={styles.testDataContainer}>
          <Text style={styles.testDataTitle}>Protected Data:</Text>
          <Text>email: {testdata.task}</Text>
          <Text>password: {testdata.password}</Text>
        </View>
      )}
      {testdataError && <Text style={styles.errorText}>{testdataError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  userContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  userInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  testDataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
  },
  testDataTitle: {
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
