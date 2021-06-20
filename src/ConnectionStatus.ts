/**
 * `ConnectionStatus` extracted from Microsoft's "BotFramework-DirectLineJS" library.
 *
 * @see https://github.com/microsoft/BotFramework-DirectLineJS/blob/v0.14.1/src/directLine.ts#L354-L361;
 */

// import { ConnectionStatus } from 'botframework-directlinejs';

// These types are specific to this client library, not to Direct Line 3.0

export enum ConnectionStatus {
    Uninitialized = 0,              // the status when the DirectLine object is first created/constructed
    Connecting = 1,                 // currently trying to connect to the conversation
    Online = 2,                     // successfully connected to the conversation. Connection is healthy so far as we know.
    ExpiredToken = 3,               // last operation errored out with an expired token. Possibly waiting for someone to supply a new one.
    FailedToConnect = 4,            // the initial attempt to connect to the conversation failed. No recovery possible.
    Ended = 5                       // the bot ended the conversation
}

/* ConnectionStatus: {
  "0": "Uninitialized",
  "1": "Connecting",
  "2": "Online",
  "3": "ExpiredToken",
  "4": "FailedToConnect",
  "5": "Ended",
  "Uninitialized": 0,
  "Connecting": 1,
  "Online": 2,
  "ExpiredToken": 3,
  "FailedToConnect": 4,
  "Ended": 5
} */
