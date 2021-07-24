/**
 * NLP.js configuration for a `Survey-Bot`.
 */

import { Nlp } from '@nlpjs/nlp';
import { LangEn } from '@nlpjs/lang-en-min';

import { Configuration } from './nlpjsTypes';
import { SurveyBot } from './surveyBotApp';

export function getNlpConfig(): Configuration {
    return {
        ID: 'survey',

        pathPipeline: 'pipelines.md',
        pipelines: undefined,

        settings: {
            nlp: {
                corpora: [
                    'corpus-en.json'
                ]
            }
        },

        use: [ Nlp, LangEn, SurveyBot ]
    }
}
