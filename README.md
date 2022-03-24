# DU-HW12-Employee-Tracker

DU Coding Bootcamp Homework 12: SQL Employee Tracker

# node.js application
This is a node.js script relying on NPM package **inquirer** that will generate a file on the local filesystem of the server in the **./dist directory**. It writes to local storage and does not have functionality built in to clear the local storage objects.

Github Repository Address: <https://github.com/GittinIt6/DU-HW12-Employee-Tracker>

See walkthrough/demonstration video at <https://youtu.be/l9fSH9553IE>

## Purpose

This application is specific to anyone that wants to generate an html website showing the manager and members of their team.

## Instructions
1. Ensure you have downloaded and installed node.js and have rebooted your system (if Windows)
2. Clone repository to your system.
3. From a terminal, ensure you are in the index.js directory
4. Run:
~~~
npm i
node index.js
~~~
5. A rendered output of index.html and style.css will be saved into your **./dist** directory

### Testing with jest
1. Ensure you are the in the index.js directory
2. Run:
~~~
npm test
~~~

## Audience

The intended audience is an individual that would like to generate an html website with employee info.

&#x2611; **Technical Knowledge:**
The user of this site does need to have a technical background, and *should* understand node.js capabilities.

## Technical Detail

This application uses node.js with **fs** and **require**.

The files are configured as follows:
```
Root Directory/
|
│ --index.js
│ --package.json
│ --.gitignore
│ --readme.md
|
└───__tests__/ (folder)
│   ├── Employee.test.js
│   ├── Engineer.test.js
│   ├── Intern.test.js
│   └── Manager.test.js
└───dist/ (folder)
|     --your rendered readme.md
|
└───lib/ (folder)
|
└───src/ (folder)
```
>**node.js**: This site uses node.js <https://nodejs.org/>

>**fs**: This site uses node.js built in fs module <https://nodejs.dev/learn/the-nodejs-fs-module>

>**inquirer NPM package**: This site uses inquirer <https://www.npmjs.com/package/inquirer>

>**jest for testing**: This site uses jest <https://jestjs.io/>

### Data Flow Diagram:

![data flow diagram](./git-files/data-flow.PNG)

## Revision History 

1. This application was created in March 2022 as part of a bootcamp assignment. It was created from scratch with requirements given by the instructor.