import React, {useState, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FitbitDataComponent from '../../components/FitbitDataComponent';

const Home = () => {
  const [alertEnabled, setAlertEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkQuestionnaireLimit = async () => {
        if (alertEnabled) {
          const questionnaires = await AsyncStorage.getItem('questionnaireHistory');
          const questionnairesParsed = questionnaires ? JSON.parse(questionnaires) : [];
          if (questionnairesParsed.length >= 3) {
            Alert.alert("File Limit Reached", "You have reached the limit of stored questionnaires. Please clear some data.");
          }
        }
      };

      checkQuestionnaireLimit();
    }, [alertEnabled])
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.welcomeText}>Health App</Text>
        <TouchableOpacity
          style={styles.alertButton}
          onPress={() => setAlertEnabled(!alertEnabled)}
        >
          <Text style={styles.alertButtonText}>
            {alertEnabled ? 'Disable' : 'Enable'} Alerts
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Home;