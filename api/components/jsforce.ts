import * as jsforce from 'jsforce';
import config from '../config/config';

const LOGINURL = config.SFDC_LOGINURL;
const USERNAME = config.SFDC_USERNAME;
const PASSWORD = config.SFDC_PASSWORD;
const TOKEN = config.SFDC_TOKEN;
export class SFDCComponent {
    constructor () {}

    connection: any;
    instanceUrl: any;
    accessToken: any;
    /**
     * initialize jsforce connection
     */
    init = () => {

        this.connection = new jsforce.Connection({
            loginUrl : LOGINURL
        });

        return new Promise((resolve, reject) => {
            this.connection.login(USERNAME, PASSWORD + TOKEN, (err: any, res: any) => {
                if (err) {
                    console.log('SFDC Connection Completed With Error: ',  err);
                    reject(err);
                }
                console.log('SFDC Connection Token: ' + this.connection.accessToken);
                console.log('SFDC Connection instanceUrl: ' + this.connection.instanceUrl);
                this.accessToken = this.connection.accessToken;
                this.instanceUrl = this.connection.instanceUrl;
                resolve(res);
            });
        });
    }
    /**
     * get current jsforce connection
     * @returns jsforce connection
     */
    getConnection = () => {
        return this.connection;
    }
    /**
     * get current jsforce connection token
     */
    getToken = async () => {

        const conToken = new jsforce.Connection({
            instanceUrl: this.instanceUrl,
            accessToken: this.accessToken
        });
        return conToken;
    }
}
