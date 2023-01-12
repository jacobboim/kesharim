import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
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
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";
import { IMAGES } from "../../assets";

import Animated, {
  BounceIn,
  FadeIn,
  FlipInEasyX,
  FlipOutEasyX,
} from "react-native-reanimated";

const defaultUserTwo = [
  { id: "wordpress", emoji: IMAGES.wordpress },
  { id: "android", emoji: IMAGES.android },
  { id: "facebook", emoji: IMAGES.facebook },
  { id: "twitter", emoji: IMAGES.twitter },
  { id: "chrome", emoji: IMAGES.chrome },
  { id: "snapchat", emoji: IMAGES.snapchat },
];

const defaultUserOne = [
  { id: "torah", emoji: IMAGES.torah },
  { id: "drive", emoji: IMAGES.drive },
  { id: "yelp", emoji: IMAGES.yelp },
  { id: "messenger", emoji: IMAGES.messenger },
  { id: "youtube", emoji: IMAGES.youtube },
  { id: "chrome", emoji: IMAGES.chrome },
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

const shuffleArrayPreGame = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const shuffledArray = shuffleArrayPreGame(gameDecks);

function userOneRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function userTwoRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

console.log(screenHeight, "screenheight");
export default function DuelGame({ navigation }) {
  const defaultUserOne = userOneRandom(shuffledArray);
  const defaultUserTwo = userTwoRandom(shuffledArray);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userTwoDeck, setUserTwoDeck] = useState(defaultUserTwo);
  const [userOneDeck, setUserOneDeck] = useState(defaultUserOne);
  const [userOneScore, setUserOneScore] = useState(0);
  const [userTwoScore, setUserTwoScore] = useState(0);
  const [score, setScore] = useState(0);

  const [gameDeck, setGameDeck] = useState(shuffledArray);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeckOne, setNotInDeckOne] = useState(false);
  const [notInDeckTwo, setNotInDeckTwo] = useState(false);
  const [roundOver, setRoundOver] = useState(true);

  const [startDisabled, setStartDisabled] = useState(true);

  useEffect(() => {
    if (userOneScore + userTwoScore === 10) {
      // setGameOver(true);
      //set game over after 1 second
      const timeout = setTimeout(() => {
        setGameOver(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [userOneScore, userTwoScore]);

  useEffect(() => {
    if (startDisabled) {
      const timeout = setTimeout(() => {
        setStartDisabled(false);
      }, 900);

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

  const resetGame = () => {
    setUserOneScore(0);
    setUserTwoScore(0);
    setCurrentIndex(0);
    setGameOver(false);
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

  useEffect(() => {
    if (roundOver) {
      const timeout = setTimeout(() => {
        setRoundOver(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [roundOver]);

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
        <View
          style={[
            styles.gameContainer,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          {!gameOver && (
            <>
              <View style={[styles.scoreContainerTwo]}>
                <Text style={{ fontSize: 50, color: "white" }}>
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
                        padding: 10,
                        margin: 10,
                      }}
                    >
                      <Animated.Image
                        entering={FadeIn.delay(index * 90)}
                        source={item.emoji}
                        style={{
                          width: 50,
                          height: 50,
                          fontSize: 50,
                          backgroundColor: notInDeckTwo ? "red" : "transparent",
                          opacity: gameOver === true ? 0.5 : 1,
                          transform: [{ rotate: `180deg` }],
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                />
              </View>
              {roundOver && (
                <Animated.View
                  entering={FlipInEasyX.duration(1000).delay(400)}
                  exiting={FlipOutEasyX.duration(1000)}
                  style={[styles.gameDeckContainer]}
                >
                  {gameDeck[currentIndex].map((emoji, index) => (
                    <Animated.Image
                      // entering={FadeIn.duration(200).delay(index * 90)}
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
                <Animated.FlatList
                  data={userOneDeck}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={{ alignItems: "center" }}
                  renderItem={({ item, index }) => (
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
                        padding: 10,
                        margin: 10,
                      }}
                    >
                      <Animated.Image
                        entering={FadeIn.delay(index * 100)}
                        source={item.emoji}
                        style={{
                          width: 50,
                          height: 50,
                          fontSize: 50,
                          backgroundColor: notInDeckOne ? "red" : "transparent",
                          opacity: gameOver === true ? 0.5 : 1,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
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

        {gameOver && (
          <View style={styles.gameOverContainer}>
            <View style={styles.playTwoWinContainer}>
              <Text
                style={{
                  fontSize: 50,
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
            <View style={styles.playOneWinContainer}>
              <Text style={{ fontSize: 50, color: "white" }}>
                {userOneScore > userTwoScore ? "YOU WIN" : "YOU LOSE"}
              </Text>
            </View>
          </View>
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
    top: 370,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 40,
    width: "97%",
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
    top: 500,
  },
  userTwoDeckContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: screenHeight / 7,
  },

  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 740,
  },

  scoreContainerTwo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 50,
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
