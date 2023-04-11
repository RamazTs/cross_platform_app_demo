import {useState, useEffect} from 'react';
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {history.length > 0 ? (
          history.map((h, i) => (
            <Text style={styles.row} key={i}>
              {h}
            </Text>
          ))
        ) : (
          <Text>History Empty</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
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
