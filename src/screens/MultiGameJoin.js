import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { db } from "../config/firebase";
import {
  getDoc,
  doc,
  updateDoc,
  setDoc,
  collection,
  arrayUnion,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";

import { useAuth } from "../hooks/useAuth";
import { ThemedButton } from "react-native-really-awesome-button";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export const MultiGameJoin = ({ route, navigation }) => {
  const [gameId, setGameId] = useState("");
  const [newGame, setNewGame] = useState(false);
  const [playerTwo, setPlayerTwo] = useState();
  const [gameData, setGameData] = useState({});
  const [onlyOnePlayer, setOnlyOnePlayer] = useState(true);
  const [userOneDeck, setUserOneDeck] = useState();
  const [numberOfRounds, setNumberOfRounds] = useState();

  const { user } = useAuth();
  const getChosenDeck = route.params.finalDeckChoice;
  const { showActionSheetWithOptions } = useActionSheet();
  const inputRef = useRef(null);

  const onPressInput = () => {
    Keyboard.dismiss();
    inputRef.current.blur();
  };

  const onPress = () => {
    const options = ["25", "15", "5", "Cancel"];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: "Select the number of rounds",
      },
      (selectedIndex) => {
        if (selectedIndex === 3) return;
        const changeToNumber = Number(options[selectedIndex]);
        handleCreateGame(changeToNumber);
      }
    );
  };

  const handleCreateGame = async (numround) => {
    const shortendEmail = user?.email.split("@")[0];

    const docRef = doc(db, "games", shortendEmail);

    setDoc(docRef, {
      playerOne: user?.email,
      playerTwo: null,
      playerOneScore: 0,
      playerTwoScore: 0,
      id: shortendEmail,
      currentDeck: getChosenDeck,
      currentIndex: 0,
      playerOneIndex: 28,
      playerTwoIndex: 29,
      users: [shortendEmail],
      roundOverMulti: true,
      userOneClickPlayAgain: false,
      multiStartDisabled: true,
      multiNotInDeckOne: false,
      multiNotInDeckTwo: false,
      numRounds: numround,
      gameCreatedDate: serverTimestamp(),
    })
      .then(() => {
        setGameId(docRef.id);
        setNewGame(true);
        setUserOneDeck(getChosenDeck);
        navigation.navigate("MultiGame", {
          gameId: docRef.id,
          getChosenDeckJoin: getChosenDeck,
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleJoinGame = async (chatRoomId, deck) => {
    const docRef = doc(db, "games", chatRoomId);
    const shortendEmail = user?.email.split("@")[0];

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      updateDoc(docRef, {
        playerTwo: user?.email,
        users: arrayUnion(shortendEmail),
      })
        .then(() => {
          console.log("Document successfully updated!");
          navigation.navigate("MultiGame", {
            gameId: chatRoomId,
            getChosenDeckJoin: docSnap.data().currentDeck,
          });
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      console.log("both players are in the game");
    } else {
      console.log("No such document!");
      Alert.alert("No such game exists");
    }
  };

  const goToHome = () => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 170);
  };
  return (
    // <SafeAreaView style={styles.container}>
    <LinearGradient
      colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
      style={styles.linearGradient}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.Gamecontainer}>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={gameId}
              onChangeText={(text) => setGameId(text)}
              autoCapitalize="none"
              placeholder="Enter game ID"
            />

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => handleJoinGame(gameId, userOneDeck)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Join Game</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.buttonText}>Create Game</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.goHomeContainer}>
            <ThemedButton
              name="bruce"
              type="primary"
              // onPressOut={() => navigation.navigate("Home")}
              onPressOut={goToHome}
              width={70}
              height={80}
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
                <Entypo name="home" size={25} color="white" />
              </View>
            </ThemedButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    height: "70%",
  },

  Gamecontainer: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    // width: "100%",
    height: "70%",
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
  textInput: {
    height: 40,
    width: screenWidth - 200,
    borderColor: "white",
    color: "black",
    backgroundColor: "white",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "#818384",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  gameOverContainerOptions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: screenWidth,
    top: 40,
  },

  gameOverContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  goHomeContainer: {
    position: "absolute",

    top: 50,
    left: 20,
  },
  highScoreContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 40,
    right: 17,
  },
  highScoreText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },

  timerContainer: {
    marginTop: 70,
  },
  gameContainer: {
    marginTop: -10,
  },
  newMiddleBarConatiner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: screenHeight / 4.5,
    width: "100%",
    height: "40%",
  },
  gameDeckContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.3)",

    borderRadius: 40,
    width: "98%",
    height: "20%",
  },
  userDeckContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: screenHeight / 3,
    backgroundColor: "blue",
    borderColor: "black",
  },
  userDeckContainerList: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: screenHeight / 3,
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: screenHeight / 1.13,
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "130%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
