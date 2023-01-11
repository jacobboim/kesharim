import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Pressable,
  Button,
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
  getFirestore,
  onSnapshot,
  addDoc,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";

import Animated, {
  SlideOutRight,
  BounceIn,
  FadeIn,
} from "react-native-reanimated";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

console.log(screenHeight, "screenheight");
export function OneMinuteGame({ navigation }) {
  const defaultUserDeck = [
    { id: "wordpress", emoji: IMAGES.wordpress },
    { id: "android", emoji: IMAGES.android },
    { id: "facebook", emoji: IMAGES.facebook },
    { id: "twitter", emoji: IMAGES.twitter },
    { id: "chrome", emoji: IMAGES.chrome },
    { id: "snapchat", emoji: IMAGES.snapchat },
  ];

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userDeck, setUserDeck] = useState(defaultUserDeck);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState();
  const [loading, setLoading] = useState(false);

  const [gameDeck, setGameDeck] = useState(gameDecks);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeck, setNotInDeck] = useState(false);
  const [roundOver, setRoundOver] = useState(true);
  const [roundOverForUser, setRoundOverForUser] = useState(true);

  const { user } = useAuth();

  async function getHighScore() {
    const userQuery = collection(db, "users");

    onSnapshot(userQuery, (docsSnap) => {
      docsSnap.forEach((doc) => {
        if (doc.id === user?.email) {
          setHighScore(doc.data().highScore);
          console.log(highScore, "highScore");
        }
      });
    });
  }
  getHighScore();

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
    setTimeRemaining(25);
  };

  function handleButtonPress() {
    const docRef = doc(db, "users", user?.email);

    setScore(score + 1);
    if (score + 1 > highScore) {
      updateDoc(docRef, {
        highScore: score + 1,
      });
    }
  }

  const handleClick = (clickedEmoji) => {
    if (gameDeck[currentIndex].some((emoji) => emoji.id === clickedEmoji)) {
      setUserDeck([...gameDeck[currentIndex]]);
      // setScore(score + 1);
      handleButtonPress();
      console.log(userDeck, "userDeck");

      setRoundOver(false);
      setRoundOverForUser(false);

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

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
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
        {!gameOver && (
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

        {/* <Image
          source={IMAGES.snapchat}
          style={{
            width: 50,
            height: 50,
            // marginBottom: 3,
            marginTop: 90,
            position: "absolute",
          }}
        /> */}

        <View
          style={[
            styles.gameContainer,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          {!gameOver && (
            <>
              {roundOver && (
                <Animated.View
                  entering={FadeIn.duration(800).delay(100)}
                  // exiting={SlideOutRight.duration(1000).springify().mass(0.5)}
                  style={[styles.gameDeckContainer]}
                >
                  {gameDeck[currentIndex].map((emoji, index) => (
                    // <Animated.Text
                    //   entering={FadeIn.duration(200).delay(index * 90)}
                    //   style={{
                    //     fontSize: 50,
                    //     transform: [{ rotate: `${emoji.rotation}deg` }],
                    //   }}
                    //   key={index}
                    // >
                    //   {emoji.emoji}
                    // </Animated.Text>

                    <Animated.Image
                      entering={FadeIn.duration(200).delay(index * 90)}
                      source={emoji.emoji}
                      style={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        transform: [{ rotate: `${emoji.rotation}deg` }],
                      }}
                      key={index}
                    />
                  ))}
                </Animated.View>
              )}

              <View style={[styles.userDeckContainerList]}>
                {roundOverForUser && (
                  <Animated.FlatList
                    // entering={FadeIn.duration(700)}
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
                        {/* <Animated.Text
                          entering={BounceIn.delay(index * 90)}
                          style={{
                            fontSize: 50,
                            backgroundColor: notInDeck ? "red" : "transparent",
                            opacity: gameOver === true ? 0.5 : 1,
                          }}
                        >
                          {item.emoji}
                        </Animated.Text> */}

                        <Animated.Image
                          entering={BounceIn.delay(index * 90)}
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
                )}

                {/* {userDeck.map((emoji, index) => (
                <TouchableOpacity
                  disabled={gameOver === true || notInDeck ? true : false}
                  key={index}
                  onPress={() => handleClick(emoji)}
                >
                  <Text
                    style={{
                      fontSize: 50,
                      backgroundColor: notInDeck ? "red" : "white",
                      opacity: gameOver === true ? 0.5 : 1,
                    }}
                  >
                    {emoji.emoji}
                  </Text>
                </TouchableOpacity>
              ))} */}
              </View>
            </>
          )}
        </View>

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

              {/* <Pressable
                onPress={resetGame}
                onTouchStart={() => setPlayAgain(!playAgain)}
                onTouchEnd={() => setPlayAgain(false)}
                style={{
                  backgroundColor: playAgain ? "darkgray" : "#818384",
                  padding: 15,
                  borderRadius: 50,
                }}
              >
                <Ionicons
                  name="play"
                  size={65}
                  color="white"
                  style={{ paddingLeft: 5 }}
                />
              </Pressable> */}
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
    top: screenHeight / 6.9,
    // backgroundColor: "yellow",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 40,
    width: "96%",
    height: "50%",
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
