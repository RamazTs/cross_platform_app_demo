import {View, Text, Button, TouchableOpacity, Platform} from 'react-native';
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
  }

  getWeather = async (lat, lon) => {
    const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=0bb2954984e58b4696605e92623b8626`,
    );
    if (!response.ok) {
      throw new Error('OpenWeather API request failed');
    }
    const locationData = await response.json();

    const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0bb2954984e58b4696605e92623b8626`
    );
    const weatherData = await weatherResponse.json();

    return {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: ((weatherData.main.temp - 273.15) * 9/5 + 32).toFixed(2), 
      description: weatherData.weather[0].description,
    };
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
    const {question, answers} = this.state.question_obj;

    const text =
      'Question ' + (this.state.questionIndex + 1) + '. ' + question + '; ';

    const ans = answers
      .map((ans, index) => {
        if (this.state.questionIndex == 0) return index + 1 + ', ' + ans;
        return index + 1 + ', ';
      })
      .join();
    Tts.speak(text + ans);
  };

updateIndex = async () => {
  await Tts.stop();
  const newIndex = this.state.questionIndex + 1;
  if (newIndex === this.state.QUESTIONS.length) {
    const geoLocation = await this.getGeoLocation();
    const weatherData = await this.getWeather(
      geoLocation.coords.latitude,
      geoLocation.coords.longitude,
    );

    // Store completed questionnaire and location/weather data in the state
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
}

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
    if (this.found_2 || this.state.ignoreVoiceResults) return;
    const {question, answers} = this.state.question_obj;
    const text = e.value[0];
    const words = text.split(' ');
    const number = words[words.length - 1].toLowerCase();
    if (
      this.state.numbersInWords[number] &&
      this.state.numbersInWords[number] <= answers.length
    ) {
      this.found_2 = true;
      console.log('FOUND FOUND FOUND');
      await this.selectAnswerHandler(
        question,
        answers,
        answers[this.state.numbersInWords[number] - 1],
      );
      await this.updateIndex();
      return;
    } else {
      for (const answ of answers) {
        if (text.toLowerCase().includes(answ.toLowerCase())) {
          this.found_2 = true;
          console.log('FOUND FOUND FOUND');
          await this.selectAnswerHandler(question, answers, answ);
          await this.updateIndex();
          return;
        }
      }
    }
  };

  startRecording = () => {
    return new Promise((resolve, reject) => {
      this.setState({ignoreVoiceResults: false}, () =>
        Voice.start('en-Us')
          .then(started => resolve(started))
          .catch(error => reject(error)),
      );
    });
  };

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
    });
    this.found_2 = false;
  };

  ttsFinishHandler = event => {
    this.setState({
      ttsState: 'finished',
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
            style={this.styles.start}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Start The Questionnaire
            </Text>
          </TouchableOpacity>
        ) : this.state.isEnded && this.state.completedData ? (
          <>
            <Text> Questionnaire completed at: {this.state.completedData.timestamp}</Text>
            <Text> Temperature: {this.state.completedData.weather.temperature} °F</Text>
            <Text> Weather: {this.state.completedData.weather.description}</Text>
            <Text> Location: {this.state.completedData.weather.city}, {this.state.completedData.weather.country}</Text>
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
              style={{...this.styles.start, marginTop: 20}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Restart Questionnaire
              </Text>
            </TouchableOpacity>
          </>
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
