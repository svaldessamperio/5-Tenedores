import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeDisplayNameForm(props){
    
    const {displayName, setShowModal, setReloadUserInfo} = props;
    const [newDisPlayName, setNewDisPlayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    
    useEffect(() => {
        if(displayName){
            setNewDisPlayName(displayName);
        }
    }, [])

    const onSubmit = () => {
        if(!newDisPlayName){
            setError("El nombre no puede ser vació");
        } else if (newDisPlayName === displayName){
            setError("El nombre no puede ser igual al anterior");
        } else {
            setIsLoading(true);
            const update = {
                displayName: newDisPlayName,
            }
            firebase
                .auth()
                .currentUser.updateProfile(update)
                .then(() => {
                    setIsLoading(false);
                    setReloadUserInfo(true);
                    setShowModal(false);
                })
                .catch(() => {
                    setError("Error al actualizar el nombre");
                });
            setError(null);
        }
    }

    return(
        <View style={styles.view}>
            <Input
                placeholder="Nombre y Apellidos"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2",
                }}
                defaultValue={displayName || ""}
                onChange={e => setNewDisPlayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button 
                title="Cambiar Nombre"
                style={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    );
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
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    },
});