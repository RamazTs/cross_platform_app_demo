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
import HistoryStackNavigator from './views/HistoryStackNavigator';

const Tab = createBottomTabNavigator();

function App() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator>
      <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarButtonAccessibilityLabel: 'Home', // Listen for "Home"
            tabBarAccessibilityLabel: 'Go to Home tab', // Listen for "Go to Home tab"
          }}
        />
        <Tab.Screen name="History" component={HistoryStackNavigator} options={{headerShown: false,
            tabBarButtonAccessibilityLabel: 'History', // Listen for "History"
            tabBarAccessibilityLabel: 'Go to History tab', // Listen for "Go to History tab"
          }}
           />
        {/* <Tab.Screen
          name="History"
          children={() => <History history={[]} />}
        /> */}
        <Tab.Screen name="Questionnaire" children={() => <Questionnaire />}
        options={{
            tabBarButtonAccessibilityLabel: 'Questionnaire', // Listen for "Questionnaire"
            tabBarAccessibilityLabel: 'Go to Questionnaire tab', // Listen for "Go to Questionnaire tab"
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;
