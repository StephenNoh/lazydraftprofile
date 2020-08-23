const startButton = document.getElementById("startButton")
const btn1 = document.getElementById("btn1")
const btn2 = document.getElementById("btn2")
const questionContainerElement = document.getElementById("question-container")
const questionElement = document.getElementById("question")
const answerButtonsElement = document.getElementById("answer-buttons")
const defense = document.getElementById("defense")
const passing = document.getElementById("passing")

const questions = [
    {
      question: 'Are you a good defender?',
      answers: [
        { text: "Put me in a Florida bar because there's nothing I can't lock down", response: "-Defensive Player of the Year potential!" },
        { text: "They don't pay players to play defense", response: "-Guards all five positions equally well."}
      ]
    },
    {
      question: 'Are you a good passer?',
      answers: [
        { text: 'I\'m a savant', response: "-UNBELIEVABLE feel \n-Too unselfish? \n-Could be the next Luka Doncic?"},
        { text: 'Why pass when you can shoot?', response: "-Shoot-first guard \n-Microwave scorer \n-The next Jamal Crawford?" }
      ]
    },
    {
        question: 'Are you a good shooter?',
        answers: [
          { text: 'Three things you can count on: death, taxes, and my jump shot.', response: "-UNICORN shooting. \n-Game-changing range \n-Comp: Steph Curry"},
          { text: 'I couldn\'t even beat Michael Carter-Williams at HORSE', response: "-Developing shooter. FREAK potential." }
        ]
      },
      {
        question: 'How\'s your rebounding?',
        answers: [
          { text: 'The gym should pay me for how well I clean the glass', response: "-FEROCIOUS rebounder. \n-A nose for the ball. \n-High motor." },
          { text: 'If the ball falls directly into my hands, 50/50 chance that I get it.', response: "-Always looking up the court. \n-Runs the court like a GAZELLE in transition." }
        ]
      }
  ]

startButton.addEventListener("click", startQuiz)
btn1.addEventListener("click", nextQuestionYes)
btn2.addEventListener("click", nextQuestionNo)

function startQuiz () {
    btn1.classList.remove("hide")
    btn1.classList.add("btn")
    btn2.classList.remove("hide")
    btn2.classList.add("btn")
    startButton.classList.remove("btn")
    startButton.classList.add("hide")
    document.getElementById("name").classList.add("hide")
    document.getElementById("position").classList.add("hide")
    currentQuestion=0
    nextQuestionYes()

}

let currentQuestion=0

function nextQuestionYes() {
    if (currentQuestion ==0) {
        btn1.innerText = questions[currentQuestion].answers[0].text
        btn2.innerText = questions[currentQuestion].answers[1].text
    }
    if (currentQuestion ==1) {
        defense.innerText = questions[currentQuestion - 1].answers[0].response
    }
    if (currentQuestion ==2) {
        passing.innerText = questions[currentQuestion - 1].answers[0].response
    }
    if (currentQuestion ==3) {
        shooting.innerText = questions[currentQuestion - 1].answers[0].response
    }
    if (currentQuestion ==4) {
        rebounding.innerText = questions[currentQuestion - 1].answers[0].response
        clearQuestions()
    }
  questionElement.innerText = questions[currentQuestion].question
  btn1.innerText = questions[currentQuestion].answers[0].text
  btn2.innerText = questions[currentQuestion].answers[1].text
  currentQuestion ++;
}

function nextQuestionNo() {
    if (currentQuestion ==1) {
        defense.innerText = questions[currentQuestion - 1].answers[1].response
    }
    if (currentQuestion ==2) {
        passing.innerText = questions[currentQuestion - 1].answers[1].response
    }
    if (currentQuestion ==3) {
        shooting.innerText = questions[currentQuestion - 1].answers[1].response
    }
    if (currentQuestion ==4) {
        rebounding.innerText = questions[currentQuestion - 1].answers[1].response
        clearQuestions()
    }
  questionElement.innerText = questions[currentQuestion].question
  btn1.innerText = questions[currentQuestion].answers[0].text
  btn2.innerText = questions[currentQuestion].answers[1].text
  currentQuestion ++;
}

function clearQuestions () {
    document.getElementById("quiz-form").classList.add("hide")
    document.getElementById("banner").innerText = "LAZY NBA DRAFT PROFILE: " + document.getElementById("name").value.toUpperCase()
    document.getElementById("reference").innerText = `-Former NBA executive of the year: "He's the ${document.getElementById("position").value} of the future."`

}