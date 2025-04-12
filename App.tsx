import { NavigationContainer } from "@react-navigation/native"
import RootNavigator from "./src/navigation/RootNavigator"
import { ThemeProvider } from "./src/context/ThemeContext"
import AuthProvider from "./src/context/AuthContext"
import { LanguageProvider } from "./src/context/LanguageContext"

//registerForPushNotificationsAsync();
export default function App() {

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

