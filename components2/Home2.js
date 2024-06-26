// // // // //こちらでは今までの月で計上された節約額の合計からギフトを送ったり、
// // // // //ご褒美を購入したりすることにより引き算の処理がなされます


import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/Firebase";
import {
  collection,
  addDoc,
  doc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { Header2 } from "./Header2";
import { Logout } from "../auth/Logout";
import { BuyGohoubi } from "./BuyGohoubi";
import { BuyItemsList } from "./BuyItemList";
import { TotalBuy } from "./TotalBuy";
import { totalCalc } from "./TotalExpense"; // totalCalc 関数をインポート

function Home2() {
  const [date, setDate] = useState(new Date());
  const [expenseItems, setExpenseItems] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTotal(currentUser.uid, date.getMonth() + 1, selectedYear); // ユーザー認証後に合計を取得
    }
  }, [date, selectedYear, currentUser]);

  const fetchTotal = async (uid, selectedMonth, selectedYear) => {
    try {
      const totalAmount = await totalCalc(uid, selectedMonth, selectedYear);
      setTotal(totalAmount);
    } catch (error) {
      console.error("Error calculating total amount:", error);
    }
  };
  
  



  const setPrevMonth = () => {
    setDate((prevDate) => {
      const prevMonth = prevDate.getMonth() - 1;
      const year =
        prevMonth === -1 ? prevDate.getFullYear() - 1 : prevDate.getFullYear();
      setSelectedYear(year);
      return new Date(year, prevMonth === -1 ? 11 : prevMonth, 1);
    });
  };

  const setNextMonth = () => {
    setDate((prevDate) => {
      const nextMonth = prevDate.getMonth() + 1;
      const year =
        nextMonth === 12 ? prevDate.getFullYear() + 1 : prevDate.getFullYear();
      setSelectedYear(year);
      return new Date(year, nextMonth === 12 ? 0 : nextMonth, 1);
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!currentUser) {
    console.error("User is not authenticated");
    return <Text>User is not authenticated</Text>;
  }

  const uid = currentUser.uid;

  const addExpense = async (text, amount, time) => {
    const docId = Math.random().toString(32).substring(2);
    const date = Timestamp.now();

    try {
      await addDoc(collection(db, "expenseItems"), {
        uid,
        text,
        amount,
        time, // 選んだ日付
        docId,
        date,
      });

      const newExpenseItem = { uid, text, amount, docId, date };
      setExpenseItems((prevItems) => [...prevItems, newExpenseItem]);
      console.log("Document written with ID: ", docId);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const deleteExpense = async (docId) => {
    try {
      await deleteDoc(doc(db, "expenseItems", docId));
      setExpenseItems((prevItems) =>
        prevItems.filter((item) => item.docId !== docId),
      );
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
    <View>
      <Header2
        date={date}
        setPrevMonth={setPrevMonth}
        setNextMonth={setNextMonth}
        selectedYear={selectedYear}
      />
      <TotalBuy expenseTotal={total} />
      <BuyGohoubi
        expenseItems={expenseItems}
        addExpense={addExpense}
        inputText={inputText}
        setInputText={setInputText}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        selectedMonth={date.getMonth() + 1}
        thisMonth={new Date().getMonth() + 1}
      />
      <Logout />
      <BuyItemsList
        deleteExpense={deleteExpense}
        expenseItems={expenseItems}
        selectedMonth={date.getMonth() + 1}
        selectedYear={selectedYear}
        thisMonth={new Date().getMonth() + 1}
        uid={uid}
      />
    </View>
  );
}

export default Home2;
