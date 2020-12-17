import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native"
 
export default function UserGuest(){
    const navigation = useNavigation();


    return(
        <ScrollView centerContent={true} style={styles.viewBody}> 
            <Image style={styles.image} source={require("../../assets/img/user-guest.jpg")} resizeMode="contain" />
            <Text style={styles.title}>Consulta tu perfil de 5 Tenedores</Text>
            <Text style={styles.descripcion}>¿Como describiras tu mejor restaurante? Busca y Visualiza los mejores
                restaurantes de una forma sencilla, vota cual te ha gustado más y comenta
                como ha sido tu experiencia.
            </Text>
            <View style={styles.viewButton}>
                <Button 
                    title="Ver tu perfil"
                    buttonStyle={styles.btnStyle} 
                    containerStyle={styles.containerBtn} 
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    );
}

const styles=StyleSheet.create({
    viewBody:{
        marginLeft: 30,
        marginRight: 30,
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center",
    },
    descripcion:{
        textAlign: "center",
        marginBottom: 20,
    },
    btnStyle:{
        backgroundColor: "#00a680",
    },
    containerBtn: {
        width: "70%",
    },
    viewButton:{
        flex: 1,
        alignItems: "center",
    },

});