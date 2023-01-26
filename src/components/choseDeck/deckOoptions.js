// import React, { useState } from "react";
// import { View, Text, FlatList, Pressable } from "react-native";
// const deckOptions = () => {
//   const [chosenDeck, setChosenDeck] = useState("gameDecks");
//   //print out a list of deck option names and set state for clicked option
//   const RandomizeDeck = () => {
//     const deckOptions = ["gameDecks", "gameDecks2", "gameDecks3", "gameDecks4"];

//     return (
//       <View style={{ backgroundColor: "red", height: "40%" }}>
//         <Text>Choose a deck</Text>
//         <FlatList
//           data={deckOptions}
//           renderItem={({ item }) => (
//             <Pressable
//               onPress={() => {
//                 setChosenDeck(item);
//               }}
//             >
//               <Text>{item}</Text>
//             </Pressable>
//           )}
//           keyExtractor={(item) => item}
//         />
//         <View style={{ backgroundColor: "yellow" }}>
//           <Text>Chosen deck: {chosenDeck}</Text>
//         </View>
//       </View>
//     );
//   };

//   return { chosenDeck, RandomizeDeck };
// };

// export default deckOptions;
