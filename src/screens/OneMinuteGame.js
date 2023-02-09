import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";
import handleAlldecks from "../components/decks/IconDecks";
import { IMAGES } from "../../assets";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  serverTimestamp,
  where,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";

import Animated, {
  FlipInEasyX,
  FlipOutEasyX,
  BounceIn,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  SlideInUp,
} from "react-native-reanimated";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export const OneMinuteGame = ({ route, navigation }) => {
  const { gameDecks, monsterDeck, foodDeck, flagDeck, characterDeck } =
    handleAlldecks();
  const getChosenDeck = route.params.finalDeckChoice;
  // console.log(getChosenDeck, "getChosenDeck");

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

  const [timeRemaining, setTimeRemaining] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeck, setNotInDeck] = useState(false);
  const [roundOver, setRoundOver] = useState(true);
  const [todaysHighscore, setTodaysHighscore] = useState();
  const [todaysHighScoreTime, setTodaysHighScoreTime] = useState();
  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const [matchingID, setMatchingID] = useState();

  const { user } = useAuth();
  const refs = useRef([]);

  function checkIfNewDay(todaysHighScoreTime) {
    let currentDate = new Date();

    let serverDate = new Date(todaysHighScoreTime.toDate());
    const docRef = doc(db, "users", user?.email);

    if (currentDate.getDate() !== serverDate.getDate()) {
      oneMinGameTodayHighScore = 0;
      todaysHighScoreTime = currentDate;
      updateDoc(docRef, {
        oneMinGameTodayHighScore: oneMinGameTodayHighScore,
        todaysHighScoreTime: currentDate,
      });
    }
  }

  useEffect(() => {
    if (todaysHighScoreTime) {
      checkIfNewDay(todaysHighScoreTime);
    }
  }, [todaysHighScoreTime]);

  // const getOneMinGameData = async () => {
  //   const userQuerys = collection(db, "users");
  //   const q = query(userQuerys, where("username", "==", `${user?.email}`));

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     setHighScore(doc.data().highScore);
  //     setTodaysHighscore(doc.data().oneMinGameTodayHighScore);
  //     setTodaysHighScoreTime(doc.data().todaysHighScoreTime);
  //   });
  // };

  // useEffect(() => {
  //   getOneMinGameData();

  //   return () => {
  //     getOneMinGameData();
  //   };
  // }, [user?.email, setHighScore]);

  useEffect(() => {
    const userQuerys = collection(db, "users");
    const q = query(userQuerys, where("username", "==", `${user?.email}`));

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setHighScore(doc.data().highScore);
        setTodaysHighscore(doc.data().oneMinGameTodayHighScore);
        setTodaysHighScoreTime(doc.data().todaysHighScoreTime);
      });
    });
  }, [user?.email]);

  const updateCoins = async (score) => {
    let coins = 0;

    if (score === 0) {
      coins = 0;
    } else if (score >= 1 && score < 5) {
      coins = 5;
    } else if (score >= 5 && score < 10) {
      coins = 10;
    } else if (score >= 10 && score < 15) {
      coins = 15;
    } else if (score >= 15 && score < 20) {
      coins = 20;
    } else if (score >= 20 && score < 25) {
      coins = 25;
    } else if (score >= 25 && score < 30) {
      coins = 30;
    } else if (score >= 30 && score < 35) {
      coins = 35;
    } else if (score >= 35 && score <= 40) {
      coins = 40;
    } else {
      coins = 50;
    }

    const docRef = doc(db, "users", user?.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const coinsData = docSnap.data().coins;
      const newCoins = coinsData + coins;
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

  console.log("matchingID", matchingID);
  //make a reset function
  const resetGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setTimeRemaining(60);
    setShowGameOverMessage(false);
    setGameDeck(shuffleArrayPreGame(shuffledArray));
    setUserDeck(getRandomElement(shuffledArray));
  };

  function handleButtonPress() {
    const docRef = doc(db, "users", user?.email);

    setScore(score + 1);
    if (score + 1 > highScore) {
      updateDoc(docRef, {
        highScore: score + 1,
        serverTimestamp: serverTimestamp(),
      });
    }
  }

  function todaysHighScore() {
    const docRef = doc(db, "users", user?.email);

    // checkIfNewDay(todaysHighScoreTime);
    if (score + 1 > todaysHighscore) {
      updateDoc(docRef, {
        oneMinGameTodayHighScore: score + 1,
        todaysHighScoreTime: serverTimestamp(),
      });
    }
  }

  const handleClick = (clickedEmoji) => {
    if (gameDeck[currentIndex].some((emoji) => emoji.id === clickedEmoji)) {
      setUserDeck([...gameDeck[currentIndex]]);
      // setScore(score + 1);

      handleButtonPress();
      todaysHighScore();

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
      setNotInDeck(true);
      setTimeout(() => {
        setNotInDeck(false);
      }, 1200);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    let coins = 0;

    if (score === 0) {
      coins = 0;
    } else if (score >= 1 && score < 5) {
      coins = 5;
    } else if (score >= 5 && score < 10) {
      coins = 10;
    } else if (score >= 10 && score < 15) {
      coins = 15;
    } else if (score >= 15 && score < 20) {
      coins = 20;
    } else if (score >= 20 && score < 25) {
      coins = 25;
    } else if (score >= 25 && score < 30) {
      coins = 30;
    } else if (score >= 30 && score < 35) {
      coins = 35;
    } else if (score >= 35 && score <= 40) {
      coins = 40;
    } else {
      coins = 50;
    }

    return coins;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
        style={styles.linearGradient}
      >
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreText}>High Score</Text>
          <Text style={styles.highScoreText}>{highScore}</Text>
        </View>
        <>
          {!showGameOverMessage && (
            <Animated.View
              entering={FadeIn.duration(2000)}
              style={styles.timerContainer}
            >
              <CountdownCircleTimer
                isPlaying={!gameOver}
                duration={timeRemaining}
                colors={["#003300", "#FFFF00", "#FF3333"]}
                colorsTime={[15, 7, 0]}
                strokeWidth={15}
                trailStrokeWidth={7}
                size={150}
                onComplete={() => {
                  setGameOver(true);
                }}
              >
                {({ remainingTime }) => (
                  <Animated.Text
                    entering={FadeIn.duration(900).delay(500)}
                    style={{ fontSize: 40, color: "white" }}
                  >
                    {remainingTime}
                  </Animated.Text>
                )}
              </CountdownCircleTimer>
            </Animated.View>
          )}

          {!showGameOverMessage && (
            <>
              <View style={styles.newMiddleBarConatiner}>
                {roundOver && (
                  <Animated.View
                    entering={FlipInEasyX.duration(875)}
                    exiting={
                      gameOver
                        ? FadeOut.duration(10)
                        : FlipOutEasyX.duration(850)
                    }
                    style={[styles.gameDeckContainer]}
                  >
                    {gameDeck[currentIndex].map((emoji, index) => (
                      <Animated.Image
                        source={emoji.emoji}
                        style={{
                          width:
                            getChosenDeck === "foodDeck" || "flagDeck"
                              ? 49
                              : 45,
                          height:
                            getChosenDeck === "foodDeck" || "flagDeck"
                              ? 49
                              : 45,

                          transform: [{ rotate: `${emoji.rotation}deg` }],
                          opacity: gameOver
                            ? emoji.id === matchingID
                              ? 1
                              : 0.2
                            : 1,
                        }}
                        key={index}
                      />
                    ))}
                  </Animated.View>
                )}
              </View>

              {/* test icon size view */}
              {/* <View
                style={[
                  styles.gameContainer,
                  { alignItems: "center", justifyContent: "center" },
                ]}
              >
                <View style={[styles.userDeckContainerList]}>
                  <Animated.View
                    style={{
                      // backgroundColor: notInDeck
                      //   ? "rgba(212, 83, 8, 0.6)"
                      //   : "rgba(255, 255, 255, 0.3)",
                      // margin: 10,
                      // borderRadius: 100,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      disabled={gameOver === true || notInDeck ? true : false}
                      // onPress={() => handleClick(item.id)}
                      style={{
                        padding: 8,
                        margin: 8,
                      }}
                    >
                      <Animated.Image
                        entering={FadeIn.duration(900).delay(90)}
                        source={IMAGES.scoobyDoo}
                        style={{
                          width: 85,
                          height: 85,
                          backgroundColor: notInDeck
                            ? "rgba(212, 83, 8, 0.6)"
                            : "rgba(255, 255, 255, 0.3)",
                          // margin: 10,
                          // borderRadius: 100,

                          opacity: gameOver === true ? 0.5 : 1,
                        }}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </View> */}

              <Animated.View
                exiting={FadeOut.duration(800)}
                style={[
                  styles.gameContainer,
                  { alignItems: "center", justifyContent: "center" },
                ]}
              >
                <View style={[styles.userDeckContainerList]}>
                  <Animated.FlatList
                    data={userDeck}
                    numColumns={3}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 10 }} />
                    )}
                    contentContainerStyle={{ alignItems: "center" }}
                    renderItem={({ item, index }) => (
                      <Animated.View
                        style={{
                          backgroundColor: notInDeck
                            ? "rgba(212, 83, 8, 0.6)"
                            : "rgba(255, 255, 255, 0.3)",
                          margin: 10,
                          borderRadius: 100,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <TouchableOpacity
                          disabled={
                            gameOver === true || notInDeck ? true : false
                          }
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
                            // source={IMAGES.kermit}
                            style={{
                              width:
                                getChosenDeck === "foodDeck" ||
                                "flagDeck" ||
                                "characterDeck"
                                  ? 57
                                  : 55,
                              height:
                                getChosenDeck === "foodDeck" ||
                                "flagDeck" ||
                                "characterDeck"
                                  ? 57
                                  : 55,

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
                </View>
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
              <Text
                style={{
                  fontSize: 40,
                  color: "white",
                }}
              >
                Coins Earned: {getCoinsEarned()}
              </Text>
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
      </LinearGradient>
    </SafeAreaView>
  );
};

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
    top: screenHeight / -5.5,
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
