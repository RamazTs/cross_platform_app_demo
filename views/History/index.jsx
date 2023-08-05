import React, {useEffect, useState, useCallback} from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();

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
        history.slice(0).reverse().map((histData, i) => (
          <TouchableOpacity 
            key={i} 
            style={styles.recordItem} 
            onPress={() => navigation.navigate('RecordDetails', { recordData: histData })}
          >
            <Text style={styles.recordText}>Record {history.length - i} ({histData.timestamp})</Text>
          </TouchableOpacity>
        ))
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
  recordItem: {
    padding: 7,  
    backgroundColor: '#d3d3d3',
    margin: 6,   
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: '#000'
  },
  recordText: {
    fontSize: 16,  
  },
});

export default History;
