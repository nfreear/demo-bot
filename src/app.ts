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
import {
    ActivityTypes,
    ConversationState,
    MemoryStorage
} from 'botbuilder-core';
import './css/app.css';
import { WebChatAdapter } from './webChatAdapter';
// import { renderWebChat } from 'botframework-webchat';

const { renderWebChat } = window.WebChat;

// Create the custom WebChatAdapter.
const webChatAdapter = new WebChatAdapter();

webChatAdapter.use(async (context, next) => {
    console.debug('Middleware. Activity:', context.activity);

    await next();
});

// Create a store.
const store = WebChat.createStore({}, ({ dispatch }) => next => action => {

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
    store,
},
document.getElementById('webchat')
);
// Instantiate MemoryStorage for use with the ConversationState class.
const memory = new MemoryStorage();

// Add the instantiated storage into ConversationState.
const conversationState = new ConversationState(memory);

// Create a property to keep track of how many messages are received from the user.
const countProperty = conversationState.createProperty('turnCounter');

// Register the business logic of the bot through the WebChatAdapter's processActivity implementation.
webChatAdapter.processActivity(async turnContext => {
    const ACT = turnContext.activity;

    console.debug('From user processActivity:', ACT);

    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    if (ACT.type === ActivityTypes.Message) {
        // Read from state.
        let count = await countProperty.get(turnContext);
        count = count === undefined ? 1 : count;

        if (ACT.text.match(/^(Go|Start)/i)) {
          await turnContext.sendActivity(
              `\`${ count }:\` Let's start ...!`
          );
        } else {
          await turnContext.sendActivity(
              `\`${ count }:\` You said "${ turnContext.activity.text }"`
          );
        }

        // Increment and set turn counter.
        await countProperty.set(turnContext, ++count);
        //.
    } else if (ACT.type === ActivityTypes.Event && ACT.name === 'webchat/join') {
        await turnContext.sendActivity(`Welcome!`);
        await turnContext.sendActivity('Say "go" to get started');
    } else {
        await turnContext.sendActivity(
            `[${ turnContext.activity.type } event detected]`
        );
    }
    await conversationState.saveChanges(turnContext);
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

        /* setTimeout(() => {
            webChatAdapter.botConnection.postActivity({
                recipient: BOT_PROFILE,
                from: USER_PROFILE,
                // name: 'MyEvent',
                // value: { TEST: true },
                // type: ActivityTypes.Event,
                text: 'Welcome!',
                type: ActivityTypes.Message,
            })
        },
        1000); */

        console.debug('Posted ConversationUpdate.');
    });
});

const META = document.querySelector('meta[ name = "botframework-webchat:core:version" ]');

console.debug('WebChat.js version:', META.getAttribute('content'), typeof require, window.WebChat);
