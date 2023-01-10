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
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";

import { useAuth } from "../hooks/useAuth";

import Animated, {
  SlideOutRight,
  BounceIn,
  FadeIn,
  FadeInLeft,
} from "react-native-reanimated";

const defaultUserTwo = [
  { id: 1, emoji: "😀" },
  { id: 2, emoji: "😃" },
  { id: 3, emoji: "😄" },
  { id: 1, emoji: "😘" },
  { id: 2, emoji: "😃" },
  { id: 7, emoji: "😘" },
];

const defaultUserOne = [
  { id: 1, emoji: "😀" },
  { id: 2, emoji: "😃" },
  { id: 3, emoji: "😄" },
  { id: 1, emoji: "😘" },
  { id: 2, emoji: "😃" },
  { id: 7, emoji: "😘" },
];

const gameDecks = [
  [
    { id: 1, emoji: "😘", rotation: 45 },
    { id: 2, emoji: "😃", rotation: 90 },
    { id: 3, emoji: "😅", rotation: 135 },
    { id: 4, emoji: "😘", rotation: 45 },
    { id: 5, emoji: "😃", rotation: 90 },
    { id: 8, emoji: "😅", rotation: 135 },
  ],
  [
    { id: 1, emoji: "😃", rotation: 180 },
    { id: 2, emoji: "😘", rotation: 225 },
    { id: 3, emoji: "😁", rotation: 270 },
    { id: 4, emoji: "😘", rotation: 45 },
    { id: 5, emoji: "😃", rotation: 90 },
    { id: 7, emoji: "😇", rotation: 135 },
  ],
  [
    { id: 1, emoji: "😘", rotation: 315 },
    { id: 2, emoji: "😁", rotation: 0 },
    { id: 3, emoji: "😆", rotation: 45 },
    { id: 4, emoji: "😘", rotation: 45 },
    { id: 5, emoji: "😃", rotation: 90 },
    { id: 6, emoji: "😅", rotation: 135 },
  ],
  [
    { id: 1, emoji: "😁", rotation: 90 },
    { id: 2, emoji: "😆", rotation: 135 },
    { id: 3, emoji: "😘", rotation: 180 },
    { id: 4, emoji: "😘", rotation: 45 },
    { id: 5, emoji: "😃", rotation: 90 },
    { id: 6, emoji: "😅", rotation: 135 },
  ],
];

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

console.log(screenHeight, "screenheight");
export default function DuelGame({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userTwoDeck, setUserTwoDeck] = useState(defaultUserTwo);
  const [userOneDeck, setUserOneDeck] = useState(defaultUserOne);
  const [userOneScore, setUserOneScore] = useState(0);
  const [userTwoScore, setUserTwoScore] = useState(0);
  const [score, setScore] = useState(0);

  const [gameDeck, setGameDeck] = useState(gameDecks);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeckOne, setNotInDeckOne] = useState(false);
  const [notInDeckTwo, setNotInDeckTwo] = useState(false);
  const [roundOver, setRoundOver] = useState(true);
  const [roundOverForUser, setRoundOverForUser] = useState(true);

  const [startDisabled, setStartDisabled] = useState(true);

  useEffect(() => {
    if (userOneScore + userTwoScore === 10) {
      setGameOver(true);
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
                {roundOverForUser && (
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
                        <Animated.Text
                          // entering={BounceIn.delay(index * 130)}
                          entering={FadeIn.delay(index * 90)}
                          style={{
                            fontSize: 50,
                            backgroundColor: notInDeckTwo
                              ? "red"
                              : "transparent",
                            opacity: gameOver === true ? 0.5 : 1,
                            transform: [{ rotate: `180deg` }],
                          }}
                        >
                          {item.emoji}
                        </Animated.Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
              </View>
              {roundOver && (
                <Animated.View
                  // entering={FadeIn.duration(1000).delay(300)}
                  // exiting={SlideOutRight.duration(1000).springify().mass(0.5)}
                  style={[styles.gameDeckContainer]}
                >
                  {gameDeck[currentIndex].map((emoji, index) => (
                    <Animated.Text
                      entering={FadeIn.duration(200).delay(index * 130)}
                      style={{
                        fontSize: 50,
                        transform: [{ rotate: `${emoji.rotation}deg` }],
                      }}
                      key={index}
                    >
                      {emoji.emoji}
                    </Animated.Text>
                  ))}
                </Animated.View>
              )}

              <View style={[styles.userDeckContainerList]}>
                {roundOverForUser && (
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
                        <Animated.Text
                          entering={BounceIn.delay(index * 90)}
                          style={{
                            fontSize: 50,
                            backgroundColor: notInDeckOne
                              ? "red"
                              : "transparent",
                            opacity: gameOver === true ? 0.5 : 1,
                          }}
                        >
                          {item.emoji}
                        </Animated.Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
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
              <Text style={{ fontSize: 50, color: "white" }}>
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
    justifyContent: "center",
    position: "absolute",
    top: 370,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 40,
    width: "100%",
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
