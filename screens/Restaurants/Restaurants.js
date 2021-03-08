import React, { useState, useEffect } from "react";
import {StyleSheet, View, Text} from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";


export default function Restaurants(props){

  const { navigation } = props;
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, [])

  return(
    <View style={styles.viewBody}>
        <Text style={styles.text1}>Restaurants.....</Text>
        {user && 
          <Icon
            type="material-community"
            name="plus"
            color="#00a680"
            reverse
            containerStyle={styles.btnPlus}
            onPress={() => navigation.navigate("add-restaurant")}
          /> 
        }
        
    </View>  
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnPlus: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: {height: 2, width: 2},
    shadowOpacity: 0.5,
  },
});