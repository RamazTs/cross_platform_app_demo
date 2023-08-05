import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import History from './History/index';
import RecordDetails from '../components/RecordDetails';

const Stack = createStackNavigator();

const HistoryStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="RecordDetails" component={RecordDetails} />
    </Stack.Navigator>
  );
}

export default HistoryStackNavigator;