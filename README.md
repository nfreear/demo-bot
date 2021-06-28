
[![Node.js CI][ci-badge]][ci]

# browser-bot #

I am a demo Chat-bot that runs entirely in your browser. (_No server processing needed!_)

## Built on

I'm built on these third-party Javascript components:

* [NLP.js][]
* [Webchat.js][]
* [BotBuilder-core][]
* A custom [WebChatAdapter][ba]

[More credits](./docs/CREDIT.md).

## Usage

```sh
npm install
npm run lint
npm run build
npm start
```

...

---
© 2021 [Nick Freear][bg].

[bg]: https://nick.freear.org.uk/ "Nick Freear's blog"
[tw]: https://twitter.com/nfreear "Nick Freear '@nfreear' on Twitter"
[nlp.js]: https://github.com/axa-group/nlp.js
  "'NLP.js' is a general natural language utility for Node.js (AXA Group)"
[webchat.js]: https://github.com/microsoft/BotFramework-WebChat/releases/tag/v4.13.0
  "Bot Framework Web Chat Javascript component (Microsoft)"
[botbuilder-core]: https://github.com/microsoft/botbuilder-js/tree/main/libraries/botbuilder-core
  "… The core functionality for Bot Builder, but without any dependency on Node (Microsoft)"
[ba]: ./src/webChatAdapter.ts
  "Custom BotAdapter used for deploying a bot in a browser."
[corp]: ./bot/corpus-en.json "The corpus or phrase-list used to train the Bot."
[pl]: ./bot/pipelines.md "Pipeline that defines the Bot's behaviour."
[ci]: https://github.com/nfreear/demo-bot/actions/workflows/node.js.yml
[ci-badge]: https://github.com/nfreear/demo-bot/actions/workflows/node.js.yml/badge.svg

<!--
# browser echo sample

Bot Framework v4 browser bot sample

The example shows the use of the `botbuilder-js` SDKs for the browser using the [BotFramework-WebChat](https://github.com/Microsoft/BotFramework-WebChat) and a custom [WebChatAdapter][1].

## To try this sample

- Clone the repository

    ```bash
    git clone https://github.com/microsoft/botbuilder-samples.git
    ```

- In a terminal, navigate to `samples/javascript_es6/01.browser-echo`

    ```bash
    cd samples/javascript_es6/01.browser-echo
    ```

- Install modules

    ```bash
    npm install
    ```

- Build the sample

    ```bash
    npm run build
    ```

- Start the bot

    ```bash
    npm start
    ```

- Launch a web browser and navigate to [http://localhost:8080](http://localhost:8080).

## Adapters

Developers can use the [BotAdapter](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter) abstract base class to implement their own custom adapters.
Implementing a custom adapter allows users to connect bots to channels not supported by the [Bot Framework](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-manage-channels?view=azure-bot-service-4.0).
In this sample, a custom [WebChatAdapter][1] has been implemented so that the entirety of the bot is hosted in a user's browser.

Hosting a bot in the browser provides these benefits:

- A bot hosted in the user's browser has improved latency as there is no round-trip from the browser to a server hosting the bot.
- One engineering team in charge of bot design and the website. This can lead towards a more integrated UX and speed up development.
- A browser hosted bot can offload some of the work done by your servers by passing it to the user's machine.

## Further reading

- [Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Bot State and storage](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-storage-concept?view=azure-bot-service-4.0)
-->
  [1]: ./src/webChatAdapter.ts
