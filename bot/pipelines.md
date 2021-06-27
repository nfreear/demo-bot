# default

## main
nlp.train
console.say "Hi, I'm a Demo Bot"

## console.hear
// compiler=javascript
if (message === 'quit') {
  console.say('Goodbye!');
  return console.exit();
}
nlp.process();
this.say();

## onIntent(joke.chucknorris)
// compiler=javascript
const something = request.get('http://api.icndb.com/jokes/random');
if (something && something.value && something.value.joke) {
  input.answer = something.value.joke;
}

## onIntent(survey.start)
echoPlugin
->output.text

## onIntent(None)
echoPlugin
->output.text
