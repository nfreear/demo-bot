/**
 * Analytics without cookies ~ Yay!
 *
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#using_localstorage_to_store_the_client_id;
 */

const ANALYTICS_ID: string = 'UA-8330079-11';
const GA_LOCAL_STORAGE_KEY: string = 'ga:clientId';
const GA_DEBUG = false;

export class Analytics {
    protected analyticsId: string;
    protected debug: boolean;
    //.
    public constructor(analyticsId = ANALYTICS_ID, debug = GA_DEBUG) {
        this.analyticsId = analyticsId;
        this.debug = debug;

        this.injectScript();
        this.sendPageView();
    }

    protected injectScript(): void {
        /* eslint-disable */
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        /* @ts-ignore */
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script',`https://www.google-analytics.com/analytics${this.debug ? '_debug' : ''}.js`,'ga');
        /* eslint-enable */
    }

    protected sendPageView(): void {
        const ga = (window as any).ga;

        if (window.localStorage) {
            ga('create', this.analyticsId, {
                'storage': 'none',
                'clientId': localStorage.getItem(GA_LOCAL_STORAGE_KEY)
            });
            ga((tracker: any): void => {
                localStorage.setItem(GA_LOCAL_STORAGE_KEY, tracker.get('clientId'));
            });
        } else {
            ga('create', this.analyticsId, 'auto');
        }

        ga('send', 'pageview');

        console.debug('Analytics ~ sendPageView:', this.analyticsId);
    }
}
