import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Alert,
  Dimensions,
  Platform,
  Modal,
  Button,
  Image,
  ScrollView,
} from "react-native";
import { IMAGES } from "../../assets";
import { EventRegister } from "react-native-event-listeners";
import themesContext from "../config/themesContext";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedButton } from "react-native-really-awesome-button";

import {
  Fontisto,
  Entypo,
  Feather,
  Ionicons,
  Foundation,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const screenHeight = Dimensions.get("screen").height;

function TutorialModal({ visible, setTutorialVisible }) {
  const theme = useContext(themesContext);

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={{ flex: 1, marginTop: 70 }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            // minHeight: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 50,
            }}
          >
            How To Play
          </Text>

          <View
            style={{
              width: "92%",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: "90%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                Choose a game mode
              </Text>
            </View>

            <Text style={{ fontSize: 15, marginBottom: 15 }}>
              There are 4 game modes to choose from.
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 15 }}>
              1 Min - 1 minute to find as many matches as possible
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 15 }}>
              Speed - each match has less time than the previous
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 15 }}>
              Duel - play against a friend
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 15 }}>
              Multi - play against a friend anywhere in the world
            </Text>
          </View>

          <View
            style={{
              width: "92%",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 15 }}>
              You make a match by tapping on the matching icon
            </Text>
          </View>

          <Image
            source={IMAGES.howTo}
            style={{
              width: "90%",
              height: 600,
              resizeMode: "contain",
              marginBottom: 50,
            }}
          />

          <View
            style={{
              width: "90%",
              marginBottom: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              Multi Mode
            </Text>

            <View
              style={{
                width: "92%",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 15, marginBottom: 15 }}>
                Enter a game ID to join a friend's game. Then press the "Join
                Game" button.
              </Text>

              <Text style={{ fontSize: 15, marginBottom: 15 }}>
                Or just click on one of the games in the Current Games list to
                join.
              </Text>

              <Text style={{ fontSize: 15, marginBottom: 15 }}>
                If you want to create a game, press the "Create Game" button. Be
                sure to check the game type and number of rounds you want to
                play.
              </Text>

              <Text style={{ fontSize: 15, marginBottom: 15 }}>
                If you make the game
                <Text style={{ fontWeight: "bold" }}> private </Text>
                you will need to share the game ID to a friend to join , since
                the game will not be listed in the Current Games list.
              </Text>
            </View>

            <Image
              source={IMAGES.multiPlayer}
              style={{
                width: "90%",
                height: 600,
                resizeMode: "contain",
                marginBottom: 50,
              }}
            />
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              //   backgroundColor: "red",
            }}
          >
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                flexDirection: "row",
                marginBottom: 15,
                // backgroundColor: "blue",
              }}
            >
              <Text style={{ fontSize: 15, marginBottom: 15, marginRight: 35 }}>
                To show the leaderboard press:
              </Text>

              <ThemedButton
                name="bruce"
                type="primary"
                width={60}
                height={65}
                borderRadius={360}
                backgroundColor={theme.buttonColor}
              >
                <MaterialIcons name="leaderboard" size={25} color="white" />
              </ThemedButton>
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                flexDirection: "row",
                marginBottom: 15,

                // backgroundColor: "green",
              }}
            >
              <Text style={{ fontSize: 15, marginBottom: 15, marginRight: 75 }}>
                To Pick/Buy a deck press:
              </Text>

              <ThemedButton
                name="bruce"
                type="primary"
                width={60}
                height={65}
                borderRadius={360}
                backgroundColor={theme.buttonColor}
              >
                <Entypo name="emoji-happy" size={25} color="white" />
              </ThemedButton>
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                flexDirection: "row",
                // backgroundColor: "yellow",
              }}
            >
              <Text style={{ fontSize: 15, marginBottom: 15, marginRight: 15 }}>
                To change the color scheme press:
              </Text>

              <ThemedButton
                name="bruce"
                type="primary"
                width={60}
                height={65}
                borderRadius={360}
                backgroundColor={theme.buttonColor}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Foundation name="paint-bucket" size={25} color="white" />
                </View>
              </ThemedButton>
            </View>
          </View>

          <View
            style={{
              width: "90%",
              marginBottom: 30,
            }}
          >
            <Button title="Close" onPress={() => setTutorialVisible(false)} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default TutorialModal;

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

  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  centeredView: {
    // flex: 1,
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: screenHeight / 2 - 350,
  },
  modalView: {
    margin: 90,
    width: "90%",
    height: "88%",
    backgroundColor: "white",
    borderRadius: 25,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    marginTop: 15,
    marginBottom: 15,
    position: "absolute",
    bottom: 0,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
