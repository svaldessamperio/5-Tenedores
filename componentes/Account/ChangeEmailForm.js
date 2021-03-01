import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button, Icon} from "react-native-elements";
import * as firebase from "firebase";
import { validarEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm(props){
    const { email, setShowModal, setReloadUserInfo, toastRef } = props;
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());

    const onChange = (e, type) => { 
        setFormData({...formData, [type]: e.nativeEvent.text});
    }

    useEffect(() => {
        if (email){ 
            let datos = {
                nativeEvent: {text: email}
            }
            setFormData({...formData, email: datos.nativeEvent.text});
        }
    }, [])

    const onSubmit = () => {
        if (!formData.email){
            setError({email: "El correo debe ser diferente de vacío"});
        } else if (formData.email === email){
            setError({email: "El correo no debe ser igual al anterior"});
        } else if(!validarEmail(formData.email)){
            setError({email: "El correo no cumple con el formato correcto"});
        } else if (!formData.password) {
            setError({password: "El password no puede ser vacío"});
        } else {
            setIsLoading(true);
            reauthenticate(formData.password)
                .then((response) => {
                    //console.log(JSON.stringify(response));
                    firebase
                    .auth()
                    .currentUser
                    .updateEmail(formData.email)
                    .then(() => {
                        setIsLoading(false);
                        toastRef.current.show("Se actualizó el email correctamente");
                        setReloadUserInfo(true);
                        setShowModal(false);
                    })
                    .catch(()=> {
                        setError({email: "Error al actualizar el email"});
                        setIsLoading(false);
                    });

                })
                .catch(() => {
                    setIsLoading(false);
                    setError({password: "Contraseña Incorrecta"});
                });
            

            //setShowModal(false);
            //setIsLoading(false);
        }
    }
    return(
        <View style={styles.view}>
            <Input
                placeholder="Email" 
                style={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2",
                }}
                defaultValue={email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={error.email}
            />
            <Input 
                placeholder="Contraseña"
                password={true}
                secureTextEntry={showPassword ? false : true}
                style={styles.input}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                    <Icon 
                        type = "material-community"
                        name = {showPassword ? "eye-off-outline" : "eye-outline"}
                        color = "#c2c2c2"
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                }
                errorMessage={error.password}
            />
            <Button 
                title="Cambiar Email"
                style={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    );
}

function defaultFormValue(){
    return ({
        email: "",
        password: "",
    });
}
   
const styles=StyleSheet.create({
        view: {
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
        },
        input: {
            marginBottom: 10,
        },
        btnContainer:{
            marginTop: 20,
            width: "95%",
        },
        btn: {
            backgroundColor: "#00a680",    
        },
        
    });