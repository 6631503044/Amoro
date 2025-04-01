"use client"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../context/AuthContext"
import AuthStack from "./AuthStack"
import MainTabs from "./MainTabs"
import AddTaskScreen from "../screens/AddTaskScreen"
import ActivityReviewScreen from "../screens/ActivityReviewScreen"
import AddReviewScreen from "../screens/AddReviewScreen"
import PartnerSettingsScreen from "../screens/PartnerSettingsScreen"
import AccountSettingsScreen from "../screens/AccountSettingsScreen"
import AppSettingsScreen from "../screens/AppSettingsScreen"
import ToDoListScreen from "../screens/ToDoListScreen"
import ShowTaskScreen from "../screens/ShowTaskScreen"
import EditTaskScreen from "../screens/EditTaskScreen"
import ChangePasswordScreen from "../screens/ChangePasswordScreen"
import ResetPasswordEmailScreen from "../screens/ResetPasswordEmailScreen"
import PermissionsScreen from "../screens/PermissionsScreen"
import AmoroIntroScreen from "../screens/AmoroIntroScreen"
import AddPartnerScreen from "../screens/AddPartnerScreen"

// Define the RootStackParamList to properly type the navigation
export type RootStackParamList = {
  AmoroIntro: undefined
  Auth: undefined
  ResetPasswordEmail: undefined
  Main: undefined
  AddTask: undefined
  ShowTask: { activityId: string }
  EditTask: { activityId: string }
  ToDoList: undefined
  ActivityReview: { activityId: string }
  AddReview: { activityId: string }
  PartnerSettings: undefined
  AccountSettings: undefined
  AppSettings: undefined
  ChangePassword: undefined
  Permissions: undefined
  AddPartner: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

const RootNavigator = () => {
  const { user } = useAuth()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="AmoroIntro" component={AmoroIntroScreen} />
          <Stack.Screen name="Auth" component={AuthStack} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ presentation: "modal" }} />
          <Stack.Screen name="ShowTask" component={ShowTaskScreen} />
          <Stack.Screen name="EditTask" component={EditTaskScreen} />
          <Stack.Screen name="ToDoList" component={ToDoListScreen} />
          <Stack.Screen name="ActivityReview" component={ActivityReviewScreen} />
          <Stack.Screen name="AddReview" component={AddReviewScreen} />
          <Stack.Screen name="PartnerSettings" component={PartnerSettingsScreen} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
          <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="ResetPasswordEmail" component={ResetPasswordEmailScreen} />
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
          <Stack.Screen name="AddPartner" component={AddPartnerScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator

