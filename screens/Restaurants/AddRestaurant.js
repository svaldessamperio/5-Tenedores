import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../componentes/Loading";
import AddRestaurantForm from "../../componentes/Restaurants/AddRestaurantForm";


export default function AddRestaurant(props) {
    const { navigation } = props;
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    return (
        <View>
            <AddRestaurantForm 
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
            />
            <Toast style={styles.toast} ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Creando restaurante" />

        </View>
    );
}

const styles = StyleSheet.create({
    toast:{
        backgroundColor:"red",
    },
});