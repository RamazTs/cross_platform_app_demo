import {View, Text, Button, TouchableOpacity} from 'react-native';
import {Component} from 'react';
import Question from '../../components/Question/Question.jsx';
import QuestionService from '../../services/QuestionService.js';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
import Geolocation from '@react-native-community/geolocation';

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarted: false,
      isEnded: false,
      questionIndex: 0,
      completedQuestions: [],
      ttsState: 'initilizing',
    };
    this.getWeather = this.getWeather.bind(this);
  }

  getWeather = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0bb2954984e58b4696605e92623b8626`
    );
    if (!response.ok) {
      throw new Error('OpenWeather API request failed');
    }
    const data = await response.json();
    return {
      temperature: data.main.temp,
      visibility: data.visibility,
    };
  }

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
        return index + 1 + ', ' + ans;
      })
      .join();
    Tts.speak(text + ans);
  };

  updateIndex = async () => {
    Tts.stop();
    const newIndex = this.state.questionIndex + 1;
    if (newIndex === this.state.QUESTIONS.length) {
      const weatherData = await this.getWeather(32.715736, -117.161087);
      Geolocation.getCurrentPosition(info => console.log(info));
      this.props.setHistory(prev => [...prev, {completedQuestions: this.state.completedQuestions, weather: weatherData, timestamp: new Date().toLocaleString()}]);
      this.setState({
        isEnded: true,
        question_obj: this.state.QUESTIONS[0],
        questionIndex: 0,
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
    if (this.found_2) return;
    const {question, answers} = this.state.question_obj;
    const text = e.value[0];
    for (const answ of answers) {
      if (text.toLowerCase().includes(answ.toLowerCase())) {
        this.found_2 = true;
        console.log('FOUND FOUND FOUND'),
          this.selectAnswerHandler(question, answers, answ).then(
            this.updateIndex.bind(this),
          );
        return;
      }
    }
  };

  startRecording = async () => {
    try {
      await Voice.start('en-Us');
    } catch (error) {
      console.log('error', error);
    }
  };

  stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error', error);
    }
  };

  ttsStartHandler = async event => {
    this.setState({
      ttsState: 'started',
    });
    await this.stopRecording();
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
          Voice.onSpeechResults = this.speechResultsHandler.bind(this);
          Voice.onSpeechPartialResults = this.speechResultsHandler.bind(this);
          Voice.onSpeechEnd = this.stopRecording.bind(this);
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
        ) : this.state.isEnded ? (
          <>
            {this.state.completedQuestions.map((q, i) => {
              return (
                <Text
                  key={q.question + '-' + q.selected}
                  style={{marginBottom: 5}}>
                  {i + 1 + '. '}
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
