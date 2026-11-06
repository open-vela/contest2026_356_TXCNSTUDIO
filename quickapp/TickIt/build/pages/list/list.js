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
                                offline: false,
                                isCircle: null,
                                settings: [
                                    {
                                        title: '便签',
                                        desc: '随手记录想法',
                                        action: 'notes'
                                    },
                                    {
                                        title: '同步数据',
                                        desc: '与服务器同步内容',
                                        action: 'sync'
                                    },
                                    {
                                        title: '云端账号',
                                        desc: '绑定网页版账号 Token',
                                        action: 'token'
                                    },
                                    {
                                        title: '离线模式',
                                        desc: '切换离线后门',
                                        action: 'offline'
                                    },
                                    {
                                        title: '关于',
                                        desc: '应用信息与版本',
                                        action: 'about'
                                    }
                                ]
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
                                utils.init(_system2.default, _system3.default, _system4.default);
                                utils.loadOffline().then(function(off) {
                                    that.offline = off;
                                });
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
                            goBack () {
                                _system.default.back();
                            },
                            onSwipe (e) {
                                if (e && 'right' === e.direction) _system.default.back();
                            },
                            onTap (action) {
                                if ('notes' === action) _system.default.push({
                                    uri: 'pages/notes'
                                });
                                else if ('sync' === action) _system.default.push({
                                    uri: 'pages/sync'
                                });
                                else if ('token' === action) _system.default.push({
                                    uri: 'pages/token'
                                });
                                else if ('about' === action) _system.default.push({
                                    uri: 'pages/about'
                                });
                                else if ('offline' === action) if (this.isCircle) _system.default.push({
                                    uri: 'pages/mode'
                                });
                                else this.toggleOffline();
                                else if ('mode' === action) _system.default.push({
                                    uri: 'pages/mode'
                                });
                                else if ('clearAll' === action) _system.default.push({
                                    uri: 'pages/confirm',
                                    params: {
                                        type: 'clearAll'
                                    }
                                });
                            },
                            toggleOffline () {
                                var that = this;
                                that.offline = !that.offline;
                                utils.setOffline(that.offline);
                                utils.toast(that.offline ? '已切换离线模式' : '已切换在线模式');
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
                                                value: "设置"
                                            }
                                        }, []),
                                        aiot.__ce__("scroll", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                scrollY: "true",
                                                bounces: "false",
                                                style: {
                                                    position: "absolute",
                                                    left: "6px",
                                                    top: "90px",
                                                    width: "324px",
                                                    height: "380px",
                                                    flexDirection: "column"
                                                }
                                            }
                                        }, [
                                            aiot.__cf__({
                                                __vm__: _vm_,
                                                __opts__: {
                                                    exp: function() {
                                                        return _vm_.settings;
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
                                                                height: "112px",
                                                                marginBottom: "8px",
                                                                flexShrink: 0,
                                                                borderRadius: "24px",
                                                                backgroundColor: "#262626",
                                                                flexDirection: "column",
                                                                justifyContent: "center",
                                                                paddingLeft: "28px",
                                                                paddingRight: "28px"
                                                            },
                                                            events: {
                                                                click: function(evt) {
                                                                    return _vm_.onTap($item.action, evt);
                                                                }
                                                            }
                                                        }
                                                    }, [
                                                        aiot.__ce__("text", {
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                style: {
                                                                    fontSize: "32px",
                                                                    fontWeight: 700,
                                                                    color: "#ffffff"
                                                                },
                                                                value: function() {
                                                                    return $item.title;
                                                                }
                                                            }
                                                        }, []),
                                                        aiot.__ce__("text", {
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                style: function() {
                                                                    return __webpack_require__.g.$translateStyle$("font-size:22px;color:" + ("offline" === $item.action ? _vm_.offline ? "#FF9800" : "#999999" : "#999999") + ";margin-top:10px;");
                                                                },
                                                                value: function() {
                                                                    return "offline" === $item.action ? _vm_.offline ? "\u5F53\u524D\u79BB\u7EBF\u6A21\u5F0F" : "\u5F53\u524D\u5728\u7EBF\u6A21\u5F0F" : $item.desc;
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
                                                        height: "10px"
                                                    }
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
                                                left: "100px",
                                                top: "64px",
                                                width: "136px",
                                                textAlign: "center",
                                                fontSize: "28px",
                                                fontWeight: 700,
                                                color: "#ffffff"
                                            },
                                            value: "设置"
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
                                    aiot.__ce__("scroll", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            scrollY: "true",
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: "110px",
                                                width: "336px",
                                                height: "300px",
                                                flexDirection: "column"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/circle-ctr-87.png",
                                                style: {
                                                    width: "291px",
                                                    height: "77px",
                                                    marginLeft: "22px",
                                                    marginBottom: "12px",
                                                    flexShrink: 0
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.onTap("notes", evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/circle-ctr-88.png",
                                                style: {
                                                    width: "291px",
                                                    height: "77px",
                                                    marginLeft: "22px",
                                                    marginBottom: "12px",
                                                    flexShrink: 0
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.onTap("sync", evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/circle-ctr-93.png",
                                                style: {
                                                    width: "291px",
                                                    height: "77px",
                                                    marginLeft: "22px",
                                                    marginBottom: "12px",
                                                    flexShrink: 0
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.onTap("token", evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/circle-ctr-89.png",
                                                style: {
                                                    width: "291px",
                                                    height: "77px",
                                                    marginLeft: "22px",
                                                    marginBottom: "12px",
                                                    flexShrink: 0
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.onTap("about", evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/circle-ctr-90.png",
                                                style: {
                                                    width: "291px",
                                                    height: "77px",
                                                    marginLeft: "22px",
                                                    marginBottom: "12px",
                                                    flexShrink: 0
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.onTap("mode", evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("image", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                src: "/common/circle-ctr-91.png",
                                                style: {
                                                    width: "291px",
                                                    height: "77px",
                                                    marginLeft: "22px",
                                                    marginBottom: "12px",
                                                    flexShrink: 0
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.onTap("clearAll", evt);
                                                    }
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    height: "112px"
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
