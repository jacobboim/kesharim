import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";
import { IMAGES } from "../../assets";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
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

const gameDecks = [
  [
    { id: "safari", emoji: IMAGES.safari, rotation: 45 },
    { id: "medium", emoji: IMAGES.medium, rotation: 90 },
    { id: "sketch", emoji: IMAGES.sketch, rotation: 135 },
    { id: "instagram", emoji: IMAGES.instagram, rotation: 45 },
    { id: "yelp", emoji: IMAGES.yelp, rotation: 90 },
    { id: "twitter", emoji: IMAGES.twitter, rotation: 135 },
  ],
  [
    { id: "facebook", emoji: IMAGES.facebook, rotation: 45 },
    { id: "messenger", emoji: IMAGES.messenger, rotation: 90 },
    { id: "pinterest", emoji: IMAGES.pinterest, rotation: 135 },
    { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
    { id: "sketch", emoji: IMAGES.sketch, rotation: 90 },
    { id: "paypal", emoji: IMAGES.paypal, rotation: 135 },
  ],
  [
    { id: "facebook", emoji: IMAGES.facebook, rotation: 45 },
    { id: "medium", emoji: IMAGES.medium, rotation: 90 },
    { id: "firefox", emoji: IMAGES.firefox, rotation: 135 },
    { id: "evernote", emoji: IMAGES.evernote, rotation: 45 },
    { id: "luchos", emoji: IMAGES.luchos, rotation: 90 },
    { id: "drive", emoji: IMAGES.drive, rotation: 135 },
  ],
  [
    { id: "evernote", emoji: IMAGES.evernote, rotation: 45 },
    { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
    { id: "vimeo", emoji: IMAGES.vimeo, rotation: 135 },
    { id: "paypal", emoji: IMAGES.paypal, rotation: 45 },
    { id: "android", emoji: IMAGES.android, rotation: 90 },
    { id: "instagram", emoji: IMAGES.instagram, rotation: 135 },
  ],
  [
    { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
    { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
    { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 135 },
    { id: "medium", emoji: IMAGES.medium, rotation: 45 },
    { id: "linkedin", emoji: IMAGES.linkedin, rotation: 90 },
    { id: "youtube", emoji: IMAGES.youtube, rotation: 135 },
  ],
  [
    { id: "torah", emoji: IMAGES.torah, rotation: 45 },
    { id: "drive", emoji: IMAGES.drive, rotation: 90 },
    { id: "yelp", emoji: IMAGES.yelp, rotation: 135 },
    { id: "messenger", emoji: IMAGES.messenger, rotation: 45 },
    { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
    { id: "chrome", emoji: IMAGES.chrome, rotation: 135 },
  ],
  [
    { id: "evernote", emoji: IMAGES.evernote, rotation: 45 },
    { id: "torah", emoji: IMAGES.torah, rotation: 90 },
    { id: "airbnb", emoji: IMAGES.airbnb, rotation: 135 },
    { id: "pinterest", emoji: IMAGES.pinterest, rotation: 45 },
    { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
    { id: "safari", emoji: IMAGES.safari, rotation: 135 },
  ],
  [
    { id: "chrome", emoji: IMAGES.chrome, rotation: 45 },
    { id: "android", emoji: IMAGES.android, rotation: 90 },
    { id: "facebook", emoji: IMAGES.facebook, rotation: 135 },
    { id: "wordpress", emoji: IMAGES.wordpress, rotation: 45 },
    { id: "twitter", emoji: IMAGES.twitter, rotation: 90 },
    { id: "snapchat", emoji: IMAGES.snapchat, rotation: 135 },
  ],
  [
    { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
    { id: "drive", emoji: IMAGES.drive, rotation: 90 },
    { id: "skype", emoji: IMAGES.skype, rotation: 135 },
    { id: "paypal", emoji: IMAGES.paypal, rotation: 45 },
    { id: "twitter", emoji: IMAGES.twitter, rotation: 90 },
    { id: "linkedin", emoji: IMAGES.linkedin, rotation: 135 },
  ],
  [
    { id: "messenger", emoji: IMAGES.messenger, rotation: 45 },
    { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 90 },
    { id: "evernote", emoji: IMAGES.evernote, rotation: 135 },
    { id: "dropbox", emoji: IMAGES.dropbox, rotation: 45 },
    { id: "twitter", emoji: IMAGES.twitter, rotation: 90 },
    { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 135 },
  ],
  [
    { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
    { id: "torah", emoji: IMAGES.torah, rotation: 90 },
    { id: "twitter", emoji: IMAGES.twitter, rotation: 135 },
    { id: "firefox", emoji: IMAGES.firefox, rotation: 45 },
    { id: "vimeo", emoji: IMAGES.vimeo, rotation: 90 },
    { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 135 },
  ],
  [
    { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
    { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 90 },
    { id: "amazon", emoji: IMAGES.amazon, rotation: 135 },
    { id: "android", emoji: IMAGES.android, rotation: 45 },
    { id: "messenger", emoji: IMAGES.messenger, rotation: 90 },
    { id: "medium", emoji: IMAGES.medium, rotation: 135 },
  ],
  [
    { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
    { id: "dropbox", emoji: IMAGES.dropbox, rotation: 90 },
    { id: "youtube", emoji: IMAGES.youtube, rotation: 135 },
    { id: "firefox", emoji: IMAGES.firefox, rotation: 45 },
    { id: "snapchat", emoji: IMAGES.snapchat, rotation: 90 },
    { id: "sketch", emoji: IMAGES.sketch, rotation: 135 },
  ],
  [
    { id: "luchos", emoji: IMAGES.luchos, rotation: 45 },
    { id: "safari", emoji: IMAGES.safari, rotation: 90 },
    { id: "snapchat", emoji: IMAGES.snapchat, rotation: 135 },
    { id: "vimeo", emoji: IMAGES.vimeo, rotation: 45 },
    { id: "linkedin", emoji: IMAGES.linkedin, rotation: 90 },
    { id: "messenger", emoji: IMAGES.messenger, rotation: 135 },
  ],
  [
    { id: "skype", emoji: IMAGES.skype, rotation: 45 },
    { id: "messenger", emoji: IMAGES.messenger, rotation: 90 },
    { id: "instagram", emoji: IMAGES.instagram, rotation: 135 },
    { id: "github", emoji: IMAGES.github, rotation: 45 },
    { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
    { id: "firefox", emoji: IMAGES.firefox, rotation: 135 },
  ],
  [
    { id: "pinterest", emoji: IMAGES.pinterest, rotation: 45 },
    { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 90 },
    { id: "yelp", emoji: IMAGES.yelp, rotation: 135 },
    { id: "android", emoji: IMAGES.android, rotation: 45 },
    { id: "firefox", emoji: IMAGES.firefox, rotation: 90 },
    { id: "linkedin", emoji: IMAGES.linkedin, rotation: 135 },
  ],
  [
    { id: "vimeo", emoji: IMAGES.vimeo, rotation: 45 },
    { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 90 },
    { id: "facebook", emoji: IMAGES.facebook, rotation: 135 },
    { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
    { id: "yelp", emoji: IMAGES.yelp, rotation: 90 },
    { id: "github", emoji: IMAGES.github, rotation: 135 },
  ],
  [
    { id: "torah", emoji: IMAGES.torah, rotation: 45 },
    { id: "medium", emoji: IMAGES.medium, rotation: 90 },
    { id: "github", emoji: IMAGES.github, rotation: 135 },
    { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 45 },
    { id: "snapchat", emoji: IMAGES.snapchat, rotation: 90 },
    { id: "paypal", emoji: IMAGES.paypal, rotation: 135 },
  ],
  [
    { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 45 },
    { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
    { id: "facebook", emoji: IMAGES.facebook, rotation: 135 },
    { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 45 },
    { id: "safari", emoji: IMAGES.safari, rotation: 90 },
    { id: "skype", emoji: IMAGES.skype, rotation: 135 },
  ],
  [
    { id: "sketch", emoji: IMAGES.sketch, rotation: 45 },
    { id: "evernote", emoji: IMAGES.evernote, rotation: 90 },
    { id: "github", emoji: IMAGES.github, rotation: 135 },
    { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 45 },
    { id: "linkedin", emoji: IMAGES.linkedin, rotation: 90 },
    { id: "chrome", emoji: IMAGES.chrome, rotation: 135 },
  ],
  [
    { id: "dropbox", emoji: IMAGES.dropbox, rotation: 45 },
    { id: "luchos", emoji: IMAGES.luchos, rotation: 90 },
    { id: "paypal", emoji: IMAGES.paypal, rotation: 135 },
    { id: "yelp", emoji: IMAGES.yelp, rotation: 45 },
    { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
    { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 135 },
  ],
  [
    { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
    { id: "safari", emoji: IMAGES.safari, rotation: 90 },
    { id: "drive", emoji: IMAGES.drive, rotation: 135 },
    { id: "android", emoji: IMAGES.android, rotation: 45 },
    { id: "github", emoji: IMAGES.github, rotation: 90 },
    { id: "dropbox", emoji: IMAGES.dropbox, rotation: 135 },
  ],
  [
    { id: "evernote", emoji: IMAGES.evernote, rotation: 45 },
    { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
    { id: "vimeo", emoji: IMAGES.vimeo, rotation: 135 },
    { id: "paypal", emoji: IMAGES.paypal, rotation: 45 },
    { id: "android", emoji: IMAGES.android, rotation: 90 },
    { id: "instagram", emoji: IMAGES.instagram, rotation: 135 },
  ],
  [
    { id: "safari", emoji: IMAGES.safari, rotation: 45 },
    { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 90 },
    { id: "chrome", emoji: IMAGES.chrome, rotation: 135 },
    { id: "paypal", emoji: IMAGES.paypal, rotation: 45 },
    { id: "firefox", emoji: IMAGES.firefox, rotation: 90 },
    { id: "amazon", emoji: IMAGES.amazon, rotation: 135 },
  ],
  [
    { id: "luchos", emoji: IMAGES.luchos, rotation: 45 },
    { id: "android", emoji: IMAGES.android, rotation: 90 },
    { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 135 },
    { id: "sketch", emoji: IMAGES.sketch, rotation: 45 },
    { id: "skype", emoji: IMAGES.skype, rotation: 90 },
    { id: "torah", emoji: IMAGES.torah, rotation: 135 },
  ],
  [
    { id: "twitter", emoji: IMAGES.twitter, rotation: 45 },
    { id: "amazon", emoji: IMAGES.amazon, rotation: 90 },
    { id: "github", emoji: IMAGES.github, rotation: 135 },
    { id: "pinterest", emoji: IMAGES.pinterest, rotation: 45 },
    { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
    { id: "luchos", emoji: IMAGES.luchos, rotation: 135 },
  ],
  [
    { id: "luchos", emoji: IMAGES.luchos, rotation: 45 },
    { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 90 },
    { id: "airbnb", emoji: IMAGES.airbnb, rotation: 135 },
    { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
    { id: "chrome", emoji: IMAGES.chrome, rotation: 90 },
    { id: "instagram", emoji: IMAGES.instagram, rotation: 135 },
  ],
  [
    { id: "medium", emoji: IMAGES.medium, rotation: 45 },
    { id: "dropbox", emoji: IMAGES.dropbox, rotation: 90 },
    { id: "vimeo", emoji: IMAGES.vimeo, rotation: 135 },
    { id: "chrome", emoji: IMAGES.chrome, rotation: 45 },
    { id: "skype", emoji: IMAGES.skype, rotation: 90 },
    { id: "pinterest", emoji: IMAGES.pinterest, rotation: 135 },
  ],
  [
    { id: "drive", emoji: IMAGES.drive, rotation: 45 },
    { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 90 },
    { id: "pinterest", emoji: IMAGES.pinterest, rotation: 135 },
    { id: "snapchat", emoji: IMAGES.snapchat, rotation: 45 },
    { id: "instagram", emoji: IMAGES.instagram, rotation: 90 },
    { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 135 },
  ],
  [
    { id: "snapchat", emoji: IMAGES.snapchat, rotation: 45 },
    { id: "skype", emoji: IMAGES.skype, rotation: 90 },
    { id: "evernote", emoji: IMAGES.evernote, rotation: 135 },
    { id: "yelp", emoji: IMAGES.yelp, rotation: 45 },
    { id: "amazon", emoji: IMAGES.amazon, rotation: 90 },
    { id: "menorah", emoji: IMAGES.menorah, rotation: 135 },
  ],
  [
    { id: "drive", emoji: IMAGES.drive, rotation: 45 },
    { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 90 },
    { id: "sketch", emoji: IMAGES.sketch, rotation: 135 },
    { id: "wordpress", emoji: IMAGES.wordpress, rotation: 45 },
    { id: "vimeo", emoji: IMAGES.vimeo, rotation: 90 },
    { id: "amazon", emoji: IMAGES.amazon, rotation: 135 },
  ],
  [
    { id: "torah", emoji: IMAGES.torah, rotation: 45 },
    { id: "instagram", emoji: IMAGES.instagram, rotation: 90 },
    { id: "linkedin", emoji: IMAGES.linkedin, rotation: 135 },
    { id: "facebook", emoji: IMAGES.facebook, rotation: 45 },
    { id: "dropbox", emoji: IMAGES.dropbox, rotation: 90 },
    { id: "amazon", emoji: IMAGES.amazon, rotation: 135 },
  ],
];

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const shuffleArrayPreGame = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const shuffledArray = shuffleArrayPreGame(gameDecks);

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const randomUserDeck = getRandomElement(shuffledArray);

console.log(screenHeight, "screenheight");
export function FiveSecondGame({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userDeck, setUserDeck] = useState(randomUserDeck);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState();
  const [loading, setLoading] = useState(false);

  const [gameDeck, setGameDeck] = useState(shuffledArray);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeck, setNotInDeck] = useState(false);
  const [roundOver, setRoundOver] = useState(true);
  const [roundWon, setRoundWon] = useState(false);
  const [roundOverForUser, setRoundOverForUser] = useState(true);
  const [playAgain, setPlayAgain] = useState(false);
  const [goHome, setGoHome] = useState(false);

  const { user } = useAuth();

  const userQuerys = collection(db, "users");
  const q = query(userQuerys, where("username", "==", `${user?.email}`));

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      setHighScore(doc.data().FiveSecondGameScore);
      console.log(highScore, "highScore");
    });
  });

  useEffect(() => {
    if (notInDeck) {
      const timeout = setTimeout(() => {
        setNotInDeck(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [notInDeck]);

  //make a reset function
  const resetGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setTimeRemaining(10);

    setGameDeck(shuffleArrayPreGame(gameDecks));
    setUserDeck(getRandomElement(shuffledArray));
  };

  function handleButtonPress() {
    const docRef = doc(db, "users", user?.email);

    setScore(score + 1);
    if (score + 1 > highScore) {
      updateDoc(docRef, {
        FiveSecondGameScore: score + 1,
      });
    }
  }

  function addTime() {
    if (score <= 5) {
      setTimeRemaining(timeRemaining - timeRemaining + 8);
    } else if (score <= 10) {
      setTimeRemaining(timeRemaining - timeRemaining + 7);
    } else {
      setTimeRemaining(timeRemaining - timeRemaining + 6);
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
      console.log(userDeck, "userDeck");

      setRoundOver(false);
      setRoundOverForUser(false);
      setRoundWon(true);
      addTime();

      setTimeout(() => setRoundOver(true), 500);
      setTimeout(() => setRoundOverForUser(true), 500);

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
    }
  };

  useEffect(() => {
    if (roundOverForUser) {
      const timeout = setTimeout(() => {
        setRoundOverForUser(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [roundOverForUser]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  console.log(timeRemaining, "timeRemaining");
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
        start={[1, 3]}
        end={[2, 4]}
        style={styles.linearGradient}
      >
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreText}>High Score</Text>
          <Text style={styles.highScoreText}>{highScore}</Text>
        </View>
        <>
          {!gameOver && (
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
                    colorsTime={[15, 7, 0]}
                    strokeWidth={15}
                    trailStrokeWidth={7}
                    size={150}
                    onComplete={() => {
                      //   resetTimer();

                      if (!roundWon) {
                        setRoundWon(false);
                        setGameOver(true);
                      } else {
                        setGameOver(true);
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
                        style={{ fontSize: 40, color: "white" }}
                      >
                        {remainingTime}
                      </Animated.Text>
                    )}
                  </CountdownCircleTimer>
                </Animated.View>
              )}
            </Animated.View>
          )}

          {!gameOver && (
            <>
              <View style={styles.newMiddleBarConatiner}>
                {roundOver && (
                  <Animated.View
                    // entering={FlipInEasyX.duration(600).delay(530)}
                    // exiting={FlipOutEasyX.duration(900)}
                    entering={FlipInEasyX.duration(875)}
                    exiting={FlipOutEasyX.duration(850)}
                    style={[styles.gameDeckContainer]}
                  >
                    {gameDeck[currentIndex].map((emoji, index) => (
                      <Animated.Image
                        source={emoji.emoji}
                        style={{
                          width: 45,
                          height: 45,
                          transform: [{ rotate: `${emoji.rotation}deg` }],
                        }}
                        key={index}
                      />
                    ))}
                  </Animated.View>
                )}
              </View>

              <View style={[styles.userDeckContainerList]}>
                <Animated.FlatList
                  data={userDeck}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={{ alignItems: "center" }}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      disabled={gameOver === true || notInDeck ? true : false}
                      key={item.id}
                      onPress={() => handleClick(item.id)}
                      style={{
                        padding: 10,
                        margin: 10,
                      }}
                    >
                      <Animated.Image
                        entering={BounceIn.duration(900).delay(index * 100)}
                        source={item.emoji}
                        style={{
                          width: 50,
                          height: 50,
                          fontSize: 50,
                          backgroundColor: notInDeck ? "red" : "transparent",
                          opacity: gameOver === true ? 0.5 : 1,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </>
          )}

          {!gameOver && (
            <View style={styles.goHomeContainer}>
              <ThemedButton
                name="bruce"
                type="primary"
                onPressOut={() => navigation.navigate("Home")}
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

        {gameOver && (
          <View style={styles.gameOverContainer}>
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
                onPressOut={resetGame}
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
          </View>
        )}
        <View style={[styles.scoreContainer]}>
          <Text style={{ fontSize: 50, color: "white" }}>{score}</Text>
        </View>
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
    fontFamily: "Helvetica",
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
    position: "absolute",
    top: screenHeight / 1.6,
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 720,
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
