// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Voice from '@react-native-community/voice';

// const Home = props => {
//   const {setHistory} = props;
//   const [result, setResult] = useState('');
//   const [isLoading, setLoading] = useState(false);
//   const [alertEnabled, setAlertEnabled] = useState(false);

//   const speechStartHandler = e => {
//     console.log('speechStart successful', e);
//   };

//   const speechEndHandler = e => {
//     setLoading(false);
//     console.log('stop handler', e);
//   };

//   const speechResultsHandler = e => {
//     const text = e.value[0];
//     setResult(text);
//   };

//   const startRecording = async () => {
//     setLoading(true);
//     try {
//       await Voice.start('en-Us');
//     } catch (error) {
//       console.log('error', error);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await Voice.stop();
//       setLoading(false);
//     } catch (error) {
//       console.log('error', error);
//     }
//   };

//   const clear = () => {
//     setResult('');
//   };

//   const checkStorageLimit = async () => {
//     const history = await AsyncStorage.getItem('questionnaireHistory');
//     const historyParsed = history ? JSON.parse(history) : [];
//     if (historyParsed.length >= 15 && alertEnabled) {
//       Alert.alert(
//         "Storage Limit",
//         "Please clear data, the maximum number of questionnaires is approaching",
//       );
//     }
//   };

//   const save = () => {
//     if (result.length === 0) return;
//     console.log(`Saving: ${result}`);
//     setHistory(state => [...state, result]);
//     setResult('');
//     checkStorageLimit();
//   };

//   useEffect(() => {
//     Voice.onSpeechStart = speechStartHandler;
//     Voice.onSpeechEnd = speechEndHandler;
//     Voice.onSpeechResults = speechResultsHandler;
//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);


// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
// //       <View style={styles.container}>
// //         <SafeAreaView>
// //           <Text style={styles.headingText}>Voice to Text Recognition</Text>
// //           <View style={styles.textInputStyle}>
// //             <TextInput
// //               value={result}
// //               multiline={true}
// //               placeholder="say something!"
// //               style={{
// //                 flex: 1,
// //                 height: '100%',
// //               }}
// //               onChangeText={text => setResult(text)}
// //             />
// //           </View>
// //           <View style={styles.btnContainer}>
// //             <TouchableOpacity
// //               onLongPress={startRecording}
// //               onPressOut={stopRecording}
// //               style={styles.speak}>
// //               <Text style={{color: 'white', fontWeight: 'bold'}}>Speak</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.save} onPress={save}>
// //               <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
// //             </TouchableOpacity>
// //           </View>
// //           <TouchableOpacity style={styles.clear} onPress={clear}>
// //             <Text style={{color: 'white', fontWeight: 'bold'}}>Clear</Text>
// //           </TouchableOpacity>
// //         </SafeAreaView>
// //       </View>
// //     </TouchableWithoutFeedback>
// //   );
// // };

// return (
//   <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//     <View style={styles.container}>
//       <SafeAreaView>
//         <Text style={styles.headingText}>Voice to Text Recognition</Text>
//         <TouchableOpacity
//           style={styles.enableAlertButton}
//           onPress={() => setAlertEnabled(!alertEnabled)}
//         >
//           <Text style={{color: 'white', fontWeight: 'bold'}}>
//             {alertEnabled ? 'Disable' : 'Enable'} Storage Limit Alert
//           </Text>
//         </TouchableOpacity>
//         <View style={styles.textInputStyle}>
//           <TextInput
//             value={result}
//             multiline={true}
//             placeholder="say something!"
//             style={{
//               flex: 1,
//               height: '100%',
//             }}
//             onChangeText={text => setResult(text)}
//           />
//         </View>
//         <View style={styles.btnContainer}>
//           <TouchableOpacity
//             onLongPress={startRecording}
//             onPressOut={stopRecording}
//             style={styles.speak}>
//             <Text style={{color: 'white', fontWeight: 'bold'}}>Speak</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.save} onPress={save}>
//             <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.clear} onPress={clear}>
//           <Text style={{color: 'white', fontWeight: 'bold'}}>Clear</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </View>
//   </TouchableWithoutFeedback>
// );
// };

// const styles = StyleSheet.create({
//   container: {  
//     backgroundColor: '#fff',
//     padding: 24,
//   },
//   headingText: {
//     alignSelf: 'center',
//     marginVertical: 26,
//     fontWeight: 'bold',
//     fontSize: 26,
//   },
//   textInputStyle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     height: 300,
//     borderRadius: 20,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     shadowOffset: {width: 0, height: 1},
//     shadowRadius: 2,
//     elevation: 2,
//     shadowOpacity: 0.4,
//   },
//   speak: {
//     backgroundColor: 'black',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 8,
//     borderRadius: 8,
//   },
//   stop: {
//     backgroundColor: 'red',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 8,
//     borderRadius: 8,
//   },
//   save: {
//     backgroundColor: 'blue',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 8,
//     borderRadius: 8,
//   },
//   clear: {
//     backgroundColor: 'black',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 15,
//   },
//   btnContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     with: '50%',
//     justifyContent: 'space-evenly',
//     marginTop: 24,
//   },
// });
// export default Home;


import React, {useState, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <Text style={styles.welcomeText}>Welcome to the Questionnaire App</Text>
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