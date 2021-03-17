import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from "react-native";
import {Icon, Avatar, Image, Input, Button} from "react-native-elements";
import { map, size, filter, set } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";


export default function AddRestaurantForm(props){
    const { toastRef, setIsLoading, navigation } = props;
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);
    const widthScreen = Dimensions.get("window").width;

    const addRestaurant = () =>{
        console.log("Rest Name: " + restaurantName);
        console.log("Rest. Dir: " + restaurantAddress);
        console.log("Rest. Descrip: " + restaurantDescription);
        console.log(imageSelected);
        console.log(locationRestaurant);
    };

    return(
        <ScrollView style={styles.scrollView}>
            <MainImage
                imageRestaurant={imageSelected[0]}
                widthScreen={widthScreen}
            />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
            />
            <UploadImage
                toastRef={toastRef}
                imageSelected={imageSelected}
                setImageSelected={setImageSelected}
            />
            <Button
                title="Crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    );
}

function FormAdd (props) {
    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap } = props;
    return(
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) =>{
                    setRestaurantName(e.nativeEvent.text);
                }}
            /> 
            <Input
                placeholder= "Dirección del restaurante"
                containerStyle={styles.input}
                onChange={(e) => {
                    setRestaurantAddress(e.nativeEvent.text);
                }}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: "#c2c2c2",
                    onPress: () => {
                        setIsVisibleMap(true);
                    }
                }}
            /> 
            <Input
                placeholder="Descripción del restaurante"
                multiline={true} 
                inputContainerStyle={styles.textArea}
                onChange={(e) => {
                    setRestaurantDescription(e.nativeEvent.text);
                }}
            /> 
        </View>
    );

}

function Map (props) {
    
    const [location, setLocation] = useState(null);
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } = props;

    const guardarLocation = () => {
        setLocationRestaurant (location);
        toastRef.current.show("La localización se ha almacenado");
        setIsVisibleMap(false);
    };

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)
            .then((r) => {
                //console.log(r.status);
                if (r.status !== "granted"){
                    toastRef.current.show("Debes aceptar los permisos de Localización para crear restaurantes");
                } else {
                    const loc = Location.getLastKnownPositionAsync({})
                    .then((loc) => { 
                        //console.log(JSON.stringify(loc));
                        setLocation({
                            latitude: loc.coords.latitude,
                            longitude: loc.coords.longitude,
                            latitudeDelta: 0.001,
                            longitudeDelta: 0.001,
                        });
                    })
                    .catch((e) => { 
                        console.log("FALLÓ: " + e ); 
                    });
                }
            })
            .catch((e) => { 
                console.log("ERRORS:" + e);
            });
           
        })()
    }, [])

    return(
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location &&
                <MapView
                    style={styles.mapStyle}
                    initialRegion={location}
                    showsUserLocation={true}
                    showsTraffic={true}
                    onRegionChange={(region) => setLocation(region)}
                >
                    <MapView.Marker 
                        coordinate={location}
                        draggable
                    />
                </MapView>
                }
                <View style={styles.viewMapButton}>
                    <Button
                        title="Guardar ubicacion"
                        containerStyle={styles.viewMapBtnContainerGuardar}
                        buttonStyle={styles.viewMapBtnGuardar}
                        onPress={guardarLocation}
                    />
                    <Button
                        title="Cancelar ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    );
}

function UploadImage(props) {
    const { toastRef, imageSelected, setImageSelected } = props;

    const removeImage = (image) => {
        Alert.alert("Eliminar Imagen",
                    "Desea continuar con el borrado de la imagen?",
                    [{
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text:"OK",
                        style: "default",
                        onPress: () => {
                            setImageSelected(
                                filter(imageSelected,(imageUri) => imageUri !== image)
                            );
                        }
                    },
                    ],
                    { cancelable: false }
                    );
    };

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (resultPermissions === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos a la galería, si los rechaza no se podrán tomar imágenes de allí", 3000);
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3],
            }).then((r) => {
                //console.log("R:" + JSON.stringify(r) + r.cancelled);
                if (r.cancelled){
                    toastRef.current.show("Has cerrado la galería sin seleccionar alguna imagen", 3000);
                } else {
                    setImageSelected([...imageSelected,r.uri]);
                }
            }).catch((e =>{
                console.log("ERROR:" + e);
            })
            );
        }
    };
    return(
        <View style={styles.viewImages}>
            { size(imageSelected) < 4 && (
                <Icon 
                type="material-community"
                name="camera"
                color="#7a7a7a"
                containerStyle={styles.iconContainerStyle}
                onPress={imageSelect}
                />)
            }
            {
                map(imageSelected, (imageRestaurant, index) => (
                    <Avatar 
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: imageRestaurant }}
                        onPress={() => {removeImage(imageRestaurant);}}
                    />
                ))}
        </View>
    );
}

function MainImage(props){
    
    const { imageRestaurant, widthScreen } = props;
    
    return(
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imageRestaurant 
                    ? { uri: imageRestaurant }
                    : require("../../assets/img/no-image.png")
                }
                style={{ width: widthScreen, height:300 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: {
        flex: 1,
        alignItems: "stretch",
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20,
    },
    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    iconContainerStyle:{
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width:70,
        backgroundColor:"#e3e3e3",

    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewPhoto: {
        alignItems:"center",
        height:300,
        marginBottom: 20,
    },
    mapStyle: {
        width: "100%",
        height: 550,
    },
    viewMapButton:{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,

    },
    viewMapBtnContainerCancel:{
        paddingLeft: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerGuardar: {
        paddingRight:5,
    },
    viewMapBtnGuardar: {
        backgroundColor: "#00a680",
    },
});