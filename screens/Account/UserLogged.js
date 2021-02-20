import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import Loading from "../../componentes/Loading";
import InfoUser from "../../componentes/Account/InfoUser";
import AccountOptions from "../../componentes/Account/AccountOptions";

export default function UserLogged(props){
    const toastRef = useRef();
    const [loading, setloading] = useState(false);
    const [loadingText, setloadingText] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [reloadUserInfo, setReloadUserInfo] = useState(true);

    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })();
        setReloadUserInfo(false);
    }, [reloadUserInfo]);

    return(
        <View style={styles.viewUserInfo}>
            {userInfo &&
                <InfoUser 
                    userInfo={userInfo} 
                    toastRef={toastRef} 
                    setLoading={setloading}
                    setLoadingText={setloadingText}
                />}
            <AccountOptions
                userInfo={userInfo} 
                toastRef={toastRef} 
                setReloadUserInfo={setReloadUserInfo}
            />
            <Button
                title="Cerrar Sesión" 
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast
                ref={toastRef}
                position="center" 
                opacity={0.9} 
                style={styles.toast}
            />
            <Loading isVisible={loading} text={loadingText}/>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo:{
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
        flex: 1
    },
    btnCloseSession:{
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#ffff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSessionText: {
        color: "#00a680"
    },
    toast:{
        backgroundColor: "red",
    },
});