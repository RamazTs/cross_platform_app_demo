import React, {useEffect, useState, useCallback} from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const History = props => {
  const [history, setHistory] = useState([]);

  // useEffect(() => {d
  //   loadDataFromAsyncStorage();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      loadDataFromAsyncStorage();
    }, [])
  );

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

  const clearDataFromAsyncStorage = async () => {
    Alert.alert(
      "Clear Data Confirmation",
      "Are you sure you want to permanently delete all questionnaire history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('questionnaireHistory');
              setHistory([]);
            } catch (exception) {
              console.log(exception);
            }
          }
        }
      ]
    );
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
      <Button title="Clear Data" onPress={clearDataFromAsyncStorage} />
      </ScrollView>
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
