import {Component} from 'react';
import {Text, Button} from 'react-native';

const responseLookup = {
  "1": "not at all",
  "2": "a little bit",
  "3": "somewhat",
  "4": "quite a bit",
  "5": "very much"
};

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
          const numberLabel = ans.split('.')[0];
          const wordResponse = responseLookup[numberLabel];
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
              accessible={true}
              accessibilityLabel={wordResponse} // Using wordResponse as the accessibility label
            />
          );
        })}
      </>
    );
  }
}

export default Question;




// import {Component} from 'react';
// import {Text, Button} from 'react-native';

// class Question extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     return (
//       <>
//         <Text style={{marginBottom: 20}}>
//           {this.props.questionIndex + 1 + '. '}{' '}
//           {this.props.question_obj.question}
//         </Text>
//         {this.props.question_obj.answers.map(ans => {
//           const numberLabel = ans.split('.')[0];
//           return (
//             <Button
//               title={ans}
//               key={`${this.props.question_obj.id}-${ans}`}
//               style={{margin: 5}}
//               onPress={async () => {
//                 await this.props.selectAnswerHandler(
//                   this.props.question_obj.question,
//                   this.props.question_obj.answers,
//                   ans,
//                 );
//                 this.props.updateIndex();
//               }}
//               accessible={true}
//               accessibilityLabel={numberLabel}
//             />
//           );
//         })}
//       </>
//     );
//   }
// }

// export default Question;
