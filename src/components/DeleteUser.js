import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import { db } from "../config/firebase";

import { deleteDoc, doc } from "firebase/firestore";

export const DeleteUser = ({ id }) => {
  function deleteUser() {
    const user = doc(db, "users", id);
    deleteDoc(user);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={deleteUser}>
        <Text>X</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
