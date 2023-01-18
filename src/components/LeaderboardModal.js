import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import CustomSwitch from "./CustomSwitch";
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from "../hooks/useAuth";

function LeaderboardModal({
  leaderboardVisible,
  setLeaderboardVisible,
  leaderBoardArrayOneMinGame,
  leaderBoardArraySpeedGame,
}) {
  const [gameMode, setGameMode] = useState("oneMin");
  const [hideModal, setHideModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);
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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Leaderboard</Text>

          <View style={{ marginBottom: 15 }}>
            <CustomSwitch
              selectionMode={1}
              roundCorner={true}
              option1={"1 MIN"}
              option2={"Speed"}
              onSelectSwitch={(val) =>
                setGameMode(val === 1 ? "oneMin" : "fiveSec")
              }
              selectionColor={"#818384"}
            />
          </View>

          {/* <View>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              // stickyHeaderIndices={[0]}
              style={{ backgroundColor: "yellow" }}
              labelStyle={{
                fontSize: 18,
                color: "#000",
                zIndex: 1,
                backgroundColor: "green",
              }}
              containerStyle={{
                width: 100,
                height: 40,

                zIndex: 1,
              }}
              disabledStyle={{
                backgroundColor: "red",
                zIndex: 1,
                backfaceVisibility: "visible",
              }}
              textStyle={{ fontSize: 18, backgroundColor: "red", zIndex: 1 }}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
          </View> */}

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
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                Username
              </Text>
            </View>
            <View style={{ position: "absolute", right: 3 }}>
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
            <FlatList
              data={leaderBoardArrayOneMinGame}
              numColumns={1}
              scrollEnabled={false}
              // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              keyExtractor={(item) => item[0]}
              renderItem={({ item, index }) => {
                let backgroundColor = "white";
                let color = "black";
                let badge = "";
                let marginRight = 20;
                let fontSize = 15;

                if (item[0] === user?.email) {
                  backgroundColor = "#818384";
                  color = "white";
                }

                if (index === 0) {
                  badge = "🥇";
                  marginRight = 1;
                  fontSize = 20;
                } else if (index === 1) {
                  badge = "🥈";
                  marginRight = 15;
                  fontSize = 20;
                } else if (index === 2) {
                  badge = "🥉";
                  marginRight = 15;
                  fontSize = 20;
                }
                return (
                  <View
                    style={{
                      margin: 10,
                      width: "80%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ color, marginRight }}>
                      {index < 3 ? badge : `${index + 1}.`} {item[0]}
                    </Text>

                    <Text style={{ color }}>{item[1]}</Text>
                  </View>
                );
              }}
            />
          ) : (
            <FlatList
              data={leaderBoardArraySpeedGame}
              numColumns={1}
              scrollEnabled={false}
              // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              keyExtractor={(item) => item[0]}
              renderItem={({ item, index }) => {
                return (
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
                    <Text style={{ color: "black", marginRight: 15 }}>
                      {index + 1}. {item[0]}
                    </Text>
                    <Text style={{ color: "black" }}>{item[1]}</Text>
                  </View>
                );
              }}
            />
          )}
          <Pressable
            style={[
              styles.button,
              styles.buttonClose,
              { backgroundColor: hideModal ? "darkgray" : "#818384" },
            ]}
            onPress={() => setLeaderboardVisible(!leaderboardVisible)}
            onTouchStart={() => setHideModal(!hideModal)}
            onTouchEnd={() => setHideModal(false)}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
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
    height: "87%",
    backgroundColor: "white",
    borderRadius: 25,
    // padding: 35,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    // paddingBottom: 25,
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
    // backgroundColor: "#818384",
    // backgroundColor: "yellow",

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
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center",
    // fontFamily: "AmericanTypewriter",
    fontWeight: "bold",
  },
});
