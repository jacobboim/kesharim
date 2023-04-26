import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";
import { IMAGES } from "../../assets";
import { ProgressBar } from "react-native-paper";
import handleAlldecks from "../components/decks/IconDecks";
import themesContext from "../config/themesContext";

import Animated, {
  BounceIn,
  FadeIn,
  FlipInEasyX,
  FlipOutEasyX,
} from "react-native-reanimated";

// import handleAlldecks from "../components/decks/IconDecks";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function DuelGame({ route, navigation }) {
  const theme = useContext(themesContext);

  const getChosenDeck = route.params.finalDeckChoice;
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

  const defaultUserOne = userOneRandom(shuffledArray);
  const defaultUserTwo = userTwoRandom(shuffledArray);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [userTwoDeck, setUserTwoDeck] = useState(defaultUserTwo);
  const [userOneDeck, setUserOneDeck] = useState(defaultUserOne);
  const [userOneScore, setUserOneScore] = useState(0);
  const [userTwoScore, setUserTwoScore] = useState(0);

  const [gameDeck, setGameDeck] = useState(shuffledArray);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeckOne, setNotInDeckOne] = useState(false);
  const [notInDeckTwo, setNotInDeckTwo] = useState(false);
  const [roundOver, setRoundOver] = useState(true);
  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const [progress, setProgress] = useState(0);

  const [startDisabled, setStartDisabled] = useState(true);

  useEffect(() => {
    if (userOneScore + userTwoScore === route.params.gameFinalScore) {
      const timeout = setTimeout(() => {
        setGameOver(true);
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [userOneScore, userTwoScore]);

  useEffect(() => {
    if (startDisabled) {
      const timeout = setTimeout(() => {
        setStartDisabled(false);
      }, 710);

      return () => clearTimeout(timeout);
    }
  }, [startDisabled]);

  useEffect(() => {
    if (notInDeckOne) {
      const timeout = setTimeout(() => {
        setNotInDeckOne(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [notInDeckOne]);

  useEffect(() => {
    if (notInDeckTwo) {
      const timeout = setTimeout(() => {
        setNotInDeckTwo(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [notInDeckTwo]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (progress >= 1) {
  //       clearInterval(interval);
  //       return;
  //     }
  //     setProgress(progress + 0.01);
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, [progress]);

  useEffect(() => {
    const totalScore = userOneScore + userTwoScore;
    const newProgress = totalScore / route.params.gameFinalScore;
    setProgress(newProgress);
  }, [userOneScore, userTwoScore]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        setShowGameOverMessage(true);
      }, 500);
    }
  }, [gameOver]);

  const resetGame = () => {
    setUserOneScore(0);
    setUserTwoScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setShowGameOverMessage(false);

    setGameDeck(shuffledArray);
    setUserOneDeck(defaultUserOne);
    setUserTwoDeck(defaultUserTwo);
  };

  const handleClick = (clickedEmoji, user) => {
    if (gameDeck[currentIndex].some((emoji) => emoji.id === clickedEmoji)) {
      if (user === "userOne") {
        setUserOneScore(userOneScore + 1);
        setUserOneDeck([...gameDeck[currentIndex]]);
      } else {
        setUserTwoScore(userTwoScore + 1);
        setUserTwoDeck([...gameDeck[currentIndex]]);
      }
      setStartDisabled(true);

      setRoundOver(false);

      setTimeout(() => setRoundOver(true), 500);

      if (currentIndex === gameDeck.length - 1) {
        const beforeShuffle = gameDeck;
        shuffleArray(beforeShuffle);
        setGameDeck(beforeShuffle);

        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      if (user === "userOne") {
        setNotInDeckOne(true);
      } else {
        setNotInDeckTwo(true);
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
  };

  const resetGameDelay = () => {
    setTimeout(() => {
      resetGame();
    }, 170);
  };

  const progressColor = "#263238";

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.backgroundArray}
        style={styles.linearGradient}
      >
        <View
          style={[
            styles.gameContainer,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          {!showGameOverMessage && (
            <>
              <View style={[styles.progressTwoContainer]}>
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
              </View>
              <View style={[styles.scoreContainerTwo]}>
                <Text
                  style={{
                    fontSize: 50,
                    color: "white",
                    transform: [{ rotate: `180deg` }],
                  }}
                >
                  {userTwoScore}
                </Text>
              </View>
              <View style={[styles.userTwoDeckContainer]}>
                <Animated.FlatList
                  data={userTwoDeck}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={{ alignItems: "center" }}
                  renderItem={({ item, index }) => (
                    <Animated.View
                      // entering={FadeIn.delay(index * 100)}
                      style={{
                        backgroundColor: notInDeckTwo
                          ? "rgba(212, 83, 8, 0.6)"
                          : "rgba(255, 255, 255, 0.4)",
                        margin: 10,
                        borderRadius: 100,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        disabled={
                          gameOver === true ||
                          startDisabled === true ||
                          notInDeckTwo
                            ? true
                            : false
                        }
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
                            width: screenWidth >= 900 ? 95 : 47,
                            height: screenWidth >= 900 ? 95 : 47,
                            // opacity: gameOver === true ? 0.5 : 1,
                            transform: [{ rotate: `180deg` }],
                            opacity: startDisabled ? 0.2 : 1,
                          }}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              </View>

              {roundOver && (
                <Animated.View
                  entering={FlipInEasyX.duration(875)}
                  exiting={FlipOutEasyX.duration(850)}
                  style={[styles.gameDeckContainer]}
                >
                  {gameDeck[currentIndex].map((emoji, index) => (
                    <Animated.Image
                      source={emoji.emoji}
                      style={{
                        width: screenWidth >= 900 ? 95 : 45,
                        height: screenWidth >= 900 ? 95 : 45,
                        transform: [{ rotate: `${emoji.rotation}deg` }],
                      }}
                      key={index}
                    />
                  ))}
                </Animated.View>
              )}

              <View style={[styles.userDeckContainerList]}>
                <Animated.FlatList
                  data={userOneDeck}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={{ alignItems: "center" }}
                  renderItem={({ item, index }) => (
                    <Animated.View
                      // entering={FadeIn.delay(index * 100)}
                      style={{
                        backgroundColor: notInDeckOne
                          ? "rgba(212, 83, 8, 0.6)"
                          : "rgba(255, 255, 255, 0.4)",
                        margin: 10,
                        borderRadius: 100,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        disabled={
                          gameOver === true ||
                          startDisabled === true ||
                          notInDeckOne
                            ? true
                            : false
                        }
                        key={item.id}
                        onPress={() => handleClick(item.id, "userOne")}
                        style={{
                          padding: 8,
                          margin: 8,
                        }}
                      >
                        <Animated.Image
                          entering={FadeIn.delay(index * 90)}
                          source={item.emoji}
                          style={{
                            width: screenWidth >= 900 ? 95 : 47,
                            height: screenWidth >= 900 ? 95 : 47,
                            opacity: startDisabled ? 0.2 : 1,

                            // opacity: gameOver === true ? 0.5 : 1,
                          }}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              </View>
              <View style={[styles.progressContainer]}>
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
              </View>
              <View style={[styles.scoreContainer]}>
                <Text style={{ fontSize: 50, color: "white" }}>
                  {userOneScore}
                </Text>
              </View>
            </>
          )}
        </View>

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
                {userTwoScore}
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
                {userOneScore < userTwoScore ? "YOU WIN" : "YOU LOSE"}
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
            <View style={styles.playOneWinContainer}>
              <Text
                style={{ fontSize: 50, color: "white", fontWeight: "bold" }}
              >
                {userOneScore > userTwoScore ? "YOU WIN" : "YOU LOSE"}
              </Text>
            </View>
            <View style={[styles.scoreContainer]}>
              <Text style={{ fontSize: 50, color: "white" }}>
                {userOneScore}
              </Text>
            </View>
          </Animated.View>
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
    // fontFamily: "Helvetica",
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
    backgroundColor: "rgba(255, 255, 255, 0.4)",

    borderRadius: 40,
    width: "98%",
    height: "40%",

    ...(screenHeight === 667 && {
      height: "35%",
      top: screenHeight / 2.02,
    }),
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

    ...(screenHeight === 667 && {
      top: screenHeight / 1.64,
    }),
  },
  userTwoDeckContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: screenHeight / 5.12,

    ...(screenHeight === 667 && {
      top: screenHeight / 5.52,
    }),
  },

  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // top: 740,
    top: screenHeight / 1.15,

    ...(screenHeight >= 900 && {
      top: screenHeight / 1.12,
    }),

    ...(screenHeight === 667 && {
      top: screenHeight / 1.12,
    }),

    ...(Platform.OS === "android" && {
      top: screenHeight / 1.19,
    }),
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

    ...(screenHeight === 667 && {
      top: screenHeight / 1.05,
    }),

    ...(Platform.OS === "android" && {
      top: screenHeight / 1.11,
    }),
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

    ...(screenHeight >= 900 && {
      top: 110,
    }),

    ...(screenHeight === 667 && {
      top: 70,
    }),
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
