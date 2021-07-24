/**
 * Wrapper for `SurveyBot` plugin etc.
 */

export { BotSpeech, FormData } from '../survey-bot/src/browser';

export { SurveyBot } from '../survey-bot/src/index';

export {
  createDictationRecognizerPonyfill, getDictationRecognizerConfig
} from '../dictate-test/src/index';
