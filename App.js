import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./src/providers";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <ActionSheetProvider>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </ActionSheetProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
