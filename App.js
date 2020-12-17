import React, { useEffect } from "react";
import Navigation from "./navigations/Navigation.js"
import { firebaseApp } from "./utils/firebase";


export default function App() {
  return (
    <Navigation/>
    );
}