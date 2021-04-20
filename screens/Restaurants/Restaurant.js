import React, { useCallback, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Rating, ListItem, Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import { map } from "lodash";
import Loading from "../../componentes/Loading";
import CarouselImage from "../../componentes/CarouselImage";
import Map from "../../componentes/Map";
import ListReview from "../../componentes/Restaurants/ListReview";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect } from 'react';

const db=firebase.firestore(firebaseApp);

export default function Restaurant(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false)
    
    const toastRef = useRef();
    const screenWidth = Dimensions.get("window").width;

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useFocusEffect(
        useCallback(() => {
        navigation.setOptions({ title: name });
        db.collection("restaurants")
        .doc(id)
        .get()
        .then((response) => {
            const data = response.data();
            data.id = response.id;
            setRestaurant(data);
            setRating(data.rating);
        })
        }, [id])
    )
    
useEffect(() => {
    if (userLogged && restaurant){
        db.collection("favorites")
        .where("idRestaurant","==",restaurant.id)
        .where("idUser","==",firebase.auth().currentUser.uid)
        .get()
        .then((response)=>{
            if (response.docs.length == 1) {
                setIsFavorite(true);
            }
        })
        .catch(()=>{
            toastRef.current.show("Hubo una falla al agregar como favorito, por favor inténtalo nuevamente");
        })
    }
}, [userLogged,restaurant])

    const removeFromFavorites = () => {
        db.collection("favorites")
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .where("idRestaurant", "==", restaurant.id)
        .get()
        .then((response)=>{
            response.forEach((doc) => {
                const idDocto = doc.id;
                db.collection("favorites")
                .doc(idDocto)
                .delete()
                .then(()=>{
                    setIsFavorite(false);
                    toastRef.current.show("Se ha eliminado el restaurante de favoritos");
                })
                .catch(() => {
                    toastRef.current.show("ERROR al eliminar el restaurante de favoritos");
                });
            });
        })
        .catch(()=>{
            toastRef.current.show("ERROR al buscar el restaurante en favoritos para borrarlo");
        });
    }

    const add2Favorites = () =>{
        if (!userLogged) {
            toastRef.current.show("Es necesario estar logeado para agregar a favoritos");
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id,
            };
            db.collection("favorites").add(payload)
            .then(()=>{
                toastRef.current.show("El restaurante se ha agregado a favoritos");
            })
            .catch(() => {
                toastRef.current.show("Hubo un error al agregar el restaurante a favoritos");
            });
            setIsFavorite(true);
        }
    }

    if (!restaurant) return <Loading isVisible={true} text="Cargando"/>;

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorites}>
                <Icon 
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={35}
                    color={isFavorite ? "#f00" : "#000"}
                    underlayColor="transparent"
                    onPress={isFavorite ? removeFromFavorites : add2Favorites}
                />                
            </View>
            <CarouselImage
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant 
                name={restaurant.name}
                description={restaurant.description}
                rating={restaurant.rating}
            />
            <RestaurantInfo
                restaurant={restaurant}
                navigation={navigation}
                setRating={setRating}
            />
            <Toast ref={toastRef} position={"center"} opacity={0.9}/>            
        </ScrollView>
    )
}

function TitleRestaurant(props){
    const { name, description, rating  } = props;
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    );
}

function RestaurantInfo(props){
    const { restaurant, navigation, setRating} = props;
    const { location, name, address, id } = restaurant;

    //console.log(location, name, address, id);

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            color: "#00a680",
            action: null,
        },
        {
            text: "+52 55 4678 1198",
            iconName: "phone",
            iconType: "material-community",
            color: "#00a680",
            action: null,
        },
        {
            text: "restaurant@restaurant.com",
            iconName: "at",
            iconType: "material-community",
            color: "#00a680",
            action: null,
        },
    ];
    return(
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}> 
                Información sobre el restaurante
            </Text>
            <Map
                location={location}
                name={name}
                height={100}
            />
            {
                map(listInfo, (item, index) => (
                    <ListItem key={index} bottomDivider containerStyle={styles.containerListItem}>
                        <Icon name={item.iconName} type={item.iconType} color={item.color}/>
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
            <ListReview
                navigation={navigation}
                idRestaurant={id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15,

    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold",
    },
    descriptionRestaurant: {
        marginTop:5,
        color: "grey",
    },
    rating: {
        position: "absolute",
        right:0,
    },
    viewRestaurantInfo:{
        margin: 15,
        marginTop: 25,
    },
    restaurantInfoTitle: { 
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    containerListItem: {
        borderBottomColor:"#d8d8d8",
        borderBottomWidth: 1,
    },
    viewFavorites: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15,
    },
})
