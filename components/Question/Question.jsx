import {Component} from 'react';
import {Text, Button} from 'react-native';

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Text style={{marginBottom: 20}}>
          {this.props.questionIndex + 1 + '. '}{' '}
          {this.props.question_obj.question}
        </Text>
        {this.props.question_obj.answers.map(ans => {
          return (
            <Button
              title={ans}
              key={`${this.props.question_obj.id}-${ans}`}
              style={{margin: 5}}
              onPress={async () => {
                await this.props.selectAnswerHandler(
                  this.props.question_obj.question,
                  this.props.question_obj.answers,
                  ans,
                );
                this.props.updateIndex();
              }}
              accessible={false}
            />
          );
        })}
      </>
    );
  }
}

export default Question;
