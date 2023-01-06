import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable, TextInput } from "react-native";

import { db } from "../config/firebase";

import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

export const CreateUser = ({ id }) => {
  const [users, setUser] = useState({ username: "", highScore: 0 });

  function addUser() {
    const userDb = collection(db, "users");
    addDoc(userDb, {
      username: users.username,
      highScore: users.highScore,
    });
  }

  function updateUser() {
    updateDoc(doc(db, "users", id), {
      highScore: users.highScore,
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="username"
        onChangeText={(text) => setUser({ ...users, username: text })}
        value={users.username}
      />
      <Pressable onPress={addUser}>
        <Text>Create user</Text>
      </Pressable>
      <Pressable onPress={updateUser}>
        <Text>Update user</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
