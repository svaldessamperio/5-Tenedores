import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text  } from 'react-native';
import { Avatar, Accessory, Image } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default function InfoUser(props) {
    const { userInfo, toastRef, setLoading, setLoadingText } = props;
    const { uid, photoURL, displayName, email } = userInfo;

    //console.log(props.userInfo);

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;
        //console.log(resultPermission);
        if (resultPermissionCamera === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galería");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            //console.log(result.uri);
            if (result.cancelled){
                toastRef.current.show("Has cancelado la selección de una imagen");
            } else {
                upLoadImage(result.uri)
                .then(() => { 
                    //console.log("Imagen subida");
                    updatePhotoUrl();
                })
                .catch(() => {
                    toastRef.current.show("Hubo un error al subir la imagen");
                });
            }
        }

    }
    //console.log(userInfo);
    const upLoadImage = async (uri) => {

        setLoadingText("Actualizando Avatar");
        setLoading(true);

        const response = await fetch(uri);
        //console.log(JSON.stringify(response));
        const blob = await response.blob();
        //console.log(JSON.stringify(blob));

        //console.log(`avatar/${uid}`);
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }

    const updatePhotoUrl = () => {
        firebase
        .storage()
        .ref(`avatar/${uid}`)
        .getDownloadURL()
        .then(async response => {
           const update = {
               photoURL: response,
           };
           await firebase.auth().currentUser.updateProfile(update);
           setLoading(false);
        })
        .catch(()=>{
            toastRef.current.show("No se ha podido actualizar tu avatar en firebase, por favor inténtalo nuevamente");
        });
    }

    return(
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                activeOpacity={0.9}
                containerStyle={styles.userInfoAvatar}
                onPress={changeAvatar}
                source={
                    photoURL ? { uri: photoURL} : require("../../assets/img/avatar-default.jpg")
                }
            >
                <Accessory 
                    size={30}
                    opacity={1}
                    style={{backgroundColor:"blue",}}
                    onPress={changeAvatar}
                />
            </Avatar>
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email ? email : "social login"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        textAlignVertical:"center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar: {
        marginRight: 20,
    },
    avatarTitle: {
        backgroundColor: "black",
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
});