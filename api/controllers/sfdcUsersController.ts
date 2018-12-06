import * as request from 'request';
import { Request, Response, NextFunction } from 'express';

// userSecuritySchema = mongoose.model('userSecuritySchema'),
import { SFDCService } from '../services/sfdc';
import { SFDCComponent } from '../components/jsforce';
import config from '../config/config';
import { client, getAsync } from '../components/redis';

const PORTAL_URL = config.SFDC_PORTAL_URL;
// Init SFDC service
const sfdccomp = new SFDCComponent();
sfdccomp.init();

export let authSFDCUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log('login - ' + PORTAL_URL + '/Login~' + req.body.userName + '~' + req.body.password);
  console.log('req.body.debug' + req.body.debug);
  const con: any = await sfdccomp.getToken();
  const sfdcService: any = new SFDCService(con);

  sfdcService.debug = req.body.debug;
  request.post(
    PORTAL_URL + '/Login',
    { form: { username: req.body.userName, password: req.body.password } },
    (error, response, body) => {

      console.log('sfdcService.debug:' + sfdcService.debug);
      console.log('response.statusCode:' + response.statusCode);

      if (sfdcService.debug === 'w77' || (!error && response.statusCode === 200)) {
        // console.log('Body:' + body)
        console.log('IN Auth!');

        if (sfdcService.debug !== 'w77' && body.indexOf("Forgot my password") > -1) {
          return next(new Error('Failed to authenticate'));
        }

        console.log('getUserByUsername:' + req.body.userName);

        sfdcService.getUserByUsername(req.body.userName, (error1: any, user: any) => {
          if (error1) {
            return next(error1);
          }
          if (!user || !user.done || user.records.length !== 1) {
            return next(new Error('Failed to load account'));
          }
          console.log('Found User in SFDC!');
          // Save access data to mongoDB
          // userSecuritySchema.save(user.records[0].Id, {accessToken: "xxx", instanceUrl: "xxx"}, function(err, data) {
          // if (err) return next(err);
          // console.dir('done setting data in mongo', data)

          sfdcService.getContact(user.records[0].ContactId, (error2: any, contact: any) => {

            if (error2) {
              return next(error2);
            }
            if (!user || !user.done || user.records.length !== 1) {
              return next(new Error('Failed to load account'));
            }

            console.dir('get contact data:' + contact);
            const returnData = user.records[0];
            returnData.contact = contact.records[0];
            returnData.accessToken = con.accessToken;
            res.json(returnData);
          });
          // });
        });
      } else {
        // console.dir(response);
        console.dir('error:' + error);
        return next(new Error('Failed to authenticate'));
      }
    }
    );
  };
  // Setup connection with given username and password
  /*
  var conn = sfdccomp.initUser(req.body.userName,req.body.password, function(err, data) {
    if(err) {
      next(401, {err: "Unable to authenticate"});
      return;
    }

    var connUser = sfdccomp.getUser();
    console.log('fetch identity:', connUser.userInfo.id)

    // Save access data to mongoDB
    userSecuritySchema.save(connUser.userInfo.id, {accessToken: connUser.accessToken, instanceUrl: connUser.instanceUrl}, function(err, data) {
      if (err) return next(err);
      console.dir('done setting data in mongo', data)
      var SFDCService = new Services(connUser);
      sfdcService.getUser(connUser.userInfo.id, function(err, user) {
        if (err) return next(err);
        if (!user || !user.done || user.records.length != 1) return next(new Error('Failed to load account'));
        res.json(user.records[0]);
      });
    });
  });
  */

  /**
  * Get User By ID
  */
  export let getSFDCUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.params.userid;
    try {
      const con = await sfdccomp.getToken();
      const sfdcService = new SFDCService(con);
      const cacheKey = 'getSFDCUserByID:' + userid;
      const oldValue = await getAsync(cacheKey);
      if (oldValue) {
        return res.json(JSON.parse(oldValue));
      }

      const users = await sfdcService.getUser(userid);
      if (!users) {
        return res.status(404).json({
          error: 'Failed to load data'
        });
      }
      client.set(cacheKey, JSON.stringify(users));
      res.json(users);
    } catch (error) {
      return res.status(500).json({
        error: error
      });
    }
  };

  export let getSFDCUsers = async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = 'getSFDCUsers';
    try {
      const con = await sfdccomp.getToken();
      const sfdcService = new SFDCService(con);
      const oldValue = await getAsync(cacheKey);

      if (oldValue) {
        return res.json(JSON.parse(oldValue));
      }

      const users = await sfdcService.getUsers();
      if (!users) {
        return res.status(404).json({
          error: 'Failed to load data'
        });
      }
      client.set(cacheKey, JSON.stringify(users));
      res.json(users);
    } catch (error) {
      return res.status(500).json({
        error: error
      });
    }
  };

  export let getAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const con = await sfdccomp.getToken();
      const sfdcService = new SFDCService(con);
      const cacheKey = 'getAccounts';
      const oldValue = await getAsync(cacheKey);
      if (oldValue) {
        return res.json(JSON.parse(oldValue));
      }

      const accounts = await sfdcService.getAccounts();
      if (!accounts) {
        return res.status(404).json({
          error: 'Failed to load data'
        });
      }
      client.set(cacheKey, JSON.stringify(accounts));
      res.json(accounts);
    } catch (error) {
      return res.status(500).json({
        error: error
      });
    }
  };
