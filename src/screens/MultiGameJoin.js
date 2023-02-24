import React, { useState, useEffect, useRef, useContext } from "react";
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
  FlatList,
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
  deleteDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import CountDown from "../components/CountDown";
import { useAuth } from "../hooks/useAuth";
import { ThemedButton } from "react-native-really-awesome-button";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { LinearGradient } from "expo-linear-gradient";
import themesContext from "../config/themesContext";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export const MultiGameJoin = ({ route, navigation }) => {
  const theme = useContext(themesContext);

  const [gameId, setGameId] = useState("");
  const [newGame, setNewGame] = useState(false);
  const [userOneDeck, setUserOneDeck] = useState();
  const [currentGames, setCurrentGames] = useState([]);

  const { user } = useAuth();
  const getChosenDeck = route.params.finalDeckChoice;
  const { showActionSheetWithOptions } = useActionSheet();
  const inputRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "games"),
      where("playerTwo", "==", null),
      orderBy("gameCreatedDate", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const games = [];
      querySnapshot.forEach((doc) => {
        games.push({ ...doc?.data(), id: doc?.id });
      });

      setCurrentGames(games);
    });

    return unsubscribe;
  }, [user?.email]);

  const deleteExpiredGame = async (id) => {
    const q = query(collection(db, "games"), where("playerTwo", "==", null));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const games = [];
      querySnapshot.forEach((doc) => {
        games.push({ ...doc?.data(), id: doc?.id });
      });
      // setCurrentGames(games);
    });

    return unsubscribe;
  };

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
      gameCountDown: 3,
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
      colors={theme.backgroundArray}
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
                style={[{ backgroundColor: theme.buttonColor }, styles.button]}
              >
                <Text style={[styles.buttonText]}>Join Game</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPress}
                style={[{ backgroundColor: theme.buttonColor }, styles.button]}
              >
                <Text style={styles.buttonText}>Create Game</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",

                backgroundColor: "white",
                width: "80%",
                height: "65%",
                borderRadius: 10,
                marginTop: 20,
                padding: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                  marginTop: 20,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "700" }}>
                  Current Games
                </Text>

                <Text style={{ fontSize: 15, fontWeight: "700" }}>
                  Till Close
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",

                  width: currentGames.length > 0 ? "100%" : screenWidth - 100,
                  height: "100%",
                }}
              >
                <FlatList
                  data={currentGames}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        backgroundColor: "#CED0CE",
                      }}
                    />
                  )}
                  renderItem={({ item }) => {
                    const timeCreated = item?.gameCreatedDate;
                    const changeToDate = timeCreated?.toDate();
                    const getTime = changeToDate?.getTime();

                    let now = new Date();

                    let timeRemaining = Math.max(
                      0,
                      2 * 60 - Math.floor((now.getTime() - getTime) / 1000)
                    );

                    let time = timeRemaining;

                    const intervalId = setInterval(() => {
                      if (time > 0) {
                        time--;
                        // time = time;
                      }
                      // else if (time === 1) {
                      //   deleteDoc(doc(db, "games", item.id));
                      // }
                      else {
                        clearInterval(intervalId);
                      }
                    }, 1000);

                    const splitEmail = user?.email.split("@")[0];

                    return (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          width: "100%",
                          // height: 50,
                          alignItems: "center",
                          padding: 10,
                          // backgroundColor: "red",
                          marginVertical: 5,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            handleJoinGame(item.id, item.currentDeck)
                          }
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            backgroundColor: time === 0 ? "red" : "transparent",
                            padding: 10,
                            borderRadius: 10,
                            // marginBottom: 10,
                          }}
                          disabled={
                            time === 0 || splitEmail === item.id ? true : false
                          }
                        >
                          <Text
                            style={{
                              color: time === 0 ? "white" : "black",
                              fontSize: 15,
                              fontWeight: "600",
                            }}
                          >
                            {item.id}
                          </Text>
                          <Text
                            style={{
                              color: "black",
                              fontSize: 15,
                              fontWeight: "600",
                            }}
                          >
                            {time === 0 ? (
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                Closed
                              </Text>
                            ) : (
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                {/* {time} */}
                                <CountDown seconds={time} />
                              </Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id}
                />
              </View>
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
              backgroundColor={theme.buttonColor}

              // backgroundColor="#818384"
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
    height: "100%",
  },

  Gamecontainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    // width: "100%",
    height: "50%",
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
    width: screenWidth - 150,
    borderColor: "white",
    color: "black",
    backgroundColor: "white",
    borderWidth: 5,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    // backgroundColor: "#818384",
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
    // fontFamily: "Helvetica",
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
    backgroundColor: "rgba(255, 255, 255, 0.4)",

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
