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
                                timeStr: '',
                                status: 'waiting',
                                descText: '',
                                descColor: '#AAAAAA',
                                isCircle: null,
                                circleTitle: '',
                                pillText: '',
                                pillLeft: '',
                                pillRight: '',
                                pillColor: '#FFFFFF',
                                syncProgress: '',
                                syncStep: ''
                            },
                            onInit () {
                                this.isCircle = _adapt.default.isCircleSync();
                                this.refreshCircleBg();
                            },
                            onShow () {
                                var that = this;
                                that.updateTime();
                                _adapt.default.probe().then(function(info) {
                                    if (that.isCircle !== info.isCircle) that.isCircle = info.isCircle;
                                    that.refreshCircleBg();
                                });
                                utils.init(_system2.default, _system3.default, _system4.default);
                                utils.loadOffline().then(function(off) {
                                    if (off) return void that.showOffline();
                                    that.checkBindAndSync();
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
                            onDestroy () {
                                if (this._syncTimer) {
                                    clearTimeout(this._syncTimer);
                                    this._syncTimer = null;
                                }
                                if (this._chainFailsafe) {
                                    clearTimeout(this._chainFailsafe);
                                    this._chainFailsafe = null;
                                }
                                if ("function" == typeof __webpack_require__.g.runGC) __webpack_require__.g.runGC();
                            },
                            refreshCircleBg () {
                                var st = this.status;
                                var title = '';
                                if ('offline' === st) title = '离线模式';
                                else if ('nobind' === st) title = '未绑定账号';
                                this.circleTitle = title;
                                if ('waiting' === st) {
                                    this.pillText = '等待连接';
                                    this.pillLeft = '';
                                    this.pillRight = '';
                                } else if ('connected' === st) {
                                    this.pillText = '已连接,准备同步';
                                    this.pillLeft = '';
                                    this.pillRight = '';
                                } else if ('syncing' === st) {
                                    this.pillLeft = this.syncStep || '同步中';
                                    this.pillRight = this.syncProgress || '...';
                                    this.pillColor = '#C9CBCE';
                                } else if ('success' === st) {
                                    this.pillLeft = '同步完成';
                                    this.pillRight = '100%';
                                    this.pillColor = '#1DCC72';
                                } else if ('fail' === st) {
                                    this.pillLeft = '同步失败';
                                    this.pillRight = this.syncProgress || '...';
                                    this.pillColor = '#FF4D4F';
                                }
                            },
                            checkBindAndSync () {
                                if (this._chainBusy) return;
                                this._chainBusy = true;
                                var that = this;
                                if (this._chainFailsafe) clearTimeout(this._chainFailsafe);
                                this._chainFailsafe = setTimeout(function() {
                                    that._chainBusy = false;
                                }, 45000);
                                utils.storageGet('todo_token').then(function(token) {
                                    if (!token || 'guest_token' === token) return void that.showNoBind();
                                    that.status = 'connected';
                                    that.descText = '';
                                    that.refreshCircleBg();
                                    that._syncTimer = setTimeout(function() {
                                        that.startSync();
                                    }, 600);
                                });
                            },
                            startSync () {
                                this.status = 'syncing';
                                this.descText = '';
                                this.syncStep = '拉取云端';
                                this.syncProgress = '0%';
                                this.refreshCircleBg();
                                this.pullAndMerge();
                            },
                            pullAndMerge () {
                                var that = this;
                                utils.storageGet('todo_token').then(function(token) {
                                    if (!token || 'guest_token' === token) return void that.showNoBind();
                                    utils.setToken(token);
                                    utils.syncPull().then(function(cloudTodos) {
                                        var isArr = '[object Array]' === Object.prototype.toString.call(cloudTodos);
                                        if (!isArr) return void that.showFail(cloudTodos && cloudTodos.error ? '云端账号已失效，请重新绑定' : '无法连接服务器');
                                        that.mergeAndSave(cloudTodos);
                                    }).catch(function(err) {
                                        that.showFail('无法连接服务器');
                                    });
                                });
                            },
                            mergeAndSave (cloudItems) {
                                var that = this;
                                that.syncStep = '合并数据';
                                that.syncProgress = '50%';
                                that.refreshCircleBg();
                                utils.storageGet('todo_items').then(function(data) {
                                    var localItems = [];
                                    if (data) {
                                        try {
                                            localItems = JSON.parse(data);
                                        } catch (e) {
                                            localItems = [];
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
                                            var merged = utils.mergeCloudItems(localItems, cloudItems, ignores.concat(pendingDel));
                                            utils.storageSet('todo_items', JSON.stringify(merged)).then(function(ok) {
                                                if (!ok) return void that.showFail('本地保存失败，请重试');
                                                that.push(merged);
                                            });
                                        });
                                    });
                                });
                            },
                            push (items) {
                                var that = this;
                                that.syncStep = '推送本地';
                                that.syncProgress = '80%';
                                that.refreshCircleBg();
                                utils.syncPush(items).then(function() {
                                    return utils.storageSet('todo_items', JSON.stringify(items));
                                }).then(function() {
                                    that._chainBusy = false;
                                    that.syncProgress = '100%';
                                    that.status = 'success';
                                    that.descText = '';
                                    that.refreshCircleBg();
                                }).catch(function(err) {
                                    that.showFail('推送失败，数据已保留在本地');
                                });
                            },
                            showFail (msg) {
                                this._chainBusy = false;
                                this.status = 'fail';
                                this.descText = msg || '无法连接服务器，请重试';
                                this.descColor = '#FF6B6B';
                                this.syncProgress = '';
                                this.refreshCircleBg();
                            },
                            showOffline () {
                                this._chainBusy = false;
                                this.status = 'offline';
                                this.descText = '可前往设置切换在线模式';
                                this.descColor = '#999999';
                                this.refreshCircleBg();
                            },
                            showNoBind () {
                                this._chainBusy = false;
                                this.status = 'nobind';
                                this.descText = '请到「设置→云端账号」绑定';
                                this.descColor = '#999999';
                                this.refreshCircleBg();
                            },
                            switchOffline () {
                                utils.setOffline(true);
                                utils.toast('已切换离线模式');
                                this.showOffline();
                            },
                            goBind () {
                                _system.default.push({
                                    uri: 'pages/token'
                                });
                            },
                            goBack () {
                                _system.default.back();
                            },
                            onSwipe (e) {
                                if (e && 'right' === e.direction) _system.default.back();
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
                                        return false === _vm_.isCircle && "syncing" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/sync-bg.png",
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "336px",
                                                height: "100%",
                                                objectFit: "cover"
                                            }
                                        }
                                    }, [])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return !(false === _vm_.isCircle && "syncing" === _vm_.status) && false === _vm_.isCircle && "success" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/sync-success-bg.png",
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "336px",
                                                height: "100%",
                                                objectFit: "cover"
                                            }
                                        }
                                    }, [])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return !(false === _vm_.isCircle && "success" === _vm_.status) && !(false === _vm_.isCircle && "syncing" === _vm_.status) && false === _vm_.isCircle;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/sync-fail-bg.png",
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                width: "336px",
                                                height: "100%",
                                                objectFit: "cover"
                                            }
                                        }
                                    }, [])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return _vm_.isCircle && "waiting" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-sync-wait-bg.png",
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
                                        return _vm_.isCircle && "connected" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-sync-ok-bg.png",
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
                                        return _vm_.isCircle && "syncing" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-sync-ing-bg.png",
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
                                        return _vm_.isCircle && "success" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-sync-done-bg.png",
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
                                        return _vm_.isCircle && "fail" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-sync-fail-bg.png",
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
                                        return _vm_.isCircle && ("nobind" === _vm_.status || "offline" === _vm_.status);
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/circle-sync-wait-bg.png",
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
                                        return false === _vm_.isCircle;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "6px",
                                                top: "6px",
                                                width: "72px",
                                                height: "72px",
                                                borderRadius: "36px",
                                                backgroundColor: "#262626",
                                                borderTopWidth: "3px",
                                                borderRightWidth: "3px",
                                                borderBottomWidth: "3px",
                                                borderLeftWidth: "3px",
                                                borderTopColor: "rgba(255,255,255,0.06)",
                                                borderRightColor: "rgba(255,255,255,0.06)",
                                                borderBottomColor: "rgba(255,255,255,0.06)",
                                                borderLeftColor: "rgba(255,255,255,0.06)",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            },
                                            events: {
                                                click: function(evt) {
                                                    return _vm_.goBack(evt);
                                                }
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/icon-back.png",
                                                style: {
                                                    width: "16px",
                                                    height: "27px"
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
                                        return false === _vm_.isCircle;
                                    }
                                }
                            }, function() {
                                return [
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
                                    }, [])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return false === _vm_.isCircle && ("syncing" === _vm_.status || "fail" === _vm_.status || "offline" === _vm_.status || "nobind" === _vm_.status);
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("text", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: function() {
                                                return __webpack_require__.g.$translateStyle$("position:absolute;left:20px;top:316px;width:296px;text-align:center;font-size:20px;color:" + _vm_.descColor + ";lines:2;line-height:28px;");
                                            },
                                            value: function() {
                                                return _vm_.descText;
                                            }
                                        }
                                    }, [])
                                ];
                            }),
                            aiot.__ci__({
                                __vm__: _vm_,
                                __opts__: {
                                    shown: function() {
                                        return false === _vm_.isCircle && "syncing" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "18px",
                                                top: "392px",
                                                width: "300px",
                                                height: "80px"
                                            },
                                            events: {
                                                click: function(evt) {
                                                    return _vm_.goBack(evt);
                                                }
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/btn-cancel.png",
                                                style: {
                                                    width: "100%",
                                                    height: "100%"
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
                                        return false === _vm_.isCircle && "success" === _vm_.status;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "18px",
                                                top: "392px",
                                                width: "300px",
                                                height: "80px"
                                            },
                                            events: {
                                                click: function(evt) {
                                                    return _vm_.goBack(evt);
                                                }
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/btn-done.png",
                                                style: {
                                                    width: "100%",
                                                    height: "100%"
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
                                        return false === _vm_.isCircle && ("fail" === _vm_.status || "offline" === _vm_.status || "nobind" === _vm_.status);
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "18px",
                                                top: "392px",
                                                width: "150px",
                                                height: "80px"
                                            },
                                            events: {
                                                click: function(evt) {
                                                    return _vm_.switchOffline(evt);
                                                }
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/btn-offline.png",
                                                style: {
                                                    width: "100%",
                                                    height: "100%"
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
                                        return false === _vm_.isCircle && ("fail" === _vm_.status || "offline" === _vm_.status || "nobind" === _vm_.status);
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "168px",
                                                top: "392px",
                                                width: "150px",
                                                height: "80px"
                                            },
                                            events: {
                                                click: function(evt) {
                                                    return _vm_.goBind(evt);
                                                }
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/btn-bind.png",
                                                style: {
                                                    width: "100%",
                                                    height: "100%"
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
                                        return _vm_.isCircle && ("waiting" === _vm_.status || "connected" === _vm_.status);
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "22px",
                                                top: "130px",
                                                width: "291px",
                                                height: "76px",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    fontSize: "24px",
                                                    fontWeight: 700,
                                                    color: "#ffffff",
                                                    lines: 1
                                                },
                                                value: function() {
                                                    return _vm_.pillText;
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
                                        return _vm_.isCircle && ("syncing" === _vm_.status || "success" === _vm_.status || "fail" === _vm_.status);
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "22px",
                                                top: "130px",
                                                width: "291px",
                                                height: "76px",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                paddingLeft: "26px",
                                                paddingRight: "26px"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: function() {
                                                    return __webpack_require__.g.$translateStyle$("font-size:20px;color:" + _vm_.pillColor + ";lines:1;text-overflow:ellipsis;");
                                                },
                                                value: function() {
                                                    return _vm_.pillLeft;
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: function() {
                                                    return __webpack_require__.g.$translateStyle$("font-size:24px;font-weight:700;color:" + _vm_.pillColor + ";lines:1;");
                                                },
                                                value: function() {
                                                    return _vm_.pillRight;
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
                                        return _vm_.isCircle && _vm_.descText && ("waiting" === _vm_.status || "connected" === _vm_.status || "fail" === _vm_.status || "offline" === _vm_.status || "nobind" === _vm_.status);
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "28px",
                                                top: "230px",
                                                width: "280px",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: function() {
                                                    return __webpack_require__.g.$translateStyle$("font-size:16px;color:" + _vm_.descColor + ";lines:3;line-height:22px;text-align:center;");
                                                },
                                                value: function() {
                                                    return _vm_.descText;
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
                                        return _vm_.isCircle && _vm_.circleTitle;
                                    }
                                }
                            }, function() {
                                return [
                                    aiot.__ce__("div", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            style: {
                                                position: "absolute",
                                                left: "22px",
                                                top: "130px",
                                                width: "291px",
                                                height: "76px",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("text", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    fontSize: "24px",
                                                    fontWeight: 700,
                                                    color: "#ffffff",
                                                    lines: 1
                                                },
                                                value: function() {
                                                    return _vm_.circleTitle;
                                                }
                                            }
                                        }, [])
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
