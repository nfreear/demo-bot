/**
 * App configuration.
 */

const CONFIG = {
    analyticsId: 'UA-8330079-11',
    locale: 'en-GB',
    speechCfg: {
        region: 'uksouth',
        // @ts-ignore // eslint-disable-next-line
        subscriptionKey: __WP_SPEECH_KEY__,
    }
};

export function getAppConfig() {
    console.debug('App config:', CONFIG);

    return CONFIG;
}
