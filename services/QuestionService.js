class QuestionService {
  constructor() {
    this.questions = null;
    this.initilized = false;
  }
  async fetchQuestions() {
    this.initilized = true;
    this.questions = [
      {
        id: '1',
        question: "Raynaud's symptoms have caused pain in my fingers",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '2',
        question:
          "Raynaud's symptoms have made it difficult to use my fingers",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '3',
        question: "Raynaud's symptoms have made me worry about my ability to do things",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '4',
        question: "Raynaud's symptoms have made me frustrated",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '5',
        question:
          "Raynaud's symptoms have made me irritable",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '6',
        question: "Raynaud's symptoms have caused feelings of despiar / loss of hope",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '7',
        question: "Being unable to do regular things becasue of Raynaud's symptoms has bothered me",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '8',
        question: "Raynaud's symptoms have made it difficult to do work around the house",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '9',
        question: "Raynaud's symptoms have made social events / exercise difficult",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
      {
        id: '10',
        question: "Raynaud's symptoms have had an effect on on my personal / private life",
        answers: [
          '1. Not at all',
          '2. A little bit',
          '3. Somewhat',
          '4. Quite a bit',
          '5. Very much',
        ],
      },
    ];
    return Promise.resolve(this.questions);
  }
  getQuestions() {
    return this.questions;
  }
}

export default QuestionService;
