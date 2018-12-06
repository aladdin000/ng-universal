export default {
    // Note we depend on NODE_ENV being set to dictate which of the env variables below get loaded at runtime.
    // See README for more details.

    // Root Url in development environment
    ROOT_URL: 'http://localhost',

    // Get this from https://mlab.com/home after you've logged in and created a database
    MONGODB_URI: 'mongodb://garpdev:mongolab2013AG@ds033639.mongolab.com:33639/garpdev',

    // This is standard running mongodb locally
    MONGODB_URI_LOCAL: 'mongodb://localhost:27017',

    // Put lots of randomness in these
    SESSION_SECRET: 'garpsecret2018ashdfjhasdlkjfhalksdjhflakgarpsecret2018',

    // Facebook keys - register your app and get yours here: https://developers.facebook.com/
    FACEBOOK_ID: '',
    FACEBOOK_SECRET: '',

    CACHE: false,
    DEBUG: true,

    RISKFOLDERID: 'a1h40000001iuh8',

    // PayPal Information
    PAYPALDATA1: 'PARTNER=PayPal&PWD=test123456&VENDOR=vivekreddy1234&USER=vivekreddy1234&TENDER=C&ACCT=',
    PAYPALDATA2: '&TRXTYPE=S&EXPDATE=',
    PAYPALDATA3: '&AMT=',
    PAYPALURL: 'https://pilot-payflowpro.paypal.com',

    // Salesforce Information
    SFDC_PORTAL_URL: 'https://preprod-mygarp.cs66.force.com',
    SFDC_LOGINURL: 'https://preprod-mygarp.cs66.force.com',
    SFDC_USERNAME: 'integrations@garp.com.preprod',
    SFDC_PASSWORD: '43r267tgr284vdr247$#&XwsdytFVi6uc5E',
    SFDC_TOKEN: 'hfR3QMkGY55x1sC7Yi094Mbg',
    APP_NAME: 'GARP'
};
