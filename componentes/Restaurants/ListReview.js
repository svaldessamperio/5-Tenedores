import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Avatar, Rating } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";

const db=firebase.firestore(firebaseApp);

export default function ListReview(props) {
    const { navigation, idRestaurant, setRating } = props;
    const [userLogged, setUserLogged] = useState(false);

    //console.log(userLogged);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

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
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent",
    },
    btnTitleAddReview: {
        color: "#00a680",
    },
});
