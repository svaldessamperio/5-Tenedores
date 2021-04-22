import React, { useState, useCallback, useRef } from "react";
import {StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import { Icon, Button, Image } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native"
import Loading from "../../componentes/Loading";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
    const { navigation } = props;
    const [userLogged, setUserLogged] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [recargaPagina, setRecargaPagina] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const user = firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });
    
    const toastRef = useRef();

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
        },[userLogged, recargaPagina])
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
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant} setIsVisible={setIsVisible} navigation={navigation}/>}
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
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={isVisible} text="Actualizando Favoritos"/>
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
        const { restaurant, setIsVisible, navigation } = props;
        const { id, name, images } = restaurant.item;

        const confirmRemoveFavorites = () => {
            Alert.alert(
                "Eliminar de Favoritos",
                "¿Deseas eliminar este restaurante de favoritos?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Eliminar",
                        onPress: removeFromFavorites,
                    },
                ],
                {cancelable: false}
            );
        }
        const removeFromFavorites = () =>{
            setIsVisible(true);
            db.collection("favorites")
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .where("idRestaurant", "==", id)
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    db.collection("favorites")
                    .doc(doc.id)
                    .delete()
                    .then(() => {
                        console.log("Se borró de favoritos el restaurante: " + doc.id);
                        toastRef.current.show("El restaurante fue eliminado de favoritos");
                        setRecargaPagina(!recargaPagina);
                        setIsVisible(false);
                    })
                    .catch(() => {
                        setIsVisible(false);
                        toastRef.current.show("Falla al eliminar el restaurant de favoritos");
                        console.log("Falla al eliminar el restaurant de favoritos");
                    });
                })
            })
            .catch(() => {
                setIsVisible(false);
                toastRef.current.show("Error al intentar ubicar el registo a eliminar");
                console.log("Error al intentar ubicar el registo a eliminar");
            });
        }
        return(
            <View style={styles.viewRestaurant}>
                <TouchableOpacity onPress={() => { 
                    navigation.navigate("restaurants", {
                    screen: "restaurant", 
                    params: { id, name },})
                    }
                    }>
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
                        onPress={confirmRemoveFavorites}
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