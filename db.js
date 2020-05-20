"use strict";

const mongoose = require('mongoose');

const server = '127.0.0.1:27017';

class Database {
  constructor(database) {
    this.database = database;
  }

  connect() {
  return new Promise((resolve, reject)=>{
    
     mongoose.connect(`mongodb://${server}/${this.database}`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
       .then(db => {
         resolve(db);
        })
       .catch(err => {
         reject(err);
       });
  });
  }
  disconnect() {
    mongoose.disconnect();
  }
}


let fidsRegister = new mongoose.Schema({
  airport: {
    type: String,
    required: true
  },
  country: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  arrUrl: {
    type: String,
    required: true
  },
  depUrl: {
    type:String,
    required:true
  },
  page_id:Number,
  status: String,
  fids: Array,
  createdAt: Date,
  updatedAt: Date
});

fidsRegister.pre('save', function (next) {
  let now = new Date(Date.now()).toUTCString();
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  next(); 
});

module.exports.fidsModel = mongoose.model('FIDS', fidsRegister);

module.exports.DB = Database;