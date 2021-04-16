import React, { useState, useCallback } from "react";
import {StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import { Icon, Button, Image } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native"
import Loading from "../../componentes/Loading";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { rest } from "lodash";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
    const { navigation } = props;
    const [userLogged, setUserLogged] = useState(false);
    const [restaurants, setRestaurants] = useState([]);

    const user = firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useFocusEffect (
        useCallback(()=>{
            if(userLogged){
                const idRestaurantsArray = [];

                db.collection("favorites")
                .where("idUser","==",firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                    response.forEach((doc) => {
                        idRestaurantsArray.push(doc.data().idRestaurant);
                    })
                    
                    getRestaurantData(idRestaurantsArray).then((response) => {
                        const restaurantes = [];
                        response.forEach((doc) => {
                            const restaurant = doc.data();
                            restaurant.id = doc.id;
                            restaurantes.push(restaurant);
                        });
                        setRestaurants(restaurantes);
                    });
                })
                .catch(()=>{
                    console.log("Error al traer los favoritos");
                });
            }
        },[userLogged])
    );

    const getRestaurantData = (idRestaurantsArray) => {
        const arrayRestaurants = [];
        idRestaurantsArray.forEach((idRestaurant) => {
            const result = db.collection("restaurants").doc(idRestaurant).get();
            arrayRestaurants.push(result);    
        })        
        return Promise.all(arrayRestaurants);
    }

    if (!userLogged){
        return (<UserNotLogged navigation={navigation}/>);
    }

    if (restaurants?.length === 0) {
        return (<NotFoundRestaurants/>);
    }

    return (
        <View style={styles.viewBody}>
            {restaurants ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant}/>}
                    keyExtractor={(item, index) => index.toString()}
                />
            )
            :
            (
                <View style={styles.loaderRestaurant}>
                    <ActivityIndicator size="large"/>
                    <Text style={{alignItems: "center"}}>Cargando Restaurantes</Text>
                </View>
            )
            }
        </View>
    );

    function NotFoundRestaurants(){
        return(
            <View style={styles.viewNotFoundRestaurants}>
                <Icon 
                    type="material-community"
                    name="alert-outline"
                    size={50}
                />
                <Text style={styles.textNotFoundRestaurants}>
                    No tienes restaurantes en tu lista
                </Text>
            </View>
        );
    }

    function UserNotLogged(props) {
        const { navigation } = props;
        return(
        <View style={styles.viewNotFoundRestaurants}>
            <Icon 
                type="material-community"
                name="alert-outline"
                size={50}
            />
            <Text style={styles.textNotFoundRestaurants}>
                Debes estar logueado para usar esta funcionalidad
            </Text>
            <Button 
                title="Ir a Login"
                containerStyle={{marginTop:20, width:"80%"}}
                buttonStyle={{backgroundColor: "#00a680"}}
                onPress={()=>{
                    navigation.navigate("account", {screen: "login"});
                }}
            />
        </View>           
        );
    }

    function Restaurant(props){
        const { restaurant } = props;
        const { name, images } = restaurant.item;
        return(
            <View style={styles.viewRestaurant}>
                <TouchableOpacity onPress={() => console.log("IR")}>
                    <Image
                        resizeMode="cover"
                        style={styles.restaurantImage}
                        PlaceholderContent={<ActivityIndicator color="#fff" />}
                        source={
                            images[0] ? {uri: images[0]} : require("../../assets/img/no-image.png")
                        }
                    />
                </TouchableOpacity>
                <View style={styles.info}>
                    <Text style={styles.textInfo}>{name}</Text>
                    <Icon
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.iconFavorite}
                        onPress={() => console.log("REMOVE")}
                        underlayColor="transparent"
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    viewNotFoundRestaurants:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    textNotFoundRestaurants: {
        fontSize: 20,
        fontWeight: "bold",
    },
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    loaderRestaurant: {
        marginTop: 10,
        marginBottom: 10,
    },
    viewRestaurant: {
        margin: 10,
    },
    restaurantImage: {
        width:"100%",
        height: 180,
    },
    info: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff",
    },
    textInfo: {
        fontWeight: "bold",
        fontSize: 20,
    },
    iconFavorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100,
    },
});