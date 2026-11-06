export default function(global, globalThis, window, $app_exports$, $app_evaluate$) {
    var org_app_require = $app_require$;
    (function(global, globalThis, window, $app_exports$, $app_evaluate$) {
        var setTimeout = global.setTimeout;
        var setInterval = global.setInterval;
        var clearTimeout = global.clearTimeout;
        var clearInterval = global.clearInterval;
        var $app_require$1 = global.$app_require$ || org_app_require;
        var createAppHandler = function() {
            return (()=>{
                var __webpack_modules__ = {
                    "./src/common/adapt.js" (__unused_rspack_module, exports, __webpack_require__) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports["default"] = void 0;
                        var _system = _interopRequireDefault($app_require$1("@app-module/system.device"));
                        function _interopRequireDefault(e) {
                            return e && e.__esModule ? e : {
                                default: e
                            };
                        }
                        const DESIGN_WIDTH = 336;
                        let cached = null;
                        let pending = null;
                        function kindOf(w, h, shape) {
                            if (w === h) return 'circle';
                            if (w / h <= 0.55) return 'pill';
                            if ('circle' === shape) return 'circle';
                            return 'rect';
                        }
                        function classify(res) {
                            const w = res && res.screenWidth ? res.screenWidth : 336;
                            const h = res && res.screenHeight ? res.screenHeight : 480;
                            const dpr = res && res.screenDensity ? res.screenDensity : 2;
                            const kind = kindOf(w, h, res && res.screenShape ? res.screenShape : '');
                            return {
                                w: w,
                                h: h,
                                dpr: dpr,
                                kind: kind,
                                isCircle: 'circle' === kind,
                                isPill: 'pill' === kind,
                                isRect: 'rect' === kind,
                                designHeight: Math.round(h / w * DESIGN_WIDTH),
                                scale: w / DESIGN_WIDTH
                            };
                        }
                        function probe() {
                            if (cached) return Promise.resolve(cached);
                            if (pending) return pending;
                            pending = new Promise(function(resolve) {
                                _system.default.getInfo({
                                    success: function(res) {
                                        cached = classify(res);
                                        if (void 0 !== __webpack_require__.g) __webpack_require__.g.__adaptInfo = cached;
                                        resolve(cached);
                                    },
                                    fail: function() {
                                        cached = classify(null);
                                        if (void 0 !== __webpack_require__.g) __webpack_require__.g.__adaptInfo = cached;
                                        resolve(cached);
                                    }
                                });
                            });
                            return pending;
                        }
                        function peek() {
                            return cached;
                        }
                        function isCircleSync() {
                            if (cached) return cached.isCircle;
                            if (void 0 !== __webpack_require__.g && __webpack_require__.g.__adaptInfo) return __webpack_require__.g.__adaptInfo.isCircle;
                            return null;
                        }
                        var _default = exports["default"] = {
                            probe: probe,
                            peek: peek,
                            isCircleSync: isCircleSync,
                            DESIGN_WIDTH: DESIGN_WIDTH
                        };
                    },
                    "./src/common/utils.js" (module) {
                        "use strict";
                        var AES_SBOX = [
                            99,
                            124,
                            119,
                            123,
                            242,
                            107,
                            111,
                            197,
                            48,
                            1,
                            103,
                            43,
                            254,
                            215,
                            171,
                            118,
                            202,
                            130,
                            201,
                            125,
                            250,
                            89,
                            71,
                            240,
                            173,
                            212,
                            162,
                            175,
                            156,
                            164,
                            114,
                            192,
                            183,
                            253,
                            147,
                            38,
                            54,
                            63,
                            247,
                            204,
                            52,
                            165,
                            229,
                            241,
                            113,
                            216,
                            49,
                            21,
                            4,
                            199,
                            35,
                            195,
                            24,
                            150,
                            5,
                            154,
                            7,
                            18,
                            128,
                            226,
                            235,
                            39,
                            178,
                            117,
                            9,
                            131,
                            44,
                            26,
                            27,
                            110,
                            90,
                            160,
                            82,
                            59,
                            214,
                            179,
                            41,
                            227,
                            47,
                            132,
                            83,
                            209,
                            0,
                            237,
                            32,
                            252,
                            177,
                            91,
                            106,
                            203,
                            190,
                            57,
                            74,
                            76,
                            88,
                            207,
                            208,
                            239,
                            170,
                            251,
                            67,
                            77,
                            51,
                            133,
                            69,
                            249,
                            2,
                            127,
                            80,
                            60,
                            159,
                            168,
                            81,
                            163,
                            64,
                            143,
                            146,
                            157,
                            56,
                            245,
                            188,
                            182,
                            218,
                            33,
                            16,
                            255,
                            243,
                            210,
                            205,
                            12,
                            19,
                            236,
                            95,
                            151,
                            68,
                            23,
                            196,
                            167,
                            126,
                            61,
                            100,
                            93,
                            25,
                            115,
                            96,
                            129,
                            79,
                            220,
                            34,
                            42,
                            144,
                            136,
                            70,
                            238,
                            184,
                            20,
                            222,
                            94,
                            11,
                            219,
                            224,
                            50,
                            58,
                            10,
                            73,
                            6,
                            36,
                            92,
                            194,
                            211,
                            172,
                            98,
                            145,
                            149,
                            228,
                            121,
                            231,
                            200,
                            55,
                            109,
                            141,
                            213,
                            78,
                            169,
                            108,
                            86,
                            244,
                            234,
                            101,
                            122,
                            174,
                            8,
                            186,
                            120,
                            37,
                            46,
                            28,
                            166,
                            180,
                            198,
                            232,
                            221,
                            116,
                            31,
                            75,
                            189,
                            139,
                            138,
                            112,
                            62,
                            181,
                            102,
                            72,
                            3,
                            246,
                            14,
                            97,
                            53,
                            87,
                            185,
                            134,
                            193,
                            29,
                            158,
                            225,
                            248,
                            152,
                            17,
                            105,
                            217,
                            142,
                            148,
                            155,
                            30,
                            135,
                            233,
                            206,
                            85,
                            40,
                            223,
                            140,
                            161,
                            137,
                            13,
                            191,
                            230,
                            66,
                            104,
                            65,
                            153,
                            45,
                            15,
                            176,
                            84,
                            187,
                            22
                        ];
                        var AES_RSBOX = [
                            82,
                            9,
                            106,
                            213,
                            48,
                            54,
                            165,
                            56,
                            191,
                            64,
                            163,
                            158,
                            129,
                            243,
                            215,
                            251,
                            124,
                            227,
                            57,
                            130,
                            155,
                            47,
                            255,
                            135,
                            52,
                            142,
                            67,
                            68,
                            196,
                            222,
                            233,
                            203,
                            84,
                            123,
                            148,
                            50,
                            166,
                            194,
                            35,
                            61,
                            238,
                            76,
                            149,
                            11,
                            66,
                            250,
                            195,
                            78,
                            8,
                            46,
                            161,
                            102,
                            40,
                            217,
                            36,
                            178,
                            118,
                            91,
                            162,
                            73,
                            109,
                            139,
                            209,
                            37,
                            114,
                            248,
                            246,
                            100,
                            134,
                            104,
                            152,
                            22,
                            212,
                            164,
                            92,
                            204,
                            93,
                            101,
                            182,
                            146,
                            108,
                            112,
                            72,
                            80,
                            253,
                            237,
                            185,
                            218,
                            94,
                            21,
                            70,
                            87,
                            167,
                            141,
                            157,
                            132,
                            144,
                            216,
                            171,
                            0,
                            140,
                            188,
                            211,
                            10,
                            247,
                            228,
                            88,
                            5,
                            184,
                            179,
                            69,
                            6,
                            208,
                            44,
                            30,
                            143,
                            202,
                            63,
                            15,
                            2,
                            193,
                            175,
                            189,
                            3,
                            1,
                            19,
                            138,
                            107,
                            58,
                            145,
                            17,
                            65,
                            79,
                            103,
                            220,
                            234,
                            151,
                            242,
                            207,
                            206,
                            240,
                            180,
                            230,
                            115,
                            150,
                            172,
                            116,
                            34,
                            231,
                            173,
                            53,
                            133,
                            226,
                            249,
                            55,
                            232,
                            28,
                            117,
                            223,
                            110,
                            71,
                            241,
                            26,
                            113,
                            29,
                            41,
                            197,
                            137,
                            111,
                            183,
                            98,
                            14,
                            170,
                            24,
                            190,
                            27,
                            252,
                            86,
                            62,
                            75,
                            198,
                            210,
                            121,
                            32,
                            154,
                            219,
                            192,
                            254,
                            120,
                            205,
                            90,
                            244,
                            31,
                            221,
                            168,
                            51,
                            136,
                            7,
                            199,
                            49,
                            177,
                            18,
                            16,
                            89,
                            39,
                            128,
                            236,
                            95,
                            96,
                            81,
                            127,
                            169,
                            25,
                            181,
                            74,
                            13,
                            45,
                            229,
                            122,
                            159,
                            147,
                            201,
                            156,
                            239,
                            160,
                            224,
                            59,
                            77,
                            174,
                            42,
                            245,
                            176,
                            200,
                            235,
                            187,
                            60,
                            131,
                            83,
                            153,
                            97,
                            23,
                            43,
                            4,
                            126,
                            186,
                            119,
                            214,
                            38,
                            225,
                            105,
                            20,
                            99,
                            85,
                            33,
                            12,
                            125
                        ];
                        var AES_RCON = [
                            0x00,
                            0x01,
                            0x02,
                            0x04,
                            0x08,
                            0x10,
                            0x20,
                            0x40,
                            0x80,
                            0x1b,
                            0x36
                        ];
                        function aesSubWord(w) {
                            return (AES_SBOX[w >>> 24 & 0xff] << 24 | AES_SBOX[w >>> 16 & 0xff] << 16 | AES_SBOX[w >>> 8 & 0xff] << 8 | AES_SBOX[0xff & w]) >>> 0;
                        }
                        function aesExpandKey(key) {
                            var w = new Array(44);
                            var i;
                            for(i = 0; i < 4; i++)w[i] = (key[4 * i] << 24 | key[4 * i + 1] << 16 | key[4 * i + 2] << 8 | key[4 * i + 3]) >>> 0;
                            for(i = 4; i < 44; i++){
                                var t = w[i - 1];
                                if (i % 4 === 0) {
                                    t = (t << 8 | t >>> 24) >>> 0;
                                    t = (aesSubWord(t) ^ AES_RCON[i / 4] << 24) >>> 0;
                                }
                                w[i] = (w[i - 4] ^ t) >>> 0;
                            }
                            return w;
                        }
                        function aesAddRoundKey(state, w, round) {
                            var c;
                            for(c = 0; c < 4; c++){
                                var k = w[4 * round + c];
                                state[c][0] = (state[c][0] ^ k >>> 24 & 0xff) & 0xff;
                                state[c][1] = (state[c][1] ^ k >>> 16 & 0xff) & 0xff;
                                state[c][2] = (state[c][2] ^ k >>> 8 & 0xff) & 0xff;
                                state[c][3] = (state[c][3] ^ 0xff & k) & 0xff;
                            }
                        }
                        function aesInvShiftRows(state) {
                            var t;
                            t = state[3][1];
                            state[3][1] = state[2][1];
                            state[2][1] = state[1][1];
                            state[1][1] = state[0][1];
                            state[0][1] = t;
                            t = state[0][2];
                            state[0][2] = state[2][2];
                            state[2][2] = t;
                            t = state[1][2];
                            state[1][2] = state[3][2];
                            state[3][2] = t;
                            t = state[0][3];
                            state[0][3] = state[1][3];
                            state[1][3] = state[2][3];
                            state[2][3] = state[3][3];
                            state[3][3] = t;
                        }
                        function aesGmul(a, b) {
                            var p = 0, hb;
                            var i;
                            for(i = 0; i < 8; i++){
                                if (1 & b) p ^= a;
                                hb = 0x80 & a;
                                a = a << 1 & 0xff;
                                if (hb) a ^= 0x1b;
                                b >>>= 1;
                            }
                            return 0xff & p;
                        }
                        function aesInvSubBytes(state) {
                            var r, c;
                            for(r = 0; r < 4; r++)for(c = 0; c < 4; c++)state[c][r] = AES_RSBOX[state[c][r]];
                        }
                        function aesInvMixColumns(state) {
                            var c, a0, a1, a2, a3;
                            for(c = 0; c < 4; c++){
                                a0 = state[c][0];
                                a1 = state[c][1];
                                a2 = state[c][2];
                                a3 = state[c][3];
                                state[c][0] = (aesGmul(a0, 14) ^ aesGmul(a1, 11) ^ aesGmul(a2, 13) ^ aesGmul(a3, 9)) & 0xff;
                                state[c][1] = (aesGmul(a0, 9) ^ aesGmul(a1, 14) ^ aesGmul(a2, 11) ^ aesGmul(a3, 13)) & 0xff;
                                state[c][2] = (aesGmul(a0, 13) ^ aesGmul(a1, 9) ^ aesGmul(a2, 14) ^ aesGmul(a3, 11)) & 0xff;
                                state[c][3] = (aesGmul(a0, 11) ^ aesGmul(a1, 13) ^ aesGmul(a2, 9) ^ aesGmul(a3, 14)) & 0xff;
                            }
                        }
                        function aesDecryptBlock(block, w) {
                            var state = [];
                            var r, c;
                            for(c = 0; c < 4; c++)state[c] = [
                                block[4 * c],
                                block[4 * c + 1],
                                block[4 * c + 2],
                                block[4 * c + 3]
                            ];
                            aesAddRoundKey(state, w, 10);
                            for(r = 9; r >= 1; r--){
                                aesInvShiftRows(state);
                                aesInvSubBytes(state);
                                aesAddRoundKey(state, w, r);
                                aesInvMixColumns(state);
                            }
                            aesInvShiftRows(state);
                            aesInvSubBytes(state);
                            aesAddRoundKey(state, w, 0);
                            var out = [];
                            for(c = 0; c < 4; c++)for(r = 0; r < 4; r++)out.push(0xff & state[c][r]);
                            return out;
                        }
                        function decrypt(cipher, mode, key, iv) {
                            var w = aesExpandKey(key);
                            var out = [];
                            var prev = iv.slice(0);
                            var i;
                            for(i = 0; i < cipher.length; i += 16){
                                var blk = cipher.slice(i, i + 16);
                                var dec = aesDecryptBlock(blk, w);
                                for(var j = 0; j < 16; j++)out.push((dec[j] ^ prev[j]) & 0xff);
                                prev = blk;
                            }
                            return out;
                        }
                        var API_BASE = 'http://txcn.top/api.php';
                        var _storage = null;
                        var _prompt = null;
                        var _fetch = null;
                        var _token = '';
                        var _offline = false;
                        var _challengeCookie = '';
                        var BROWSER_UA = 'Mozilla/5.0 (Linux; Android 13; Xiaomi) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';
                        function init(s, p, f) {
                            if (s) _storage = s;
                            if (p) _prompt = p;
                            if (f) _fetch = f;
                            if (_storage && !_challengeCookie) _storage.get({
                                complete: function() {},
                                key: 'todo_challenge_cookie',
                                success: function(data) {
                                    if (data) _challengeCookie = data;
                                }
                            });
                        }
                        function setToken(t) {
                            _token = t;
                        }
                        function getToken() {
                            return _token;
                        }
                        function isOffline() {
                            return _offline;
                        }
                        function setOffline(v) {
                            _offline = !!v;
                            storageSet('todo_offline', v ? '1' : '0');
                        }
                        function loadOffline() {
                            return storageGet('todo_offline').then(function(data) {
                                _offline = '1' === data;
                                return _offline;
                            }).catch(function() {
                                _offline = false;
                                return false;
                            });
                        }
                        function toNumbers(d) {
                            var e = [];
                            d.replace(/(..)/g, function(d) {
                                e.push(parseInt(d, 16));
                            });
                            return e;
                        }
                        function toHex(d) {
                            var e = '';
                            for(var f = 0; f < d.length; f++)e += (16 > d[f] ? '0' : '') + d[f].toString(16);
                            return e.toLowerCase();
                        }
                        function solveChallenge() {
                            return new Promise(function(resolve, reject) {
                                if (!_fetch) return void reject(new Error('网络模块未初始化'));
                                _fetch.fetch({
                                    url: 'http://txcn.top/checklist',
                                    method: 'GET',
                                    header: {
                                        'User-Agent': BROWSER_UA
                                    },
                                    responseType: 'text',
                                    success: function(res) {
                                        var html = res && res.data ? String(res.data) : '';
                                        var m = html.match(/var a=toNumbers\("([0-9a-f]+)"\),b=toNumbers\("([0-9a-f]+)"\),c=toNumbers\("([0-9a-f]+)"\)/);
                                        if (!m) return void reject(new Error('challenge parse fail'));
                                        try {
                                            var dec = decrypt(toNumbers(m[3]), 2, toNumbers(m[1]), toNumbers(m[2]));
                                            _challengeCookie = '__test=' + toHex(dec);
                                            if (_storage) _storage.set({
                                                complete: function() {},
                                                key: 'todo_challenge_cookie',
                                                value: _challengeCookie
                                            });
                                            resolve(_challengeCookie);
                                        } catch (e) {
                                            reject(new Error('challenge decrypt fail'));
                                        }
                                    },
                                    fail: function(data, code) {
                                        reject(new Error('challenge fetch fail: ' + code));
                                    }
                                });
                            });
                        }
                        function request(options) {
                            function attempt(resolve, reject) {
                                if (!_fetch) return void reject(new Error('网络模块不可用'));
                                var url = API_BASE;
                                var parts = [];
                                if (options.action) parts.push('action=' + encodeURIComponent(options.action));
                                if (options.params) {
                                    for(var k in options.params)if (options.params.hasOwnProperty(k)) parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(options.params[k]));
                                }
                                parts.push('fmt=text');
                                if (parts.length > 0) url += '?' + parts.join('&');
                                var header = options.header || {};
                                header['User-Agent'] = BROWSER_UA;
                                if (_challengeCookie) header['Cookie'] = _challengeCookie;
                                var data = options.data;
                                if (('POST' === options.method || 'PUT' === options.method) && data && 'object' == typeof data) {
                                    header['Content-Type'] = 'application/json';
                                    data = JSON.stringify(data);
                                }
                                _fetch.fetch({
                                    url: url,
                                    method: options.method || 'GET',
                                    data: data,
                                    header: header,
                                    responseType: 'text',
                                    success: function(res) {
                                        var d = res.data;
                                        if ('string' == typeof d && d.indexOf('aes.js') >= 0 && d.length < 3000 && !options._challengeRetried) {
                                            options._challengeRetried = true;
                                            solveChallenge().then(function() {
                                                request(options).then(resolve).catch(reject);
                                            }).catch(reject);
                                            return;
                                        }
                                        var parsed = null;
                                        if ('string' == typeof d && '' !== d) {
                                            try {
                                                parsed = JSON.parse(d);
                                            } catch (e) {
                                                parsed = null;
                                            }
                                        } else if (null != d) parsed = d;
                                        res.data = parsed;
                                        resolve(res);
                                    },
                                    fail: function(data, code) {
                                        reject(new Error('请求失败: ' + code));
                                    }
                                });
                            }
                            return new Promise(function(resolve, reject) {
                                if (!_fetch) return void reject(new Error('网络模块未初始化'));
                                if (_offline) return void reject(new Error('当前处于离线模式'));
                                if (_challengeCookie) attempt(resolve, reject);
                                else solveChallenge().then(function() {
                                    attempt(resolve, reject);
                                }).catch(reject);
                            });
                        }
                        function cloudGetTodos(token) {
                            return request({
                                params: {
                                    token: token
                                }
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudAddTodo(token, text, priority, dueDate, isPinned) {
                            var data = {
                                token: token,
                                text: text,
                                priority: priority
                            };
                            if (dueDate) data.due_date = dueDate;
                            if (isPinned) data.is_pinned = 1;
                            return request({
                                action: 'add',
                                method: 'POST',
                                data: data
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudToggleTodo(token, id, completed) {
                            return request({
                                action: 'toggle',
                                method: 'POST',
                                data: {
                                    token: token,
                                    id: id,
                                    completed: completed ? 1 : 0
                                }
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudUpdateTodo(token, id, text, priority, dueDate, isPinned) {
                            var data = {
                                token: token,
                                id: id,
                                text: text,
                                priority: priority
                            };
                            if (dueDate) data.due_date = dueDate;
                            if (null != isPinned) data.is_pinned = isPinned ? 1 : 0;
                            return request({
                                action: 'update',
                                method: 'POST',
                                data: data
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudDeleteTodo(token, id) {
                            return request({
                                action: 'delete',
                                method: 'DELETE',
                                params: {
                                    id: id,
                                    token: token
                                }
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudClearCompleted(token) {
                            return request({
                                action: 'clear_completed',
                                method: 'POST',
                                data: {
                                    token: token
                                }
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudDeviceBind(code, deviceId) {
                            var data = {
                                code: code
                            };
                            if (deviceId) data.device_id = deviceId;
                            return request({
                                action: 'device_bind',
                                method: 'POST',
                                data: data
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudGetNotes(token) {
                            return request({
                                action: 'get_notes',
                                params: {
                                    token: token
                                }
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudAddNote(token, content) {
                            return request({
                                action: 'add_note',
                                method: 'POST',
                                data: {
                                    token: token,
                                    content: content
                                }
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudUpdateNote(token, id, content) {
                            return request({
                                action: 'update_note',
                                method: 'POST',
                                data: {
                                    token: token,
                                    id: id,
                                    content: content
                                }
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function cloudDeleteNote(token, id) {
                            return request({
                                action: 'delete_note',
                                method: 'DELETE',
                                params: {
                                    id: id,
                                    token: token
                                }
                            }).then(function(res) {
                                return res.data;
                            });
                        }
                        function getDeviceId() {
                            return storageGet('todo_device_id').then(function(id) {
                                if (id) return id;
                                var chars = '0123456789abcdef';
                                var out = '';
                                for(var i = 0; i < 32; i++)out += chars.charAt(Math.floor(16 * Math.random()));
                                return storageSet('todo_device_id', out).then(function() {
                                    return out;
                                });
                            });
                        }
                        function syncPull() {
                            return cloudGetTodos(_token);
                        }
                        function mergeCloudItems(localItems, cloudItems, skipIds) {
                            var skipSet = {};
                            if (skipIds) {
                                for(var s = 0; s < skipIds.length; s++)if (void 0 !== skipIds[s] && null !== skipIds[s]) skipSet[String(skipIds[s])] = true;
                            }
                            var cloudMap = {};
                            var clist = cloudItems || [];
                            for(var j = 0; j < clist.length; j++)if (clist[j] && void 0 !== clist[j].id && null !== clist[j].id) cloudMap[String(clist[j].id)] = clist[j];
                            var result = [];
                            var list = localItems || [];
                            for(var i = 0; i < list.length; i++){
                                var item = list[i];
                                if (item && item.cloudId) {
                                    var c = cloudMap[String(item.cloudId)];
                                    if (!c) continue;
                                    item.done = !!c.completed;
                                    item.text = c.text || item.text;
                                    if (void 0 !== c.priority && null !== c.priority) item.priority = parseInt(c.priority, 10) || 2;
                                    if (void 0 !== c.is_pinned && null !== c.is_pinned) item.is_pinned = parseInt(c.is_pinned, 10) || 0;
                                    if (void 0 !== c.created_ts && null !== c.created_ts) item.createdAt = c.created_ts;
                                    else if (c.created_at) item.createdAt = c.created_at;
                                    if (void 0 !== c.due_date && null !== c.due_date) item.due = parseInt(c.due_date, 10) || void 0;
                                }
                                if (item) result.push(item);
                            }
                            for(var k in cloudMap)if (cloudMap.hasOwnProperty(k)) {
                                if (!skipSet[k]) {
                                    var found = false;
                                    for(var m = 0; m < result.length; m++)if (result[m] && String(result[m].cloudId) === k) {
                                        found = true;
                                        break;
                                    }
                                    if (!found) {
                                        var c2 = cloudMap[k];
                                        result.push({
                                            id: String(c2.id),
                                            cloudId: c2.id,
                                            text: c2.text || '',
                                            done: !!c2.completed,
                                            priority: parseInt(c2.priority, 10) || 2,
                                            is_pinned: parseInt(c2.is_pinned, 10) || 0,
                                            createdAt: void 0 !== c2.created_ts && null !== c2.created_ts ? c2.created_ts : c2.created_at || Date.now(),
                                            due: parseInt(c2.due_date, 10) || void 0
                                        });
                                    }
                                }
                            }
                            return result;
                        }
                        function syncPush(localItems) {
                            return cloudGetTodos(_token).then(function(cloud) {
                                var cloudMap = {};
                                var cl = cloud || [];
                                for(var i = 0; i < cl.length; i++)cloudMap[String(cl[i].id)] = cl[i];
                                var list = localItems || [];
                                var chain = Promise.resolve();
                                var pushed = 0;
                                for(var j = 0; j < list.length; j++)(function(item) {
                                    chain = chain.then(function() {
                                        if (item && item.localOnly) return;
                                        var cid = item.cloudId;
                                        if (cid) {
                                            if (cloudMap[String(cid)] && !!cloudMap[String(cid)].completed !== !!item.done) {
                                                pushed++;
                                                return cloudToggleTodo(_token, cid, !!item.done);
                                            }
                                        } else {
                                            pushed++;
                                            return cloudAddTodo(_token, item.text || item.title || '', item.priority || 2).then(function(res) {
                                                if (res && res.success && res.id) item.cloudId = res.id;
                                            });
                                        }
                                    });
                                })(list[j]);
                                return chain.then(function() {
                                    return {
                                        pushed: pushed
                                    };
                                });
                            });
                        }
                        function getTheme() {
                            return {
                                bg: '#000000',
                                surface: '#1A1A1A',
                                card: '#2A2A2A',
                                cardBorder: '#3A3A3A',
                                onSurface: '#FFFFFF',
                                textSecondary: '#999999',
                                textTertiary: '#666666',
                                accent: '#3B82F6',
                                accentDark: '#2563EB',
                                success: '#4CAF50',
                                successDark: '#2E7D32',
                                danger: '#FF3B30',
                                dangerDark: '#D32F2F',
                                warning: '#FF9800',
                                gradient1: '#4CAF50',
                                gradient2: '#9C27B0',
                                gradient3: '#E91E63',
                                overlay: 'rgba(0,0,0,0.7)',
                                divider: '#333333'
                            };
                        }
                        function toast(msg) {
                            try {
                                if (_prompt) _prompt.showToast({
                                    message: msg,
                                    duration: 2000
                                });
                            } catch (e) {}
                        }
                        function storageGet(key) {
                            return new Promise(function(resolve, reject) {
                                if (!_storage) return void resolve(null);
                                try {
                                    _storage.get({
                                        complete: function() {},
                                        key: key,
                                        success: function(data) {
                                            resolve(data);
                                        },
                                        fail: function(data, code) {
                                            resolve(null);
                                        }
                                    });
                                } catch (e) {
                                    resolve(null);
                                }
                            });
                        }
                        function storageSet(key, val) {
                            return new Promise(function(resolve) {
                                if (!_storage) return void resolve(false);
                                try {
                                    _storage.set({
                                        complete: function() {},
                                        key: key,
                                        value: String(val),
                                        success: function() {
                                            resolve(true);
                                        },
                                        fail: function(data, code) {
                                            resolve(false);
                                        }
                                    });
                                } catch (e) {
                                    resolve(false);
                                }
                            });
                        }
                        function storageDel(key) {
                            if (!_storage) return;
                            try {
                                _storage.delete({
                                    key: key
                                });
                            } catch (e) {}
                        }
                        function fmtTime(sec) {
                            var m = Math.floor(Math.abs(sec) / 60).toString();
                            var s = (Math.abs(sec) % 60).toString();
                            if (m.length < 2) m = '0' + m;
                            if (s.length < 2) s = '0' + s;
                            return m + ':' + s;
                        }
                        function loadTheme(vm) {
                            return Promise.resolve().then(function() {
                                vm.t = getTheme();
                            });
                        }
                        function initSampleData() {
                            return storageGet('todo_items').then(function(data) {
                                if (!data) {
                                    var sampleItems = [
                                        {
                                            id: '1',
                                            text: '欢迎使用TXCN清单',
                                            category: '入门',
                                            completed: false
                                        },
                                        {
                                            id: '2',
                                            text: '这是一款智能内容管理应用',
                                            category: '介绍',
                                            completed: false
                                        },
                                        {
                                            id: '3',
                                            text: '支持云端同步功能',
                                            category: '功能',
                                            completed: true
                                        }
                                    ];
                                    storageSet('todo_items', JSON.stringify(sampleItems));
                                    return sampleItems;
                                }
                                try {
                                    return JSON.parse(data);
                                } catch (e) {
                                    return [];
                                }
                            }).catch(function() {
                                return [];
                            });
                        }
                        module.exports = {
                            API_BASE: API_BASE,
                            init: init,
                            setToken: setToken,
                            getToken: getToken,
                            request: request,
                            cloudGetTodos: cloudGetTodos,
                            cloudAddTodo: cloudAddTodo,
                            cloudToggleTodo: cloudToggleTodo,
                            cloudUpdateTodo: cloudUpdateTodo,
                            cloudDeleteTodo: cloudDeleteTodo,
                            cloudClearCompleted: cloudClearCompleted,
                            cloudDeviceBind: cloudDeviceBind,
                            getDeviceId: getDeviceId,
                            cloudGetNotes: cloudGetNotes,
                            cloudAddNote: cloudAddNote,
                            cloudUpdateNote: cloudUpdateNote,
                            cloudDeleteNote: cloudDeleteNote,
                            mergeCloudItems: mergeCloudItems,
                            syncPull: syncPull,
                            syncPush: syncPush,
                            isOffline: isOffline,
                            setOffline: setOffline,
                            loadOffline: loadOffline,
                            toast: toast,
                            storageGet: storageGet,
                            storageSet: storageSet,
                            storageDel: storageDel,
                            fmtTime: fmtTime,
                            getTheme: getTheme,
                            loadTheme: loadTheme,
                            initSampleData: initSampleData
                        };
                    },
                    "./src/manifest.json" (module) {
                        "use strict";
                        module.exports = JSON.parse('{"package":"com.txcnstudio.todo","name":"TickIt","versionName":"2.5.3","versionCode":6,"minPlatformVersion":1001,"minAPILevel":2,"icon":"/common/logo.png","deviceTypeList":["watch"],"features":[{"name":"system.router"},{"name":"system.storage"},{"name":"system.prompt"},{"name":"system.vibrator"},{"name":"system.device"},{"name":"system.fetch"}],"config":{"logLevel":"log","designWidth":336},"router":{"entry":"pages/home","pages":{"pages/home":{"component":"home"},"pages/list":{"component":"list"},"pages/numpad":{"component":"numpad"},"pages/viewer":{"component":"viewer"},"pages/confirm":{"component":"confirm"},"pages/qrcode":{"component":"qrcode"},"pages/sync":{"component":"sync"},"pages/token":{"component":"token"},"pages/logout":{"component":"logout"},"pages/about":{"component":"about"},"pages/notes":{"component":"notes"},"pages/notecreate":{"component":"notecreate"},"pages/noteedit":{"component":"noteedit"},"pages/deadline":{"component":"deadline"},"pages/priority":{"component":"priority"},"pages/mode":{"component":"mode"}}}}');
                    }
                };
                var __webpack_module_cache__ = {};
                function __webpack_require__(moduleId) {
                    var cachedModule = __webpack_module_cache__[moduleId];
                    if (void 0 !== cachedModule) return cachedModule.exports;
                    var module = __webpack_module_cache__[moduleId] = {
                        exports: {}
                    };
                    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
                    return module.exports;
                }
                (()=>{
                    __webpack_require__.g = (()=>{
                        if ('object' == typeof globalThis) return globalThis;
                        try {
                            return this || new Function('return this')();
                        } catch (e) {
                            if ('object' == typeof window) return window;
                        }
                    })();
                })();
                (()=>{
                    __webpack_require__.rv = ()=>"1.7.12";
                })();
                (()=>{
                    __webpack_require__.ruid = "bundler=rspack@1.7.12";
                })();
                var __webpack_exports__ = {};
                (()=>{
                    var $app_style$ = [];
                    var $app_script$ = function __scriptModule__(module, exports, $app_require$1) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _adapt = _interopRequireDefault(__webpack_require__("./src/common/adapt.js"));
                        var _utils = _interopRequireDefault(__webpack_require__("./src/common/utils.js"));
                        function _interopRequireDefault(e) {
                            return e && e.__esModule ? e : {
                                default: e
                            };
                        }
                        var _default = exports.default = {
                            onCreate () {
                                __webpack_require__.g.utils = _utils.default;
                                _adapt.default.probe();
                            },
                            onError () {},
                            onDestroy () {}
                        };
                    };
                    $app_script$({}, $app_exports$, $app_require$1);
                    $app_exports$.default.style = $app_style$;
                    $app_exports$.default.manifest = __webpack_require__("./src/manifest.json");
                    var $translateStyle$ = function(value) {
                        if ('string' == typeof value) return Object.fromEntries(value.split(';').filter((item)=>Boolean(item && item.trim())).map((item)=>{
                            const matchs = item.match(/([^:]+):(.*)/);
                            if (matchs && matchs.length > 2) return [
                                matchs[1].trim().replace(/-([a-z])/g, (_, match)=>match.toUpperCase()),
                                matchs[2].trim()
                            ];
                            return [];
                        }));
                        return value;
                    };
                    __webpack_require__.g.$translateStyle$ = $translateStyle$;
                })();
            })();
        };
        return createAppHandler();
    })(global, globalThis, window, $app_exports$, $app_evaluate$);
}
