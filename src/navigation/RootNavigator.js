import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { AuthenticatedUserContext } from "../providers";
import { LoadingIndicator } from "../components";
import { auth } from "../config";
// import * as Linking from "expo-linking";
// const prefix = Linking.createURL("/");

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  // const [linkData, setLinkData] = useState(null);

  const linking = {
    prefixes: ["speedster://"],
    config: {
      screens: {
        MultiGameJoinRealTime: "MultiGameJoinRealTime",
      },
    },
  };

  // function handleDeepLink(event) {
  //   let data = Linking.parse(event.url);
  //   setLinkData(data);
  // }

  // useEffect(() => {
  //   async function getInitialURL() {
  //     const initialURL = await Linking.getInitialURL();
  //     if (initialURL) {
  //       setLinkData(Linking.parse(initialURL));
  //     }
  //   }

  //   const link = Linking.addEventListener("url", handleDeepLink);
  //   if (!linkData) {
  //     getInitialURL();
  //   }

  //   return () => {
  //     link.remove();
  //   };
  // }, []);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer linking={linking}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
