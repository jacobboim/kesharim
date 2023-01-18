import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  FlatList,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedButton } from "react-native-really-awesome-button";
import { useActionSheet } from "@expo/react-native-action-sheet";
import CustomSwitch from "../components/CustomSwitch";
import LeaderboardModal from "../components/LeaderboardModal";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../config";
import { db } from "../config/firebase";
import Animated, {
  BounceIn,
  FadeIn,
  FlipInEasyX,
  FlipOutEasyX,
} from "react-native-reanimated";

import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  limit,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

import {
  Fontisto,
  Feather,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  const [leaderBoardArrayOneMinGame, setLeaderBoardArrayOneMinGame] = useState(
    []
  );

  const [leaderBoardArraySpeedGame, setLeaderBoardArraySpeedGame] = useState(
    []
  );
  const [minTouched, setMinTouched] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);

  const [speedTouched, setSpeedTouched] = useState(false);
  const [gameFinalScore, setGameFinalScore] = useState(0);

  const onSelectSwitch = (index) => {
    alert("Selected index: " + index);
  };

  const getTopTenWithUsernameOneMinGame = () => {
    //gets the query for the top ten scores of the day
    // const today = new Date();

    // const startOfToday = Timestamp.fromDate(
    //   new Date(today.getFullYear(), today.getMonth(), today.getDate())
    // );
    // const endOfToday = Timestamp.fromMillis(
    //   startOfToday.toMillis() + 24 * 60 * 60 * 1000 - 1
    // );

    // const q = query(
    //   collection(db, "users"),
    //   orderBy("serverTimestamp", "desc"),
    //   where("serverTimestamp", ">=", startOfToday),
    //   where("serverTimestamp", "<=", endOfToday),
    //   limit(10)
    // );

    const q = query(
      collection(db, "users"),
      orderBy("highScore", "desc"),

      limit(10)
    );

    onSnapshot(q, (querySnapshot) => {
      const topTen = [];
      const scoreAndUsernameObj = {};

      querySnapshot.forEach((doc) => {
        topTen.push(doc.data().highScore);
        scoreAndUsernameObj[doc.data().username] = doc.data().highScore;
      });

      const entries = Object.entries(scoreAndUsernameObj);
      entries.sort((a, b) => b[1] - a[1]);
      const sortedScoreAndUsernameObj = Object.fromEntries(entries);
      setLeaderBoardArrayOneMinGame(Object.entries(sortedScoreAndUsernameObj));

      // const sortedScoreAndUsernameObj = Object.keys(scoreAndUsernameObj)
      //   .sort((a, b) => scoreAndUsernameObj[b] - scoreAndUsernameObj[a])
      //   .reduce((r, k) => ((r[k] = scoreAndUsernameObj[k]), r), {});
      // setLeaderBoardArrayOneMinGame(Object.entries(sortedScoreAndUsernameObj));
    });
  };

  const getTopTenWithUsernameSpeedGame = () => {
    const q = query(
      collection(db, "users"),
      orderBy("FiveSecondGameScore", "desc"),

      limit(10)
    );

    onSnapshot(q, (querySnapshot) => {
      const topTen = [];
      const scoreAndUsernameObj = {};

      querySnapshot.forEach((doc) => {
        topTen.push(doc.data().highScore);
        scoreAndUsernameObj[doc.data().username] =
          doc.data().FiveSecondGameScore;
      });

      const entries = Object.entries(scoreAndUsernameObj);
      entries.sort((a, b) => b[1] - a[1]);
      const sortedScoreAndUsernameObj = Object.fromEntries(entries);
      setLeaderBoardArraySpeedGame(Object.entries(sortedScoreAndUsernameObj));
    });
  };

  useEffect(() => {
    getTopTenWithUsernameOneMinGame();
    getTopTenWithUsernameSpeedGame();

    console.log("user: ", user);
  }, [user]);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const buttonData = [
    {
      name: "bruce",
      type: "primary",
      onPressOut: () => navigation.navigate("OneMinuteGame"),
      width: 110,
      height: 110,
      borderRadius: 150,
      backgroundColor: "#818384",
      icon: "stopwatch",
      label: "1 MIN",
    },
    {
      name: "bruce",
      type: "primary",
      onPressOut: () => navigation.navigate("FiveSecondGame"),
      width: 110,
      height: 110,
      borderRadius: 150,
      backgroundColor: "#818384",
      icon: "stopwatch",
      label: "Speed",
    },
    {
      name: "bruce",
      type: "primary",
      onPressOut: () => navigation.navigate("DuelGame"),
      width: 110,
      height: 110,
      borderRadius: 150,
      backgroundColor: "#818384",
      icon: "stopwatch",
      label: "Duel",
    },
  ];

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
        setGameFinalScore(options[selectedIndex]);
        navigation.navigate("DuelGame", {
          gameFinalScore: options[selectedIndex],
        });
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

  const goToOneMin = () => {
    setTimeout(() => {
      navigation.navigate("OneMinuteGame");
    }, 150);
  };

  const goToSpeed = () => {
    setTimeout(() => {
      navigation.navigate("FiveSecondGame");
    }, 150);
  };

  const goToDuel = () => {
    setTimeout(() => {
      onPress();
    }, 150);
  };

  return (
    <LinearGradient
      colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
      // start={[0, 0]}
      // end={[0, 1]}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <Text style={styles.gameName}>Kesharim</Text>
        <View style={styles.gameOptionsContatier}>
          {/* <FlatList
            data={buttonData}
            numColumns={2}
            // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <View style={{ margin: 10 }}>
                <ThemedButton
                  name={item.name}
                  type={item.type}
                  onPressOut={item.onPressOut}
                  width={item.width}
                  height={item.height}
                  borderRadius={item.borderRadius}
                  backgroundColor={item.backgroundColor}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Fontisto name={item?.icon} size={60} color="white" />
                    <Text style={{ fontSize: 20, color: "white" }}>
                      {item.label}
                    </Text>
                  </View>
                </ThemedButton>
              </View>
            )}
          /> */}

          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={leaderboardVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setLeaderboardVisible(!leaderboardVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Leaderboard</Text>
                <View style={{ alignItems: "center", margin: 10 }}>
                  <CustomSwitch
                    selectionMode={1}
                    roundCorner={true}
                    option1={"1 MIN"}
                    option2={"Speed"}
                    onSelectSwitch={onSelectSwitch}
                    selectionColor={"#818384"}
                  />
                </View>
                <View
                  style={{
                    display: "flex ",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    width: "100%",
                    marginBottom: 2,
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      left: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "800",
                        fontSize: 15,
                      }}
                    >
                      Username
                    </Text>
                  </View>
                  <View style={{ position: "absolute", right: 3 }}>
                    <Text style={{ fontWeight: "800", fontSize: 15 }}>
                      Score
                    </Text>
                  </View>
                </View>

                <FlatList
                  data={leaderBoardArrayOneMinGame}
                  numColumns={1}
                  scrollEnabled={false}
                  // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                  keyExtractor={(item) => item[0]}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        margin: 10,
                        width: "80%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{ color: "black", marginRight: 20 }}>
                        {index + 1}. {item[0]}
                      </Text>
                      <Text style={{ color: "black" }}>{item[1]}</Text>
                    </View>
                  )}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setLeaderboardVisible(!leaderboardVisible)}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
              </View>
            </View>
          </Modal> */}

          <LeaderboardModal
            leaderboardVisible={leaderboardVisible}
            setLeaderboardVisible={setLeaderboardVisible}
            onSelectSwitch={onSelectSwitch}
            leaderBoardArrayOneMinGame={leaderBoardArrayOneMinGame}
            leaderBoardArraySpeedGame={leaderBoardArraySpeedGame}
          />

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
              width={110}
              height={110}
              borderRadius={150}
              backgroundColor="#818384"
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
              width={110}
              height={110}
              borderRadius={150}
              backgroundColor="#818384"
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
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              width: "100%",
              marginLeft: 50,
              marginTop: 30,
            }}
          >
            <ThemedButton
              name="bruce"
              type="primary"
              onPressOut={goToDuel}
              width={110}
              height={110}
              borderRadius={150}
              backgroundColor="#818384"
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
                    DUEL
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
            bottom: 50,
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
            backgroundColor="#818384"
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
            style={styles.signOut}
            // onPressOut={handleLogout}
            onPressOut={twoOptionAlertHandler}
            width={80}
            height={85}
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
              <Feather name="log-out" size={40} color="white" />
            </View>
          </ThemedButton>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  gameName: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 50,
    color: "white",
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
