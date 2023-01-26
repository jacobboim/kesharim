import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Alert,
  Modal,
  Image,
} from "react-native";
import CustomSwitch from "./CustomSwitch";
import { useAuth } from "../hooks/useAuth";
import Checkbox from "expo-checkbox";

import { db } from "../config/firebase";

import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  updateDoc,
  limit,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

function DecksModal({
  decksModalVisible,
  setDecksModalVisible,
  dataForFlatListDecks,
  sethomeScreenDeckCHoice,
  homeScreenDeckCHoice,
}) {
  const [gameMode, setGameMode] = useState("oneMin");
  const [hideModal, setHideModal] = useState(false);
  const { user } = useAuth();

  function handleButtonPress(item) {
    const docRef = doc(db, "users", user?.email);

    sethomeScreenDeckCHoice(item.name);
    updateDoc(docRef, {
      currentDeck: item.name,
    });
  }

  const onHideModal = () => {
    setDecksModalVisible(!decksModalVisible);
    setGameMode("oneMin");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={decksModalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setDecksModalVisible(!decksModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Decks</Text>

          <View
            style={{
              display: "flex ",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              marginBottom: 2,
              // backgroundColor: "yellow",
            }}
          >
            <FlatList
              data={dataForFlatListDecks}
              keyExtractor={(item) => item.key}
              numColumns={2}
              // ItemSeparatorComponent={() => (
              //   <View style={{ width: 1, height: 0 }} />
              // )}
              style={{
                width: "99%",
                height: "90%",
                flexGrow: 0,
              }}
              renderItem={({ item }) => (
                <Pressable
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "50%",
                    // height: "100%",
                    // backgroundColor: "red",
                  }}
                  onPress={() => {
                    // sethomeScreenDeckCHoice(item.name);
                    handleButtonPress(item);
                    // console.log("item.key", item.name);
                  }}
                >
                  <View
                    style={{
                      borderWidth: item.name === homeScreenDeckCHoice ? 5 : 0,
                      borderColor:
                        item.name === homeScreenDeckCHoice
                          ? "blue"
                          : "transparent",
                      borderRadius: 15,

                      height: "80.8%",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50%",
                        backgroundColor: item.backgroundColor,
                        padding: 10,
                        borderRadius: 10,
                        // marginBottom: 10,
                      }}
                    >
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                        }}
                        source={item.image}
                      />
                      {/* <View
                      style={{
                        position: "absolute",
                      }}
                    >
                      <Checkbox
                        value={item.name === homeScreenDeckCHoice}
                        onValueChange={() => {
                          // sethomeScreenDeckCHoice(item.name);
                          handleButtonPress(item);
                          // console.log("item.key", item.name);
                        }}
                      />
                    </View> */}
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>

          <Pressable
            style={[
              styles.button,
              styles.buttonClose,
              {
                backgroundColor: hideModal ? "darkgray" : "#818384",
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

export default DecksModal;
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
    marginTop: 22,
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
