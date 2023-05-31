import {View, Text, SafeAreaView, Button, TouchableOpacity} from 'react-native';
import uuid from 'react-native-uuid';
// import Question from '../../components/Question';
import {Component} from 'react';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    QUESTIONS = [
      {
        id: '1',
        question: "Raynaud's symptoms have caused pain in my fingers",
        answers: [
          'Not at all',
          'A little bit',
          'Somewhat',
          'Quite a bit',
          'Very much',
        ],
      },
      {
        id: '2',
        question:
          "Raynaud's symptoms have made my fingers tender / hypersensitive to touch",
        answers: [
          'Not at all',
          'A little bit',
          'Somewhat',
          'Quite a bit',
          'Very much',
        ],
      },
      {
        id: '3',
        question: "Raynaud's symptoms have caused tingling in my fingers",
        answers: [
          'Not at all',
          'A little bit',
          'Somewhat',
          'Quite a bit',
          'Very much',
        ],
      },
      {
        id: '4',
        question: "Raynaud's symptoms have made my fingers feel cold",
        answers: [
          'Not at all',
          'A little bit',
          'Somewhat',
          'Quite a bit',
          'Very much',
        ],
      },
      {
        id: '5',
        question:
          "Raynaud's symptoms have made my fingers change one or more colours (white/blue/red/purple etc.)",
        answers: [
          'Not at all',
          'A little bit',
          'Somewhat',
          'Quite a bit',
          'Very much',
        ],
      },
      {
        id: '6',
        question: "Raynaud's symptoms have made it difficult to use my fingers",
        answers: [
          'Not at all',
          'A little bit',
          'Somewhat',
          'Quite a bit',
          'Very much',
        ],
      },
    ];
    this.state = {
      QUESTIONS,
      isStarted: false,
      isEnded: false,
      questionIndex: 0,
      completedQuestions: [],
      question_obj: QUESTIONS[0],
      ttsState: 'initilizing',
      found: false,
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

  updateIndex = () => {
    Tts.stop();
    const newIndex = this.state.questionIndex + 1;
    if (newIndex === this.state.QUESTIONS.length) {
      this.setState({
        isEnded: true,
        question_obj: QUESTIONS[0],
        questionIndex: 0,
      });
      return;
    }
    this.setState(
      {
        questionIndex: newIndex,
        question_obj: QUESTIONS[newIndex],
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
    if (this.state.found) return;
    const {question, answers} = this.state.question_obj;
    const text = e.value[0];
    for (const answ of answers) {
      if (text.toLowerCase().includes(answ.toLowerCase())) {
        this.setState(
          {
            found: true,
          },
          () => {
            console.log('FOUND FOUND FOUND'),
              this.selectAnswerHandler(question, answers, answ).then(
                this.updateIndex.bind(this),
              );
          },
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
    this.setState({
      found: false,
    });
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
    console.log('MOUNT');
    Voice.onSpeechStart = this.speechStartHandler.bind(this);
    Voice.onSpeechResults = this.speechResultsHandler.bind(this);
    Voice.onSpeechPartialResults = this.speechResultsHandler.bind(this);
    Voice.onSpeechEnd = this.stopRecording.bind(this);
    Tts.getInitStatus().then(
      _ => {
        Tts.setDucking(true);
        Tts.addEventListener('tts-start', this.ttsStartHandler.bind(this));
        Tts.addEventListener('tts-finish', this.ttsFinishHandler.bind(this));
        Tts.addEventListener('tts-cancel', this.ttsCancelHandler.bind(this));
      },
      err => {
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
      },
    );
  }

  componentWillUnmount() {
    Tts.stop();
    Voice.destroy().then(Voice.removeAllListeners);
  }

  //   useEffect(() => {
  //     if (!isStarted || isEnded) return;

  //     const {question, answers} = question_obj;

  //     const text = 'Question ' + (questionIndex + 1) + '. ' + question + '. ';

  //     const ans = answers
  //       .map((ans, index) => {
  //         return index + 1 + ', ' + ans;
  //       })
  //       .join();
  //     Tts.speak(text + ans);

  //     return () => Tts.stop();
  //   }, [isStarted, isEnded, question_obj]);

  render() {
    return (
      <View style={this.state.isStarted ? '' : this.styles.containerStart}>
        {!this.state.isStarted ? (
          <TouchableOpacity
            onPress={this.startQuestionnaireHandler}
            style={this.styles.start}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Start The Questionnaire
            </Text>
          </TouchableOpacity>
        ) : this.state.isEnded ? (
          <View style={this.styles.containerQuestion}>
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
          </View>
        ) : this.state.question_obj ? (
          <View style={this.styles.containerQuestion}>
            <Text style={{marginBottom: 20}}>
              {this.state.questionIndex + 1 + '. '}{' '}
              {this.state.question_obj.question}
            </Text>
            {this.state.question_obj.answers.map(ans => {
              return (
                <Button
                  title={ans}
                  key={`${this.state.question_obj.id}-${ans}`}
                  style={{margin: 5}}
                  onPress={async () => {
                    await this.selectAnswerHandler(
                      this.state.question_obj.question,
                      this.state.question_obj.answers,
                      ans,
                    );
                    this.updateIndex();
                  }}
                />
              );
            })}
          </View>
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
