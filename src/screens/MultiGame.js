import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";
import { IMAGES } from "../../assets";
import { ProgressBar } from "react-native-paper";

import Animated, {
  BounceIn,
  FadeIn,
  FlipInEasyX,
  FlipOutEasyX,
  set,
} from "react-native-reanimated";
import { useAuth } from "../hooks/useAuth";

import { db } from "../config/firebase";

import {
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

// const { randomizeDeck, randomizeUserDeck, defaultUserOne, defaultUserTwo } =
//   handleAlldecks();

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export function MultiGame({ route, navigation }) {
  const getId = route.params.gameId;
  const getChosenDeck = route.params.getChosenDeckJoin;

  const { user } = useAuth();

  useEffect(() => {
    const docRef = doc(db, "games", getId);

    const checkIfData = onSnapshot(docRef, (doc) => {
      if (!doc.data()) {
        navigation.navigate("Home");
      }
    });

    const checkForPlayAgain = onSnapshot(docRef, (doc) => {
      if (doc.data()) {
        setUserOneClickPlayAgain(doc.data().userOneClickPlayAgain);
      } else {
        console.log("no data in doc.data()");
      }
    });

    const unsubscribe = onSnapshot(docRef, (doc) => {
      //   console.log(doc.data(), "doc.data() in multiGame");
      if (doc.data().playerOne && doc.data().playerTwo) {
        // console.log("both players are in the game in multiGame");
        setBothPlayersInGame(true);
        setGameDeck(JSON.parse(doc.data().gameDeck));
        // setUserOneDeck(gameDeck[8]);
        // setUserTwoDeck();
        setUserOneClickPlayAgain(doc.data().userOneClickPlayAgain);
        setMultiUserOneScore(doc.data().playerOneScore);
        setMultiUserTwoScore(doc.data().playerTwoScore);
        setMultiUserOneIndex(doc.data().playerOneIndex);
        setMultiUserTwoIndex(doc.data().playerTwoIndex);
        setCurrentIndex(doc.data().currentIndex);
        setPlayerOne(doc.data().playerOne);
        setPlayerTwo(doc.data().playTwo);
        setRoundOverMulti(doc.data().roundOverMulti);
        setUserOneDeck(JSON.parse(doc.data().multiDefaultUserOne));
        setUserTwoDeck(JSON.parse(doc.data().multiDefaultUserTwo));
      } else if (doc.data().playerOne && !doc.data().playerTwo) {
        if (
          !doc.data().gameDeck &&
          !doc.data().multiUserOneDeck &&
          !doc.data().multiUserTwoDeck
        ) {
          updateDoc(docRef, {
            gameDeck: stringDeck,
            multiDefaultUserOne: multiDefaultUserOne,
            multiDefaultUserTwo: multiDefaultUserTwo,
          });
        } else {
          console.log("already hase deck");
        }
      } else {
        console.log("one player is in the game");
      }
    });
    return () => {
      unsubscribe();
      checkIfData();
      checkForPlayAgain();
    };
  }, [getId]);

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

  const monsterDeck = [
    [
      { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 45 },
      { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 90 },
      { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 135 },
      { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 45 },
      { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 90 },
      { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 135 },
    ],
    [
      { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 45 },
      { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 90 },
      { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 135 },
      { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
      { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 90 },
      { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 135 },
    ],
    [
      { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 45 },
      { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 90 },
      { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 135 },
      { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 45 },
      { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 90 },
      { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 135 },
    ],
    [
      { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 45 },
      { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
      { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 135 },
      { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 45 },
      { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 90 },
      { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 135 },
    ],
    [
      { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
      { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 90 },
      { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 135 },
      { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 45 },
      { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 90 },
      { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 135 },
    ],
    [
      { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 45 },
      { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 90 },
      { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 135 },
      { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 45 },
      { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
      {
        id: "blueFriendMonster",
        emoji: IMAGES.blueFriendMonster,
        rotation: 135,
      },
    ],
    [
      { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 45 },
      { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 90 },
      { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 135 },
      { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 45 },
      { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 90 },
      { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 135 },
    ],
    [
      {
        id: "blueFriendMonster",
        emoji: IMAGES.blueFriendMonster,
        rotation: 45,
      },
      { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 90 },
      { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 135 },
      { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 45 },
      { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 90 },
      { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 135 },
    ],
    [
      { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 45 },
      { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 90 },
      { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 135 },
      { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 45 },
      { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 90 },
      { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 135 },
    ],
    [
      { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 45 },
      { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 90 },
      { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 135 },
      { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 45 },
      { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 90 },
      { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 135 },
    ],
    [
      { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
      { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 90 },
      { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 135 },
      { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 45 },
      { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 90 },
      { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 135 },
    ],
    [
      { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 45 },
      { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 90 },
      { id: "booMonster", emoji: IMAGES.booMonster, rotation: 135 },
      { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 45 },
      { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 90 },
      { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 135 },
    ],
    [
      { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 45 },
      { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 90 },
      { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 135 },
      { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 45 },
      { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 90 },
      { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 135 },
    ],
    [
      { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 45 },
      { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 90 },
      { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 135 },
      { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 45 },
      { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 90 },
      { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 135 },
    ],
    [
      { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 45 },
      { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 90 },
      { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 135 },
      { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 45 },
      { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 90 },
      { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 135 },
    ],
    [
      { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 45 },
      { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 90 },
      { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 135 },
      { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 45 },
      { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 90 },
      { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 135 },
    ],
    [
      { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 45 },
      { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 90 },
      { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 135 },
      { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 45 },
      { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 90 },
      { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 135 },
    ],
    [
      { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 45 },
      { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 90 },
      { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 135 },
      { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 45 },
      { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 90 },
      { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 135 },
    ],
    [
      { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 45 },
      { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
      { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 135 },
      { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 45 },
      { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 90 },
      { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 135 },
    ],
    [
      { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 45 },
      { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 90 },
      { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 135 },
      { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 45 },
      { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 90 },
      {
        id: "blueFriendMonster",
        emoji: IMAGES.blueFriendMonster,
        rotation: 135,
      },
    ],
    [
      { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 45 },
      { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 90 },
      { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 135 },
      { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 45 },
      { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 90 },
      { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 135 },
    ],
    [
      { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
      { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 90 },
      { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 135 },
      { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 45 },
      { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 90 },
      { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 135 },
    ],
    [
      { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 45 },
      { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
      { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 135 },
      { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 45 },
      { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 90 },
      { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 135 },
    ],
    [
      { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 45 },
      { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 90 },
      {
        id: "blueFriendMonster",
        emoji: IMAGES.blueFriendMonster,
        rotation: 135,
      },
      { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 45 },
      { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 90 },
      { id: "booMonster", emoji: IMAGES.booMonster, rotation: 135 },
    ],
    [
      { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 45 },
      { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 90 },
      { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 135 },
      { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 45 },
      { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 90 },
      { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 135 },
    ],
    [
      { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 45 },
      { id: "booMonster", emoji: IMAGES.booMonster, rotation: 90 },
      { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 135 },
      { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 45 },
      { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
      { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 135 },
    ],
    [
      { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 45 },
      { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 90 },
      { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 135 },
      { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
      {
        id: "blueFriendMonster",
        emoji: IMAGES.blueFriendMonster,
        rotation: 90,
      },
      { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 135 },
    ],
    [
      { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 45 },
      { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 90 },
      { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 135 },
      {
        id: "blueFriendMonster",
        emoji: IMAGES.blueFriendMonster,
        rotation: 45,
      },
      { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 90 },
      { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 135 },
    ],
    [
      { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 45 },
      { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 90 },
      { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 135 },
      { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 45 },
      { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 90 },
      { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 135 },
    ],
    [
      { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 45 },
      { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 90 },
      { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 135 },
      { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 45 },
      { id: "booMonster", emoji: IMAGES.booMonster, rotation: 90 },
      { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 135 },
    ],
    [
      { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 45 },
      { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 90 },
      { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 135 },
      { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 45 },
      { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 90 },
      { id: "booMonster", emoji: IMAGES.booMonster, rotation: 135 },
    ],
    [
      { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 45 },
      { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 90 },
      { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 135 },
      { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 45 },
      { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 90 },
      { id: "booMonster", emoji: IMAGES.booMonster, rotation: 135 },
    ],
  ];

  const foodDeck = [
    [
      { id: "broccoli", emoji: IMAGES.broccoli, rotation: 45 },
      { id: "blueberry", emoji: IMAGES.blueberry, rotation: 90 },
      { id: "steak", emoji: IMAGES.steak, rotation: 135 },
      { id: "strawberry", emoji: IMAGES.strawberry, rotation: 45 },
      { id: "orange", emoji: IMAGES.orange, rotation: 90 },
      { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 135 },
    ],
    [
      { id: "hotDog", emoji: IMAGES.hotDog, rotation: 45 },
      { id: "donut", emoji: IMAGES.donut, rotation: 90 },
      { id: "pineapple", emoji: IMAGES.pineapple, rotation: 135 },
      { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
      { id: "steak", emoji: IMAGES.steak, rotation: 90 },
      { id: "cookie", emoji: IMAGES.cookie, rotation: 135 },
    ],
    [
      { id: "hotDog", emoji: IMAGES.hotDog, rotation: 45 },
      { id: "blueberry", emoji: IMAGES.blueberry, rotation: 90 },
      { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 135 },
      { id: "coconut", emoji: IMAGES.coconut, rotation: 45 },
      { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 90 },
      { id: "carrot", emoji: IMAGES.carrot, rotation: 135 },
    ],
    [
      { id: "coconut", emoji: IMAGES.coconut, rotation: 45 },
      { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
      { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 135 },
      { id: "cookie", emoji: IMAGES.cookie, rotation: 45 },
      { id: "lemonade", emoji: IMAGES.lemonade, rotation: 90 },
      { id: "strawberry", emoji: IMAGES.strawberry, rotation: 135 },
    ],
    [
      { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
      { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 90 },
      { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 135 },
      { id: "blueberry", emoji: IMAGES.blueberry, rotation: 45 },
      { id: "hamburger", emoji: IMAGES.hamburger, rotation: 90 },
      { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 135 },
    ],
    [
      { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 45 },
      { id: "carrot", emoji: IMAGES.carrot, rotation: 90 },
      { id: "orange", emoji: IMAGES.orange, rotation: 135 },
      { id: "donut", emoji: IMAGES.donut, rotation: 45 },
      { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
      { id: "tomato", emoji: IMAGES.tomato, rotation: 135 },
    ],
    [
      { id: "coconut", emoji: IMAGES.coconut, rotation: 45 },
      { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 90 },
      { id: "cola", emoji: IMAGES.cola, rotation: 135 },
      { id: "pineapple", emoji: IMAGES.pineapple, rotation: 45 },
      { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 90 },
      { id: "broccoli", emoji: IMAGES.broccoli, rotation: 135 },
    ],
    [
      { id: "tomato", emoji: IMAGES.tomato, rotation: 45 },
      { id: "lemonade", emoji: IMAGES.lemonade, rotation: 90 },
      { id: "hotDog", emoji: IMAGES.hotDog, rotation: 135 },
      { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 45 },
      { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 90 },
      { id: "grapes", emoji: IMAGES.grapes, rotation: 135 },
    ],
    [
      { id: "cola", emoji: IMAGES.cola, rotation: 45 },
      { id: "carrot", emoji: IMAGES.carrot, rotation: 90 },
      { id: "corn", emoji: IMAGES.corn, rotation: 135 },
      { id: "cookie", emoji: IMAGES.cookie, rotation: 45 },
      { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 90 },
      { id: "hamburger", emoji: IMAGES.hamburger, rotation: 135 },
    ],
    [
      { id: "donut", emoji: IMAGES.donut, rotation: 45 },
      { id: "mango", emoji: IMAGES.mango, rotation: 90 },
      { id: "coconut", emoji: IMAGES.coconut, rotation: 135 },
      { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 45 },
      { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 90 },
      { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 135 },
    ],
    [
      { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
      { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 90 },
      { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 135 },
      { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 45 },
      { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 90 },
      { id: "pizza", emoji: IMAGES.pizza, rotation: 135 },
    ],
    [
      { id: "cola", emoji: IMAGES.cola, rotation: 45 },
      { id: "pizza", emoji: IMAGES.pizza, rotation: 90 },
      { id: "banana", emoji: IMAGES.banana, rotation: 135 },
      { id: "lemonade", emoji: IMAGES.lemonade, rotation: 45 },
      { id: "donut", emoji: IMAGES.donut, rotation: 90 },
      { id: "blueberry", emoji: IMAGES.blueberry, rotation: 135 },
    ],
    [
      { id: "cola", emoji: IMAGES.cola, rotation: 45 },
      { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 90 },
      { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 135 },
      { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 45 },
      { id: "grapes", emoji: IMAGES.grapes, rotation: 90 },
      { id: "steak", emoji: IMAGES.steak, rotation: 135 },
    ],
    [
      { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 45 },
      { id: "broccoli", emoji: IMAGES.broccoli, rotation: 90 },
      { id: "grapes", emoji: IMAGES.grapes, rotation: 135 },
      { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 45 },
      { id: "hamburger", emoji: IMAGES.hamburger, rotation: 90 },
      { id: "donut", emoji: IMAGES.donut, rotation: 135 },
    ],
    [
      { id: "corn", emoji: IMAGES.corn, rotation: 45 },
      { id: "donut", emoji: IMAGES.donut, rotation: 90 },
      { id: "strawberry", emoji: IMAGES.strawberry, rotation: 135 },
      { id: "taco", emoji: IMAGES.taco, rotation: 45 },
      { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 90 },
      { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 135 },
    ],
    [
      { id: "pineapple", emoji: IMAGES.pineapple, rotation: 45 },
      { id: "mango", emoji: IMAGES.mango, rotation: 90 },
      { id: "orange", emoji: IMAGES.orange, rotation: 135 },
      { id: "lemonade", emoji: IMAGES.lemonade, rotation: 45 },
      { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 90 },
      { id: "hamburger", emoji: IMAGES.hamburger, rotation: 135 },
    ],
    [
      { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 45 },
      { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 90 },
      { id: "hotDog", emoji: IMAGES.hotDog, rotation: 135 },
      { id: "cola", emoji: IMAGES.cola, rotation: 45 },
      { id: "orange", emoji: IMAGES.orange, rotation: 90 },
      { id: "taco", emoji: IMAGES.taco, rotation: 135 },
    ],
    [
      { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 45 },
      { id: "blueberry", emoji: IMAGES.blueberry, rotation: 90 },
      { id: "taco", emoji: IMAGES.taco, rotation: 135 },
      { id: "mango", emoji: IMAGES.mango, rotation: 45 },
      { id: "grapes", emoji: IMAGES.grapes, rotation: 90 },
      { id: "cookie", emoji: IMAGES.cookie, rotation: 135 },
    ],
    [
      { id: "pizza", emoji: IMAGES.pizza, rotation: 45 },
      { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
      { id: "hotDog", emoji: IMAGES.hotDog, rotation: 135 },
      { id: "mango", emoji: IMAGES.mango, rotation: 45 },
      { id: "broccoli", emoji: IMAGES.broccoli, rotation: 90 },
      { id: "corn", emoji: IMAGES.corn, rotation: 135 },
    ],
    [
      { id: "steak", emoji: IMAGES.steak, rotation: 45 },
      { id: "coconut", emoji: IMAGES.coconut, rotation: 90 },
      { id: "taco", emoji: IMAGES.taco, rotation: 135 },
      { id: "pizza", emoji: IMAGES.pizza, rotation: 45 },
      { id: "hamburger", emoji: IMAGES.hamburger, rotation: 90 },
      { id: "tomato", emoji: IMAGES.tomato, rotation: 135 },
    ],
    [
      { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 45 },
      { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 90 },
      { id: "cookie", emoji: IMAGES.cookie, rotation: 135 },
      { id: "orange", emoji: IMAGES.orange, rotation: 45 },
      { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 90 },
      { id: "pizza", emoji: IMAGES.pizza, rotation: 135 },
    ],
    [
      { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
      { id: "broccoli", emoji: IMAGES.broccoli, rotation: 90 },
      { id: "carrot", emoji: IMAGES.carrot, rotation: 135 },
      { id: "lemonade", emoji: IMAGES.lemonade, rotation: 45 },
      { id: "taco", emoji: IMAGES.taco, rotation: 90 },
      { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 135 },
    ],
    [
      { id: "coconut", emoji: IMAGES.coconut, rotation: 45 },
      { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
      { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 135 },
      { id: "cookie", emoji: IMAGES.cookie, rotation: 45 },
      { id: "lemonade", emoji: IMAGES.lemonade, rotation: 90 },
      { id: "strawberry", emoji: IMAGES.strawberry, rotation: 135 },
    ],
    [
      { id: "broccoli", emoji: IMAGES.broccoli, rotation: 45 },
      { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 90 },
      { id: "tomato", emoji: IMAGES.tomato, rotation: 135 },
      { id: "cookie", emoji: IMAGES.cookie, rotation: 45 },
      { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 90 },
      { id: "banana", emoji: IMAGES.banana, rotation: 135 },
    ],
    [
      { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 45 },
      { id: "lemonade", emoji: IMAGES.lemonade, rotation: 90 },
      { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 135 },
      { id: "steak", emoji: IMAGES.steak, rotation: 45 },
      { id: "corn", emoji: IMAGES.corn, rotation: 90 },
      { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 135 },
    ],
    [
      { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 45 },
      { id: "banana", emoji: IMAGES.banana, rotation: 90 },
      { id: "taco", emoji: IMAGES.taco, rotation: 135 },
      { id: "pineapple", emoji: IMAGES.pineapple, rotation: 45 },
      { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
      { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 135 },
    ],
    [
      { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 45 },
      { id: "mango", emoji: IMAGES.mango, rotation: 90 },
      { id: "cola", emoji: IMAGES.cola, rotation: 135 },
      { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
      { id: "tomato", emoji: IMAGES.tomato, rotation: 90 },
      { id: "strawberry", emoji: IMAGES.strawberry, rotation: 135 },
    ],
    [
      { id: "blueberry", emoji: IMAGES.blueberry, rotation: 45 },
      { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 90 },
      { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 135 },
      { id: "tomato", emoji: IMAGES.tomato, rotation: 45 },
      { id: "corn", emoji: IMAGES.corn, rotation: 90 },
      { id: "pineapple", emoji: IMAGES.pineapple, rotation: 135 },
    ],
    [
      { id: "carrot", emoji: IMAGES.carrot, rotation: 45 },
      { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 90 },
      { id: "pineapple", emoji: IMAGES.pineapple, rotation: 135 },
      { id: "grapes", emoji: IMAGES.grapes, rotation: 45 },
      { id: "strawberry", emoji: IMAGES.strawberry, rotation: 90 },
      { id: "pizza", emoji: IMAGES.pizza, rotation: 135 },
    ],
    [
      { id: "grapes", emoji: IMAGES.grapes, rotation: 45 },
      { id: "corn", emoji: IMAGES.corn, rotation: 90 },
      { id: "coconut", emoji: IMAGES.coconut, rotation: 135 },
      { id: "orange", emoji: IMAGES.orange, rotation: 45 },
      { id: "banana", emoji: IMAGES.banana, rotation: 90 },
      { id: "cherry", emoji: IMAGES.cherry, rotation: 135 },
    ],
    [
      { id: "carrot", emoji: IMAGES.carrot, rotation: 45 },
      { id: "mango", emoji: IMAGES.mango, rotation: 90 },
      { id: "steak", emoji: IMAGES.steak, rotation: 135 },
      { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 45 },
      { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 90 },
      { id: "banana", emoji: IMAGES.banana, rotation: 135 },
    ],
    [
      { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 45 },
      { id: "strawberry", emoji: IMAGES.strawberry, rotation: 90 },
      { id: "hamburger", emoji: IMAGES.hamburger, rotation: 135 },
      { id: "hotDog", emoji: IMAGES.hotDog, rotation: 45 },
      { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 90 },
      { id: "banana", emoji: IMAGES.banana, rotation: 135 },
    ],
  ];

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userTwoDeck, setUserTwoDeck] = useState();
  const [userOneDeck, setUserOneDeck] = useState();
  const [userOneScore, setUserOneScore] = useState(0);
  const [userTwoScore, setUserTwoScore] = useState(0);
  const [multiUserOneScore, setMultiUserOneScore] = useState();
  const [multiUserTwoScore, setMultiUserTwoScore] = useState();
  const [multiUserOneIndex, setMultiUserOneIndex] = useState();
  const [multiUserTwoIndex, setMultiUserTwoIndex] = useState();

  const getDocData = async () => {
    const docRef = doc(db, "games", getId);

    const docSnap = await getDoc(docRef);
    if (docSnap.data().gameDeck) {
      //   console.log("Document data:", docSnap.data());
      //   const docSnap = await getDoc(docRef);
      const parse = JSON.parse(docSnap.data().gameDeck);
      setGameDeck(parse);
    } else {
      // doc.data() will be undefined in this case

      console.log("No such document!");
    }
  };

  useEffect(() => {
    getDocData();
  }, [getId]);

  const [gameDeck, setGameDeck] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeckOne, setNotInDeckOne] = useState(false);
  const [notInDeckTwo, setNotInDeckTwo] = useState(false);
  const [roundOver, setRoundOver] = useState(true);
  const [roundOverMulti, setRoundOverMulti] = useState(true);

  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bothPlayersInGame, setBothPlayersInGame] = useState(false);
  const [startDisabled, setStartDisabled] = useState(true);
  const [playerOne, setPlayerOne] = useState();
  const [playerTwo, setPlayerTwo] = useState();
  const [userOneClickPlayAgain, setUserOneClickPlayAgain] = useState();
  const [matchingID, setMatchingID] = useState();

  const shortendEmail = playerOne.split("@")[0];

  const findMatchingId = () => {
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

  useEffect(() => {
    findMatchingId();
    console.log("matchingID", matchingID);
  }, [currentIndex, gameDeck, userOneDeck]);

  useEffect(() => {
    if (multiUserOneScore + multiUserTwoScore === 5) {
      const timeout = setTimeout(() => {
        setGameOver(true);
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [multiUserOneScore, multiUserTwoScore]);

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

  useEffect(() => {
    const totalScore = userOneScore + userTwoScore;
    const newProgress = totalScore / 20;
    setProgress(newProgress);
  }, [userOneScore, userTwoScore]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        setShowGameOverMessage(true);
      }, 500);
    }
  }, [gameOver]);

  const resetGame = () => {
    updateDoc(doc(db, "games", getId), {
      gameDeck: stringDeck,
      playerOneScore: 0,
      playerTwoScore: 0,
      playerOneIndex: 0,
      playerTwoIndex: 0,
      multiDefaultUserOne: multiDefaultUserOne,
      multiDefaultUserTwo: multiDefaultUserTwo,
      userOneClickPlayAgain: true,
      playerTwo: playerOne === user?.email ? null : user?.email,
    });
    setBothPlayersInGame(false);
    setUserOneScore(0);
    setUserTwoScore(0);
    setGameOver(false);
    setShowGameOverMessage(false);

    setTimeout(
      () =>
        updateDoc(doc(db, "games", getId), {
          userOneClickPlayAgain: false,
        }),
      15000
    );
  };

  const handleClick = (clickedEmoji, user) => {
    if (gameDeck[currentIndex].some((emoji) => emoji.id === clickedEmoji)) {
      if (user === "userOne") {
        setUserOneScore(userOneScore + 1);

        updateDoc(doc(db, "games", getId), {
          playerOneScore: userOneScore + 1,
          playerOneIndex: currentIndex,

          multiDefaultUserOne: JSON.stringify([...gameDeck[currentIndex]]),
        });
      } else {
        setUserTwoScore(userTwoScore + 1);
        updateDoc(doc(db, "games", getId), {
          playerTwoScore: userTwoScore + 1,
          playerTwoIndex: currentIndex,
          multiDefaultUserTwo: JSON.stringify([...gameDeck[currentIndex]]),
        });
      }
      setStartDisabled(true);

      setRoundOver(false);
      updateDoc(doc(db, "games", getId), {
        roundOverMulti: false,
      });

      setTimeout(
        () =>
          updateDoc(doc(db, "games", getId), {
            roundOverMulti: true,
          }),
        500
      );

      setTimeout(() => setRoundOver(true), 500);

      if (currentIndex === gameDeck.length - 1) {
        const beforeShuffle = gameDeck;
        shuffleArray(beforeShuffle);
        setGameDeck(beforeShuffle);

        setCurrentIndex(0);
      } else {
        // setCurrentIndex(currentIndex + 1);
        updateDoc(doc(db, "games", getId), {
          currentIndex: currentIndex + 1,
        });
      }
    } else {
      if (user === "userOne") {
        setNotInDeckOne(true);
      } else {
        setNotInDeckTwo(true);
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
    setTimeout(() => {
      navigation.navigate("Home");
    }, 170);

    setTimeout(() => {
      deleteDoc(doc(db, "games", getId));
    }, 370);
  };

  const resetGameDelay = () => {
    setTimeout(() => {
      resetGame();
    }, 170);
  };

  const progressColor = "#263238";

  //if bother player not in game return waiting screen

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]}
        style={styles.linearGradient}
      >
        {!bothPlayersInGame ? (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              // top: 740,
              top: screenHeight / 4.4,
              height: 50,
              width: "100%",
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

            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
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
                  </View>
                  <View style={[styles.scoreContainerTwo]}>
                    <Text
                      style={{
                        fontSize: 50,
                        color: "white",
                        transform: [{ rotate: `180deg` }],
                      }}
                    >
                      {/* {userTwoScore} */}
                      {multiUserTwoScore}
                    </Text>
                  </View>
                  <View style={[styles.userTwoDeckContainer]}>
                    <Animated.FlatList
                      data={userTwoDeck}
                      numColumns={3}
                      scrollEnabled={false}
                      contentContainerStyle={{ alignItems: "center" }}
                      renderItem={({ item, index }) => (
                        <Animated.View
                          // entering={FadeIn.delay(index * 100)}
                          style={{
                            backgroundColor: notInDeckTwo
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
                              //check if the person clicking here is playerone and if it is make sure its disable if its not player one
                              playerOne === user?.email
                                ? true
                                : false ||
                                  gameOver === true ||
                                  startDisabled === true ||
                                  notInDeckTwo
                                ? true
                                : false
                            }
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
                                width: 47,
                                height: 47,
                                // opacity: gameOver === true ? 0.5 : 1,
                                transform: [{ rotate: `180deg` }],
                              }}
                            />
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  </View>

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
                              transform: [{ rotate: `${emoji.rotation}deg` }],
                            }}
                            key={index}
                          />
                        ))
                      ) : (
                        <Text>loading</Text>
                      )}
                    </Animated.View>
                  )}

                  <View style={[styles.userDeckContainerList]}>
                    <Animated.FlatList
                      data={userOneDeck}
                      numColumns={3}
                      scrollEnabled={false}
                      contentContainerStyle={{ alignItems: "center" }}
                      renderItem={({ item, index }) => (
                        <Animated.View
                          // entering={FadeIn.delay(index * 100)}
                          style={{
                            backgroundColor: notInDeckOne
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
                              playerOne === user?.email
                                ? false
                                : true ||
                                  gameOver === true ||
                                  startDisabled === true ||
                                  notInDeckOne
                                ? true
                                : false
                            }
                            key={item.id}
                            onPress={() => handleClick(item.id, "userOne")}
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
                                // opacity: gameOver === true ? 0.5 : 1,
                              }}
                            />
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  </View>
                  <View style={[styles.progressContainer]}>
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
                  </View>
                  <View style={[styles.scoreContainer]}>
                    <Text style={{ fontSize: 50, color: "white" }}>
                      {/* {userOneScore} */}
                      {multiUserOneScore}
                    </Text>
                  </View>
                </>
              )}
            </View>

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
                      {/* {userTwoScore} */}
                      {multiUserTwoScore}
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
                      {multiUserOneScore < multiUserTwoScore
                        ? "YOU WIN"
                        : "YOU LOSE"}
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
                          Waiting for {"\n"} {shortendEmail} restart game
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.playOneWinContainer}>
                    <Text
                      style={{
                        fontSize: 50,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {multiUserOneScore > multiUserTwoScore
                        ? "YOU WIN"
                        : "YOU LOSE"}
                    </Text>
                  </View>
                  <View style={[styles.scoreContainer]}>
                    <Text style={{ fontSize: 50, color: "white" }}>
                      {/* {userOneScore} */}
                      {multiUserOneScore}
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
    // top: 370,
    top: screenHeight / 2.14,

    // backgroundColor: "rgba(255, 255, 255, 0.65)",
    backgroundColor: "rgba(255, 255, 255, 0.3)",

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
