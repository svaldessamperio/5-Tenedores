import React from "react";
import { View, Text } from "react-native";
import * as firebase from "firebase";
import { Button } from "react-native";

export default function UserLogged(){
    return(
        <View>
            <Text>USerLogged....</Text>
            <Button title="Cerrar Sesión" onPress={() => firebase.auth().signOut()}/>
        </View>
    );
}
