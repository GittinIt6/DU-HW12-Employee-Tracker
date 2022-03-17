const express = require('inquirer');
const const mysql = require('mysql2');

const db = mysql.createConnection(
    {
    host: '192.168.147.181',
    user: 'sqladmin',
    password: 'sqladmin1',
    database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
  );

