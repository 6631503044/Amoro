import * as Google from "expo-auth-session/providers/google";
import { Alert } from "react-native";

export const handleGoogleSignIn = async (API_URL: string, promptAsync: () => Promise<any>, response: any) => {
    
  if (response?.type === 'success') {
    const { authentication } = response;
    console.log('Google Auth Success:', response);

    // Post the authentication result to your backend
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: authentication.accessToken,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to authenticate with backend');
      }

      const data = await res.json();
      console.log('Backend response:', data);

      // Handle successful backend response
      // For example, store user data in AsyncStorage or navigate to another screen
    } catch (error) {
      console.error('Error posting to backend:', error);
      Alert.alert('Error', 'Failed to authenticate with backend. Please try again.');
    }
  }
};
