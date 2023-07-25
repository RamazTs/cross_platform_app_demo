import React, {useEffect, useState} from 'react';
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
    <View style={styles.container}>
      {history.length > 0 ? (
        history.map((histArray, i) => {
          return (
            <>
              {histArray.questions.map((q, indexQ) => {
                return (
                  <Text
                    style={styles.row}
                    key={histArray.timestamp + q.question + q.selected}>
                    {indexQ + 1 + '. '}
                    {q.question} : {q.selected}
                  </Text>
                );
              })}
            </>
          );
        })
      ) : (
        <Text>History Empty</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  row: {
    padding: 5,
    margin: 3,
  },
});

export default History;
