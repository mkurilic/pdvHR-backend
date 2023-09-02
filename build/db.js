"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongodb = _interopRequireDefault(require("mongodb"));
var connection_string = process.env.CONNECTION_STRING;
var client = new _mongodb["default"].MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = null;

// eksportamo Promise koji resolva na konekciju
var _default = function _default() {
  return new Promise(function (resolve, reject) {
    // ako smo inicijalizirali bazu i klijent je još uvijek spojen
    if (db && client.isConnected()) {
      resolve(db);
    } else {
      client.connect(function (err) {
        if (err) {
          reject('Spajanje na bazu nije uspjelo:' + err);
        } else {
          console.log('Database connected successfully!');
          db = client.db('pdvHR');
          resolve(db);
        }
      });
    }
  });
};
exports["default"] = _default;