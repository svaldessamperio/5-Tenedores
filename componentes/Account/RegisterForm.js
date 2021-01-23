import React, { useState } from "react";
import {StyleSheet, View} from "react-native";
import { Input, Icon, Button} from "react-native-elements";

export default function RegisterForm(){
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPass, setshowRepeatPass] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());

    //console.log(formData);

    const onSubmit = () => {
        console.log(formData);
    }

    const onChange = (value, type) => {
        //console.log(value);
        //console.log(type);
        //setFormData({[type]: value});
        setFormData({...formData,[type]: value});
    }

    return (
        <View style={styles.formContainer}>
            <Input 
                placeholder = "Correo Electrónico"
                containerStyle = {styles.inputForm}
                onChangeText={ value => onChange(value,"email")}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder = "Contraseña"
                containerStyle = {styles.inputForm}
                onChangeText={ value => onChange(value,"password")}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline"  : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                     />
                }
            />
            <Input
                placeholder = "Repetir Contraseña"
                containerStyle = {styles.inputForm}
                onChangeText={ value => onChange(value,"RepeatPassword")}
                password={true}
                secureTextEntry={showRepeatPass ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showRepeatPass ? "eye-off-outline"  : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setshowRepeatPass(!showRepeatPass)}
                     />
                }
            />
            <Button 
                title="Unirse"
                style={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
        </View>
    );
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
        repeatPassword: "",
    };
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%",
    },
    btnRegister: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1",
    },
});