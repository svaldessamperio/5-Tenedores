import React, { useState, useEffect } from "react";
import {StyleSheet, View, Text } from "react-native";
import { SearchBar, Image, ListItem, Avatar, Icon } from "react-native-elements";
import { FireSQL } from "firesql";

import firebase from "firebase/app";
import { FlatList } from "react-native-gesture-handler";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props){
  const { navigation } = props;
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);

useEffect(() => {
  if (search) {
    fireSQL
      .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
      .then((response) => {
        setRestaurants(response);
      });
  }
}, [search])

return (
  <View>
      <SearchBar
        placeholder="Buscar Texto"
        onChangeText={(e)=>{
          setSearch(e)
        }}
        value={search}
        containerStyle={styles.containerSearchBar}
      />
      {restaurants.length === 0 ? 
        (<NotFoundRestaurants/>) 
        : 
        ( <FlatList
            data={restaurants}
            renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation}/>}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
  </View>  
);

}

function NotFoundRestaurants(){
  return(
    <View style={{ alignItems: "center"}}> 
        <Image
          source={require("../assets/img/no-result-found.png")}
          resizeMode="cover"
          style={{ width: 200, height: 200 }}
        />
    </View>
  );
}

function Restaurant (props){
  const { restaurant, navigation } = props;
  const { id, name, images } = restaurant.item;

  return(
    <ListItem
      containerStyle={{justifyContent:"space-between",}}
      onPress={() => navigation.navigate("restaurants", {screen: "restaurant", params: { id, name }})}
    >
      <Avatar source={images[0] ? {uri : images[0]} : require("../assets/img/no-image.png")}/>
      <Text>{name}</Text>
      <Icon type="material-community" name="chevron-right"/>

    </ListItem>
      
  );
}

const styles = StyleSheet.create({
  containerSearchBar: {
      marginBottom: 20, 
  },
});