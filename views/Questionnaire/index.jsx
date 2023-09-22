import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import {Component} from 'react';
import Question from '../../components/Question/Question.jsx';
import QuestionService from '../../services/QuestionService.js';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastRecognitionTimestamp: null, 
      isStarted: false,
      isEnded: false,
      questionIndex: 0,
      completedQuestions: [],
      locationData: null,
      ttsState: 'initilizing',
      ignoreVoiceResults: false,
      numbersInWords: {
        one: 1,
        to: 2,
        too: 2,
        two: 2,
        three: 3,
        four: 4,
        for: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
      },
    };
    this.debounceTimer = null;         
    this.found_2 = false;  
  }

  getWeather = async (lat, lon) => {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0bb2954984e58b4696605e92623b8626`,
    );
    const weatherData = await weatherResponse.json();
    return {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: (((weatherData.main.temp - 273.15) * 9) / 5 + 32).toFixed(2),
      description: weatherData.weather[0].description,
    };
  };

  saveDataToAsyncStorage = async () => {
    if (this.state.completedData) {
      const history = await AsyncStorage.getItem('questionnaireHistory');
      const newHistory = history ? JSON.parse(history) : [];
      newHistory.push(this.state.completedData);
      if (newHistory.length > 3) {
        // Check for more than 3 saved questionnaires
        Alert.alert(
          'File Limit Reached',
          'You have reached the limit of stored questionnaires. If you save this data, the oldest questionnaire will be replaced.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                newHistory.shift(); // Remove the oldest questionnaire from the start
                await AsyncStorage.setItem(
                  'questionnaireHistory',
                  JSON.stringify(newHistory),
                );
              },
            },
          ],
        );
      } else {
        await AsyncStorage.setItem(
          'questionnaireHistory',
          JSON.stringify(newHistory),
        );
      }
    } else {
      console.log('No completed questionnaire data to save');
    }
  };

  getGeoLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition((info, error) => {
        if (error) {
          return reject(error);
        }
        return resolve(info);
      });
    });
  };

  startQuestionnaireHandler = () => {
    this.setState(
      {
        questionIndex: 0,
        completedQuestions: [],
        isEnded: false,
        isStarted: true,
      },
      this.readQuestion.bind(this),
    );
  };

  readQuestion = () => {
    const { question, answers } = this.state.question_obj;

    const text = 'Question ' + (this.state.questionIndex + 1) + '. ' + question + '; ';

    let ans;
    if (this.state.questionIndex === 0) {
      ans = answers.join('. ');
    } else {
        // For subsequent questions, just read the numbers of the answer choices
        ans = answers
            .map((_, index) => {
                return + (index + 1);
            })
            .join('. ');
    }
      
    Tts.speak(text + ans);
};
  // readQuestion = () => {
  //   const {question, answers} = this.state.question_obj;

  //   const text =
  //     'Question ' + (this.state.questionIndex + 1) + '. ' + question + '; ';

  //     const ans = answers
  //     .map((ans, index) => {
  //       return 'Answer ' + (index + 1) + ': ' + ans;
  //     })
  //     .join('. ');
      
  //   Tts.speak(text + ans);
  // };

  updateIndex = async () => {
    await Tts.stop();
    const newIndex = this.state.questionIndex + 1;
    if (newIndex === this.state.QUESTIONS.length) {
      let geoLocation, weatherData;
      try {
        geoLocation = await this.getGeoLocation();
        weatherData = await this.getWeather(
          geoLocation.coords.latitude,
          geoLocation.coords.longitude,
        );
      } catch (error) {
        // TODO: HANDLE ERROR
        console.log(error);
      }
      // Store completed questionnaire and location/weather data in the state
      const completedData = {
        questions: this.state.completedQuestions,
        timestamp: new Date().toLocaleString(),
        weather: weatherData,
      };
      this.setState({
        isEnded: true,
        question_obj: this.state.QUESTIONS[0],
        questionIndex: 0,
        completedData: {
          questions: this.state.completedQuestions,
          timestamp: new Date().toLocaleString(),
          weather: weatherData,
        },
      });
      return;
    }

    this.setState(
      {
        questionIndex: newIndex,
        question_obj: this.state.QUESTIONS[newIndex],
      },
      this.readQuestion.bind(this),
    );
  };

  viewStoredData = async () => {
    const history = await AsyncStorage.getItem('questionnaireHistory');
    console.log(JSON.parse(history));
  };

  selectAnswerHandler = async (question, answers, selected) => {
    await this.stopRecording();
    answ_obj = {question, answers, selected};
    this.setState({
      completedQuestions: [...this.state.completedQuestions, answ_obj],
    });
  };

  speechStartHandler = e => {
    console.log('speechStart successful');
  };

  speechResultsHandler = async e => {
    console.log(e);

    // Check for debounce
    const currentTimestamp = Date.now();
    if (this.state.lastRecognitionTimestamp && currentTimestamp - this.state.lastRecognitionTimestamp < 1000) {
        // If it's been less than a second since the last recognition, return
        return;
    }

    this.setState({ lastRecognitionTimestamp: currentTimestamp });  // Update the timestamp

    if (this.found_2 || this.state.ignoreVoiceResults) return;
    const {question, answers} = this.state.question_obj;
    const text = e.value[0];
    if (!text) return;
    const words = text.split(' ');

    // Check each word for a number
    let numberOrWord = null;
    for (let word of words) {
        word = word.toLowerCase();
        if (this.state.numbersInWords[word]) {
            numberOrWord = this.state.numbersInWords[word];
            break;
        } else if (!isNaN(parseInt(word, 10))) {
            numberOrWord = parseInt(word, 10);
            break;
        }
    }

    // Check if the recognized number or word corresponds to an answer
    if (numberOrWord && numberOrWord <= answers.length) {
        this.found_2 = true;
        console.log('FOUND FOUND FOUND');
        await this.selectAnswerHandler(
            question,
            answers,
            answers[numberOrWord - 1],
        );
        await this.updateIndex();
        this.found_2 = false;   // Reset the flag after processing
        return;
    }
};

//   speechResultsHandler = async e => {
//     console.log(e);
//     if (this.found_2 || this.state.ignoreVoiceResults) return;
//     const {question, answers} = this.state.question_obj;
//     const text = e.value[0];
//     if (!text) return;
//     const words = text.split(' ');
//     let numberOrWord = words[words.length - 1].toLowerCase();

//     // Check if it's a word and map it to the number
//     if (this.state.numbersInWords[numberOrWord]) {
//       numberOrWord = this.state.numbersInWords[numberOrWord];
//     } else {
//       numberOrWord = parseInt(numberOrWord, 10);
//     }

//     // Check if the recognized number or word corresponds to an answer
//     if (numberOrWord && numberOrWord <= answers.length) {
//       this.found_2 = true;
//       console.log('FOUND FOUND FOUND');
//       await this.selectAnswerHandler(
//         question,
//         answers,
//         answers[numberOrWord - 1],
//       );
//       await this.updateIndex();
//       return;
//     }
// };

startRecording = () => {
  return new Promise((resolve, reject) => {
      this.found_2 = false;   // Reset the flag before starting recognition
      this.setState({ ignoreVoiceResults: false }, () =>
          Voice.start('en-Us')
              .then(started => resolve(started))
              .catch(error => reject(error)),
      );
  });
};

  // startRecording = () => {
  //   return new Promise((resolve, reject) => {
  //     this.setState({ignoreVoiceResults: false}, () =>
  //       Voice.start('en-Us')
  //         .then(started => resolve(started))
  //         .catch(error => reject(error)),
  //     );
  //   });
  // };

  stopRecording = () => {
    return new Promise((resolve, reject) => {
      this.setState({ignoreVoiceResults: true}, () => {
        console.log('Stopping Recording');
        Voice.stop()
          .then(stopped => {
            console.log('Recording stopped...');
            resolve(stopped);
          })
          .catch(error => reject(error));
      });
    });
  };

  ttsStartHandler = async event => {
    this.setState({
      ttsState: 'started',
      ignoreVoiceResults: true,
    });
    this.found_2 = false;
  };

  ttsFinishHandler = event => {
    this.setState({
      ttsState: 'finished',
      ignoreVoiceResults: false,
    });
    this.startRecording();
  };

  ttsCancelHandler = event => {
    this.setState({
      ttsState: 'cancelled',
    });
    this.stopRecording();
  };

  speechEnd = () => {
    console.log('Speech End');
  };

  componentDidMount() {
    console.log('COMPONENT MOUNTED');
    const questionService = new QuestionService();
    questionService.fetchQuestions().then(questions => {
      this.setState(
        {
          QUESTIONS: questions,
          question_obj: questions[0],
        },
        () => {
          Voice.onSpeechStart = this.speechStartHandler.bind(this);
          if (Platform.OS != 'ios')
            Voice.onSpeechResults = this.speechResultsHandler.bind(this);
          Voice.onSpeechPartialResults = this.speechResultsHandler.bind(this);
          Voice.onSpeechEnd = this.speechEnd.bind(this);
          Tts.getInitStatus().then(
            _ => {
              Tts.setDucking(true);
              Tts.addEventListener(
                'tts-start',
                this.ttsStartHandler.bind(this),
              );
              Tts.addEventListener(
                'tts-finish',
                this.ttsFinishHandler.bind(this),
              );
              Tts.addEventListener(
                'tts-cancel',
                this.ttsCancelHandler.bind(this),
              );
            },
            err => {
              if (err.code === 'no_engine') {
                Tts.requestInstallEngine();
              }
            },
          );
        },
      );
    });
  }

  componentWillUnmount() {
    Tts.stop();
    Voice.destroy().then(Voice.removeAllListeners);
  }

  render() {
    return (
      <View
        style={
          this.state.isStarted
            ? this.styles.containerQuestion
            : this.styles.containerStart
        }>
        {!this.state.isStarted ? (
          <TouchableOpacity
            onPress={this.startQuestionnaireHandler}
            style={this.styles.start}
            accessibilityLabel='Begin questionnaire'>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Begin Questionnaire
            </Text>
          </TouchableOpacity>
        ) : this.state.isEnded && this.state.completedData ? (
          <ScrollView>
            <Text>
              {' '}
              Questionnaire completed at: {this.state.completedData.timestamp}
            </Text>
            <Text>
              {' '}
              Temperature: {this.state.completedData.weather.temperature} °F
            </Text>
            <Text>
              {' '}
              Weather: {this.state.completedData.weather.description}
            </Text>
            <Text>
              {' '}
              Location: {this.state.completedData.weather.city},{' '}
              {this.state.completedData.weather.country}
            </Text>
            {this.state.completedData.questions.map((q, indexQ) => {
              return (
                <Text
                  key={q.question + '-' + q.selected}
                  style={{marginBottom: 5}}>
                  {indexQ + 1 + '. '}
                  {q.question} : {q.selected}
                </Text>
              );
            })}
            <TouchableOpacity
              onPress={this.startQuestionnaireHandler}
              accessibilityLabel='Restart'
              style={{...this.styles.start, marginTop: 20}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Restart Questionnaire
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.saveDataToAsyncStorage();
                this.viewStoredData();
              }}
              accessibilityLabel='save'
              style={{...this.styles.start, marginTop: 20}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Save Data
              </Text>
            </TouchableOpacity>
          </ScrollView>
        ) : this.state.question_obj ? (
          <Question
            questionIndex={this.state.questionIndex}
            question_obj={this.state.question_obj}
            selectAnswerHandler={this.selectAnswerHandler}
            updateIndex={this.updateIndex}
          />
        ) : undefined}
      </View>
    );
  }

  styles = {
    containerStart: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
    },
    containerQuestion: {
      padding: 24,
    },
    start: {
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      borderRadius: 8,
    },
  };
}

export default Questionnaire;
