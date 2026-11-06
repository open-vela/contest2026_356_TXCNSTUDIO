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
                        var _adapt = _interopRequireDefault(__webpack_require__("./src/common/adapt.js"));
                        function _interopRequireDefault(e) {
                            return e && e.__esModule ? e : {
                                default: e
                            };
                        }
                        const utils = __webpack_require__.g.utils || {};
                        var _default = exports.default = {
                            public: {
                                itemId: '',
                                content: ''
                            },
                            private: {
                                timeStr: '',
                                qrContent: '未命名',
                                isCircle: null
                            },
                            onInit () {
                                this.isCircle = _adapt.default.isCircleSync();
                            },
                            onShow () {
                                var that = this;
                                that.updateTime();
                                _adapt.default.probe().then(function(info) {
                                    if (that.isCircle !== info.isCircle) that.isCircle = info.isCircle;
                                });
                                utils.init(_system2.default, _system3.default);
                                if (that.content) that.qrContent = that.content;
                                else that.loadContent();
                            },
                            onDestroy () {
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
                            loadContent () {
                                var that = this;
                                utils.storageGet('todo_items').then(function(data) {
                                    if (!data) return;
                                    try {
                                        var items = JSON.parse(data);
                                        for(var i = 0; i < items.length; i++)if (items[i].id === that.itemId) {
                                            that.qrContent = items[i].text || items[i].title || '未命名';
                                            break;
                                        }
                                    } catch (e) {}
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
                                        return _vm_.isCircle;
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
                                                height: "100%"
                                            }
                                        }
                                    }, [])
                                ];
                            }),
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
                            ]),
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
                                    value: "分享内容"
                                }
                            }, []),
                            aiot.__ce__("div", {
                                __vm__: _vm_,
                                __opts__: {
                                    style: function() {
                                        return __webpack_require__.g.$translateStyle$("position:absolute;left:0;top:" + (_vm_.isCircle ? 70 : 120) + "px;width:336px;flex-direction:column;align-items:center;");
                                    }
                                }
                            }, [
                                aiot.__ce__("div", {
                                    __vm__: _vm_,
                                    __opts__: {
                                        style: function() {
                                            return __webpack_require__.g.$translateStyle$("width:" + (_vm_.isCircle ? 200 : 240) + "px;height:" + (_vm_.isCircle ? 200 : 240) + "px;border-radius:24px;background-color:#FFFFFF;justify-content:center;align-items:center;padding:" + (_vm_.isCircle ? 15 : 20) + "px;");
                                        }
                                    }
                                }, [
                                    aiot.__ce__("qrcode", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            value: function() {
                                                return _vm_.qrContent;
                                            },
                                            style: function() {
                                                return __webpack_require__.g.$translateStyle$("width:" + (_vm_.isCircle ? 170 : 200) + "px;height:" + (_vm_.isCircle ? 170 : 200) + "px;background-color:#FFFFFF;");
                                            }
                                        }
                                    }, [])
                                ]),
                                aiot.__ce__("text", {
                                    __vm__: _vm_,
                                    __opts__: {
                                        style: function() {
                                            return __webpack_require__.g.$translateStyle$("font-size:16px;color:#999999;margin-top:" + (_vm_.isCircle ? 12 : 24) + "px;padding-left:40px;padding-right:40px;text-align:center;lines:2;text-overflow:ellipsis;");
                                        },
                                        value: function() {
                                            return _vm_.qrContent;
                                        }
                                    }
                                }, [])
                            ])
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
