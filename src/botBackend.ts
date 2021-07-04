/**
 * Backend implementation of `onMessage` and `onJoinChat` used with `WebChatAdapter`.
 *
 * @copyright © Nick Freear, 22-June-2021.
 */

import {
    Activity,
    // ActivityTypes,
    ConversationState,
    MemoryStorage,
    StatePropertyAccessor,
    TurnContext
} from 'botbuilder-core';

// @NOTE: './getNlpConfig' will be modified by webpack at build-time!
import { getNlpConfig } from './getNlpConfig';

import { NlpResult } from './nlpjsTypes';
import { NlpWeb } from './nlpWeb';
import { sendTyping } from './botUtilities';

// const SURVEY_REGEX = /^(survey\.[a-z\.]+|None)$/

export class BotBackend {
    protected countProperty: StatePropertyAccessor<any>;
    protected conversationState: ConversationState;

    protected nlp: NlpWeb;

    constructor() {
        // Instantiate MemoryStorage for use with the ConversationState class.
        const memory = new MemoryStorage();

        // Add the instantiated storage into ConversationState.
        this.conversationState = new ConversationState(memory);

        // Create a property to keep track of how many messages are received from the user.
        this.countProperty = this.conversationState.createProperty('turnCounter');

        this.nlp = new NlpWeb(getNlpConfig());
        this.nlp.initialize().then(res => console.debug('NLP.js ~ training complete:', res));
    }

    /* protected async nlpInitialize() {
        // console.debug('>> BOT_ID:', BOT_ID, getNlpConfigImportPath);

        // const { getNlpConfig } = require(getNlpConfigImportPath); // Not: await import() ?

        const NLP_CONFIG = getNlpConfig();
        this.nlp = new NlpWeb(NLP_CONFIG);
        const result = await this.nlp.initialize();

        console.debug('NLP.js ~ training complete:', NLP_CONFIG, result);
    } */

    public async onMessage(context: TurnContext): Promise<void> {
        const ACT: Partial<Activity> = context.activity;

        // Read from state.
        let count = await this.countProperty.get(context);
        count = count === undefined ? 1 : count;

        const result: NlpResult = await this.nlp.processActivity(ACT);

        const { intent, score, answer } = result;

        if (answer) {
            await context.sendActivity(`\`${ count }:\` ${answer}`);
        } else if (ACT.text.match(/^(Go|Start)/i)) {
          await context.sendActivity(
              `\`${ count }:\` Let's start ...!`
          );
        } else {
          await context.sendActivity(
              `\`${ count }:\` You said "${ ACT.text }"`
          );
        }

        // Increment and set turn counter.
        await this.countProperty.set(context, ++count);

        await this.conversationState.saveChanges(context);
    }

    public async onJoinChat(context: TurnContext): Promise<void> {
        await sendTyping(context);
        await context.sendActivity(`Welcome!`);
        await sendTyping(context);
        await context.sendActivity('Say "go" to get started');
        await sendTyping(context);
    }
}
