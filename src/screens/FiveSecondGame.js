import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Platform,
  Animated as RNAnimated,
  Vibration,
  FlatList,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";
import { IMAGES } from "../../assets";
import themesContext from "../config/themesContext";

import handleAlldecks from "../components/decks/IconDecks";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";

import Animated, {
  SlideOutRight,
  BounceIn,
  FadeIn,
  FlipInEasyX,
  FlipOutEasyX,
  FadeOut,
} from "react-native-reanimated";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export function FiveSecondGame({ route, navigation }) {
  const theme = useContext(themesContext);

  const {
    gameDecks,
    monsterDeck,
    foodDeck,
    flagDeck,
    characterDeck,
    nhlDeck,
    animalDeck,
    emojiDeck,
  } = handleAlldecks();
  const getChosenDeck = route.params.finalDeckChoice;

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
    if (getChosenDeck === "nhlDeck") {
      return nhlDeck;
    }
    if (getChosenDeck === "animalDeck") {
      return animalDeck;
    }
    if (getChosenDeck === "emojiDeck") {
      return emojiDeck;
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

  function getRandomElement(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex === 0) {
      randomIndex = 1;
    }
    return array[randomIndex];
  }

  const randomUserDeck = getRandomElement(shuffledArray);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userDeck, setUserDeck] = useState(randomUserDeck);
  const [gameDeck, setGameDeck] = useState(shuffledArray);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState();
  const [loading, setLoading] = useState(false);
  const [frame, setFrame] = useState(0);

  const [timeRemaining, setTimeRemaining] = useState(9);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeck, setNotInDeck] = useState(false);
  const [roundOver, setRoundOver] = useState(true);
  const [roundWon, setRoundWon] = useState(false);
  const [roundOverForUser, setRoundOverForUser] = useState(true);
  const [playAgain, setPlayAgain] = useState(false);
  const [goHome, setGoHome] = useState(false);
  const [matchingEmojis, setMatchingEmojis] = useState([]);
  const [matchingID, setMatchingID] = useState();
  // const [nonMatchingEmojis, setNonMatchingEmojis] = useState([]);
  // const [fadeAnim] = useState(new RNAnimated.Value(1));
  const [todaysHighFiveSecTime, setTodaysHighFiveSecTime] = useState();
  const [todaysFiveSecHighscore, setTodaysFiveSecHighscore] = useState();
  const [showGameOverMessage, setShowGameOverMessage] = useState(false);

  const { user } = useAuth();

  function checkIfNewDay(todaysHighFiveSecTime) {
    let currentDate = new Date();

    let serverDate = new Date(todaysHighFiveSecTime.toDate());
    const docRef = doc(db, "users", user?.email);

    if (currentDate.getDate() !== serverDate.getDate()) {
      fiveMinGameTodayHighScore = 0;
      todaysHighFiveSecTime = currentDate;
      updateDoc(docRef, {
        fiveMinGameTodayHighScore: fiveMinGameTodayHighScore,
        todaysHighFiveSecTime: currentDate,
      });
    }
  }

  useEffect(() => {
    if (todaysHighFiveSecTime) {
      checkIfNewDay(todaysHighFiveSecTime);
    }
  }, [todaysHighFiveSecTime]);

  useEffect(() => {
    const userQuerys = collection(db, "users");
    const q = query(userQuerys, where("username", "==", `${user?.email}`));

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setHighScore(doc.data().FiveSecondGameScore);
        setTodaysFiveSecHighscore(doc.data().fiveMinGameTodayHighScore);
        setTodaysHighFiveSecTime(doc.data().todaysHighFiveSecTime);
      });
    });
  }, [user?.email]);

  const updateCoins = async (score) => {
    let coins = 0;

    // if (score === 0) {
    //   coins = 0;
    // } else if (score >= 1 && score < 5) {
    //   coins = 5;
    // } else if (score >= 5 && score < 10) {
    //   coins = 10;
    // } else if (score >= 10 && score < 15) {
    //   coins = 15;
    // } else if (score >= 15 && score < 20) {
    //   coins = 20;
    // } else if (score >= 20 && score < 25) {
    //   coins = 25;
    // } else if (score >= 25 && score < 30) {
    //   coins = 30;
    // } else if (score >= 30 && score < 35) {
    //   coins = 35;
    // } else if (score >= 35 && score <= 40) {
    //   coins = 40;
    // } else {
    //   coins = 50;
    // }

    // coins = score;

    const docRef = doc(db, "users", user?.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const coinsData = docSnap.data().coins;
      const newCoins = coinsData + score;
      updateDoc(docRef, {
        coins: newCoins,
      });
    }
  };

  useEffect(() => {
    if (gameOver) {
      updateCoins(score);

      setTimeout(() => {
        setShowGameOverMessage(true);
      }, 1050);
    }
  }, [gameOver]);

  const findMatchingId = () => {
    gameDeck[currentIndex].forEach((gameDeckItem) => {
      let found = userDeck.find((userDeckItem) => {
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
  }, [currentIndex, gameDeck, userDeck]);

  //make a reset function
  const resetGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setTimeRemaining(9);
    setShowGameOverMessage(false);
    setGameDeck(shuffleArrayPreGame(shuffledArray));
    setUserDeck(getRandomElement(shuffledArray));
  };

  function handleButtonPress() {
    const docRef = doc(db, "users", user?.email);

    setScore(score + 1);
    if (score + 1 > highScore) {
      updateDoc(docRef, {
        FiveSecondGameScore: score + 1,
        fiveSecondTimeStamp: serverTimestamp(),
      });
    }
  }

  function todaysHighScore() {
    const docRef = doc(db, "users", user?.email);

    // checkIfNewDay(todaysHighScoreTime);
    if (score + 1 > todaysFiveSecHighscore) {
      updateDoc(docRef, {
        fiveMinGameTodayHighScore: score + 1,
        todaysHighFiveSecTime: serverTimestamp(),
      });
    }
  }

  function addTime() {
    if (score <= 10) {
      setTimeRemaining(timeRemaining - timeRemaining + 9);
    } else if (score <= 20) {
      setTimeRemaining(timeRemaining - timeRemaining + 8);
    } else if (score <= 40) {
      setTimeRemaining(timeRemaining - timeRemaining + 7);
    } else if (score <= 60) {
      setTimeRemaining(timeRemaining - timeRemaining + 6.5);
    } else if (score <= 80) {
      setTimeRemaining(timeRemaining - timeRemaining + 5.5);
    } else if (score <= 100) {
      setTimeRemaining(timeRemaining - timeRemaining + 5);
    } else {
      setTimeRemaining(timeRemaining - timeRemaining + 4.5);
    }
  }

  // function addTime() {
  //   if (score <= 5) {
  //     setTimeRemaining(timeRemaining - timeRemaining + 500);
  //   } else if (score <= 10) {
  //     setTimeRemaining(timeRemaining - timeRemaining + 500);
  //   } else {
  //     setTimeRemaining(timeRemaining - timeRemaining + 500);
  //   }
  // }

  const handleClick = (clickedEmoji) => {
    if (gameDeck[currentIndex].some((emoji) => emoji.id === clickedEmoji)) {
      setUserDeck([...gameDeck[currentIndex]]);
      handleButtonPress();
      todaysHighScore();

      setRoundOver(false);
      setRoundOverForUser(false);
      setRoundWon(true);
      addTime();

      setTimeout(() => setRoundOver(true), 500);
      setTimeout(() => setRoundOverForUser(true), 500);

      setMatchingEmojis(
        gameDeck[currentIndex].filter((emoji) => emoji.id === clickedEmoji)
      );

      if (currentIndex === gameDeck.length - 1) {
        const beforeShuffle = gameDeck;
        shuffleArray(beforeShuffle);
        setGameDeck(beforeShuffle);

        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      setNotInDeck(true);
      Vibration.vibrate(50);

      setTimeout(() => setNotInDeck(false), 1200);
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
  };

  const resetGameDelay = () => {
    setTimeout(() => {
      resetGame();
    }, 170);
  };

  const getCoinsEarned = () => {
    // let coins = 0;

    // if (score === 0) {
    //   coins = 0;
    // } else if (score >= 1 && score < 5) {
    //   coins = 5;
    // } else if (score >= 5 && score < 10) {
    //   coins = 10;
    // } else if (score >= 10 && score < 15) {
    //   coins = 15;
    // } else if (score >= 15 && score < 20) {
    //   coins = 20;
    // } else if (score >= 20 && score < 25) {
    //   coins = 25;
    // } else if (score >= 25 && score < 30) {
    //   coins = 30;
    // } else if (score >= 30 && score < 35) {
    //   coins = 35;
    // } else if (score >= 35 && score <= 40) {
    //   coins = 40;
    // } else {
    //   coins = 50;
    // }

    return score;
  };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.backgroundArray}
        // colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
        style={styles.linearGradient}
      >
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreText}>High Score</Text>
          <Text style={styles.highScoreText}>{highScore}</Text>
        </View>
        <>
          {!showGameOverMessage && (
            <Animated.View
              entering={FadeIn.duration(1000).delay(200)}
              exiting={FadeOut.duration(800)}
              style={styles.timerContainer}
            >
              {roundOver && (
                <Animated.View>
                  <CountdownCircleTimer
                    isPlaying={!gameOver}
                    duration={timeRemaining}
                    colors={["#003300", "#FFFF00", "#FF3333"]}
                    colorsTime={[8, 4, 0]}
                    strokeWidth={15}
                    trailStrokeWidth={7}
                    size={screenWidth >= 900 ? 190 : 150}
                    onComplete={() => {
                      //   resetTimer();

                      if (!roundWon) {
                        setRoundWon(false);
                        // setTimeout(() => setGameOver(true), 2000);
                        setGameOver(true);
                      } else {
                        setGameOver(true);
                        // setTimeout(() => setGameOver(true), 2000);
                      }
                      return {
                        shouldRepeat: roundWon ? true : false,
                        delay: 1,
                      };
                    }}
                  >
                    {({ remainingTime }) => (
                      <Animated.Text
                        entering={FadeIn.duration(400).delay(700)}
                        style={{
                          fontSize: screenWidth >= 900 ? 60 : 40,
                          color: "white",
                        }}
                      >
                        {remainingTime}
                      </Animated.Text>
                    )}
                  </CountdownCircleTimer>
                </Animated.View>
              )}
            </Animated.View>
          )}

          {!showGameOverMessage && (
            <>
              <View style={styles.newMiddleBarConatiner}>
                {roundOver && (
                  <Animated.View
                    entering={FlipInEasyX.duration(875)}
                    exiting={FlipOutEasyX.duration(850)}
                    style={[styles.gameDeckContainer]}
                  >
                    {gameDeck[currentIndex].map((emoji, index) => (
                      <Animated.Image
                        source={emoji.emoji}
                        style={[
                          {
                            // width: 45,
                            // height: 45,
                            width:
                              screenWidth >= 900
                                ? 95
                                : getChosenDeck === "foodDeck" || "flagDeck"
                                ? 49
                                : 45,
                            height:
                              screenWidth >= 900
                                ? 95
                                : getChosenDeck === "foodDeck" || "flagDeck"
                                ? 49
                                : 45,
                            transform: [{ rotate: `${emoji.rotation}deg` }],
                            opacity: gameOver
                              ? emoji.id === matchingID
                                ? 1
                                : 0.2
                              : 1,
                          },
                        ]}
                        key={index}
                      />
                    ))}
                  </Animated.View>
                )}
              </View>

              <Animated.View
                exiting={FadeOut.duration(800)}
                style={[styles.userDeckContainerList]}
              >
                <Animated.FlatList
                  data={userDeck}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={{ alignItems: "center" }}
                  renderItem={({ item, index }) => (
                    <Animated.View
                      style={{
                        backgroundColor: notInDeck
                          ? "rgba(212, 83, 8, 0.6)"
                          : "rgba(255, 255, 255, 0.4)",
                        margin: 10,
                        borderRadius: 100,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        disabled={gameOver === true || notInDeck ? true : false}
                        key={item.id}
                        onPress={() => handleClick(item.id)}
                        style={{
                          padding: 8,
                          margin: 8,
                        }}
                      >
                        <Animated.Image
                          entering={FadeIn.duration(900).delay(index * 90)}
                          source={item.emoji}
                          style={{
                            width:
                              screenWidth >= 900
                                ? 95
                                : getChosenDeck === "foodDeck" ||
                                  "flagDeck" ||
                                  "characterDeck"
                                ? 57
                                : 55,
                            height:
                              screenWidth >= 900
                                ? 95
                                : getChosenDeck === "foodDeck" ||
                                  "flagDeck" ||
                                  "characterDeck"
                                ? 57
                                : 55,
                            // width: 50,
                            // height: 50,
                            opacity: gameOver
                              ? item.id === matchingID
                                ? 1
                                : 0.2
                              : 1,
                          }}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </Animated.View>
            </>
          )}

          {!gameOver && (
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
          )}
        </>

        {showGameOverMessage && (
          <Animated.View
            entering={FadeIn.duration(800).delay(200)}
            style={styles.gameOverContainer}
          >
            <View style={styles.gameOverContainerOptions}>
              <ThemedButton
                name="bruce"
                type="primary"
                onPressOut={() => navigation.navigate("Home")}
                width={100}
                height={110}
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
                  <Entypo name="home" size={70} color="white" />
                </View>
              </ThemedButton>

              <ThemedButton
                name="bruce"
                type="primary"
                // onPressOut={resetGame}
                onPressOut={resetGameDelay}
                width={99}
                height={110}
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
                  <Ionicons
                    name="play"
                    size={65}
                    color="white"
                    style={{ paddingLeft: 5 }}
                  />
                </View>
              </ThemedButton>
            </View>
            <View style={[styles.gameOverScoreContainer]}>
              <Text
                style={{
                  fontSize: 40,
                  color: "white",
                }}
              >
                Score: {score}
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <Image
                  style={{
                    width: 30,
                    height: 30,
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
                    fontSize: 40,
                    color: "white",
                    marginLeft: 10,
                  }}
                >
                  +{getCoinsEarned()}
                </Text>
              </View>
            </View>

            {/* <Text style={{ fontSize: 50, marginTop: 190, color: "white" }}> */}

            <Text style={styles.gameOverText}>Game Over</Text>
          </Animated.View>
        )}

        {!showGameOverMessage && (
          <View style={[styles.scoreContainer]}>
            <Text style={{ fontSize: 50, color: "white" }}>{score}</Text>
          </View>
        )}

        {/* {showGameOverMessage && (
          <Animated.View
            entering={FadeIn.duration(800).delay(200)}
            style={styles.gameOverContainer}
          >
            <View style={styles.gameOverContainerOptions}>
              <ThemedButton
                name="bruce"
                type="primary"
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

              <ThemedButton
                name="bruce"
                type="primary"
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
            </View>

            <Text style={{ fontSize: 50, marginTop: 180, color: "white" }}>
              Game Over
            </Text>
          </Animated.View>
        )}

        <View style={[styles.scoreContainer]}>
          <Text style={{ fontSize: 50, color: "white" }}>{score}</Text>
        </View> */}
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
    // top: 40,
    top: screenHeight / -5.5,
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
    //place at the bottom left of the screen
    // bottom: 165,
    // left: 15,
    //place at the top left of the screen
    top: 40,
    left: 10,
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

  newMiddleBarConatiner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: screenHeight / 4.5,
    width: "100%",
    height: "40%",

    ...(screenHeight === 667 && {
      top: screenHeight / 4.9,
    }),

    ...(Platform.OS === "android" && {
      top: screenHeight / 5.1,
    }),
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
    position: "absolute",
    top: screenHeight / 1.67,

    ...(screenHeight === 667 && {
      top: screenHeight / 1.81,
    }),

    ...(Platform.OS === "android" && {
      top: screenHeight / 1.75,
    }),
  },
  gameOverText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // top: 720,
    top: screenHeight / 1.15,
    fontSize: 50,
    color: "white",
  },
  gameOverScoreContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // top: 720,
    width: screenWidth,
    top: screenHeight / 1.63,

    // marginTop: screenHeight / 3,
  },

  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // top: 720,
    top: screenHeight / 1.13,

    ...(screenHeight === 667 && {
      top: screenHeight / 1.11,
    }),

    ...(Platform.OS === "android" && {
      top: screenHeight / 1.18,
    }),

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
