import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions(props){

    const { userInfo, toastRef, setReloadUserInfo} = props;
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectedComponent = (key) => {
        switch (key) {
            case "NombreApellidos":
                setRenderComponent(
                    <ChangeDisplayNameForm 
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            case "Password":
                setRenderComponent(
                    <ChangePasswordForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
        setShowModal(true);
    }
    const menuOptions = optionsGenerate(selectedComponent);
    //console.log(menuOptions);
    return(
        <View>
            {
                menuOptions.map((menu, index) => (
                <ListItem
                    key={index}
                    bottomDivider
                    style={styles.listItem}
                    onPress={menu.onPress}
                >
                    <Icon name={menu.iconNameType} type={menu.iconType} color={menu.iconColorLeft}/>

                    <ListItem.Content>
                        <ListItem.Title>
                            {menu.title}
                        </ListItem.Title>
                    </ListItem.Content>
                    
                    <Icon name={menu.iconNameRight} type={menu.iconType} color={menu.iconColorRight}/>

                </ListItem>
                ))
            }
            { renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            )}
        </View>
    );
}

function optionsGenerate(selectedComponent) {
    return [
        {
            title: "Cambiar Nombre y Apellidos",
            iconType: "material-community",
            iconNameType: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("NombreApellidos"),
        },
        {
            title: "Cambiar Correo",
            iconType: "material-community",
            iconNameType: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("email"),
        },
        {
            title: "Cambiar Contraseña",
            iconType: "material-community",
            iconNameType: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("Password"),
        }
    ];
}

const styles = StyleSheet.create({
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
    },
});