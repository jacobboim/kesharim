import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "react-native-really-awesome-button";
import handleAlldecks from "../components/decks/IconDecks";
import { IMAGES } from "../../assets";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";

import Animated, {
  FlipInEasyX,
  FlipOutEasyX,
  BounceIn,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  SlideInUp,
} from "react-native-reanimated";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export const OneMinuteGame = ({ route, navigation }) => {
  const {
    randomizeDeck,
    randomizeUserDeck,
    gameDecks,
    monsterDeck,
    foodDeck,
    flagDeck,
  } = handleAlldecks();
  const getChosenDeck = route.params.finalDeckChoice;
  // console.log(getChosenDeck, "getChosenDeck");

  // const gameDecks = [
  //   [
  //     { id: "safari", emoji: IMAGES.safari, rotation: 45 },
  //     { id: "medium", emoji: IMAGES.medium, rotation: 90 },
  //     { id: "sketch", emoji: IMAGES.sketch, rotation: 135 },
  //     { id: "instagram", emoji: IMAGES.instagram, rotation: 45 },
  //     { id: "yelp", emoji: IMAGES.yelp, rotation: 90 },
  //     { id: "twitter", emoji: IMAGES.twitter, rotation: 135 },
  //   ],
  //   [
  //     { id: "facebook", emoji: IMAGES.facebook, rotation: 45 },
  //     { id: "messenger", emoji: IMAGES.messenger, rotation: 90 },
  //     { id: "pinterest", emoji: IMAGES.pinterest, rotation: 135 },
  //     { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
  //     { id: "sketch", emoji: IMAGES.sketch, rotation: 90 },
  //     { id: "paypal", emoji: IMAGES.paypal, rotation: 135 },
  //   ],
  //   [
  //     { id: "facebook", emoji: IMAGES.facebook, rotation: 45 },
  //     { id: "medium", emoji: IMAGES.medium, rotation: 90 },
  //     { id: "firefox", emoji: IMAGES.firefox, rotation: 135 },
  //     { id: "evernote", emoji: IMAGES.evernote, rotation: 45 },
  //     { id: "luchos", emoji: IMAGES.luchos, rotation: 90 },
  //     { id: "drive", emoji: IMAGES.drive, rotation: 135 },
  //   ],
  //   [
  //     { id: "evernote", emoji: IMAGES.evernote, rotation: 45 },
  //     { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
  //     { id: "vimeo", emoji: IMAGES.vimeo, rotation: 135 },
  //     { id: "paypal", emoji: IMAGES.paypal, rotation: 45 },
  //     { id: "android", emoji: IMAGES.android, rotation: 90 },
  //     { id: "instagram", emoji: IMAGES.instagram, rotation: 135 },
  //   ],
  //   [
  //     { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
  //     { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
  //     { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 135 },
  //     { id: "medium", emoji: IMAGES.medium, rotation: 45 },
  //     { id: "linkedin", emoji: IMAGES.linkedin, rotation: 90 },
  //     { id: "youtube", emoji: IMAGES.youtube, rotation: 135 },
  //   ],
  //   [
  //     { id: "torah", emoji: IMAGES.torah, rotation: 45 },
  //     { id: "drive", emoji: IMAGES.drive, rotation: 90 },
  //     { id: "yelp", emoji: IMAGES.yelp, rotation: 135 },
  //     { id: "messenger", emoji: IMAGES.messenger, rotation: 45 },
  //     { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
  //     { id: "chrome", emoji: IMAGES.chrome, rotation: 135 },
  //   ],
  //   [
  //     { id: "evernote", emoji: IMAGES.evernote, rotation: 45 },
  //     { id: "torah", emoji: IMAGES.torah, rotation: 90 },
  //     { id: "airbnb", emoji: IMAGES.airbnb, rotation: 135 },
  //     { id: "pinterest", emoji: IMAGES.pinterest, rotation: 45 },
  //     { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
  //     { id: "safari", emoji: IMAGES.safari, rotation: 135 },
  //   ],
  //   [
  //     { id: "chrome", emoji: IMAGES.chrome, rotation: 45 },
  //     { id: "android", emoji: IMAGES.android, rotation: 90 },
  //     { id: "facebook", emoji: IMAGES.facebook, rotation: 135 },
  //     { id: "wordpress", emoji: IMAGES.wordpress, rotation: 45 },
  //     { id: "twitter", emoji: IMAGES.twitter, rotation: 90 },
  //     { id: "snapchat", emoji: IMAGES.snapchat, rotation: 135 },
  //   ],
  //   [
  //     { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
  //     { id: "drive", emoji: IMAGES.drive, rotation: 90 },
  //     { id: "skype", emoji: IMAGES.skype, rotation: 135 },
  //     { id: "paypal", emoji: IMAGES.paypal, rotation: 45 },
  //     { id: "twitter", emoji: IMAGES.twitter, rotation: 90 },
  //     { id: "linkedin", emoji: IMAGES.linkedin, rotation: 135 },
  //   ],
  //   [
  //     { id: "messenger", emoji: IMAGES.messenger, rotation: 45 },
  //     { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 90 },
  //     { id: "evernote", emoji: IMAGES.evernote, rotation: 135 },
  //     { id: "dropbox", emoji: IMAGES.dropbox, rotation: 45 },
  //     { id: "twitter", emoji: IMAGES.twitter, rotation: 90 },
  //     { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 135 },
  //   ],
  //   [
  //     { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
  //     { id: "torah", emoji: IMAGES.torah, rotation: 90 },
  //     { id: "twitter", emoji: IMAGES.twitter, rotation: 135 },
  //     { id: "firefox", emoji: IMAGES.firefox, rotation: 45 },
  //     { id: "vimeo", emoji: IMAGES.vimeo, rotation: 90 },
  //     { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 135 },
  //   ],
  //   [
  //     { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
  //     { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 90 },
  //     { id: "amazon", emoji: IMAGES.amazon, rotation: 135 },
  //     { id: "android", emoji: IMAGES.android, rotation: 45 },
  //     { id: "messenger", emoji: IMAGES.messenger, rotation: 90 },
  //     { id: "medium", emoji: IMAGES.medium, rotation: 135 },
  //   ],
  //   [
  //     { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
  //     { id: "dropbox", emoji: IMAGES.dropbox, rotation: 90 },
  //     { id: "youtube", emoji: IMAGES.youtube, rotation: 135 },
  //     { id: "firefox", emoji: IMAGES.firefox, rotation: 45 },
  //     { id: "snapchat", emoji: IMAGES.snapchat, rotation: 90 },
  //     { id: "sketch", emoji: IMAGES.sketch, rotation: 135 },
  //   ],
  //   [
  //     { id: "luchos", emoji: IMAGES.luchos, rotation: 45 },
  //     { id: "safari", emoji: IMAGES.safari, rotation: 90 },
  //     { id: "snapchat", emoji: IMAGES.snapchat, rotation: 135 },
  //     { id: "vimeo", emoji: IMAGES.vimeo, rotation: 45 },
  //     { id: "linkedin", emoji: IMAGES.linkedin, rotation: 90 },
  //     { id: "messenger", emoji: IMAGES.messenger, rotation: 135 },
  //   ],
  //   [
  //     { id: "skype", emoji: IMAGES.skype, rotation: 45 },
  //     { id: "messenger", emoji: IMAGES.messenger, rotation: 90 },
  //     { id: "instagram", emoji: IMAGES.instagram, rotation: 135 },
  //     { id: "github", emoji: IMAGES.github, rotation: 45 },
  //     { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
  //     { id: "firefox", emoji: IMAGES.firefox, rotation: 135 },
  //   ],
  //   [
  //     { id: "pinterest", emoji: IMAGES.pinterest, rotation: 45 },
  //     { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 90 },
  //     { id: "yelp", emoji: IMAGES.yelp, rotation: 135 },
  //     { id: "android", emoji: IMAGES.android, rotation: 45 },
  //     { id: "firefox", emoji: IMAGES.firefox, rotation: 90 },
  //     { id: "linkedin", emoji: IMAGES.linkedin, rotation: 135 },
  //   ],
  //   [
  //     { id: "vimeo", emoji: IMAGES.vimeo, rotation: 45 },
  //     { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 90 },
  //     { id: "facebook", emoji: IMAGES.facebook, rotation: 135 },
  //     { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
  //     { id: "yelp", emoji: IMAGES.yelp, rotation: 90 },
  //     { id: "github", emoji: IMAGES.github, rotation: 135 },
  //   ],
  //   [
  //     { id: "torah", emoji: IMAGES.torah, rotation: 45 },
  //     { id: "medium", emoji: IMAGES.medium, rotation: 90 },
  //     { id: "github", emoji: IMAGES.github, rotation: 135 },
  //     { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 45 },
  //     { id: "snapchat", emoji: IMAGES.snapchat, rotation: 90 },
  //     { id: "paypal", emoji: IMAGES.paypal, rotation: 135 },
  //   ],
  //   [
  //     { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 45 },
  //     { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
  //     { id: "facebook", emoji: IMAGES.facebook, rotation: 135 },
  //     { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 45 },
  //     { id: "safari", emoji: IMAGES.safari, rotation: 90 },
  //     { id: "skype", emoji: IMAGES.skype, rotation: 135 },
  //   ],
  //   [
  //     { id: "sketch", emoji: IMAGES.sketch, rotation: 45 },
  //     { id: "evernote", emoji: IMAGES.evernote, rotation: 90 },
  //     { id: "github", emoji: IMAGES.github, rotation: 135 },
  //     { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 45 },
  //     { id: "linkedin", emoji: IMAGES.linkedin, rotation: 90 },
  //     { id: "chrome", emoji: IMAGES.chrome, rotation: 135 },
  //   ],
  //   [
  //     { id: "dropbox", emoji: IMAGES.dropbox, rotation: 45 },
  //     { id: "luchos", emoji: IMAGES.luchos, rotation: 90 },
  //     { id: "paypal", emoji: IMAGES.paypal, rotation: 135 },
  //     { id: "yelp", emoji: IMAGES.yelp, rotation: 45 },
  //     { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
  //     { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 135 },
  //   ],
  //   [
  //     { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
  //     { id: "safari", emoji: IMAGES.safari, rotation: 90 },
  //     { id: "drive", emoji: IMAGES.drive, rotation: 135 },
  //     { id: "android", emoji: IMAGES.android, rotation: 45 },
  //     { id: "github", emoji: IMAGES.github, rotation: 90 },
  //     { id: "dropbox", emoji: IMAGES.dropbox, rotation: 135 },
  //   ],
  //   [
  //     { id: "evernote", emoji: IMAGES.evernote, rotation: 45 },
  //     { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
  //     { id: "vimeo", emoji: IMAGES.vimeo, rotation: 135 },
  //     { id: "paypal", emoji: IMAGES.paypal, rotation: 45 },
  //     { id: "android", emoji: IMAGES.android, rotation: 90 },
  //     { id: "instagram", emoji: IMAGES.instagram, rotation: 135 },
  //   ],
  //   [
  //     { id: "safari", emoji: IMAGES.safari, rotation: 45 },
  //     { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 90 },
  //     { id: "chrome", emoji: IMAGES.chrome, rotation: 135 },
  //     { id: "paypal", emoji: IMAGES.paypal, rotation: 45 },
  //     { id: "firefox", emoji: IMAGES.firefox, rotation: 90 },
  //     { id: "amazon", emoji: IMAGES.amazon, rotation: 135 },
  //   ],
  //   [
  //     { id: "luchos", emoji: IMAGES.luchos, rotation: 45 },
  //     { id: "android", emoji: IMAGES.android, rotation: 90 },
  //     { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 135 },
  //     { id: "sketch", emoji: IMAGES.sketch, rotation: 45 },
  //     { id: "skype", emoji: IMAGES.skype, rotation: 90 },
  //     { id: "torah", emoji: IMAGES.torah, rotation: 135 },
  //   ],
  //   [
  //     { id: "twitter", emoji: IMAGES.twitter, rotation: 45 },
  //     { id: "amazon", emoji: IMAGES.amazon, rotation: 90 },
  //     { id: "github", emoji: IMAGES.github, rotation: 135 },
  //     { id: "pinterest", emoji: IMAGES.pinterest, rotation: 45 },
  //     { id: "youtube", emoji: IMAGES.youtube, rotation: 90 },
  //     { id: "luchos", emoji: IMAGES.luchos, rotation: 135 },
  //   ],
  //   [
  //     { id: "luchos", emoji: IMAGES.luchos, rotation: 45 },
  //     { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 90 },
  //     { id: "airbnb", emoji: IMAGES.airbnb, rotation: 135 },
  //     { id: "menorah", emoji: IMAGES.menorah, rotation: 45 },
  //     { id: "chrome", emoji: IMAGES.chrome, rotation: 90 },
  //     { id: "instagram", emoji: IMAGES.instagram, rotation: 135 },
  //   ],
  //   [
  //     { id: "medium", emoji: IMAGES.medium, rotation: 45 },
  //     { id: "dropbox", emoji: IMAGES.dropbox, rotation: 90 },
  //     { id: "vimeo", emoji: IMAGES.vimeo, rotation: 135 },
  //     { id: "chrome", emoji: IMAGES.chrome, rotation: 45 },
  //     { id: "skype", emoji: IMAGES.skype, rotation: 90 },
  //     { id: "pinterest", emoji: IMAGES.pinterest, rotation: 135 },
  //   ],
  //   [
  //     { id: "drive", emoji: IMAGES.drive, rotation: 45 },
  //     { id: "stackoverflow", emoji: IMAGES.stackoverflow, rotation: 90 },
  //     { id: "pinterest", emoji: IMAGES.pinterest, rotation: 135 },
  //     { id: "snapchat", emoji: IMAGES.snapchat, rotation: 45 },
  //     { id: "instagram", emoji: IMAGES.instagram, rotation: 90 },
  //     { id: "internetexplorer", emoji: IMAGES.internetexplorer, rotation: 135 },
  //   ],
  //   [
  //     { id: "snapchat", emoji: IMAGES.snapchat, rotation: 45 },
  //     { id: "skype", emoji: IMAGES.skype, rotation: 90 },
  //     { id: "evernote", emoji: IMAGES.evernote, rotation: 135 },
  //     { id: "yelp", emoji: IMAGES.yelp, rotation: 45 },
  //     { id: "amazon", emoji: IMAGES.amazon, rotation: 90 },
  //     { id: "menorah", emoji: IMAGES.menorah, rotation: 135 },
  //   ],
  //   [
  //     { id: "drive", emoji: IMAGES.drive, rotation: 45 },
  //     { id: "whatsapp", emoji: IMAGES.whatsapp, rotation: 90 },
  //     { id: "sketch", emoji: IMAGES.sketch, rotation: 135 },
  //     { id: "wordpress", emoji: IMAGES.wordpress, rotation: 45 },
  //     { id: "vimeo", emoji: IMAGES.vimeo, rotation: 90 },
  //     { id: "amazon", emoji: IMAGES.amazon, rotation: 135 },
  //   ],
  //   [
  //     { id: "torah", emoji: IMAGES.torah, rotation: 45 },
  //     { id: "instagram", emoji: IMAGES.instagram, rotation: 90 },
  //     { id: "linkedin", emoji: IMAGES.linkedin, rotation: 135 },
  //     { id: "facebook", emoji: IMAGES.facebook, rotation: 45 },
  //     { id: "dropbox", emoji: IMAGES.dropbox, rotation: 90 },
  //     { id: "amazon", emoji: IMAGES.amazon, rotation: 135 },
  //   ],
  // ];

  // const monsterDeck = [
  //   [
  //     { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 45 },
  //     { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 90 },
  //     { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 135 },
  //     { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 45 },
  //     { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 90 },
  //     { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 135 },
  //   ],
  //   [
  //     { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 45 },
  //     { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 90 },
  //     { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 135 },
  //     { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
  //     { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 90 },
  //     { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 45 },
  //     { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 90 },
  //     { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 135 },
  //     { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 45 },
  //     { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 90 },
  //     { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 135 },
  //   ],
  //   [
  //     { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 45 },
  //     { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
  //     { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 135 },
  //     { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 45 },
  //     { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 90 },
  //     { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
  //     { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 90 },
  //     { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 135 },
  //     { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 45 },
  //     { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 90 },
  //     { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 45 },
  //     { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 90 },
  //     { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 135 },
  //     { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 45 },
  //     { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
  //     {
  //       id: "blueFriendMonster",
  //       emoji: IMAGES.blueFriendMonster,
  //       rotation: 135,
  //     },
  //   ],
  //   [
  //     { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 45 },
  //     { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 90 },
  //     { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 135 },
  //     { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 45 },
  //     { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 90 },
  //     { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 135 },
  //   ],
  //   [
  //     {
  //       id: "blueFriendMonster",
  //       emoji: IMAGES.blueFriendMonster,
  //       rotation: 45,
  //     },
  //     { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 90 },
  //     { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 135 },
  //     { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 45 },
  //     { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 90 },
  //     { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 45 },
  //     { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 90 },
  //     { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 135 },
  //     { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 45 },
  //     { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 90 },
  //     { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 45 },
  //     { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 90 },
  //     { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 135 },
  //     { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 45 },
  //     { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 90 },
  //     { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
  //     { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 90 },
  //     { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 135 },
  //     { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 45 },
  //     { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 90 },
  //     { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 45 },
  //     { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 90 },
  //     { id: "booMonster", emoji: IMAGES.booMonster, rotation: 135 },
  //     { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 45 },
  //     { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 90 },
  //     { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 45 },
  //     { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 90 },
  //     { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 135 },
  //     { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 45 },
  //     { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 90 },
  //     { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 45 },
  //     { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 90 },
  //     { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 135 },
  //     { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 45 },
  //     { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 90 },
  //     { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 45 },
  //     { id: "slugMonster", emoji: IMAGES.slugMonster, rotation: 90 },
  //     { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 135 },
  //     { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 45 },
  //     { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 90 },
  //     { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 135 },
  //   ],
  //   [
  //     { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 45 },
  //     { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 90 },
  //     { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 135 },
  //     { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 45 },
  //     { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 90 },
  //     { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 45 },
  //     { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 90 },
  //     { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 135 },
  //     { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 45 },
  //     { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 90 },
  //     { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 45 },
  //     { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 90 },
  //     { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 135 },
  //     { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 45 },
  //     { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 90 },
  //     { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 45 },
  //     { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
  //     { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 135 },
  //     { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 45 },
  //     { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 90 },
  //     { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 135 },
  //   ],
  //   [
  //     { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 45 },
  //     { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 90 },
  //     { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 135 },
  //     { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 45 },
  //     { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 90 },
  //     {
  //       id: "blueFriendMonster",
  //       emoji: IMAGES.blueFriendMonster,
  //       rotation: 135,
  //     },
  //   ],
  //   [
  //     { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 45 },
  //     { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 90 },
  //     { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 135 },
  //     { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 45 },
  //     { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 90 },
  //     { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
  //     { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 90 },
  //     { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 135 },
  //     { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 45 },
  //     { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 90 },
  //     { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 45 },
  //     { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
  //     { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 135 },
  //     { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 45 },
  //     { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 90 },
  //     { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "bushyMonster", emoji: IMAGES.bushyMonster, rotation: 45 },
  //     { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 90 },
  //     {
  //       id: "blueFriendMonster",
  //       emoji: IMAGES.blueFriendMonster,
  //       rotation: 135,
  //     },
  //     { id: "eggMonster", emoji: IMAGES.eggMonster, rotation: 45 },
  //     { id: "threeMonster2", emoji: IMAGES.threeMonster2, rotation: 90 },
  //     { id: "booMonster", emoji: IMAGES.booMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 45 },
  //     { id: "fourMonster", emoji: IMAGES.fourMonster, rotation: 90 },
  //     { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 135 },
  //     { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 45 },
  //     { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 90 },
  //     { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "bigMonster2", emoji: IMAGES.bigMonster2, rotation: 45 },
  //     { id: "booMonster", emoji: IMAGES.booMonster, rotation: 90 },
  //     { id: "tentacleMonster", emoji: IMAGES.tentacleMonster, rotation: 135 },
  //     { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 45 },
  //     { id: "muscleMonster", emoji: IMAGES.muscleMonster, rotation: 90 },
  //     { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "boxMonster", emoji: IMAGES.boxMonster, rotation: 45 },
  //     { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 90 },
  //     { id: "frenchMonster", emoji: IMAGES.frenchMonster, rotation: 135 },
  //     { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 45 },
  //     {
  //       id: "blueFriendMonster",
  //       emoji: IMAGES.blueFriendMonster,
  //       rotation: 90,
  //     },
  //     { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "spottedMonster", emoji: IMAGES.spottedMonster, rotation: 45 },
  //     { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 90 },
  //     { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 135 },
  //     {
  //       id: "blueFriendMonster",
  //       emoji: IMAGES.blueFriendMonster,
  //       rotation: 45,
  //     },
  //     { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 90 },
  //     { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 45 },
  //     { id: "flyingMonster", emoji: IMAGES.flyingMonster, rotation: 90 },
  //     { id: "oneMonster", emoji: IMAGES.oneMonster, rotation: 135 },
  //     { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 45 },
  //     { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 90 },
  //     { id: "roungMonster", emoji: IMAGES.roungMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "hornMonster", emoji: IMAGES.hornMonster, rotation: 45 },
  //     { id: "friendMosnter", emoji: IMAGES.friendMosnter, rotation: 90 },
  //     { id: "threeMonster", emoji: IMAGES.threeMonster, rotation: 135 },
  //     { id: "alienMonster", emoji: IMAGES.alienMonster, rotation: 45 },
  //     { id: "booMonster", emoji: IMAGES.booMonster, rotation: 90 },
  //     { id: "pearMonster", emoji: IMAGES.pearMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "roundMonster2", emoji: IMAGES.roundMonster2, rotation: 45 },
  //     { id: "squidMonster", emoji: IMAGES.squidMonster, rotation: 90 },
  //     { id: "oneEyeMonster", emoji: IMAGES.oneEyeMonster, rotation: 135 },
  //     { id: "fiveMonster", emoji: IMAGES.fiveMonster, rotation: 45 },
  //     { id: "orgeMonster", emoji: IMAGES.orgeMonster, rotation: 90 },
  //     { id: "booMonster", emoji: IMAGES.booMonster, rotation: 135 },
  //   ],
  //   [
  //     { id: "smileMonster", emoji: IMAGES.smileMonster, rotation: 45 },
  //     { id: "twoMonster", emoji: IMAGES.twoMonster, rotation: 90 },
  //     { id: "bigMonster", emoji: IMAGES.bigMonster, rotation: 135 },
  //     { id: "cuteMonster", emoji: IMAGES.cuteMonster, rotation: 45 },
  //     { id: "roundedMonster", emoji: IMAGES.roundedMonster, rotation: 90 },
  //     { id: "booMonster", emoji: IMAGES.booMonster, rotation: 135 },
  //   ],
  // ];

  // const foodDeck = [
  //   [
  //     { id: "broccoli", emoji: IMAGES.broccoli, rotation: 45 },
  //     { id: "blueberry", emoji: IMAGES.blueberry, rotation: 90 },
  //     { id: "steak", emoji: IMAGES.steak, rotation: 135 },
  //     { id: "strawberry", emoji: IMAGES.strawberry, rotation: 45 },
  //     { id: "orange", emoji: IMAGES.orange, rotation: 90 },
  //     { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 135 },
  //   ],
  //   [
  //     { id: "hotDog", emoji: IMAGES.hotDog, rotation: 45 },
  //     { id: "donut", emoji: IMAGES.donut, rotation: 90 },
  //     { id: "pineapple", emoji: IMAGES.pineapple, rotation: 135 },
  //     { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
  //     { id: "steak", emoji: IMAGES.steak, rotation: 90 },
  //     { id: "cookie", emoji: IMAGES.cookie, rotation: 135 },
  //   ],
  //   [
  //     { id: "hotDog", emoji: IMAGES.hotDog, rotation: 45 },
  //     { id: "blueberry", emoji: IMAGES.blueberry, rotation: 90 },
  //     { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 135 },
  //     { id: "coconut", emoji: IMAGES.coconut, rotation: 45 },
  //     { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 90 },
  //     { id: "carrot", emoji: IMAGES.carrot, rotation: 135 },
  //   ],
  //   [
  //     { id: "coconut", emoji: IMAGES.coconut, rotation: 45 },
  //     { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
  //     { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 135 },
  //     { id: "cookie", emoji: IMAGES.cookie, rotation: 45 },
  //     { id: "lemonade", emoji: IMAGES.lemonade, rotation: 90 },
  //     { id: "strawberry", emoji: IMAGES.strawberry, rotation: 135 },
  //   ],
  //   [
  //     { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
  //     { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 90 },
  //     { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 135 },
  //     { id: "blueberry", emoji: IMAGES.blueberry, rotation: 45 },
  //     { id: "hamburger", emoji: IMAGES.hamburger, rotation: 90 },
  //     { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 135 },
  //   ],
  //   [
  //     { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 45 },
  //     { id: "carrot", emoji: IMAGES.carrot, rotation: 90 },
  //     { id: "orange", emoji: IMAGES.orange, rotation: 135 },
  //     { id: "donut", emoji: IMAGES.donut, rotation: 45 },
  //     { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
  //     { id: "tomato", emoji: IMAGES.tomato, rotation: 135 },
  //   ],
  //   [
  //     { id: "coconut", emoji: IMAGES.coconut, rotation: 45 },
  //     { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 90 },
  //     { id: "cola", emoji: IMAGES.cola, rotation: 135 },
  //     { id: "pineapple", emoji: IMAGES.pineapple, rotation: 45 },
  //     { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 90 },
  //     { id: "broccoli", emoji: IMAGES.broccoli, rotation: 135 },
  //   ],
  //   [
  //     { id: "tomato", emoji: IMAGES.tomato, rotation: 45 },
  //     { id: "lemonade", emoji: IMAGES.lemonade, rotation: 90 },
  //     { id: "hotDog", emoji: IMAGES.hotDog, rotation: 135 },
  //     { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 45 },
  //     { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 90 },
  //     { id: "grapes", emoji: IMAGES.grapes, rotation: 135 },
  //   ],
  //   [
  //     { id: "cola", emoji: IMAGES.cola, rotation: 45 },
  //     { id: "carrot", emoji: IMAGES.carrot, rotation: 90 },
  //     { id: "corn", emoji: IMAGES.corn, rotation: 135 },
  //     { id: "cookie", emoji: IMAGES.cookie, rotation: 45 },
  //     { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 90 },
  //     { id: "hamburger", emoji: IMAGES.hamburger, rotation: 135 },
  //   ],
  //   [
  //     { id: "donut", emoji: IMAGES.donut, rotation: 45 },
  //     { id: "mango", emoji: IMAGES.mango, rotation: 90 },
  //     { id: "coconut", emoji: IMAGES.coconut, rotation: 135 },
  //     { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 45 },
  //     { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 90 },
  //     { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 135 },
  //   ],
  //   [
  //     { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
  //     { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 90 },
  //     { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 135 },
  //     { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 45 },
  //     { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 90 },
  //     { id: "pizza", emoji: IMAGES.pizza, rotation: 135 },
  //   ],
  //   [
  //     { id: "cola", emoji: IMAGES.cola, rotation: 45 },
  //     { id: "pizza", emoji: IMAGES.pizza, rotation: 90 },
  //     { id: "banana", emoji: IMAGES.banana, rotation: 135 },
  //     { id: "lemonade", emoji: IMAGES.lemonade, rotation: 45 },
  //     { id: "donut", emoji: IMAGES.donut, rotation: 90 },
  //     { id: "blueberry", emoji: IMAGES.blueberry, rotation: 135 },
  //   ],
  //   [
  //     { id: "cola", emoji: IMAGES.cola, rotation: 45 },
  //     { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 90 },
  //     { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 135 },
  //     { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 45 },
  //     { id: "grapes", emoji: IMAGES.grapes, rotation: 90 },
  //     { id: "steak", emoji: IMAGES.steak, rotation: 135 },
  //   ],
  //   [
  //     { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 45 },
  //     { id: "broccoli", emoji: IMAGES.broccoli, rotation: 90 },
  //     { id: "grapes", emoji: IMAGES.grapes, rotation: 135 },
  //     { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 45 },
  //     { id: "hamburger", emoji: IMAGES.hamburger, rotation: 90 },
  //     { id: "donut", emoji: IMAGES.donut, rotation: 135 },
  //   ],
  //   [
  //     { id: "corn", emoji: IMAGES.corn, rotation: 45 },
  //     { id: "donut", emoji: IMAGES.donut, rotation: 90 },
  //     { id: "strawberry", emoji: IMAGES.strawberry, rotation: 135 },
  //     { id: "taco", emoji: IMAGES.taco, rotation: 45 },
  //     { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 90 },
  //     { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 135 },
  //   ],
  //   [
  //     { id: "pineapple", emoji: IMAGES.pineapple, rotation: 45 },
  //     { id: "mango", emoji: IMAGES.mango, rotation: 90 },
  //     { id: "orange", emoji: IMAGES.orange, rotation: 135 },
  //     { id: "lemonade", emoji: IMAGES.lemonade, rotation: 45 },
  //     { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 90 },
  //     { id: "hamburger", emoji: IMAGES.hamburger, rotation: 135 },
  //   ],
  //   [
  //     { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 45 },
  //     { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 90 },
  //     { id: "hotDog", emoji: IMAGES.hotDog, rotation: 135 },
  //     { id: "cola", emoji: IMAGES.cola, rotation: 45 },
  //     { id: "orange", emoji: IMAGES.orange, rotation: 90 },
  //     { id: "taco", emoji: IMAGES.taco, rotation: 135 },
  //   ],
  //   [
  //     { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 45 },
  //     { id: "blueberry", emoji: IMAGES.blueberry, rotation: 90 },
  //     { id: "taco", emoji: IMAGES.taco, rotation: 135 },
  //     { id: "mango", emoji: IMAGES.mango, rotation: 45 },
  //     { id: "grapes", emoji: IMAGES.grapes, rotation: 90 },
  //     { id: "cookie", emoji: IMAGES.cookie, rotation: 135 },
  //   ],
  //   [
  //     { id: "pizza", emoji: IMAGES.pizza, rotation: 45 },
  //     { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
  //     { id: "hotDog", emoji: IMAGES.hotDog, rotation: 135 },
  //     { id: "mango", emoji: IMAGES.mango, rotation: 45 },
  //     { id: "broccoli", emoji: IMAGES.broccoli, rotation: 90 },
  //     { id: "corn", emoji: IMAGES.corn, rotation: 135 },
  //   ],
  //   [
  //     { id: "steak", emoji: IMAGES.steak, rotation: 45 },
  //     { id: "coconut", emoji: IMAGES.coconut, rotation: 90 },
  //     { id: "taco", emoji: IMAGES.taco, rotation: 135 },
  //     { id: "pizza", emoji: IMAGES.pizza, rotation: 45 },
  //     { id: "hamburger", emoji: IMAGES.hamburger, rotation: 90 },
  //     { id: "tomato", emoji: IMAGES.tomato, rotation: 135 },
  //   ],
  //   [
  //     { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 45 },
  //     { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 90 },
  //     { id: "cookie", emoji: IMAGES.cookie, rotation: 135 },
  //     { id: "orange", emoji: IMAGES.orange, rotation: 45 },
  //     { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 90 },
  //     { id: "pizza", emoji: IMAGES.pizza, rotation: 135 },
  //   ],
  //   [
  //     { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
  //     { id: "broccoli", emoji: IMAGES.broccoli, rotation: 90 },
  //     { id: "carrot", emoji: IMAGES.carrot, rotation: 135 },
  //     { id: "lemonade", emoji: IMAGES.lemonade, rotation: 45 },
  //     { id: "taco", emoji: IMAGES.taco, rotation: 90 },
  //     { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 135 },
  //   ],
  //   [
  //     { id: "coconut", emoji: IMAGES.coconut, rotation: 45 },
  //     { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
  //     { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 135 },
  //     { id: "cookie", emoji: IMAGES.cookie, rotation: 45 },
  //     { id: "lemonade", emoji: IMAGES.lemonade, rotation: 90 },
  //     { id: "strawberry", emoji: IMAGES.strawberry, rotation: 135 },
  //   ],
  //   [
  //     { id: "broccoli", emoji: IMAGES.broccoli, rotation: 45 },
  //     { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 90 },
  //     { id: "tomato", emoji: IMAGES.tomato, rotation: 135 },
  //     { id: "cookie", emoji: IMAGES.cookie, rotation: 45 },
  //     { id: "iceCreamCone", emoji: IMAGES.iceCreamCone, rotation: 90 },
  //     { id: "banana", emoji: IMAGES.banana, rotation: 135 },
  //   ],
  //   [
  //     { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 45 },
  //     { id: "lemonade", emoji: IMAGES.lemonade, rotation: 90 },
  //     { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 135 },
  //     { id: "steak", emoji: IMAGES.steak, rotation: 45 },
  //     { id: "corn", emoji: IMAGES.corn, rotation: 90 },
  //     { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 135 },
  //   ],
  //   [
  //     { id: "sandwhich", emoji: IMAGES.sandwhich, rotation: 45 },
  //     { id: "banana", emoji: IMAGES.banana, rotation: 90 },
  //     { id: "taco", emoji: IMAGES.taco, rotation: 135 },
  //     { id: "pineapple", emoji: IMAGES.pineapple, rotation: 45 },
  //     { id: "frenchFries", emoji: IMAGES.frenchFries, rotation: 90 },
  //     { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 135 },
  //   ],
  //   [
  //     { id: "birthdayCake", emoji: IMAGES.birthdayCake, rotation: 45 },
  //     { id: "mango", emoji: IMAGES.mango, rotation: 90 },
  //     { id: "cola", emoji: IMAGES.cola, rotation: 135 },
  //     { id: "cherry", emoji: IMAGES.cherry, rotation: 45 },
  //     { id: "tomato", emoji: IMAGES.tomato, rotation: 90 },
  //     { id: "strawberry", emoji: IMAGES.strawberry, rotation: 135 },
  //   ],
  //   [
  //     { id: "blueberry", emoji: IMAGES.blueberry, rotation: 45 },
  //     { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 90 },
  //     { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 135 },
  //     { id: "tomato", emoji: IMAGES.tomato, rotation: 45 },
  //     { id: "corn", emoji: IMAGES.corn, rotation: 90 },
  //     { id: "pineapple", emoji: IMAGES.pineapple, rotation: 135 },
  //   ],
  //   [
  //     { id: "carrot", emoji: IMAGES.carrot, rotation: 45 },
  //     { id: "chocolateBar", emoji: IMAGES.chocolateBar, rotation: 90 },
  //     { id: "pineapple", emoji: IMAGES.pineapple, rotation: 135 },
  //     { id: "grapes", emoji: IMAGES.grapes, rotation: 45 },
  //     { id: "strawberry", emoji: IMAGES.strawberry, rotation: 90 },
  //     { id: "pizza", emoji: IMAGES.pizza, rotation: 135 },
  //   ],
  //   [
  //     { id: "grapes", emoji: IMAGES.grapes, rotation: 45 },
  //     { id: "corn", emoji: IMAGES.corn, rotation: 90 },
  //     { id: "coconut", emoji: IMAGES.coconut, rotation: 135 },
  //     { id: "orange", emoji: IMAGES.orange, rotation: 45 },
  //     { id: "banana", emoji: IMAGES.banana, rotation: 90 },
  //     { id: "cherry", emoji: IMAGES.cherry, rotation: 135 },
  //   ],
  //   [
  //     { id: "carrot", emoji: IMAGES.carrot, rotation: 45 },
  //     { id: "mango", emoji: IMAGES.mango, rotation: 90 },
  //     { id: "steak", emoji: IMAGES.steak, rotation: 135 },
  //     { id: "thanksgiving", emoji: IMAGES.thanksgiving, rotation: 45 },
  //     { id: "cherryCheesecake", emoji: IMAGES.cherryCheesecake, rotation: 90 },
  //     { id: "banana", emoji: IMAGES.banana, rotation: 135 },
  //   ],
  //   [
  //     { id: "pancakeStack", emoji: IMAGES.pancakeStack, rotation: 45 },
  //     { id: "strawberry", emoji: IMAGES.strawberry, rotation: 90 },
  //     { id: "hamburger", emoji: IMAGES.hamburger, rotation: 135 },
  //     { id: "hotDog", emoji: IMAGES.hotDog, rotation: 45 },
  //     { id: "milkBottle", emoji: IMAGES.milkBottle, rotation: 90 },
  //     { id: "banana", emoji: IMAGES.banana, rotation: 135 },
  //   ],
  // ];

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

  function getRandomElement(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex === 0) {
      randomIndex = 1;
    }
    return array[randomIndex];
  }

  const randomUserDeck = getRandomElement(shuffledArray);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [userDeck, setUserDeck] = useState(randomUserDeck);
  const [gameDeck, setGameDeck] = useState(shuffledArray);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState();

  const [timeRemaining, setTimeRemaining] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [notInDeck, setNotInDeck] = useState(false);
  const [roundOver, setRoundOver] = useState(true);
  const [todaysHighscore, setTodaysHighscore] = useState();
  const [todaysHighScoreTime, setTodaysHighScoreTime] = useState();
  const [showGameOverMessage, setShowGameOverMessage] = useState(false);
  const [matchingID, setMatchingID] = useState();

  const { user } = useAuth();
  const refs = useRef([]);

  function checkIfNewDay(todaysHighScoreTime) {
    let currentDate = new Date();

    let serverDate = new Date(todaysHighScoreTime.toDate());
    const docRef = doc(db, "users", user?.email);

    if (currentDate.getDate() !== serverDate.getDate()) {
      oneMinGameTodayHighScore = 0;
      todaysHighScoreTime = currentDate;
      updateDoc(docRef, {
        oneMinGameTodayHighScore: oneMinGameTodayHighScore,
        todaysHighScoreTime: currentDate,
      });
    }
  }

  useEffect(() => {
    const userQuerys = collection(db, "users");
    const q = query(userQuerys, where("username", "==", `${user?.email}`));

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setHighScore(doc.data().highScore);
        setTodaysHighscore(doc.data().oneMinGameTodayHighScore);
        setTodaysHighScoreTime(doc.data().todaysHighScoreTime);
      });
    });
  }, [user?.email]);

  useEffect(() => {
    if (todaysHighScoreTime) {
      checkIfNewDay(todaysHighScoreTime);
    }
  }, [todaysHighScoreTime]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        setShowGameOverMessage(true);
      }, 1050);
    }
  }, [gameOver]);

  const findMatchingId = () => {
    gameDeck[currentIndex].forEach((gameDeckItem) => {
      let found = userDeck.find((userDeckItem) => {
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
  }, [currentIndex, gameDeck, userDeck]);

  console.log("matchingID", matchingID);
  //make a reset function
  const resetGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);
    setTimeRemaining(60);
    setShowGameOverMessage(false);
    setGameDeck(shuffleArrayPreGame(shuffledArray));
    setUserDeck(getRandomElement(shuffledArray));
  };

  function handleButtonPress() {
    const docRef = doc(db, "users", user?.email);

    setScore(score + 1);
    if (score + 1 > highScore) {
      updateDoc(docRef, {
        highScore: score + 1,
        serverTimestamp: serverTimestamp(),
      });
    }
  }

  function todaysHighScore() {
    const docRef = doc(db, "users", user?.email);

    // checkIfNewDay(todaysHighScoreTime);
    if (score + 1 > todaysHighscore) {
      updateDoc(docRef, {
        oneMinGameTodayHighScore: score + 1,
        todaysHighScoreTime: serverTimestamp(),
      });
    }
  }

  const handleClick = (clickedEmoji) => {
    if (gameDeck[currentIndex].some((emoji) => emoji.id === clickedEmoji)) {
      setUserDeck([...gameDeck[currentIndex]]);
      // setScore(score + 1);

      handleButtonPress();
      todaysHighScore();

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
      setNotInDeck(true);
      setTimeout(() => {
        setNotInDeck(false);
      }, 1200);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const goToHome = () => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 170);
  };

  const resetGameDelay = () => {
    setTimeout(() => {
      resetGame();
    }, 170);
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
        <>
          {!showGameOverMessage && (
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

          {!showGameOverMessage && (
            <>
              <View style={styles.newMiddleBarConatiner}>
                {roundOver && (
                  <Animated.View
                    entering={FlipInEasyX.duration(875)}
                    exiting={
                      gameOver
                        ? FadeOut.duration(10)
                        : FlipOutEasyX.duration(850)
                    }
                    style={[styles.gameDeckContainer]}
                  >
                    {gameDeck[currentIndex].map((emoji, index) => (
                      <Animated.Image
                        source={emoji.emoji}
                        style={{
                          width:
                            getChosenDeck === "foodDeck" || "flagDeck"
                              ? 49
                              : 45,
                          height:
                            getChosenDeck === "foodDeck" || "flagDeck"
                              ? 49
                              : 45,

                          transform: [{ rotate: `${emoji.rotation}deg` }],
                          opacity: gameOver
                            ? emoji.id === matchingID
                              ? 1
                              : 0.2
                            : 1,
                        }}
                        key={index}
                      />
                    ))}
                  </Animated.View>
                )}
              </View>

              {/* test icon size view */}
              {/* <View
                style={[
                  styles.gameContainer,
                  { alignItems: "center", justifyContent: "center" },
                ]}
              >
                <View style={[styles.userDeckContainerList]}>
                  <Animated.View
                    style={{
                      // backgroundColor: notInDeck
                      //   ? "rgba(212, 83, 8, 0.6)"
                      //   : "rgba(255, 255, 255, 0.3)",
                      // margin: 10,
                      // borderRadius: 100,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      disabled={gameOver === true || notInDeck ? true : false}
                      // onPress={() => handleClick(item.id)}
                      style={{
                        padding: 8,
                        margin: 8,
                      }}
                    >
                      <Animated.Image
                        entering={FadeIn.duration(900).delay(90)}
                        source={IMAGES.mapleLeaf}
                        style={{
                          width: 95,
                          height: 95,
                          backgroundColor: notInDeck
                            ? "rgba(212, 83, 8, 0.6)"
                            : "rgba(255, 255, 255, 0.3)",
                          margin: 10,
                          borderRadius: 100,
                          opacity: gameOver === true ? 0.5 : 1,
                        }}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </View> */}

              <Animated.View
                exiting={FadeOut.duration(800)}
                style={[
                  styles.gameContainer,
                  { alignItems: "center", justifyContent: "center" },
                ]}
              >
                <View style={[styles.userDeckContainerList]}>
                  <Animated.FlatList
                    data={userDeck}
                    numColumns={3}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 10 }} />
                    )}
                    contentContainerStyle={{ alignItems: "center" }}
                    renderItem={({ item, index }) => (
                      <Animated.View
                        style={{
                          backgroundColor: notInDeck
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
                            gameOver === true || notInDeck ? true : false
                          }
                          key={item.id}
                          onPress={() => handleClick(item.id)}
                          style={{
                            padding: 8,
                            margin: 8,
                          }}
                        >
                          <Animated.Image
                            entering={FadeIn.duration(900).delay(index * 90)}
                            source={item.emoji}
                            style={{
                              width:
                                getChosenDeck === "foodDeck" || "flagDeck"
                                  ? 56
                                  : 55,
                              height:
                                getChosenDeck === "foodDeck" || "flagDeck"
                                  ? 56
                                  : 55,

                              opacity: gameOver
                                ? item.id === matchingID
                                  ? 1
                                  : 0.2
                                : 1,
                            }}
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              </Animated.View>
            </>
          )}

          {!gameOver && (
            <View style={styles.goHomeContainer}>
              <ThemedButton
                name="bruce"
                type="primary"
                // onPressOut={() => navigation.navigate("Home")}
                onPressOut={goToHome}
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

        {showGameOverMessage && (
          <Animated.View
            entering={FadeIn.duration(800).delay(200)}
            style={styles.gameOverContainer}
          >
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
            </View>

            <Text style={{ fontSize: 50, marginTop: 180, color: "white" }}>
              Game Over
            </Text>
          </Animated.View>
        )}
        <View style={[styles.scoreContainer]}>
          <Text style={{ fontSize: 50, color: "white" }}>{score}</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

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
  goHomeContainer: {
    position: "absolute",
    //place at the bottom left of the screen
    // bottom: 165,
    // left: 15,
    //place at the top left of the screen
    top: 40,
    left: 10,
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
  newMiddleBarConatiner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: screenHeight / 4.5,
    // backgroundColor: "yellow",
    // backgroundColor: "rgba(255, 255, 255, 0.3)",
    // borderRadius: 40,
    width: "100%",
    height: "40%",
  },
  gameDeckContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    // top: screenHeight / 2.5,
    // backgroundColor: "yellow",
    backgroundColor: "rgba(255, 255, 255, 0.3)",

    // backgroundColor: "rgba(209, 242, 246, 0.9)",

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
    top: screenHeight / 3,
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // top: 720,
    top: screenHeight / 1.13,

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
