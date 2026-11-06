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
                                renderedCount: 8,
                                timeStr: '',
                                items: [],
                                loaded: false
                            },
                            onInit () {
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
                                this.updateTime();
                                this.loadItems();
                                var that = this;
                                if (that._syncing) return;
                                that._syncing = true;
                                that._syncFailsafe = setTimeout(function() {
                                    that._syncing = false;
                                }, 45000);
                                that._syncTimer = setTimeout(function() {
                                    that.syncPending().then(function() {
                                        return that.autoSync();
                                    }).catch(function() {}).then(function() {
                                        clearTimeout(that._syncFailsafe);
                                        that._syncing = false;
                                    });
                                }, 600);
                            },
                            onHide () {
                                this.hideCircleAdd();
                            },
                            onDestroy () {
                                this.hideCircleAdd();
                                if (this._syncTimer) {
                                    clearTimeout(this._syncTimer);
                                    this._syncTimer = null;
                                }
                                if (this._syncFailsafe) {
                                    clearTimeout(this._syncFailsafe);
                                    this._syncFailsafe = null;
                                }
                                if ("function" == typeof __webpack_require__.g.runGC) __webpack_require__.g.runGC();
                            },
                            autoSync () {
                                var that = this;
                                return utils.loadOffline().then(function(off) {
                                    if (off) return;
                                    return utils.storageGet('todo_token').then(function(token) {
                                        if (!token || 'guest_token' === token) return;
                                        utils.setToken(token);
                                        return utils.syncPull().then(function(cloudTodos) {
                                            var isArr = '[object Array]' === Object.prototype.toString.call(cloudTodos);
                                            if (!isArr) return;
                                            utils.storageGet('todo_items').then(function(data) {
                                                var local = [];
                                                if (data) {
                                                    try {
                                                        local = JSON.parse(data);
                                                    } catch (e) {
                                                        local = [];
                                                    }
                                                }
                                                utils.storageGet('todo_ignore_ids').then(function(ig) {
                                                    var ignores = [];
                                                    if (ig) {
                                                        try {
                                                            ignores = JSON.parse(ig);
                                                        } catch (e) {
                                                            ignores = [];
                                                        }
                                                    }
                                                    utils.storageGet('todo_pending_delete').then(function(pd) {
                                                        var pendingDel = [];
                                                        if (pd) {
                                                            try {
                                                                pendingDel = JSON.parse(pd);
                                                            } catch (e) {
                                                                pendingDel = [];
                                                            }
                                                        }
                                                        var merged = utils.mergeCloudItems(local, cloudTodos, ignores.concat(pendingDel));
                                                        utils.storageSet('todo_items', JSON.stringify(merged)).then(function() {
                                                            that.loadItems();
                                                        });
                                                    });
                                                });
                                            });
                                        }).catch(function(err) {});
                                    });
                                });
                            },
                            syncPending () {
                                var that = this;
                                return new Promise(function(resolveAll) {
                                    utils.loadOffline().then(function(off) {
                                        if (off) return void resolveAll();
                                        utils.storageGet('todo_token').then(function(token) {
                                            if (!token || 'guest_token' === token) return void resolveAll();
                                            utils.setToken(token);
                                            var done = function() {
                                                resolveAll();
                                            };
                                            utils.storageGet('todo_items').then(function(data) {
                                                var items = [];
                                                if (data) {
                                                    try {
                                                        items = JSON.parse(data);
                                                    } catch (e) {
                                                        items = [];
                                                    }
                                                }
                                                var pending = [];
                                                for(var i = 0; i < items.length; i++)if (items[i] && !items[i].cloudId && !items[i].localOnly) pending.push(items[i]);
                                                var chain = Promise.resolve();
                                                var count = 0;
                                                for(var j = 0; j < pending.length; j++)(function(item) {
                                                    chain = chain.then(function() {
                                                        return utils.cloudAddTodo(token, item.text || item.title || '', item.priority || 2, item.due || 0, item.is_pinned || 0).then(function(res) {
                                                            if (res && res.success && res.id) {
                                                                item.cloudId = res.id;
                                                                count++;
                                                            }
                                                            return null;
                                                        }).catch(function() {
                                                            return null;
                                                        });
                                                    });
                                                })(pending[j]);
                                                chain.then(function() {
                                                    var afterUp = function() {
                                                        doDeleteChain();
                                                    };
                                                    if (count > 0) utils.storageSet('todo_items', JSON.stringify(items)).then(afterUp);
                                                    else afterUp();
                                                });
                                            });
                                            function doDeleteChain() {
                                                utils.storageGet('todo_pending_delete').then(function(pd) {
                                                    var pendingDel = [];
                                                    if (pd) {
                                                        try {
                                                            pendingDel = JSON.parse(pd);
                                                        } catch (e) {
                                                            pendingDel = [];
                                                        }
                                                    }
                                                    if (!pendingDel.length) return void done();
                                                    var dchain = Promise.resolve();
                                                    var remaining = [];
                                                    for(var k = 0; k < pendingDel.length; k++)(function(cid) {
                                                        dchain = dchain.then(function() {
                                                            return utils.cloudDeleteTodo(token, cid).then(function(res) {
                                                                if (res && res.success) return;
                                                                remaining.push(cid);
                                                            }).catch(function() {
                                                                remaining.push(cid);
                                                            });
                                                        });
                                                    })(pendingDel[k]);
                                                    dchain.then(function() {
                                                        utils.storageSet('todo_pending_delete', JSON.stringify(remaining)).then(done);
                                                    });
                                                });
                                            }
                                        });
                                    });
                                });
                            },
                            updateTime () {
                                var now = new Date();
                                var h = now.getHours().toString();
                                if (h.length < 2) h = '0' + h;
                                var m = now.getMinutes().toString();
                                if (m.length < 2) m = '0' + m;
                                this.timeStr = h + ':' + m;
                            },
                            getPriorityColor (p) {
                                if (3 === p) return '#FE1E1E';
                                if (1 === p) return '#8A1EB6';
                                return '#3A74DA';
                            },
                            fmtItemTime (ts) {
                                if (null == ts || '' === ts) return '';
                                var d;
                                if ('number' == typeof ts) {
                                    var ms = ts > 100000000000 ? ts : 1000 * ts;
                                    d = new Date(ms);
                                } else if ('string' == typeof ts && ts.indexOf('-') >= 0) {
                                    var p = String(ts).split(/[- :]/).map(function(s) {
                                        return parseInt(s, 10);
                                    });
                                    d = new Date(Date.UTC(p[0], p[1] - 1, p[2], p[3] || 0, p[4] || 0, p[5] || 0));
                                } else d = new Date(ts);
                                if (isNaN(d.getTime())) return '';
                                return d.getMonth() + 1 + '.' + d.getDate() + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
                            },
                            loadItems () {
                                var that = this;
                                utils.storageGet('todo_items').then(function(data) {
                                    that.loaded = true;
                                    if (data) {
                                        try {
                                            var rawItems = JSON.parse(data);
                                            var now = Date.now();
                                            var sliced = rawItems;
                                            that._allItems = sliced;
                                            var initial = sliced.slice(0, that.renderedCount);
                                            var raw = initial || sliced || rawItems;
                                            if (that.items.length === raw.length) {
                                                for(var ii = 0; ii < raw.length; ii++){
                                                    var item = raw[ii];
                                                    var target = null;
                                                    for(var fi = 0; fi < that.items.length; fi++)if (that.items[fi].id === item.id) {
                                                        target = that.items[fi];
                                                        break;
                                                    }
                                                    if (target) {
                                                        var p = parseInt(item.priority, 10);
                                                        if (isNaN(p)) p = 2;
                                                        var done = item.done || false;
                                                        var due = parseInt(item.due, 10) || 0;
                                                        var now2 = Date.now();
                                                        var overdue = !done && due > 0 && due < now2;
                                                        var pinned = 1 === item.is_pinned;
                                                        var bgIdx = 3 === p ? pinned ? 0 : 1 : 1 === p ? pinned ? 4 : 5 : pinned ? 2 : 3;
                                                        target.title = item.text || item.title || '未命名';
                                                        target.done = done;
                                                        target.priority = p;
                                                        target.pinned = pinned;
                                                        target.bgIdx = bgIdx;
                                                        target.dueStr = due > 0 ? overdue ? '已逾期' : '截止 ' + that.fmtItemTime(due) : that.fmtItemTime(item.createdAt);
                                                        target.timeColor = done ? '#555555' : overdue ? '#FF3B30' : '#C9C9C9';
                                                    }
                                                }
                                            } else that.items = raw.map(function(item) {
                                                var p = parseInt(item.priority, 10);
                                                if (isNaN(p)) p = 2;
                                                var done = item.done || false;
                                                var due = parseInt(item.due, 10) || 0;
                                                var overdue = !done && due > 0 && due < now;
                                                var pinned = 1 === item.is_pinned;
                                                var bgIdx = 3 === p ? pinned ? 0 : 1 : 1 === p ? pinned ? 4 : 5 : pinned ? 2 : 3;
                                                return {
                                                    id: item.id,
                                                    title: item.text || item.title || '未命名',
                                                    done: done,
                                                    priority: p,
                                                    pinned: pinned,
                                                    bgIdx: bgIdx,
                                                    priorityColor: that.getPriorityColor(p),
                                                    dueStr: due > 0 ? overdue ? '已逾期' : '截止 ' + that.fmtItemTime(due) : that.fmtItemTime(item.createdAt),
                                                    timeColor: done ? '#555555' : overdue ? '#FF3B30' : '#C9C9C9'
                                                };
                                            });
                                            that.items.sort(function(a, b) {
                                                if (a.done !== b.done) return a.done ? 1 : -1;
                                                if (b.pinned !== a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
                                                return b.priority - a.priority;
                                            });
                                        } catch (e) {
                                            that.items = [];
                                        }
                                    } else that.items = [];
                                }).catch(function() {
                                    that.loaded = true;
                                    that.items = [];
                                });
                            },
                            loadMore () {
                                var that = this;
                                if (!that._allItems || that.renderedCount >= that._allItems.length) return;
                                that.renderedCount += 8;
                                that.loadItems();
                            },
                            viewItem (id) {
                                _system.default.push({
                                    uri: 'pages/viewer',
                                    params: {
                                        itemId: id
                                    }
                                });
                            },
                            addItem () {
                                _system.default.push({
                                    uri: 'pages/numpad'
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
                            onCircleScroll (e) {
                                if (!this.isCircle || !e || 'number' != typeof e.scrollY) return;
                                var now = Date.now();
                                if (this._scrollThrottle && now - this._scrollThrottle < 150) return;
                                this._scrollThrottle = now;
                                var previous = this._circleScrollY || 0;
                                this._circleScrollY = e.scrollY;
                                if (e.scrollY > previous) this.showCircleAdd();
                            },
                            onSwipe (e) {
                                if (!e) return;
                                if ('right' === e.direction) {
                                    if (false === this.isCircle) this.$app.exit();
                                    return;
                                }
                                if (true !== this.isCircle) return;
                                if ('up' === e.direction) this.showCircleAdd();
                                if ('down' === e.direction) this.hideCircleAdd();
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
                                },
                                events: {
                                    swipe: function(evt) {
                                        return _vm_.onSwipe(evt);
                                    }
                                }
                            }
                        }, [
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return false === _vm_.isCircle;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                flexDirection: "column",
                                                width: "336px",
                                                height: "100%"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    height: "86px"
                                                }
                                            }
                                        }, [
                                            aiot.__ce__("image", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    src: "/common/icon-back-home.png",
                                                    style: {
                                                        position: "absolute",
                                                        left: "6px",
                                                        top: "6px",
                                                        width: "72px",
                                                        height: "72px"
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.showMenu(evt);
                                                        }
                                                    }
                                                }
                                            }, []),
                                            aiot.__ce__("image", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    src: "/common/icon-add.png",
                                                    style: {
                                                        position: "absolute",
                                                        left: "258px",
                                                        top: "6px",
                                                        width: "72px",
                                                        height: "72px"
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.addItem(evt);
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
                                                    value: "清单"
                                                }
                                            }, [])
                                        ]),
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    flex: 1,
                                                    flexDirection: "column"
                                                }
                                            }
                                        }, [
                                            aiot.__ci__({
                                                __vm__: _vm_,
                                                __opts__: {
                                                    shown: function() {
                                                        return !_vm_.loaded;
                                                    }
                                                }
                                            }, function() {
                                                return [
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
                                                ];
                                            }),
                                            aiot.__ci__({
                                                __vm__: _vm_,
                                                __opts__: {
                                                    shown: function() {
                                                        return _vm_.loaded && 0 === _vm_.items.length;
                                                    }
                                                }
                                            }, function() {
                                                return [
                                                    aiot.__ce__("div", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: {
                                                                flex: 1,
                                                                flexDirection: "column",
                                                                alignItems: "center"
                                                            }
                                                        }
                                                    }, [
                                                        aiot.__ce__("div", {
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                style: {
                                                                    width: "128px",
                                                                    height: "124px",
                                                                    borderRadius: "42px",
                                                                    backgroundColor: "#262626",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    marginTop: "60px"
                                                                }
                                                            }
                                                        }, [
                                                            aiot.__ce__("image", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    src: "/common/empty-ico.png",
                                                                    style: {
                                                                        width: "68px",
                                                                        height: "56px"
                                                                    }
                                                                }
                                                            }, [])
                                                        ]),
                                                        aiot.__ce__("text", {
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                style: {
                                                                    fontSize: "28px",
                                                                    color: "#ffffff",
                                                                    marginTop: "36px"
                                                                },
                                                                value: "没有内容"
                                                            }
                                                        }, [])
                                                    ])
                                                ];
                                            }),
                                            aiot.__ci__({
                                                __vm__: _vm_,
                                                __opts__: {
                                                    shown: function() {
                                                        return _vm_.loaded && _vm_.items.length > 0;
                                                    }
                                                }
                                            }, function() {
                                                return [
                                                    aiot.__ce__("scroll", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            scrollY: "true",
                                                            events: {
                                                                scrollbottom: function(evt) {
                                                                    return _vm_.loadMore(evt);
                                                                }
                                                            },
                                                            style: {
                                                                flex: 1,
                                                                flexDirection: "column"
                                                            }
                                                        }
                                                    }, [
                                                        aiot.__cf__({
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                exp: function() {
                                                                    return _vm_.items;
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
                                                                            height: "112px",
                                                                            marginLeft: "6px",
                                                                            marginRight: "6px",
                                                                            marginBottom: "8px",
                                                                            flexShrink: 0
                                                                        },
                                                                        events: {
                                                                            click: function(evt) {
                                                                                return _vm_.viewItem($item.id, evt);
                                                                            }
                                                                        }
                                                                    }
                                                                }, [
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return 0 === $item.bgIdx;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("image", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    src: "/common/card-hi-pin.png",
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: 0,
                                                                                        top: 0,
                                                                                        width: "324px",
                                                                                        height: "112px"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return 0 !== $item.bgIdx && 1 === $item.bgIdx;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("image", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    src: "/common/card-hi.png",
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: 0,
                                                                                        top: 0,
                                                                                        width: "324px",
                                                                                        height: "112px"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return 1 !== $item.bgIdx && 0 !== $item.bgIdx && 2 === $item.bgIdx;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("image", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    src: "/common/card-mid-pin.png",
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: 0,
                                                                                        top: 0,
                                                                                        width: "324px",
                                                                                        height: "112px"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return 2 !== $item.bgIdx && 1 !== $item.bgIdx && 0 !== $item.bgIdx && 3 === $item.bgIdx;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("image", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    src: "/common/card-mid.png",
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: 0,
                                                                                        top: 0,
                                                                                        width: "324px",
                                                                                        height: "112px"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return 3 !== $item.bgIdx && 2 !== $item.bgIdx && 1 !== $item.bgIdx && 0 !== $item.bgIdx && 4 === $item.bgIdx;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("image", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    src: "/common/card-lo-pin.png",
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: 0,
                                                                                        top: 0,
                                                                                        width: "324px",
                                                                                        height: "112px"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return 4 !== $item.bgIdx && 3 !== $item.bgIdx && 2 !== $item.bgIdx && 1 !== $item.bgIdx && 0 !== $item.bgIdx;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("image", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    src: "/common/card-lo.png",
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: 0,
                                                                                        top: 0,
                                                                                        width: "324px",
                                                                                        height: "112px"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return $item.done;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("image", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    src: "/common/icon-check.png",
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: "38px",
                                                                                        top: "33px",
                                                                                        width: "45px",
                                                                                        height: "45px"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return $item.done;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("text", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: "118px",
                                                                                        top: "20px",
                                                                                        width: "190px",
                                                                                        fontSize: "30px",
                                                                                        fontWeight: 700,
                                                                                        color: "#666666",
                                                                                        lines: 1,
                                                                                        textOverflow: "ellipsis"
                                                                                    },
                                                                                    value: function() {
                                                                                        return $item.title;
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return !$item.done && $item.title.length <= 5;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("text", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: "118px",
                                                                                        top: "20px",
                                                                                        width: "190px",
                                                                                        fontSize: "30px",
                                                                                        fontWeight: 700,
                                                                                        color: "#ffffff",
                                                                                        lines: 1,
                                                                                        textOverflow: "ellipsis"
                                                                                    },
                                                                                    value: function() {
                                                                                        return $item.title;
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return !($item.title.length <= 5) && !$item.done;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("marquee", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: "118px",
                                                                                        top: "20px",
                                                                                        width: "190px",
                                                                                        height: "30px",
                                                                                        fontSize: "30px",
                                                                                        fontWeight: 700,
                                                                                        color: "#ffffff"
                                                                                    },
                                                                                    scrollamount: "25",
                                                                                    value: function() {
                                                                                        return $item.title;
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return $item.done;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("div", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: "118px",
                                                                                        top: "38px",
                                                                                        width: "190px",
                                                                                        height: "4px",
                                                                                        borderRadius: "2px",
                                                                                        backgroundColor: "#666666"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    }),
                                                                    aiot.__ce__("text", {
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            style: function() {
                                                                                return __webpack_require__.g.$translateStyle$("position:absolute;left:118px;top:66px;width:190px;font-size:18px;color:" + $item.timeColor + ";lines:1;text-overflow:ellipsis;");
                                                                            },
                                                                            value: function() {
                                                                                return $item.dueStr;
                                                                            }
                                                                        }
                                                                    }, []),
                                                                    aiot.__ci__({
                                                                        __vm__: _vm_,
                                                                        __opts__: {
                                                                            shown: function() {
                                                                                return $item.done;
                                                                            }
                                                                        }
                                                                    }, function() {
                                                                        return [
                                                                            aiot.__ce__("div", {
                                                                                __vm__: _vm_,
                                                                                __opts__: {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        left: "118px",
                                                                                        top: "76px",
                                                                                        width: "190px",
                                                                                        height: "3px",
                                                                                        borderRadius: "2px",
                                                                                        backgroundColor: "#444444"
                                                                                    }
                                                                                }
                                                                            }, [])
                                                                        ];
                                                                    })
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
                                                ];
                                            })
                                        ])
                                    ])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return _vm_.isCircle && _vm_.loaded && 0 === _vm_.items.length;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-home-empty-bg.png",
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "336px",
                                                height: "336px"
                                            }
                                        }
                                    }, [])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return !(_vm_.isCircle && _vm_.loaded && 0 === _vm_.items.length) && _vm_.isCircle && _vm_.loaded;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-home-bg.png",
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "336px",
                                                height: "336px"
                                            }
                                        }
                                    }, [])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return !(_vm_.isCircle && _vm_.loaded) && !(_vm_.isCircle && _vm_.loaded && 0 === _vm_.items.length) && _vm_.isCircle;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-blank-bg.png",
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "336px",
                                                height: "336px"
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
                                        return _vm_.isCircle && _vm_.loaded && _vm_.items.length > 0;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("list", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            scrollY: "true",
                                            events: {
                                                scroll: function(evt) {
                                                    return _vm_.onCircleScroll(evt);
                                                },
                                                scrollbottom: function(evt) {
                                                    return _vm_.loadMore(evt);
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
                                                    return _vm_.items;
                                                },
                                                key: "$idx",
                                                value: "$item"
                                            }
                                        }, function($idx, $item) {
                                            return [
                                                aiot.__ce__("list-item", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        type: "card",
                                                        style: {
                                                            width: "293px",
                                                            height: "98px",
                                                            minHeight: "98px",
                                                            flexShrink: 0,
                                                            marginLeft: "22px",
                                                            marginBottom: "14px"
                                                        },
                                                        events: {
                                                            click: function(evt) {
                                                                return _vm_.viewItem($item.id, evt);
                                                            }
                                                        }
                                                    }
                                                }, [
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return 0 === $item.bgIdx;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("image", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    src: "/common/circle-ctr-79.png",
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: 0,
                                                                        top: 0,
                                                                        width: "293px",
                                                                        height: "98px"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return 0 !== $item.bgIdx && 1 === $item.bgIdx;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("image", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    src: "/common/circle-ctr-76.png",
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: 0,
                                                                        top: 0,
                                                                        width: "293px",
                                                                        height: "98px"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return 1 !== $item.bgIdx && 0 !== $item.bgIdx && 2 === $item.bgIdx;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("image", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    src: "/common/circle-ctr-80.png",
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: 0,
                                                                        top: 0,
                                                                        width: "293px",
                                                                        height: "98px"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return 2 !== $item.bgIdx && 1 !== $item.bgIdx && 0 !== $item.bgIdx && 3 === $item.bgIdx;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("image", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    src: "/common/circle-ctr-77.png",
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: 0,
                                                                        top: 0,
                                                                        width: "293px",
                                                                        height: "98px"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return 3 !== $item.bgIdx && 2 !== $item.bgIdx && 1 !== $item.bgIdx && 0 !== $item.bgIdx && 4 === $item.bgIdx;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("image", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    src: "/common/circle-ctr-81.png",
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: 0,
                                                                        top: 0,
                                                                        width: "293px",
                                                                        height: "98px"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return 4 !== $item.bgIdx && 3 !== $item.bgIdx && 2 !== $item.bgIdx && 1 !== $item.bgIdx && 0 !== $item.bgIdx;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("image", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    src: "/common/circle-ctr-78.png",
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: 0,
                                                                        top: 0,
                                                                        width: "293px",
                                                                        height: "98px"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return $item.done;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("image", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    src: "/common/icon-check.png",
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: "32px",
                                                                        top: "31px",
                                                                        width: "36px",
                                                                        height: "36px"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return $item.done;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("text", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: "110px",
                                                                        top: "15px",
                                                                        width: "140px",
                                                                        fontSize: "26px",
                                                                        fontWeight: 700,
                                                                        color: "#666666",
                                                                        lines: 1,
                                                                        textOverflow: "ellipsis"
                                                                    },
                                                                    value: function() {
                                                                        return $item.title;
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return !$item.done && $item.title.length <= 6;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("text", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: "110px",
                                                                        top: "15px",
                                                                        width: "140px",
                                                                        fontSize: "26px",
                                                                        fontWeight: 700,
                                                                        color: "#ffffff",
                                                                        lines: 1,
                                                                        textOverflow: "ellipsis"
                                                                    },
                                                                    value: function() {
                                                                        return $item.title;
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return !($item.title.length <= 6) && !$item.done;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("marquee", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: "110px",
                                                                        top: "15px",
                                                                        width: "140px",
                                                                        height: "28px",
                                                                        fontSize: "26px",
                                                                        fontWeight: 700,
                                                                        color: "#ffffff"
                                                                    },
                                                                    scrollamount: "15",
                                                                    value: function() {
                                                                        return $item.title;
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return $item.done;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("div", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: "110px",
                                                                        top: "28px",
                                                                        width: "140px",
                                                                        height: "3px",
                                                                        borderRadius: "2px",
                                                                        backgroundColor: "#666666"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    }),
                                                    aiot.__ce__("text", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: function() {
                                                                return __webpack_require__.g.$translateStyle$("position:absolute;left:110px;top:52px;width:140px;font-size:18px;color:" + $item.timeColor + ";lines:1;text-overflow:ellipsis;");
                                                            },
                                                            value: function() {
                                                                return $item.dueStr;
                                                            }
                                                        }
                                                    }, []),
                                                    aiot.__ci__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            shown: function() {
                                                                return $item.done;
                                                            }
                                                        }
                                                    }, function() {
                                                        return [
                                                            aiot.__ce__("div", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: "110px",
                                                                        top: "61px",
                                                                        width: "140px",
                                                                        height: "2px",
                                                                        borderRadius: "1px",
                                                                        backgroundColor: "#444444"
                                                                    }
                                                                }
                                                            }, [])
                                                        ];
                                                    })
                                                ])
                                            ];
                                        }),
                                        aiot.__ce__("list-item", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                type: "spacer",
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
                                            show: function() {
                                                return _vm_.circleAddVisible;
                                            },
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
                                                    return _vm_.addItem(evt);
                                                }
                                            }
                                        }
                                    }, [])
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
