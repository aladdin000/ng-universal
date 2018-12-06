# garp.org 2.0

##### What's Being Used?

* [Angular](https://angular.io/) for managing the presentation logic of the application.
* [Typescript](https://www.typescriptlang.org/) for frontend and backend APIs
* [WebPack](http://webpack.github.io/) for bundling code down to a single file and enabling hot module reloading.
* [Express](http://expressjs.com) for serving up the development server.
* [JSforce](https://jsforce.github.io/) for getting data from Salesforce
* [MongoDB](https://www.mongodb.com/) for serving up the JSON data
* [Redis](https://redis.io/) for caching the API response data from Salesforce
* [Mocha](http://mochajs.com) + [Chai](http://chaijs.com) for testing.


## Getting Started
In order to get started developing, you'll need to do a few things first.

1. Install all of the `node_modules` required for the package. Depending on your computer's configuration, you may need to prefix this command with a `sudo`.
```
npm install
```
or
```
sudo npm install
```

2. Install MongoDB and Redis

Install on Windows
- Please reference this [article](https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/)

Install on Unix
- Please reference this [article](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04)

3. Run MongoDB and Redis

To run MongoDB server, run this command in terminal
```
mongod
```

To run Redis server, run this command in terminal or directly run the redis-server.exe if you're on windows.
```
redis-server
```

4. Build frontend and backend
```
npm run build
```
or
```
sudo npm run build
```

5. Run server.js in build directory and head over to [http://localhost:9700](http://localhost:9700) to see your app live!

```
node ./dist/server.js
```

## File Structure

### dist/

This is where your application will be compiled.  Assets, like images and fonts, should be placed directly within this folder.  Also in this folder is a default `server.js` file for serving up the application.

### src/

The client folder houses the client Angular universal application for your project.  This is where your client-side Angular components (and their directly accompanying styles) live.

### api/

This folder includes all backend codes for serving up REST APIs for the frontend
