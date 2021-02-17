import React from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { map } from "lodash";
import { Image } from "react-native";

export default function AccountOptions(props){

    const { userInfo, toastRef} = props;
    const menuOptions = optionsGenerate();

    //console.log(menuOptions);
    return(
        <View>
            {
                menuOptions.map((menu, index) => (
                <ListItem
                    key={index}
                    bottomDivider
                >
                    <Icon name={menu.iconNameType} type={menu.iconType} color={menu.iconColorLeft}/>

                    <ListItem.Content>
                        <ListItem.Title>
                            {menu.title}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                ))
            }
        </View>
    );
}

function optionsGenerate() {
    return [
        {
            title: "Cambiar Nombre y Apellidos",
            iconType: "material-community",
            iconNameType: "account-circle",
            iconColorLeft: "#ccc",
        },
        {
            title: "Cambiar Correo",
            iconType: "material-community",
            iconNameType: "at",
            iconColorLeft: "#ccc",
        },
        {
            title: "Cambiar Contraseña",
            iconType: "material-community",
            iconNameType: "lock-reset",
            iconColorLeft: "#ccc",
        }
    ];
}

const styles = StyleSheet.create({

});