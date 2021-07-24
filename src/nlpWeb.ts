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
// import { JavascriptCompiler } from '@nlpjs/evaluator';
import { fs } from '@nlpjs/request-rn';

import { NlpResult, Configuration } from './nlpjsTypes';
// export { NlpResult, Configuration };

const fetch = window.fetch;
const location = window.location;

export class NlpWeb {
    protected container: Container;
    protected nlp: Nlp;
    protected OPT: Configuration;

    constructor(options: Configuration) {
        this.OPT = options || {};

        console.debug('NlpWeb:', this.OPT);
    }

    public async initialize(): Promise<any> {
        const CONFIG: Configuration = this.OPT;

        const container = this.container = await containerBootstrap({
            pipelines: await this.loadPipelines(CONFIG.pathPipeline),
        });

        container.register('fs', fs); // 'request-rn' -- Load over the Web!

        // @TODO: Doesn't work :(.
        // container.registerCompiler(JavascriptCompiler, 'javascript');

        // Load builtin and custom plugins.
        CONFIG.use.forEach(plugin => container.use(plugin));

        const nlp: Nlp = this.nlp = container.get('nlp');

        nlp.settings.autoSave = false;
        // Was: nlp.addLanguage(this.localeIso2(locale));

        const corpusUrl = this.absoluteUrl(CONFIG.settings.nlp.corpora[0]);

        await nlp.addCorpus(corpusUrl); // Absolute URL!

        const result = await nlp.train();

        // console.debug('NLP.js ~ training complete:', corpusUrl, nlp);
        return [ result, corpusUrl ];
    }

    public async process(locale: string|any, utterance?: string, srcContext?: any): Promise<NlpResult> {
        const text: string = utterance || locale.message;
        // const localeIso2: string = this.localeIso2(locale);

        const nlpResult: NlpResult = await this.nlp.process(locale); //, utterance, srcContext);

        const { intent, score, answer } = nlpResult;

        console.debug(`NLP.process: "${text}" -> "${answer}" ${intent} ${score}:`, nlpResult);

        return nlpResult;
    }

    /**
     * @see https://github.com/axa-group/nlp.js/blob/4.14.2/packages/directline-connector/src/directline-controller.js#L157-L164
     */
    public async processActivity(activity: Partial<Activity>): Promise<NlpResult> {
        return this.process({
            locale: this.localeIso2(activity.locale) || null,
            message: activity.text,
            channel: 'directline',
            app: 'NlpWeb', // this.settings.container.name,
            from: activity.from || null,
            activity,
        });
        // Was: return await this.process(activity.locale, activity.text);
    }

    public localeIso2(locale: string): string {
        return locale.substring(0, 2);
    }

    protected absoluteUrl(corpusPath: string): string {
        const path: string = location.pathname.replace(/(\w\.html)$/, '');

        return `${location.origin}${path}${corpusPath}`;
    }

    protected async loadPipelines(pipelinesPath: string): Promise<string> {
        const pipelinesUrl: string = this.absoluteUrl(pipelinesPath);

        const response = await fetch(pipelinesUrl);
        return response.text();
    }
}
