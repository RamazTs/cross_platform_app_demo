import {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';

const Question = props => {
  const question_obj = props.questions[props.questionIndex];
  const {question, answers, id} = question_obj;
  const [ttsState, setTtsState] = useState('initilizing');
  const [voiceAnswer, setVoiceAnswer] = useState('');

  const speechStartHandler = e => {
    console.log('speechStart successful');
  };

  const speechResultsHandler = async e => {
    const text = e.value[0];
    console.log('QUESTION TEXT', text, question);
    let foundAnswer = null;
    for (const answ of answers) {
      if (text.toLowerCase().includes(answ.toLowerCase())) {
        try {
          await Voice.stop();
        } catch (error) {
          console.log('ERROR: ', error);
        }
        foundAnswer = answ;
        break;
      }
    }
    if (foundAnswer) {
      setVoiceAnswer(foundAnswer);
      makeSelection();
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

  const makeSelection = () => {
    if (voiceAnswer) {
      props.select(question, answers, voiceAnswer);
    }
  };

  useEffect(() => {
    if (ttsState === 'finished') {
      startRecording();
    } else {
      stopRecording();
    }
  }, [ttsState]);

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechPartialResults = speechResultsHandler;
    Voice.onSpeechEnd = stopRecording;
    Tts.getInitStatus()
      .then(
        _ => {
          Tts.setDucking(true);
          Tts.addEventListener('tts-start', event => setTtsState('started'));
          Tts.addEventListener('tts-finish', event => setTtsState('finished'));
          Tts.addEventListener('tts-cancel', event => setTtsState('cancelled'));
        },
        err => {
          if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
        },
      )
      .then(() => {
        const text =
          'Question ' + (props.questionIndex + 1) + '. ' + question + '. ';

        const ans = answers
          .map((ans, index) => {
            return index + 1 + ', ' + ans;
          })
          .join();
        Tts.speak(text + ans);
      });

    return () => {
      Tts.stop();
      Voice.stop();
    };
  }, [props.questionIndex]);

  return (
    <View>
      <Text>{question}</Text>
      {answers.map(ans => {
        return (
          <Button
            title={`${ans}-${id}`}
            key={`${ans}-${id}`}
            onPress={() => {
              setVoiceAnswer(ans);
              makeSelection();
            }}
          />
        );
      })}
    </View>
  );
};

export default Question;
