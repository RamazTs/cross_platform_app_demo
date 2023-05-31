import {View, Text, SafeAreaView, Button} from 'react-native';
import {useState, useEffect} from 'react';
// import Question from '../../components/Question';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';

const Questionnaire = () => {
  const QUESTIONS = [
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

  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestion] = useState([]);
  const [question_obj, setQuestionObj] = useState(QUESTIONS[0]);
  const [ttsState, setTtsState] = useState('initilizing');
  const [found, setFound] = useState(false);

  const startQuestionnaireHandler = () => {
    //reset and start
    setQuestionIndex(0);
    setCompletedQuestion([]);
    setIsEnded(false);
    setIsStarted(true);
  };
  const updateIndex = () => {
    setQuestionIndex(idx => {
      const newIndex = idx + 1;
      console.log(idx);
      if (idx + 1 === QUESTIONS.length) {
        setIsEnded(true);
        setQuestionObj(QUESTIONS[0]);
        return 0;
      }
      setQuestionObj(QUESTIONS[newIndex]);
      return newIndex;
    });
  };

  const selectAnswerHandler = async (question, answers, selected) => {
    await stopRecording();
    answ_obj = {question, answers, selected};
    setCompletedQuestion(arr => [...arr, answ_obj]);
  };

  const speechStartHandler = e => {
    console.log('speechStart successful');
  };

  const speechResultsHandler = async e => {
    if (found) return;
    const {question, answers} = question_obj;
    const text = e.value[0];
    for (const answ of answers) {
      if (text.toLowerCase().includes(answ.toLowerCase())) {
        setFound(true);
        console.log('FOUND FOUND FOUND');
        return;
        // await selectAnswerHandler(question, answers, answ);
        // updateIndex();
      }
    }
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-Us');
    } catch (error) {
      console.log('error', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechPartialResults = speechResultsHandler;
    Voice.onSpeechEnd = stopRecording;
    Tts.getInitStatus().then(
      _ => {
        Tts.setDucking(true);
        Tts.addEventListener('tts-start', event => {
          setTtsState('started');
          stopRecording();
        });
        Tts.addEventListener('tts-finish', event => {
          setTtsState('finished');
          startRecording();
        });
        Tts.addEventListener('tts-cancel', event => {
          setTtsState('cancelled');
          stopRecording();
        });
      },
      err => {
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
      },
    );
    return () => {
      Tts.stop();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (!isStarted || isEnded) return;

    const {question, answers} = question_obj;

    const text = 'Question ' + (questionIndex + 1) + '. ' + question + '. ';

    const ans = answers
      .map((ans, index) => {
        return index + 1 + ', ' + ans;
      })
      .join();
    Tts.speak(text + ans);

    return () => Tts.stop();
  }, [isStarted, isEnded, question_obj]);

  const beforeStartView = (
    <>
      <Button
        title="Start The Questionnaire"
        color="#841584"
        onPress={startQuestionnaireHandler}
      />
    </>
  );

  const resultView = (
    <>
      {completedQuestions.map(q => {
        return (
          <Text>
            {q.question} : {q.selected}
          </Text>
        );
      })}
      <Button
        title="Restart Questionnaire"
        color="green"
        onPress={startQuestionnaireHandler}
      />
    </>
  );

  return (
    <View style={isStarted ? '' : styles.containerStart}>
      {!isStarted ? (
        beforeStartView
      ) : isEnded ? (
        resultView
      ) : question_obj ? (
        <View>
          <Text>{question_obj.question}</Text>
          {question_obj.answers.map(ans => {
            return (
              <Button
                title={`${ans}-${question_obj.id}`}
                key={`${ans}-${question_obj.id}`}
                onPress={async () => {
                  await selectAnswerHandler(
                    question_obj.question,
                    question_obj.answers,
                    ans,
                  );
                  updateIndex();
                }}
              />
            );
          })}
        </View>
      ) : undefined}
    </View>
  );
};

const styles = {
  containerStart: {
    flex: 1,
    justifyContent: 'center',
  },
};

export default Questionnaire;
