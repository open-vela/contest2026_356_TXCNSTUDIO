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
                    var $app_style$ = [
                        [
                            [
                                [
                                    0,
                                    "wh-row"
                                ]
                            ],
                            {
                                width: "130px",
                                height: "40px",
                                flexShrink: 0,
                                justifyContent: "center",
                                alignItems: "center"
                            }
                        ],
                        [
                            [
                                [
                                    0,
                                    "wh-sel"
                                ]
                            ],
                            {
                                fontSize: "24px",
                                fontWeight: 700,
                                color: "#ffffff",
                                lines: 1
                            }
                        ],
                        [
                            [
                                [
                                    0,
                                    "wh-nor"
                                ]
                            ],
                            {
                                fontSize: "18px",
                                fontWeight: 400,
                                color: "#666666",
                                lines: 1
                            }
                        ]
                    ];
                    var $app_script$ = function __scriptModule__(module, exports, $app_require$1) {
                        "use strict";
                        Object.defineProperty(exports, "__esModule", {
                            value: true
                        });
                        exports.default = void 0;
                        var _system = _interopRequireDefault($app_require$1("@app-module/system.router"));
                        var _adapt = _interopRequireDefault(__webpack_require__("./src/common/adapt.js"));
                        function _interopRequireDefault(e) {
                            return e && e.__esModule ? e : {
                                default: e
                            };
                        }
                        const utils = __webpack_require__.g.utils || {};
                        var _default = exports.default = {
                            public: {
                                currentDue: 0
                            },
                            private: {
                                isCircle: null,
                                dates: [],
                                times: [],
                                dateIdx: 0,
                                timeIdx: 0,
                                dateTop: 0,
                                timeTop: 0
                            },
                            onInit () {
                                this.isCircle = _adapt.default.isCircleSync();
                                this.initPicker();
                            },
                            onShow () {
                                var that = this;
                                _adapt.default.probe().then(function(info) {
                                    if (that.isCircle !== info.isCircle) that.isCircle = info.isCircle;
                                });
                            },
                            onDestroy () {
                                if (this._dtTimer) {
                                    clearTimeout(this._dtTimer);
                                    this._dtTimer = null;
                                }
                                if (this._ttTimer) {
                                    clearTimeout(this._ttTimer);
                                    this._ttTimer = null;
                                }
                                if ('function' == typeof __webpack_require__.g.runGC) __webpack_require__.g.runGC();
                            },
                            initPicker () {
                                var now = new Date();
                                var dates = [
                                    '无'
                                ];
                                for(var d = 0; d < 30; d++){
                                    var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
                                    var label = dt.getMonth() + 1 + '.' + dt.getDate();
                                    if (0 === d) label = '今天 ' + label;
                                    else if (1 === d) label = '明天 ' + label;
                                    dates.push(label);
                                }
                                this.dates = dates;
                                var times = [];
                                for(var h = 0; h < 24; h++){
                                    var hh = (h < 10 ? '0' : '') + h;
                                    times.push(hh + ':00');
                                    times.push(hh + ':30');
                                }
                                this.times = times;
                                if (this.currentDue > 0) {
                                    var dueDate = new Date(this.currentDue);
                                    var day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                                    var dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();
                                    var diffDays = Math.round((dueDay - day0) / 86400000);
                                    if (diffDays < 0) diffDays = 0;
                                    if (diffDays > 29) diffDays = 29;
                                    this.dateIdx = 1 + diffDays;
                                    var ti = 2 * dueDate.getHours() + Math.floor(dueDate.getMinutes() / 30);
                                    if (ti < 0) ti = 0;
                                    if (ti > 47) ti = 47;
                                    this.timeIdx = ti;
                                } else {
                                    this.dateIdx = 0;
                                    var t0 = 2 * now.getHours() + Math.floor(now.getMinutes() / 30);
                                    if (t0 > 47) t0 = 47;
                                    this.timeIdx = t0;
                                }
                                this.dateTop = 40 * this.dateIdx;
                                this.timeTop = 40 * this.timeIdx;
                            },
                            setDate (i) {
                                this.dateIdx = i;
                                this.centerWheel('dateWheel', i);
                            },
                            setTime (i) {
                                this.timeIdx = i;
                                this.centerWheel('timeWheel', i);
                            },
                            centerWheel (id, i) {
                                var el = this.$element(id);
                                if (el && el.scrollTo) el.scrollTo({
                                    top: 40 * i
                                });
                            },
                            onDateScroll (e) {
                                var that = this;
                                this._lastDateY = e && e.scrollY || 0;
                                if (this._dtTimer) return;
                                this._dtTimer = setTimeout(function() {
                                    that._dtTimer = null;
                                    var idx = Math.round((that._lastDateY || 0) / 40);
                                    if (idx < 0) idx = 0;
                                    if (idx > that.dates.length - 1) idx = that.dates.length - 1;
                                    if (idx !== that.dateIdx) that.dateIdx = idx;
                                }, 150);
                            },
                            onTimeScroll (e) {
                                var that = this;
                                this._lastTimeY = e && e.scrollY || 0;
                                if (this._ttTimer) return;
                                this._ttTimer = setTimeout(function() {
                                    that._ttTimer = null;
                                    var idx = Math.round((that._lastTimeY || 0) / 40);
                                    if (idx < 0) idx = 0;
                                    if (idx > that.times.length - 1) idx = that.times.length - 1;
                                    if (idx !== that.timeIdx) that.timeIdx = idx;
                                }, 150);
                            },
                            confirmDue () {
                                if (this._confirmed) return;
                                this._confirmed = true;
                                var due = 0;
                                if (this.dateIdx > 0) {
                                    var now = new Date();
                                    var target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + this.dateIdx - 1);
                                    var hour = Math.floor(this.timeIdx / 2);
                                    var min = this.timeIdx % 2 * 30;
                                    due = new Date(target.getFullYear(), target.getMonth(), target.getDate(), hour, min, 59).getTime();
                                }
                                utils.storageSet('todo_due_sel', JSON.stringify({
                                    due: due
                                }));
                                _system.default.back();
                            },
                            showMenu () {
                                _system.default.push({
                                    uri: 'pages/list'
                                });
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
                                            value: "截止时间"
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
                                            bounces: "false",
                                            style: {
                                                position: "absolute",
                                                left: 0,
                                                top: "105px",
                                                width: "336px",
                                                height: "231px",
                                                flexDirection: "column"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    width: "336px",
                                                    height: "12px",
                                                    flexShrink: 0
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    position: "relative",
                                                    width: "291px",
                                                    height: "120px",
                                                    marginLeft: "22px",
                                                    flexShrink: 0
                                                }
                                            }
                                        }, [
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        position: "absolute",
                                                        left: 0,
                                                        top: "40px",
                                                        width: "291px",
                                                        height: "40px",
                                                        borderTopWidth: "1px",
                                                        borderBottomWidth: "1px",
                                                        borderTopColor: "#333333",
                                                        borderRightColor: "#333333",
                                                        borderBottomColor: "#333333",
                                                        borderLeftColor: "#333333"
                                                    }
                                                }
                                            }, []),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        width: "291px",
                                                        height: "120px",
                                                        flexDirection: "row",
                                                        justifyContent: "space-around"
                                                    }
                                                }
                                            }, [
                                                aiot.__ce__("scroll", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        id: "dateWheel",
                                                        scrollY: "true",
                                                        bounces: "false",
                                                        scrollTop: function() {
                                                            return _vm_.dateTop;
                                                        },
                                                        events: {
                                                            scroll: function(evt) {
                                                                return _vm_.onDateScroll(evt);
                                                            }
                                                        },
                                                        style: {
                                                            width: "130px",
                                                            height: "120px",
                                                            flexDirection: "column"
                                                        }
                                                    }
                                                }, [
                                                    aiot.__ce__("div", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: {
                                                                width: "130px",
                                                                height: "40px",
                                                                flexShrink: 0
                                                            }
                                                        }
                                                    }, []),
                                                    aiot.__cf__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            exp: function() {
                                                                return _vm_.dates;
                                                            },
                                                            key: "$idx",
                                                            value: "$item"
                                                        }
                                                    }, function($idx, $item) {
                                                        return [
                                                            aiot.__ce__("div", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    classList: [
                                                                        "wh-row"
                                                                    ],
                                                                    events: {
                                                                        click: function(evt) {
                                                                            return _vm_.setDate($idx, evt);
                                                                        }
                                                                    }
                                                                }
                                                            }, [
                                                                aiot.__ce__("text", {
                                                                    __vm__: _vm_,
                                                                    __opts__: {
                                                                        classList: function() {
                                                                            const $classValue$ = $idx === _vm_.dateIdx ? "wh-sel" : "wh-nor";
                                                                            if ('string' == typeof $classValue$) return $classValue$.split(' ').map((item)=>item.trim()).filter(Boolean);
                                                                            return $classValue$;
                                                                        },
                                                                        value: function() {
                                                                            return $item;
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
                                                                width: "130px",
                                                                height: "40px",
                                                                flexShrink: 0
                                                            }
                                                        }
                                                    }, [])
                                                ]),
                                                aiot.__ce__("scroll", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        id: "timeWheel",
                                                        scrollY: "true",
                                                        bounces: "false",
                                                        scrollTop: function() {
                                                            return _vm_.timeTop;
                                                        },
                                                        events: {
                                                            scroll: function(evt) {
                                                                return _vm_.onTimeScroll(evt);
                                                            }
                                                        },
                                                        style: function() {
                                                            return __webpack_require__.g.$translateStyle$("width:130px;height:120px;flex-direction:column;opacity:" + (0 === _vm_.dateIdx ? 0.35 : 1) + ";");
                                                        }
                                                    }
                                                }, [
                                                    aiot.__ce__("div", {
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            style: {
                                                                width: "130px",
                                                                height: "40px",
                                                                flexShrink: 0
                                                            }
                                                        }
                                                    }, []),
                                                    aiot.__cf__({
                                                        __vm__: _vm_,
                                                        __opts__: {
                                                            exp: function() {
                                                                return _vm_.times;
                                                            },
                                                            key: "$idx",
                                                            value: "$item"
                                                        }
                                                    }, function($idx, $item) {
                                                        return [
                                                            aiot.__ce__("div", {
                                                                __vm__: _vm_,
                                                                __opts__: {
                                                                    classList: [
                                                                        "wh-row"
                                                                    ],
                                                                    events: {
                                                                        click: function(evt) {
                                                                            return _vm_.setTime($idx, evt);
                                                                        }
                                                                    }
                                                                }
                                                            }, [
                                                                aiot.__ce__("text", {
                                                                    __vm__: _vm_,
                                                                    __opts__: {
                                                                        classList: function() {
                                                                            const $classValue$ = $idx === _vm_.timeIdx ? "wh-sel" : "wh-nor";
                                                                            if ('string' == typeof $classValue$) return $classValue$.split(' ').map((item)=>item.trim()).filter(Boolean);
                                                                            return $classValue$;
                                                                        },
                                                                        value: function() {
                                                                            return $item;
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
                                                                width: "130px",
                                                                height: "40px",
                                                                flexShrink: 0
                                                            }
                                                        }
                                                    }, [])
                                                ])
                                            ])
                                        ]),
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    width: "336px",
                                                    height: "24px",
                                                    flexShrink: 0
                                                }
                                            }
                                        }, []),
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    width: "291px",
                                                    height: "77px",
                                                    marginLeft: "22px",
                                                    flexShrink: 0,
                                                    borderRadius: "38px",
                                                    backgroundColor: "#448aff",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    paddingLeft: "26px",
                                                    paddingRight: "26px"
                                                },
                                                events: {
                                                    click: function(evt) {
                                                        return _vm_.confirmDue(evt);
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
                                                    value: "确认"
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
                                        ]),
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    width: "336px",
                                                    height: "84px",
                                                    flexShrink: 0
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
