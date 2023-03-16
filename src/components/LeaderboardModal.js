import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import CustomSwitch from "./CustomSwitch";
import { useAuth } from "../hooks/useAuth";
import Checkbox from "expo-checkbox";
import themesContext from "../config/themesContext";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const fixedScreenWidth = parseInt(screenWidth.toFixed());

function LeaderboardModal({
  leaderboardVisible,
  setLeaderboardVisible,
  leaderBoardArrayOneMinGame,
  leaderBoardArraySpeedGame,
  oneMinGameTodayStats,
  fiveSecGameTodayStats,
  userID,
  leaderBoardArrayOneMinGameUser,
  fiveSecGameGameUser,
}) {
  const theme = useContext(themesContext);

  const [gameMode, setGameMode] = useState("oneMin");
  const [hideModal, setHideModal] = useState(false);

  const [todaysStats, setTodaysStats] = useState(false);

  const { user } = useAuth();

  const onHideModal = () => {
    setLeaderboardVisible(!leaderboardVisible);
    setGameMode("oneMin");
    setTodaysStats(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={leaderboardVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setLeaderboardVisible(!leaderboardVisible);
      }}
    >
      {/* <TouchableWithoutFeedback onPress={onHideModal}> */}
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Leaderboard</Text>
          <View
            style={{
              position: "absolute",
              right: 30,
              top: 24,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                Today's
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                Stats
              </Text>
            </View>

            <Checkbox
              style={{
                position: "absolute",
                right: 12,
                top: 30,

                ...(fixedScreenWidth === 411 && {
                  top: 36,
                }),
              }}
              value={todaysStats}
              color={theme.buttonColor}
              onValueChange={() => {
                setTodaysStats(!todaysStats);
              }}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <CustomSwitch
              selectionMode={1}
              roundCorner={true}
              option1={"1 MIN"}
              option2={"Speed"}
              onSelectSwitch={(val) =>
                setGameMode(val === 1 ? "oneMin" : "fiveSec")
              }
              selectionColor={theme.buttonColor}
            />
          </View>

          <View
            style={{
              display: "flex",
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
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                Username
              </Text>
            </View>
            <View style={{ position: "absolute", right: 24 }}>
              <Text style={{ fontWeight: "700", fontSize: 15 }}>Score</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          ></View>
          {gameMode === "oneMin" ? (
            <>
              <FlatList
                data={
                  todaysStats
                    ? oneMinGameTodayStats
                    : leaderBoardArrayOneMinGame
                }
                numColumns={1}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                keyExtractor={(item) => item[0]}
                style={{
                  width: "100%",
                  flexGrow: 0,
                  height: "68%",
                }}
                renderItem={({ item, index }) => {
                  let color = "black";
                  let badge = "";
                  let marginRight = 20;

                  const badgeTextStyle = {
                    color: "black",
                    marginRight: 10,
                    fontSize: 15,
                    position: "relative",
                    left: -5,
                  };

                  if (index === 0) {
                    badge = "🥇";
                  } else if (index === 1) {
                    badge = "🥈";
                  } else if (index === 2) {
                    badge = "🥉";
                  }

                  const email = item[0];
                  const [truncatedEmail] = email.split("@");

                  return (
                    <View
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          marginRight: item[0] === userID ? 0 : 10,
                          marginLeft: item[0] === userID ? 0 : 10,
                          marginTop: item[0] === userID ? 8 : 8,
                          marginBottom: item[0] === userID ? 7 : 7,
                          // width: "90%",
                          width: item[0] === userID ? "93.5%" : "87%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          backgroundColor:
                            item[0] === userID ? theme.buttonColor : "white",
                          borderRadius: 20,
                          padding: item[0] === userID ? 10 : 0,

                          // marginRight: item[0] === user?.email ? 0 : 10,
                          // marginLeft: item[0] === user?.email ? 0 : 10,
                          // marginTop: item[0] === user?.email ? 8 : 8,
                          // marginBottom: item[0] === user?.email ? 7 : 7,
                          // // width: "90%",
                          // width: item[0] === user?.email ? "93.5%" : "87%",
                          // display: "flex",
                          // justifyContent: "space-between",
                          // alignItems: "center",
                          // flexDirection: "row",
                          // backgroundColor:
                          //   item[0] === user?.email ? theme.buttonColor : "white",
                          // borderRadius: 20,
                          // padding: item[0] === user?.email ? 10 : 0,
                        }}
                      >
                        <Text
                          style={
                            index < 3
                              ? badgeTextStyle
                              : {
                                  color,
                                  marginRight,
                                }
                          }
                        >
                          <Text
                            style={{
                              fontSize: index < 3 ? 15 : 15,
                              color: item[0] === userID ? "white" : "black",
                            }}
                          >
                            {index < 3 ? badge : `${index + 1}.`}{" "}
                            {truncatedEmail}
                          </Text>
                        </Text>

                        <Text
                          style={{
                            color: item[0] === userID ? "white" : "black",
                          }}
                        >
                          {item[1]}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FlatList
                  data={leaderBoardArrayOneMinGameUser}
                  numColumns={1}
                  scrollEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.index}
                  style={{
                    width: "100%",
                    flexGrow: 0,
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          // backgroundColor: "red",
                          width: "97%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 50,
                        }}
                      >
                        <View
                          style={{
                            // marginRight: 10,
                            marginLeft: 10,
                            marginTop: 8,
                            marginBottom: 7,
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            backgroundColor: theme.buttonColor,
                            borderRadius: 20,
                            padding: 10,
                            position: "relative",
                            right: 3,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 15,
                            }}
                          >
                            {item.index}. {item.currentUserData[0]}
                          </Text>
                          <Text
                            style={{
                              position: "relative",
                              right: 9,
                              color: "white",
                              fontSize: 15,
                            }}
                          >
                            {item.currentUserData[1]}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <FlatList
                data={
                  todaysStats
                    ? fiveSecGameTodayStats
                    : leaderBoardArraySpeedGame
                }
                numColumns={1}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                keyExtractor={(item) => item[0]}
                style={{
                  width: "100%",
                  flexGrow: 0,
                  height: "68%",
                }}
                renderItem={({ item, index }) => {
                  let color = "black";
                  let badge = "";
                  let marginRight = 20;

                  const badgeTextStyle = {
                    color: "black",
                    marginRight: 10,
                    fontSize: 15,
                    position: "relative",
                    left: -5,
                  };

                  if (index === 0) {
                    badge = "🥇";
                  } else if (index === 1) {
                    badge = "🥈";
                  } else if (index === 2) {
                    badge = "🥉";
                  }

                  const email = item[0];
                  const [truncatedEmail] = email.split("@");

                  return (
                    <View
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <View
                        style={{
                          marginRight: item[0] === userID ? 0 : 10,
                          marginLeft: item[0] === userID ? 0 : 10,
                          marginTop: item[0] === userID ? 8 : 8,
                          marginBottom: item[0] === userID ? 7 : 7,
                          // width: "90%",
                          width: item[0] === userID ? "93.5%" : "87%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          backgroundColor:
                            item[0] === userID ? theme.buttonColor : "white",
                          borderRadius: 20,
                          padding: item[0] === userID ? 10 : 0,

                          // marginRight: item[0] === user?.email ? 0 : 10,
                          // marginLeft: item[0] === user?.email ? 0 : 10,
                          // marginTop: item[0] === user?.email ? 8 : 8,
                          // marginBottom: item[0] === user?.email ? 7 : 7,
                          // // width: "90%",
                          // width: item[0] === user?.email ? "93.5%" : "87%",
                          // display: "flex",
                          // justifyContent: "space-between",
                          // alignItems: "center",
                          // flexDirection: "row",
                          // backgroundColor:
                          //   item[0] === user?.email ? theme.buttonColor : "white",
                          // borderRadius: 20,
                          // padding: item[0] === user?.email ? 10 : 0,
                        }}
                      >
                        <Text
                          style={
                            index < 3
                              ? badgeTextStyle
                              : {
                                  color,
                                  marginRight,
                                }
                          }
                        >
                          <Text
                            style={{
                              fontSize: index < 3 ? 15 : 15,
                              color: item[0] === userID ? "white" : "black",
                            }}
                          >
                            {index < 3 ? badge : `${index + 1}.`}{" "}
                            {truncatedEmail}
                          </Text>
                        </Text>

                        <Text
                          style={{
                            color: item[0] === userID ? "white" : "black",
                          }}
                        >
                          {item[1]}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />

              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FlatList
                  data={fiveSecGameGameUser}
                  numColumns={1}
                  scrollEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.index}
                  style={{
                    width: "100%",
                    flexGrow: 0,
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          // backgroundColor: "red",
                          width: "97%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 50,
                        }}
                      >
                        <View
                          style={{
                            // marginRight: 10,
                            marginLeft: 10,
                            marginTop: 8,
                            marginBottom: 7,
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            backgroundColor: theme.buttonColor,
                            borderRadius: 20,
                            padding: 10,
                            position: "relative",
                            right: 3,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 15,
                            }}
                          >
                            {item.index}. {item.currentUserData[0]}
                          </Text>
                          <Text
                            style={{
                              position: "relative",
                              right: 9,
                              color: "white",
                              fontSize: 15,
                            }}
                          >
                            {item.currentUserData[1]}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </>
          )}
          <Pressable
            style={[
              styles.button,
              styles.buttonClose,
              {
                backgroundColor: hideModal ? "darkgray" : theme.buttonColor,
                width: 90,
              },
            ]}
            onPress={() => onHideModal()}
            onTouchStart={() => setHideModal(!hideModal)}
            onTouchEnd={() => setHideModal(false)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </Modal>
  );
}

export default LeaderboardModal;
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

  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
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
    // marginTop: 22,
    marginTop: screenHeight / 2 - 350,

    ...(screenHeight === 667 && {
      marginTop: screenHeight / 2 - 300,
    }),
  },
  modalView: {
    margin: 90,
    width: "90%",
    height: "88%",
    backgroundColor: "white",
    borderRadius: 25,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    alignItems: "center",

    ...(screenHeight === 667 && {
      height: "99%",
    }),
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
    marginTop: 15,
    marginBottom: 10,
    position: "absolute",
    bottom: 0,

    ...(screenHeight === 667 && {
      marginBottom: 4,
    }),
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  // centeredView: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 0,
  // },
});
