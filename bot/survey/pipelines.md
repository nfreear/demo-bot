
# default

## main
nlp.train
console.say "Hi, I'm a Survey Bot"
console.say "To start the survey, say 'Go'"

## onIntent(survey.start)
surveyBot
->output.text

## onIntent(survey.end.early)
surveyBot
->output.text

## onIntent(survey.repeat.question)
surveyBot
->output.text

## onIntent(survey.answer)
surveyBot
->output.text

## onIntent(None)
surveyBot
->output.text
