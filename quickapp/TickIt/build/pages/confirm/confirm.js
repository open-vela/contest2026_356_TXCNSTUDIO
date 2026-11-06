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
                            public: {
                                itemId: '',
                                type: 'todo'
                            },
                            private: {
                                isCircle: null,
                                timeStr: '',
                                scope: 0
                            },
                            onInit () {
                                this.isCircle = _adapt.default.isCircleSync();
                                utils.init(_system2.default, _system3.default, _system4.default);
                            },
                            onShow () {
                                var that = this;
                                _adapt.default.probe().then(function(info) {
                                    if (that.isCircle !== info.isCircle) that.isCircle = info.isCircle;
                                });
                                this.updateTime();
                            },
                            onDestroy () {
                                if (this._deletingTimer) {
                                    clearTimeout(this._deletingTimer);
                                    this._deletingTimer = null;
                                }
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
                            setScope (s) {
                                this.scope = s;
                            },
                            doDelete () {
                                var that = this;
                                if (that._deleting) return;
                                that._deleting = true;
                                that._deletingTimer = setTimeout(function() {
                                    that._deleting = false;
                                }, 3000);
                                if ('clearAll' === that.type) that.doClearAll();
                                else if ('note' === that.type) that.doDeleteNote();
                                else that.doDeleteTodo();
                            },
                            doClearAll () {
                                var that = this;
                                var scope = that.scope;
                                utils.storageGet('todo_items').then(function(d1) {
                                    var items = [];
                                    if (d1) {
                                        try {
                                            items = JSON.parse(d1);
                                        } catch (e) {
                                            items = [];
                                        }
                                    }
                                    utils.storageGet('todo_notes').then(function(d2) {
                                        var notes = [];
                                        if (d2) {
                                            try {
                                                notes = JSON.parse(d2);
                                            } catch (e) {
                                                notes = [];
                                            }
                                        }
                                        var todoCids = [];
                                        var noteCids = [];
                                        for(var i = 0; i < items.length; i++)if (items[i] && items[i].cloudId) todoCids.push(items[i].cloudId);
                                        for(var j = 0; j < notes.length; j++)if (notes[j] && notes[j].cloudId) noteCids.push(notes[j].cloudId);
                                        var queueCloudDel = function(next) {
                                            if (!todoCids.length && !noteCids.length) return void next();
                                            utils.storageGet('todo_pending_delete').then(function(pd) {
                                                var pending = [];
                                                if (pd) {
                                                    try {
                                                        pending = JSON.parse(pd);
                                                    } catch (e) {
                                                        pending = [];
                                                    }
                                                }
                                                for(var a = 0; a < todoCids.length; a++)if (pending.indexOf(todoCids[a]) < 0) pending.push(todoCids[a]);
                                                utils.storageSet('todo_pending_delete', JSON.stringify(pending)).then(function() {
                                                    utils.storageGet('todo_pending_delete_notes').then(function(pd2) {
                                                        var pending2 = [];
                                                        if (pd2) {
                                                            try {
                                                                pending2 = JSON.parse(pd2);
                                                            } catch (e) {
                                                                pending2 = [];
                                                            }
                                                        }
                                                        for(var b = 0; b < noteCids.length; b++)if (pending2.indexOf(noteCids[b]) < 0) pending2.push(noteCids[b]);
                                                        utils.storageSet('todo_pending_delete_notes', JSON.stringify(pending2)).then(next);
                                                    });
                                                });
                                            });
                                        };
                                        var finish = function(msg) {
                                            utils.toast(msg);
                                            _system.default.back();
                                        };
                                        if (2 === scope) {
                                            if (!todoCids.length && !noteCids.length) return void utils.toast('云端无此内容');
                                            for(var m = 0; m < items.length; m++)if (items[m] && items[m].cloudId) {
                                                items[m].localOnly = true;
                                                items[m].cloudId = null;
                                            }
                                            for(var n = 0; n < notes.length; n++)if (notes[n] && notes[n].cloudId) {
                                                notes[n].localOnly = true;
                                                notes[n].cloudId = null;
                                            }
                                            queueCloudDel(function() {
                                                utils.storageSet('todo_items', JSON.stringify(items)).then(function() {
                                                    utils.storageSet('todo_notes', JSON.stringify(notes)).then(function() {
                                                        finish('已清空云端内容');
                                                    });
                                                });
                                            });
                                            return;
                                        }
                                        var writeEmpty = function() {
                                            utils.storageSet('todo_items', '[]').then(function() {
                                                utils.storageSet('todo_notes', '[]').then(function() {
                                                    finish(1 === scope ? '已清空本地内容' : '已清空所有内容');
                                                });
                                            });
                                        };
                                        if (1 === scope) return void writeEmpty();
                                        queueCloudDel(writeEmpty);
                                    });
                                });
                            },
                            doDeleteNote () {
                                var that = this;
                                var scope = that.scope;
                                utils.storageGet('todo_notes').then(function(data) {
                                    var list = [];
                                    var cloudId = null;
                                    var keepItem = null;
                                    if (data) {
                                        try {
                                            list = JSON.parse(data);
                                        } catch (e) {
                                            list = [];
                                        }
                                    }
                                    var newList = [];
                                    for(var i = 0; i < list.length; i++){
                                        if (list[i].id === that.itemId) {
                                            cloudId = list[i].cloudId || null;
                                            keepItem = list[i];
                                            continue;
                                        }
                                        newList.push(list[i]);
                                    }
                                    var afterSave = function() {
                                        utils.toast('已删除');
                                        _system.default.back();
                                    };
                                    if (2 === scope) {
                                        if (!cloudId) return void utils.toast('云端无此内容');
                                        utils.storageGet('todo_pending_delete_notes').then(function(pd) {
                                            var pending = [];
                                            if (pd) {
                                                try {
                                                    pending = JSON.parse(pd);
                                                } catch (e) {
                                                    pending = [];
                                                }
                                            }
                                            if (pending.indexOf(cloudId) < 0) pending.push(cloudId);
                                            keepItem.localOnly = true;
                                            keepItem.cloudId = null;
                                            utils.storageSet('todo_pending_delete_notes', JSON.stringify(pending)).then(function() {
                                                utils.storageSet('todo_notes', JSON.stringify(list)).then(afterSave);
                                            });
                                        });
                                        return;
                                    }
                                    var voidAdd = function(next) {
                                        utils.storageGet('todo_notes_pending_add').then(function(pd) {
                                            var pending = [];
                                            if (pd) {
                                                try {
                                                    pending = JSON.parse(pd);
                                                } catch (e) {
                                                    pending = [];
                                                }
                                            }
                                            var remaining = [];
                                            for(var j = 0; j < pending.length; j++)if (pending[j] && pending[j].localId !== that.itemId) remaining.push(pending[j]);
                                            utils.storageGet('todo_notes_voided').then(function(vd) {
                                                var voided = [];
                                                if (vd) {
                                                    try {
                                                        voided = JSON.parse(vd);
                                                    } catch (e) {
                                                        voided = [];
                                                    }
                                                }
                                                if (voided.indexOf(that.itemId) < 0) voided.push(that.itemId);
                                                utils.storageSet('todo_notes_voided', JSON.stringify(voided)).then(function() {
                                                    utils.storageSet('todo_notes_pending_add', JSON.stringify(remaining)).then(next);
                                                });
                                            });
                                        });
                                    };
                                    if (1 === scope) {
                                        var ignoreAndSave = function() {
                                            if (!cloudId) return void utils.storageSet('todo_notes', JSON.stringify(newList)).then(afterSave);
                                            utils.storageGet('todo_notes_ignore_ids').then(function(ig) {
                                                var ignores = [];
                                                if (ig) {
                                                    try {
                                                        ignores = JSON.parse(ig);
                                                    } catch (e) {
                                                        ignores = [];
                                                    }
                                                }
                                                if (ignores.indexOf(cloudId) < 0) ignores.push(cloudId);
                                                utils.storageSet('todo_notes_ignore_ids', JSON.stringify(ignores)).then(function() {
                                                    utils.storageSet('todo_notes', JSON.stringify(newList)).then(afterSave);
                                                });
                                            });
                                        };
                                        voidAdd(ignoreAndSave);
                                        return;
                                    }
                                    var doCloudDelete = function() {
                                        if (cloudId) utils.storageGet('todo_pending_delete_notes').then(function(pd) {
                                            var pending = [];
                                            if (pd) {
                                                try {
                                                    pending = JSON.parse(pd);
                                                } catch (e) {
                                                    pending = [];
                                                }
                                            }
                                            if (pending.indexOf(cloudId) < 0) pending.push(cloudId);
                                            utils.storageSet('todo_pending_delete_notes', JSON.stringify(pending)).then(function() {
                                                utils.storageSet('todo_notes', JSON.stringify(newList)).then(afterSave);
                                            });
                                        });
                                        else utils.storageSet('todo_notes', JSON.stringify(newList)).then(afterSave);
                                    };
                                    voidAdd(doCloudDelete);
                                });
                            },
                            doDeleteTodo () {
                                var that = this;
                                var scope = that.scope;
                                utils.storageGet('todo_items').then(function(data) {
                                    var items = [];
                                    var cloudId = null;
                                    var keepItem = null;
                                    if (data) {
                                        try {
                                            items = JSON.parse(data);
                                        } catch (e) {
                                            items = [];
                                        }
                                    }
                                    var newItems = [];
                                    for(var i = 0; i < items.length; i++){
                                        if (items[i].id === that.itemId) {
                                            cloudId = items[i].cloudId || null;
                                            keepItem = items[i];
                                            continue;
                                        }
                                        newItems.push(items[i]);
                                    }
                                    var afterSave = function() {
                                        utils.toast('已删除');
                                        _system.default.back();
                                    };
                                    if (2 === scope) {
                                        if (!cloudId) return void utils.toast('云端无此内容');
                                        utils.storageGet('todo_pending_delete').then(function(pd) {
                                            var pending = [];
                                            if (pd) {
                                                try {
                                                    pending = JSON.parse(pd);
                                                } catch (e) {
                                                    pending = [];
                                                }
                                            }
                                            if (pending.indexOf(cloudId) < 0) pending.push(cloudId);
                                            keepItem.localOnly = true;
                                            keepItem.cloudId = null;
                                            utils.storageSet('todo_pending_delete', JSON.stringify(pending)).then(function() {
                                                utils.storageSet('todo_items', JSON.stringify(items)).then(afterSave);
                                            });
                                        });
                                        return;
                                    }
                                    if (1 === scope) {
                                        if (!cloudId) return void utils.storageSet('todo_items', JSON.stringify(newItems)).then(afterSave);
                                        utils.storageGet('todo_ignore_ids').then(function(ig) {
                                            var ignores = [];
                                            if (ig) {
                                                try {
                                                    ignores = JSON.parse(ig);
                                                } catch (e) {
                                                    ignores = [];
                                                }
                                            }
                                            if (ignores.indexOf(cloudId) < 0) ignores.push(cloudId);
                                            utils.storageSet('todo_ignore_ids', JSON.stringify(ignores)).then(function() {
                                                utils.storageSet('todo_items', JSON.stringify(newItems)).then(afterSave);
                                            });
                                        });
                                        return;
                                    }
                                    if (cloudId) utils.storageGet('todo_pending_delete').then(function(pd) {
                                        var pending = [];
                                        if (pd) {
                                            try {
                                                pending = JSON.parse(pd);
                                            } catch (e) {
                                                pending = [];
                                            }
                                        }
                                        if (pending.indexOf(cloudId) < 0) pending.push(cloudId);
                                        utils.storageSet('todo_pending_delete', JSON.stringify(pending)).then(function() {
                                            utils.storageSet('todo_items', JSON.stringify(newItems)).then(afterSave);
                                        });
                                    });
                                    else utils.storageSet('todo_items', JSON.stringify(newItems)).then(afterSave);
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
                                                left: "48px",
                                                top: "42px",
                                                width: "240px",
                                                textAlign: "center",
                                                fontSize: "28px",
                                                fontWeight: 700,
                                                color: "#ffffff",
                                                lines: 1
                                            },
                                            value: function() {
                                                return "clearAll" === _vm_.type ? "\u6E05\u7A7A\u6240\u6709\u5185\u5BB9" : "\u5220\u9664\u8BE5\u5185\u5BB9";
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
                                    aiot.__ce__("image", {
                                        __vm__: _vm_,
                                        __opts__: {
                                            src: "/common/icon-del-top.png",
                                            style: {
                                                position: "absolute",
                                                left: "258px",
                                                top: "6px",
                                                width: "72px",
                                                height: "72px"
                                            },
                                            events: {
                                                click: function(evt) {
                                                    return _vm_.doDelete(evt);
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
                                        return false === _vm_.isCircle;
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
                                                top: "88px",
                                                width: "336px",
                                                height: "392px",
                                                flexDirection: "column"
                                            }
                                        }
                                    }, [
                                        aiot.__ce__("div", {
                                            __vm__: _vm_,
                                            __opts__: {
                                                style: {
                                                    width: "336px",
                                                    flexDirection: "column"
                                                }
                                            }
                                        }, [
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        width: "324px",
                                                        marginLeft: "6px",
                                                        marginTop: "10px",
                                                        borderRadius: "30px",
                                                        backgroundColor: "#262626",
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        paddingTop: "18px",
                                                        paddingBottom: "18px",
                                                        flexShrink: 0
                                                    }
                                                }
                                            }, [
                                                aiot.__ce__("text", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            fontSize: "30px",
                                                            fontWeight: 700,
                                                            color: "#ffffff",
                                                            lines: 1
                                                        },
                                                        value: "确认删除吗"
                                                    }
                                                }, []),
                                                aiot.__ce__("text", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            fontSize: "24px",
                                                            color: "#6b6b6b",
                                                            lines: 1,
                                                            marginTop: "10px"
                                                        },
                                                        value: "删除后不可恢复"
                                                    }
                                                }, [])
                                            ]),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: function() {
                                                        return __webpack_require__.g.$translateStyle$("width:324px;height:112px;margin-left:6px;margin-top:16px;border-radius:36px;background-color:" + (0 === _vm_.scope ? "#448AFF" : "#262626") + ";flex-direction:row;align-items:center;padding-left:28px;padding-right:24px;flex-shrink:0;");
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.setScope(0, evt);
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
                                                        value: "全部删除"
                                                    }
                                                }, [])
                                            ]),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: function() {
                                                        return __webpack_require__.g.$translateStyle$("width:324px;height:112px;margin-left:6px;margin-top:8px;border-radius:36px;background-color:" + (1 === _vm_.scope ? "#448AFF" : "#262626") + ";flex-direction:row;align-items:center;padding-left:28px;padding-right:24px;flex-shrink:0;");
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.setScope(1, evt);
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
                                                        value: "仅删除本地"
                                                    }
                                                }, [])
                                            ]),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: function() {
                                                        return __webpack_require__.g.$translateStyle$("width:324px;height:112px;margin-left:6px;margin-top:8px;border-radius:36px;background-color:" + (2 === _vm_.scope ? "#448AFF" : "#262626") + ";flex-direction:row;align-items:center;padding-left:28px;padding-right:24px;flex-shrink:0;");
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.setScope(2, evt);
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
                                                        value: "仅删除云端"
                                                    }
                                                }, [])
                                            ]),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        width: "336px",
                                                        height: "32px",
                                                        flexShrink: 0
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
                                                value: function() {
                                                    return "clearAll" === _vm_.type ? "\u6E05\u7A7A" : "\u5220\u9664";
                                                }
                                            }
                                        }, []),
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
                                                        height: "8px",
                                                        flexShrink: 0
                                                    }
                                                }
                                            }, []),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        width: "291px",
                                                        height: "106px",
                                                        marginLeft: "22px",
                                                        borderRadius: "30px",
                                                        backgroundColor: "#262626",
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        flexShrink: 0
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
                                                        value: "确认删除吗"
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
                                                        value: "删除后将无法恢复"
                                                    }
                                                }, [])
                                            ]),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: function() {
                                                        return __webpack_require__.g.$translateStyle$("width:291px;height:77px;margin-left:22px;margin-top:10px;border-radius:38px;background-color:" + (0 === _vm_.scope ? "#448AFF" : "#262626") + ";flex-direction:row;align-items:center;padding-left:24px;padding-right:24px;flex-shrink:0;");
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.setScope(0, evt);
                                                        }
                                                    }
                                                }
                                            }, [
                                                aiot.__ce__("text", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            flex: 1,
                                                            fontSize: "22px",
                                                            fontWeight: 700,
                                                            color: "#ffffff",
                                                            lines: 1
                                                        },
                                                        value: "全部删除"
                                                    }
                                                }, []),
                                                aiot.__ci__({
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        shown: function() {
                                                            return 0 === _vm_.scope;
                                                        }
                                                    }
                                                }, function() {
                                                    return [
                                                        aiot.__ce__("text", {
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                style: {
                                                                    fontSize: "22px",
                                                                    color: "#ffffff"
                                                                },
                                                                value: "✓"
                                                            }
                                                        }, [])
                                                    ];
                                                })
                                            ]),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: function() {
                                                        return __webpack_require__.g.$translateStyle$("width:291px;height:77px;margin-left:22px;margin-top:10px;border-radius:38px;background-color:" + (1 === _vm_.scope ? "#448AFF" : "#262626") + ";flex-direction:row;align-items:center;padding-left:24px;padding-right:24px;flex-shrink:0;");
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.setScope(1, evt);
                                                        }
                                                    }
                                                }
                                            }, [
                                                aiot.__ce__("text", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            flex: 1,
                                                            fontSize: "22px",
                                                            fontWeight: 700,
                                                            color: "#ffffff",
                                                            lines: 1
                                                        },
                                                        value: "仅删除本地"
                                                    }
                                                }, []),
                                                aiot.__ci__({
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        shown: function() {
                                                            return 1 === _vm_.scope;
                                                        }
                                                    }
                                                }, function() {
                                                    return [
                                                        aiot.__ce__("text", {
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                style: {
                                                                    fontSize: "22px",
                                                                    color: "#ffffff"
                                                                },
                                                                value: "✓"
                                                            }
                                                        }, [])
                                                    ];
                                                })
                                            ]),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: function() {
                                                        return __webpack_require__.g.$translateStyle$("width:291px;height:77px;margin-left:22px;margin-top:10px;border-radius:38px;background-color:" + (2 === _vm_.scope ? "#448AFF" : "#262626") + ";flex-direction:row;align-items:center;padding-left:24px;padding-right:24px;flex-shrink:0;");
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.setScope(2, evt);
                                                        }
                                                    }
                                                }
                                            }, [
                                                aiot.__ce__("text", {
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        style: {
                                                            flex: 1,
                                                            fontSize: "22px",
                                                            fontWeight: 700,
                                                            color: "#ffffff",
                                                            lines: 1
                                                        },
                                                        value: "仅删除云端"
                                                    }
                                                }, []),
                                                aiot.__ci__({
                                                    __vm__: _vm_,
                                                    __opts__: {
                                                        shown: function() {
                                                            return 2 === _vm_.scope;
                                                        }
                                                    }
                                                }, function() {
                                                    return [
                                                        aiot.__ce__("text", {
                                                            __vm__: _vm_,
                                                            __opts__: {
                                                                style: {
                                                                    fontSize: "22px",
                                                                    color: "#ffffff"
                                                                },
                                                                value: "✓"
                                                            }
                                                        }, [])
                                                    ];
                                                })
                                            ]),
                                            aiot.__ce__("div", {
                                                __vm__: _vm_,
                                                __opts__: {
                                                    style: {
                                                        width: "291px",
                                                        height: "77px",
                                                        marginLeft: "22px",
                                                        marginTop: "14px",
                                                        borderRadius: "38px",
                                                        backgroundColor: "#ff4444",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        paddingLeft: "26px",
                                                        paddingRight: "26px",
                                                        flexShrink: 0
                                                    },
                                                    events: {
                                                        click: function(evt) {
                                                            return _vm_.doDelete(evt);
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
                                                        value: "确认删除"
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
