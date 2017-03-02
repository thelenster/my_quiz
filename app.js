// JavaScript 

var state = {
	questions: [
		{
			text: "Fats are also known as what?",
			choices: ["Lipids", "Carbohydrates", "Disaccharides", "Monosaccharides"],
			correctAnswerIndex: 0
		},
		{
			text: "Where can fats be found?",
			choices:["Plants", "Animals", "Humans", "All of the above"],
			correctAnswerIndex: 3
		},
		{
			text: "Which type of fat is considered to be an 'Artificial Fat'",
			choices: ["Polyunsaturated", "Monounsaturated", "Saturated", "Trans Fat"],
			correctAnswerIndex: 3
		},
		{
			text: "Which type of fat is most likely to solidify at room temperature (around 72 degrees Fahrenheit)?",
			choices: ["Monounsaturated Fats", "Polyunsaturated Fat", "Saturated Fat", "All of the above"],
			correctAnswerIndex: 2
		},
		{
			text: "Which type of fat maintains molecular integrity even when introduced to a high degree of heat (cooking heat)?",
			choices: ["Polyunsaturated", "Saturated", "Trans Fat", "Monounsaturated"],
			correctAnswerIndex: 1
		},
		{
			text: "Which type of fat has been unjustly villified and wrongfully accused of causing cancer and heart disease?",
			choices: ["Monounsaturated", "Polyunsaturated", "Saturated", "Trans"],
			correctAnswerIndex: 2
		}
		
	],
	praises : [
		"Yes!, That's correct", "You got it!", "You did it!"
	],
	
	admonishments: ["Sorry, that is incorrect", "That's not the answer", "Oops, that wasn't correct"
	],
	score: 0,
	currentQuestionIndex: 0,
	route: 'start',
	lastAnswerCorrect: false,
	feedbackRandom: 0
};


//State Mod

function setRoute(state, route) {
	state.route = route;
};

function resetGame(state) {
	state.score=0;
	state.currentQuestionIndex = 0;
	setRoute(state, 'start')
};

function answerQuestion(state, answer) {
	var currentQuestion = state.questions[state.currentQuestionIndex];
	state.lastAnswerCorrect = currentQuestion.correctChoiceIndex ===answer;
	if (state.lastAnswerCorrect){
		state.score++;
	}
	selectFeedback(state);
	setRoute(state, 'answer-feedback');
};

function selectFeedback(state) {
	state.feedbackRandom = Math.random();
};

function advance(state) {
	state.currentQuestionIndex++;
	if (state.currentQuestionIndex === state.questions.length) {
		setRoute(state, 'final-feedback');
	}
	else {
		setRoute(state, 'question');
	}
};

//Render

function renderApp(state, elements){
	Object.keys(elements).forEach(function(route){
		elements[route].hide();
	});
	elements[state.route].show();
	
	if (state.route ==='start') {
		renderStartPage(state, elements[state.route]);
	}
	else if (state.route ==='question') {
		renderQuestionPage(state, elements[state.route]);
	}
	else if (state.route === 'answer-feedback') {
		renderAnswerFeedbackPage(state, elements[state.route]);
	}
	else if (state.route ==='final-feedback') {
		renderFinalFeedbackPage(state, elements[state.route]);
	}

};

function renderStartPage(state,element){
	
};

function renderQuestionPage(state, element) {
	renderQuestionCount(state, element.find('.question-count'));
	renderQuestionText(state, element.find('.question-text'));
	renderChoices(state, element.find('.choices'));
};

function renderAnswerFeedbackPage(state, element) {
	renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
	renderAnswerFeedbackText(state, element.find(".feedback-text"));
	renderNextButtonText(state, element.find(".see-next"));
};

function renderFinalFeedbackPage(state, element) {
	renderFinalFeedbackText(state, element.find('.results-text'));
};

function renderQuestionCount(state, element) {
	var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
	element.text(text);
};

function renderQuestionText(state, element) {
	var currentQuestion = state.questions[state.currentQuestionIndex];
	element.text(currentQuestion.text);
};

function renderChoices(state, element){
	var currentQuestion = state.questions[state.currentQuestionIndex];
	var choices = currentQuestion.choices.map(function(choice, index){
		return (
		'<li>' + '<input type = "radio" name="user-answer" value="' + index + '" required>' + '<label>' + choice + '</label>' + '</li>');
	});
	element.html(choices);
};

function renderAnswerFeedbackHeader(state, element) {
	var html = state.lastAnswerCorrect ?
		"<h6 class ='user-was-correct'>correct</h6>" :
		"<h1 class ='user-was-incorrect'>I'm sorry, that's not correct.</>";
	
	element.html(html);
};

function renderAnswerFeedbackText(state, element) {
	var choices = state.lastAnswerCorrect ? state.praises : state.admonishments;
	var text = choices[Math.floor(state.feedbackRandom * choices.length)];
	element.text(text);
};

function renderNextButtonText(state, element){
	var text = state.currentQuestionIndex < state.questions.length - 1 ?
		"Next" : "How did I do?";
	element.text(text);
};

function renderFinalFeedbackText(state, element){
	var text = "You got " + state.score + " out of " + state.questions.length + " questions right.";
	element.text(text);
};

//Handlers

var PAGE_ELEMENTS = {
	'start' : $('.start-page'),
	'question': $('.question-page'),
	'answer-feedback': $('.answer-feedback-page'),
	'final-feedback': $('.final-feedback-page')
};

$("form[name='start-quiz']").submit(function(event) {
	event.preventDefault();
	setRoute(state,'question');
	renderApp(state, PAGE_ELEMENTS);
});

$(".restart-game").click(function(event){
	event.preventDefault();
	resetGame(state);
	renderApp(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(function(event){
	event.preventDefault();
	var answer = $("input[name='user-answer']:checked").val();
	answer = parseInt(answer, 10);
	answerQuestion(state, answer);
	renderApp(state, PAGE_ELEMENTS);
});

$(".see-next").click(function(event){
	advance(state);
	renderApp(state, PAGE_ELEMENTS);
});

$(function(){
	renderApp(state, PAGE_ELEMENTS);
});




