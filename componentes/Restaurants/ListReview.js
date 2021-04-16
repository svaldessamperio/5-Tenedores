import React, { useState, useEffect } from 'react'
import { requireNativeComponent, StyleSheet, Text, View } from 'react-native'
import { Button, Avatar, Rating } from "react-native-elements";
import { map } from "lodash";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db=firebase.firestore(firebaseApp);

export default function ListReview(props) {
    const { navigation, idRestaurant } = props;
    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState(null);

    //console.log(reviews);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

    useEffect(() => {
        db.collection("reviews")
        .where("idRestaurant", "==", idRestaurant)
        .get()
        .then((response)=>{
            const resultReviews = [];
            response.forEach(doc => {
                const reviewWork = doc.data();
                reviewWork.id = doc.id;
                resultReviews.push(reviewWork);
            });
            setReviews(resultReviews);
        })
    }, [])

    return (
        <View>
            {userLogged ? (
            <Button
                title="Agregar Comentario"
                buttonStyle={styles.btnAddReview}
                titleStyle={styles.btnTitleAddReview}
                icon={{
                    type:"material-community",
                    name: "square-edit-outline",
                    color: "#00a680"
                }}
                onPress={() => navigation.navigate("add-review-restaurant", { idRestaurant })}
            />
            ) : (
            <Text style={{ textAlign: "center", color: "#00a680", padding: 20}}
                onPress={()=>{
                    navigation.navigate("login");
                }}
            >
                Para escribir un comentario es necesario estar loggeado {" "}
                <Text style={{ fontWeight: "bold" }}>
                    Pulsa Aquí para iniciar sesión
                </Text>
            </Text>
            )
            } 
            {
                map(reviews, (review, index) => (
                <Review key={index} review={review} />
                ))
            }
        </View>
    )
}

function Review(props){
    const { review } = props;
    const createReview = new Date(review.createdAt.seconds * 1000);

    //console.log(review);
    return (
        <View style={styles.reviewMainView}>
            <View style={styles.viewImageAvatar}>
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.avatarContainer}
                    source={review.avatarUser ? {uri: review.avatarUser} : require("../../assets/img/avatar-default.jpg")}
                />
            </View>
            <View style={styles.viewReviewInfo}>
                <Text style={styles.textTitle}>
                    {review.title}
                </Text>
                <Text style={styles.textDescription}>
                    {review.review}
                </Text>
                <Rating
                    imageSize={15}
                    startingValue={review.rating}
                    readonly
                />
                <Text style={styles.textReviewDate}>
                    {createReview.getDate()}/{createReview.getMonth() + 1}/{createReview.getFullYear()}
                    {" "}{createReview.getHours()}:{createReview.getMinutes()<10 ? "0" : ""}{createReview.getMinutes()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent",
    },
    btnTitleAddReview: {
        color: "#00a680",
    },
    reviewMainView: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 3,
    },
    viewImageAvatar: {
        marginRight: 15,
    },
    avatarContainer: {
        width: 50,
        height: 50,
    },
    viewReviewInfo: {
        flex: 1,
        alignItems: "flex-start",
    },
    textTitle: {
        fontWeight: "bold",
    },
    textDescription: {
        paddingTop: 2,
        color: "grey",
        marginBottom: 5,
    },
    textReviewDate:{
        marginTop: 5,
        color: "grey",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0,
    },
});
