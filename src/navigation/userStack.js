import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OneMinuteGame from "../screens/OneMinuteGame";

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyle: {
            backgroundColor: "#0e1529",
          },
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="OneMinuteGame"
          component={OneMinuteGame}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
