### Learn React

I'm learning React by reading the tutorial (https://reactjs.org/tutorial/tutorial.html). 
This project contains the source code of the tutorial.

The objective of the tutorial is to implement Tic Tac Toe game.

### Deploy using rsync

First, specify the remote path by adding `deploy_path` variable, in `.npmrc`.
```
deploy_path = deployuser@server.domain:/path/to/static/files/
```

Then, you can run `npm run deploy:prod` to deploy the app. The script will sync your remote path.

