import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
const History = props => {
  const {history} = props;
  return (
      <View style={styles.container}>
        {history.length > 0 ? (
          history.map((histArray, i) => {
            return <>
              <Text key={histArray.timestamp}> Questionaire completed at: {histArray.timestamp}</Text>
              <Text> Temperature: {histArray.weather.temperature} °F</Text>
              <Text> Weather: {histArray.weather.description}</Text>
              <Text> Location: {histArray.weather.city}, {histArray.weather.country}</Text>
            {histArray.completedQuestions.map((q, indexQ) => {
              return <Text style={styles.row}
              key={histArray.timestamp + q.question + q.selected}
                 >
              {indexQ + 1 + '. '}
                  {q.question} : {q.selected}
            </Text>
            })}
            </>
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
