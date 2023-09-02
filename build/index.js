"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _db = _interopRequireDefault(require("./db.js"));
var _mongodb = _interopRequireDefault(require("mongodb"));
var _auth = _interopRequireDefault(require("./auth"));
var app = (0, _express["default"])(); // instanciranje aplikacije
var port = process.env.PORT; // port na kojem će web server slušati

app.use((0, _cors["default"])());
app.use(_express["default"].json()); // automatski dekodiraj JSON poruke

app.get('/tajna', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // nakon što se izvrši auth.verify middleware, imamo dostupan req.jwt objekt
          res.status(200).send('tajna korisnika ' + req.jwt.username);
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.post('/auth', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var user, username, password, result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          user = req.body;
          username = user.username;
          password = user.password;
          _context2.prev = 3;
          _context2.next = 6;
          return _auth["default"].authenticateUser(username, password);
        case 6:
          result = _context2.sent;
          res.status(201).json(result);
          _context2.next = 13;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](3);
          res.status(500).json({
            error: _context2.t0.message
          });
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 10]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.post('/users', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var user, result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          user = req.body;
          _context3.prev = 1;
          _context3.next = 4;
          return _auth["default"].registerUser(user);
        case 4:
          result = _context3.sent;
          res.status(201).send();
          _context3.next = 11;
          break;
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: _context3.t0.message
          });
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 8]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
app.get('/clients/username/:username', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var username, db, cursor, results;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          username = req.params.username;
          _context4.next = 3;
          return (0, _db["default"])();
        case 3:
          db = _context4.sent;
          _context4.next = 6;
          return db.collection("clients").find({
            'username': username
          }).sort({
            'clientName': 1
          });
        case 6:
          cursor = _context4.sent;
          _context4.next = 9;
          return cursor.toArray();
        case 9:
          results = _context4.sent;
          res.json(results);
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
app.post('/clients', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var data, db, result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          data = req.body;
          delete data._id;
          _context5.next = 4;
          return (0, _db["default"])();
        case 4:
          db = _context5.sent;
          _context5.next = 7;
          return db.collection("clients").insertOne(data);
        case 7:
          result = _context5.sent;
          if (result && result.insertedCount == 1) {
            res.json(result.ops[0]);
          } else {
            res.json({
              status: "fail"
            });
          }
        case 9:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
app.get('/clients/:id', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var id, db, document;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.next = 3;
          return (0, _db["default"])();
        case 3:
          db = _context6.sent;
          _context6.next = 6;
          return db.collection('clients').findOne({
            _id: _mongodb["default"].ObjectId(id)
          });
        case 6:
          document = _context6.sent;
          res.json(document);
        case 8:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
app.get('/suppliers/:clientId', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var clientId, db, cursor, results;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          clientId = req.params.clientId;
          _context7.next = 3;
          return (0, _db["default"])();
        case 3:
          db = _context7.sent;
          _context7.next = 6;
          return db.collection("suppliers").find({
            'clientId': clientId
          }).sort({
            'supplierName': 1
          });
        case 6:
          cursor = _context7.sent;
          _context7.next = 9;
          return cursor.toArray();
        case 9:
          results = _context7.sent;
          res.json(results);
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
app.post('/suppliers', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var data, db, result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          data = req.body;
          delete data._id;
          _context8.next = 4;
          return (0, _db["default"])();
        case 4:
          db = _context8.sent;
          _context8.next = 7;
          return db.collection("suppliers").insertOne(data);
        case 7:
          result = _context8.sent;
          if (result && result.insertedCount == 1) {
            res.json(result.ops[0]);
          } else {
            res.json({
              status: "fail"
            });
          }
        case 9:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
app.get('/buyers/:clientId', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var clientId, db, cursor, results;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          clientId = req.params.clientId;
          _context9.next = 3;
          return (0, _db["default"])();
        case 3:
          db = _context9.sent;
          _context9.next = 6;
          return db.collection("buyers").find({
            'clientId': clientId
          }).sort({
            'buyerName': 1
          });
        case 6:
          cursor = _context9.sent;
          _context9.next = 9;
          return cursor.toArray();
        case 9:
          results = _context9.sent;
          res.json(results);
        case 11:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
app.post('/buyers', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var data, db, result;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          data = req.body;
          delete data._id;
          _context10.next = 4;
          return (0, _db["default"])();
        case 4:
          db = _context10.sent;
          _context10.next = 7;
          return db.collection("buyers").insertOne(data);
        case 7:
          result = _context10.sent;
          if (result && result.insertedCount == 1) {
            res.json(result.ops[0]);
          } else {
            res.json({
              status: "fail"
            });
          }
        case 9:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}());
app.get('/ura/:clientId', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var clientId, db, cursor, results;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          clientId = req.params.clientId;
          _context11.next = 3;
          return (0, _db["default"])();
        case 3:
          db = _context11.sent;
          _context11.next = 6;
          return db.collection("ura").find({
            'clientId': clientId
          }).sort({
            'rbr': 1
          });
        case 6:
          cursor = _context11.sent;
          _context11.next = 9;
          return cursor.toArray();
        case 9:
          results = _context11.sent;
          res.json(results);
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}());
app.get('/ura/:clientId/:dateFrom/:dateTo', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var clientId, dateFrom, dateTo, db, cursor, results;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          clientId = req.params.clientId;
          dateFrom = new Date(req.params.dateFrom);
          dateTo = new Date(req.params.dateTo);
          _context12.next = 5;
          return (0, _db["default"])();
        case 5:
          db = _context12.sent;
          _context12.next = 8;
          return db.collection("ura").find({
            'date': {
              $gte: dateFrom,
              $lte: dateTo
            },
            'clientId': clientId
          }).sort({
            'rbr': 1
          });
        case 8:
          cursor = _context12.sent;
          _context12.next = 11;
          return cursor.toArray();
        case 11:
          results = _context12.sent;
          res.json(results);
        case 13:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}());
app.post('/ura', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var data, db, result;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          data = req.body;
          delete data._id;
          data.date = new Date(data.date);
          _context13.next = 5;
          return (0, _db["default"])();
        case 5:
          db = _context13.sent;
          _context13.next = 8;
          return db.collection("ura").insertOne(data);
        case 8:
          result = _context13.sent;
          if (result && result.insertedCount == 1) {
            res.json(result.ops[0]);
          } else {
            res.json({
              status: "fail"
            });
          }
        case 10:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return function (_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}());
app.get('/ira/:clientId', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    var clientId, db, cursor, results;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          clientId = req.params.clientId;
          _context14.next = 3;
          return (0, _db["default"])();
        case 3:
          db = _context14.sent;
          _context14.next = 6;
          return db.collection("ira").find({
            'clientId': clientId
          }).sort({
            'rbr': 1
          });
        case 6:
          cursor = _context14.sent;
          _context14.next = 9;
          return cursor.toArray();
        case 9:
          results = _context14.sent;
          res.json(results);
        case 11:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return function (_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}());
app.post('/ira', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res) {
    var data, db, result;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          data = req.body;
          delete data._id;
          data.date = new Date(data.date);
          _context15.next = 5;
          return (0, _db["default"])();
        case 5:
          db = _context15.sent;
          _context15.next = 8;
          return db.collection("ira").insertOne(data);
        case 8:
          result = _context15.sent;
          if (result && result.insertedCount == 1) {
            res.json(result.ops[0]);
          } else {
            res.json({
              status: "fail"
            });
          }
        case 10:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return function (_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}());
app.get('/ira/:clientId/:dateFrom/:dateTo', [_auth["default"].verify], /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res) {
    var clientId, dateFrom, dateTo, db, cursor, results;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          clientId = req.params.clientId;
          dateFrom = new Date(req.params.dateFrom);
          dateTo = new Date(req.params.dateTo);
          _context16.next = 5;
          return (0, _db["default"])();
        case 5:
          db = _context16.sent;
          _context16.next = 8;
          return db.collection("ira").find({
            'date': {
              $gte: dateFrom,
              $lte: dateTo
            },
            'clientId': clientId
          }).sort({
            'rbr': 1
          });
        case 8:
          cursor = _context16.sent;
          _context16.next = 11;
          return cursor.toArray();
        case 11:
          results = _context16.sent;
          res.json(results);
        case 13:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return function (_x31, _x32) {
    return _ref16.apply(this, arguments);
  };
}());
app.listen(port, function () {
  return console.log("Slu\u0161am na portu ".concat(port, "!"));
});