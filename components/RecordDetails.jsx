import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

const RecordDetails = ({ route }) => {
  const { recordData } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text>Questionnaire completed at: {recordData.timestamp}</Text>
      <Text>Temperature: {recordData.weather.temperature} °F</Text>
      <Text>Weather: {recordData.weather.description}</Text>
      <Text>Location: {recordData.weather.city}, {recordData.weather.country}</Text>
      {recordData.questions.map((q, indexQ) => (
        <Text key={indexQ} style={styles.row}>
          {indexQ + 1 + '. '}
          {q.question} : {q.selected}
        </Text>
      ))}
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

export default RecordDetails;