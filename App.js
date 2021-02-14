import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { firebaseApp } from "./utils/firebase";
import Navigation from "./navigations/Navigation.js"

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  return (
    <Navigation/>
    );
}