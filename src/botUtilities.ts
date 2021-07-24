/**
 * Bot-backend utility functions.
 *
 * @copyright © Nick Freear, 28-June-2021.
 */

import { TurnContext } from 'botbuilder-core';

export const MAX_DELAY_MS: number = 3000;

export async function sendTyping(ctx: TurnContext, delayMs: number = MAX_DELAY_MS): Promise<void> {
    await ctx.sendActivity({ type: 'typing' });
    await delay(delayMs);
}

export async function delay(delayMs: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), delayMs));
}

/* export async function delayValue(delayMs: number = 1000, value: any): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve(value), delayMs));
} */
