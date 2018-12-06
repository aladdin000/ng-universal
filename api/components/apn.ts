import * as apn from 'apn';

let con: any;

const errorHandle = (error: any, note: any) => {
    console.log('APN connection error: ', + error + ':' + note);
};

// Initialize logger

export const init = (connection: any) => {
    if (connection !== null && typeof connection !== 'undefined') {
        con = connection;
    } else {
        const options = {
            token: {
              key: 'path/to/APNsAuthKey_XXXXXXXXXX.p8',
              keyId: 'key-id',
              teamId: 'developer-team-id'
            },
            production: false
          };

        const apnProvider = new apn.Provider(options);
    }
    console.log('APN connection established: ' + con);
};

export const get = () => {
    return con;
};
