import React, { useState } from "react";
import { StyleSheet, View, Text, EventSubscriptionVendor} from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { size } from "lodash";
import { reauthenticate } from "../../utils/api";

export default function ChangePasswordForm(props){

    const { email, setShowModal, toastRef, setReloadUserInfo} = props;
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text});
    };

    const onSubmit = async () => {
        
        let errorsTemp = {};
        let isSetErrors = true;

        if(!formData.password ||
           !formData.newPassword ||
           !formData.repeatPassword) {
            errorsTemp = {
                password: !formData.password ? "La contraseña no puede ser vacía" : "",
                newPassword: !formData.newPassword ? "La nueva contraseña no puede ser vacía" : "",
                repeatPassword: !formData.repeatPassword ? "La repeticion de la nueva contraseña no puede ser vacía" : "",
            }
        } else if(formData.newPassword !== formData.repeatPassword) {
            errorsTemp = {
                newPassword: "La contraseña debe ser igual a su repetición",
                repeatPassword: "La contraseña debe ser igual a la nueva",
            }            
        } else if(size(formData.newPassword) < 6) {
            errorsTemp = {
                newPassword: "La contraseña debe ser mayor a 5 caracteres",
                repeatPassword: "La contraseña debe ser mayor a 5 caracteres",
            }
        } else {
            setIsLoading(true);
            await reauthenticate(formData.password).then(async () => {
                console.log("Reautenticado OK")
                await firebase.auth().currentUser.updatePassword(formData.newPassword)
                .then(() => {
                    isSetErrors= false;
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                })
                .catch(() => {
                    errorsTemp = {
                        other: "no se ha podido actualizar la contraseña",
                    }
                    setIsLoading(false);
                });
            }).catch(() => {
                setIsLoading(false);
                errorsTemp = {password: "La contraseña no es corrcta"}
            });

        }
        isSetErrors && setErrors(errorsTemp);
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange={(e)=>{onChange(e, "password")}}
                errorMessage={errors.password}
            />
            <Input
                placeholder="Contraseña nueva"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showNewPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowNewPassword(!showNewPassword),
                }}
                onChange={(e)=>{onChange(e, "newPassword")}}
                errorMessage={errors.newPassword}
            />
             <Input
                placeholder="Repetir contraseña nueva"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showRepeatPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowRepeatPassword(!showRepeatPassword),
                }}
                onChange={(e)=>{onChange(e, "repeatPassword")}}
                errorMessage={errors.repeatPassword}
            />
            <Button 
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnStyle}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{errors.other}</Text>

        </View>
    );

}

const styles = StyleSheet.create({
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
    btnStyle: {
        backgroundColor: "#00a680",
    },
});

function initialData(){
    return ({
        password: "",
        newPassword: "",
        repeatPassword: "",
    });
}