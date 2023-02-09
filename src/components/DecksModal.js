import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Alert,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import CustomSwitch from "./CustomSwitch";
import { useAuth } from "../hooks/useAuth";
import Checkbox from "expo-checkbox";
import { IMAGES } from "../../assets";

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

function DecksModal({
  decksModalVisible,
  setDecksModalVisible,
  dataForFlatListDecks,
  sethomeScreenDeckCHoice,
  homeScreenDeckCHoice,
  gameDecksUnlocked,
  coins,
}) {
  const [gameMode, setGameMode] = useState("oneMin");
  const [hideModal, setHideModal] = useState(false);
  const [currentCoins, setCurrentCoins] = useState(0);
  const [frame, setFrame] = useState(0);

  const { user } = useAuth();

  const handlePurchase = async (amount, deckName) => {
    const docRef = doc(db, "users", user?.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data()) {
      const coinsData = docSnap.data().coins;
      const purchasedData = docSnap.data().gameDecksUnlocked;

      if (coinsData >= amount) {
        const newCoins = coinsData - amount;
        const newPurchased = [...purchasedData, deckName];
        updateDoc(docRef, {
          coins: newCoins,
          gameDecksUnlocked: newPurchased,
        });
      }

      // else {
      //   // Not enough coins to make the purchase
      //   Alert.alert("Not enough coins to make the purchase");
      // }
    }
  };

  const twoOptionAlertHandler = (amount, deckName) => {
    if (coins >= amount) {
      Alert.alert(
        "Purchase Deck",
        "Are you sure you want to purchase this deck for " +
          amount +
          " coins you'll have left " +
          (coins - amount) +
          " coins?",
        [
          { text: "Yes", onPress: () => handlePurchase(amount, deckName) },
          {
            text: "No",
            onPress: () => console.log("No Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Not enough coins to make the purchase");
    }
  };

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
                height: "87%",
                flexGrow: 0,
              }}
              renderItem={({ item }) => {
                const alredyUnlocked = gameDecksUnlocked.includes(item.name)
                  ? false
                  : true;
                const opacity = gameDecksUnlocked.includes(item.name) ? 1 : 0.5;
                const disabled = gameDecksUnlocked.includes(item.name)
                  ? false
                  : true;

                return (
                  <Pressable
                    disabled={disabled}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "50%",
                    }}
                    onPress={() => {
                      handleButtonPress(item);
                    }}
                  >
                    <View
                      style={{
                        marginBottom: 15,
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
                          borderWidth:
                            item.name === homeScreenDeckCHoice ? 5 : 0,
                          borderColor:
                            item.name === homeScreenDeckCHoice
                              ? "blue"
                              : "transparent",
                          borderRadius: 15,
                          opacity: opacity,
                        }}
                      >
                        <Image
                          style={{
                            width: 50,
                            height: 50,
                          }}
                          source={item.image}
                        />
                      </View>

                      <Text
                        style={{
                          fontSize: 15,
                          color: "black",
                          textAlign: "center",
                          fontWeight: "500",
                        }}
                      >
                        {item.displayName}
                      </Text>

                      {alredyUnlocked && (
                        <Pressable
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "50%",
                            backgroundColor: "#818384",
                            padding: 10,
                            borderRadius: 10,
                          }}
                          onPress={() => {
                            // handlePurchase(item.price, item.name);
                            twoOptionAlertHandler(item.price, item.name);
                          }}
                        >
                          {/* <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "50%",
                              backgroundColor: "#818384",
                              padding: 10,
                              borderRadius: 10,
                            }}
                          > */}
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                            }}
                            source={IMAGES.coinGif}
                            onLoad={() => {
                              setTimeout(() => setFrame(1), 0);
                            }}
                            onFrameChange={(frame) => {
                              setTimeout(() => setFrame(frame + 1), 0);
                            }}
                            frameIndex={frame % 10}
                          />

                          <Text
                            style={{
                              fontSize: 15,
                              color: "white",
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {item.price}
                          </Text>
                          {/* </View> */}
                        </Pressable>
                      )}
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
