
import { Nlp } from '@nlpjs/nlp';
import { LangEn } from '@nlpjs/lang-en-min';

import { Configuration } from './nlpjsTypes';
import { EchoPlugin } from './plugins/echoPlugin';
import { QuotePlugin } from './plugins/quotePlugin';
// import { RequestPlugin } from './plugins/requestPlugin';

export function getNlpConfig(): Configuration {
    return {
        pathPipeline: 'pipelines.md',
        pipelines: undefined,

        settings: {
            nlp: {
                corpora: [
                    'corpus-en.json'
                ]
            }
        },

        use: [ Nlp, LangEn, EchoPlugin, QuotePlugin ] // RequestPlugin,
    }
}
