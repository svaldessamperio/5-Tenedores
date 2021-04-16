import React, { useState, useEffect, useCallback } from "react";
import {StyleSheet, View, Text} from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import ListRestaurants from "../../componentes/Restaurants/ListRestaurants";
import { orderBy } from "lodash";


export default function Restaurants(props){

  const { navigation } = props;
  const [user, setUser] = useState(null);
  const db = firebase.firestore(firebaseApp);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [startRestaurants, setStartRestaurants] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 10;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, [])

  useFocusEffect(
    useCallback(()=>{
      db.collection("restaurants").get().then((snap) => {
        setTotalRestaurants(snap.size);
      });
      const resultRestaurants = [];
      db.collection("restaurants")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get().then((response) => {
        //console.log(response.docs[response.docs.length - 1].data().name + '-------' + response.docs[response.docs.length - 1].data().createdAt);
        setStartRestaurants(response.docs[response.docs.length - 1]);
        response.forEach((doc) =>{
            const restaurant = doc.data();
            //console.log(doc.id);
            restaurant.id = doc.id;
            resultRestaurants.push(restaurant);
        });
        setRestaurants(resultRestaurants);
      })
    },[])
  );

    const handleLoadMore = () =>{
    const resultRestaurants = [];
    restaurants.length < totalRestaurants && setIsLoading(true);

    db.collection("restaurants")
    .orderBy("createdAt","desc")
    .startAfter(startRestaurants.data().createdAt)
    .limit(limit)
    .get().then((response) =>{
      if (response.docs.length > 0){
        //console.log(response.docs[response.docs.length - 1].data().name + '-------' + response.docs[response.docs.length - 1].data().createdAt);
        setStartRestaurants(response.docs[response.docs.length - 1]);
      } else {
        setIsLoading(false);
      }

      response.forEach((doc) =>{
        const restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push(restaurant);
      });

      setRestaurants([...restaurants, ...resultRestaurants]);
    })
  }

  return(
    <View style={styles.viewBody}>
        <ListRestaurants restaurants={restaurants} handleLoadMore={handleLoadMore} isLoading={isLoading}/>
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