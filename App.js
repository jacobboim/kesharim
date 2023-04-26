import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./src/providers";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

import themesContext from "./src/config/themesContext";
import themes from "./src/config/themes";
import { EventRegister } from "react-native-event-listeners";
import * as Device from "expo-device";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;
const getModleID = Device.modelId;
const osName = Device.osName;

//console log the hieght and width of the device and the model id all in one line
console.log(
  "Screen Height: " +
    screenHeight +
    " Screen Width: " +
    screenWidth +
    " Model ID: " +
    getModleID +
    " OS Name: " +
    osName
);

const App = () => {
  const [theme, setTheme] = useState("DEFAULT");

  useEffect(() => {
    // load saved color scheme on app load
    AsyncStorage.getItem("theme").then((savedTheme) => {
      if (savedTheme) {
        setTheme(savedTheme);
      }
    });

    // delte saved color scheme
    // AsyncStorage.removeItem("theme");

    let eventListener = EventRegister.addEventListener(
      "changeTheme",
      (data) => {
        setTheme(data);
        // save new color scheme to async storage
        AsyncStorage.setItem("theme", data);
      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  const getTheme = () => {
    switch (theme) {
      case "GRAY":
        return themes.gray;
      case "PURPLE":
        return themes.purple;
      case "PURPLE-GREEN":
        return themes.purpleGreen;
      case "CHARCOAL":
        return themes.Charcoal;
      case "BLUE-GREY":
        return themes.BlueGrey;
      default:
        return themes.default;
    }
  };

  useEffect(() => {
    const prepare = async () => {
      // keep splash screen visible
      await SplashScreen.preventAutoHideAsync();

      // pre-load your stuff
      await new Promise((resolve) => setTimeout(resolve, 500));

      // hide splash screen
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  return (
    <>
      <themesContext.Provider value={getTheme()}>
        <AuthenticatedUserProvider>
          <ActionSheetProvider>
            <SafeAreaProvider>
              <RootNavigator />
            </SafeAreaProvider>
          </ActionSheetProvider>
        </AuthenticatedUserProvider>
      </themesContext.Provider>
    </>
  );
};

export default App;
