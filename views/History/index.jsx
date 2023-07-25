import React, {useEffect, useState} from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const History = props => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadDataFromAsyncStorage();
  }, []);

  const loadDataFromAsyncStorage = async () => {
    try {
      let historyJson = await AsyncStorage.getItem('questionnaireHistory');
      if (historyJson) {
        console.log(JSON.parse(historyJson));
        setHistory(JSON.parse(historyJson));
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {history.length > 0 ? (
        history.slice(0).reverse().map((histData, i) => {
          return (
            <View key={i}>
              <Text>Questionnaire completed at: {histData.timestamp}</Text>
              <Text>Temperature: {histData.weather.temperature} °F</Text>
              <Text>Weather: {histData.weather.description}</Text>
              <Text>Location: {histData.weather.city}, {histData.weather.country}</Text>
              {histData.questions.map((q, indexQ) => {
                return (
                  <Text
                    key={indexQ}
                    style={styles.row}>
                    {indexQ + 1 + '. '}
                    {q.question} : {q.selected}
                  </Text>
                );
              })}
            </View>
          );
        })
      ) : (
        <Text>History Empty</Text>
      )}
      </ScrollView>
  );
      };

//   return (
//     <View style={styles.container}>
//       {history.length > 0 ? (
//         history.map((histArray, i) => {
//           return (
//             <>
//               {histArray.questions.map((q, indexQ) => {
//                 return (
//                   <Text
//                     style={styles.row}
//                     key={histArray.timestamp + q.question + q.selected}>
//                     {indexQ + 1 + '. '}
//                     {q.question} : {q.selected}
//                   </Text>
//                 );
//               })}
//             </>
//           );
//         })
//       ) : (
//         <Text>History Empty</Text>
//       )}
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {},
  row: {
    padding: 5,
    margin: 3,
  },
});

export default History;
