import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  FlatList,
  Pressable,
} from "react-native";
import { signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedButton } from "react-native-really-awesome-button";
import AwesomeButton from "react-native-really-awesome-button";

import { useAuth } from "../hooks/useAuth";
import { auth } from "../config";

import { Fontisto, Feather } from "@expo/vector-icons";

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [minTouched, setMinTouched] = useState(false);

  const [speedTouched, setSpeedTouched] = useState(false);

  useEffect(() => {
    console.log("user: ", user);
  }, [user]);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const buttonData = [
    {
      name: "bruce",
      type: "primary",
      onPressOut: () => navigation.navigate("OneMinuteGame"),
      width: 110,
      height: 110,
      borderRadius: 150,
      backgroundColor: "#818384",
      icon: "stopwatch",
      label: "1 MIN",
    },
    {
      name: "bruce",
      type: "primary",
      onPressOut: () => navigation.navigate("FiveSecondGame"),
      width: 110,
      height: 110,
      borderRadius: 150,
      backgroundColor: "#818384",
      icon: "stopwatch",
      label: "Speed",
    },
    {
      name: "bruce",
      type: "primary",
      onPressOut: () => navigation.navigate("DuelGame"),
      width: 110,
      height: 110,
      borderRadius: 150,
      backgroundColor: "#818384",
      icon: "stopwatch",
      label: "Duel",
    },
  ];

  return (
    <LinearGradient
      colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <Text style={styles.gameName}>Kesharim</Text>
        <View style={styles.gameOptionsContatier}>
          <FlatList
            data={buttonData}
            numColumns={2}
            // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <View style={{ margin: 10 }}>
                <ThemedButton
                  name={item.name}
                  type={item.type}
                  onPressOut={item.onPressOut}
                  width={item.width}
                  height={item.height}
                  borderRadius={item.borderRadius}
                  backgroundColor={item.backgroundColor}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Fontisto name={item.icon} size={60} color="white" />
                    <Text style={{ fontSize: 20, color: "white" }}>
                      {item.label}
                    </Text>
                  </View>
                </ThemedButton>
              </View>
            )}
          />
          {/* <ThemedButton
            name="bruce"
            type="primary"
            onPressOut={() => navigation.navigate("OneMinuteGame")}
            width={150}
            height={150}
            borderRadius={150}
            backgroundColor="#818384"
            // before={<Fontisto name="stopwatch" size={70} color="white" />}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Fontisto name="stopwatch" size={70} color="white" />
              <Text style={{ fontSize: 35, color: "white" }}>1 MIN</Text>
            </View>
          </ThemedButton>

          <ThemedButton
            name="bruce"
            type="primary"
            onPressOut={() => navigation.navigate("FiveSecondGame")}
            width={150}
            height={150}
            borderRadius={150}
            backgroundColor="#818384"
            // before={<Fontisto name="stopwatch" size={70} color="white" />}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Fontisto name="stopwatch" size={70} color="white" />
              <Text style={{ fontSize: 35, color: "white" }}>Speed</Text>
            </View>
          </ThemedButton>

          <ThemedButton
            name="bruce"
            type="primary"
            onPressOut={() => navigation.navigate("DuelGame")}
            width={150}
            height={150}
            borderRadius={150}
            backgroundColor="#818384"
            // before={<Fontisto name="stopwatch" size={70} color="white" />}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Fontisto name="stopwatch" size={70} color="white" />
              <Text style={{ fontSize: 35, color: "white" }}>Duel</Text>
            </View>
          </ThemedButton> */}
        </View>

        <ThemedButton
          name="bruce"
          type="primary"
          style={styles.signOut}
          onPressOut={handleLogout}
          width={80}
          height={85}
          borderRadius={360}
          backgroundColor="#818384"
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="log-out" size={40} color="white" />
          </View>
        </ThemedButton>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  gameName: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 50,
    color: "white",
  },
  gameOptionsContatier: {
    width: "100%",
  },
  pressableContaier: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signOut: {
    position: "absolute",
    bottom: -195,
    left: 84,
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    // flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
