# Bulls AI
Webservice for Stock Market Prediction

## How To Run the Project

### Setup Git Repository:
``` 
git clone https://github.com/Darrel-Koh/Bulls-AI.git

System may prompt you request for your credentials,  replace <username> with your desired username and <email> with your email address. Dont need <>
These commands configure Git to associate your name and email with the commits you make on your repository. 
git config user.name <username>
git config user.email <email>
```
### Setup environment:
```
Create the file `mern/server/config.env` with your Atlas URI, NODE_ENV, PORT, REACT_APP_API_URL, HEROKU_APP
Create the file `mern/client/.env` with the localhost port

Start server:
cd mern/server
npm install (only for first time)
npm start


Start Web server:
cd mern/client
npm install (only for first time)
npm start

```
### Before you start coding:
```
git status (To check current status of your git progress)
git fetch (To fetch Teammates changes before starting)
git pull (To complete fetching changes)
```

### After make changes:
```
git status (To check current status of your git progress)
git fetch (To fetch Teammates changes before starting)
git pull(To confirm pull in Teammates changes)
git commit -m (To commit changes, and include a message)
git push (To push changes to the main repo)
```

### To start a new feature:
```
git checkout -b <new-branch-name> (Creates a new branch for a new feature)
git commit -m (To commit changes, and include a message)
git push (To push changes to the Branch repo)
git push origin <new-branch-name> (Push new changes in branch from local machine to main)

- If just want to retrieve main changes but dont want your current code to affect main branch
git fetch origin main
git merge origin/main

```

### Do use the following commands to help

```
git clone https://github.com/Darrel-Koh/Bulls-AI.git

git status (To check current status of your git progress)

git fetch (To fetch Teammates changes before starting)

git pull (To confirm pull in Teammates changes)

git checkout -b <new-branch-name> (Creates a new branch for a new feature)

git push origin <new-branch-name> (Push new branch from local machine to main)

git switch <file-name> (Switch between branches)

git commit -m (To commit changes, and include a message)

git push (To push changes to the main repo)
```