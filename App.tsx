import { NavigationContainer } from "@react-navigation/native";
import BottomNavigation from "./components/Navigation/BottomTabNavigator";

export default function App() {
  return (
    <NavigationContainer> 
      <BottomNavigation />
    </NavigationContainer>
  );
}
