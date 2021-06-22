/*!
 * A demo Chat-bot that runs entirely in the browser.
 *
 * @copyright © 2021 Nick Freear.
 * @license proprietary.
 */

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Activity, ActivityTypes, TurnContext } from 'botbuilder-core';
import './css/app.css';
import { BotBackend } from './botBackend';
import { WebChatAdapter } from './webChatAdapter';
import { createStore, renderWebChat, WebChat, getWebChatVersion } from './webChat';
// Was: import { renderWebChat } from 'botframework-webchat';

const locale = 'en-GB';

const botBackend = new BotBackend();

// Create the custom WebChatAdapter.
const webChatAdapter = new WebChatAdapter();

/* webChatAdapter.use(async (context: TurnContext, next) => {
    console.debug('Middleware. Activity:', context.activity);

    await next();
}); */

// Create a store.
const store = createStore({}, ({ dispatch }) => next => action => {

  if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
    const dResult = dispatch({
      type: 'WEB_CHAT/SEND_EVENT',
      payload: {
        name: 'webchat/join',
        value: { language: 'en-GB' }
      }
    });

    console.debug('Webchat connect fulfilled!', dResult);
  }

  return next(action);
});

// Connect our BotFramework-WebChat instance with the DOM.

renderWebChat({
    directLine: webChatAdapter.botConnection,
    locale,
    // userID: options.userID || 'nick', // 'YOUR_USER_ID',
    // username: options.username || 'Nick User',
    role: 'main', // Not 'complementary'!
    styleOptions: {
        // adaptiveCardsParserMaxVersion: '1.2'
        hideUploadButton: true,
    },
    // webSpeechPonyfillFactory: await speech.createSpeechPonyfill(),
    // selectVoice: speech.getSelectVoice(),
    store
},
document.getElementById('webchat')
);

// Register the business logic of the bot through the WebChatAdapter's processActivity implementation.
webChatAdapter.processActivity(async (context: TurnContext) => {
    const ACT: Partial<Activity> = context.activity;

    console.debug('From user processActivity:', ACT);

    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    if (ACT.type === ActivityTypes.Message) {
        await botBackend.onMessage(context);
    } else if (ACT.type === ActivityTypes.Event && ACT.name === 'webchat/join') {
        await botBackend.onJoinChat(context);
    } else {
        await context.sendActivity(`[${ ACT.type } event detected]`);
    }
    // await conversationState.saveChanges(turnContext);
});

// Create user and bot profiles.
export const USER_PROFILE = { id: 'Me!', name: 'Me!', role: 'user' };
export const BOT_PROFILE = { id: 'bot', name: 'bot', role: 'bot' };

// Prevent Flash of Unstyled Content (FOUC): https://en.wikipedia.org/wiki/Flash_of_unstyled_content
document.addEventListener('DOMContentLoaded', () => {
    window.requestAnimationFrame(() => {
        document.body.style.visibility = 'visible';
        // After the content has finished loading, send the bot a "conversationUpdate" Activity with the user's information.
        // When the bot receives a "conversationUpdate" Activity, the developer can opt to send a welcome message to the user.
        webChatAdapter.botConnection.postActivity({
            recipient: BOT_PROFILE,
            membersAdded: [USER_PROFILE],
            type: ActivityTypes.ConversationUpdate
        });

        console.debug('Posted ConversationUpdate.');
    });
});

console.debug('WebChat.js version:', getWebChatVersion(), typeof require, WebChat);
