

import { db } from "../firebase/Firebase";
import { Header } from "./Header";
import { Balance } from "./Balance";
import AddSavingForm from './AddSavingForm';
import GoalAmountForm from "./GoalAmountForm";
import { AddItems } from "./AddItems";
import { SaveItemsList } from "./SaveItemList";

import {
  collection,
  addDoc,
  doc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { totalCalc } from "./TotalSave";
//import { AuthContext } from "../auth/AuthProvider";
import { Logout } from "../auth/Logout";
import firebase from "firebase/app";
import "firebase/firestore";
import { getAuth, onAuthStateChanged } from "@firebase/auth";


function Home() {
  const [date, setDate] = useState(new Date());
  const [saveItems, setSaveItems] = useState([]);
  //const [expenseItems, setExpenseItems] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  //const [type, setType] = useState("inc");

  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true); // 新しい状態を追加

 useEffect(() => {
   const auth = getAuth();
   const unsubscribe = onAuthStateChanged(auth, (user) => {
     if (user) {
       setCurrentUser(user);
     } else {
       setCurrentUser(null);
     }
     setLoading(false); // ロード完了
   });

   return () => unsubscribe();
 }, []);
  // const { currentUser } = useContext(AuthContext);




    // useEffect(() => {
    //   getSaveData();
      
    // }, []);

    // useEffect(() => {
    //   getSaveData();
      
    // }, [date]);



  //for Header
  const setPrevMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() - 1;
    const day = date.getDate();
    setDate(new Date(year, month, day));
  };

  const setNextMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    setDate(new Date(year, month, day));
  };

  //get first date of the month
  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  //get last date of this month
  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  //operate add form and income/expense list
  const selectedMonth = date.getMonth() + 1;
  const today = new Date();
  const thisMonth = today.getMonth() + 1;
  const saveTotal = totalCalc(saveItems);

  
  if (loading) {
    return <Text>Loading...</Text>;
  }
  
  // uidのために直したい
  if (!currentUser) {
    console.error("User is not authenticated");
    return;
  }
  const uid = currentUser.uid;
  // uidのために直したい　ここまで

  // ここから　home2より
  
  const addSave = async (text, amount, time) => {
    const docId = Math.random().toString(32).substring(2);
    const date = Timestamp.now();    
    try {
      await addDoc(collection(db, "saveItems"), {
        uid,
        text,
        amount,
        time,
        docId,
        date,
      });

      const newSaveItem = { uid, text, amount, docId, date };
      setSaveItems((prevItems) => [...prevItems, newSaveItem]);
      console.log("Document written with ID: ", docId);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  //できてる
  const deleteSave = async (docId) => {
    try {
      await deleteDoc(doc(db, "saveItems", docId));
      setSaveItems((prevItems) =>
        prevItems.filter((item) => item.docId !== docId)
      );
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  // ここまで　home2より

  return (
    <View>
      <View>
        <Header
          date={date}
          setPrevMonth={setPrevMonth}
          setNextMonth={setNextMonth}
        />
        
        <GoalAmountForm
        />
        <Balance 
          saveTotal={saveTotal}  
        />

        <AddItems
          saveItems={saveItems}
          addSave={addSave}
          inputText={inputText}
          setInputText={setInputText}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          selectedMonth={selectedMonth}
          thisMonth={thisMonth}
        />

        {/* <AddSavingForm
        /> */}

        <SaveItemsList
          deleteSave={deleteSave}
          saveItems={saveItems}
          selectedMonth={selectedMonth}
          thisMonth={thisMonth}
          uid={uid}
        />
      </View>
    </View>
  );
}
export default Home;
