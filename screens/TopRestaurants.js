import React, {useState, useEffect, useRef} from "react";
import {View, Text} from "react-native";
import Toast from "react-native-easy-toast";
import TopListRestaurants from "../componentes/TopListRestaurants/TopListRestaurants";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

export default function TopRestaurants(props){
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState(null);
  const toasRef = useRef();

  const db=firebase.firestore(firebaseApp);

  console.log(restaurants);

  useEffect(() => {
    db.collection("restaurants")
    .orderBy("rating", "desc")
    .limit(5)
    .get()
    .then((response)=>{
      const restaurantsArray = [];
      response.forEach((doc) => {
        const restaurant = doc.data();
        restaurant.id = doc.id;
        restaurantsArray.push(restaurant);
      })
      setRestaurants(restaurantsArray);
    })
    .catch()
  }, [])

return(
  <View>
      <TopListRestaurants navigation={navigation} restaurants={restaurants}/>
      <Toast ref={toasRef} position="center" opacity={0.9}/>
  </View>  
);

}