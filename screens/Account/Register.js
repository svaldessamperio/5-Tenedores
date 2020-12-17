import React from "react";
import { StyleSheet, View, Text, Image} from "react-native";

export default function Register() {
    return (
        <View>
            <Image source={require("../../assets/img/5-tenedores-letras-icono-logo.png")}
            resizeMode="contain"
            style={styles.imgLogo}/>
            <View style={styles.frmRegister}>
                <Text>Register Form</Text>
            </View>        
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    frmRegister:{
        marginRight: 40,
        marginLeft: 40,
    },
});
