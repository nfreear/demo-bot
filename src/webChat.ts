/**
 * Wrapper for global `window.WebChat`.
 *
 * @see https://stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript;
 */

// Was: import { renderWebChat } from 'botframework-webchat';

// @\\ts-ignore "Property 'WebChat' does not exist on type 'Window & typeof globalThis'."
export const WebChat = (window as any).WebChat;

export const { createStore, renderWebChat } = WebChat;

export function getWebChatVersion() : string {
    const META: Element = document.querySelector('meta[ name = "botframework-webchat:core:version" ]');

    return META ? META.getAttribute('content') : null;
}

// End.
