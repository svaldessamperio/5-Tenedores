import React, { useRef } from "react";
import { StyleSheet, View, Image} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import Toast from "react-native-easy-toast";
import RegisterForm from "../../componentes/Account/RegisterForm";


export default function Register() {
    const toastRef = useRef();

    return (
        <KeyboardAwareScrollView>
            <Image source={require("../../assets/img/5-tenedores-letras-icono-logo.png")}
            resizeMode="contain"
            style={styles.logo}/>
            <View style={styles.frmRegister}>
                <RegisterForm toastRef={toastRef}/>
            </View>
            <Toast style={styles.toast} position='top' ref={toastRef} position="center" opacity={0.9}/>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    toast:{
        backgroundColor:"red",
    },
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    frmRegister:{
        marginRight: 10,
        marginLeft: 10,
    },
});
