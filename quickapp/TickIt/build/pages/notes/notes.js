export default function(global, globalThis, window, $app_exports$, $app_evaluate$) {
    var org_app_require = $app_require$;
    (function(global, globalThis, window, $app_exports$, $app_evaluate$) {
        var setTimeout = global.setTimeout;
        var setInterval = global.setInterval;
        var clearTimeout = global.clearTimeout;
        var clearInterval = global.clearInterval;
        var $app_require$1 = global.$app_require$ || org_app_require;
        var createPageHandler = function() {
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
                        var _system = _interopRequireDefault($app_require$1("@app-module/system.router"));
                        var _system2 = _interopRequireDefault($app_require$1("@app-module/system.storage"));
                        var _system3 = _interopRequireDefault($app_require$1("@app-module/system.prompt"));
                        var _system4 = _interopRequireDefault($app_require$1("@app-module/system.fetch"));
                        var _adapt = _interopRequireDefault(__webpack_require__("./src/common/adapt.js"));
                        function _interopRequireDefault(e) {
                            return e && e.__esModule ? e : {
                                default: e
                            };
                        }
                        const utils = __webpack_require__.g.utils || {};
                        var _default = exports.default = {
                            private: {
                                isCircle: null,
                                circleAddVisible: false,
                                timeStr: '',
                                notes: [],
                                shownNotes: [],
                                loading: true,
                                empty: false
                            },
                            onInit () {
                                this._alive = true;
                                this.isCircle = _adapt.default.isCircleSync();
                                utils.init(_system2.default, _system3.default, _system4.default);
                            },
                            onShow () {
                                this.hideCircleAdd();
                                this._circleScrollY = 0;
                                var that = this;
                                _adapt.default.probe().then(function(info) {
                                    if (that.isCircle !== info.isCircle) that.isCircle = info.isCircle;
                                });
                                that.updateTime();
                                that.loading = true;
                                that.syncPendingNotes().then(function() {
                                    that.loadNotes();
                                });
                            },
                            onHide () {
                                this.hideCircleAdd();
                            },
                            onDestroy () {
                                this._alive = false;
                                this.hideCircleAdd();
                                if ("function" == typeof __webpack_require__.g.runGC) __webpack_require__.g.runGC();
                            },
                            updateTime () {
                                var now = new Date();
                                var h = now.getHours().toString();
                                if (h.length < 2) h = '0' + h;
                                var m = now.getMinutes().toString();
                                if (m.length < 2) m = '0' + m;
                                this.timeStr = h + ':' + m;
                            },
                            syncPendingNotes () {
                                return new Promise(function(resolveAll) {
                                    utils.loadOffline().then(function(off) {
                                        if (off) return void resolveAll();
                                        utils.storageGet('todo_token').then(function(token) {
                                            if (!token || 'guest_token' === token) return void resolveAll();
                                            utils.setToken(token);
                                            var done = function() {
                                                resolveAll();
                                            };
                                            utils.storageGet('todo_notes_pending_add').then(function(pd) {
                                                var pending = [];
                                                if (pd) {
                                                    try {
                                                        pending = JSON.parse(pd);
                                                    } catch (e) {
                                                        pending = [];
                                                    }
                                                }
                                                if (!pending.length) return void doUpdateChain();
                                                utils.storageGet('todo_notes_voided').then(function(vd) {
                                                    var voided = [];
                                                    if (vd) {
                                                        try {
                                                            voided = JSON.parse(vd);
                                                        } catch (e) {
                                                            voided = [];
                                                        }
                                                    }
                                                    var chain = Promise.resolve();
                                                    var remaining = [];
                                                    for(var i = 0; i < pending.length; i++)(function(p) {
                                                        chain = chain.then(function() {
                                                            if (voided.indexOf(p.localId) >= 0) return null;
                                                            return utils.storageGet('todo_notes').then(function(data) {
                                                                var exists = false;
                                                                if (data) {
                                                                    try {
                                                                        var l = JSON.parse(data);
                                                                        for(var k = 0; k < l.length; k++)if (l[k] && l[k].id === p.localId) {
                                                                            exists = !l[k].localOnly;
                                                                            break;
                                                                        }
                                                                    } catch (e) {}
                                                                }
                                                                if (!exists) return null;
                                                                return utils.cloudAddNote(token, p.content).then(function(res) {
                                                                    if (res && res.success && res.id) return utils.storageGet('todo_notes').then(function(data2) {
                                                                        var list = [];
                                                                        if (data2) {
                                                                            try {
                                                                                list = JSON.parse(data2);
                                                                            } catch (e) {
                                                                                list = [];
                                                                            }
                                                                        }
                                                                        for(var j = 0; j < list.length; j++)if (list[j] && list[j].id === p.localId) {
                                                                            list[j].cloudId = res.id;
                                                                            break;
                                                                        }
                                                                        return utils.storageSet('todo_notes', JSON.stringify(list));
                                                                    });
                                                                    remaining.push(p);
                                                                    return null;
                                                                }).catch(function() {
                                                                    remaining.push(p);
                                                                    return null;
                                                                });
                                                            });
                                                        });
                                                    })(pending[i]);
                                                    chain.then(function() {
                                                        utils.storageSet('todo_notes_pending_add', JSON.stringify(remaining)).then(function() {
                                                            utils.storageSet('todo_notes_voided', '[]').then(doUpdateChain);
                                                        });
                                                    });
                                                });
                                            });
                                            function doUpdateChain() {
                                                utils.storageGet('todo_notes_pending_update').then(function(pd) {
                                                    var pending = [];
                                                    if (pd) {
                                                        try {
                                                            pending = JSON.parse(pd);
                                                        } catch (e) {
                                                            pending = [];
                                                        }
                                                    }
                                                    if (!pending.length) return void doDeleteChain();
                                                    var uchain = Promise.resolve();
                                                    var uremaining = [];
                                                    for(var i = 0; i < pending.length; i++)(function(p) {
                                                        uchain = uchain.then(function() {
                                                            return utils.storageGet('todo_notes').then(function(data) {
                                                                var exists = false;
                                                                if (data) {
                                                                    try {
                                                                        var l = JSON.parse(data);
                                                                        for(var k = 0; k < l.length; k++)if (l[k] && l[k].cloudId === p.cloudId) {
                                                                            exists = true;
                                                                            break;
                                                                        }
                                                                    } catch (e) {}
                                                                }
                                                                if (!exists) return null;
                                                                return utils.cloudUpdateNote(token, p.cloudId, p.content).then(function(res) {
                                                                    if (res && res.success) return;
                                                                    uremaining.push(p);
                                                                }).catch(function() {
                                                                    uremaining.push(p);
                                                                });
                                                            });
                                                        });
                                                    })(pending[i]);
                                                    uchain.then(function() {
                                                        utils.storageSet('todo_notes_pending_update', JSON.stringify(uremaining)).then(doDeleteChain);
                                                    });
                                                });
                                            }
                                            function doDeleteChain() {
                                                utils.storageGet('todo_pending_delete_notes').then(function(pd) {
                                                    var pending = [];
                                                    if (pd) {
                                                        try {
                                                            pending = JSON.parse(pd);
                                                        } catch (e) {
                                                            pending = [];
                                                        }
                                                    }
                                                    if (!pending.length) return void done();
                                                    var dchain = Promise.resolve();
                                                    var dremaining = [];
                                                    for(var k = 0; k < pending.length; k++)(function(cid) {
                                                        dchain = dchain.then(function() {
                                                            return utils.cloudDeleteNote(token, cid).then(function(res) {
                                                                if (res && res.success) return;
                                                                dremaining.push(cid);
                                                            }).catch(function() {
                                                                dremaining.push(cid);
                                                            });
                                                        });
                                                    })(pending[k]);
                                                    dchain.then(function() {
                                                        utils.storageSet('todo_pending_delete_notes', JSON.stringify(dremaining)).then(done);
                                                    });
                                                });
                                            }
                                        });
                                    });
                                });
                            },
                            renderList (list) {
                                var that = this;
                                var arr = (list || []).slice().sort(function(a, b) {
                                    return (b.createdAt || 0) - (a.createdAt || 0);
                                });
                                that.notes = arr.map(function(n) {
                                    return {
                                        id: n.id,
                                        content: n.content || ''
                                    };
                                });
                                that._allNotes = that.notes;
                                that.shownNotes = that.notes.slice(0, 8);
                                that.loading = false;
                                that.empty = 0 === that.notes.length;
                            },
                            loadMoreNotes () {
                                var that = this;
                                if (!that._allNotes || that.shownNotes.length >= that._allNotes.length) return;
                                var more = that._allNotes.slice(that.shownNotes.length, that.shownNotes.length + 8);
                                for(var i = 0; i < more.length; i++)that.shownNotes.push(more[i]);
                            },
                            mergeNotes (local, cloud, pendingDel) {
                                var delSet = {};
                                if (pendingDel) {
                                    for(var d = 0; d < pendingDel.length; d++)delSet[String(pendingDel[d])] = true;
                                }
                                var cloudMap = {};
                                for(var i = 0; i < cloud.length; i++)if (cloud[i] && void 0 !== cloud[i].id && null !== cloud[i].id) cloudMap[String(cloud[i].id)] = cloud[i];
                                var result = [];
                                var list = local || [];
                                for(var j = 0; j < list.length; j++){
                                    var item = list[j];
                                    if (item) {
                                        if (item.cloudId) {
                                            var c = cloudMap[String(item.cloudId)];
                                            if (!c) continue;
                                            item.content = c.content || item.content;
                                            if (c.created_ts) item.createdAt = 1000 * c.created_ts;
                                        }
                                        result.push(item);
                                    }
                                }
                                for(var k in cloudMap)if (cloudMap.hasOwnProperty(k)) {
                                    if (!delSet[k]) {
                                        var found = false;
                                        for(var m = 0; m < result.length; m++)if (result[m] && String(result[m].cloudId) === k) {
                                            found = true;
                                            break;
                                        }
                                        if (!found) {
                                            var c2 = cloudMap[k];
                                            var cTs = c2.created_ts ? 1000 * c2.created_ts : 0;
                                            for(var n = 0; n < result.length; n++)if (!result[n].cloudId && result[n].content === c2.content && cTs && result[n].createdAt && Math.abs(result[n].createdAt - cTs) < 10000) {
                                                result[n].cloudId = c2.id;
                                                found = true;
                                                break;
                                            }
                                        }
                                        if (!found) {
                                            var c3 = cloudMap[k];
                                            result.push({
                                                id: String(c3.id),
                                                cloudId: c3.id,
                                                content: c3.content || '',
                                                createdAt: c3.created_ts ? 1000 * c3.created_ts : Date.now()
                                            });
                                        }
                                    }
                                }
                                return result;
                            },
                            loadNotes () {
                                var that = this;
                                utils.storageGet('todo_notes').then(function(data) {
                                    var local = [];
                                    if (data) {
                                        try {
                                            local = JSON.parse(data);
                                        } catch (e) {
                                            local = [];
                                        }
                                    }
                                    that.renderList(local);
                                    utils.loadOffline().then(function(off) {
                                        if (off) return;
                                        utils.storageGet('todo_token').then(function(token) {
                                            if (!token || 'guest_token' === token) return;
                                            utils.setToken(token);
                                            utils.cloudGetNotes(token).then(function(cloud) {
                                                var isArr = '[object Array]' === Object.prototype.toString.call(cloud);
                                                if (!isArr) return;
                                                utils.storageGet('todo_notes').then(function(data2) {
                                                    var local2 = [];
                                                    if (data2) {
                                                        try {
                                                            local2 = JSON.parse(data2);
                                                        } catch (e) {
                                                            local2 = [];
                                                        }
                                                    }
                                                    utils.storageGet('todo_pending_delete_notes').then(function(pd) {
                                                        var pendingDel = [];
                                                        if (pd) {
                                                            try {
                                                                pendingDel = JSON.parse(pd);
                                                            } catch (e) {
                                                                pendingDel = [];
                                                            }
                                                        }
                                                        utils.storageGet('todo_notes_ignore_ids').then(function(ig) {
                                                            var ignores = [];
                                                            if (ig) {
                                                                try {
                                                                    ignores = JSON.parse(ig);
                                                                } catch (e) {
                                                                    ignores = [];
                                                                }
                                                            }
                                                            var merged = that.mergeNotes(local2, cloud, pendingDel.concat(ignores));
                                                            utils.storageSet('todo_notes', JSON.stringify(merged)).then(function() {
                                                                that.renderList(merged);
                                                            });
                                                        });
                                                    });
                                                });
                                            }).catch(function(err) {});
                                        });
                                    });
                                });
                            },
                            addNote () {
                                _system.default.push({
                                    uri: 'pages/notecreate'
                                });
                            },
                            editNote (id) {
                                _system.default.push({
                                    uri: 'pages/noteedit',
                                    params: {
                                        noteId: id
                                    }
                                });
                            },
                            showMenu () {
                                _system.default.push({
                                    uri: 'pages/list'
                                });
                            },
                            showCircleAdd () {
                                if (!this.isCircle) return;
                                this.circleAddVisible = true;
                                if (this._circleAddTimer) clearTimeout(this._circleAddTimer);
                                var that = this;
                                this._circleAddTimer = setTimeout(function() {
                                    that.circleAddVisible = false;
                                    that._circleAddTimer = null;
                                }, 3000);
                            },
                            hideCircleAdd () {
                                if (this._circleAddTimer) clearTimeout(this._circleAddTimer);
                                this._circleAddTimer = null;
                                this.circleAddVisible = false;
                            },
                            onCircleTouchStart (e) {
                                if (!this.isCircle || !e || !e.touches || !e.touches.length) return;
                                this._circleTouch = {
                                    x: e.touches[0].clientX,
                                    y: e.touches[0].clientY
                                };
                            },
                            onCircleTouchEnd (e) {
                                var start = this._circleTouch;
                                this._circleTouch = null;
                                if (!this.isCircle || !start || !e || !e.changedTouches || !e.changedTouches.length) return;
                                var touch = e.changedTouches[0];
                                var dy = touch.clientY - start.y;
                                if (Math.abs(dy) < 24 || Math.abs(dy) <= Math.abs(touch.clientX - start.x)) return;
                                if (dy < 0) this.showCircleAdd();
                                else this.hideCircleAdd();
                            },
                            onSwipe (e) {
                                if (!this.isCircle || !e) return;
                                if ('up' === e.direction) this.showCircleAdd();
                                if ('down' === e.direction) this.hideCircleAdd();
                            },
                            goBack () {
                                _system.default.back();
                            }
                        };
                        const moduleOwn = exports.default || module.exports;
                        const accessors = [
                            'public',
                            'protected',
                            'private'
                        ];
                        if (moduleOwn.data && accessors.some(function(acc) {
                            return moduleOwn[acc];
                        })) throw new Error('页面VM对象中的属性data不可与"' + accessors.join(',') + '"同时存在，请使用private替换data名称');
                        if (!moduleOwn.data) {
                            moduleOwn.data = {};
                            moduleOwn._descriptor = {};
                            accessors.forEach(function(acc) {
                                const accType = typeof moduleOwn[acc];
                                if ('object' === accType) {
                                    moduleOwn.data = Object.assign(moduleOwn.data, moduleOwn[acc]);
                                    for(const name in moduleOwn[acc])moduleOwn._descriptor[name] = {
                                        access: acc
                                    };
                                } else if ('function' === accType) console.warn('页面VM对象中的属性' + acc + '的值不能是函数，请使用对象');
                            });
                        }
                    };
                    var $app_template$ = function(vm) {
                        const _vm_ = vm || this;
                        return aiot.__ce__("div", {
                            __vm__: _vm_,
                            __opts__: {
                                style: {
                                    flexDirection: "column",
                                    width: "336px",
                                    height: "100%",
                                    backgroundColor: "#000000"
                                }
                            }
                        }, [
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return _vm_.isCircle;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "336px",
                                                height: "336px"
                                            }
                                        }
                                    }, [
                                        aiot.__ci__({
                                            __vm__: _vm_,
                                            __opts__: {
                                                shown: function() {
                                                    return _vm_.isCircle;
                                                },
                                                modifiers: {
                                                    shown: {
                                                        static: true
                                                    }
                                                }
                                            }
                                        }, function() {
                                            return [
                                                aiot.__ce__("image", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        src: "/common/circle-ctr-82.png",
                                                        style: {
                                                            position: "absolute",
                                                            left: "148px",
                                                            top: "15px",
                                                            width: "41px",
                                                            height: "41px"
                                                        },
                                                        events: {
                                                            click: function(evt) {
                                                                return _vm_.showMenu(evt);
                                                            }
                                                        }
                                                    }
                                                }, [])
                                            ];
                                        }),
                                        aiot.__ci__({
                                            __vm__: _vm_,
                                            __opts__: {
                                                shown: function() {
                                                    return _vm_.isCircle;
                                                }
                                            }
                                        }, function() {
                                            return [
                                                aiot.__ce__("text", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            position: "absolute",
                                                            left: "36px",
                                                            top: "67px",
                                                            width: "264px",
                                                            textAlign: "center",
                                                            fontSize: "28px",
                                                            fontWeight: 700,
                                                            color: "#ffffff",
                                                            lines: 1
                                                        },
                                                        value: "便签"
                                                    }
                                                }, [])
                                            ];
                                        }),
                                        aiot.__ci__({
                                            __vm__: _vm_,
                                            __opts__: {
                                                shown: function() {
                                                    return _vm_.isCircle && !_vm_.empty && !_vm_.loading;
                                                }
                                            }
                                        }, function() {
                                            return [
                                                aiot.__ce__("scroll", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        scrollY: "true",
                                                        bounces: "false",
                                                        events: {
                                                            scrollbottom: function(evt) {
                                                                return _vm_.loadMoreNotes(evt);
                                                            }
                                                        },
                                                        style: {
                                                            position: "absolute",
                                                            left: 0,
                                                            top: "110px",
                                                            width: "336px",
                                                            height: "226px",
                                                            flexDirection: "column"
                                                        }
                                                    }
                                                }, [
                                                    aiot.__cf__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            exp: function() {
                                                                return _vm_.shownNotes;
                                                            },
                                                            key: "$idx",
                                                            value: "$item"
                                                        }
                                                    }, function($idx, $item) {
                                                        return [
                                                            aiot.__ce__("div", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    style: {
                                                                        width: "291px",
                                                                        minHeight: "77px",
                                                                        marginLeft: "22px",
                                                                        marginBottom: "10px",
                                                                        borderRadius: "24px",
                                                                        backgroundColor: "#262626",
                                                                        flexDirection: "column",
                                                                        justifyContent: "center",
                                                                        paddingLeft: "22px",
                                                                        paddingRight: "22px"
                                                                    },
                                                                    events: {
                                                                        click: function(evt) {
                                                                            return _vm_.editNote($item.id, evt);
                                                                        }
                                                                    }
                                                                }
                                                            }, [
                                                                aiot.__ce__("text", {
                                                                    __vm__: _vm_,
                                                                    __opts__: {
                                                                        style: {
                                                                            fontSize: "22px",
                                                                            color: "#ffffff"
                                                                        },
                                                                        value: function() {
                                                                            return $item.content;
                                                                        }
                                                                    }
                                                                }, [])
                                                            ])
                                                        ];
                                                    }),
                                                    aiot.__ce__("div", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: {
                                                                height: "84px",
                                                                minHeight: "84px",
                                                                flexShrink: 0
                                                            }
                                                        }
                                                    }, [])
                                                ])
                                            ];
                                        }),
                                        aiot.__ci__({
                                            __vm__: _vm_,
                                            __opts__: {
                                                shown: function() {
                                                    return _vm_.isCircle;
                                                }
                                            }
                                        }, function() {
                                            return [
                                                aiot.__ce__("image", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        src: "/common/circle-ctr-92.png",
                                                        style: {
                                                            position: "absolute",
                                                            left: "112px",
                                                            top: "252px",
                                                            width: "112px",
                                                            height: "66.5px"
                                                        },
                                                        events: {
                                                            click: function(evt) {
                                                                return _vm_.addNote(evt);
                                                            }
                                                        }
                                                    }
                                                }, [])
                                            ];
                                        }),
                                        aiot.__ci__({
                                            __vm__: _vm_,
                                            __opts__: {
                                                shown: function() {
                                                    return _vm_.isCircle && _vm_.empty;
                                                }
                                            }
                                        }, function() {
                                            return [
                                                aiot.__ce__("text", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            position: "absolute",
                                                            left: "36px",
                                                            top: "180px",
                                                            width: "264px",
                                                            textAlign: "center",
                                                            fontSize: "22px",
                                                            color: "#666666"
                                                        },
                                                        value: "暂无便签"
                                                    }
                                                }, [])
                                            ];
                                        })
                                    ])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return false === _vm_.isCircle && _vm_.empty;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                width: "336px",
                                                height: "100%"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/notes-empty-bg.png",
                                                style: {
                                                    position: "absolute",
                                                    left: 0,
                                                    top: 0,
                                                    width: "336px",
                                                    height: "100%"
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/icon-notes-back.png",
                                                style: {
                                                    position: "absolute",
                                                    left: "6px",
                                                    top: "6px",
                                                    width: "72px",
                                                    height: "72px"
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.goBack(evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    position: "absolute",
                                                    left: "105px",
                                                    top: "10px",
                                                    width: "126px",
                                                    textAlign: "center",
                                                    fontSize: "26px",
                                                    color: "#999999"
                                                },
                                                value: function() {
                                                    return _vm_.timeStr;
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/icon-notes-add.png",
                                                style: {
                                                    position: "absolute",
                                                    left: "258px",
                                                    top: "6px",
                                                    width: "72px",
                                                    height: "72px"
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.addNote(evt);
                                                    }
                                                }
                                            }
                                        }, [])
                                    ])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return !(false === _vm_.isCircle && _vm_.empty) && false === _vm_.isCircle && _vm_.loading;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                width: "336px",
                                                height: "100%"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/icon-notes-back.png",
                                                style: {
                                                    position: "absolute",
                                                    left: "6px",
                                                    top: "6px",
                                                    width: "72px",
                                                    height: "72px"
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.goBack(evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/icon-notes-add.png",
                                                style: {
                                                    position: "absolute",
                                                    left: "258px",
                                                    top: "6px",
                                                    width: "72px",
                                                    height: "72px"
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.addNote(evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    position: "absolute",
                                                    left: "105px",
                                                    top: "10px",
                                                    width: "126px",
                                                    textAlign: "center",
                                                    fontSize: "26px",
                                                    color: "#999999"
                                                },
                                                value: function() {
                                                    return _vm_.timeStr;
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    position: "absolute",
                                                    left: "100px",
                                                    top: "40px",
                                                    width: "136px",
                                                    textAlign: "center",
                                                    fontSize: "32px",
                                                    fontWeight: 700,
                                                    color: "#ffffff"
                                                },
                                                value: "便签"
                                            }
                                        }, []),
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    flex: 1,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }
                                            }
                                        }, [
                                            aiot.__ce__("text", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        fontSize: "22px",
                                                        color: "#999999"
                                                    },
                                                    value: "加载中..."
                                                }
                                            }, [])
                                        ])
                                    ])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return !(false === _vm_.isCircle && _vm_.loading) && !(false === _vm_.isCircle && _vm_.empty) && false === _vm_.isCircle;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                flex: 1,
                                                flexDirection: "column"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/icon-notes-back.png",
                                                style: {
                                                    position: "absolute",
                                                    left: "6px",
                                                    top: "6px",
                                                    width: "72px",
                                                    height: "72px"
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.goBack(evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/icon-notes-add.png",
                                                style: {
                                                    position: "absolute",
                                                    left: "258px",
                                                    top: "6px",
                                                    width: "72px",
                                                    height: "72px"
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.addNote(evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    position: "absolute",
                                                    left: "105px",
                                                    top: "10px",
                                                    width: "126px",
                                                    textAlign: "center",
                                                    fontSize: "26px",
                                                    color: "#999999"
                                                },
                                                value: function() {
                                                    return _vm_.timeStr;
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    position: "absolute",
                                                    left: "100px",
                                                    top: "40px",
                                                    width: "136px",
                                                    textAlign: "center",
                                                    fontSize: "32px",
                                                    fontWeight: 700,
                                                    color: "#ffffff"
                                                },
                                                value: "便签"
                                            }
                                        }, []),
                                        aiot.__ce__("scroll", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                scrollY: "true",
                                                bounces: "false",
                                                style: {
                                                    flex: 1,
                                                    flexDirection: "column",
                                                    marginTop: "86px"
                                                }
                                            }
                                        }, [
                                            aiot.__cf__({
                                                __vm__: _vm_,
                                                __opts__: {
                                                    exp: function() {
                                                        return _vm_.notes;
                                                    },
                                                    key: "$idx",
                                                    value: "$item"
                                                }
                                            }, function($idx, $item) {
                                                return [
                                                    aiot.__ce__("div", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: {
                                                                width: "324px",
                                                                minHeight: "112px",
                                                                marginLeft: "6px",
                                                                marginRight: "6px",
                                                                marginBottom: "8px",
                                                                borderRadius: "20px",
                                                                backgroundColor: "#262626",
                                                                flexDirection: "column",
                                                                justifyContent: "center",
                                                                paddingTop: "16px",
                                                                paddingRight: "16px",
                                                                paddingBottom: "16px",
                                                                paddingLeft: "16px"
                                                            },
                                                            events: {
                                                                click: function(evt) {
                                                                    return _vm_.editNote($item.id, evt);
                                                                }
                                                            }
                                                        }
                                                    }, [
                                                        aiot.__ce__("text", {
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                style: {
                                                                    fontSize: "38px",
                                                                    color: "#ffffff",
                                                                    textAlign: "left"
                                                                },
                                                                value: function() {
                                                                    return $item.content;
                                                                }
                                                            }
                                                        }, [])
                                                    ])
                                                ];
                                            }),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        height: "12px"
                                                    }
                                                }
                                            }, [])
                                        ])
                                    ])
                                ];
                            })
                        ]);
                    };
                    $app_exports$['entry'] = function($app_exports$) {
                        $app_script$({}, $app_exports$, $app_require$1);
                        $app_exports$.default.template = $app_template$;
                        $app_exports$.default.style = $app_style$;
                    };
                })();
            })();
        };
        return createPageHandler();
    })(global, globalThis, window, $app_exports$, $app_evaluate$);
}
