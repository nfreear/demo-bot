/*
 * Wrapper for global `window.WebChat`.
 */

// Was: import { renderWebChat } from 'botframework-webchat';

// @ts-ignore
export const WebChat = window.WebChat;

export const { createStore, renderWebChat } = WebChat;

export function getWebChatVersion() : string {
    const META: Element = document.querySelector('meta[ name = "botframework-webchat:core:version" ]');

    return META ? META.getAttribute('content') : null;
}

/* export {
    createStore, renderWebChat, WebChat
}; */

// End.
