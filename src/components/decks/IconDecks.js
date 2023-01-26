import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { IMAGES } from "../../../assets";

const handleAlldecks = () => {
  const getRandomElement = (array) => {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex === 0) {
      randomIndex = 1;
    }
    return array[randomIndex];
  };

  const shuffleArrayPreGame = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const deckOptions = () => {
    const [chosenDeck, setChosenDeck] = useState("gameDecks");
    //print out a list of deck option names and set state for clicked option
    const RandomizeDecks = () => {
      const deckOptions = [
        "gameDecks",
        "gameDecks2",
        "gameDecks3",
        "gameDecks4",
      ];

      return (
        <View style={{ backgroundColor: "red", height: "40%" }}>
          <Text>Choose a deck</Text>
          <FlatList
            data={deckOptions}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setChosenDeck(item);
                }}
              >
                <Text>{item}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item}
          />
          <View style={{ backgroundColor: "yellow" }}>
            <Text>Chosen deck: {chosenDeck}</Text>
          </View>
        </View>
      );
    };

    return { chosenDeck, RandomizeDecks };
  };

  const randomizeDeck = () => {
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
        {
          id: "internetexplorer",
          emoji: IMAGES.internetexplorer,
          rotation: 135,
        },
      ],
      [
        { id: "airbnb", emoji: IMAGES.airbnb, rotation: 45 },
        {
          id: "internetexplorer",
          emoji: IMAGES.internetexplorer,
          rotation: 90,
        },
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
        {
          id: "internetexplorer",
          emoji: IMAGES.internetexplorer,
          rotation: 45,
        },
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
        {
          id: "internetexplorer",
          emoji: IMAGES.internetexplorer,
          rotation: 45,
        },
        { id: "linkedin", emoji: IMAGES.linkedin, rotation: 90 },
        { id: "chrome", emoji: IMAGES.chrome, rotation: 135 },
      ],
      [
        { id: "dropbox", emoji: IMAGES.dropbox, rotation: 45 },
        { id: "luchos", emoji: IMAGES.luchos, rotation: 90 },
        { id: "paypal", emoji: IMAGES.paypal, rotation: 135 },
        { id: "yelp", emoji: IMAGES.yelp, rotation: 45 },
        { id: "wordpress", emoji: IMAGES.wordpress, rotation: 90 },
        {
          id: "internetexplorer",
          emoji: IMAGES.internetexplorer,
          rotation: 135,
        },
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
        {
          id: "internetexplorer",
          emoji: IMAGES.internetexplorer,
          rotation: 135,
        },
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

    const shuffledArray = shuffleArrayPreGame(
      gameDecks.map((deck) => shuffleArrayPreGame(deck))
    );

    return shuffledArray;
  };

  const userOneRandom = (array) => {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex === 0) {
      randomIndex = 1;
    }
    return array[randomIndex];
  };
  let userOneChoice = userOneRandom(randomizeDeck());

  const userTwoRandom = (array) => {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (randomIndex === 0 || randomIndex === userOneChoice) {
      randomIndex = 1;
    }
    return array[randomIndex];
  };

  const defaultUserOne = userOneRandom(randomizeDeck());
  const defaultUserTwo = userTwoRandom(randomizeDeck());
  const randomizeUserDeck = getRandomElement(randomizeDeck());

  return {
    randomizeDeck,
    randomizeUserDeck,
    defaultUserOne,
    defaultUserTwo,
    deckOptions,
    // getAWord,
  };
};

export default handleAlldecks;
