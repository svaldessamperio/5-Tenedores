import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import { validarEmail } from "../../utils/validations";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";
import Loading from "../../componentes/Loading";

export default function LoginForm(props){

    
    const [showPassword, setshowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValues());
    const { toastRef } = props;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password)){
            toastRef.current.show("Todo los campos son obligatorios");
        } else if (!validarEmail(formData.email)){
            toastRef.current.show("El email no es correcto, valide e intente nuevamente");
        } else {
            setLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    setLoading(false);
                    navigation.navigate("account");
                })
                .catch(() => {
                    toastRef.current.show("Email o Contraseña Incorrecta");
                    setLoading(false);
                });
        }
        
    };

    const onChange = (value, type) => {
        setFormData({...formData, [type]: value});
    };

    return(
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo"
                containerStyle={styles.inputForm}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
                onChangeText={(value) => onChange(value,"email")}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false:true}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setshowPassword(!showPassword)}
                    />
                }
                onChangeText={(value) => onChange(value, "password")}
            />
            <Button 
                title="Iniciar sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />
            <Loading 
                isVisible={loading}
                text="Iniciando Sesion..."
            />

        </View>
    );
}

function defaultFormValues(){
    return {
        email:"",
        password: "",
    }
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm:{
        width: "100%",
        marginTop: 20,
    },
    btnContainerLogin:{
        marginTop:20,
        width: "95%",
    },
    btnLogin:{
        backgroundColor:"#00a680",
    },
    iconRight: {
        color: "#c1c1c1",
    },
})
