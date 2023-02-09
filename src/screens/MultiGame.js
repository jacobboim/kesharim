import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";
import { IMAGES } from "../../assets";
import { ProgressBar } from "react-native-paper";
import handleAlldecks from "../components/decks/IconDecks";

import Animated, {
  BounceIn,
  FadeIn,
  FlipInEasyX,
  FlipOutEasyX,
  set,
} from "react-native-reanimated";
import { useAuth } from "../hooks/useAuth";

import { db } from "../config/firebase";

import {
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const { gameDecks, monsterDeck, foodDeck, flagDeck, characterDeck } =
  handleAlldecks();
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export function MultiGame({ route, navigation }) {
  const getId = route.params.gameId;
  const getChosenDeck = route.params.getChosenDeckJoin;

  const { user } = useAuth();

  useEffect(() => {
    const docRef = doc(db, "games", getId);

    const checkIfData = onSnapshot(docRef, (doc) => {
      if (!doc.data()) {
        navigation.navigate("Home");
      }
    });

    const checkForPlayAgain = onSnapshot(docRef, (doc) => {
      if (doc.data()) {
        setUserOneClickPlayAgain(doc.data().userOneClickPlayAgain);
      } else {
        console.log("no data in doc.data()");
      }
    });

    const checkNumRounds = onSnapshot(docRef, (doc) => {
      if (doc.data()) {
        setNumberRounds(doc.data().numRounds);
      } else {
        console.log("no data in doc.data()");
      }
    });

    const getDocDataRounds = async () => {
      const docRef = doc(db, "games", getId);

      const docSnap = await getDoc(docRef);
      if (docSnap.data().numRounds) {
        setNumberRounds(docSnap.data().numRounds);
      } else {
        // doc.data() will be undefined in this case

        console.log("No such document!");
      }
    };

    const unsubscribe = onSnapshot(docRef, (doc) => {
      //   console.log(doc.data(), "doc.data() in multiGame");
      if (doc.data().playerOne && doc.data().playerTwo) {
        // console.log("both players are in the game in multiGame");
        setBothPlayersInGame(true);
        setGameDeck(JSON.parse(doc.data().gameDeck));
        // setUserOneDeck(gameDeck[8]);
        // setUserTwoDeck();
        setUserOneClickPlayAgain(doc.data().userOneClickPlayAgain);
        setMultiUserOneScore(doc.data().playerOneScore);
        setMultiUserTwoScore(doc.data().playerTwoScore);
        setMultiUserOneIndex(doc.data().playerOneIndex);
        setMultiUserTwoIndex(doc.data().playerTwoIndex);
        setCurrentIndex(doc.data().currentIndex);
        setPlayerOne(doc.data().playerOne);
        setPlayerTwo(doc.data().playTwo);
        setRoundOverMulti(doc.data().roundOverMulti);
        setMultiNotInDeckOne(doc.data().multiNotInDeckOne);
        setMultiNotInDeckTwo(doc.data().multiNotInDeckTwo);
        setUserOneDeck(JSON.parse(doc.data().multiDefaultUserOne));
        setUserTwoDeck(JSON.parse(doc.data().multiDefaultUserTwo));
        setMultiStartDisabled(doc.data().multiStartDisabled);
        setNumberRounds(doc.data().numRounds);
      } else if (doc.data().playerOne && !doc.data().playerTwo) {
        setPlayerOne(doc.data().playerOne);
        setNumberRounds(doc.data().numRounds);

        if (
          !doc.data().gameDeck &&
          !doc.data().multiUserOneDeck &&
          !doc.data().multiUserTwoDeck
        ) {
          updateDoc(docRef, {
            gameDeck: stringDeck,
            multiDefaultUserOne: multiDefaultUserOne,
            multiDefaultUserTwo: multiDefaultUserTwo,
          });
        } else {
          console.log("already hase deck");
        }
      } else {
        console.log("one player is in the game");
      }
    });
    return () => {
      unsubscribe();
      checkIfData();
      checkForPlayAgain();
    };
  }, [getId]);

  //   const getDocDataRounds = async () => {
  //     const docRef = doc(db, "games", getId);

  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.data().numRounds) {
  //       setNumberRounds(docSnap.data().numRounds);
  //     } else {
  //       // doc.data() will be undefined in this case

  //       console.log("No such document!");
  //     }
  //   };
  //   useEffect(() => {
  //     getDocDataRounds();
  //   }, [getId]);

  const getUSerChosenDeck = () => {
    if (getChosenDeck === "gameDecks") {
      return gameDecks;
    }
    if (getChosenDeck === "monsterDeck") {
      return monsterDeck;
    }
    if (getChosenDeck === "foodDeck") {
      return foodDeck;
    }
    if (getChosenDeck === "flagDeck") {
      return flagDeck;
    }
    if (getChosenDeck === "characterDeck") {
      return characterDeck;
    }
  };
  const shuffleArrayPreGame = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledArray = shuffleArrayPreGame(
    getUSerChosenDeck().map((deck) => shuffleArrayPreGame(deck))
  );

  const userOneRandom = (array) => {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex === 0) {
      randomIndex = 1;
    }
    return array[randomIndex];
  };
  let userOneChoice = userOneRandom(shuffledArray);

  const userTwoRandom = (array) => {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex === 0 || randomIndex === userOneChoice) {
      randomIndex = 1;
    }
    return array[randomIndex];
  };

  const multiDefaultUserOne =
    shuffledArray && JSON.stringify(userOneRandom(shuffledArray));
  const multiDefaultUserTwo =
    shuffledArray && JSON.stringify(userTwoRandom(shuffledArray));

  const stringDeck = shuffledArray && JSON.stringify(shuffledArray);

  const [numberRounds, setNumberRounds] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userTwoDeck, setUserTwoDeck] = useState();
  const [userOneDeck, setUserOneDeck] = useState();
  const [userOneScore, setUserOneScore] = useState(0);
  const [userTwoScore, setUserTwoScore] = useState(0);
  const [multiUserOneScore, setMultiUserOneScore] = useState();
  const [multiUserTwoScore, setMultiUserTwoScore] = useState();
  const [multiUserOneIndex, setMultiUserOneIndex] = useState();
  const [multiUserTwoIndex, setMultiUserTwoIndex] = useState();
  const [multiStartDisabled, setMultiStartDisabled] = useState();

  const getDocData = async () => {
    const docRef = doc(db, "games", getId);

    const docSnap = await getDoc(docRef);
    if (docSnap.data().gameDeck) {
      //   console.log("Document data:", docSnap.data());
      //   const docSnap = await getDoc(docRef);
      const parse = JSON.parse(docSnap.data().gameDeck);
      setGameDeck(parse);
    } else {
      // doc.data() will be undefined in this case

      console.log("No such document!");
    }
  };

  useEffect(() => {
    getDocData();
  }, [getId]);

  const [gameDeck, setGameDeck] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  //   const [notInDeckOne, setNotInDeckOne] = useState(false);
  //   const [notInDeckTwo, setNotInDeckTwo] = useState(false);
  const [multiNotInDeckOne, setMultiNotInDeckOne] = useState();
  const [multiNotInDeckTwo, setMultiNotInDeckTwo] = useState();
  const [roundOverMulti, setRoundOverMulti] = useState(true);

  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bothPlayersInGame, setBothPlayersInGame] = useState(false);
  const [playerOne, setPlayerOne] = useState();
  const [playerTwo, setPlayerTwo] = useState();
  const [userOneClickPlayAgain, setUserOneClickPlayAgain] = useState();
  const [matchingID, setMatchingID] = useState();

  const shortendEmail = playerOne ? playerOne.split("@")[0] : "";

  const findMatchingId = () => {
    gameDeck[currentIndex] &&
      gameDeck[currentIndex].forEach((gameDeckItem) => {
        let found = userOneDeck?.find((userDeckItem) => {
          return gameDeckItem.id === userDeckItem.id;
        });
        if (found) {
          setMatchingID(found.id);
          return;
        }
      });
  };

  useEffect(() => {
    findMatchingId();
    console.log("matchingID", matchingID);
  }, [currentIndex, gameDeck, userOneDeck]);

  useEffect(() => {
    if (multiUserOneScore + multiUserTwoScore >= numberRounds) {
      const timeout = setTimeout(() => {
        setGameOver(true);
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [multiUserOneScore, multiUserTwoScore, numberRounds]);

  useEffect(() => {
    if (multiStartDisabled) {
      const timeout = setTimeout(() => {
        updateDoc(doc(db, "games", getId), {
          multiStartDisabled: false,
        });
      }, 850);

      return () => clearTimeout(timeout);
    }
  }, [multiStartDisabled]);

  useEffect(() => {
    if (multiNotInDeckOne) {
      const timeout = setTimeout(() => {
        updateDoc(doc(db, "games", getId), {
          multiNotInDeckOne: false,
        });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [multiNotInDeckOne]);

  useEffect(() => {
    if (multiNotInDeckTwo) {
      const timeout = setTimeout(() => {
        updateDoc(doc(db, "games", getId), {
          multiNotInDeckTwo: false,
        });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [multiNotInDeckTwo]);

  useEffect(() => {
    if (numberRounds) {
      const totalScore = multiUserOneScore + multiUserTwoScore;
      const newProgress = totalScore / numberRounds;
      setProgress(newProgress);
    }
  }, [multiUserOneScore, multiUserTwoScore]);

  //write a useeffect that updates the progress bar when the score changes

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        setShowGameOverMessage(true);
      }, 500);
    }
  }, [gameOver]);

  const resetGame = () => {
    updateDoc(doc(db, "games", getId), {
      gameDeck: stringDeck,
      playerOneScore: 0,
      playerTwoScore: 0,
      playerOneIndex: 28,
      playerTwoIndex: 29,
      multiDefaultUserOne: multiDefaultUserOne,
      multiDefaultUserTwo: multiDefaultUserTwo,
      userOneClickPlayAgain: true,
      playerTwo: playerOne === user?.email ? null : user?.email,
    });
    setBothPlayersInGame(false);
    setUserOneScore(0);
    setUserTwoScore(0);
    setGameOver(false);
    setShowGameOverMessage(false);

    setTimeout(
      () =>
        updateDoc(doc(db, "games", getId), {
          userOneClickPlayAgain: false,
        }),
      15000
    );
  };

  const handleClick = (clickedEmoji, user) => {
    if (gameDeck[currentIndex].some((emoji) => emoji.id === clickedEmoji)) {
      if (user === "userOne") {
        setUserOneScore(userOneScore + 1);

        updateDoc(doc(db, "games", getId), {
          playerOneScore: userOneScore + 1,
          playerOneIndex: currentIndex,
          multiDefaultUserOne: JSON.stringify([...gameDeck[currentIndex]]),
        });
      } else {
        setUserTwoScore(userTwoScore + 1);
        updateDoc(doc(db, "games", getId), {
          playerTwoScore: userTwoScore + 1,
          playerTwoIndex: currentIndex,
          multiDefaultUserTwo: JSON.stringify([...gameDeck[currentIndex]]),
        });
      }

      updateDoc(doc(db, "games", getId), {
        roundOverMulti: false,
        multiStartDisabled: true,
      });

      setTimeout(
        () =>
          updateDoc(doc(db, "games", getId), {
            roundOverMulti: true,
          }),
        500
      );

      if (currentIndex === gameDeck.length - 1) {
        const beforeShuffle = gameDeck;
        shuffleArray(beforeShuffle);
        setGameDeck(beforeShuffle);

        setCurrentIndex(0);
      } else {
        updateDoc(doc(db, "games", getId), {
          currentIndex: currentIndex + 1,
        });
      }
    } else {
      if (user === "userOne") {
        updateDoc(doc(db, "games", getId), {
          multiNotInDeckOne: true,
        });
      } else {
        updateDoc(doc(db, "games", getId), {
          multiNotInDeckTwo: true,
        });
      }
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const goToHome = () => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 170);

    setTimeout(() => {
      deleteDoc(doc(db, "games", getId));
    }, 370);
  };

  const resetGameDelay = () => {
    setTimeout(() => {
      resetGame();
    }, 170);
  };

  const progressColor = "#263238";

  //if bother player not in game return waiting screen

  const shouldBeDisabledDeckOne = () => {
    if (playerOne === user?.email) return false;

    if (
      gameOver === true ||
      multiStartDisabled === true ||
      multiNotInDeckOne === true
    )
      return true;
    return false;
  };

  const shouldBeDisabled = () => {
    if (gameOver === true || multiStartDisabled === true) return true;
    if (playerOne === user?.email && multiNotInDeckOne) return true;
    if (playerOne !== user?.email && multiNotInDeckTwo) return true;
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
        style={styles.linearGradient}
      >
        {!bothPlayersInGame ? (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              //   position: "absolute",
              // top: 740,
              //   top: screenHeight / 4.4,
              //   height: 50,
              width: "100%",
              marginTop: screenHeight / 4.4,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: "white",
                marginBottom: 10,
              }}
            >
              Waiting for other player...
            </Text>
            <ActivityIndicator size="large" color="white" />

            <Text
              style={{
                fontSize: 28,
                color: "white",
                marginTop: 80,
                width: "80%",
                textAlign: "center",
              }}
            >
              Tell a friend to join the game using the ID:{" "}
              <Text
                style={{
                  fontSize: 28,
                  color: "white",
                  marginTop: 80,
                  width: "80%",
                  textAlign: "center",
                  textDecorationColor: "white",
                  textDecorationLine: "underline",
                }}
              >
                {shortendEmail}
              </Text>
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.gameContainer,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              {!showGameOverMessage && (
                <>
                  <View style={[styles.progressTwoContainer]}>
                    <>
                      {progress ? (
                        <ProgressBar
                          style={{
                            height: 10,
                            width: 300,
                            backgroundColor: "white",
                            borderRadius: 10,
                          }}
                          progress={progress}
                          // color="#6200ee"
                          color={progressColor}
                        />
                      ) : (
                        <ProgressBar
                          style={{
                            height: 10,
                            width: 300,
                            backgroundColor: "white",
                            borderRadius: 10,
                          }}
                          progress={0}
                          // color="#6200ee"
                          color={progressColor}
                        />
                      )}
                    </>
                  </View>
                  <View style={[styles.scoreContainerTwo]}>
                    <Text
                      style={{
                        fontSize: 50,
                        color: "white",
                        transform: [{ rotate: `180deg` }],
                      }}
                    >
                      {playerOne === user?.email
                        ? multiUserTwoScore
                        : multiUserOneScore}
                    </Text>
                  </View>
                  <View style={[styles.userTwoDeckContainer]}>
                    <Animated.FlatList
                      //   data={userTwoDeck}
                      data={
                        playerOne === user?.email ? userTwoDeck : userOneDeck
                      }
                      numColumns={3}
                      scrollEnabled={false}
                      contentContainerStyle={{ alignItems: "center" }}
                      renderItem={({ item, index }) => (
                        <Animated.View
                          style={{
                            backgroundColor:
                              playerOne === user?.email && multiNotInDeckTwo
                                ? "rgba(212, 83, 8, 0.6)"
                                : playerOne !== user?.email && multiNotInDeckOne
                                ? "rgba(212, 83, 8, 0.6)"
                                : "rgba(255, 255, 255, 0.3)",

                            margin: 10,
                            borderRadius: 100,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            disabled={true}
                            key={item.id}
                            onPress={() => handleClick(item.id, "userTwo")}
                            style={{
                              padding: 8,
                              margin: 8,
                            }}
                          >
                            <Animated.Image
                              entering={FadeIn.delay(index * 90)}
                              source={item.emoji}
                              style={{
                                // width: 47,
                                // height: 47,
                                width: 25,
                                height: 25,
                                opacity: multiStartDisabled ? 0.2 : 1,
                                transform: [{ rotate: `180deg` }],
                              }}
                            />
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  </View>

                  {roundOverMulti && (
                    <Animated.View
                      entering={FlipInEasyX.duration(875)}
                      exiting={FlipOutEasyX.duration(850)}
                      style={[styles.gameDeckContainer]}
                    >
                      {gameDeck[currentIndex] ? (
                        gameDeck[currentIndex].map((emoji, index) => (
                          <Animated.Image
                            source={emoji.emoji}
                            style={{
                              width: 45,
                              height: 45,
                              transform: [{ rotate: `${emoji.rotation}deg` }],
                            }}
                            key={index}
                          />
                        ))
                      ) : (
                        <Text>loading</Text>
                      )}
                    </Animated.View>
                  )}

                  <View style={[styles.userDeckContainerList]}>
                    <Animated.FlatList
                      //   data={userOneDeck}
                      data={
                        playerOne === user?.email ? userOneDeck : userTwoDeck
                      }
                      numColumns={3}
                      scrollEnabled={false}
                      contentContainerStyle={{ alignItems: "center" }}
                      renderItem={({ item, index }) => (
                        <Animated.View
                          style={{
                            backgroundColor:
                              playerOne === user?.email && multiNotInDeckOne
                                ? "rgba(212, 83, 8, 0.6)"
                                : playerOne !== user?.email && multiNotInDeckTwo
                                ? "rgba(212, 83, 8, 0.6)"
                                : "rgba(255, 255, 255, 0.3)",

                            margin: 10,
                            borderRadius: 100,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            disabled={shouldBeDisabled()}
                            key={item.id}
                            onPress={() =>
                              handleClick(
                                item.id,
                                playerOne === user?.email
                                  ? "userOne"
                                  : "userTwo"
                              )
                            }
                            style={{
                              padding: 8,
                              margin: 8,
                            }}
                          >
                            <Animated.Image
                              entering={FadeIn.delay(index * 90)}
                              source={item.emoji}
                              style={{
                                width: 47,
                                height: 47,
                                opacity: multiStartDisabled ? 0.2 : 1,
                              }}
                            />
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  </View>
                  <View style={[styles.progressContainer]}>
                    <>
                      {progress ? (
                        <ProgressBar
                          style={{
                            height: 10,
                            width: 300,
                            backgroundColor: "white",
                            borderRadius: 10,
                          }}
                          progress={progress}
                          // color="#6200ee"
                          color={progressColor}
                        />
                      ) : (
                        <ProgressBar
                          style={{
                            height: 10,
                            width: 300,
                            backgroundColor: "white",
                            borderRadius: 10,
                          }}
                          progress={0}
                          // color="#6200ee"
                          color={progressColor}
                        />
                      )}
                    </>
                  </View>
                  <View style={[styles.scoreContainer]}>
                    <Text style={{ fontSize: 50, color: "white" }}>
                      {playerOne === user?.email
                        ? multiUserOneScore
                        : multiUserTwoScore}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <>
              {showGameOverMessage && (
                <Animated.View
                  entering={FadeIn.duration(800).delay(200)}
                  style={styles.gameOverContainer}
                >
                  <View style={[styles.scoreContainerTwo]}>
                    <Text
                      style={{
                        fontSize: 50,
                        color: "white",
                        transform: [{ rotate: `180deg` }],
                      }}
                    >
                      {/* {multiUserTwoScore} */}
                      {playerOne === user?.email
                        ? multiUserTwoScore
                        : multiUserOneScore}
                    </Text>
                  </View>
                  <View style={styles.playTwoWinContainer}>
                    <Text
                      style={{
                        fontSize: 50,
                        fontWeight: "bold",
                        color: "white",
                        transform: [{ rotate: `180deg` }],
                      }}
                    >
                      {playerOne === user?.email &&
                      multiUserOneScore > multiUserTwoScore
                        ? "YOU LOSE"
                        : playerOne !== user?.email &&
                          multiUserOneScore < multiUserTwoScore
                        ? "YOU LOSE"
                        : "YOU WIN"}
                    </Text>
                  </View>
                  <View style={styles.gameOverContainerOptions}>
                    <ThemedButton
                      name="bruce"
                      type="primary"
                      // onPressOut={() => navigation.navigate("Home")}
                      onPressOut={goToHome}
                      width={100}
                      height={110}
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
                        <Entypo name="home" size={70} color="white" />
                      </View>
                    </ThemedButton>

                    {playerOne === user?.email ||
                    userOneClickPlayAgain === true ? (
                      <ThemedButton
                        name="bruce"
                        type="primary"
                        // onPressOut={resetGame}
                        onPressOut={resetGameDelay}
                        width={99}
                        height={110}
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
                          <Ionicons
                            name="play"
                            size={65}
                            color="white"
                            style={{ paddingLeft: 5 }}
                          />
                        </View>
                      </ThemedButton>
                    ) : (
                      <View
                        style={{
                          height: 110,
                          width: 180,
                          marginTop: 25,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Waiting for {"\n"} {shortendEmail} to restart game
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.playOneWinContainer}>
                    <Text
                      style={{
                        fontSize: 50,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {playerOne === user?.email &&
                      multiUserOneScore > multiUserTwoScore
                        ? "YOU WIN"
                        : playerOne !== user?.email &&
                          multiUserOneScore < multiUserTwoScore
                        ? "YOU WIN"
                        : "YOU LOSE"}
                    </Text>
                  </View>
                  <View style={[styles.scoreContainer]}>
                    <Text style={{ fontSize: 50, color: "white" }}>
                      {/* {multiUserOneScore} */}
                      {playerOne === user?.email
                        ? multiUserOneScore
                        : multiUserTwoScore}
                    </Text>
                  </View>
                </Animated.View>
              )}
            </>
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  gameOverContainerOptions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: screenWidth,
    // top: 10,
    bottom: 80,
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
  gameDeckContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    // top: 370,
    top: screenHeight / 2.14,

    // backgroundColor: "rgba(255, 255, 255, 0.65)",
    backgroundColor: "rgba(255, 255, 255, 0.3)",

    borderRadius: 40,
    width: "98%",
    height: "40%",
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
    position: "absolute",
    // top: 500,
    top: screenHeight / 1.67,
  },
  userTwoDeckContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: screenHeight / 5.12,
  },

  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // top: 740,
    top: screenHeight / 1.15,
  },

  progressContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // top: 740,
    top: screenHeight / 1.07,
    height: 50,
    width: "100%",
  },

  progressTwoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // top: 740,
    top: screenHeight / 18.4,
    height: 50,
    width: "100%",
    transform: [{ rotate: "180deg" }],
  },

  scoreContainerTwo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 80,
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
  playOneWinContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 600,
  },
  playTwoWinContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    position: "absolute",
    top: 150,
  },
});
