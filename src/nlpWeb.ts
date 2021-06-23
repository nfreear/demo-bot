/*
 * Natural Language Processing in the browser via `NLP.js`
 */

import { Activity } from 'botbuilder-core';

import { containerBootstrap, Container } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { LangEn } from '@nlpjs/lang-en-min';
import { fs } from '@nlpjs/request-rn';

// import { NLPJS_LICENSE } from './nlpjs-license';

const DEFAULT_LOCALE: string = 'en-US';
const DEFAULT_CORPUS: string = '/corpus-en.json';

export interface UserAccount {
    id: string,
    name: string,
    role: string // 'bot' or 'user'
}

export interface NlpResult {
    message: string,
    channel: string,
    app: string,
    from: UserAccount,
    activity: Partial<Activity>,
    locale: string,
    utterance: string,
    languageGuessed?: boolean,
    localeIso2?: string,
    language?: string,
    // explanation: [ { token, stem, weight }]
    // classifications: [ { intent, score } ]
    intent?: string,
    score?: number, // Range: 0.0 - 1.0;
    domain?: string,
    // entities: [],
    // sourceEntities: [],
    answers?: Array<string>,
    answer?: string,
    text?: string,
    inputHint?: string,
    // actions: [],
    // sentiment: { score, numWords, ... vote: 'neutral' }
}

export class NlpWeb {
    protected container: Container;
    protected nlp: Nlp;

    public async initialize(locale: string = DEFAULT_LOCALE, corpusPath: string = DEFAULT_CORPUS): Promise<any> {
        // console.debug('NLP.js license:', NLPJS_LICENSE);

        const container = this.container = await containerBootstrap();

        container.register('fs', fs); // 'request-rn' -- Load over the Web!
        container.use(Nlp);
        container.use(LangEn);

        const nlp: Nlp = this.nlp = container.get('nlp');

        nlp.settings.autoSave = false;
        // nlp.addLanguage(this.localeIso2(locale));

        await nlp.addCorpus(this.corpusUrl(corpusPath)); // Absolute URL!

        const result = await nlp.train();

        // console.debug('NLP.js ~ training complete:', nlp);
        return result;
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

    public corpusUrl(corpusPath: string): string {
        const origin: string = window.location.origin;

        return `${origin}${corpusPath}`;
    }
}
