import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  ActivityIndicator,
  Share,
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
import { useAuth } from "../hooks/useAuth";

import {
  get,
  ref,
  set,
  onValue,
  update,
  push,
  query,
  orderByChild,
  equalTo,
  off,
  remove,
  ServerValue,
  getDatabase,
} from "firebase/database";

const db = getDatabase();

import CountDown from "../components/CountDown";

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
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export function MultiGameRealTime({ route, navigation }) {
  const theme = useContext(themesContext);

  const getId = route.params.gameId;
  const getChosenDeck = route.params.getChosenDeckJoin;

  const { user } = useAuth();

  const [timeTill, setTimeTill] = useState(120);

  useEffect(() => {
    if (timeTill > 0) {
      const intervalId = setTimeout(() => {
        setTimeTill(timeTill - 1);
      }, 1000); // decrement timer every second

      return () => clearTimeout(intervalId);
    }
  }, [timeTill]);

  // useEffect(() => {
  //   if (bothPlayersJoined) {
  //     setTimeout(() => {
  //       setBothPlayersJoined(true);
  //     }, 3000);
  //   }
  // }, [firstLoadNum, bothPlayersJoined, bothPlayersInGame]);

  useEffect(() => {
    const docRef = ref(db, "games/" + getId);

    const testData = onValue(docRef, (snapshot) => {
      if (snapshot.exists()) {
        // const data = snapshot.child("currentDeck").val();
        const data = snapshot?.child("playerOne").val();

        // const data = snapshot.child("gameType").val();

        // update(ref(db, "games/" + getId), {
        //   playerOne: "helklgneorigne;roing",
        //   currentDeck: getChosenDeck,
        // });
      } else {
        console.log("no data in snapshot.val()");
      }
    });

    const checkForBothPlayers = onValue(docRef, (snapshot) => {
      if (snapshot.exists()) {
        // console.log("data", data);
        if (
          snapshot?.child("playerOne").val() &&
          snapshot?.child("playerTwo").val()
        ) {
          setPlayerTwo(snapshot?.child("playerTwo").val());
          console.log("both players are in the game");
        }
      } else {
        console.log("checking for both players");
      }
    });

    const unsubscribe = onValue(docRef, (snapshot) => {
      if (snapshot?.exists()) {
        // const data = snapshot.child(getId);
        const playerOne = snapshot?.child("playerOne").val();
        const playerOnee = snapshot?.child("playerOne");

        const playerOneBool = playerOnee?.val();

        const playerTwo = snapshot?.child("playerTwo").val();
        const playerTwoo = snapshot?.child("playerTwo");

        const playerTwoBool = playerTwoo?.val();

        const playerOneScore = snapshot?.child("playerOneScore").val();
        const playerTwoScore = snapshot?.child("playerTwoScore").val();
        const currentDeck = snapshot?.child("currentDeck").val();
        const currentIndex = snapshot?.child("currentIndex").val();
        const playerOneIndex = snapshot?.child("playerOneIndex").val();
        const playerTwoIndex = snapshot?.child("playerTwoIndex").val();
        const roundOverMulti = snapshot?.child("roundOverMulti").val();
        const userOneClickPlayAgain = snapshot
          ?.child("userOneClickPlayAgain")
          .val();
        const multiStartDisabled = snapshot?.child("multiStartDisabled").val();
        const multiNotInDeckOne = snapshot?.child("multiNotInDeckOne").val();
        const multiNotInDeckTwo = snapshot?.child("multiNotInDeckTwo").val();
        const numRounds = snapshot?.child("numRounds").val();
        //   const gameCountDown = snapshot?.child("gameCountDown").val();
        const gameDeck = snapshot?.child("gameDeck").val();
        // const gameDeckBool = gameDeck?.val();

        const multiUserOneDeck = snapshot?.child("multiDefaultUserOne").val();
        const multiUserTwoDeck = snapshot?.child("multiDefaultUserTwo").val();

        if (playerOneBool && playerTwoBool) {
          setBothPlayersInGame(true);
          setUserOneClickPlayAgain(userOneClickPlayAgain);
          setMultiUserOneScore(playerOneScore);
          setMultiUserTwoScore(playerTwoScore);
          setMultiUserOneIndex(playerOneIndex);
          setMultiUserTwoIndex(playerTwoIndex);
          setCurrentIndex(currentIndex);
          setPlayerOne(playerOne);
          setRoundOverMulti(roundOverMulti);
          setMultiNotInDeckOne(multiNotInDeckOne);
          setMultiNotInDeckTwo(multiNotInDeckTwo);
          setGameDeck(JSON.parse(gameDeck));

          setUserOneDeck(JSON.parse(multiUserOneDeck));
          setUserTwoDeck(JSON.parse(multiUserTwoDeck));
          setMultiStartDisabled(multiStartDisabled);
          setNumberRounds(numRounds);
        } else if (playerTwo === false) {
          setPlayerOne(playerOne);
          setNumberRounds(numRounds);
          //   update(ref(db, "games/" + getId), {
          //     gameDeck: stringDeck,
          //     multiDefaultUserOne: multiDefaultUserOne,
          //     multiDefaultUserTwo: multiDefaultUserTwo,
          //     // playerTwo: true,
          //   });
          //   setGameDeck(gameDeck);

          if (gameDeck === false) {
            update(ref(db, "games/" + getId), {
              gameDeck: stringDeck,
              multiDefaultUserOne: multiDefaultUserOne,
              multiDefaultUserTwo: multiDefaultUserTwo,
            });
          }
          if (playerOneBool && playerTwoBool === false && timeTill <= 0) {
            remove(docRef);
          } else {
            // console.log("already hase deck");
          }
        } else {
          console.log("one player is in the game");
        }
      }
    });

    const checkIfData = onValue(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Home");
      }
    });

    const checkForPlayAgain = onValue(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserOneClickPlayAgain(
          snapshot?.child("userOneClickPlayAgain").val()
        );
      } else {
        console.log("no data in snapshot.val()");
      }
    });

    return () => {
      testData();
      unsubscribe();
      checkIfData();
      checkForPlayAgain();
      checkForBothPlayers();
    };
  }, [getId, timeTill]);

  useEffect(() => {
    const gameRef = ref(db, "games/" + getId);

    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      setGameCountDown(data?.gameCountDown);

      if (data?.playerOne !== null && data?.playerTwo) {
        if (getId === data?.id) {
          setTimeout(() => {
            update(gameRef, { gameCountDown: 0 });
          }, 3000);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [getId]);

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
  const [firstLoadNum, setFirstLoadNum] = useState(0);
  const [gameCountDown, setGameCountDown] = useState(3);

  const [timer, setTimer] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000); // decrement timer every second

      return () => clearTimeout(intervalId);
    }
  }, [timer]);

  const formatTime = (count) => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    return formatted;
  };

  const getDocData = () => {
    const docRef = ref(db, "games/", getId);

    onValue(
      docRef,
      (snapshot) => {
        const data = snapshot?.child("gameDeck").val();

        if (snapshot.exists()) {
          const parse = JSON.parse(data);
          setGameDeck(parse);
        } else {
          console.log("No such document!");
        }
      },
      {
        onlyOnce: true,
      }
    );
  };

  useEffect(() => {
    getDocData();
  }, [getId]);

  const [gameDeck, setGameDeck] = useState([]);
  const [gameOver, setGameOver] = useState(false);
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
  const [matchingIDTwo, setMatchingIDTwo] = useState();

  const [bothPlayersJoined, setBothPlayersJoined] = useState(true);

  const shortendEmail = playerOne ? playerOne.split("@")[0] : "";
  const shortendEmailTwo = playerTwo ? playerTwo.split("@")[0] : "Waiting...";

  const findMatchingIdUserOne = () => {
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

  const findMatchingIdUserTwo = () => {
    gameDeck[currentIndex] &&
      gameDeck[currentIndex].forEach((gameDeckItem) => {
        let found = userTwoDeck?.find((userDeckItem) => {
          return gameDeckItem.id === userDeckItem.id;
        });
        if (found) {
          setMatchingIDTwo(found.id);
          return;
        }
      });
  };

  //   useEffect(() => {
  //     findMatchingIdUserOne();
  //     findMatchingIdUserTwo();
  //     console.log(matchingID, "player one");
  //     console.log(matchingIDTwo, "player two");
  //   }, [currentIndex, gameDeck]);

  useEffect(() => {
    if (multiUserOneScore + multiUserTwoScore >= numberRounds) {
      // updateDoc(doc(db, "games", getId), {
      //   playerTwo: null,
      // });
      const timeout = setTimeout(() => {
        setGameOver(true);
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [multiUserOneScore, multiUserTwoScore, numberRounds]);

  useEffect(() => {
    if (multiStartDisabled) {
      const timeout = setTimeout(() => {
        update(ref(db, "games/" + getId), {
          multiStartDisabled: false,
        });
      }, 850);

      return () => clearTimeout(timeout);
    }
  }, [multiStartDisabled]);

  useEffect(() => {
    if (multiNotInDeckOne) {
      const timeout = setTimeout(() => {
        update(ref(db, "games/" + getId), {
          multiNotInDeckOne: false,
        });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [multiNotInDeckOne]);

  useEffect(() => {
    if (multiNotInDeckTwo) {
      const timeout = setTimeout(() => {
        update(ref(db, "games/" + getId), {
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
        setTimeTill(120);
        //   const updates = {
        //     userOneClickPlayAgain: false,
        //   };
        //   database.ref(`games/${getId}`).update(updates);

        update(ref(db, "games/" + getId), {
          userOneClickPlayAgain: false,
        });
      }, 500);
    }
  }, [gameOver]);

  const resetGame = () => {
    const updates = {
      gameDeck: stringDeck,
      playerOneScore: 0,
      playerTwoScore: 0,
      playerOneIndex: 28,
      playerTwoIndex: 29,
      multiDefaultUserOne: multiDefaultUserOne,
      multiDefaultUserTwo: multiDefaultUserTwo,
      userOneClickPlayAgain: true,
      playerTwo: playerOne === user?.email ? null : user?.email,
      gameCountDown: 3,
    };
    update(ref(db, "games/" + getId), updates);

    setBothPlayersJoined(true);
    setBothPlayersInGame(false);
    setUserOneScore(0);
    setUserTwoScore(0);

    setGameOver(false);
    setShowGameOverMessage(false);
  };

  const handleClick = (clickedEmoji, user) => {
    if (gameDeck[currentIndex].some((emoji) => emoji.id === clickedEmoji)) {
      if (user === "userOne") {
        setUserOneScore(userOneScore + 1);

        update(ref(db, "games/" + getId), {
          playerOneScore: userOneScore + 1,
          playerOneIndex: currentIndex,
          multiDefaultUserOne: JSON.stringify([...gameDeck[currentIndex]]),
        });
      } else {
        setUserTwoScore(userTwoScore + 1);

        update(ref(db, "games/" + getId), {
          playerTwoScore: userTwoScore + 1,
          playerTwoIndex: currentIndex,
          multiDefaultUserTwo: JSON.stringify([...gameDeck[currentIndex]]),
        });
      }

      update(ref(db, "games/" + getId), {
        roundOverMulti: false,
        multiStartDisabled: true,
      });

      setTimeout(
        () =>
          update(ref(db, "games/" + getId), {
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
        update(ref(db, "games/" + getId), {
          currentIndex: currentIndex + 1,
        });
      }
    } else {
      if (user === "userOne") {
        update(ref(db, "games/" + getId), {
          multiNotInDeckOne: true,
        });
      } else {
        update(ref(db, "games/" + getId), {
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
    const docRef = ref(db, "games/" + getId);
    setTimeout(() => {
      remove(docRef);
    }, 20);
    setTimeout(() => {
      navigation.navigate("Home");
    }, 170);

    setTimeout(() => {
      remove(docRef);
    }, 70);
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
    if (gameCountDown === 3) return true;
    return false;
  };

  const handleShare = async () => {
    try {
      const appLink = "speedster://home"; // Replace with your app link
      const message = `Join the game using this ID: ${shortendEmail}\n\n Open the app here: ${appLink} \n\n App Store: tinyurl.com/SpeedsterIos  \n\n Play Store: tinyurl.com/SpeedsterAndroid`;

      const result = await Share.share({
        message: message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.backgroundArray}
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
            <Text
              style={{
                fontSize: 28,
                color: "white",
                marginBottom: 50,
              }}
            >
              {formatTime(timeTill)}
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
              {/* <TouchableOpacity onPress={handleShare}> */}
              <Text
                onPress={handleShare}
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
              {/* </TouchableOpacity> */}
            </Text>
          </View>
        ) : (
          <>
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
                                  : playerOne !== user?.email &&
                                    multiNotInDeckOne
                                  ? "rgba(212, 83, 8, 0.6)"
                                  : "rgba(255, 255, 255, 0.4)",

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

                    {gameCountDown !== 0 ? (
                      <>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            position: "absolute",
                            top: screenHeight / 2.25,
                            // marginTop: screenHeight / 3.9,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 28,
                              color: "white",
                              marginBottom: 10,
                            }}
                          >
                            {shortendEmail} vs {shortendEmailTwo}
                          </Text>
                          <Text
                            style={{
                              fontSize: 28,
                              color: "white",
                              marginBottom: 10,
                            }}
                          >
                            <CountDown
                              seconds={3}
                              color="white"
                              fontSize={28}
                            />
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
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
                                    transform: [
                                      { rotate: `${emoji.rotation}deg` },
                                    ],
                                  }}
                                  key={index}
                                />
                              ))
                            ) : (
                              <Text>loading</Text>
                            )}
                          </Animated.View>
                        )}
                      </>
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
                                  : playerOne !== user?.email &&
                                    multiNotInDeckTwo
                                  ? "rgba(212, 83, 8, 0.6)"
                                  : "rgba(255, 255, 255, 0.4)",

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
            </>
            {/* // )} */}

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
                      // backgroundColor="#818384"
                      backgroundColor={theme.buttonColor}
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
                        // backgroundColor="#818384"
                        backgroundColor={theme.buttonColor}
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
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",

                      ...(Platform.OS === "android" && {
                        marginBottom: 100,
                      }),
                    }}
                  >
                    Room will close in {formatTime(timeTill)}
                  </Text>

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
      top: screenHeight / 1.69,
    }),
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

    ...(screenHeight === 667 && {
      top: 65,
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

    ...(screenHeight === 667 && {
      top: 540,
    }),
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
