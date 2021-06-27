/*!
 * Custom BotAdapter used for deploying a bot in a browser.
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 *
 * @license MIT
 * @see https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/javascript_es6/01.browser-echo;
 */

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ConnectionStatus } from './ConnectionStatus';
// Was: import { ConnectionStatus } from 'botframework-directlinejs';
import { Activity, BotAdapter, TurnContext } from 'botbuilder-core';
import { BOT_PROFILE, USER_PROFILE } from './app';
import Observable from 'core-js/features/observable';

type MyObserver = { next: Function, complete: Function };
type MyConnection = { connectionStatus$: Observable, activity$: Observable, end: Function, getSessionId: Function, postActivity: Function };
type MyLogic = (c: TurnContext) => Promise<void>;

/**
 * Custom BotAdapter used for deploying a bot in a browser.
 */
export class WebChatAdapter extends BotAdapter {
    public botConnection: MyConnection;

    protected activityObserver: MyObserver;
    protected logic: MyLogic;

    constructor() {
        super();

        this.logic = () => new Promise(() => {});

        this.botConnection = {
            connectionStatus$: new Observable((observer: MyObserver) => {
                observer.next(ConnectionStatus.Uninitialized);
                observer.next(ConnectionStatus.Connecting);
                observer.next(ConnectionStatus.Online);

                console.debug('Adapter. connectionStatus: Online.', observer, this);

                // console.debug('ConnectionStatus:', JSON.stringify(ConnectionStatus, null, 2));
            }),
            activity$: new Observable((observer: MyObserver) => {
                this.activityObserver = observer;
            }),
            end() {
                // The React component was called to unmount:
                // https://github.com/Microsoft/BotFramework-WebChat/blob/57360e4df92e041d5b0fd4810c1abf96621b5283/src/Chat.tsx#L237-L247
                // Developers will need to decide what behavior the component should implement.
                // For this sample, this.botConnection.componentWillUnmount() and this.botConnection.end()
                // is never called.
                console.log('this.botConnection.componentWillUnmount() called.');
            },
            getSessionId: () => new Observable(observer => observer.complete()),
            postActivity: (activity /* : Partial<Activity> */) => {
                const id = Date.now().toString();

                // console.debug('Adapter. From user postActivity. ID=', id, activity);

                return new Observable((observer: MyObserver) => {
                    const serverActivity = {
                        ...activity,
                        id,
                        conversation: { id: 'bot' },
                        channelId: 'WebChat',
                        recipient: BOT_PROFILE,
                        timestamp: new Date().toISOString()
                    };

                    this.onReceive(serverActivity).then(() => {
                        observer.next(id);
                        observer.complete();

                        // console.debug('Adapter. postActivity ~ onReceive:', serverActivity);

                        this.activityObserver.next(serverActivity);
                    });
                });
            }
        };
    }

    /**
     * This WebChatAdapter implements the sendActivities method which is called by the TurnContext class.
     * It's also possible to write a custom TurnContext with different methods of accessing an adapter.
     * @param {TurnContext} context
     * @param {Activity[]} activities
     */
    public sendActivities(context: TurnContext, activities): Promise<any> {
        // console.debug('Adapter. sendActivities:', activities);

        const sentActivities = activities.map(activity => Object.assign({}, activity, {
            id: Date.now().toString(),
            channelId: 'WebChat',
            conversation: { id: 'bot' },
            from: BOT_PROFILE,
            recipient: USER_PROFILE,
            timestamp: new Date().toISOString()
        }));

        sentActivities.forEach(activity => this.activityObserver.next(activity));

        return Promise.resolve(sentActivities.map(activity => {
            return { id: activity.id };
        }));
    }

    /**
     * Registers the business logic for the adapter, it takes a handler that takes a TurnContext object as a parameter.
     * @param {function} logic The driver code of the developer's bot application. This code receives and responds to user messages.
    */
    public processActivity(logic: MyLogic): this {
        this.logic = logic;

        // console.debug('Adapter. processActivity:', logic);

        return this;
    }

    /**
     * Runs the bot's middleware pipeline in addition to any business logic, if `this.logic` is found.
     * @param {Activity} activity
     */
    public onReceive(activity: Partial<Activity>): Promise<void> {
        const context = new TurnContext(this, activity);

        // console.debug('Adapter. onReceive:', activity);

        // Runs the middleware pipeline followed by any registered business logic.
        // If no business logic has been registered via processActivity, a default
        // value is provided as to not break the bot.
        return this.runMiddleware(context, this.logic); // || function() { });
    }

    /* ----------------------------------------------------------------
     * Not implemented !
     * @see https://github.com/microsoft/botbuilder-js/blob/4.13.1/libraries/botbuilder-core/src/botAdapter.ts#L54-L98;
     */

    async continueConversation(/* r: Partial<ConversationRef>, l: MyLogic */) {
        this.notImplemented('continueConversation');
    }

    async updateActivity(/* c: TurnContext, a: Partial<Activity> */) {
        this.notImplemented('updateActivity');
    }

    async deleteActivity(/* c: TurnContext, r: Partial<ConversationRef> */) {
        this.notImplemented('deleteActivity');
    }

    protected notImplemented (methodName: string): void {
        console.warn(`> Not implemented: ${methodName}`);
    }
}
