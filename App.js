import React, { useEffect, useState } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./src/providers";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";

import themesContext from "./src/config/themesContext";
import themes from "./src/config/themes";
import { EventRegister } from "react-native-event-listeners";

const App = () => {
  const [theme, setTheme] = useState("DEFAULT");

  // useEffect(() => {
  //   let eventListener = EventRegister.addEventListener(
  //     "changeTheme",
  //     (data) => {
  //       setTheme(data);
  //     }
  //   );
  //   return () => {
  //     EventRegister.removeEventListener(eventListener);
  //   };
  // });

  useEffect(() => {
    // load saved color scheme on app load
    AsyncStorage.getItem("theme").then((savedTheme) => {
      if (savedTheme) {
        setTheme(savedTheme);
      }
    });

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
      case "BLUE":
        return themes.blue;
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
