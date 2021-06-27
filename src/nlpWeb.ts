/**
 * Natural Language Processing in the browser via `NLP.js`
 *
 * @author NDF, 22-June-2021.
 * @see https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/02.web/03.filecorpus
 */

import { Activity } from 'botbuilder-core';

import { containerBootstrap, Container } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { LangEn } from '@nlpjs/lang-en-min';
import { fs } from '@nlpjs/request-rn';

import { NlpResult } from './nlpjsTypes';
import { EchoPlugin } from './plugins/echoPlugin';

// Was: import { NLPJS_LICENSE } from './nlpjs-license';

const fetch = window.fetch;

const CONFIG = {
    //.
    pathPipeline: 'pipelines.md',
    pipelines: undefined,

    settings: {
        nlp: {
            corpora: [
                'corpus-en.json'
            ]
        }
    },

    use: [ Nlp, LangEn, EchoPlugin ]
}

// Was: const DEFAULT_LOCALE: string = 'en-US';
const DEFAULT_CORPUS: string = CONFIG.settings.nlp.corpora[0]; // 'corpus-en.json';

export class NlpWeb {
    protected container: Container;
    protected nlp: Nlp;

    public async initialize(/* locale: string = DEFAULT_LOCALE, */ corpusPath: string = DEFAULT_CORPUS): Promise<any> {
        const container = this.container = await containerBootstrap({
            pipelines: await this.loadPipelines(CONFIG.pathPipeline),
        });

        container.register('fs', fs); // 'request-rn' -- Load over the Web!

        // Load builtin and custom plugins.
        CONFIG.use.forEach(plugin => container.use(plugin));

        const nlp: Nlp = this.nlp = container.get('nlp');

        nlp.settings.autoSave = false;
        // Was: nlp.addLanguage(this.localeIso2(locale));

        const corpusUrl = this.absoluteUrl(corpusPath);

        await nlp.addCorpus(corpusUrl); // Absolute URL!

        const result = await nlp.train();

        // console.debug('NLP.js ~ training complete:', corpusUrl, nlp);
        return [ result, corpusUrl ];
    }

    public async process(locale: string, text: string): Promise<NlpResult> {
        const localeIso2: string = this.localeIso2(locale);

        const nlpResult: NlpResult = await this.nlp.process(localeIso2, text);

        const { intent, score, answer } = nlpResult;

        console.debug(`NLP.process: "${text}" -> "${answer}" ${intent} ${score}:`, nlpResult);

        return nlpResult;
    }

    public async processActivity(activity: Partial<Activity>): Promise<NlpResult> {
        return await this.process(activity.locale, activity.text);
    }

    public localeIso2(locale: string): string {
        return locale.substring(0, 2);
    }

    protected absoluteUrl(corpusPath: string): string {
        const origin: string = window.location.origin;
        const path: string = window.location.pathname.replace(/(\w\.html)$/, '');

        return `${origin}${path}${corpusPath}`;
    }

    protected async loadPipelines(pipelinesPath: string): Promise<string> {
        const pipelinesUrl: string = this.absoluteUrl(pipelinesPath);

        const response = await fetch(pipelinesUrl);
        return response.text();
    }
}
