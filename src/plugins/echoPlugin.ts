/**
 *
 * @author NDF, 26-June-2021.
 */

import { defaultContainer, Clonable, Container } from '@nlpjs/core';
import { NlpResult, NlpPlugin } from '../nlpjsTypes';

export class EchoPlugin extends NlpPlugin {
    constructor (settings: any = {}, container: Container) {
        super({
            settings: {},
            container: settings.container || container || defaultContainer
        },
        container
        );

        this.name = 'echoPlugin';
    }

    public run (input: Partial<NlpResult>): NlpResult | Promise<NlpResult> {
        const message = input.utterance;

        console.debug('EchoPlugin ~ run:', input);

        input.answer = input.text = `You said "${ message }" (echo)`;

        return input;
    }
}
