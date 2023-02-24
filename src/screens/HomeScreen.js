import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
  Button,
} from "react-native";
import { signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedButton } from "react-native-really-awesome-button";
import { useActionSheet } from "@expo/react-native-action-sheet";
import LeaderboardModal from "../components/LeaderboardModal";
import DecksModal from "../components/DecksModal";
import TutorialModal from "../components/TutorialModal";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../config";
import { db } from "../config/firebase";
import { IMAGES } from "../../assets";
import Animated, {
  BounceIn,
  FadeIn,
  FlipInEasyX,
  FlipOutEasyX,
} from "react-native-reanimated";
import handleAlldecks from "../components/decks/IconDecks";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EventRegister } from "react-native-event-listeners";
import themesContext from "../config/themesContext";

import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  limit,
  getDocs,
  getDoc,
  orderBy,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Foundation,
} from "@expo/vector-icons";
import ThemeModal from "../components/ThemeModal";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const themeData = [
  {
    id: "1",
    title: "DEFAULT",
    color: "#4C5D69",
    buttonColor: "#818384",

    backgroundArray: ["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"],
  },
  {
    id: "2",
    title: "BLUE",
    color: "#2E1C6B",
    buttonColor: "#3B4F77",

    backgroundArray: ["#4E6D8A", "#435D71", "#3B4F77", "#2F3F5E", "#202C3E"],
  },

  {
    id: "4",
    title: "BLUE-GREY",
    color: "#0D1825",
    buttonColor: "#3E5D75",

    backgroundArray: ["#223A4D", "#1F2E3E", "#1B242F", "#171D25", "#13171B"],
  },
  {
    id: "5",
    title: "CHARCOAL",
    buttonColor: "#535353",

    color: "#282828",

    backgroundArray: ["#2F2F2F", "#272727", "#1F1F1F", "#171717", "#0F0F0F"],
  },
  {
    id: "6",
    title: "PURPLE-GREEN",
    color: "#4A4C63",

    buttonColor: "#7B76B6",

    backgroundArray: ["#617291", "#5C6F8E", "#5A5E89", "#53577F", "#4E4F7A"],
  },
  {
    id: "3",
    title: "PURPLE",
    color: "#1B2B3E",
    buttonColor: "#A663CC",

    backgroundArray: ["#223140", "#1E2C3D", "#1A2636", "#161F2E", "#0F1825"],
  },
];

// const TutorialModal = ({ visible, setTutorialVisible }) => (
//   <Modal animationType="slide" transparent={false} visible={visible}>
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>This is your tutorial screen</Text>
//       <Button title="Close" onPress={() => setTutorialVisible(false)} />
//     </View>
//   </Modal>
// );

export const HomeScreen = ({ navigation }) => {
  const theme = useContext(themesContext);
  const [tutorialVisible, setTutorialVisible] = useState(false);

  const { user } = useAuth();
  const { deckOptions } = handleAlldecks();
  const spread = deckOptions();
  const Randomssss = spread.RandomizeDecks;
  const { chosenDeck } = spread;
  // console.log(chosenDeck + " chosenDeck");

  const [leaderBoardArrayOneMinGame, setLeaderBoardArrayOneMinGame] = useState(
    []
  );

  const [oneMinGameTodayStats, setOneMinGameTodayStats] = useState([]);
  const [fiveSecGameTodayStats, setFiveSecGameTodayStats] = useState([]);
  const [homeScreenDeckCHoice, sethomeScreenDeckCHoice] = useState();

  const [leaderBoardArraySpeedGame, setLeaderBoardArraySpeedGame] = useState(
    []
  );
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [decksModalVisible, setDecksModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [gameFinalScore, setGameFinalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [frame, setFrame] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameDecksUnlocked, setGameDecksUnlocked] = useState([]);

  useEffect(() => {
    const userQuerys = collection(db, "users");

    const q = query(userQuerys, where("username", "==", `${user?.email}`));

    const getCurrentDeckSnapShot = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        sethomeScreenDeckCHoice(doc.data().currentDeck);
      });
    });
    return () => {
      getCurrentDeckSnapShot();
    };
  }, [homeScreenDeckCHoice, user?.email]);

  useEffect(() => {
    const checkTutorialVisibility = async () => {
      const tutorialShown = await AsyncStorage.getItem("tutorialShown");
      if (!tutorialShown) {
        setTutorialVisible(true);
        await AsyncStorage.setItem("tutorialShown", "true");
      }
    };
    checkTutorialVisibility();
  }, []);

  const handleShowTutorialAgain = () => {
    setTutorialVisible(true);
  };

  useEffect(() => {
    const userQuerys = collection(db, "users");

    const q = query(userQuerys, where("username", "==", `${user?.email}`));

    const getCurrentDeckSnapShot = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setCoins(doc.data()?.coins);
        setGameDecksUnlocked(doc.data()?.gameDecksUnlocked);
      });
    });
    return () => {
      getCurrentDeckSnapShot();
    };
  }, [user?.email]);

  const onSelectSwitch = (index) => {
    alert("Selected index: " + index);
  };

  const getTopTenWithUsernameOneMinGame = async () => {
    const q = query(
      collection(db, "users"),
      orderBy("highScore", "desc"),

      limit(15)
    );

    // onSnapshot(q, (querySnapshot) => {
    const topTen = [];
    const scoreAndUsernameObj = {};
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      topTen.push(doc.data().highScore);
      scoreAndUsernameObj[doc.data().username] = doc.data().highScore;
    });

    // querySnapshot.forEach((doc) => {
    //   topTen.push(doc.data().highScore);
    //   scoreAndUsernameObj[doc.data().username] = doc.data().highScore;
    // });

    const entries = Object.entries(scoreAndUsernameObj);
    entries.sort((a, b) => b[1] - a[1]);
    const sortedScoreAndUsernameObj = Object.fromEntries(entries);
    setLeaderBoardArrayOneMinGame(Object.entries(sortedScoreAndUsernameObj));
    // });
  };

  const getTopTenWithUsernameOneMinGameToday = async () => {
    //gets the query for the top ten scores of the day
    const today = new Date();

    const startOfToday = Timestamp.fromDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const endOfToday = Timestamp.fromMillis(
      startOfToday.toMillis() + 24 * 60 * 60 * 1000 - 1
    );

    const q = query(
      collection(db, "users"),
      orderBy("todaysHighScoreTime", "desc"),
      where("todaysHighScoreTime", ">=", startOfToday),
      where("todaysHighScoreTime", "<=", endOfToday),
      limit(10)
    );

    // onSnapshot(q, (querySnapshot) => {
    const topTen = [];
    const scoreAndUsernameObj = {};
    const querySnapshot = await getDocs(q);

    // querySnapshot.forEach((doc) => {
    //   topTen.push(doc.data().highScore);
    //   scoreAndUsernameObj[doc.data().username] =
    //     doc.data().oneMinGameTodayHighScore;
    // });

    querySnapshot.forEach((doc) => {
      topTen.push(doc.data().highScore);
      scoreAndUsernameObj[doc.data().username] =
        doc.data()?.oneMinGameTodayHighScore;
    });

    const entries = Object.entries(scoreAndUsernameObj);
    entries.sort((a, b) => b[1] - a[1]);
    const sortedScoreAndUsernameObj = Object.fromEntries(entries);
    setOneMinGameTodayStats(Object.entries(sortedScoreAndUsernameObj));
    // });
  };

  const getTopTenWithUsernameFiveSecGameToday = async () => {
    //gets the query for the top ten scores of the day
    const today = new Date();

    const startOfToday = Timestamp.fromDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const endOfToday = Timestamp.fromMillis(
      startOfToday.toMillis() + 24 * 60 * 60 * 1000 - 1
    );

    const q = query(
      collection(db, "users"),
      orderBy("todaysHighFiveSecTime", "desc"),
      where("todaysHighFiveSecTime", ">=", startOfToday),
      where("todaysHighFiveSecTime", "<=", endOfToday),
      limit(10)
    );

    // onSnapshot(q, (querySnapshot) => {
    const topTen = [];
    const scoreAndUsernameObj = {};
    const querySnapshot = await getDocs(q);

    // querySnapshot.forEach((doc) => {
    //   topTen.push(doc.data().highScore);
    //   scoreAndUsernameObj[doc.data().username] =
    //     doc.data().fiveMinGameTodayHighScore;
    // });

    querySnapshot.forEach((doc) => {
      topTen.push(doc.data().highScore);
      scoreAndUsernameObj[doc.data().username] =
        doc.data().fiveMinGameTodayHighScore;
    });

    const entries = Object.entries(scoreAndUsernameObj);
    entries.sort((a, b) => b[1] - a[1]);
    const sortedScoreAndUsernameObj = Object.fromEntries(entries);
    setFiveSecGameTodayStats(Object.entries(sortedScoreAndUsernameObj));
    // });
  };

  const getTopTenWithUsernameSpeedGame = async () => {
    const q = query(
      collection(db, "users"),
      orderBy("FiveSecondGameScore", "desc"),

      limit(15)
    );

    // onSnapshot(q, (querySnapshot) => {
    const topTen = [];
    const scoreAndUsernameObj = {};
    const querySnapshot = await getDocs(q);

    // querySnapshot.forEach((doc) => {
    //   topTen.push(doc.data().highScore);
    //   scoreAndUsernameObj[doc.data().username] =
    //     doc.data().FiveSecondGameScore;
    // });

    querySnapshot.forEach((doc) => {
      topTen.push(doc.data().highScore);
      scoreAndUsernameObj[doc.data().username] = doc.data().FiveSecondGameScore;
    });

    const entries = Object.entries(scoreAndUsernameObj);
    entries.sort((a, b) => b[1] - a[1]);
    const sortedScoreAndUsernameObj = Object.fromEntries(entries);
    setLeaderBoardArraySpeedGame(Object.entries(sortedScoreAndUsernameObj));
    // });
  };

  useEffect(() => {
    getTopTenWithUsernameSpeedGame();
    getTopTenWithUsernameOneMinGame();
    getTopTenWithUsernameOneMinGameToday();
    getTopTenWithUsernameFiveSecGameToday();

    setLoading(false);

    return () => {
      getTopTenWithUsernameSpeedGame();
      getTopTenWithUsernameOneMinGame();
      getTopTenWithUsernameOneMinGameToday();
      getTopTenWithUsernameFiveSecGameToday();
    };
  }, [user?.email, leaderboardVisible]);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = ["25", "15", "5", "Cancel"];
    // const destructiveButtonIndex = 0;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: "Select the number of rounds",
      },
      (selectedIndex) => {
        if (selectedIndex === 3) return;
        const changeToNumber = Number(options[selectedIndex]);
        // setGameFinalScore(options[selectedIndex]);
        setGameFinalScore(changeToNumber);
        navigation.navigate("DuelGame", {
          // gameFinalScore: options[selectedIndex],
          gameFinalScore: changeToNumber,
          finalDeckChoice: homeScreenDeckCHoice,
        });
      }
    );
  };

  const openSettings = () => {
    const options = [
      "PURPLE",
      "BLUE",
      "PURPLE-GREEN",
      "CHARCOAL",
      "BLUE-GREY",
      "DEFAULT",
      "Cancel",
    ];
    // const destructiveButtonIndex = 0;
    const cancelButtonIndex = 6;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: "Select The Color Theme",
      },
      (selectedIndex) => {
        if (selectedIndex === 6) return;
        EventRegister.emit("changeTheme", options[selectedIndex]);
      }
    );
  };

  const twoOptionAlertHandler = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Yes", onPress: () => handleLogout() },
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const showLeaderboard = () => {
    setTimeout(() => {
      setLeaderboardVisible(!leaderboardVisible);
    }, 150);
  };

  const showDecksModal = () => {
    setTimeout(() => {
      setDecksModalVisible(!decksModalVisible);
    }, 150);
  };

  const showThemeModal = () => {
    setTimeout(() => {
      setThemeModalVisible(!themeModalVisible);
    }, 150);
  };

  const goToOneMin = () => {
    setTimeout(() => {
      navigation.navigate("OneMinuteGame", {
        finalDeckChoice: homeScreenDeckCHoice,
      });
    }, 150);
  };

  const goToSpeed = () => {
    setTimeout(() => {
      navigation.navigate("FiveSecondGame", {
        finalDeckChoice: homeScreenDeckCHoice,
      });
    }, 150);
  };

  const goToDuel = () => {
    setTimeout(() => {
      onPress();
    }, 150);
  };

  const goToSettings = () => {
    setTimeout(() => {
      openSettings();
    }, 150);
  };
  const goToMulti = () => {
    setTimeout(() => {
      navigation.navigate("MultiGameJoin", {
        finalDeckChoice: homeScreenDeckCHoice,
      });
    }, 150);
  };

  const data = [
    {
      key: "1",
      name: "gameDecks",
      image: IMAGES.snapchat,
      backgroundColor: theme.buttonColor,
      displayName: "Media",
      price: 100,
    },
    {
      key: "2",
      name: "monsterDeck",
      image: IMAGES.cuteMonster,
      backgroundColor: theme.buttonColor,
      displayName: "Monster",
      price: 100,
    },
    {
      key: "3",
      name: "foodDeck",
      image: IMAGES.donut,
      backgroundColor: theme.buttonColor,
      displayName: "Food",
      price: 200,
    },
    {
      key: "4",
      name: "flagDeck",
      image: IMAGES.usa,
      backgroundColor: theme.buttonColor,
      displayName: "Flag",
      price: 300,
    },
    {
      key: "5",
      name: "characterDeck",
      image: IMAGES.ironMan,
      backgroundColor: theme.buttonColor,
      displayName: "Character",
      price: 400,
    },

    {
      key: "6",
      name: "nhlDeck",
      image: IMAGES.nhl,
      backgroundColor: theme.buttonColor,
      price: 500,
      displayName: "NHL",
    },
    {
      key: "7",
      name: "animalDeck",
      image: IMAGES.lion,
      backgroundColor: theme.buttonColor,
      price: 600,
      displayName: "Animal",
    },

    // {
    //   key: "6",
    //   name: "gameDecks6",
    //   image: IMAGES.beis,
    //   backgroundColor: "#263238",
    // },
    // {
    //   key: "7",
    //   name: "gameDecks7",
    //   image: IMAGES.drive,
    //   backgroundColor: "#263238",
    // },
  ];

  const getCoinsNumberLength = (coinsNumber) => {
    if (coinsNumber.length === 1) {
      return 60;
    } else if (coinsNumber.length === 2) {
      return 70;
    } else if (coinsNumber.length === 3) {
      return 75;
    } else if (coinsNumber.length === 4) {
      return 85;
    } else if (coinsNumber.length === 5) {
      return 89;
    } else if (coinsNumber.length === 6) {
      return 95;
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#818384" />;
  }

  return (
    <LinearGradient
      // colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
      colors={theme.backgroundArray}
      style={styles.linearGradient}
    >
      <View
        style={{
          position: "absolute",
          top: screenHeight * 0.062,
          left: 20,
          // backgroundColor: "#818384",
          backgroundColor: theme.buttonColor,
          borderRadius: 50,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: getCoinsNumberLength(coins.toString()),
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
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
              color: "#fff",
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            {coins ? coins : 0}
          </Text>
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          top: screenHeight * 0.05,
          right: 20,
          borderRadius: 50,
          zIndex: 1,
        }}
      >
        <ThemedButton
          name="bruce"
          type="primary"
          width={50}
          height={55}
          borderRadius={360}
          backgroundColor={theme.buttonColor}
          onPress={handleShowTutorialAgain}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <AntDesign name="questioncircleo" size={15} color="white" />
          </View>
        </ThemedButton>
      </View>

      <View style={styles.container}>
        <Text style={[{ color: theme.titleColor }, styles.gameName]}>
          Kesharim
        </Text>

        <View style={styles.gameOptionsContatier}>
          <View
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
              width: "95%",
            }}
          >
            <ThemedButton
              name="bruce"
              type="primary"
              onPressOut={goToOneMin}
              width={106}
              height={110}
              borderRadius={150}
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
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={60}
                  color="white"
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  1 MIN
                </Text>
              </View>
            </ThemedButton>

            <ThemedButton
              name="bruce"
              type="primary"
              onPressOut={goToSpeed}
              width={106}
              height={110}
              borderRadius={150}
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
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={60}
                  color="white"
                />
                <Text
                  style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
                >
                  {/* Speed */}
                  SPEED
                </Text>
              </View>
            </ThemedButton>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
              width: "95%",
              // marginLeft: 50,
              marginTop: 30,
            }}
          >
            <ThemedButton
              name="bruce"
              type="primary"
              onPressOut={goToDuel}
              width={106}
              height={110}
              borderRadius={150}
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
                <View style={{ position: "absolute", top: -40 }}>
                  {/* <Ionicons name="people-sharp" size={60} color="white" /> */}
                  <MaterialCommunityIcons
                    name="sword-cross"
                    size={55}
                    color="white"
                  />
                </View>
                <View style={{ position: "absolute", top: 15 }}>
                  <Text
                    style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
                  >
                    DUEL
                  </Text>
                </View>
              </View>
            </ThemedButton>

            <ThemedButton
              name="bruce"
              type="primary"
              onPressOut={goToMulti}
              width={106}
              height={110}
              borderRadius={150}
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
                <View style={{ position: "absolute", top: -42 }}>
                  <Ionicons name="people-sharp" size={60} color="white" />
                </View>
                <View style={{ position: "absolute", top: 15 }}>
                  <Text
                    style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
                  >
                    MULTI
                  </Text>
                </View>
              </View>
            </ThemedButton>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
            position: "absolute",

            top: screenHeight / 1.45,

            width: "80%",
          }}
        >
          <ThemedButton
            name="bruce"
            type="primary"
            // onPressOut={() => setLeaderboardVisible(!leaderboardVisible)}
            onPressOut={showLeaderboard}
            width={80}
            height={85}
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
              <MaterialIcons name="leaderboard" size={40} color="white" />
            </View>
          </ThemedButton>

          <ThemedButton
            name="bruce"
            type="primary"
            onPressOut={showDecksModal}
            width={80}
            height={85}
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
              <Entypo name="emoji-happy" size={40} color="white" />
            </View>
          </ThemedButton>

          <ThemedButton
            name="bruce"
            type="primary"
            // onPressOut={goToSettings}
            onPressOut={showThemeModal}
            width={80}
            height={85}
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
              <Foundation name="paint-bucket" size={40} color="white" />
            </View>
          </ThemedButton>
        </View>

        <View
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
            position: "absolute",
            left: 125,
            top: screenHeight / 1.14,
            width: "100%",

            ...(Platform.OS === "android" && {
              top: screenHeight / 1.19,
            }),
          }}
        >
          <ThemedButton
            name="bruce"
            type="primary"
            style={styles.signOut}
            // onPressOut={handleLogout}
            onPressOut={twoOptionAlertHandler}
            width={70}
            height={75}
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
              <Feather name="log-out" size={30} color="white" />
            </View>
          </ThemedButton>
        </View>
      </View>
      <TutorialModal
        visible={tutorialVisible}
        setTutorialVisible={setTutorialVisible}
      />

      <LeaderboardModal
        leaderboardVisible={leaderboardVisible}
        setLeaderboardVisible={setLeaderboardVisible}
        onSelectSwitch={onSelectSwitch}
        leaderBoardArrayOneMinGame={leaderBoardArrayOneMinGame}
        leaderBoardArraySpeedGame={leaderBoardArraySpeedGame}
        oneMinGameTodayStats={oneMinGameTodayStats}
        fiveSecGameTodayStats={fiveSecGameTodayStats}
      />
      <DecksModal
        decksModalVisible={decksModalVisible}
        setDecksModalVisible={setDecksModalVisible}
        dataForFlatListDecks={data}
        sethomeScreenDeckCHoice={sethomeScreenDeckCHoice}
        homeScreenDeckCHoice={homeScreenDeckCHoice}
        gameDecksUnlocked={gameDecksUnlocked}
        coins={coins}
      />
      <ThemeModal
        themeModalVisible={themeModalVisible}
        setThemeModalVisible={setThemeModalVisible}
        themeData={themeData}
        // setTheme={setTheme}
      />

      <TutorialModal
        visible={tutorialVisible}
        setTutorialVisible={setTutorialVisible}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    // width: "100%",
    height: "70%",
  },
  gameName: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 50,
    // color: "white",
  },
  gameOptionsContatier: {
    width: "100%",
  },
  pressableContaier: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // signOut: {
  //   position: "absolute",
  //   bottom: -195,
  //   left: 84,
  // },
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
  centeredView: {
    // flex: 1,
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 90,
    width: "90%",
    height: "89%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#818384",
    marginTop: 15,
    marginBottom: 15,
    position: "absolute",
    bottom: 0,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 2,
    fontSize: 20,
    textAlign: "center",
  },
});
