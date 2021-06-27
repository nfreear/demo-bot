/**
 * A quote of the day plugin, using an external REST API.
 *
 * @author NDF, 26-June-2021.
 */

import { defaultContainer, Clonable, Container } from '@nlpjs/core';
import { NlpResult, NlpPlugin } from '../nlpjsTypes';

const fetch = window.fetch;

const PROXY_URL = 'https://proxy.hackeryou.com/?xmlToJSON=true&reqUrl='; // 502!
const QUOTE_URL = 'https://quotes.rest/qod?language=en';

export class QuotePlugin extends NlpPlugin {
    public name: string;

    constructor (settings: any = {}, container: Container) {
        super({
            settings: {},
            container: settings.container || container || defaultContainer
        },
        container
        );

        this.name = 'quotePlugin';
    }

    protected xmlToJsonProxyUrl(url: string): string {
        return `${PROXY_URL}${encodeURIComponent(url)}`;
    }

    public run (input: Partial<NlpResult>): Promise<NlpResult> {
        return new Promise((resolve, reject) => {
            fetch(QUOTE_URL, {
                headers: { accept: 'application/json' },
                mode: 'cors',
            }).then(response => response.json())
              .then(data => {
                const { quote, author } = data && data.contents.quotes[0];

                input.answer = input.text = `“${quote}” by ${author} via TheySaidSo`;

                console.debug('quotePlugin ~ run:', data, input);

                resolve(input);
            });
        });
    }
}
