import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { View, TextInput, Button, Pressable, Text, StyleSheet, FlatList } from 'react-native';

const styles = StyleSheet.create({
  // Main container style for the screen layout
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userListContainer: {
    marginTop: 30,
    maxHeight: 200,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  userItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  userName: {
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  userDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
  },
});

const LoginScreen = () => {
  // State management for user input fields
  const [email, setEmail] = useState('');  // Stores email input
  const [password, setPassword] = useState('');  // Stores password input
  const [name, setName] = useState('');  // Stores name input
  const [users, setUsers] = useState([]);  // New state for user list

  // Fetch all users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Call fetchUsers when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handles user registration process
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Prevent default form submission behavior
    try {
      // Firebase authentication: Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;  // Get created user object

      // Firestore: Create document with UID as document ID
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        password: password,
        createdAt: new Date(),
      });
      await setDoc(doc(db,'users',user.uid,'tasks','task001'),{
        task: "just test if nested collection work!!!(please)"
      });

      console.log('User created and data saved!');
      fetchUsers();  // Refresh user list after successful registration
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header text for the registration screen */}
      <Text style={styles.header}>Sign Up</Text>
      
      {/* Name input field with state binding */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}  // Updates name state on text change
      />
      
      {/* Email input with email-specific keyboard settings */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"  // Displays email-optimized keyboard
        autoCapitalize="none"  // Prevents automatic capitalization
      />
      
      {/* Password input with secure text entry */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        
        secureTextEntry  // Masks password input
      />
      
      {/* Custom pressable button for submission */}
      <Pressable 
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
        onPress={(e) => handleSignUp(e as unknown as React.FormEvent<HTMLFormElement>)}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>

      {/* User list section */}
      <View style={styles.userListContainer}>
        <Text style={styles.sectionHeader}>Existing Users ({users.length})</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userDate}>
                Joined: {item.createdAt?.toDate().toLocaleDateString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found</Text>
          }
        />
      </View>
    </View>
  );
};

export default LoginScreen;
