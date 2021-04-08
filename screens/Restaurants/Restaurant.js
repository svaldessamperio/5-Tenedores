import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Rating, ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import Loading from "../../componentes/Loading";
import CarouselImage from "../../componentes/CarouselImage";
import Map from "../../componentes/Map";
import ListReview from "../../componentes/Restaurants/ListReview";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { InteractionManager } from 'react-native';

const db=firebase.firestore(firebaseApp);

export default function Restaurant(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);


    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
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
    }, [])

    if (!restaurant) return <Loading isVisible={true} text="Cargando"/>;

    return (
        <ScrollView vertical style={styles.viewBody}>
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
                setRating={setRating}
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
})
