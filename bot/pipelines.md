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

## onIntent(None)
echoPlugin
->output.text
