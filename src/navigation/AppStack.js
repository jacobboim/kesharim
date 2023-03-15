import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  HomeScreen,
  OneMinuteGame,
  FiveSecondGame,
  MultiGameJoin,
  MultiGame,
} from "../screens";

import { OneMinuteGame as OneMinuteGameOffline } from "../screens/OfflineGameModes/OneMinuteGame";
import DuelGame from "../screens/DuelGame";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OneMinuteGame"
        component={OneMinuteGame}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FiveSecondGame"
        component={FiveSecondGame}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DuelGame"
        component={DuelGame}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultiGameJoin"
        component={MultiGameJoin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultiGame"
        component={MultiGame}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OneMinuteGameOffline"
        component={OneMinuteGameOffline}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
