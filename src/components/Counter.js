import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import * as firebase from "firebase";

function Counter() {
  const [count, setCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        console.log("User is signed in");
        const userId = firebase.auth().currentUser.uid;
        const scoresRef = firebase.firestore().doc("scores/" + userId);

        scoresRef.onSnapshot((snapshot) => {
          const score = snapshot.data();
          if (score) {
            setHighScore(score.highScore);
          }
        });
      } else {
        // User is not signed in
        console.log("User is not signed in");
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  function handleButtonPress() {
    setCount(count + 1);
    if (count + 1 > highScore) {
      const userId = firebase.auth().currentUser.uid;
      firebase
        .firestore()
        .doc("scores/" + userId)
        .set({
          highScore: count + 1,
        });
    }
  }

  return (
    <View>
      <Text>Current count: {count}</Text>
      <Text>High score: {highScore}</Text>
      <Button title="Increment" onPress={handleButtonPress} />
    </View>
  );
}

export default Counter;
