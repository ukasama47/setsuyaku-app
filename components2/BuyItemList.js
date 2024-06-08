import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ExpenseItem from "./ExpenseItem"; // パスが正しいことを確認してください
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/Firebase"; // パスが正しいことを確認してください

export const BuyItemsList = ({
  deleteExpense,
  selectedMonth,
  thisMonth,
  uid,
}) => {
  const [expenseItems, setExpenseItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // 支出項目を取得し、リアルタイム更新にサブスクライブする関数
    const fetchExpenses = () => {
      // uidでフィルタリングするためのクエリを作成
      const q = query(collection(db, "expenseItems"), where("uid", "==", uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const expenses = [];
        snapshot.forEach((doc) => {
          expenses.push({ ...doc.data(), docId: doc.id });
        });

        // 日付で支出項目をソート（expenseItem.timeがFirestoreのTimestampであることを仮定）
        expenses.sort((a, b) => b.time.seconds - a.time.seconds);

        setExpenseItems(expenses);
        setLoading(false);
      });

      // コンポーネントがアンマウントされるときにリアルタイム更新のサブスクライブを解除するクリーンアップ関数
      return unsubscribe;
    };

    // fetchExpenses関数を呼び出してデータの取得と更新のサブスクライブを開始
    fetchExpenses();
  }, [uid]); // uidが変更されたときにのみ実行

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        支出一覧
      </Text>
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
      >
        {expenseItems.length === 0 ? (
          <Text style={styles.noExpensesText}>何も買ってないよ</Text>
        ) : (
          expenseItems.map((expenseItem) => (
            <ExpenseItem
              key={expenseItem.docId}
              deleteExpense={deleteExpense}
              expenseText={expenseItem.text}
              expenseAmount={expenseItem.amount}
              expenseTime={expenseItem.time}
              expenseItem={expenseItem}
              selectedMonth={selectedMonth}
              thisMonth={thisMonth}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  contentContainer: {
    paddingBottom: 80, // 必要に応じて調整
  },
  noExpensesText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});




// // import { View, Text, ScrollView, StyleSheet } from "react-native";
// // import ExpenseItem from "./ExpenseItem"; // Ensure the path is correct
// // import { collection, onSnapshot } from "firebase/firestore";
// // import { db } from "../firebase/Firebase"; // Ensure the path is correct

// // export const BuyItemsList = ({
// //   deleteExpense,
// //   selectedMonth,
// //   thisMonth,
// // }) => {
// //   const [expenseItems, setExpenseItems] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const scrollViewRef = useRef(null);

// //   useEffect(() => {
// //     // Function to fetch expenses and subscribe to realtime updates
// //     const fetchExpenses = () => {
// //       const unsubscribe = onSnapshot(
// //         collection(db, "expenseItems"),
// //         (snapshot) => {
// //           const expenses = [];
// //           snapshot.forEach((doc) => {
// //             expenses.push({ ...doc.data(), docId: doc.id });
// //           });

// //           // Sort expenses by date (assuming expenseItem.time is a Firestore Timestamp)
// //           expenses.sort((a, b) => b.time.seconds - a.time.seconds);

// //           setExpenseItems(expenses);
// //           setLoading(false);

// //         }
// //       );

// //       // Cleanup function to unsubscribe from realtime updates when component unmounts
// //       return unsubscribe;
// //     };

// //     // Call the fetchExpenses function to start fetching data and subscribing to updates
// //     fetchExpenses();
// //   }, []); // Only run once when the component mounts

// //   if (loading) {
// //     return <Text>Loading...</Text>;
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
// //         支出一覧
// //       </Text>
// //       <ScrollView
// //         style={styles.scrollView}
// //         ref={scrollViewRef}
// //         contentContainerStyle={styles.contentContainer}
// //       >
// //         {expenseItems.length === 0 ? (
// //           <Text style={styles.noExpensesText}>何も買ってないよ</Text>
// //         ) : (
// //           expenseItems.map((expenseItem) => (
// //             <ExpenseItem
// //               key={expenseItem.docId}
// //               deleteExpense={deleteExpense}
// //               expenseText={expenseItem.text}
// //               expenseAmount={expenseItem.amount}
// //               expenseTime={expenseItem.time}
// //               expenseItem={expenseItem}
// //               selectedMonth={selectedMonth}
// //               thisMonth={thisMonth}
// //             />
// //           ))
// //         )}
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     height: 300,
// //   },
// //   contentContainer: {
// //     paddingBottom: 80, // Adjust as needed
// //   },
// //   noExpensesText: {
// //     fontSize: 16,
// //     color: "#888",
// //     textAlign: "center",
// //     marginTop: 20,
// //     fontStyle: "italic",
// //   },
// // });

// // // import React, { useEffect, useState, useRef } from "react";
// // // import { View, Text, ScrollView, StyleSheet } from "react-native";
// // // import ExpenseItem from "./ExpenseItem"; // Ensure the path is correct
// // // import { collection, onSnapshot } from "firebase/firestore";
// // // import { db } from "../firebase/Firebase"; // Ensure the path is correct

// // // export const BuyItemsList = ({ deleteExpense, selectedMonth, thisMonth }) => {
// // //   const [expenseItems, setExpenseItems] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const scrollViewRef = useRef(null);

// // //   useEffect(() => {
// // //     // Function to fetch expenses and subscribe to realtime updates
// // //     const fetchExpenses = () => {
// // //       const unsubscribe = onSnapshot(
// // //         collection(db, "expenseItems"),
// // //         (snapshot) => {
// // //           const expenses = [];
// // //           snapshot.forEach((doc) => {
// // //             expenses.push({ ...doc.data(), docId: doc.id });
// // //           });

// // //           // Sort expenses by date (assuming expenseItem.time is a Firestore Timestamp)
// // //           expenses.sort((a, b) => b.time.seconds - a.time.seconds);

// // //           setExpenseItems(expenses);
// // //           setLoading(false);

// // //           // Scroll to bottom when new content is added
// // //           scrollViewRef.current.scrollToEnd({ animated: false });
// // //         }
// // //       );

// // //       // Cleanup function to unsubscribe from realtime updates when component unmounts
// // //       return unsubscribe;
// // //     };

// // //     // Call the fetchExpenses function to start fetching data and subscribing to updates
// // //     fetchExpenses();
// // //   }, []); // Only run once when the component mounts

// // //   if (loading) {
// // //     return <Text>Loading...</Text>;
// // //   }

// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
// // //         支出一覧
// // //       </Text>
// // //       <ScrollView
// // //         style={styles.scrollView}
// // //         ref={scrollViewRef}
// // //         contentContainerStyle={styles.contentContainer}
// // //       >
// // //         {expenseItems.length === 0 ? (
// // //           <Text style={styles.noExpensesText}>何も買ってないよ</Text>
// // //         ) : (
// // //           expenseItems.map((expenseItem) => (
// // //             <ExpenseItem
// // //               key={expenseItem.docId}
// // //               deleteExpense={deleteExpense}
// // //               expenseText={expenseItem.text}
// // //               expenseAmount={expenseItem.amount}
// // //               expenseTime={expenseItem.time}
// // //               expenseItem={expenseItem}
// // //               selectedMonth={selectedMonth}
// // //               thisMonth={thisMonth}
// // //             />
// // //           ))
// // //         )}
// // //       </ScrollView>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     paddingBottom: 80,

// // //   },
// // //   scrollView: {
// // //     flexGrow: 1,
// // //   },
// // //   contentContainer: {
// // //     paddingBottom: 80, // Adjust as needed
// // //   },
// // //   noExpensesText: {
// // //     fontSize: 16,
// // //     color: "#888",
// // //     textAlign: "center",
// // //     marginTop: 20,
// // //     fontStyle: "italic",
// // //   },
// // // });
