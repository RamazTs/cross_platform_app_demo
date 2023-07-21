import {useState} from 'react';
import {useColorScheme} from 'react-native';
import {
  createBottomTabNavigator,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Home from './views/Home';
import History from './views/History';
import Questionnaire from './views/Questionnaire/index';

const Tab = createBottomTabNavigator();

function App() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator>
        <Tab.Screen
          name="History"
          children={() => <History history={[]} />}
        />
        <Tab.Screen name="Questionnaire" children={() => <Questionnaire />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;
