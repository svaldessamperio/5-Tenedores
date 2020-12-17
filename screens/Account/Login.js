import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import Register from "./Register";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    return(
        <ScrollView>
            <Image 
            source={require("../../assets/img/5-tenedores-letras-icono-logo.png")}
            resizeMode="contain"
            style={styles.logo}
            />

            <View styles={styles.viewContainer}>
                <Text>Login Form</Text>
                <CreateAccount />
            </View>
            <Divider style={styles.divider}/>
            <Text>Social login</Text>
        </ScrollView>

    );
}

function CreateAccount(){
    const navigation = useNavigation();
    
    return(
        <Text styles={styles.register}>
            Aún no tienes tu cuenta? {" "}
            <Text 
                style={styles.btnRegister}
                onPress={() => navigation.navigate("register")}
            >Registrate</Text>
        </Text>
    );
}

const styles=StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop:20,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    register: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold",
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40,
    },

});