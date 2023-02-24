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
  Image,
} from "react-native";
import CustomSwitch from "./CustomSwitch";
import { useAuth } from "../hooks/useAuth";
import Checkbox from "expo-checkbox";
import { IMAGES } from "../../assets";
import { EventRegister } from "react-native-event-listeners";
import themesContext from "../config/themesContext";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { db } from "../config/firebase";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { async } from "@firebase/util";

const screenHeight = Dimensions.get("screen").height;

function ThemeModal({ themeModalVisible, setThemeModalVisible, themeData }) {
  const theme = useContext(themesContext);
  const [themeState, setThemeState] = useState("DEFAULT");
  const [gameMode, setGameMode] = useState("oneMin");
  const [hideModal, setHideModal] = useState(false);

  function handleButtonPress(item) {
    EventRegister.emit("changeTheme", item);
  }

  const onHideModal = () => {
    setThemeModalVisible(!themeModalVisible);
    setGameMode("oneMin");
  };

  useEffect(() => {
    // load saved color scheme on app load
    AsyncStorage.getItem("theme").then((savedTheme) => {
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    });

    let eventListener = EventRegister.addEventListener(
      "changeTheme",
      (data) => {
        setThemeState(data);
        // save new color scheme to async storage
        AsyncStorage.setItem("theme", data);
      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={themeModalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setThemeModalVisible(!themeModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Themes</Text>
          <View
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              marginBottom: 2,
              // backgroundColor: "yellow",
            }}
          >
            <FlatList
              data={themeData}
              keyExtractor={(item) => item.id}
              numColumns={2}
              // ItemSeparatorComponent={() => (
              //   <View style={{ width: 1, height: 0 }} />
              // )}
              style={{
                width: "99%",
                height: "87%",
                flexGrow: 0,
              }}
              renderItem={({ item }) => {
                // const alredyUnlocked = gameDecksUnlocked?.includes(item.name)
                //   ? false
                //   : true;
                // const opacity = gameDecksUnlocked?.includes(item.name)
                //   ? 1
                //   : 0.5;
                // const disabled = gameDecksUnlocked?.includes(item.name)
                //   ? false
                //   : true;

                let title = item.title;
                let lowercaseTitle = title.toLocaleLowerCase();

                return (
                  <Pressable
                    // disabled={disabled}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "50%",
                    }}
                    onPress={() => {
                      handleButtonPress(item.title);
                    }}
                  >
                    <View
                      style={{
                        marginBottom: 15,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          //   width: "59.5%",
                          width: 90,
                          backgroundColor: item.backgroundColor,
                          //   padding: 1,
                          borderWidth:
                            themeState.toLocaleLowerCase() === lowercaseTitle
                              ? 5
                              : 0,
                          borderColor:
                            themeState.toLocaleLowerCase() === lowercaseTitle
                              ? item.color
                              : "transparent",
                          borderRadius: 15,
                        }}
                      >
                        {/* <LinearGradient
                          colors={item.backgroundArray}
                          style={{
                            width: 80,
                            height: 95,
                            borderRadius: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        /> */}
                        <View
                          style={{
                            width: 80,
                            height: 95,
                            borderRadius: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: item.buttonColor,
                          }}
                        />
                      </View>

                      <Text
                        style={{
                          fontSize: 15,
                          color: "black",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>

          <Pressable
            style={[
              styles.button,
              styles.buttonClose,
              {
                backgroundColor: hideModal ? "darkgray" : theme.buttonColor,
                width: 90,
              },
            ]}
            onPress={() => onHideModal()}
            onTouchStart={() => setHideModal(!hideModal)}
            onTouchEnd={() => setHideModal(false)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default ThemeModal;
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
