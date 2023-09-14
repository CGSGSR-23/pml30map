/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Vec3 = /** @class */ (function () {
    function Vec3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vec3.prototype.copy = function () {
        return new Vec3(this.x, this.y, this.z);
    }; /* copy */
    Vec3.prototype.add = function (rhs) {
        return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }; /* add */
    Vec3.prototype.sub = function (rhs) {
        return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }; /* sub */
    Vec3.prototype.mul = function (rhs) {
        if (rhs instanceof Vec3)
            return new Vec3(this.x * rhs.x, this.y * rhs.y, this.z * rhs.z);
        return new Vec3(this.x * rhs, this.y * rhs, this.z * rhs);
    }; /* mul */
    Vec3.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }; /* length */
    Vec3.prototype.distance = function (rhs) {
        var dx = this.x - rhs.x, dy = this.y - rhs.y, dz = this.z - rhs.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }; /* distance */
    Vec3.prototype.dot = function (rhs) {
        return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
    }; /* dot */
    Vec3.prototype.cross = function (rhs) {
        return new Vec3(this.y * rhs.z - rhs.y * this.z, this.z * rhs.x - rhs.z * this.x, this.x * rhs.y - rhs.x * this.y);
    }; /* cross */
    Vec3.prototype.normalize = function () {
        var len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return new Vec3(this.x / len, this.y / len, this.z / len);
    }; /* normalize */
    Vec3.prototype.neg = function () {
        return new Vec3(-this.x, -this.y, -this.z);
    }; /* neg */
    Vec3.fromSpherical = function (azimuth, elevation, radius) {
        if (radius === void 0) { radius = 1; }
        return new Vec3(radius * Math.sin(elevation) * Math.cos(azimuth), radius * Math.cos(elevation), radius * Math.sin(elevation) * Math.sin(azimuth));
    }; /* sphericalToCartesian */
    return Vec3;
}()); /* Vec3 */
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        this.x = x;
        this.y = y;
    } /* constructor */
    Vec2.prototype.copy = function () {
        return new Vec2(0, 0);
    };
    Vec2.prototype.add = function (rhs) {
        return new Vec2(this.x + rhs.x, this.y + rhs.y);
    }; /* add */
    Vec2.prototype.sub = function (rhs) {
        return new Vec2(this.x - rhs.x, this.y - rhs.y);
    }; /* sub */
    Vec2.prototype.mul = function (rhs) {
        if (rhs instanceof Vec2)
            return new Vec2(this.x * rhs.x, this.y * rhs.y);
        return new Vec2(this.x * rhs, this.y * rhs);
    }; /* mul */
    Vec2.prototype.length2 = function () {
        return this.x * this.x + this.y * this.y;
    }; /* length2 */
    Vec2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }; /* length */
    Vec2.prototype.dot = function (rhs) {
        return this.x * rhs.x + this.y * rhs.y;
    }; /* dot */
    Vec2.prototype.cross = function (rhs) {
        return this.x * rhs.y - rhs.x * this.y;
    }; /* cross */
    Vec2.prototype.normalize = function () {
        var len = Math.sqrt(this.x * this.x + this.y * this.y);
        return new Vec2(this.x / len, this.y / len);
    }; /* normalize */
    Vec2.prototype.neg = function () {
        return new Vec2(-this.x, -this.y);
    }; /* neg */
    Vec2.prototype.left = function () {
        return new Vec2(-this.y, this.x);
    }; /* right */
    Vec2.prototype.right = function () {
        return new Vec2(this.y, -this.x);
    }; /* right */
    return Vec2;
}()); /* Vec2 */

var _a = require("mongodb"), MongoClient = _a.MongoClient, ObjectId = _a.ObjectId;
function recreateID(array) {
    for (var i = 0; i < array.length; i++)
        if (array[i] != undefined)
            if (array[i]._id != undefined)
                array[i]._id = new ObjectId(array[i]._id); //delete array[i]._id;
    return array;
}
var DataBase = /** @class */ (function () {
    function DataBase() {
    }
    DataBase.prototype.init = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, db.collection("nodes")];
                    case 1:
                        _a.nodesC = _d.sent();
                        _b = this;
                        return [4 /*yield*/, db.collection("connections")];
                    case 2:
                        _b.connectionsC = _d.sent();
                        _c = this;
                        return [4 /*yield*/, db.collection("variables")];
                    case 3:
                        _c.varsC = _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //////////// Nodes
    DataBase.prototype.getNode = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodesC.findOne({ _id: new ObjectId(uri) })];
                    case 1:
                        node = _a.sent();
                        return [2 /*return*/, node];
                }
            });
        });
    };
    DataBase.prototype.updateNode = function (uri, newData) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodesC.updateOne({ _id: new ObjectId(uri) }, { $set: newData })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DataBase.prototype.delNode = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodesC.deleteOne({ _id: new ObjectId(uri) })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataBase.prototype.addNode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var insertedURI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodesC.insertOne(data)];
                    case 1:
                        insertedURI = (_a.sent()).insertedId;
                        return [2 /*return*/, insertedURI.id];
                }
            });
        });
    };
    DataBase.prototype.getNodeConnections = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var uriStr, cs, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        uriStr = "[" + new Uint8Array(uri).toString() + "]";
                        return [4 /*yield*/, this.connectionsC.find({ id1: uriStr })];
                    case 1: return [4 /*yield*/, (_c.sent()).toArray()];
                    case 2:
                        _b = (_a = (_c.sent())).concat;
                        return [4 /*yield*/, this.connectionsC.find({ id2: uriStr })];
                    case 3: return [4 /*yield*/, (_c.sent()).toArray()];
                    case 4:
                        cs = _b.apply(_a, [(_c.sent())]);
                        return [2 /*return*/, cs];
                }
            });
        });
    };
    DataBase.prototype.getAllConnections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connectionsC.find({})];
                    case 1: return [4 /*yield*/, (_a.sent()).toArray()];
                    case 2:
                        cs = _a.sent();
                        return [2 /*return*/, cs];
                }
            });
        });
    };
    DataBase.prototype.getNeighbours = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var uriStr, right, left, outN, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uriStr = "[" + new Uint8Array(uri).toString() + "]";
                        return [4 /*yield*/, this.connectionsC.find({ id1: uriStr })];
                    case 1: return [4 /*yield*/, (_a.sent()).toArray()];
                    case 2:
                        right = _a.sent();
                        return [4 /*yield*/, this.connectionsC.find({ id2: uriStr })];
                    case 3: return [4 /*yield*/, (_a.sent()).toArray()];
                    case 4:
                        left = _a.sent();
                        outN = [];
                        for (i = 0; i < right.length; i++)
                            outN[outN.length] = right[i].id2;
                        for (i = 0; i < left.length; i++)
                            outN[outN.length] = left[i].id1;
                        return [2 /*return*/, outN];
                }
            });
        });
    };
    //////////////////// Connections
    DataBase.prototype.addConnection = function (uri1, uri2) {
        return __awaiter(this, void 0, void 0, function () {
            var uri1Str, uri2Str, n1, n2, c1, insertedURI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (uri1 == uri2) // Check for connecting node with itself
                            return [2 /*return*/];
                        uri1Str = "[" + new Uint8Array(uri1).toString() + "]";
                        uri2Str = "[" + new Uint8Array(uri2).toString() + "]";
                        n1 = this.getNode(uri1);
                        n2 = this.getNode(uri2);
                        if (n1 == null || n2 == null) // Check for nodes validity
                            return [2 /*return*/];
                        return [4 /*yield*/, this.connectionsC.findOne({ id1: uri1Str, id2: uri2Str })];
                    case 1:
                        c1 = _a.sent();
                        return [4 /*yield*/, this.connectionsC.findOne({ id1: uri2Str, id2: uri1Str })];
                    case 2:
                        _a.sent();
                        if (c1 != null || c1 != null) // Check for connections existing
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.connectionsC.insertOne({ id1: uri1Str, id2: uri2Str })];
                    case 3:
                        insertedURI = (_a.sent()).insertedId;
                        console.log("Inserted URI: ");
                        console.log(insertedURI);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    DataBase.prototype.delConnection = function (uri1, uri2) {
        return __awaiter(this, void 0, void 0, function () {
            var uri1Str, uri2Str;
            return __generator(this, function (_a) {
                uri1Str = "[" + new Uint8Array(uri1).toString() + "]";
                uri2Str = "[" + new Uint8Array(uri2).toString() + "]";
                this.connectionsC.deleteOne({ id1: uri1Str, id2: uri2Str });
                this.connectionsC.deleteOne({ id1: uri2Str, id2: uri1Str });
                return [2 /*return*/, true];
            });
        });
    };
    ////////////// Indexes 
    DataBase.prototype.getDefNodeURI = function () {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.varsC.findOne({ var_name: "DefNodeURI" })];
                    case 1:
                        node = _a.sent();
                        if (node != null)
                            return [2 /*return*/, node.uri.buffer];
                        return [2 /*return*/, null];
                }
            });
        });
    };
    DataBase.prototype.setDefNodeURI = function (newURI) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNode(newURI)];
                    case 1:
                        if ((_a.sent()) == null)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.varsC.findOne({ var_name: "DefNodeURI" })];
                    case 2:
                        node = _a.sent();
                        if (!(node == null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.varsC.insertOne({ var_name: "DefNodeURI", uri: newURI })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.varsC.updateOne({ var_name: "DefNodeURI" }, { $set: { uri: newURI } })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, true];
                }
            });
        });
    };
    DataBase.prototype.getAllNodeURIs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodes, outURIs, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodesC.find({})];
                    case 1: return [4 /*yield*/, (_a.sent()).toArray()];
                    case 2:
                        nodes = _a.sent();
                        outURIs = [];
                        for (i = 0; i < nodes.length; i++)
                            outURIs[i] = nodes[i]._id.id;
                        return [2 /*return*/, outURIs];
                }
            });
        });
    };
    DataBase.prototype.getAllNodesData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodesC.find({})];
                    case 1: return [4 /*yield*/, (_a.sent()).toArray()];
                    case 2:
                        nodes = _a.sent();
                        return [2 /*return*/, nodes];
                }
            });
        });
    };
    // Global data base functions
    DataBase.prototype.clearDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nodesC.deleteMany({})];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.connectionsC.deleteMany({})];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.varsC.deleteMany({})];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    DataBase.prototype.getDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, this.nodesC.find({}).toArray()];
                    case 1:
                        _a.nodes = _b.sent();
                        return [4 /*yield*/, this.connectionsC.find({}).toArray()];
                    case 2:
                        _a.connections = _b.sent();
                        return [4 /*yield*/, this.varsC.find({}).toArray()];
                    case 3: return [2 /*return*/, (_a.variables = _b.sent(),
                            _a)];
                }
            });
        });
    };
    DataBase.prototype.loadDB = function (newDB) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Clear Collection
                    return [4 /*yield*/, this.clearDB()];
                    case 1:
                        // Clear Collection
                        _a.sent();
                        if (!(newDB.nodes.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.nodesC.insertMany(recreateID(newDB.nodes))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(newDB.connections.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.connectionsC.insertMany(recreateID(newDB.connections))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(newDB.variables.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.varsC.insertMany(recreateID(newDB.variables))];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, true];
                }
            });
        });
    };
    DataBase.prototype.addDB = function (newDB) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(newDB.nodes.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.nodesC.insertMany(recreateID(newDB.nodes))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(newDB.connections.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.connectionsC.insertMany(recreateID(newDB.connections))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    return DataBase;
}());
var MongoDB = /** @class */ (function () {
    function MongoDB() {
    }
    MongoDB.prototype.init = function (mongodbURL, dbNames) {
        return __awaiter(this, void 0, void 0, function () {
            var mongodbClient, _a, dbs;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mongodbClient = new MongoClient(mongodbURL);
                        _a = this;
                        return [4 /*yield*/, mongodbClient.connect()];
                    case 1:
                        _a.mongodbConnection = _b.sent();
                        dbs = [];
                        return [4 /*yield*/, Promise.all(dbNames.map(function (name) { return __awaiter(_this, void 0, void 0, function () {
                                var db, _a, _b;
                                var _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            db = new DataBase();
                                            _b = (_a = db).init;
                                            return [4 /*yield*/, this.mongodbConnection.db(name)];
                                        case 1: return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
                                        case 2:
                                            _d.sent();
                                            dbs.push((_c = {}, _c[name] = db, _c));
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _b.sent();
                        this.dbs = {};
                        dbs.map(function (e) {
                            _this.dbs = __assign(__assign({}, _this.dbs), e);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return MongoDB;
}());

function LogMsg(msgName, input, output) {
    console.log("<--- MESSAGE '".concat(msgName, "' --->"));
    console.log("INPUT:");
    console.log(input);
    console.log("OUTPUT:");
    console.log(output);
}
var Client = /** @class */ (function () {
    function Client(mapsConfig, newMongo, socket, newAccessLevel) {
        var _this = this;
        this.mongodb = newMongo;
        console.log("Client connected with id: ".concat(socket.id));
        this.socket = socket;
        console.log('AAAAAAAAAAAAAa');
        console.log(this.mongodb.dbs);
        this.db = this.mongodb.dbs[0];
        if (socket.request._query.map != undefined && this.mongodb.dbs[socket.request._query.map] != undefined)
            this.db = this.mongodb.dbs[socket.request._query.map];
        socket.on("ping", function (value, res) {
            res(value);
        });
        socket.on("disconnect", function () {
            console.log("Client disconnected with id: ".concat(socket.id));
        });
        // Global DB requests
        socket.on("getAvailableDBs", function (res) {
            var names = mapsConfig.map(function (e) { return e.name; });
            LogMsg("getAvailableDBs", "", names);
            res(names);
        });
        socket.on("getDBInfo", function (name, res) { return __awaiter(_this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                info = {};
                mapsConfig.map(function (e) {
                    if (e.name == name)
                        info = e;
                });
                LogMsg("getDBInfo", name, info);
                res(info);
                return [2 /*return*/];
            });
        }); });
        socket.on("switchDB", function (name, res) { return __awaiter(_this, void 0, void 0, function () {
            var isValid;
            return __generator(this, function (_a) {
                isValid = false;
                mapsConfig.map(function (e) {
                    if (e.name == name)
                        isValid = false;
                });
                if (isValid)
                    this.db = this.mongodb.dbs[name];
                LogMsg("switchDB", name, isValid);
                res(isValid);
                return [2 /*return*/];
            });
        }); });
        socket.on("clearDBReq", function (res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.clearDB()];
                    case 1:
                        result = _a.sent();
                        LogMsg("getDefNodeURIReq", "", result);
                        res(result);
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on("getDBReq", function (res) { return __awaiter(_this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getDB()];
                    case 1:
                        db = _a.sent();
                        LogMsg("getDefNodeURIReq", "", db);
                        res(db);
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on("loadDBReq", function (db, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.loadDB(db)];
                    case 1:
                        result = _a.sent();
                        LogMsg("getDefNodeURIReq", db, result);
                        res(result);
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on("addDataReq", function (db, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.addDB(db)];
                    case 1:
                        result = _a.sent();
                        LogMsg("addDataReq", db, result);
                        res(result);
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on("getNearestReq", function (inPos, floor, res) { return __awaiter(_this, void 0, void 0, function () {
            var pos, nodesData, nearest, i, nPos, iPos, out;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pos = new Vec3(inPos.x, 0, inPos.z);
                        return [4 /*yield*/, this.db.getAllNodesData()];
                    case 1:
                        nodesData = _a.sent();
                        if (nodesData.length <= 0)
                            return [2 /*return*/, null];
                        nearest = nodesData[0];
                        for (i = 0; i < nodesData.length; i++) {
                            nPos = new Vec3(nearest.position.x, 0, nearest.position.z);
                            iPos = new Vec3(nodesData[i].position.x, 0, nodesData[i].position.z);
                            if (pos.sub(iPos).length() < pos.sub(nPos).length() && nodesData[i].floor === floor)
                                nearest = nodesData[i];
                        }
                        out = nearest._id.id;
                        LogMsg("getNearestReq", pos, out);
                        res(out);
                        return [2 /*return*/];
                }
            });
        }); });
        this.setupNodeRequests();
    } /* End of 'contsructor' function */
    Client.prototype.setupNodeRequests = function () {
        // Nodes
        var _this = this;
        this.socket.on("getNodeReq", function (uri, res) { return __awaiter(_this, void 0, void 0, function () {
            var outData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getNode(uri)];
                    case 1:
                        outData = _a.sent();
                        LogMsg("getNodeReq", uri, outData);
                        res(outData);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("addNodeReq", function (data, res) { return __awaiter(_this, void 0, void 0, function () {
            var newURI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.addNode(data)];
                    case 1:
                        newURI = _a.sent();
                        LogMsg("addNodeReq", data, newURI);
                        res(newURI);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("updateNodeReq", function (uri, data, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.updateNode(uri, data)];
                    case 1:
                        result = _a.sent();
                        if (result.modifiedCount === 1)
                            result = true;
                        else
                            result = false;
                        LogMsg("updateNodeReq", { uri: uri, data: data }, result);
                        res(result);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("delNodeReq", function (uri, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.delNode(uri)];
                    case 1:
                        result = _a.sent();
                        if (result.deletedCount === 1)
                            result = true;
                        else
                            result = false;
                        LogMsg("delNodeReq", uri, result);
                        res(result);
                        return [2 /*return*/];
                }
            });
        }); });
        // Connections
        this.socket.on("connectNodesReq", function (uris, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.addConnection(uris[0], uris[1])];
                    case 1:
                        result = _a.sent();
                        LogMsg("connectNodesReq", uris, result);
                        res(result);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("disconnectNodesReq", function (uris, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.delConnection(uris[0], uris[1])];
                    case 1:
                        result = _a.sent();
                        LogMsg("disconnectNodesReq", uris, result);
                        res(result);
                        return [2 /*return*/];
                }
            });
        }); });
        // Graph info
        this.socket.on("getNodeConnectionsReq", function (uri, res) { return __awaiter(_this, void 0, void 0, function () {
            var cs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getNodeConnections(uri)];
                    case 1:
                        cs = _a.sent();
                        LogMsg("getNodeConnectionsReq", uri, cs);
                        res(cs);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("getNeighboursReq", function (uri, res) { return __awaiter(_this, void 0, void 0, function () {
            var nNodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getNeighbours(uri)];
                    case 1:
                        nNodes = _a.sent();
                        LogMsg("getNeighboursReq", uri, nNodes);
                        res(nNodes);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("getAllNodesReq", function (res) { return __awaiter(_this, void 0, void 0, function () {
            var outData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getAllNodeURIs()];
                    case 1:
                        outData = _a.sent();
                        LogMsg("getAllNodesReq", "", outData);
                        res(outData);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("getAllNodesDataReq", function (res) { return __awaiter(_this, void 0, void 0, function () {
            var outData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getAllNodesData()];
                    case 1:
                        outData = _a.sent();
                        LogMsg("getAllNodesDataReq", "", outData);
                        res(outData);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("getAllConnectionsReq", function (res) { return __awaiter(_this, void 0, void 0, function () {
            var cs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getAllConnections()];
                    case 1:
                        cs = _a.sent();
                        LogMsg("getAllConnectionsReq", "", cs);
                        res(cs);
                        return [2 /*return*/];
                }
            });
        }); });
        // Def node 
        this.socket.on("setDefNodeURIReq", function (uri, res) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.setDefNodeURI(uri)];
                    case 1:
                        result = _a.sent();
                        LogMsg("setDefNodeURIReq", uri, result);
                        res(result);
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("getDefNodeURIReq", function (res) { return __awaiter(_this, void 0, void 0, function () {
            var outURI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getDefNodeURI()];
                    case 1:
                        outURI = _a.sent();
                        LogMsg("getDefNodeURIReq", "", outURI);
                        res(outURI);
                        return [2 /*return*/];
                }
            });
        }); });
    }; /* End of 'setupNodeRequests' function */
    return Client;
}()); /* End of 'client' class */

var http = require("http");
var express = require("express");
var morgan = require("morgan");
//const ws = require("ws");
//const path = require("path");
var Server = require("socket.io").Server;
var fileupload = require('express-fileupload');
var app = express();
app.use(morgan("combined"));
app.use(fileupload());
var mapsConfig = [
    {
        name: "pml30map",
        dbName: "pml30map",
        minimapInfo: {
            name: 'minimap',
            firstFloor: -1,
            floorCount: 3,
            defFloor: -1,
            imgStartPos: new Vec2(0, 0),
            imgEndPos: new Vec2(1059, 781),
            modelStartPos: new Vec2(1, 1),
            modelEndPos: new Vec2(1, 1),
            floors: [
                {
                    fileName: 'minimap/pml30map/f-1.png',
                    floorIndex: -1,
                },
                {
                    fileName: 'minimap/pml30map/f0.png',
                    floorIndex: 0,
                },
                {
                    fileName: 'minimap/pml30map/f1.png',
                    floorIndex: 1,
                },
                {
                    fileName: 'minimap/pml30map/f2.png',
                    floorIndex: 2,
                },
                {
                    fileName: 'minimap/pml30map/f3.png',
                    floorIndex: 3,
                },
                {
                    fileName: 'minimap/pml30map/f4.png',
                    floorIndex: 4,
                },
            ],
        },
    }
];
//app.use('/bin/models/worldmap', (req, res, next )=>{
//  res.sendFile(path.normalize(__dirname + `/../bin/models/${availableDB[curDBIndex].name}.obj`));
//});
app.use('/bin', express.static("../bin"));
// 1- simple 404 page
// 2 - redirect to rickroll
var studentKey = "R1BNTDMwTUFQX0FDQ0VTU19LRVlfQURNSU4=";
var adminKey = "R1BNTDMwTUFQX0FDQ0VTU19LRVlfU1RVREVOVA==";
var pages = [
    {
        page: '/server.html',
        source: '../dist/server.html',
        accessLevel: 2,
    },
    {
        page: '/editor.html',
        source: '../dist/editor.html',
        accessLevel: 2,
    },
    {
        page: '/viewer.html',
        source: '../dist/editor.html',
        accessLevel: 0,
    },
];
function getAccessLevel(req) {
    var accessLevel = 0;
    var query = req._query;
    if (query == undefined)
        query = req.query;
    if (query == undefined)
        return 0;
    // 0 - guest
    // 1 - student
    // 2 - admin
    if (query.key === studentKey)
        accessLevel = 1; // Student
    else if (query.key === adminKey)
        accessLevel = 2; // Admin
    return accessLevel;
}
app.use('/', function (req, res, next) {
    if (req.path == '/') {
        res.redirect('viewer.html');
        return;
    }
    {
        for (var i = 0; i < pages.length; i++) {
            if (req.path != pages[i].page)
                continue;
            if (getAccessLevel(req) < pages[i].accessLevel) {
                console.log("Access denied!!!!!!");
                res.sendStatus(404);
                return;
            }
        }
    }
    next();
}, express.static("../dist"));
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var server, io, DB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = http.createServer(app);
                    io = new Server(server);
                    DB = new MongoDB;
                    return [4 /*yield*/, DB.init("mongodb+srv://doadmin:i04J9b2t1X853Cuy@db-mongodb-pml30-75e49c39.mongo.ondigitalocean.com/admin?tls=true&authSource=admin", mapsConfig.map(function (e) { return e.dbName; }))];
                case 1:
                    _a.sent();
                    // For test
                    io.on("connection", function (socket) {
                        new Client(mapsConfig, DB, socket, getAccessLevel(socket.request));
                    });
                    server.listen(3047, function () {
                        console.log("Server started on port ".concat(server.address().port));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vc3JjL3N5c3RlbS9tYXRoLnRzIiwibW9uZ29kYi50cyIsImNsaWVudC50cyIsInNlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UsIFN1cHByZXNzZWRFcnJvciwgU3ltYm9sICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2VzRGVjb3JhdGUoY3RvciwgZGVzY3JpcHRvckluLCBkZWNvcmF0b3JzLCBjb250ZXh0SW4sIGluaXRpYWxpemVycywgZXh0cmFJbml0aWFsaXplcnMpIHtcclxuICAgIGZ1bmN0aW9uIGFjY2VwdChmKSB7IGlmIChmICE9PSB2b2lkIDAgJiYgdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uIGV4cGVjdGVkXCIpOyByZXR1cm4gZjsgfVxyXG4gICAgdmFyIGtpbmQgPSBjb250ZXh0SW4ua2luZCwga2V5ID0ga2luZCA9PT0gXCJnZXR0ZXJcIiA/IFwiZ2V0XCIgOiBraW5kID09PSBcInNldHRlclwiID8gXCJzZXRcIiA6IFwidmFsdWVcIjtcclxuICAgIHZhciB0YXJnZXQgPSAhZGVzY3JpcHRvckluICYmIGN0b3IgPyBjb250ZXh0SW5bXCJzdGF0aWNcIl0gPyBjdG9yIDogY3Rvci5wcm90b3R5cGUgOiBudWxsO1xyXG4gICAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ySW4gfHwgKHRhcmdldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSkgOiB7fSk7XHJcbiAgICB2YXIgXywgZG9uZSA9IGZhbHNlO1xyXG4gICAgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluKSBjb250ZXh0W3BdID0gcCA9PT0gXCJhY2Nlc3NcIiA/IHt9IDogY29udGV4dEluW3BdO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluLmFjY2VzcykgY29udGV4dC5hY2Nlc3NbcF0gPSBjb250ZXh0SW4uYWNjZXNzW3BdO1xyXG4gICAgICAgIGNvbnRleHQuYWRkSW5pdGlhbGl6ZXIgPSBmdW5jdGlvbiAoZikgeyBpZiAoZG9uZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBhZGQgaW5pdGlhbGl6ZXJzIGFmdGVyIGRlY29yYXRpb24gaGFzIGNvbXBsZXRlZFwiKTsgZXh0cmFJbml0aWFsaXplcnMucHVzaChhY2NlcHQoZiB8fCBudWxsKSk7IH07XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICgwLCBkZWNvcmF0b3JzW2ldKShraW5kID09PSBcImFjY2Vzc29yXCIgPyB7IGdldDogZGVzY3JpcHRvci5nZXQsIHNldDogZGVzY3JpcHRvci5zZXQgfSA6IGRlc2NyaXB0b3Jba2V5XSwgY29udGV4dCk7XHJcbiAgICAgICAgaWYgKGtpbmQgPT09IFwiYWNjZXNzb3JcIikge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHR5cGVvZiByZXN1bHQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5nZXQpKSBkZXNjcmlwdG9yLmdldCA9IF87XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5zZXQpKSBkZXNjcmlwdG9yLnNldCA9IF87XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5pbml0KSkgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF8gPSBhY2NlcHQocmVzdWx0KSkge1xyXG4gICAgICAgICAgICBpZiAoa2luZCA9PT0gXCJmaWVsZFwiKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcclxuICAgICAgICAgICAgZWxzZSBkZXNjcmlwdG9yW2tleV0gPSBfO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0YXJnZXQpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGNvbnRleHRJbi5uYW1lLCBkZXNjcmlwdG9yKTtcclxuICAgIGRvbmUgPSB0cnVlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcnVuSW5pdGlhbGl6ZXJzKHRoaXNBcmcsIGluaXRpYWxpemVycywgdmFsdWUpIHtcclxuICAgIHZhciB1c2VWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbml0aWFsaXplcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YWx1ZSA9IHVzZVZhbHVlID8gaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZywgdmFsdWUpIDogaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXNlVmFsdWUgPyB2YWx1ZSA6IHZvaWQgMDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Byb3BLZXkoeCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiID8geCA6IFwiXCIuY29uY2F0KHgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc2V0RnVuY3Rpb25OYW1lKGYsIG5hbWUsIHByZWZpeCkge1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSBuYW1lID0gbmFtZS5kZXNjcmlwdGlvbiA/IFwiW1wiLmNvbmNhdChuYW1lLmRlc2NyaXB0aW9uLCBcIl1cIikgOiBcIlwiO1xyXG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLCBcIm5hbWVcIiwgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiBwcmVmaXggPyBcIlwiLmNvbmNhdChwcmVmaXgsIFwiIFwiLCBuYW1lKSA6IG5hbWUgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBmYWxzZSB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRJbihzdGF0ZSwgcmVjZWl2ZXIpIHtcclxuICAgIGlmIChyZWNlaXZlciA9PT0gbnVsbCB8fCAodHlwZW9mIHJlY2VpdmVyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiByZWNlaXZlciAhPT0gXCJmdW5jdGlvblwiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB1c2UgJ2luJyBvcGVyYXRvciBvbiBub24tb2JqZWN0XCIpO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlKGVudiwgdmFsdWUsIGFzeW5jKSB7XHJcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHZvaWQgMCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWQuXCIpO1xyXG4gICAgICAgIHZhciBkaXNwb3NlO1xyXG4gICAgICAgIGlmIChhc3luYykge1xyXG4gICAgICAgICAgICBpZiAoIVN5bWJvbC5hc3luY0Rpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNEaXNwb3NlIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgICAgICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5hc3luY0Rpc3Bvc2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzcG9zZSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgICAgIGlmICghU3ltYm9sLmRpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuZGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgICAgIGRpc3Bvc2UgPSB2YWx1ZVtTeW1ib2wuZGlzcG9zZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgZGlzcG9zZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IG5vdCBkaXNwb3NhYmxlLlwiKTtcclxuICAgICAgICBlbnYuc3RhY2sucHVzaCh7IHZhbHVlOiB2YWx1ZSwgZGlzcG9zZTogZGlzcG9zZSwgYXN5bmM6IGFzeW5jIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXN5bmMpIHtcclxuICAgICAgICBlbnYuc3RhY2sucHVzaCh7IGFzeW5jOiB0cnVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG52YXIgX1N1cHByZXNzZWRFcnJvciA9IHR5cGVvZiBTdXBwcmVzc2VkRXJyb3IgPT09IFwiZnVuY3Rpb25cIiA/IFN1cHByZXNzZWRFcnJvciA6IGZ1bmN0aW9uIChlcnJvciwgc3VwcHJlc3NlZCwgbWVzc2FnZSkge1xyXG4gICAgdmFyIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICByZXR1cm4gZS5uYW1lID0gXCJTdXBwcmVzc2VkRXJyb3JcIiwgZS5lcnJvciA9IGVycm9yLCBlLnN1cHByZXNzZWQgPSBzdXBwcmVzc2VkLCBlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGlzcG9zZVJlc291cmNlcyhlbnYpIHtcclxuICAgIGZ1bmN0aW9uIGZhaWwoZSkge1xyXG4gICAgICAgIGVudi5lcnJvciA9IGVudi5oYXNFcnJvciA/IG5ldyBfU3VwcHJlc3NlZEVycm9yKGUsIGVudi5lcnJvciwgXCJBbiBlcnJvciB3YXMgc3VwcHJlc3NlZCBkdXJpbmcgZGlzcG9zYWwuXCIpIDogZTtcclxuICAgICAgICBlbnYuaGFzRXJyb3IgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgICAgICB3aGlsZSAoZW52LnN0YWNrLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgcmVjID0gZW52LnN0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlYy5kaXNwb3NlICYmIHJlYy5kaXNwb3NlLmNhbGwocmVjLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWMuYXN5bmMpIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KS50aGVuKG5leHQsIGZ1bmN0aW9uKGUpIHsgZmFpbChlKTsgcmV0dXJuIG5leHQoKTsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGZhaWwoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVudi5oYXNFcnJvcikgdGhyb3cgZW52LmVycm9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5leHQoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgX19leHRlbmRzOiBfX2V4dGVuZHMsXHJcbiAgICBfX2Fzc2lnbjogX19hc3NpZ24sXHJcbiAgICBfX3Jlc3Q6IF9fcmVzdCxcclxuICAgIF9fZGVjb3JhdGU6IF9fZGVjb3JhdGUsXHJcbiAgICBfX3BhcmFtOiBfX3BhcmFtLFxyXG4gICAgX19tZXRhZGF0YTogX19tZXRhZGF0YSxcclxuICAgIF9fYXdhaXRlcjogX19hd2FpdGVyLFxyXG4gICAgX19nZW5lcmF0b3I6IF9fZ2VuZXJhdG9yLFxyXG4gICAgX19jcmVhdGVCaW5kaW5nOiBfX2NyZWF0ZUJpbmRpbmcsXHJcbiAgICBfX2V4cG9ydFN0YXI6IF9fZXhwb3J0U3RhcixcclxuICAgIF9fdmFsdWVzOiBfX3ZhbHVlcyxcclxuICAgIF9fcmVhZDogX19yZWFkLFxyXG4gICAgX19zcHJlYWQ6IF9fc3ByZWFkLFxyXG4gICAgX19zcHJlYWRBcnJheXM6IF9fc3ByZWFkQXJyYXlzLFxyXG4gICAgX19zcHJlYWRBcnJheTogX19zcHJlYWRBcnJheSxcclxuICAgIF9fYXdhaXQ6IF9fYXdhaXQsXHJcbiAgICBfX2FzeW5jR2VuZXJhdG9yOiBfX2FzeW5jR2VuZXJhdG9yLFxyXG4gICAgX19hc3luY0RlbGVnYXRvcjogX19hc3luY0RlbGVnYXRvcixcclxuICAgIF9fYXN5bmNWYWx1ZXM6IF9fYXN5bmNWYWx1ZXMsXHJcbiAgICBfX21ha2VUZW1wbGF0ZU9iamVjdDogX19tYWtlVGVtcGxhdGVPYmplY3QsXHJcbiAgICBfX2ltcG9ydFN0YXI6IF9faW1wb3J0U3RhcixcclxuICAgIF9faW1wb3J0RGVmYXVsdDogX19pbXBvcnREZWZhdWx0LFxyXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZEdldDogX19jbGFzc1ByaXZhdGVGaWVsZEdldCxcclxuICAgIF9fY2xhc3NQcml2YXRlRmllbGRTZXQ6IF9fY2xhc3NQcml2YXRlRmllbGRTZXQsXHJcbiAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkSW46IF9fY2xhc3NQcml2YXRlRmllbGRJbixcclxuICAgIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlOiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZSxcclxuICAgIF9fZGlzcG9zZVJlc291cmNlczogX19kaXNwb3NlUmVzb3VyY2VzLFxyXG59O1xyXG4iLCJ2YXIgVmVjMyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWZWMzKHgsIHksIHopIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy56ID0gejtcbiAgICB9XG4gICAgVmVjMy5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xuICAgIH07IC8qIGNvcHkgKi9cbiAgICBWZWMzLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAocmhzKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggKyByaHMueCwgdGhpcy55ICsgcmhzLnksIHRoaXMueiArIHJocy56KTtcbiAgICB9OyAvKiBhZGQgKi9cbiAgICBWZWMzLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbiAocmhzKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggLSByaHMueCwgdGhpcy55IC0gcmhzLnksIHRoaXMueiAtIHJocy56KTtcbiAgICB9OyAvKiBzdWIgKi9cbiAgICBWZWMzLnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbiAocmhzKSB7XG4gICAgICAgIGlmIChyaHMgaW5zdGFuY2VvZiBWZWMzKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCAqIHJocy54LCB0aGlzLnkgKiByaHMueSwgdGhpcy56ICogcmhzLnopO1xuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54ICogcmhzLCB0aGlzLnkgKiByaHMsIHRoaXMueiAqIHJocyk7XG4gICAgfTsgLyogbXVsICovXG4gICAgVmVjMy5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSArIHRoaXMueiAqIHRoaXMueik7XG4gICAgfTsgLyogbGVuZ3RoICovXG4gICAgVmVjMy5wcm90b3R5cGUuZGlzdGFuY2UgPSBmdW5jdGlvbiAocmhzKSB7XG4gICAgICAgIHZhciBkeCA9IHRoaXMueCAtIHJocy54LCBkeSA9IHRoaXMueSAtIHJocy55LCBkeiA9IHRoaXMueiAtIHJocy56O1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5ICsgZHogKiBkeik7XG4gICAgfTsgLyogZGlzdGFuY2UgKi9cbiAgICBWZWMzLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAocmhzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiByaHMueCArIHRoaXMueSAqIHJocy55ICsgdGhpcy56ICogcmhzLno7XG4gICAgfTsgLyogZG90ICovXG4gICAgVmVjMy5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiAocmhzKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnkgKiByaHMueiAtIHJocy55ICogdGhpcy56LCB0aGlzLnogKiByaHMueCAtIHJocy56ICogdGhpcy54LCB0aGlzLnggKiByaHMueSAtIHJocy54ICogdGhpcy55KTtcbiAgICB9OyAvKiBjcm9zcyAqL1xuICAgIFZlYzMucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnopO1xuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC8gbGVuLCB0aGlzLnkgLyBsZW4sIHRoaXMueiAvIGxlbik7XG4gICAgfTsgLyogbm9ybWFsaXplICovXG4gICAgVmVjMy5wcm90b3R5cGUubmVnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzMoLXRoaXMueCwgLXRoaXMueSwgLXRoaXMueik7XG4gICAgfTsgLyogbmVnICovXG4gICAgVmVjMy5mcm9tU3BoZXJpY2FsID0gZnVuY3Rpb24gKGF6aW11dGgsIGVsZXZhdGlvbiwgcmFkaXVzKSB7XG4gICAgICAgIGlmIChyYWRpdXMgPT09IHZvaWQgMCkgeyByYWRpdXMgPSAxOyB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhyYWRpdXMgKiBNYXRoLnNpbihlbGV2YXRpb24pICogTWF0aC5jb3MoYXppbXV0aCksIHJhZGl1cyAqIE1hdGguY29zKGVsZXZhdGlvbiksIHJhZGl1cyAqIE1hdGguc2luKGVsZXZhdGlvbikgKiBNYXRoLnNpbihhemltdXRoKSk7XG4gICAgfTsgLyogc3BoZXJpY2FsVG9DYXJ0ZXNpYW4gKi9cbiAgICByZXR1cm4gVmVjMztcbn0oKSk7IC8qIFZlYzMgKi9cbmV4cG9ydCB7IFZlYzMgfTtcbnZhciBWZWMyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZlYzIoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH0gLyogY29uc3RydWN0b3IgKi9cbiAgICBWZWMyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoMCwgMCk7XG4gICAgfTtcbiAgICBWZWMyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAocmhzKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKyByaHMueCwgdGhpcy55ICsgcmhzLnkpO1xuICAgIH07IC8qIGFkZCAqL1xuICAgIFZlYzIucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uIChyaHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAtIHJocy54LCB0aGlzLnkgLSByaHMueSk7XG4gICAgfTsgLyogc3ViICovXG4gICAgVmVjMi5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24gKHJocykge1xuICAgICAgICBpZiAocmhzIGluc3RhbmNlb2YgVmVjMilcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKiByaHMueCwgdGhpcy55ICogcmhzLnkpO1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICogcmhzLCB0aGlzLnkgKiByaHMpO1xuICAgIH07IC8qIG11bCAqL1xuICAgIFZlYzIucHJvdG90eXBlLmxlbmd0aDIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XG4gICAgfTsgLyogbGVuZ3RoMiAqL1xuICAgIFZlYzIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xuICAgIH07IC8qIGxlbmd0aCAqL1xuICAgIFZlYzIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uIChyaHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHJocy54ICsgdGhpcy55ICogcmhzLnk7XG4gICAgfTsgLyogZG90ICovXG4gICAgVmVjMi5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiAocmhzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiByaHMueSAtIHJocy54ICogdGhpcy55O1xuICAgIH07IC8qIGNyb3NzICovXG4gICAgVmVjMi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLyBsZW4sIHRoaXMueSAvIGxlbik7XG4gICAgfTsgLyogbm9ybWFsaXplICovXG4gICAgVmVjMi5wcm90b3R5cGUubmVnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzIoLXRoaXMueCwgLXRoaXMueSk7XG4gICAgfTsgLyogbmVnICovXG4gICAgVmVjMi5wcm90b3R5cGUubGVmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKC10aGlzLnksIHRoaXMueCk7XG4gICAgfTsgLyogcmlnaHQgKi9cbiAgICBWZWMyLnByb3RvdHlwZS5yaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueSwgLXRoaXMueCk7XG4gICAgfTsgLyogcmlnaHQgKi9cbiAgICByZXR1cm4gVmVjMjtcbn0oKSk7IC8qIFZlYzIgKi9cbmV4cG9ydCB7IFZlYzIgfTtcbnZhciBTaXplID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNpemUodywgaCkge1xuICAgICAgICB0aGlzLncgPSB3O1xuICAgICAgICB0aGlzLmggPSBoO1xuICAgIH0gLyogU2l6ZSAqL1xuICAgIFNpemUucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2l6ZSh0aGlzLncsIHRoaXMuaCk7XG4gICAgfTsgLyogY29weSAqL1xuICAgIHJldHVybiBTaXplO1xufSgpKTsgLyogU2l6ZSAqL1xuZXhwb3J0IHsgU2l6ZSB9O1xudmFyIE1hdDQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWF0NCh2MDAsIHYwMSwgdjAyLCB2MDMsIHYxMCwgdjExLCB2MTIsIHYxMywgdjIwLCB2MjEsIHYyMiwgdjIzLCB2MzAsIHYzMSwgdjMyLCB2MzMpIHtcbiAgICAgICAgdGhpcy5tID0gW1xuICAgICAgICAgICAgdjAwLCB2MDEsIHYwMiwgdjAzLFxuICAgICAgICAgICAgdjEwLCB2MTEsIHYxMiwgdjEzLFxuICAgICAgICAgICAgdjIwLCB2MjEsIHYyMiwgdjIzLFxuICAgICAgICAgICAgdjMwLCB2MzEsIHYzMiwgdjMzXG4gICAgICAgIF07XG4gICAgfSAvKiBjb25zdHJ1Y3RvciAqL1xuICAgIE1hdDQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0NCh0aGlzLm1bMF0sIHRoaXMubVsxXSwgdGhpcy5tWzJdLCB0aGlzLm1bM10sIHRoaXMubVs0XSwgdGhpcy5tWzVdLCB0aGlzLm1bNl0sIHRoaXMubVs3XSwgdGhpcy5tWzhdLCB0aGlzLm1bOV0sIHRoaXMubVsxMF0sIHRoaXMubVsxMV0sIHRoaXMubVsxMl0sIHRoaXMubVsxM10sIHRoaXMubVsxNF0sIHRoaXMubVsxNV0pO1xuICAgIH07IC8qIGNvcHkgKi9cbiAgICBNYXQ0LnByb3RvdHlwZS50cmFuc2Zvcm1Qb2ludCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh2LnggKiB0aGlzLm1bMF0gKyB2LnkgKiB0aGlzLm1bNF0gKyB2LnogKiB0aGlzLm1bOF0gKyB0aGlzLm1bMTJdLCB2LnggKiB0aGlzLm1bMV0gKyB2LnkgKiB0aGlzLm1bNV0gKyB2LnogKiB0aGlzLm1bOV0gKyB0aGlzLm1bMTNdLCB2LnggKiB0aGlzLm1bMl0gKyB2LnkgKiB0aGlzLm1bNl0gKyB2LnogKiB0aGlzLm1bMTBdICsgdGhpcy5tWzE0XSk7XG4gICAgfTsgLyogdHJhbnNmb3JtUG9pbnQgKi9cbiAgICBNYXQ0LnByb3RvdHlwZS50cmFuc2Zvcm00eDQgPSBmdW5jdGlvbiAodikge1xuICAgICAgICB2YXIgdyA9IHYueCAqIHRoaXMubVszXSArIHYueSAqIHRoaXMubVs3XSArIHYueiAqIHRoaXMubVsxMV0gKyB0aGlzLm1bMTVdO1xuICAgICAgICByZXR1cm4gbmV3IFZlYzMoKHYueCAqIHRoaXMubVswXSArIHYueSAqIHRoaXMubVs0XSArIHYueiAqIHRoaXMubVs4XSArIHRoaXMubVsxMl0pIC8gdywgKHYueCAqIHRoaXMubVsxXSArIHYueSAqIHRoaXMubVs1XSArIHYueiAqIHRoaXMubVs5XSArIHRoaXMubVsxM10pIC8gdywgKHYueCAqIHRoaXMubVsyXSArIHYueSAqIHRoaXMubVs2XSArIHYueiAqIHRoaXMubVsxMF0gKyB0aGlzLm1bMTRdKSAvIHcpO1xuICAgIH07IC8qIHRyYW5zZm9ybTR4NCAqL1xuICAgIE1hdDQucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0KHRoaXMubVswXSwgdGhpcy5tWzRdLCB0aGlzLm1bOF0sIHRoaXMubVsxMl0sIHRoaXMubVsxXSwgdGhpcy5tWzVdLCB0aGlzLm1bOV0sIHRoaXMubVsxM10sIHRoaXMubVsyXSwgdGhpcy5tWzZdLCB0aGlzLm1bMTBdLCB0aGlzLm1bMTRdLCB0aGlzLm1bM10sIHRoaXMubVs3XSwgdGhpcy5tWzExXSwgdGhpcy5tWzE1XSk7XG4gICAgfTsgLyogdHJhbnNwb3NlICovXG4gICAgTWF0NC5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24gKHJocykge1xuICAgICAgICByZXR1cm4gbmV3IE1hdDQodGhpcy5tWzBdICogcmhzLm1bMF0gKyB0aGlzLm1bMV0gKiByaHMubVs0XSArIHRoaXMubVsyXSAqIHJocy5tWzhdICsgdGhpcy5tWzNdICogcmhzLm1bMTJdLCB0aGlzLm1bMF0gKiByaHMubVsxXSArIHRoaXMubVsxXSAqIHJocy5tWzVdICsgdGhpcy5tWzJdICogcmhzLm1bOV0gKyB0aGlzLm1bM10gKiByaHMubVsxM10sIHRoaXMubVswXSAqIHJocy5tWzJdICsgdGhpcy5tWzFdICogcmhzLm1bNl0gKyB0aGlzLm1bMl0gKiByaHMubVsxMF0gKyB0aGlzLm1bM10gKiByaHMubVsxNF0sIHRoaXMubVswXSAqIHJocy5tWzNdICsgdGhpcy5tWzFdICogcmhzLm1bN10gKyB0aGlzLm1bMl0gKiByaHMubVsxMV0gKyB0aGlzLm1bM10gKiByaHMubVsxNV0sIHRoaXMubVs0XSAqIHJocy5tWzBdICsgdGhpcy5tWzVdICogcmhzLm1bNF0gKyB0aGlzLm1bNl0gKiByaHMubVs4XSArIHRoaXMubVs3XSAqIHJocy5tWzEyXSwgdGhpcy5tWzRdICogcmhzLm1bMV0gKyB0aGlzLm1bNV0gKiByaHMubVs1XSArIHRoaXMubVs2XSAqIHJocy5tWzldICsgdGhpcy5tWzddICogcmhzLm1bMTNdLCB0aGlzLm1bNF0gKiByaHMubVsyXSArIHRoaXMubVs1XSAqIHJocy5tWzZdICsgdGhpcy5tWzZdICogcmhzLm1bMTBdICsgdGhpcy5tWzddICogcmhzLm1bMTRdLCB0aGlzLm1bNF0gKiByaHMubVszXSArIHRoaXMubVs1XSAqIHJocy5tWzddICsgdGhpcy5tWzZdICogcmhzLm1bMTFdICsgdGhpcy5tWzddICogcmhzLm1bMTVdLCB0aGlzLm1bOF0gKiByaHMubVswXSArIHRoaXMubVs5XSAqIHJocy5tWzRdICsgdGhpcy5tWzEwXSAqIHJocy5tWzhdICsgdGhpcy5tWzExXSAqIHJocy5tWzEyXSwgdGhpcy5tWzhdICogcmhzLm1bMV0gKyB0aGlzLm1bOV0gKiByaHMubVs1XSArIHRoaXMubVsxMF0gKiByaHMubVs5XSArIHRoaXMubVsxMV0gKiByaHMubVsxM10sIHRoaXMubVs4XSAqIHJocy5tWzJdICsgdGhpcy5tWzldICogcmhzLm1bNl0gKyB0aGlzLm1bMTBdICogcmhzLm1bMTBdICsgdGhpcy5tWzExXSAqIHJocy5tWzE0XSwgdGhpcy5tWzhdICogcmhzLm1bM10gKyB0aGlzLm1bOV0gKiByaHMubVs3XSArIHRoaXMubVsxMF0gKiByaHMubVsxMV0gKyB0aGlzLm1bMTFdICogcmhzLm1bMTVdLCB0aGlzLm1bMTJdICogcmhzLm1bMF0gKyB0aGlzLm1bMTNdICogcmhzLm1bNF0gKyB0aGlzLm1bMTRdICogcmhzLm1bOF0gKyB0aGlzLm1bMTVdICogcmhzLm1bMTJdLCB0aGlzLm1bMTJdICogcmhzLm1bMV0gKyB0aGlzLm1bMTNdICogcmhzLm1bNV0gKyB0aGlzLm1bMTRdICogcmhzLm1bOV0gKyB0aGlzLm1bMTVdICogcmhzLm1bMTNdLCB0aGlzLm1bMTJdICogcmhzLm1bMl0gKyB0aGlzLm1bMTNdICogcmhzLm1bNl0gKyB0aGlzLm1bMTRdICogcmhzLm1bMTBdICsgdGhpcy5tWzE1XSAqIHJocy5tWzE0XSwgdGhpcy5tWzEyXSAqIHJocy5tWzNdICsgdGhpcy5tWzEzXSAqIHJocy5tWzddICsgdGhpcy5tWzE0XSAqIHJocy5tWzExXSArIHRoaXMubVsxNV0gKiByaHMubVsxNV0pO1xuICAgIH07IC8qIG11bCAqL1xuICAgIE1hdDQuaWRlbnRpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0NCgxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxKTtcbiAgICB9OyAvKiBpZGVudGl0eSAqL1xuICAgIE1hdDQuc2NhbGUgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gbmV3IE1hdDQocy54LCAwLCAwLCAwLCAwLCBzLnksIDAsIDAsIDAsIDAsIHMueiwgMCwgMCwgMCwgMCwgMSk7XG4gICAgfTsgLyogc2NhbGUgKi9cbiAgICBNYXQ0LnRyYW5zbGF0ZSA9IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0NCgxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCB0LngsIHQueSwgdC56LCAxKTtcbiAgICB9OyAvKiB0cmFuc2xhdGUgKi9cbiAgICBNYXQ0LnJvdGF0ZVggPSBmdW5jdGlvbiAoYW5nbGUpIHtcbiAgICAgICAgdmFyIHMgPSBNYXRoLnNpbihhbmdsZSksIGMgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgIHJldHVybiBuZXcgTWF0NCgxLCAwLCAwLCAwLCAwLCBjLCBzLCAwLCAwLCAtcywgYywgMCwgMCwgMCwgMCwgMSk7XG4gICAgfTsgLyogcm90YXRlWCAqL1xuICAgIE1hdDQucm90YXRlWSA9IGZ1bmN0aW9uIChhbmdsZSkge1xuICAgICAgICB2YXIgcyA9IE1hdGguc2luKGFuZ2xlKSwgYyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0KGMsIDAsIC1zLCAwLCAwLCAxLCAwLCAwLCBzLCAwLCBjLCAwLCAwLCAwLCAwLCAxKTtcbiAgICB9OyAvKiByb3RhdGVZICovXG4gICAgTWF0NC5yb3RhdGVaID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG4gICAgICAgIHZhciBzID0gTWF0aC5zaW4oYW5nbGUpLCBjID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICByZXR1cm4gbmV3IE1hdDQoYywgcywgMCwgMCwgLXMsIGMsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEpO1xuICAgIH07IC8qIHJvdGF0ZVogKi9cbiAgICBNYXQ0LnJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSwgYXhpcykge1xuICAgICAgICB2YXIgdiA9IGF4aXMubm9ybWFsaXplKCk7XG4gICAgICAgIHZhciBzID0gTWF0aC5zaW4oYW5nbGUpLCBjID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICByZXR1cm4gbmV3IE1hdDQodi54ICogdi54ICogKDEgLSBjKSArIGMsIHYueCAqIHYueSAqICgxIC0gYykgLSB2LnogKiBzLCB2LnggKiB2LnogKiAoMSAtIGMpICsgdi55ICogcywgMCwgdi55ICogdi54ICogKDEgLSBjKSArIHYueiAqIHMsIHYueSAqIHYueSAqICgxIC0gYykgKyBjLCB2LnkgKiB2LnogKiAoMSAtIGMpIC0gdi54ICogcywgMCwgdi56ICogdi54ICogKDEgLSBjKSAtIHYueSAqIHMsIHYueiAqIHYueSAqICgxIC0gYykgKyB2LnggKiBzLCB2LnogKiB2LnogKiAoMSAtIGMpICsgYywgMCwgMCwgMCwgMCwgMSk7XG4gICAgfTsgLyogcm90YXRlICovXG4gICAgTWF0NC52aWV3ID0gZnVuY3Rpb24gKGxvYywgYXQsIHVwKSB7XG4gICAgICAgIHZhciBkaXIgPSBhdC5zdWIobG9jKS5ub3JtYWxpemUoKSwgcmdoID0gZGlyLmNyb3NzKHVwKS5ub3JtYWxpemUoKSwgdHVwID0gcmdoLmNyb3NzKGRpcik7XG4gICAgICAgIHJldHVybiBuZXcgTWF0NChyZ2gueCwgdHVwLngsIC1kaXIueCwgMCwgcmdoLnksIHR1cC55LCAtZGlyLnksIDAsIHJnaC56LCB0dXAueiwgLWRpci56LCAwLCAtbG9jLmRvdChyZ2gpLCAtbG9jLmRvdCh0dXApLCBsb2MuZG90KGRpciksIDEpO1xuICAgIH07IC8qIHZpZXcgKi9cbiAgICBNYXQ0LmZydXN0dW0gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0KDIgKiBuZWFyIC8gKHJpZ2h0IC0gbGVmdCksIDAsIDAsIDAsIDAsIDIgKiBuZWFyIC8gKHRvcCAtIGJvdHRvbSksIDAsIDAsIChyaWdodCArIGxlZnQpIC8gKHJpZ2h0IC0gbGVmdCksICh0b3AgKyBib3R0b20pIC8gKHRvcCAtIGJvdHRvbSksIChuZWFyICsgZmFyKSAvIChuZWFyIC0gZmFyKSwgLTEsIDAsIDAsIDIgKiBuZWFyICogZmFyIC8gKG5lYXIgLSBmYXIpLCAwKTtcbiAgICB9OyAvKiBmcnVzdHVtICovXG4gICAgcmV0dXJuIE1hdDQ7XG59KCkpOyAvKiBNYXQ0ICovXG5leHBvcnQgeyBNYXQ0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXRoLmpzLm1hcCIsImltcG9ydCB7IF9fYXNzaWduLCBfX2F3YWl0ZXIsIF9fZ2VuZXJhdG9yIH0gZnJvbSBcInRzbGliXCI7XG52YXIgX2EgPSByZXF1aXJlKFwibW9uZ29kYlwiKSwgTW9uZ29DbGllbnQgPSBfYS5Nb25nb0NsaWVudCwgT2JqZWN0SWQgPSBfYS5PYmplY3RJZDtcbmZ1bmN0aW9uIHJlY3JlYXRlSUQoYXJyYXkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgICBpZiAoYXJyYXlbaV0gIT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgaWYgKGFycmF5W2ldLl9pZCAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgYXJyYXlbaV0uX2lkID0gbmV3IE9iamVjdElkKGFycmF5W2ldLl9pZCk7IC8vZGVsZXRlIGFycmF5W2ldLl9pZDtcbiAgICByZXR1cm4gYXJyYXk7XG59XG52YXIgRGF0YUJhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRGF0YUJhc2UoKSB7XG4gICAgfVxuICAgIERhdGFCYXNlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKGRiKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2QubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZGIuY29sbGVjdGlvbihcIm5vZGVzXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Eubm9kZXNDID0gX2Quc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZGIuY29sbGVjdGlvbihcImNvbm5lY3Rpb25zXCIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2IuY29ubmVjdGlvbnNDID0gX2Quc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2MgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZGIuY29sbGVjdGlvbihcInZhcmlhYmxlc1wiKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jLnZhcnNDID0gX2Quc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vLy8vLy8vLy8vLyBOb2Rlc1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS5nZXROb2RlID0gZnVuY3Rpb24gKHVyaSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5ub2Rlc0MuZmluZE9uZSh7IF9pZDogbmV3IE9iamVjdElkKHVyaSkgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5vZGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS51cGRhdGVOb2RlID0gZnVuY3Rpb24gKHVyaSwgbmV3RGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLm5vZGVzQy51cGRhdGVPbmUoeyBfaWQ6IG5ldyBPYmplY3RJZCh1cmkpIH0sIHsgJHNldDogbmV3RGF0YSB9KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS5kZWxOb2RlID0gZnVuY3Rpb24gKHVyaSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMubm9kZXNDLmRlbGV0ZU9uZSh7IF9pZDogbmV3IE9iamVjdElkKHVyaSkgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiAvKnJldHVybiovLCBfYS5zZW50KCldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS5hZGROb2RlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluc2VydGVkVVJJO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLm5vZGVzQy5pbnNlcnRPbmUoZGF0YSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRlZFVSSSA9IChfYS5zZW50KCkpLmluc2VydGVkSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgaW5zZXJ0ZWRVUkkuaWRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS5nZXROb2RlQ29ubmVjdGlvbnMgPSBmdW5jdGlvbiAodXJpKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmlTdHIsIGNzLCBfYSwgX2I7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmlTdHIgPSBcIltcIiArIG5ldyBVaW50OEFycmF5KHVyaSkudG9TdHJpbmcoKSArIFwiXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jb25uZWN0aW9uc0MuZmluZCh7IGlkMTogdXJpU3RyIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzQgLyp5aWVsZCovLCAoX2Muc2VudCgpKS50b0FycmF5KCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYiA9IChfYSA9IChfYy5zZW50KCkpKS5jb25jYXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNvbm5lY3Rpb25zQy5maW5kKHsgaWQyOiB1cmlTdHIgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbNCAvKnlpZWxkKi8sIChfYy5zZW50KCkpLnRvQXJyYXkoKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzID0gX2IuYXBwbHkoX2EsIFsoX2Muc2VudCgpKV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGNzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBEYXRhQmFzZS5wcm90b3R5cGUuZ2V0QWxsQ29ubmVjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jb25uZWN0aW9uc0MuZmluZCh7fSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbNCAvKnlpZWxkKi8sIChfYS5zZW50KCkpLnRvQXJyYXkoKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGNzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBEYXRhQmFzZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3VycyA9IGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVyaVN0ciwgcmlnaHQsIGxlZnQsIG91dE4sIGksIGk7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmlTdHIgPSBcIltcIiArIG5ldyBVaW50OEFycmF5KHVyaSkudG9TdHJpbmcoKSArIFwiXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jb25uZWN0aW9uc0MuZmluZCh7IGlkMTogdXJpU3RyIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzQgLyp5aWVsZCovLCAoX2Euc2VudCgpKS50b0FycmF5KCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuY29ubmVjdGlvbnNDLmZpbmQoeyBpZDI6IHVyaVN0ciB9KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFs0IC8qeWllbGQqLywgKF9hLnNlbnQoKSkudG9BcnJheSgpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dE4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByaWdodC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXROW291dE4ubGVuZ3RoXSA9IHJpZ2h0W2ldLmlkMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZWZ0Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dE5bb3V0Ti5sZW5ndGhdID0gbGVmdFtpXS5pZDE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgb3V0Tl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8gQ29ubmVjdGlvbnNcbiAgICBEYXRhQmFzZS5wcm90b3R5cGUuYWRkQ29ubmVjdGlvbiA9IGZ1bmN0aW9uICh1cmkxLCB1cmkyKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmkxU3RyLCB1cmkyU3RyLCBuMSwgbjIsIGMxLCBjMiwgaW5zZXJ0ZWRVUkk7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXJpMSA9PSB1cmkyKSAvLyBDaGVjayBmb3IgY29ubmVjdGluZyBub2RlIHdpdGggaXRzZWxmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJpMVN0ciA9IFwiW1wiICsgbmV3IFVpbnQ4QXJyYXkodXJpMSkudG9TdHJpbmcoKSArIFwiXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJpMlN0ciA9IFwiW1wiICsgbmV3IFVpbnQ4QXJyYXkodXJpMikudG9TdHJpbmcoKSArIFwiXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbjEgPSB0aGlzLmdldE5vZGUodXJpMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuMiA9IHRoaXMuZ2V0Tm9kZSh1cmkyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuMSA9PSBudWxsIHx8IG4yID09IG51bGwpIC8vIENoZWNrIGZvciBub2RlcyB2YWxpZGl0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuY29ubmVjdGlvbnNDLmZpbmRPbmUoeyBpZDE6IHVyaTFTdHIsIGlkMjogdXJpMlN0ciB9KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGMxID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jb25uZWN0aW9uc0MuZmluZE9uZSh7IGlkMTogdXJpMlN0ciwgaWQyOiB1cmkxU3RyIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgYzIgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYzEgIT0gbnVsbCB8fCBjMSAhPSBudWxsKSAvLyBDaGVjayBmb3IgY29ubmVjdGlvbnMgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZmFsc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jb25uZWN0aW9uc0MuaW5zZXJ0T25lKHsgaWQxOiB1cmkxU3RyLCBpZDI6IHVyaTJTdHIgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRlZFVSSSA9IChfYS5zZW50KCkpLmluc2VydGVkSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluc2VydGVkIFVSSTogXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW5zZXJ0ZWRVUkkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRydWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS5kZWxDb25uZWN0aW9uID0gZnVuY3Rpb24gKHVyaTEsIHVyaTIpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVyaTFTdHIsIHVyaTJTdHI7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgdXJpMVN0ciA9IFwiW1wiICsgbmV3IFVpbnQ4QXJyYXkodXJpMSkudG9TdHJpbmcoKSArIFwiXVwiO1xuICAgICAgICAgICAgICAgIHVyaTJTdHIgPSBcIltcIiArIG5ldyBVaW50OEFycmF5KHVyaTIpLnRvU3RyaW5nKCkgKyBcIl1cIjtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zQy5kZWxldGVPbmUoeyBpZDE6IHVyaTFTdHIsIGlkMjogdXJpMlN0ciB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zQy5kZWxldGVPbmUoeyBpZDE6IHVyaTJTdHIsIGlkMjogdXJpMVN0ciB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdHJ1ZV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLy8vLy8vLy8vLy8vLyBJbmRleGVzIFxuICAgIERhdGFCYXNlLnByb3RvdHlwZS5nZXREZWZOb2RlVVJJID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy52YXJzQy5maW5kT25lKHsgdmFyX25hbWU6IFwiRGVmTm9kZVVSSVwiIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5vZGUudXJpLmJ1ZmZlcl07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRGF0YUJhc2UucHJvdG90eXBlLnNldERlZk5vZGVVUkkgPSBmdW5jdGlvbiAobmV3VVJJKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmdldE5vZGUobmV3VVJJKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoX2Euc2VudCgpKSA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBmYWxzZV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnZhcnNDLmZpbmRPbmUoeyB2YXJfbmFtZTogXCJEZWZOb2RlVVJJXCIgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEobm9kZSA9PSBudWxsKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnZhcnNDLmluc2VydE9uZSh7IHZhcl9uYW1lOiBcIkRlZk5vZGVVUklcIiwgdXJpOiBuZXdVUkkgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA2XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnZhcnNDLnVwZGF0ZU9uZSh7IHZhcl9uYW1lOiBcIkRlZk5vZGVVUklcIiB9LCB7ICRzZXQ6IHsgdXJpOiBuZXdVUkkgfSB9KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzIgLypyZXR1cm4qLywgdHJ1ZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRGF0YUJhc2UucHJvdG90eXBlLmdldEFsbE5vZGVVUklzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm9kZXMsIG91dFVSSXMsIGk7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMubm9kZXNDLmZpbmQoe30pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzQgLyp5aWVsZCovLCAoX2Euc2VudCgpKS50b0FycmF5KCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFVSSXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRVUklzW2ldID0gbm9kZXNbaV0uX2lkLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG91dFVSSXNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS5nZXRBbGxOb2Rlc0RhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub2RlcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5ub2Rlc0MuZmluZCh7fSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbNCAvKnlpZWxkKi8sIChfYS5zZW50KCkpLnRvQXJyYXkoKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5vZGVzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBHbG9iYWwgZGF0YSBiYXNlIGZ1bmN0aW9uc1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS5jbGVhckRCID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMubm9kZXNDLmRlbGV0ZU1hbnkoe30pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jb25uZWN0aW9uc0MuZGVsZXRlTWFueSh7fSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnZhcnNDLmRlbGV0ZU1hbnkoe30pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRydWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIERhdGFCYXNlLnByb3RvdHlwZS5nZXREQiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMubm9kZXNDLmZpbmQoe30pLnRvQXJyYXkoKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLm5vZGVzID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jb25uZWN0aW9uc0MuZmluZCh7fSkudG9BcnJheSgpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EuY29ubmVjdGlvbnMgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnZhcnNDLmZpbmQoe30pLnRvQXJyYXkoKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIChfYS52YXJpYWJsZXMgPSBfYi5zZW50KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2EpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBEYXRhQmFzZS5wcm90b3R5cGUubG9hZERCID0gZnVuY3Rpb24gKG5ld0RCKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogXG4gICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIENvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jbGVhckRCKCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciBDb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShuZXdEQi5ub2Rlcy5sZW5ndGggPiAwKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLm5vZGVzQy5pbnNlcnRNYW55KHJlY3JlYXRlSUQobmV3REIubm9kZXMpKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEobmV3REIuY29ubmVjdGlvbnMubGVuZ3RoID4gMCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5jb25uZWN0aW9uc0MuaW5zZXJ0TWFueShyZWNyZWF0ZUlEKG5ld0RCLmNvbm5lY3Rpb25zKSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKG5ld0RCLnZhcmlhYmxlcy5sZW5ndGggPiAwKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgN107XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLnZhcnNDLmluc2VydE1hbnkocmVjcmVhdGVJRChuZXdEQi52YXJpYWJsZXMpKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OiByZXR1cm4gWzIgLypyZXR1cm4qLywgdHJ1ZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRGF0YUJhc2UucHJvdG90eXBlLmFkZERCID0gZnVuY3Rpb24gKG5ld0RCKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKG5ld0RCLm5vZGVzLmxlbmd0aCA+IDApKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMubm9kZXNDLmluc2VydE1hbnkocmVjcmVhdGVJRChuZXdEQi5ub2RlcykpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShuZXdEQi5jb25uZWN0aW9ucy5sZW5ndGggPiAwKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmNvbm5lY3Rpb25zQy5pbnNlcnRNYW55KHJlY3JlYXRlSUQobmV3REIuY29ubmVjdGlvbnMpKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qLywgdHJ1ZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIERhdGFCYXNlO1xufSgpKTtcbnZhciBNb25nb0RCID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1vbmdvREIoKSB7XG4gICAgfVxuICAgIE1vbmdvREIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAobW9uZ29kYlVSTCwgZGJOYW1lcykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbW9uZ29kYkNsaWVudCwgX2EsIGRicztcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBtb25nb2RiQ2xpZW50ID0gbmV3IE1vbmdvQ2xpZW50KG1vbmdvZGJVUkwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbW9uZ29kYkNsaWVudC5jb25uZWN0KCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5tb25nb2RiQ29ubmVjdGlvbiA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRicyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgUHJvbWlzZS5hbGwoZGJOYW1lcy5tYXAoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRiLCBfYSwgX2I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfZC5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGIgPSBuZXcgRGF0YUJhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2IgPSAoX2EgPSBkYikuaW5pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5tb25nb2RiQ29ubmVjdGlvbi5kYihuYW1lKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzQgLyp5aWVsZCovLCBfYi5hcHBseShfYSwgW19kLnNlbnQoKV0pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGJzLnB1c2goKF9jID0ge30sIF9jW25hbWVdID0gZGIsIF9jKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7IH0pKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJzID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBkYnMubWFwKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGJzID0gX19hc3NpZ24oX19hc3NpZ24oe30sIF90aGlzLmRicyksIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIE1vbmdvREI7XG59KCkpO1xuZXhwb3J0IHsgTW9uZ29EQiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bW9uZ29kYi5qcy5tYXAiLCJpbXBvcnQgeyBfX2F3YWl0ZXIsIF9fZ2VuZXJhdG9yIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBWZWMzIH0gZnJvbSBcIi4uL3NyYy9zeXN0ZW0vbWF0aFwiO1xuZXhwb3J0IGZ1bmN0aW9uIExvZ01zZyhtc2dOYW1lLCBpbnB1dCwgb3V0cHV0KSB7XG4gICAgY29uc29sZS5sb2coXCI8LS0tIE1FU1NBR0UgJ1wiLmNvbmNhdChtc2dOYW1lLCBcIicgLS0tPlwiKSk7XG4gICAgY29uc29sZS5sb2coXCJJTlBVVDpcIik7XG4gICAgY29uc29sZS5sb2coaW5wdXQpO1xuICAgIGNvbnNvbGUubG9nKFwiT1VUUFVUOlwiKTtcbiAgICBjb25zb2xlLmxvZyhvdXRwdXQpO1xufVxudmFyIENsaWVudCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDbGllbnQobWFwc0NvbmZpZywgbmV3TW9uZ28sIHNvY2tldCwgbmV3QWNjZXNzTGV2ZWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5tb25nb2RiID0gbmV3TW9uZ287XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50IGNvbm5lY3RlZCB3aXRoIGlkOiBcIi5jb25jYXQoc29ja2V0LmlkKSk7XG4gICAgICAgIHZhciBhY2Nlc3NMZXZlbCA9IG5ld0FjY2Vzc0xldmVsO1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICAgICAgY29uc29sZS5sb2coJ0FBQUFBQUFBQUFBQUFhJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubW9uZ29kYi5kYnMpO1xuICAgICAgICB0aGlzLmRiID0gdGhpcy5tb25nb2RiLmRic1swXTtcbiAgICAgICAgaWYgKHNvY2tldC5yZXF1ZXN0Ll9xdWVyeS5tYXAgIT0gdW5kZWZpbmVkICYmIHRoaXMubW9uZ29kYi5kYnNbc29ja2V0LnJlcXVlc3QuX3F1ZXJ5Lm1hcF0gIT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5kYiA9IHRoaXMubW9uZ29kYi5kYnNbc29ja2V0LnJlcXVlc3QuX3F1ZXJ5Lm1hcF07XG4gICAgICAgIHNvY2tldC5vbihcInBpbmdcIiwgZnVuY3Rpb24gKHZhbHVlLCByZXMpIHtcbiAgICAgICAgICAgIHJlcyh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oXCJkaXNjb25uZWN0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50IGRpc2Nvbm5lY3RlZCB3aXRoIGlkOiBcIi5jb25jYXQoc29ja2V0LmlkKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBHbG9iYWwgREIgcmVxdWVzdHNcbiAgICAgICAgc29ja2V0Lm9uKFwiZ2V0QXZhaWxhYmxlREJzXCIsIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHZhciBuYW1lcyA9IG1hcHNDb25maWcubWFwKGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLm5hbWU7IH0pO1xuICAgICAgICAgICAgTG9nTXNnKFwiZ2V0QXZhaWxhYmxlREJzXCIsIFwiXCIsIG5hbWVzKTtcbiAgICAgICAgICAgIHJlcyhuYW1lcyk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub24oXCJnZXREQkluZm9cIiwgZnVuY3Rpb24gKG5hbWUsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluZm87XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgaW5mbyA9IHt9O1xuICAgICAgICAgICAgICAgIG1hcHNDb25maWcubWFwKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLm5hbWUgPT0gbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm8gPSBlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIExvZ01zZyhcImdldERCSW5mb1wiLCBuYW1lLCBpbmZvKTtcbiAgICAgICAgICAgICAgICByZXMoaW5mbyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICAgICAgc29ja2V0Lm9uKFwic3dpdGNoREJcIiwgZnVuY3Rpb24gKG5hbWUsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGlzVmFsaWQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1hcHNDb25maWcubWFwKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLm5hbWUgPT0gbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYiA9IHRoaXMubW9uZ29kYi5kYnNbbmFtZV07XG4gICAgICAgICAgICAgICAgTG9nTXNnKFwic3dpdGNoREJcIiwgbmFtZSwgaXNWYWxpZCk7XG4gICAgICAgICAgICAgICAgcmVzKGlzVmFsaWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHNvY2tldC5vbihcImNsZWFyREJSZXFcIiwgZnVuY3Rpb24gKHJlcykgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi5jbGVhckRCKCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dNc2coXCJnZXREZWZOb2RlVVJJUmVxXCIsIFwiXCIsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7IH0pO1xuICAgICAgICBzb2NrZXQub24oXCJnZXREQlJlcVwiLCBmdW5jdGlvbiAocmVzKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGI7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGIuZ2V0REIoKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nTXNnKFwiZ2V0RGVmTm9kZVVSSVJlcVwiLCBcIlwiLCBkYik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMoZGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHNvY2tldC5vbihcImxvYWREQlJlcVwiLCBmdW5jdGlvbiAoZGIsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi5sb2FkREIoZGIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nTXNnKFwiZ2V0RGVmTm9kZVVSSVJlcVwiLCBkYiwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyhyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHNvY2tldC5vbihcImFkZERhdGFSZXFcIiwgZnVuY3Rpb24gKGRiLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGIuYWRkREIoZGIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nTXNnKFwiYWRkRGF0YVJlcVwiLCBkYiwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyhyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHNvY2tldC5vbihcImdldE5lYXJlc3RSZXFcIiwgZnVuY3Rpb24gKGluUG9zLCBmbG9vciwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcG9zLCBub2Rlc0RhdGEsIG5lYXJlc3QsIGksIG5Qb3MsIGlQb3MsIG91dDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcyA9IG5ldyBWZWMzKGluUG9zLngsIDAsIGluUG9zLnopO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi5nZXRBbGxOb2Rlc0RhdGEoKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzRGF0YSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2Rlc0RhdGEubGVuZ3RoIDw9IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG51bGxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmVhcmVzdCA9IG5vZGVzRGF0YVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBub2Rlc0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuUG9zID0gbmV3IFZlYzMobmVhcmVzdC5wb3NpdGlvbi54LCAwLCBuZWFyZXN0LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlQb3MgPSBuZXcgVmVjMyhub2Rlc0RhdGFbaV0ucG9zaXRpb24ueCwgMCwgbm9kZXNEYXRhW2ldLnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3Muc3ViKGlQb3MpLmxlbmd0aCgpIDwgcG9zLnN1YihuUG9zKS5sZW5ndGgoKSAmJiBub2Rlc0RhdGFbaV0uZmxvb3IgPT09IGZsb29yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZWFyZXN0ID0gbm9kZXNEYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ID0gbmVhcmVzdC5faWQuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dNc2coXCJnZXROZWFyZXN0UmVxXCIsIHBvcywgb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyhvdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHRoaXMuc2V0dXBOb2RlUmVxdWVzdHMoKTtcbiAgICB9IC8qIEVuZCBvZiAnY29udHNydWN0b3InIGZ1bmN0aW9uICovXG4gICAgQ2xpZW50LnByb3RvdHlwZS5zZXR1cE5vZGVSZXF1ZXN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gTm9kZXNcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJnZXROb2RlUmVxXCIsIGZ1bmN0aW9uICh1cmksIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG91dERhdGE7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGIuZ2V0Tm9kZSh1cmkpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0RGF0YSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ01zZyhcImdldE5vZGVSZXFcIiwgdXJpLCBvdXREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyhvdXREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7IH0pO1xuICAgICAgICB0aGlzLnNvY2tldC5vbihcImFkZE5vZGVSZXFcIiwgZnVuY3Rpb24gKGRhdGEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5ld1VSSTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi5hZGROb2RlKGRhdGEpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VVJJID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nTXNnKFwiYWRkTm9kZVJlcVwiLCBkYXRhLCBuZXdVUkkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKG5ld1VSSSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVOb2RlUmVxXCIsIGZ1bmN0aW9uICh1cmksIGRhdGEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi51cGRhdGVOb2RlKHVyaSwgZGF0YSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm1vZGlmaWVkQ291bnQgPT09IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ01zZyhcInVwZGF0ZU5vZGVSZXFcIiwgeyB1cmk6IHVyaSwgZGF0YTogZGF0YSB9LCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJkZWxOb2RlUmVxXCIsIGZ1bmN0aW9uICh1cmksIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi5kZWxOb2RlKHVyaSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmRlbGV0ZWRDb3VudCA9PT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nTXNnKFwiZGVsTm9kZVJlcVwiLCB1cmksIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7IH0pO1xuICAgICAgICAvLyBDb25uZWN0aW9uc1xuICAgICAgICB0aGlzLnNvY2tldC5vbihcImNvbm5lY3ROb2Rlc1JlcVwiLCBmdW5jdGlvbiAodXJpcywgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmRiLmFkZENvbm5lY3Rpb24odXJpc1swXSwgdXJpc1sxXSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dNc2coXCJjb25uZWN0Tm9kZXNSZXFcIiwgdXJpcywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyhyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwiZGlzY29ubmVjdE5vZGVzUmVxXCIsIGZ1bmN0aW9uICh1cmlzLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGIuZGVsQ29ubmVjdGlvbih1cmlzWzBdLCB1cmlzWzFdKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ01zZyhcImRpc2Nvbm5lY3ROb2Rlc1JlcVwiLCB1cmlzLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICAgICAgLy8gR3JhcGggaW5mb1xuICAgICAgICB0aGlzLnNvY2tldC5vbihcImdldE5vZGVDb25uZWN0aW9uc1JlcVwiLCBmdW5jdGlvbiAodXJpLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi5nZXROb2RlQ29ubmVjdGlvbnModXJpKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nTXNnKFwiZ2V0Tm9kZUNvbm5lY3Rpb25zUmVxXCIsIHVyaSwgY3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKGNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7IH0pO1xuICAgICAgICB0aGlzLnNvY2tldC5vbihcImdldE5laWdoYm91cnNSZXFcIiwgZnVuY3Rpb24gKHVyaSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbk5vZGVzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmRiLmdldE5laWdoYm91cnModXJpKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5Ob2RlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ01zZyhcImdldE5laWdoYm91cnNSZXFcIiwgdXJpLCBuTm9kZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKG5Ob2Rlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJnZXRBbGxOb2Rlc1JlcVwiLCBmdW5jdGlvbiAocmVzKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3V0RGF0YTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi5nZXRBbGxOb2RlVVJJcygpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0RGF0YSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ01zZyhcImdldEFsbE5vZGVzUmVxXCIsIFwiXCIsIG91dERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKG91dERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwiZ2V0QWxsTm9kZXNEYXRhUmVxXCIsIGZ1bmN0aW9uIChyZXMpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdXREYXRhO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmRiLmdldEFsbE5vZGVzRGF0YSgpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0RGF0YSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ01zZyhcImdldEFsbE5vZGVzRGF0YVJlcVwiLCBcIlwiLCBvdXREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyhvdXREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7IH0pO1xuICAgICAgICB0aGlzLnNvY2tldC5vbihcImdldEFsbENvbm5lY3Rpb25zUmVxXCIsIGZ1bmN0aW9uIChyZXMpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5kYi5nZXRBbGxDb25uZWN0aW9ucygpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3MgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dNc2coXCJnZXRBbGxDb25uZWN0aW9uc1JlcVwiLCBcIlwiLCBjcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMoY3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIC8vIERlZiBub2RlIFxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInNldERlZk5vZGVVUklSZXFcIiwgZnVuY3Rpb24gKHVyaSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmRiLnNldERlZk5vZGVVUkkodXJpKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ01zZyhcInNldERlZk5vZGVVUklSZXFcIiwgdXJpLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJnZXREZWZOb2RlVVJJUmVxXCIsIGZ1bmN0aW9uIChyZXMpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdXRVUkk7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMuZGIuZ2V0RGVmTm9kZVVSSSgpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0VVJJID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nTXNnKFwiZ2V0RGVmTm9kZVVSSVJlcVwiLCBcIlwiLCBvdXRVUkkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKG91dFVSSSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICB9OyAvKiBFbmQgb2YgJ3NldHVwTm9kZVJlcXVlc3RzJyBmdW5jdGlvbiAqL1xuICAgIHJldHVybiBDbGllbnQ7XG59KCkpOyAvKiBFbmQgb2YgJ2NsaWVudCcgY2xhc3MgKi9cbmV4cG9ydCB7IENsaWVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xpZW50LmpzLm1hcCIsImltcG9ydCB7IF9fYXdhaXRlciwgX19nZW5lcmF0b3IgfSBmcm9tIFwidHNsaWJcIjtcbnZhciBodHRwID0gcmVxdWlyZShcImh0dHBcIik7XG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xudmFyIG1vcmdhbiA9IHJlcXVpcmUoXCJtb3JnYW5cIik7XG4vL2NvbnN0IHdzID0gcmVxdWlyZShcIndzXCIpO1xuLy9jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG52YXIgU2VydmVyID0gcmVxdWlyZShcInNvY2tldC5pb1wiKS5TZXJ2ZXI7XG52YXIgZmlsZXVwbG9hZCA9IHJlcXVpcmUoJ2V4cHJlc3MtZmlsZXVwbG9hZCcpO1xuLy9jb25zdCB7IE1vbmdvREIgfSA9IHJlcXVpcmUoJy4vbW9uZ29kYi50cycpO1xuLy9jb25zdCB7IE1vbmdvREJDb2xsZWN0aW9uTmFtZXNwYWNlIH0gPSByZXF1aXJlKFwibW9uZ29kYlwiKTtcbi8vY29uc3QgeyBhbGxvd2VkTm9kZUVudmlyb25tZW50RmxhZ3MgfSA9IHJlcXVpcmUoXCJwcm9jZXNzXCIpO1xuaW1wb3J0IHsgVmVjMiB9IGZyb20gXCIuLi9zcmMvc3lzdGVtL21hdGhcIjtcbmltcG9ydCB7IE1vbmdvREIgfSBmcm9tIFwiLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBDbGllbnQgfSBmcm9tIFwiLi9jbGllbnRcIjtcbnZhciBhcHAgPSBleHByZXNzKCk7XG5hcHAudXNlKG1vcmdhbihcImNvbWJpbmVkXCIpKTtcbmFwcC51c2UoZmlsZXVwbG9hZCgpKTtcbnZhciBtYXBzQ29uZmlnID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogXCJwbWwzMG1hcFwiLFxuICAgICAgICBkYk5hbWU6IFwicG1sMzBtYXBcIixcbiAgICAgICAgbWluaW1hcEluZm86IHtcbiAgICAgICAgICAgIG5hbWU6ICdtaW5pbWFwJyxcbiAgICAgICAgICAgIGZpcnN0Rmxvb3I6IC0xLFxuICAgICAgICAgICAgZmxvb3JDb3VudDogMyxcbiAgICAgICAgICAgIGRlZkZsb29yOiAtMSxcbiAgICAgICAgICAgIGltZ1N0YXJ0UG9zOiBuZXcgVmVjMigwLCAwKSxcbiAgICAgICAgICAgIGltZ0VuZFBvczogbmV3IFZlYzIoMTA1OSwgNzgxKSxcbiAgICAgICAgICAgIG1vZGVsU3RhcnRQb3M6IG5ldyBWZWMyKDEsIDEpLFxuICAgICAgICAgICAgbW9kZWxFbmRQb3M6IG5ldyBWZWMyKDEsIDEpLFxuICAgICAgICAgICAgZmxvb3JzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogJ21pbmltYXAvcG1sMzBtYXAvZi0xLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIGZsb29ySW5kZXg6IC0xLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogJ21pbmltYXAvcG1sMzBtYXAvZjAucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgZmxvb3JJbmRleDogMCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6ICdtaW5pbWFwL3BtbDMwbWFwL2YxLnBuZycsXG4gICAgICAgICAgICAgICAgICAgIGZsb29ySW5kZXg6IDEsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiAnbWluaW1hcC9wbWwzMG1hcC9mMi5wbmcnLFxuICAgICAgICAgICAgICAgICAgICBmbG9vckluZGV4OiAyLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogJ21pbmltYXAvcG1sMzBtYXAvZjMucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgZmxvb3JJbmRleDogMyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6ICdtaW5pbWFwL3BtbDMwbWFwL2Y0LnBuZycsXG4gICAgICAgICAgICAgICAgICAgIGZsb29ySW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgfVxuXTtcbi8vYXBwLnVzZSgnL2Jpbi9tb2RlbHMvd29ybGRtYXAnLCAocmVxLCByZXMsIG5leHQgKT0+e1xuLy8gIHJlcy5zZW5kRmlsZShwYXRoLm5vcm1hbGl6ZShfX2Rpcm5hbWUgKyBgLy4uL2Jpbi9tb2RlbHMvJHthdmFpbGFibGVEQltjdXJEQkluZGV4XS5uYW1lfS5vYmpgKSk7XG4vL30pO1xuYXBwLnVzZSgnL2JpbicsIGV4cHJlc3Muc3RhdGljKFwiLi4vYmluXCIpKTtcbnZhciBlbmFibGVLZXlzID0gMTsgLy8gMCAtIG5vIGNoZWNrXG4vLyAxLSBzaW1wbGUgNDA0IHBhZ2Vcbi8vIDIgLSByZWRpcmVjdCB0byByaWNrcm9sbFxudmFyIHN0dWRlbnRLZXkgPSBcIlIxQk5URE13VFVGUVgwRkRRMFZUVTE5TFJWbGZRVVJOU1U0PVwiO1xudmFyIGFkbWluS2V5ID0gXCJSMUJOVERNd1RVRlFYMEZEUTBWVFUxOUxSVmxmVTFSVlJFVk9WQT09XCI7XG52YXIgcGFnZXMgPSBbXG4gICAge1xuICAgICAgICBwYWdlOiAnL3NlcnZlci5odG1sJyxcbiAgICAgICAgc291cmNlOiAnLi4vZGlzdC9zZXJ2ZXIuaHRtbCcsXG4gICAgICAgIGFjY2Vzc0xldmVsOiAyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYWdlOiAnL2VkaXRvci5odG1sJyxcbiAgICAgICAgc291cmNlOiAnLi4vZGlzdC9lZGl0b3IuaHRtbCcsXG4gICAgICAgIGFjY2Vzc0xldmVsOiAyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYWdlOiAnL3ZpZXdlci5odG1sJyxcbiAgICAgICAgc291cmNlOiAnLi4vZGlzdC9lZGl0b3IuaHRtbCcsXG4gICAgICAgIGFjY2Vzc0xldmVsOiAwLFxuICAgIH0sXG5dO1xuZnVuY3Rpb24gZ2V0QWNjZXNzTGV2ZWwocmVxKSB7XG4gICAgdmFyIGFjY2Vzc0xldmVsID0gMDtcbiAgICB2YXIgcXVlcnkgPSByZXEuX3F1ZXJ5O1xuICAgIGlmIChxdWVyeSA9PSB1bmRlZmluZWQpXG4gICAgICAgIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICAgIGlmIChxdWVyeSA9PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiAwO1xuICAgIC8vIDAgLSBndWVzdFxuICAgIC8vIDEgLSBzdHVkZW50XG4gICAgLy8gMiAtIGFkbWluXG4gICAgaWYgKHF1ZXJ5LmtleSA9PT0gc3R1ZGVudEtleSlcbiAgICAgICAgYWNjZXNzTGV2ZWwgPSAxOyAvLyBTdHVkZW50XG4gICAgZWxzZSBpZiAocXVlcnkua2V5ID09PSBhZG1pbktleSlcbiAgICAgICAgYWNjZXNzTGV2ZWwgPSAyOyAvLyBBZG1pblxuICAgIHJldHVybiBhY2Nlc3NMZXZlbDtcbn1cbmFwcC51c2UoJy8nLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICBpZiAocmVxLnBhdGggPT0gJy8nKSB7XG4gICAgICAgIHJlcy5yZWRpcmVjdCgndmlld2VyLmh0bWwnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZW5hYmxlS2V5cyA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJlcS5wYXRoICE9IHBhZ2VzW2ldLnBhZ2UpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBpZiAoZ2V0QWNjZXNzTGV2ZWwocmVxKSA8IHBhZ2VzW2ldLmFjY2Vzc0xldmVsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY2Nlc3MgZGVuaWVkISEhISEhXCIpO1xuICAgICAgICAgICAgICAgIGlmIChlbmFibGVLZXlzID09IDIpXG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWRpcmVjdChcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9ZFF3NHc5V2dYY1FcIik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZFN0YXR1cyg0MDQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBuZXh0KCk7XG59LCBleHByZXNzLnN0YXRpYyhcIi4uL2Rpc3RcIikpO1xuZnVuY3Rpb24gbWFpbigpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZXJ2ZXIsIGlvLCBEQjtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwKTtcbiAgICAgICAgICAgICAgICAgICAgaW8gPSBuZXcgU2VydmVyKHNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgIERCID0gbmV3IE1vbmdvREI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIERCLmluaXQoXCJtb25nb2RiK3NydjovL2RvYWRtaW46aTA0SjliMnQxWDg1M0N1eUBkYi1tb25nb2RiLXBtbDMwLTc1ZTQ5YzM5Lm1vbmdvLm9uZGlnaXRhbG9jZWFuLmNvbS9hZG1pbj90bHM9dHJ1ZSZhdXRoU291cmNlPWFkbWluXCIsIG1hcHNDb25maWcubWFwKGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLmRiTmFtZTsgfSkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHRlc3RcbiAgICAgICAgICAgICAgICAgICAgaW8ub24oXCJjb25uZWN0aW9uXCIsIGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDbGllbnQobWFwc0NvbmZpZywgREIsIHNvY2tldCwgZ2V0QWNjZXNzTGV2ZWwoc29ja2V0LnJlcXVlc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5saXN0ZW4oMzA0NywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZXJ2ZXIgc3RhcnRlZCBvbiBwb3J0IFwiLmNvbmNhdChzZXJ2ZXIuYWRkcmVzcygpLnBvcnQpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5tYWluKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZXJ2ZXIuanMubWFwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZUE7QUFDTyxJQUFJLFFBQVEsR0FBRyxXQUFXO0FBQ2pDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3JELFFBQVEsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0QsWUFBWSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFlBQVksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekYsU0FBUztBQUNULFFBQVEsT0FBTyxDQUFDLENBQUM7QUFDakIsTUFBSztBQUNMLElBQUksT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzQyxFQUFDO0FBeUVEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO0FBQ3RELFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlDLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDeEUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCO0FBQ2hCLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO0FBQ2hJLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQzFHLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxD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QUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSxLQUFLLENBQUM7QUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxFQUFFO0FBQ3hDLFFBQVEsSUFBSSxHQUFHLFlBQVksSUFBSTtBQUMvQixZQUFZLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RSxRQUFRLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNsRSxLQUFLLENBQUM7QUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVk7QUFDeEMsUUFBUSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUM7QUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRyxFQUFFO0FBQzdDLFFBQVEsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFRLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3RELEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEVBQUU7QUFDeEMsUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLEVBQUU7QUFDMUMsUUFBUSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0gsS0FBSyxDQUFDO0FBQ04sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxZQUFZO0FBQzNDLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENB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SSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsWUFBWTtBQUN6QyxRQUFRLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqRCxLQUFLLENBQUM7QUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVk7QUFDeEMsUUFBUSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEVBQUU7QUFDeEMsUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0MsS0FBSyxDQUFDO0FBQ04sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsRUFBRTtBQUMxQyxRQUFRLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvQyxLQUFLLENBQUM7QUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFlBQVk7QUFDM0MsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRCxRQUFRLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsSUFB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QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQzlCLFNBQVMsSUFBSSxHQUFHO0FBQ2hCLElBQUksT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLFlBQVk7QUFDdkQsUUFBUSxJQUFJLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQzNCLFFBQVEsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFO0FBQy9DLFlBQVksUUFBUSxFQUFFLENBQUMsS0FBSztBQUM1QixnQkFBZ0IsS0FBSyxDQUFDO0FBQ3RCLG9CQUFvQixNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRCxvQkFBb0IsRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVDLG9CQUFvQixFQUFFLEdBQUcsSUFBSSxPQUFPLENBQUM7QUFDckMsb0JBQW9CLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQywySEFBMkgsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsTyxnQkFBZ0IsS0FBSyxDQUFDO0FBQ3RCLG9CQUFvQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUI7QUFDQSxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxNQUFNLEVBQUU7QUFDMUQsd0JBQXdCLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMzRixxQkFBcUIsQ0FBQyxDQUFDO0FBQ3ZCLG9CQUFvQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZO0FBQ3BELHdCQUF3QixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3RixxQkFBcUIsQ0FBQyxDQUFDO0FBQ3ZCLG9CQUFvQixPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDMUMsYUFBYTtBQUNiLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0QsSUFBSSxFQUFFIiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdfQ==
