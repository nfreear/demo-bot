/**
 * Typescript type declarations for NLP.js.
 *
 * @author Nick Freear, 26-June-2021.
 */

import { defaultContainer, Clonable, Container } from '@nlpjs/core';
import { Activity, ChannelAccount, InputHints } from 'botframework-schema';

/* export interface UserAccount {
    id: string,
    name: string,
    role?: string // RoleTypes. 'bot' or 'user'
} */

export interface NlpSettings {
    corpora?: string[],
    threshold?: number, // 0.0 -> 1.0;
    autoLoad?: boolean,
    autoSave?: boolean,
    modelFileName?: string,
    nlu?: any,
    sentiment?: boolean,
    tag?: string,
    [otherSettings: string]: any,

}

export interface NerSettings {
    threshold?: number, // 0.0 -> 1.0;
    rules?: any, // @TODO !!
    tag?: string,
}

export interface ApiServerSettings {
    clientPath?: string,
    port?: number, // default: 3000;
    serveBot?: boolean,
    tag?: string,
}

export interface ConsoleSettings {
    debug?: boolean,
}

export interface Settings {
    nlp?: NlpSettings,
    ner?: NerSettings,
    'api-server'?: ApiServerSettings,
    console?: ConsoleSettings,
    [otherSettings: string]: any,
}

export interface UseItem {
    className: string,
    path: string,
}

export interface Configuration {
    // '#'?: string, // A comment ?!
    pathPipeline?: string, // Singular!
    pathPlugins?: string,  // Plural!
    pipelines?: string,

    settings?: Settings,
    use?: Array<string | UseItem | any>,
}

export interface NlpClassification {
    intent: string,
    score: number
}

/** `NlpResult` is both the input and output from a plugin's `run` method.
 */
export interface NlpResult {
    message: string,
    channel: string,
    app: string,
    from: ChannelAccount,
    activity: Partial<Activity>,
    locale: string,
    utterance: string,
    languageGuessed?: boolean,
    localeIso2?: string,
    language?: string,
    // explanation: [ { token, stem, weight }]
    classifications: Array<NlpClassification>,
    // nluAnswer: { classifications, entities, explanation }
    intent?: string,
    score?: number, // Range: 0.0 - 1.0;
    domain?: string,
    // entities: [],
    // sourceEntities: [],
    answers?: Array<string>,
    answer?: string,
    text?: string,
    inputHint?: InputHints | string,
    // actions: [],
    // sentiment: { score, numWords, ... vote: 'neutral' }
    _extra?: any,
}

export abstract class NlpPlugin extends Clonable {

    public name: string;

    public constructor (settings: any = {}, container: Container) {
        super({
            settings: {},
            container: settings.container || container || defaultContainer
        },
        container
        );

        /** @TODO: You should define your own unique name!
         */
        this.name = 'nlpPlugin';
    }

    public abstract start(): void;

    /** `run` may return a Promise, but MUST NOT be `async`!
     */
    public abstract run(input: Partial<NlpResult>): NlpResult | Promise<NlpResult>;
}

// End.
