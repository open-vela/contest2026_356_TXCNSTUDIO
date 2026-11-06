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
                            private: {
                                isCircle: null,
                                timeStr: ''
                            },
                            onInit () {
                                this.isCircle = _adapt.default.isCircleSync();
                                utils.init(_system2.default, _system3.default);
                            },
                            onShow () {
                                var that = this;
                                _adapt.default.probe().then(function(info) {
                                    if (that.isCircle !== info.isCircle) that.isCircle = info.isCircle;
                                });
                                this.updateTime();
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
                            doLogout () {
                                var that = this;
                                utils.storageSet('todo_token', 'guest_token').then(function(ok) {
                                    if (!ok) return void utils.toast('退出失败，请重试');
                                    utils.setToken('');
                                    utils.toast('已退出云端账号');
                                    _system.default.back();
                                    _system.default.back();
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
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/logout-bg.png",
                                                style: {
                                                    position: "absolute",
                                                    left: 0,
                                                    top: 0,
                                                    width: "336px",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/btn-back-round.png",
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
                                                src: "/common/btn-exit-red.png",
                                                style: {
                                                    position: "absolute",
                                                    left: "258px",
                                                    top: "6px",
                                                    width: "72px",
                                                    height: "72px"
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.doLogout(evt);
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
                                        aiot.__ce__("scroll", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                scrollY: "true",
                                                bounces: "false",
                                                style: {
                                                    width: "336px",
                                                    height: "336px",
                                                    flexDirection: "column"
                                                }
                                            }
                                        }, [
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        width: "336px",
                                                        height: "417px",
                                                        minHeight: "417px",
                                                        flexShrink: 0
                                                    }
                                                }
                                            }, [
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
                                                        }
                                                    }
                                                }, []),
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
                                                        value: "退出登录"
                                                    }
                                                }, []),
                                                aiot.__ce__("div", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            position: "absolute",
                                                            left: "22px",
                                                            top: "120px",
                                                            width: "291px",
                                                            height: "106px",
                                                            borderRadius: "30px",
                                                            backgroundColor: "#262626",
                                                            flexDirection: "column",
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
                                                            value: "确认退出登录?"
                                                        }
                                                    }, []),
                                                    aiot.__ce__("text", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: {
                                                                fontSize: "16px",
                                                                color: "#ff4444",
                                                                marginTop: "8px",
                                                                lines: 1
                                                            },
                                                            value: "退出后将无法使用在线功能"
                                                        }
                                                    }, [])
                                                ]),
                                                aiot.__ce__("div", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            position: "absolute",
                                                            left: "22px",
                                                            top: "241px",
                                                            width: "291px",
                                                            height: "77px",
                                                            borderRadius: "28px",
                                                            backgroundColor: "#ff4444",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            paddingLeft: "26px",
                                                            paddingRight: "26px"
                                                        },
                                                        events: {
                                                            click: function(evt) {
                                                                return _vm_.doLogout(evt);
                                                            }
                                                        }
                                                    }
                                                }, [
                                                    aiot.__ce__("text", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: {
                                                                flex: 1,
                                                                fontSize: "24px",
                                                                fontWeight: 700,
                                                                color: "#ffffff",
                                                                lines: 1
                                                            },
                                                            value: "退出登录"
                                                        }
                                                    }, []),
                                                    aiot.__ce__("text", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: {
                                                                fontSize: "24px",
                                                                color: "#ffffff"
                                                            },
                                                            value: "✓"
                                                        }
                                                    }, [])
                                                ])
                                            ])
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
