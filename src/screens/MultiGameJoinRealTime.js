import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import {
  get,
  ref,
  set,
  onValue,
  child,
  update,
  push,
  query,
  orderByChild,
  equalTo,
  off,
  remove,
  getDatabase,
  orderByKey,
  orderByValue,
  serverTimestamp,
} from "firebase/database";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import CountDown from "../components/CountDown";
import { useAuth } from "../hooks/useAuth";
import { ThemedButton } from "react-native-really-awesome-button";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { LinearGradient } from "expo-linear-gradient";
import themesContext from "../config/themesContext";
import DropDownPicker from "react-native-dropdown-picker";
import { realTimeDB } from "../config/firebase";
const db = getDatabase();

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export const MultiGameJoinRealTime = ({ route, navigation }) => {
  const theme = useContext(themesContext);

  const [gameId, setGameId] = useState("");
  const [newGame, setNewGame] = useState(false);
  const [userOneDeck, setUserOneDeck] = useState();
  const [currentGames, setCurrentGames] = useState([]);

  const { user } = useAuth();
  const getChosenDeck = route.params.finalDeckChoice;
  const { showActionSheetWithOptions } = useActionSheet();
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Public");
  const [items, setItems] = useState([
    { label: "Public", value: "Public" },
    { label: "Private", value: "Private" },
  ]);

  const [openRoundNumber, setOpenRoundNumber] = useState(false);
  const [valueRoundNumber, setValueRoundNumber] = useState(5);
  const [itemsRoundNumber, setItemsRoundNumber] = useState([
    { label: 5, value: 5 },
    { label: 15, value: 15 },
    { label: 25, value: 25 },
  ]);

  useEffect(() => {
    const gamesRef = ref(realTimeDB, "games");
    // const q = query(
    //   ref(db, "games"),
    //   orderByChild("gameType").equalTo("Public")
    // );

    const q = query(
      gamesRef
      //   orderByChild("playerTwo").equalTo(null),
      //   orderByChild("gameType").equalTo("Public")
    );
    const onGamesUpdate = onValue(q, (snapshot) => {
      const games = [];
      snapshot.forEach((childSnapshot) => {
        games.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });
      console.log("games", games);

      const publicGames = games.filter((game) => game.gameType === "Public");
      setCurrentGames(publicGames);
    });

    return () => {
      off(q, onGamesUpdate);
    };
  }, [user?.email]);

  function handleCreateGame() {
    const shortendEmail = user?.email.split("@")[0];
    // const shortendEmail = "test2";

    set(ref(db, "games/" + shortendEmail), {
      playerOne: user?.email,
      playerTwo: false,
      playerOneScore: 0,
      playerTwoScore: 0,
      id: shortendEmail,
      currentDeck: getChosenDeck,
      currentIndex: 0,
      playerOneIndex: 28,
      playerTwoIndex: 29,
      roundOverMulti: true,
      userOneClickPlayAgain: false,
      multiStartDisabled: true,
      multiNotInDeckOne: false,
      multiNotInDeckTwo: false,
      numRounds: valueRoundNumber,
      gameCreatedDate: serverTimestamp(),
      gameCountDown: 3,
      gameType: value,
      gameDeck: false,
      multiUserOneDeck: false,
      multiUserTwoDeck: false,
    })
      .then(() => {
        setGameId(shortendEmail);
        setNewGame(true);
        setUserOneDeck(getChosenDeck);
        navigation.navigate("MultiGameRealTime", {
          gameId: shortendEmail,
          getChosenDeckJoin: getChosenDeck,
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  //function to keep track of all users onValue
  const onValueChange = () => {
    const gamesRef = ref(realTimeDB, "users");
    const q = query(
      gamesRef,
      //   orderByChild("playerTwo").equalTo(null),
      orderByChild("gameType").equalTo("Public")
    );
    const onGamesUpdate = onValue(q, (snapshot) => {
      const games = [];
      snapshot.forEach((childSnapshot) => {
        games.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });

      setCurrentGames(games);
    });

    return () => {
      off(q, onGamesUpdate);
    };
  };

  const deleteExpiredGame = async (id) => {
    const gamesRef = ref(realTimeDB, "games");
    const q = query(gamesRef, orderByChild("playerTwo").equalTo(null));
    const onGamesUpdate = onValue(q, (snapshot) => {
      const games = [];
      snapshot.forEach((childSnapshot) => {
        games.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });
    });

    return () => {
      off(q, onGamesUpdate);
    };
  };

  const onPressInput = () => {
    Keyboard.dismiss();
    inputRef.current.blur();
  };

  const handleJoinGame = async (chatRoomId, deck) => {
    const gameRef = ref(db, `games/ + ${chatRoomId}`);

    const dbRef = ref(getDatabase());

    get(child(dbRef, `games/${chatRoomId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          //   update(ref(`games/${chatRoomId}`), {
          update(ref(db, "games/" + chatRoomId), {
            playerTwo: user?.email,
          }).then(() => {
            console.log("Document successfully updated!");
            navigation.navigate("MultiGameRealTime", {
              gameId: chatRoomId,
              getChosenDeckJoin: snapshot.val().currentDeck,
            });
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // const snapshot = await get(gameRef);
    // if (snapshot.exists()) {
    //   update(gameRef, {
    //     playerTwo: user?.email,
    //   })
    //     .then(() => {
    //       console.log("Document successfully updated!");
    //       navigation.navigate("MultiGameRealTime", {
    //         gameId: chatRoomId,
    //         getChosenDeckJoin: snapshot.val().currentDeck,
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Error adding document: ", error);
    //     });

    //   console.log("both players are in the game");
    // } else {
    //   console.log("No such document!");
    //   Alert.alert("No such game exists");
    // }
  };

  const goToHome = () => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 170);
  };

  return (
    <LinearGradient
      colors={theme.backgroundArray}
      style={styles.linearGradient}
    >
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
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
                // onPress={() => handleJoinGame(gameId, userOneDeck)}
                onPress={() => {
                  handleJoinGame(gameId, userOneDeck);
                }}
                style={[{ backgroundColor: theme.buttonColor }, styles.button]}
              >
                <Text style={[styles.buttonText]}>Join Game</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleCreateGame();
                }}
                style={[{ backgroundColor: theme.buttonColor }, styles.button]}
              >
                <Text style={styles.buttonText}>Create Game</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "80%",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Game Type:
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: 70,
                }}
              >
                Number Rounds:
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
                marginTop: 2,
                zIndex: 2,
              }}
            >
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                containerStyle={{ height: 40, width: "35%" }}
                // dropDownDirection="TOP"
              />

              <DropDownPicker
                open={openRoundNumber}
                value={valueRoundNumber}
                items={itemsRoundNumber}
                setOpen={setOpenRoundNumber}
                setValue={setValueRoundNumber}
                setItems={setItemsRoundNumber}
                containerStyle={{ height: 40, width: "35%" }}
                // dropDownDirection="TOP"
              />
            </View>

            <View
              style={{
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",

                backgroundColor: "white",
                width: "80%",
                height: "50%",
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
                    // const changeToDate = timeCreated?.toDate();
                    const date = new Date(timeCreated);
                    const getTime = date?.getTime();

                    let now = new Date();

                    let timeRemaining = Math.max(
                      0,
                      2 * 60 - Math.floor((now.getTime() - getTime) / 1000)
                    );

                    let time = timeRemaining;

                    const intervalId = setInterval(() => {
                      if (time > 0) {
                        time--;
                      } else {
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
      {/* </KeyboardAvoidingView> */}
    </LinearGradient>
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
    height: "65%",
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
    height: 50,
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
