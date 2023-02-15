import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Timer from "../screens/Timer";

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="timer"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="timer" component={Timer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
