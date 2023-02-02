import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
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
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { ThemedButton } from "react-native-really-awesome-button";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export const MultiGameJoin = ({ route, navigation }) => {
  const [gameId, setGameId] = useState("");
  const [newGame, setNewGame] = useState(false);
  const [playerTwo, setPlayerTwo] = useState();
  const [gameData, setGameData] = useState({});
  const [onlyOnePlayer, setOnlyOnePlayer] = useState(true);
  const [userOneDeck, setUserOneDeck] = useState();

  const { user } = useAuth();
  const getChosenDeck = route.params.finalDeckChoice;

  const handleCreateGame = async () => {
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
    })
      .then(() => {
        // console.log("Document written with ID: ", docRef.id);
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
      // console.log("Document data:", docSnap.data());
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

      // navigation.navigate("MultiGame");
      // setPlayerTwo(user?.email);
      // setOnlyOnePlayer(false);
      // return unsubscribe;
    } else {
      console.log("No such document!");
      Alert.alert("No such game exists");
    }
  };

  // useEffect(() => {
  //   if (gameData.playOne && gameData.playTwo) {
  //     console.log("both players are in the game");
  //     navigation.navigate("MultiGame", {
  //       gameId: gameData.id,
  //       // getChosenDeck: gameData.currentDeck,
  //       gameDeckData: gameData.gameDeck,
  //     });

  //     // navigation.navigate("MultiGame");
  //   } else {
  //     console.log("one player is in the game");
  //   }
  // }, [gameData]);

  const goToHome = () => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 170);
  };
  return (
    <>
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
            <Text style={{ color: "blue", fontSize: 50 }}>Home</Text>
          </View>
        </ThemedButton>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={gameId}
          onChangeText={(text) => setGameId(text)}
          placeholder="Enter game ID"
        />
        <TouchableOpacity
          onPress={() => handleJoinGame(gameId, userOneDeck)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateGame} style={styles.button}>
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "blue",
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
  goHomeContainer: {
    // position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 80,
    //place at the bottom left of the screen
    // bottom: 165,
    // left: 15,
    //place at the top left of the screen
    // bottom: 500,
    // left: 10,
  },

  gameOverContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
    // backgroundColor: "yellow",
    // backgroundColor: "rgba(255, 255, 255, 0.3)",
    // borderRadius: 40,
    width: "100%",
    height: "40%",
  },
  gameDeckContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    // top: screenHeight / 2.5,
    // backgroundColor: "yellow",
    backgroundColor: "rgba(255, 255, 255, 0.3)",

    // backgroundColor: "rgba(209, 242, 246, 0.9)",

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
    // top: 720,
    top: screenHeight / 1.13,

    // marginTop: screenHeight / 3,
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "130%",
    // flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
