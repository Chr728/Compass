!function(){var e={155:function(e){var t,i,n,s=e.exports={};function defaultSetTimout(){throw Error("setTimeout has not been defined")}function defaultClearTimeout(){throw Error("clearTimeout has not been defined")}function runTimeout(e){if(t===setTimeout)return setTimeout(e,0);if((t===defaultSetTimout||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(i){try{return t.call(null,e,0)}catch(i){return t.call(this,e,0)}}}function runClearTimeout(e){if(i===clearTimeout)return clearTimeout(e);if((i===defaultClearTimeout||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(e);try{return i(e)}catch(t){try{return i.call(null,e)}catch(t){return i.call(this,e)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){t=defaultSetTimout}try{i="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){i=defaultClearTimeout}}();var o=[],l=!1,h=-1;function cleanUpNextTick(){l&&n&&(l=!1,n.length?o=n.concat(o):h=-1,o.length&&drainQueue())}function drainQueue(){if(!l){var e=runTimeout(cleanUpNextTick);l=!0;for(var t=o.length;t;){for(n=o,o=[];++h<t;)n&&n[h].run();h=-1,t=o.length}n=null,l=!1,runClearTimeout(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}s.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];o.push(new Item(e,t)),1!==o.length||l||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=noop,s.addListener=noop,s.once=noop,s.off=noop,s.removeListener=noop,s.removeAllListeners=noop,s.emit=noop,s.prependListener=noop,s.prependOnceListener=noop,s.listeners=function(e){return[]},s.binding=function(e){throw Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw Error("process.chdir is not supported")},s.umask=function(){return 0}},346:function(e){"use strict";function tryStringify(e){try{return JSON.stringify(e)}catch(e){return'"[Circular]"'}}function format(e,t,i){var n=i&&i.stringify||tryStringify;if("object"==typeof e&&null!==e){var s=t.length+1;if(1===s)return e;var o=Array(s);o[0]=n(e);for(var l=1;l<s;l++)o[l]=n(t[l]);return o.join(" ")}if("string"!=typeof e)return e;var h=t.length;if(0===h)return e;for(var u="",d=0,f=-1,g=e&&e.length||0,m=0;m<g;){if(37===e.charCodeAt(m)&&m+1<g){switch(f=f>-1?f:0,e.charCodeAt(m+1)){case 100:case 102:if(d>=h||null==t[d])break;f<m&&(u+=e.slice(f,m)),u+=Number(t[d]),f=m+2,m++;break;case 105:if(d>=h||null==t[d])break;f<m&&(u+=e.slice(f,m)),u+=Math.floor(Number(t[d])),f=m+2,m++;break;case 79:case 111:case 106:if(d>=h||void 0===t[d])break;f<m&&(u+=e.slice(f,m));var b=typeof t[d];if("string"===b){u+="'"+t[d]+"'",f=m+2,m++;break}if("function"===b){u+=t[d].name||"<anonymous>",f=m+2,m++;break}u+=n(t[d]),f=m+2,m++;break;case 115:if(d>=h)break;f<m&&(u+=e.slice(f,m)),u+=String(t[d]),f=m+2,m++;break;case 37:f<m&&(u+=e.slice(f,m)),u+="%",f=m+2,m++,d--}++d}++m}return -1===f?e:(f<g&&(u+=e.slice(f)),u)}e.exports=format},895:function(){"use strict";try{self["workbox:cacheable-response:7.0.0"]&&_()}catch(e){}},913:function(){"use strict";try{self["workbox:core:7.0.0"]&&_()}catch(e){}},550:function(){"use strict";try{self["workbox:expiration:7.0.0"]&&_()}catch(e){}},977:function(){"use strict";try{self["workbox:precaching:7.0.0"]&&_()}catch(e){}},80:function(){"use strict";try{self["workbox:routing:7.0.0"]&&_()}catch(e){}},873:function(){"use strict";try{self["workbox:strategies:7.0.0"]&&_()}catch(e){}},559:function(e,t,i){"use strict";let n=i(346);e.exports=pino;let s=pfGlobalThisOrFallback().console||{};function levelToValue(e,t){return"silent"===e?1/0:t.levels.values[e]}let o=Symbol("pino.logFuncs"),l=Symbol("pino.hierarchy"),h={error:"log",fatal:"error",warn:"error",info:"log",debug:"log",trace:"log"};function appendChildLogger(e,t){let i={logger:t,parent:e[l]};t[l]=i}function setupBaseLogFunctions(e,t,i){let n={};t.forEach(e=>{n[e]=i[e]?i[e]:s[e]||s[h[e]||"log"]||noop}),e[o]=n}function shouldSerialize(e,t){if(Array.isArray(e)){let t=e.filter(function(e){return"!stdSerializers.err"!==e});return t}return!0===e&&Object.keys(t)}function pino(e){(e=e||{}).browser=e.browser||{};let t=e.browser.transmit;if(t&&"function"!=typeof t.send)throw Error("pino: transmit option must have a send function");let i=e.browser.write||s;e.browser.write&&(e.browser.asObject=!0);let n=e.serializers||{},o=shouldSerialize(e.browser.serialize,n),l=e.browser.serialize;Array.isArray(e.browser.serialize)&&e.browser.serialize.indexOf("!stdSerializers.err")>-1&&(l=!1);let h=Object.keys(e.customLevels||{}),u=["error","fatal","warn","info","debug","trace"].concat(h);"function"==typeof i&&u.forEach(function(e){i[e]=i}),(!1===e.enabled||e.browser.disabled)&&(e.level="silent");let d=e.level||"info",f=Object.create(i);f.log||(f.log=noop),setupBaseLogFunctions(f,u,i),appendChildLogger({},f),Object.defineProperty(f,"levelVal",{get:getLevelVal}),Object.defineProperty(f,"level",{get:getLevel,set:setLevel});let g={transmit:t,serialize:o,asObject:e.browser.asObject,levels:u,timestamp:getTimeFunction(e)};function getLevelVal(){return levelToValue(this.level,this)}function getLevel(){return this._level}function setLevel(e){if("silent"!==e&&!this.levels.values[e])throw Error("unknown level "+e);this._level=e,set(this,g,f,"error"),set(this,g,f,"fatal"),set(this,g,f,"warn"),set(this,g,f,"info"),set(this,g,f,"debug"),set(this,g,f,"trace"),h.forEach(e=>{set(this,g,f,e)})}function child(i,s){if(!i)throw Error("missing bindings for child Pino");s=s||{},o&&i.serializers&&(s.serializers=i.serializers);let l=s.serializers;if(o&&l){var h=Object.assign({},n,l),u=!0===e.browser.serialize?Object.keys(h):o;delete i.serializers,applySerializers([i],u,h,this._stdErrSerialize)}function Child(e){this._childLevel=(0|e._childLevel)+1,this.bindings=i,h&&(this.serializers=h,this._serialize=u),t&&(this._logEvent=createLogEventShape([].concat(e._logEvent.bindings,i)))}Child.prototype=this;let d=new Child(this);return appendChildLogger(this,d),d.level=this.level,d}return f.levels=getLevels(e),f.level=d,f.setMaxListeners=f.getMaxListeners=f.emit=f.addListener=f.on=f.prependListener=f.once=f.prependOnceListener=f.removeListener=f.removeAllListeners=f.listeners=f.listenerCount=f.eventNames=f.write=f.flush=noop,f.serializers=n,f._serialize=o,f._stdErrSerialize=l,f.child=child,t&&(f._logEvent=createLogEventShape()),f}function getLevels(e){let t=e.customLevels||{},i=Object.assign({},pino.levels.values,t),n=Object.assign({},pino.levels.labels,invertObject(t));return{values:i,labels:n}}function invertObject(e){let t={};return Object.keys(e).forEach(function(i){t[e[i]]=i}),t}function getBindingChain(e){let t=[];e.bindings&&t.push(e.bindings);let i=e[l];for(;i.parent;)(i=i.parent).logger.bindings&&t.push(i.logger.bindings);return t.reverse()}function set(e,t,i,n){if(e[n]=levelToValue(e.level,i)>levelToValue(n,i)?noop:i[o][n],!t.transmit&&e[n]===noop)return;e[n]=createWrap(e,t,i,n);let s=getBindingChain(e);0!==s.length&&(e[n]=prependBindingsInArguments(s,e[n]))}function prependBindingsInArguments(e,t){return function(){return t.apply(this,[...e,...arguments])}}function createWrap(e,t,i,n){var l;return l=e[o][n],function(){let o=t.timestamp(),h=Array(arguments.length),u=Object.getPrototypeOf&&Object.getPrototypeOf(this)===s?s:this;for(var d=0;d<h.length;d++)h[d]=arguments[d];if(t.serialize&&!t.asObject&&applySerializers(h,this._serialize,this.serializers,this._stdErrSerialize),t.asObject?l.call(u,asObject(this,n,h,o)):l.apply(u,h),t.transmit){let s=t.transmit.level||e._level,l=i.levels.values[s],u=i.levels.values[n];if(u<l)return;transmit(this,{ts:o,methodLevel:n,methodValue:u,transmitLevel:s,transmitValue:i.levels.values[t.transmit.level||e._level],send:t.transmit.send,val:levelToValue(e._level,i)},h)}}}function asObject(e,t,i,s){e._serialize&&applySerializers(i,e._serialize,e.serializers,e._stdErrSerialize);let o=i.slice(),l=o[0],h={};s&&(h.time=s),h.level=e.levels.values[t];let u=(0|e._childLevel)+1;if(u<1&&(u=1),null!==l&&"object"==typeof l){for(;u--&&"object"==typeof o[0];)Object.assign(h,o.shift());l=o.length?n(o.shift(),o):void 0}else"string"==typeof l&&(l=n(o.shift(),o));return void 0!==l&&(h.msg=l),h}function applySerializers(e,t,i,n){for(let s in e)if(n&&e[s]instanceof Error)e[s]=pino.stdSerializers.err(e[s]);else if("object"==typeof e[s]&&!Array.isArray(e[s]))for(let n in e[s])t&&t.indexOf(n)>-1&&n in i&&(e[s][n]=i[n](e[s][n]))}function transmit(e,t,i){let n=t.send,s=t.ts,o=t.methodLevel,l=t.methodValue,h=t.val,u=e._logEvent.bindings;applySerializers(i,e._serialize||Object.keys(e.serializers),e.serializers,void 0===e._stdErrSerialize||e._stdErrSerialize),e._logEvent.ts=s,e._logEvent.messages=i.filter(function(e){return -1===u.indexOf(e)}),e._logEvent.level.label=o,e._logEvent.level.value=l,n(o,e._logEvent,h),e._logEvent=createLogEventShape(u)}function createLogEventShape(e){return{ts:0,messages:[],bindings:e||[],level:{label:"",value:0}}}function asErrValue(e){let t={type:e.constructor.name,msg:e.message,stack:e.stack};for(let i in e)void 0===t[i]&&(t[i]=e[i]);return t}function getTimeFunction(e){return"function"==typeof e.timestamp?e.timestamp:!1===e.timestamp?nullTime:epochTime}function mock(){return{}}function passthrough(e){return e}function noop(){}function nullTime(){return!1}function epochTime(){return Date.now()}function unixTime(){return Math.round(Date.now()/1e3)}function isoTime(){return new Date(Date.now()).toISOString()}function pfGlobalThisOrFallback(){function defd(e){return void 0!==e&&e}try{if("undefined"!=typeof globalThis)return globalThis;return Object.defineProperty(Object.prototype,"globalThis",{get:function(){return delete Object.prototype.globalThis,this.globalThis=this},configurable:!0}),globalThis}catch(e){return defd(self)||defd(window)||defd(this)||{}}}pino.levels={values:{fatal:60,error:50,warn:40,info:30,debug:20,trace:10},labels:{10:"trace",20:"debug",30:"info",40:"warn",50:"error",60:"fatal"}},pino.stdSerializers={mapHttpRequest:mock,mapHttpResponse:mock,wrapRequestSerializer:passthrough,wrapResponseSerializer:passthrough,wrapErrorSerializer:passthrough,req:mock,res:mock,err:asErrValue,errWithCause:asErrValue},pino.stdTimeFunctions=Object.assign({},{nullTime,epochTime,unixTime,isoTime}),e.exports.default=pino,e.exports.pino=pino}},t={};function __webpack_require__(i){var n=t[i];if(void 0!==n)return n.exports;var s=t[i]={exports:{}},o=!0;try{e[i](s,s.exports,__webpack_require__),o=!1}finally{o&&delete t[i]}return s.exports}__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),function(){"use strict";let e,t,i,n,s;__webpack_require__(913);let messageGenerator=(e,...t)=>{let i=e;return t.length>0&&(i+=` :: ${JSON.stringify(t)}`),i};let WorkboxError_WorkboxError=class WorkboxError_WorkboxError extends Error{constructor(e,t){let i=messageGenerator(e,t);super(i),this.name=e,this.details=t}};let o=new Set;function registerQuotaErrorCallback(e){o.add(e)}let l={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},_createCacheName=e=>[l.prefix,e,l.suffix].filter(e=>e&&e.length>0).join("-"),eachCacheNameDetail=e=>{for(let t of Object.keys(l))e(t)},h={updateDetails:e=>{eachCacheNameDetail(t=>{"string"==typeof e[t]&&(l[t]=e[t])})},getGoogleAnalyticsName:e=>e||_createCacheName(l.googleAnalytics),getPrecacheName:e=>e||_createCacheName(l.precache),getPrefix:()=>l.prefix,getRuntimeName:e=>e||_createCacheName(l.runtime),getSuffix:()=>l.suffix};function stripParams(e,t){let i=new URL(e);for(let e of t)i.searchParams.delete(e);return i.href}async function cacheMatchIgnoreParams(e,t,i,n){let s=stripParams(t.url,i);if(t.url===s)return e.match(t,n);let o=Object.assign(Object.assign({},n),{ignoreSearch:!0}),l=await e.keys(t,o);for(let t of l){let o=stripParams(t.url,i);if(s===o)return e.match(t,n)}}function canConstructResponseFromBodyStream(){if(void 0===e){let t=new Response("");if("body"in t)try{new Response(t.body),e=!0}catch(t){e=!1}e=!1}return e}function dontWaitFor(e){e.then(()=>{})}let Deferred=class Deferred{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}};async function executeQuotaErrorCallbacks(){for(let e of o)await e()}let getFriendlyURL=e=>{let t=new URL(String(e),location.href);return t.href.replace(RegExp(`^${location.origin}`),"")};function timeout_timeout(e){return new Promise(t=>setTimeout(t,e))}function waitUntil(e,t){let i=t();return e.waitUntil(i),i}async function copyResponse(e,t){let i=null;if(e.url){let t=new URL(e.url);i=t.origin}if(i!==self.location.origin)throw new WorkboxError_WorkboxError("cross-origin-copy-response",{origin:i});let n=e.clone(),s={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},o=t?t(s):s,l=canConstructResponseFromBodyStream()?n.body:await n.blob();return new Response(l,o)}function clientsClaim(){self.addEventListener("activate",()=>self.clients.claim())}function skipWaiting(){self.skipWaiting()}let instanceOfAny=(e,t)=>t.some(t=>e instanceof t);function getIdbProxyableTypes(){return t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function getCursorAdvanceMethods(){return i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}let u=new WeakMap,d=new WeakMap,f=new WeakMap,g=new WeakMap,m=new WeakMap;function promisifyRequest(e){let t=new Promise((t,i)=>{let unlisten=()=>{e.removeEventListener("success",success),e.removeEventListener("error",error)},success=()=>{t(wrap(e.result)),unlisten()},error=()=>{i(e.error),unlisten()};e.addEventListener("success",success),e.addEventListener("error",error)});return t.then(t=>{t instanceof IDBCursor&&u.set(t,e)}).catch(()=>{}),m.set(t,e),t}function cacheDonePromiseForTransaction(e){if(d.has(e))return;let t=new Promise((t,i)=>{let unlisten=()=>{e.removeEventListener("complete",complete),e.removeEventListener("error",error),e.removeEventListener("abort",error)},complete=()=>{t(),unlisten()},error=()=>{i(e.error||new DOMException("AbortError","AbortError")),unlisten()};e.addEventListener("complete",complete),e.addEventListener("error",error),e.addEventListener("abort",error)});d.set(e,t)}let b={get(e,t,i){if(e instanceof IDBTransaction){if("done"===t)return d.get(e);if("objectStoreNames"===t)return e.objectStoreNames||f.get(e);if("store"===t)return i.objectStoreNames[1]?void 0:i.objectStore(i.objectStoreNames[0])}return wrap(e[t])},set:(e,t,i)=>(e[t]=i,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function replaceTraps(e){b=e(b)}function wrapFunction(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?getCursorAdvanceMethods().includes(e)?function(...t){return e.apply(unwrap(this),t),wrap(u.get(this))}:function(...t){return wrap(e.apply(unwrap(this),t))}:function(t,...i){let n=e.call(unwrap(this),t,...i);return f.set(n,t.sort?t.sort():[t]),wrap(n)}}function transformCachableValue(e){return"function"==typeof e?wrapFunction(e):(e instanceof IDBTransaction&&cacheDonePromiseForTransaction(e),instanceOfAny(e,getIdbProxyableTypes()))?new Proxy(e,b):e}function wrap(e){if(e instanceof IDBRequest)return promisifyRequest(e);if(g.has(e))return g.get(e);let t=transformCachableValue(e);return t!==e&&(g.set(e,t),m.set(t,e)),t}let unwrap=e=>m.get(e);function openDB(e,t,{blocked:i,upgrade:n,blocking:s,terminated:o}={}){let l=indexedDB.open(e,t),h=wrap(l);return n&&l.addEventListener("upgradeneeded",e=>{n(wrap(l.result),e.oldVersion,e.newVersion,wrap(l.transaction),e)}),i&&l.addEventListener("blocked",e=>i(e.oldVersion,e.newVersion,e)),h.then(e=>{o&&e.addEventListener("close",()=>o()),s&&e.addEventListener("versionchange",e=>s(e.oldVersion,e.newVersion,e))}).catch(()=>{}),h}function deleteDB(e,{blocked:t}={}){let i=indexedDB.deleteDatabase(e);return t&&i.addEventListener("blocked",e=>t(e.oldVersion,e)),wrap(i).then(()=>void 0)}let E=["get","getKey","getAll","getAllKeys","count"],k=["put","add","delete","clear"],L=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(L.get(t))return L.get(t);let i=t.replace(/FromIndex$/,""),n=t!==i,s=k.includes(i);if(!(i in(n?IDBIndex:IDBObjectStore).prototype)||!(s||E.includes(i)))return;let method=async function(e,...t){let o=this.transaction(e,s?"readwrite":"readonly"),l=o.store;return n&&(l=l.index(t.shift())),(await Promise.all([l[i](...t),s&&o.done]))[0]};return L.set(t,method),method}replaceTraps(e=>({...e,get:(t,i,n)=>getMethod(t,i)||e.get(t,i,n),has:(t,i)=>!!getMethod(t,i)||e.has(t,i)})),__webpack_require__(550);let j="cache-entries",normalizeURL=e=>{let t=new URL(e,location.href);return t.hash="",t.href};let CacheTimestampsModel=class CacheTimestampsModel{constructor(e){this._db=null,this._cacheName=e}_upgradeDb(e){let t=e.createObjectStore(j,{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&deleteDB(this._cacheName)}async setTimestamp(e,t){e=normalizeURL(e);let i={url:e,timestamp:t,cacheName:this._cacheName,id:this._getId(e)},n=await this.getDb(),s=n.transaction(j,"readwrite",{durability:"relaxed"});await s.store.put(i),await s.done}async getTimestamp(e){let t=await this.getDb(),i=await t.get(j,this._getId(e));return null==i?void 0:i.timestamp}async expireEntries(e,t){let i=await this.getDb(),n=await i.transaction(j).store.index("timestamp").openCursor(null,"prev"),s=[],o=0;for(;n;){let i=n.value;i.cacheName===this._cacheName&&(e&&i.timestamp<e||t&&o>=t?s.push(n.value):o++),n=await n.continue()}let l=[];for(let e of s)await i.delete(j,e.id),l.push(e.url);return l}_getId(e){return this._cacheName+"|"+normalizeURL(e)}async getDb(){return this._db||(this._db=await openDB("workbox-expiration",1,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}};let CacheExpiration=class CacheExpiration{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new CacheTimestampsModel(e)}async expireEntries(){if(this._isRunning){this._rerunRequested=!0;return}this._isRunning=!0;let e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),i=await self.caches.open(this._cacheName);for(let e of t)await i.delete(e,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,dontWaitFor(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(!this._maxAgeSeconds)return!1;{let t=await this._timestampModel.getTimestamp(e),i=Date.now()-1e3*this._maxAgeSeconds;return void 0===t||t<i}}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}};let ExpirationPlugin=class ExpirationPlugin{constructor(e={}){this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:i,cachedResponse:n})=>{if(!n)return null;let s=this._isResponseDateFresh(n),o=this._getCacheExpiration(i);dontWaitFor(o.expireEntries());let l=o.updateTimestamp(t.url);if(e)try{e.waitUntil(l)}catch(e){}return s?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{let i=this._getCacheExpiration(e);await i.updateTimestamp(t.url),await i.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&registerQuotaErrorCallback(()=>this.deleteCacheAndMetadata())}_getCacheExpiration(e){if(e===h.getRuntimeName())throw new WorkboxError_WorkboxError("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new CacheExpiration(e,this._config),this._cacheExpirations.set(e,t)),t}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;let t=this._getDateHeaderTimestamp(e);if(null===t)return!0;let i=Date.now();return t>=i-1e3*this._maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;let t=e.headers.get("date"),i=new Date(t),n=i.getTime();return isNaN(n)?null:n}async deleteCacheAndMetadata(){for(let[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}};function toRequest(e){return"string"==typeof e?new Request(e):e}__webpack_require__(873);let StrategyHandler=class StrategyHandler{constructor(e,t){for(let i of(this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new Deferred,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map,this._plugins))this._pluginStateMap.set(i,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){let{event:t}=this,i=toRequest(e);if("navigate"===i.mode&&t instanceof FetchEvent&&t.preloadResponse){let e=await t.preloadResponse;if(e)return e}let n=this.hasCallback("fetchDidFail")?i.clone():null;try{for(let e of this.iterateCallbacks("requestWillFetch"))i=await e({request:i.clone(),event:t})}catch(e){if(e instanceof Error)throw new WorkboxError_WorkboxError("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}let s=i.clone();try{let e;for(let n of(e=await fetch(i,"navigate"===i.mode?void 0:this._strategy.fetchOptions),this.iterateCallbacks("fetchDidSucceed")))e=await n({event:t,request:s,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:n.clone(),request:s.clone()}),e}}async fetchAndCachePut(e){let t=await this.fetch(e),i=t.clone();return this.waitUntil(this.cachePut(e,i)),t}async cacheMatch(e){let t;let i=toRequest(e),{cacheName:n,matchOptions:s}=this._strategy,o=await this.getCacheKey(i,"read"),l=Object.assign(Object.assign({},s),{cacheName:n});for(let e of(t=await caches.match(o,l),this.iterateCallbacks("cachedResponseWillBeUsed")))t=await e({cacheName:n,matchOptions:s,cachedResponse:t,request:o,event:this.event})||void 0;return t}async cachePut(e,t){let i=toRequest(e);await timeout_timeout(0);let n=await this.getCacheKey(i,"write");if(!t)throw new WorkboxError_WorkboxError("cache-put-with-no-response",{url:getFriendlyURL(n.url)});let s=await this._ensureResponseSafeToCache(t);if(!s)return!1;let{cacheName:o,matchOptions:l}=this._strategy,h=await self.caches.open(o),u=this.hasCallback("cacheDidUpdate"),d=u?await cacheMatchIgnoreParams(h,n.clone(),["__WB_REVISION__"],l):null;try{await h.put(n,u?s.clone():s)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await executeQuotaErrorCallbacks(),e}for(let e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:o,oldResponse:d,newResponse:s.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){let i=`${e.url} | ${t}`;if(!this._cacheKeys[i]){let n=e;for(let e of this.iterateCallbacks("cacheKeyWillBeUsed"))n=toRequest(await e({mode:t,request:n,event:this.event,params:this.params}));this._cacheKeys[i]=n}return this._cacheKeys[i]}hasCallback(e){for(let t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(let i of this.iterateCallbacks(e))await i(t)}*iterateCallbacks(e){for(let t of this._strategy.plugins)if("function"==typeof t[e]){let i=this._pluginStateMap.get(t),statefulCallback=n=>{let s=Object.assign(Object.assign({},n),{state:i});return t[e](s)};yield statefulCallback}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,i=!1;for(let e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,i=!0,!t)break;return!i&&t&&200!==t.status&&(t=void 0),t}};let Strategy_Strategy=class Strategy_Strategy{constructor(e={}){this.cacheName=h.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){let[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});let t=e.event,i="string"==typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,s=new StrategyHandler(this,{event:t,request:i,params:n}),o=this._getResponse(s,i,t),l=this._awaitComplete(o,s,i,t);return[o,l]}async _getResponse(e,t,i){let n;await e.runCallbacks("handlerWillStart",{event:i,request:t});try{if(!(n=await this._handle(t,e))||"error"===n.type)throw new WorkboxError_WorkboxError("no-response",{url:t.url})}catch(s){if(s instanceof Error){for(let o of e.iterateCallbacks("handlerDidError"))if(n=await o({error:s,event:i,request:t}))break}if(n);else throw s}for(let s of e.iterateCallbacks("handlerWillRespond"))n=await s({event:i,request:t,response:n});return n}async _awaitComplete(e,t,i,n){let s,o;try{s=await e}catch(e){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:i,response:s}),await t.doneWaiting()}catch(e){e instanceof Error&&(o=e)}if(await t.runCallbacks("handlerDidComplete",{event:n,request:i,response:s,error:o}),t.destroy(),o)throw o}};let CacheFirst=class CacheFirst extends Strategy_Strategy{async _handle(e,t){let i,n=await t.cacheMatch(e);if(!n)try{n=await t.fetchAndCachePut(e)}catch(e){e instanceof Error&&(i=e)}if(!n)throw new WorkboxError_WorkboxError("no-response",{url:e.url,error:i});return n}};let V={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let NetworkFirst=class NetworkFirst extends Strategy_Strategy{constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(V),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let i;let n=[],s=[];if(this._networkTimeoutSeconds){let{id:o,promise:l}=this._getTimeoutPromise({request:e,logs:n,handler:t});i=o,s.push(l)}let o=this._getNetworkPromise({timeoutId:i,request:e,logs:n,handler:t});s.push(o);let l=await t.waitUntil((async()=>await t.waitUntil(Promise.race(s))||await o)());if(!l)throw new WorkboxError_WorkboxError("no-response",{url:e.url});return l}_getTimeoutPromise({request:e,logs:t,handler:i}){let n;let s=new Promise(t=>{let onNetworkTimeout=async()=>{t(await i.cacheMatch(e))};n=setTimeout(onNetworkTimeout,1e3*this._networkTimeoutSeconds)});return{promise:s,id:n}}async _getNetworkPromise({timeoutId:e,request:t,logs:i,handler:n}){let s,o;try{o=await n.fetchAndCachePut(t)}catch(e){e instanceof Error&&(s=e)}return e&&clearTimeout(e),(s||!o)&&(o=await n.cacheMatch(t)),o}};let NetworkOnly=class NetworkOnly extends Strategy_Strategy{constructor(e={}){super(e),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let i,n;try{let n=[t.fetch(e)];if(this._networkTimeoutSeconds){let e=timeout_timeout(1e3*this._networkTimeoutSeconds);n.push(e)}if(!(i=await Promise.race(n)))throw Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`)}catch(e){e instanceof Error&&(n=e)}if(!i)throw new WorkboxError_WorkboxError("no-response",{url:e.url,error:n});return i}};let StaleWhileRevalidate=class StaleWhileRevalidate extends Strategy_Strategy{constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(V)}async _handle(e,t){let i;let n=t.fetchAndCachePut(e).catch(()=>{});t.waitUntil(n);let s=await t.cacheMatch(e);if(s);else try{s=await n}catch(e){e instanceof Error&&(i=e)}if(!s)throw new WorkboxError_WorkboxError("no-response",{url:e.url,error:i});return s}};__webpack_require__(80);let normalizeHandler=e=>e&&"object"==typeof e?e:{handle:e};let Route_Route=class Route_Route{constructor(e,t,i="GET"){this.handler=normalizeHandler(t),this.match=e,this.method=i}setCatchHandler(e){this.catchHandler=normalizeHandler(e)}};let RegExpRoute=class RegExpRoute extends Route_Route{constructor(e,t,i){super(({url:t})=>{let i=e.exec(t.href);if(i&&(t.origin===location.origin||0===i.index))return i.slice(1)},t,i)}};let Router=class Router{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{let{request:t}=e,i=this.handleRequest({request:t,event:e});i&&e.respondWith(i)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){let{payload:t}=e.data,i=Promise.all(t.urlsToCache.map(t=>{"string"==typeof t&&(t=[t]);let i=new Request(...t);return this.handleRequest({request:i,event:e})}));e.waitUntil(i),e.ports&&e.ports[0]&&i.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){let i;let n=new URL(e.url,location.href);if(!n.protocol.startsWith("http"))return;let s=n.origin===location.origin,{params:o,route:l}=this.findMatchingRoute({event:t,request:e,sameOrigin:s,url:n}),h=l&&l.handler,u=e.method;if(!h&&this._defaultHandlerMap.has(u)&&(h=this._defaultHandlerMap.get(u)),!h)return;try{i=h.handle({url:n,request:e,event:t,params:o})}catch(e){i=Promise.reject(e)}let d=l&&l.catchHandler;return i instanceof Promise&&(this._catchHandler||d)&&(i=i.catch(async i=>{if(d)try{return await d.handle({url:n,request:e,event:t,params:o})}catch(e){e instanceof Error&&(i=e)}if(this._catchHandler)return this._catchHandler.handle({url:n,request:e,event:t});throw i})),i}findMatchingRoute({url:e,sameOrigin:t,request:i,event:n}){let s=this._routes.get(i.method)||[];for(let o of s){let s;let l=o.match({url:e,sameOrigin:t,request:i,event:n});if(l)return Array.isArray(s=l)&&0===s.length?s=void 0:l.constructor===Object&&0===Object.keys(l).length?s=void 0:"boolean"==typeof l&&(s=void 0),{route:o,params:s}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,normalizeHandler(e))}setCatchHandler(e){this._catchHandler=normalizeHandler(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new WorkboxError_WorkboxError("unregister-route-but-not-found-with-method",{method:e.method});let t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new WorkboxError_WorkboxError("unregister-route-route-not-registered")}};let getOrCreateDefaultRouter=()=>(n||((n=new Router).addFetchListener(),n.addCacheListener()),n);function registerRoute(e,t,i){let n;if("string"==typeof e){let s=new URL(e,location.href);n=new Route_Route(({url:e})=>e.href===s.href,t,i)}else if(e instanceof RegExp)n=new RegExpRoute(e,t,i);else if("function"==typeof e)n=new Route_Route(e,t,i);else if(e instanceof Route_Route)n=e;else throw new WorkboxError_WorkboxError("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});let s=getOrCreateDefaultRouter();return s.registerRoute(n),n}function setCatchHandler(e){let t=getOrCreateDefaultRouter();t.setCatchHandler(e)}function setDefaultHandler(e){let t=getOrCreateDefaultRouter();t.setDefaultHandler(e)}function createCacheKey(e){if(!e)throw new WorkboxError_WorkboxError("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){let t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}let{revision:t,url:i}=e;if(!i)throw new WorkboxError_WorkboxError("add-to-cache-list-unexpected-type",{entry:e});if(!t){let e=new URL(i,location.href);return{cacheKey:e.href,url:e.href}}let n=new URL(i,location.href),s=new URL(i,location.href);return n.searchParams.set("__WB_REVISION__",t),{cacheKey:n.href,url:s.href}}__webpack_require__(977);let PrecacheInstallReportPlugin=class PrecacheInstallReportPlugin{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:i})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){let e=t.originalRequest.url;i?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return i}}};let PrecacheCacheKeyPlugin=class PrecacheCacheKeyPlugin{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{let i=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return i?new Request(i,{headers:e.headers}):e},this._precacheController=e}};let PrecacheStrategy=class PrecacheStrategy extends Strategy_Strategy{constructor(e={}){e.cacheName=h.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(PrecacheStrategy.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){let i=await t.cacheMatch(e);return i||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let i;let n=t.params||{};if(this._fallbackToNetwork){let s=n.integrity,o=e.integrity;i=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?o||s:void 0})),s&&(!o||o===s)&&"no-cors"!==e.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,i.clone()))}else throw new WorkboxError_WorkboxError("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return i}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();let i=await t.fetch(e),n=await t.cachePut(e,i.clone());if(!n)throw new WorkboxError_WorkboxError("bad-precaching-response",{url:e.url,status:i.status});return i}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(let[i,n]of this.plugins.entries())n!==PrecacheStrategy.copyRedirectedCacheableResponsesPlugin&&(n===PrecacheStrategy.defaultPrecacheCacheabilityPlugin&&(e=i),n.cacheWillUpdate&&t++);0===t?this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}};PrecacheStrategy.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},PrecacheStrategy.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await copyResponse(e):e};let PrecacheController=class PrecacheController{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:i=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new PrecacheStrategy({cacheName:h.getPrecacheName(e),plugins:[...t,new PrecacheCacheKeyPlugin({precacheController:this})],fallbackToNetwork:i}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){let t=[];for(let i of e){"string"==typeof i?t.push(i):i&&void 0===i.revision&&t.push(i.url);let{cacheKey:e,url:n}=createCacheKey(i),s="string"!=typeof i&&i.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new WorkboxError_WorkboxError("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!=typeof i&&i.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==i.integrity)throw new WorkboxError_WorkboxError("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,i.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,s),t.length>0){let e=`Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return waitUntil(e,async()=>{let t=new PrecacheInstallReportPlugin;for(let[i,n]of(this.strategy.plugins.push(t),this._urlsToCacheKeys)){let t=this._cacheKeysToIntegrities.get(n),s=this._urlsToCacheModes.get(i),o=new Request(i,{integrity:t,cache:s,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:n},request:o,event:e}))}let{updatedURLs:i,notUpdatedURLs:n}=t;return{updatedURLs:i,notUpdatedURLs:n}})}activate(e){return waitUntil(e,async()=>{let e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),i=new Set(this._urlsToCacheKeys.values()),n=[];for(let s of t)i.has(s.url)||(await e.delete(s),n.push(s.url));return{deletedURLs:n}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){let t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){let t=e instanceof Request?e.url:e,i=this.getCacheKeyForURL(t);if(i){let e=await self.caches.open(this.strategy.cacheName);return e.match(i)}}createHandlerBoundToURL(e){let t=this.getCacheKeyForURL(e);if(!t)throw new WorkboxError_WorkboxError("non-precached-url",{url:e});return i=>(i.request=new Request(e),i.params=Object.assign({cacheKey:t},i.params),this.strategy.handle(i))}};let getOrCreatePrecacheController_getOrCreatePrecacheController=()=>(s||(s=new PrecacheController),s);function removeIgnoredSearchParams(e,t=[]){for(let i of[...e.searchParams.keys()])t.some(e=>e.test(i))&&e.searchParams.delete(i);return e}function*generateURLVariations(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:i="index.html",cleanURLs:n=!0,urlManipulation:s}={}){let o=new URL(e,location.href);o.hash="",yield o.href;let l=removeIgnoredSearchParams(o,t);if(yield l.href,i&&l.pathname.endsWith("/")){let e=new URL(l.href);e.pathname+=i,yield e.href}if(n){let e=new URL(l.href);e.pathname+=".html",yield e.href}if(s){let e=s({url:o});for(let t of e)yield t.href}}let PrecacheRoute=class PrecacheRoute extends Route_Route{constructor(e,t){super(({request:i})=>{let n=e.getURLsToCacheKeys();for(let s of generateURLVariations(i.url,t)){let t=n.get(s);if(t){let i=e.getIntegrityForCacheKey(t);return{cacheKey:t,integrity:i}}}},e.strategy)}};function addRoute(e){let t=getOrCreatePrecacheController_getOrCreatePrecacheController(),i=new PrecacheRoute(t,e);registerRoute(i)}let z="-precache-",deleteOutdatedCaches=async(e,t=z)=>{let i=await self.caches.keys(),n=i.filter(i=>i.includes(t)&&i.includes(self.registration.scope)&&i!==e);return await Promise.all(n.map(e=>self.caches.delete(e))),n};function cleanupOutdatedCaches(){self.addEventListener("activate",e=>{let t=h.getPrecacheName();e.waitUntil(deleteOutdatedCaches(t).then(e=>{}))})}function matchPrecache(e){let t=getOrCreatePrecacheController_getOrCreatePrecacheController();return t.matchPrecache(e)}function precache(e){let t=getOrCreatePrecacheController_getOrCreatePrecacheController();t.precache(e)}function precacheAndRoute(e,t){precache(e),addRoute(t)}__webpack_require__(895);let CacheableResponse=class CacheableResponse{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some(t=>e.headers.get(t)===this._headers[t])),t}};let CacheableResponsePlugin=class CacheableResponsePlugin{constructor(e){this.cacheWillUpdate=async({response:e})=>this._cacheableResponse.isResponseCacheable(e)?e:null,this._cacheableResponse=new CacheableResponse(e)}};var $,ee,et,er,ei,en,es=__webpack_require__(155);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let stringToByteArray$1=function(e){let t=[],i=0;for(let n=0;n<e.length;n++){let s=e.charCodeAt(n);s<128?t[i++]=s:(s<2048?t[i++]=s>>6|192:((64512&s)==55296&&n+1<e.length&&(64512&e.charCodeAt(n+1))==56320?(s=65536+((1023&s)<<10)+(1023&e.charCodeAt(++n)),t[i++]=s>>18|240,t[i++]=s>>12&63|128):t[i++]=s>>12|224,t[i++]=s>>6&63|128),t[i++]=63&s|128)}return t},byteArrayToString=function(e){let t=[],i=0,n=0;for(;i<e.length;){let s=e[i++];if(s<128)t[n++]=String.fromCharCode(s);else if(s>191&&s<224){let o=e[i++];t[n++]=String.fromCharCode((31&s)<<6|63&o)}else if(s>239&&s<365){let o=e[i++],l=e[i++],h=e[i++],u=((7&s)<<18|(63&o)<<12|(63&l)<<6|63&h)-65536;t[n++]=String.fromCharCode(55296+(u>>10)),t[n++]=String.fromCharCode(56320+(1023&u))}else{let o=e[i++],l=e[i++];t[n++]=String.fromCharCode((15&s)<<12|(63&o)<<6|63&l)}}return t.join("")},eo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let i=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let t=0;t<e.length;t+=3){let s=e[t],o=t+1<e.length,l=o?e[t+1]:0,h=t+2<e.length,u=h?e[t+2]:0,d=s>>2,f=(3&s)<<4|l>>4,g=(15&l)<<2|u>>6,m=63&u;h||(m=64,o||(g=64)),n.push(i[d],i[f],i[g],i[m])}return n.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(stringToByteArray$1(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):byteArrayToString(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let i=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let t=0;t<e.length;){let s=i[e.charAt(t++)],o=t<e.length,l=o?i[e.charAt(t)]:0;++t;let h=t<e.length,u=h?i[e.charAt(t)]:64;++t;let d=t<e.length,f=d?i[e.charAt(t)]:64;if(++t,null==s||null==l||null==u||null==f)throw new DecodeBase64StringError;let g=s<<2|l>>4;if(n.push(g),64!==u){let e=l<<4&240|u>>2;if(n.push(e),64!==f){let e=u<<6&192|f;n.push(e)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};let DecodeBase64StringError=class DecodeBase64StringError extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}};let base64Encode=function(e){let t=stringToByteArray$1(e);return eo.encodeByteArray(t,!0)},base64urlEncodeWithoutPadding=function(e){return base64Encode(e).replace(/\./g,"")},base64Decode=function(e){try{return eo.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getGlobal(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==__webpack_require__.g)return __webpack_require__.g;throw Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let getDefaultsFromGlobal=()=>getGlobal().__FIREBASE_DEFAULTS__,getDefaultsFromEnvVariable=()=>{if(void 0===es||void 0===es.env)return;let e=es.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},getDefaultsFromCookie=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&base64Decode(e[1]);return t&&JSON.parse(t)},getDefaults=()=>{try{return getDefaultsFromGlobal()||getDefaultsFromEnvVariable()||getDefaultsFromCookie()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},getDefaultEmulatorHost=e=>{var t,i;return null===(i=null===(t=getDefaults())||void 0===t?void 0:t.emulatorHosts)||void 0===i?void 0:i[e]},getDefaultEmulatorHostnameAndPort=e=>{let t=getDefaultEmulatorHost(e);if(!t)return;let i=t.lastIndexOf(":");if(i<=0||i+1===t.length)throw Error(`Invalid host ${t} with no separate hostname and port!`);let n=parseInt(t.substring(i+1),10);return"["===t[0]?[t.substring(1,i-1),n]:[t.substring(0,i),n]},getDefaultAppConfig=()=>{var e;return null===(e=getDefaults())||void 0===e?void 0:e.config},getExperimentalSetting=e=>{var t;return null===(t=getDefaults())||void 0===t?void 0:t[`_${e}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_Deferred=class index_esm2017_Deferred{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,i))}}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function createMockUserToken(e,t){if(e.uid)throw Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let i=t||"demo-project",n=e.iat||0,s=e.sub||e.user_id;if(!s)throw Error("mockUserToken must contain 'sub' or 'user_id' field!");let o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:n,exp:n+3600,auth_time:n,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},e);return[base64urlEncodeWithoutPadding(JSON.stringify({alg:"none",type:"JWT"})),base64urlEncodeWithoutPadding(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm2017_getUA(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function isMobileCordova(){return"undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(index_esm2017_getUA())}function isBrowserExtension(){let e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}function isReactNative(){return"object"==typeof navigator&&"ReactNative"===navigator.product}function isIE(){let e=index_esm2017_getUA();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function index_esm2017_isIndexedDBAvailable(){try{return"object"==typeof indexedDB}catch(e){return!1}}function validateIndexedDBOpenable(){return new Promise((e,t)=>{try{let i=!0,n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),i||self.indexedDB.deleteDatabase(n),e(!0)},s.onupgradeneeded=()=>{i=!1},s.onerror=()=>{var e;t((null===(e=s.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}})}let FirebaseError=class FirebaseError extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name="FirebaseError",Object.setPrototypeOf(this,FirebaseError.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ErrorFactory.prototype.create)}};let ErrorFactory=class ErrorFactory{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){let i=t[0]||{},n=`${this.service}/${e}`,s=this.errors[e],o=s?replaceTemplate(s,i):"Error",l=`${this.serviceName}: ${o} (${n}).`,h=new FirebaseError(n,l,i);return h}};function replaceTemplate(e,t){return e.replace(el,(e,i)=>{let n=t[i];return null!=n?String(n):`<${i}?>`})}let el=/\{\$([^}]+)}/g;function isEmpty(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function index_esm2017_deepEqual(e,t){if(e===t)return!0;let i=Object.keys(e),n=Object.keys(t);for(let s of i){if(!n.includes(s))return!1;let i=e[s],o=t[s];if(isObject(i)&&isObject(o)){if(!index_esm2017_deepEqual(i,o))return!1}else if(i!==o)return!1}for(let e of n)if(!i.includes(e))return!1;return!0}function isObject(e){return null!==e&&"object"==typeof e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm2017_querystring(e){let t=[];for(let[i,n]of Object.entries(e))Array.isArray(n)?n.forEach(e=>{t.push(encodeURIComponent(i)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(i)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function querystringDecode(e){let t={},i=e.replace(/^\?/,"").split("&");return i.forEach(e=>{if(e){let[i,n]=e.split("=");t[decodeURIComponent(i)]=decodeURIComponent(n)}}),t}function extractQuerystring(e){let t=e.indexOf("?");if(!t)return"";let i=e.indexOf("#",t);return e.substring(t,i>0?i:void 0)}function createSubscribe(e,t){let i=new ObserverProxy(e,t);return i.subscribe.bind(i)}let ObserverProxy=class ObserverProxy{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let n;if(void 0===e&&void 0===t&&void 0===i)throw Error("Missing Observer.");void 0===(n=implementsAnyMethods(e,["next","error","complete"])?e:{next:e,error:t,complete:i}).next&&(n.next=noop),void 0===n.error&&(n.error=noop),void 0===n.complete&&(n.complete=noop);let s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?n.error(this.finalError):n.complete()}catch(e){}}),this.observers.push(n),s}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function implementsAnyMethods(e,t){if("object"!=typeof e||null===e)return!1;for(let i of t)if(i in e&&"function"==typeof e[i])return!0;return!1}function noop(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm2017_getModularInstance(e){return e&&e._delegate?e._delegate:e}let Component=class Component{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eh="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Provider=class Provider{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new index_esm2017_Deferred;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:t});i&&e.resolve(i)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let i=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(e){if(n)return null;throw e}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(isComponentEager(e))try{this.getOrInitializeService({instanceIdentifier:eh})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:i});t.resolve(e)}catch(e){}}}}clearInstance(e=eh){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=eh){return this.instances.has(e)}getOptions(e=eh){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let n=this.getOrInitializeService({instanceIdentifier:i,options:t});for(let[e,t]of this.instancesDeferred.entries()){let s=this.normalizeInstanceIdentifier(e);i===s&&t.resolve(n)}return n}onInit(e,t){var i;let n=this.normalizeInstanceIdentifier(t),s=null!==(i=this.onInitCallbacks.get(n))&&void 0!==i?i:new Set;s.add(e),this.onInitCallbacks.set(n,s);let o=this.instances.get(n);return o&&e(o,n),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){let i=this.onInitCallbacks.get(t);if(i)for(let n of i)try{n(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:normalizeIdentifierForFactory(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch(e){}return i||null}normalizeInstanceIdentifier(e=eh){return this.component?this.component.multipleInstances?e:eh:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}};function normalizeIdentifierForFactory(e){return e===eh?void 0:e}function isComponentEager(e){return"EAGER"===e.instantiationMode}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ComponentContainer=class ComponentContainer{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){let t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Provider(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ec=[];(eP=eR||(eR={}))[eP.DEBUG=0]="DEBUG",eP[eP.VERBOSE=1]="VERBOSE",eP[eP.INFO=2]="INFO",eP[eP.WARN=3]="WARN",eP[eP.ERROR=4]="ERROR",eP[eP.SILENT=5]="SILENT";let eu={debug:eR.DEBUG,verbose:eR.VERBOSE,info:eR.INFO,warn:eR.WARN,error:eR.ERROR,silent:eR.SILENT},ep=eR.INFO,ef={[eR.DEBUG]:"log",[eR.VERBOSE]:"log",[eR.INFO]:"info",[eR.WARN]:"warn",[eR.ERROR]:"error"},defaultLogHandler=(e,t,...i)=>{if(t<e.logLevel)return;let n=new Date().toISOString(),s=ef[t];if(s)console[s](`[${n}]  ${e.name}:`,...i);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)};let Logger=class Logger{constructor(e){this.name=e,this._logLevel=ep,this._logHandler=defaultLogHandler,this._userLogHandler=null,ec.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in eR))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?eu[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,eR.DEBUG,...e),this._logHandler(this,eR.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,eR.VERBOSE,...e),this._logHandler(this,eR.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,eR.INFO,...e),this._logHandler(this,eR.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,eR.WARN,...e),this._logHandler(this,eR.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,eR.ERROR,...e),this._logHandler(this,eR.ERROR,...e)}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PlatformLoggerServiceImpl=class PlatformLoggerServiceImpl{constructor(e){this.container=e}getPlatformInfoString(){let e=this.container.getProviders();return e.map(e=>{if(!isVersionServiceProvider(e))return null;{let t=e.getImmediate();return`${t.library}/${t.version}`}}).filter(e=>e).join(" ")}};function isVersionServiceProvider(e){let t=e.getComponent();return(null==t?void 0:t.type)==="VERSION"}let eg="@firebase/app",em="0.9.17",e_=new Logger("@firebase/app"),ey="[DEFAULT]",ev={[eg]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","fire-js":"fire-js",firebase:"fire-js-all"},ew=new Map,eE=new Map;function _addComponent(e,t){try{e.container.addComponent(t)}catch(i){e_.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,i)}}function _registerComponent(e){let t=e.name;if(eE.has(t))return e_.debug(`There were multiple attempts to register component ${t}.`),!1;for(let i of(eE.set(t,e),ew.values()))_addComponent(i,e);return!0}function index_esm2017_getProvider(e,t){let i=e.container.getProvider("heartbeat").getImmediate({optional:!0});return i&&i.triggerHeartbeat(),e.container.getProvider(t)}let eI=new ErrorFactory("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FirebaseAppImpl=class FirebaseAppImpl{constructor(e,t,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Component("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw eI.create("app-deleted",{appName:this._name})}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eT="10.3.0";function initializeApp(e,t={}){let i=e;if("object"!=typeof t){let e=t;t={name:e}}let n=Object.assign({name:ey,automaticDataCollectionEnabled:!1},t),s=n.name;if("string"!=typeof s||!s)throw eI.create("bad-app-name",{appName:String(s)});if(i||(i=getDefaultAppConfig()),!i)throw eI.create("no-options");let o=ew.get(s);if(o){if(index_esm2017_deepEqual(i,o.options)&&index_esm2017_deepEqual(n,o.config))return o;throw eI.create("duplicate-app",{appName:s})}let l=new ComponentContainer(s);for(let e of eE.values())l.addComponent(e);let h=new FirebaseAppImpl(i,n,l);return ew.set(s,h),h}function getApp(e=ey){let t=ew.get(e);if(!t&&e===ey&&getDefaultAppConfig())return initializeApp();if(!t)throw eI.create("no-app",{appName:e});return t}function registerVersion(e,t,i){var n;let s=null!==(n=ev[e])&&void 0!==n?n:e;i&&(s+=`-${i}`);let o=s.match(/\s|\//),l=t.match(/\s|\//);if(o||l){let e=[`Unable to register library "${s}" with version "${t}":`];o&&e.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&l&&e.push("and"),l&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),e_.warn(e.join(" "));return}_registerComponent(new Component(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}let eS="firebase-heartbeat-store",eA=null;function getDbPromise(){return eA||(eA=openDB("firebase-heartbeat-database",1,{upgrade:(e,t)=>{0===t&&e.createObjectStore(eS)}}).catch(e=>{throw eI.create("idb-open",{originalErrorMessage:e.message})})),eA}async function readHeartbeatsFromIndexedDB(e){try{let t=await getDbPromise(),i=await t.transaction(eS).objectStore(eS).get(computeKey(e));return i}catch(e){if(e instanceof FirebaseError)e_.warn(e.message);else{let t=eI.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});e_.warn(t.message)}}}async function writeHeartbeatsToIndexedDB(e,t){try{let i=await getDbPromise(),n=i.transaction(eS,"readwrite"),s=n.objectStore(eS);await s.put(t,computeKey(e)),await n.done}catch(e){if(e instanceof FirebaseError)e_.warn(e.message);else{let t=eI.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});e_.warn(t.message)}}}function computeKey(e){return`${e.name}!${e.options.appId}`}let HeartbeatServiceImpl=class HeartbeatServiceImpl{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new HeartbeatStorageImpl(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){let e=this.container.getProvider("platform-logger").getImmediate(),t=e.getPlatformInfoString(),i=getUTCDateString();return(null===this._heartbeatsCache&&(this._heartbeatsCache=await this._heartbeatsCachePromise),this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(e=>e.date===i))?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:t}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{let t=new Date(e.date).valueOf(),i=Date.now();return i-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache))}async getHeartbeatsHeader(){if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null===this._heartbeatsCache||0===this._heartbeatsCache.heartbeats.length)return"";let e=getUTCDateString(),{heartbeatsToSend:t,unsentEntries:i}=extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats),n=base64urlEncodeWithoutPadding(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),n}};function getUTCDateString(){let e=new Date;return e.toISOString().substring(0,10)}function extractHeartbeatsForHeader(e,t=1024){let i=[],n=e.slice();for(let s of e){let e=i.find(e=>e.agent===s.agent);if(e){if(e.dates.push(s.date),countBytes(i)>t){e.dates.pop();break}}else if(i.push({agent:s.agent,dates:[s.date]}),countBytes(i)>t){i.pop();break}n=n.slice(1)}return{heartbeatsToSend:i,unsentEntries:n}}let HeartbeatStorageImpl=class HeartbeatStorageImpl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!index_esm2017_isIndexedDBAvailable()&&validateIndexedDBOpenable().then(()=>!0).catch(()=>!1)}async read(){let e=await this._canUseIndexedDBPromise;if(!e)return{heartbeats:[]};{let e=await readHeartbeatsFromIndexedDB(this.app);return e||{heartbeats:[]}}}async overwrite(e){var t;let i=await this._canUseIndexedDBPromise;if(i){let i=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;let i=await this._canUseIndexedDBPromise;if(i){let i=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}}};function countBytes(e){return base64urlEncodeWithoutPadding(JSON.stringify({version:2,heartbeats:e})).length}_registerComponent(new Component("platform-logger",e=>new PlatformLoggerServiceImpl(e),"PRIVATE")),_registerComponent(new Component("heartbeat",e=>new HeartbeatServiceImpl(e),"PRIVATE")),registerVersion(eg,em,""),registerVersion(eg,em,"esm2017"),registerVersion("fire-js",""),/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */registerVersion("firebase","10.3.0","app");var eP,eR,eC,ek="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},eO={},eN=eN||{},eD=ek||self;function aa(e){var t=typeof e;return"array"==(t="object"!=t?t:e?Array.isArray(e)?"array":t:"null")||"object"==t&&"number"==typeof e.length}function p(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function ea(e,t,i){return e.call.apply(e.bind,arguments)}function fa(e,t,i){if(!e)throw Error();if(2<arguments.length){var n=Array.prototype.slice.call(arguments,2);return function(){var i=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(i,n),e.apply(t,i)}}return function(){return e.apply(t,arguments)}}function q(e,t,i){return(q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:fa).apply(null,arguments)}function ha(e,t){var i=Array.prototype.slice.call(arguments,1);return function(){var t=i.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function r(e,t){function c(){}c.prototype=t.prototype,e.$=t.prototype,e.prototype=new c,e.prototype.constructor=e,e.ac=function(e,i,n){for(var s=Array(arguments.length-2),o=2;o<arguments.length;o++)s[o-2]=arguments[o];return t.prototype[i].apply(e,s)}}function v(){this.s=this.s,this.o=this.o}v.prototype.s=!1,v.prototype.sa=function(){this.s||(this.s=!0,this.N())},v.prototype.N=function(){if(this.o)for(;this.o.length;)this.o.shift()()};let eL=Array.prototype.indexOf?function(e,t){return Array.prototype.indexOf.call(e,t,void 0)}:function(e,t){if("string"==typeof e)return"string"!=typeof t||1!=t.length?-1:e.indexOf(t,0);for(let i=0;i<e.length;i++)if(i in e&&e[i]===t)return i;return -1};function ma(e){let t=e.length;if(0<t){let i=Array(t);for(let n=0;n<t;n++)i[n]=e[n];return i}return[]}function na(e,t){for(let t=1;t<arguments.length;t++){let i=arguments[t];if(aa(i)){let t=e.length||0,n=i.length||0;e.length=t+n;for(let s=0;s<n;s++)e[t+s]=i[s]}else e.push(i)}}function w(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}w.prototype.h=function(){this.defaultPrevented=!0};var ex=function(){if(!eD.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{eD.addEventListener("test",()=>{},t),eD.removeEventListener("test",()=>{},t)}catch(e){}return e}();function x(e){return/^[\s\xa0]*$/.test(e)}function pa(){var e=eD.navigator;return e&&(e=e.userAgent)?e:""}function y(e){return -1!=pa().indexOf(e)}function qa(e){return qa[" "](e),e}function ra(e,t){return Object.prototype.hasOwnProperty.call(tv,e)?tv[e]:tv[e]=t(e)}qa[" "]=function(){};var eM=y("Opera"),eU=y("Trident")||y("MSIE"),eF=y("Edge"),ej=eF||eU,eV=y("Gecko")&&!(-1!=pa().toLowerCase().indexOf("webkit")&&!y("Edge"))&&!(y("Trident")||y("MSIE"))&&!y("Edge"),eB=-1!=pa().toLowerCase().indexOf("webkit")&&!y("Edge");function ya(){var e=eD.document;return e?e.documentMode:void 0}e:{var eW,eH="",ez=(eW=pa(),eV?/rv:([^\);]+)(\)|;)/.exec(eW):eF?/Edge\/([\d\.]+)/.exec(eW):eU?/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(eW):eB?/WebKit\/(\S+)/.exec(eW):eM?/(?:Version)[ \/]?(\S+)/.exec(eW):void 0);if(ez&&(eH=ez?ez[1]:""),eU){var eq=ya();if(null!=eq&&eq>parseFloat(eH)){ee=String(eq);break e}}ee=eH}var eK=eD.document&&eU&&(ya()||parseInt(ee,10))||void 0;function A(e,t){if(w.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var i=this.type=e.type,n=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(eV){e:{try{qa(t.nodeName);var s=!0;break e}catch(e){}s=!1}s||(t=null)}}else"mouseover"==i?t=e.fromElement:"mouseout"==i&&(t=e.toElement);this.relatedTarget=t,n?(this.clientX=void 0!==n.clientX?n.clientX:n.pageX,this.clientY=void 0!==n.clientY?n.clientY:n.pageY,this.screenX=n.screenX||0,this.screenY=n.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"==typeof e.pointerType?e.pointerType:eG[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&A.$.h.call(this)}}r(A,w);var eG={2:"touch",3:"pen",4:"mouse"};A.prototype.h=function(){A.$.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var e$="closure_listenable_"+(1e6*Math.random()|0),eJ=0;function Ja(e,t,i,n,s){this.listener=e,this.proxy=null,this.src=t,this.type=i,this.capture=!!n,this.la=s,this.key=++eJ,this.fa=this.ia=!1}function Ka(e){e.fa=!0,e.listener=null,e.proxy=null,e.src=null,e.la=null}function Na(e,t,i){for(let n in e)t.call(i,e[n],n,e)}function Oa(e,t){for(let i in e)t.call(void 0,e[i],i,e)}function Pa(e){let t={};for(let i in e)t[i]=e[i];return t}let eX="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ra(e,t){let i,n;for(let t=1;t<arguments.length;t++){for(i in n=arguments[t])e[i]=n[i];for(let t=0;t<eX.length;t++)i=eX[t],Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}}function Sa(e){this.src=e,this.g={},this.h=0}function Ua(e,t){var i=t.type;if(i in e.g){var n,s=e.g[i],o=eL(s,t);(n=0<=o)&&Array.prototype.splice.call(s,o,1),n&&(Ka(t),0==e.g[i].length&&(delete e.g[i],e.h--))}}function Ta(e,t,i,n){for(var s=0;s<e.length;++s){var o=e[s];if(!o.fa&&o.listener==t&&!!i==o.capture&&o.la==n)return s}return -1}Sa.prototype.add=function(e,t,i,n,s){var o=e.toString();(e=this.g[o])||(e=this.g[o]=[],this.h++);var l=Ta(e,t,n,s);return -1<l?(t=e[l],i||(t.ia=!1)):((t=new Ja(t,this.src,o,!!n,s)).ia=i,e.push(t)),t};var eY="closure_lm_"+(1e6*Math.random()|0),eQ={};function Ya(e,t,i,n,s){if(n&&n.once)return Za(e,t,i,n,s);if(Array.isArray(t)){for(var o=0;o<t.length;o++)Ya(e,t[o],i,n,s);return null}return i=$a(i),e&&e[e$]?e.O(t,i,p(n)?!!n.capture:!!n,s):ab(e,t,i,!1,n,s)}function ab(e,t,i,n,s,o){if(!t)throw Error("Invalid event type");var l=p(s)?!!s.capture:!!s,h=bb(e);if(h||(e[eY]=h=new Sa(e)),(i=h.add(t,i,n,l,o)).proxy)return i;if(n=cb(),i.proxy=n,n.src=e,n.listener=i,e.addEventListener)ex||(s=l),void 0===s&&(s=!1),e.addEventListener(t.toString(),n,s);else if(e.attachEvent)e.attachEvent(db(t.toString()),n);else if(e.addListener&&e.removeListener)e.addListener(n);else throw Error("addEventListener and attachEvent are unavailable.");return i}function cb(){function a(t){return e.call(a.src,a.listener,t)}let e=eb;return a}function Za(e,t,i,n,s){if(Array.isArray(t)){for(var o=0;o<t.length;o++)Za(e,t[o],i,n,s);return null}return i=$a(i),e&&e[e$]?e.P(t,i,p(n)?!!n.capture:!!n,s):ab(e,t,i,!0,n,s)}function fb(e,t,i,n,s){if(Array.isArray(t))for(var o=0;o<t.length;o++)fb(e,t[o],i,n,s);else(n=p(n)?!!n.capture:!!n,i=$a(i),e&&e[e$])?(e=e.i,(t=String(t).toString())in e.g&&-1<(i=Ta(o=e.g[t],i,n,s))&&(Ka(o[i]),Array.prototype.splice.call(o,i,1),0==o.length&&(delete e.g[t],e.h--))):e&&(e=bb(e))&&(t=e.g[t.toString()],e=-1,t&&(e=Ta(t,i,n,s)),(i=-1<e?t[e]:null)&&gb(i))}function gb(e){if("number"!=typeof e&&e&&!e.fa){var t=e.src;if(t&&t[e$])Ua(t.i,e);else{var i=e.type,n=e.proxy;t.removeEventListener?t.removeEventListener(i,n,e.capture):t.detachEvent?t.detachEvent(db(i),n):t.addListener&&t.removeListener&&t.removeListener(n),(i=bb(t))?(Ua(i,e),0==i.h&&(i.src=null,t[eY]=null)):Ka(e)}}}function db(e){return e in eQ?eQ[e]:eQ[e]="on"+e}function eb(e,t){if(e.fa)e=!0;else{t=new A(t,this);var i=e.listener,n=e.la||e.src;e.ia&&gb(e),e=i.call(n,t)}return e}function bb(e){return(e=e[eY])instanceof Sa?e:null}var eZ="__closure_events_fn_"+(1e9*Math.random()>>>0);function $a(e){return"function"==typeof e?e:(e[eZ]||(e[eZ]=function(t){return e.handleEvent(t)}),e[eZ])}function B(){v.call(this),this.i=new Sa(this),this.S=this,this.J=null}function C(e,t){var i,n=e.J;if(n)for(i=[];n;n=n.J)i.push(n);if(e=e.S,n=t.type||t,"string"==typeof t)t=new w(t,e);else if(t instanceof w)t.target=t.target||e;else{var s=t;Ra(t=new w(n,e),s)}if(s=!0,i)for(var o=i.length-1;0<=o;o--){var l=t.g=i[o];s=ib(l,n,!0,t)&&s}if(s=ib(l=t.g=e,n,!0,t)&&s,s=ib(l,n,!1,t)&&s,i)for(o=0;o<i.length;o++)s=ib(l=t.g=i[o],n,!1,t)&&s}function ib(e,t,i,n){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();for(var s=!0,o=0;o<t.length;++o){var l=t[o];if(l&&!l.fa&&l.capture==i){var h=l.listener,u=l.la||l.src;l.ia&&Ua(e.i,l),s=!1!==h.call(u,n)&&s}}return s&&!n.defaultPrevented}r(B,v),B.prototype[e$]=!0,B.prototype.removeEventListener=function(e,t,i,n){fb(this,e,t,i,n)},B.prototype.N=function(){if(B.$.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var i=t.g[e],n=0;n<i.length;n++)Ka(i[n]);delete t.g[e],t.h--}}this.J=null},B.prototype.O=function(e,t,i,n){return this.i.add(String(e),t,!1,i,n)},B.prototype.P=function(e,t,i,n){return this.i.add(String(e),t,!0,i,n)};var e0=eD.JSON.stringify;let kb=class kb{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}};function lb(){let e=null;return e4.g&&(e=e4.g,e4.g=e4.g.next,e4.g||(e4.h=null),e.next=null),e}let nb=class nb{constructor(){this.h=this.g=null}add(e,t){let i=e1.get();i.set(e,t),this.h?this.h.next=i:this.g=i,this.h=i}};var e1=new kb(()=>new pb,e=>e.reset());let pb=class pb{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}};function qb(e){var t=1;e=e.split(":");let i=[];for(;0<t&&e.length;)i.push(e.shift()),t--;return e.length&&i.push(e.join(":")),i}function rb(e){eD.setTimeout(()=>{throw e},0)}let e2,e9=!1,e4=new nb,vb=()=>{let e=eD.Promise.resolve(void 0);e2=()=>{e.then(ub)}};var ub=()=>{for(var e;e=lb();){try{e.h.call(e.g)}catch(e){rb(e)}e1.j(e),100>e1.h&&(e1.h++,e.next=e1.g,e1.g=e)}e9=!1};function wb(e,t){B.call(this),this.h=e||1,this.g=t||eD,this.j=q(this.qb,this),this.l=Date.now()}function xb(e){e.ga=!1,e.T&&(e.g.clearTimeout(e.T),e.T=null)}function yb(e,t,i){if("function"==typeof e)i&&(e=q(e,i));else if(e&&"function"==typeof e.handleEvent)e=q(e.handleEvent,e);else throw Error("Invalid listener argument");return 2147483647<Number(t)?-1:eD.setTimeout(e,t||0)}function zb(e){e.g=yb(()=>{e.g=null,e.i&&(e.i=!1,zb(e))},e.j);let t=e.h;e.h=null,e.m.apply(null,t)}r(wb,B),(eC=wb.prototype).ga=!1,eC.T=null,eC.qb=function(){if(this.ga){var e=Date.now()-this.l;0<e&&e<.8*this.h?this.T=this.g.setTimeout(this.j,this.h-e):(this.T&&(this.g.clearTimeout(this.T),this.T=null),C(this,"tick"),this.ga&&(xb(this),this.start()))}},eC.start=function(){this.ga=!0,this.T||(this.T=this.g.setTimeout(this.j,this.h),this.l=Date.now())},eC.N=function(){wb.$.N.call(this),xb(this),delete this.g};let Ab=class Ab extends v{constructor(e,t){super(),this.m=e,this.j=t,this.h=null,this.i=!1,this.g=null}l(e){this.h=arguments,this.g?this.i=!0:zb(this)}N(){super.N(),this.g&&(eD.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}};function Bb(e){v.call(this),this.h=e,this.g={}}r(Bb,v);var e6=[];function Db(e,t,i,n){Array.isArray(i)||(i&&(e6[0]=i.toString()),i=e6);for(var s=0;s<i.length;s++){var o=Ya(t,i[s],n||e.handleEvent,!1,e.h||e);if(!o)break;e.g[o.key]=o}}function Fb(e){Na(e.g,function(e,t){this.g.hasOwnProperty(t)&&gb(e)},e),e.g={}}function Gb(){this.g=!0}function Hb(e,t,i,n,s,o){e.info(function(){if(e.g){if(o)for(var l="",h=o.split("&"),u=0;u<h.length;u++){var d=h[u].split("=");if(1<d.length){var f=d[0];d=d[1];var g=f.split("_");l=2<=g.length&&"type"==g[1]?l+(f+"=")+d+"&":l+(f+"=redacted&")}}else l=null}else l=o;return"XMLHTTP REQ ("+n+") [attempt "+s+"]: "+t+"\n"+i+"\n"+l})}function Ib(e,t,i,n,s,o,l){e.info(function(){return"XMLHTTP RESP ("+n+") [ attempt "+s+"]: "+t+"\n"+i+"\n"+o+" "+l})}function D(e,t,i,n){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+Jb(e,i)+(n?" "+n:"")})}function Kb(e,t){e.info(function(){return"TIMEOUT: "+t})}function Jb(e,t){if(!e.g)return t;if(!t)return null;try{var i=JSON.parse(t);if(i){for(e=0;e<i.length;e++)if(Array.isArray(i[e])){var n=i[e];if(!(2>n.length)){var s=n[1];if(Array.isArray(s)&&!(1>s.length)){var o=s[0];if("noop"!=o&&"stop"!=o&&"close"!=o)for(var l=1;l<s.length;l++)s[l]=""}}}}return e0(i)}catch(e){return t}}Bb.prototype.N=function(){Bb.$.N.call(this),Fb(this)},Bb.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")},Gb.prototype.Ea=function(){this.g=!1},Gb.prototype.info=function(){};var e5={},e7=null;function Mb(){return e7=e7||new B}function Nb(e){w.call(this,e5.Ta,e)}function Ob(e){let t=Mb();C(t,new Nb(t))}function Pb(e,t){w.call(this,e5.STAT_EVENT,e),this.stat=t}function F(e){let t=Mb();C(t,new Pb(t,e))}function Qb(e,t){w.call(this,e5.Ua,e),this.size=t}function Rb(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return eD.setTimeout(function(){e()},t)}e5.Ta="serverreachability",r(Nb,w),e5.STAT_EVENT="statevent",r(Pb,w),e5.Ua="timingevent",r(Qb,w);var e3={NO_ERROR:0,rb:1,Eb:2,Db:3,yb:4,Cb:5,Fb:6,Qa:7,TIMEOUT:8,Ib:9},e8={wb:"complete",Sb:"success",Ra:"error",Qa:"abort",Kb:"ready",Lb:"readystatechange",TIMEOUT:"timeout",Gb:"incrementaldata",Jb:"progress",zb:"downloadprogress",$b:"uploadprogress"};function Ub(){}function Vb(e){return e.h||(e.h=e.i())}function Wb(){}Ub.prototype.h=null;var te={OPEN:"a",vb:"b",Ra:"c",Hb:"d"};function Yb(){w.call(this,"d")}function Zb(){w.call(this,"c")}function ac(){}function bc(e,t,i,n){this.l=e,this.j=t,this.m=i,this.W=n||1,this.U=new Bb(this),this.P=tt,e=ej?125:void 0,this.V=new wb(e),this.I=null,this.i=!1,this.s=this.A=this.v=this.L=this.G=this.Y=this.B=null,this.F=[],this.g=null,this.C=0,this.o=this.u=null,this.ca=-1,this.J=!1,this.O=0,this.M=null,this.ba=this.K=this.aa=this.S=!1,this.h=new dc}function dc(){this.i=null,this.g="",this.h=!1}r(Yb,w),r(Zb,w),r(ac,Ub),ac.prototype.g=function(){return new XMLHttpRequest},ac.prototype.i=function(){return{}},er=new ac;var tt=45e3,tr={},ti={};function gc(e,t,i){e.L=1,e.v=hc(G(t)),e.s=i,e.S=!0,ic(e,null)}function ic(e,t){e.G=Date.now(),jc(e),e.A=G(e.v);var i=e.A,n=e.W;Array.isArray(n)||(n=[String(n)]),kc(i.i,"t",n),e.C=0,i=e.l.J,e.h=new dc,e.g=lc(e.l,i?t:null,!e.s),0<e.O&&(e.M=new Ab(q(e.Pa,e,e.g),e.O)),Db(e.U,e.g,"readystatechange",e.nb),t=e.I?Pa(e.I):{},e.s?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ha(e.A,e.u,e.s,t)):(e.u="GET",e.g.ha(e.A,e.u,null,t)),Ob(),Hb(e.j,e.u,e.A,e.m,e.W,e.s)}function oc(e){return!!e.g&&"GET"==e.u&&2!=e.L&&e.l.Ha}function rc(e,t,i){let n=!0,s;for(;!e.J&&e.C<i.length;)if((s=uc(e,i))==ti){4==t&&(e.o=4,F(14),n=!1),D(e.j,e.m,null,"[Incomplete Response]");break}else if(s==tr){e.o=4,F(15),D(e.j,e.m,i,"[Invalid Chunk]"),n=!1;break}else D(e.j,e.m,s,null),qc(e,s);oc(e)&&s!=ti&&s!=tr&&(e.h.g="",e.C=0),4!=t||0!=i.length||e.h.h||(e.o=1,F(16),n=!1),e.i=e.i&&n,n?0<i.length&&!e.ba&&(e.ba=!0,(t=e.l).g==e&&t.ca&&!t.M&&(t.l.info("Great, no buffering proxy detected. Bytes received: "+i.length),vc(t),t.M=!0,F(11))):(D(e.j,e.m,i,"[Invalid Chunked Response]"),I(e),pc(e))}function uc(e,t){var i=e.C,n=t.indexOf("\n",i);return -1==n?ti:isNaN(i=Number(t.substring(i,n)))?tr:(n+=1)+i>t.length?ti:(t=t.slice(n,n+i),e.C=n+i,t)}function jc(e){e.Y=Date.now()+e.P,wc(e,e.P)}function wc(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=Rb(q(e.lb,e),t)}function nc(e){e.B&&(eD.clearTimeout(e.B),e.B=null)}function pc(e){0==e.l.H||e.J||sc(e.l,e)}function I(e){nc(e);var t=e.M;t&&"function"==typeof t.sa&&t.sa(),e.M=null,xb(e.V),Fb(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.sa())}function qc(e,t){try{var i=e.l;if(0!=i.H&&(i.g==e||xc(i.i,e))){if(!e.K&&xc(i.i,e)&&3==i.H){try{var n=i.Ja.g.parse(t)}catch(e){n=null}if(Array.isArray(n)&&3==n.length){var s=n;if(0==s[0]){e:if(!i.u){if(i.g){if(i.g.G+3e3<e.G)yc(i),zc(i);else break e}Ac(i),F(18)}}else i.Fa=s[1],0<i.Fa-i.V&&37500>s[2]&&i.G&&0==i.A&&!i.v&&(i.v=Rb(q(i.ib,i),6e3));if(1>=Bc(i.i)&&i.oa){try{i.oa()}catch(e){}i.oa=void 0}}else J(i,11)}else if((e.K||i.g==e)&&yc(i),!x(t))for(s=i.Ja.g.parse(t),t=0;t<s.length;t++){let h=s[t];if(i.V=h[0],h=h[1],2==i.H){if("c"==h[0]){i.K=h[1],i.pa=h[2];let t=h[3];null!=t&&(i.ra=t,i.l.info("VER="+i.ra));let s=h[4];null!=s&&(i.Ga=s,i.l.info("SVER="+i.Ga));let u=h[5];null!=u&&"number"==typeof u&&0<u&&(n=1.5*u,i.L=n,i.l.info("backChannelRequestTimeoutMs_="+n)),n=i;let d=e.g;if(d){let e=d.g?d.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var o=n.i;o.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(o.j=o.l,o.g=new Set,o.h&&(Cc(o,o.h),o.h=null))}if(n.F){let e=d.g?d.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(n.Da=e,K(n.I,n.F,e))}}if(i.H=3,i.h&&i.h.Ba(),i.ca&&(i.S=Date.now()-e.G,i.l.info("Handshake RTT: "+i.S+"ms")),(n=i).wa=Dc(n,n.J?n.pa:null,n.Y),e.K){Ec(n.i,e);var l=n.L;l&&e.setTimeout(l),e.B&&(nc(e),jc(e)),n.g=e}else Fc(n);0<i.j.length&&Gc(i)}else"stop"!=h[0]&&"close"!=h[0]||J(i,7)}else 3==i.H&&("stop"==h[0]||"close"==h[0]?"stop"==h[0]?J(i,7):Hc(i):"noop"!=h[0]&&i.h&&i.h.Aa(h),i.A=0)}}Ob(4)}catch(e){}}function Ic(e){if(e.Z&&"function"==typeof e.Z)return e.Z();if("undefined"!=typeof Map&&e instanceof Map||"undefined"!=typeof Set&&e instanceof Set)return Array.from(e.values());if("string"==typeof e)return e.split("");if(aa(e)){for(var t=[],i=e.length,n=0;n<i;n++)t.push(e[n]);return t}for(n in t=[],i=0,e)t[i++]=e[n];return t}function Jc(e){if(e.ta&&"function"==typeof e.ta)return e.ta();if(!e.Z||"function"!=typeof e.Z){if("undefined"!=typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!=typeof Set&&e instanceof Set)){if(aa(e)||"string"==typeof e){var t=[];e=e.length;for(var i=0;i<e;i++)t.push(i);return t}for(let n in t=[],i=0,e)t[i++]=n;return t}}}function Kc(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(aa(e)||"string"==typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var i=Jc(e),n=Ic(e),s=n.length,o=0;o<s;o++)t.call(void 0,n[o],i&&i[o],e)}(eC=bc.prototype).setTimeout=function(e){this.P=e},eC.nb=function(e){e=e.target;let t=this.M;t&&3==H(e)?t.l():this.Pa(e)},eC.Pa=function(e){try{if(e==this.g)e:{let f=H(this.g);var t=this.g.Ia();let g=this.g.da();if(!(3>f)&&(3!=f||ej||this.g&&(this.h.h||this.g.ja()||mc(this.g)))){this.J||4!=f||7==t||(8==t||0>=g?Ob(3):Ob(2)),nc(this);var i=this.g.da();this.ca=i;t:if(oc(this)){var n=mc(this.g);e="";var s=n.length,o=4==H(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){I(this),pc(this);var l="";break t}this.h.i=new eD.TextDecoder}for(t=0;t<s;t++)this.h.h=!0,e+=this.h.i.decode(n[t],{stream:o&&t==s-1});n.splice(0,s),this.h.g+=e,this.C=0,l=this.h.g}else l=this.g.ja();if(this.i=200==i,Ib(this.j,this.u,this.A,this.m,this.W,f,i),this.i){if(this.aa&&!this.K){t:{if(this.g){var h,u=this.g;if((h=u.g?u.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!x(h)){var d=h;break t}}d=null}if(i=d)D(this.j,this.m,i,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,qc(this,i);else{this.i=!1,this.o=3,F(12),I(this),pc(this);break e}}this.S?(rc(this,f,l),ej&&this.i&&3==f&&(Db(this.U,this.V,"tick",this.mb),this.V.start())):(D(this.j,this.m,l,null),qc(this,l)),4==f&&I(this),this.i&&!this.J&&(4==f?sc(this.l,this):(this.i=!1,jc(this)))}else tc(this.g),400==i&&0<l.indexOf("Unknown SID")?(this.o=3,F(12)):(this.o=0,F(13)),I(this),pc(this)}}}catch(e){}finally{}},eC.mb=function(){if(this.g){var e=H(this.g),t=this.g.ja();this.C<t.length&&(nc(this),rc(this,e,t),this.i&&4!=e&&jc(this))}},eC.cancel=function(){this.J=!0,I(this)},eC.lb=function(){this.B=null;let e=Date.now();0<=e-this.Y?(Kb(this.j,this.A),2!=this.L&&(Ob(),F(17)),I(this),this.o=2,pc(this)):wc(this,this.Y-e)};var tn=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Mc(e,t){if(e){e=e.split("&");for(var i=0;i<e.length;i++){var n=e[i].indexOf("="),s=null;if(0<=n){var o=e[i].substring(0,n);s=e[i].substring(n+1)}else o=e[i];t(o,s?decodeURIComponent(s.replace(/\+/g," ")):"")}}}function M(e){if(this.g=this.s=this.j="",this.m=null,this.o=this.l="",this.h=!1,e instanceof M){this.h=e.h,Nc(this,e.j),this.s=e.s,this.g=e.g,Oc(this,e.m),this.l=e.l;var t=e.i,i=new Pc;i.i=t.i,t.g&&(i.g=new Map(t.g),i.h=t.h),Qc(this,i),this.o=e.o}else e&&(t=String(e).match(tn))?(this.h=!1,Nc(this,t[1]||"",!0),this.s=Rc(t[2]||""),this.g=Rc(t[3]||"",!0),Oc(this,t[4]),this.l=Rc(t[5]||"",!0),Qc(this,t[6]||"",!0),this.o=Rc(t[7]||"")):(this.h=!1,this.i=new Pc(null,this.h))}function G(e){return new M(e)}function Nc(e,t,i){e.j=i?Rc(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function Oc(e,t){if(t){if(isNaN(t=Number(t))||0>t)throw Error("Bad port number "+t);e.m=t}else e.m=null}function Qc(e,t,i){t instanceof Pc?(e.i=t,Xc(e.i,e.h)):(i||(t=Sc(t,tl)),e.i=new Pc(t,e.h))}function K(e,t,i){e.i.set(t,i)}function hc(e){return K(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function Rc(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function Sc(e,t,i){return"string"==typeof e?(e=encodeURI(e).replace(t,Zc),i&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function Zc(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}M.prototype.toString=function(){var e=[],t=this.j;t&&e.push(Sc(t,ts,!0),":");var i=this.g;return(i||"file"==t)&&(e.push("//"),(t=this.s)&&e.push(Sc(t,ts,!0),"@"),e.push(encodeURIComponent(String(i)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(i=this.m)&&e.push(":",String(i))),(i=this.l)&&(this.g&&"/"!=i.charAt(0)&&e.push("/"),e.push(Sc(i,"/"==i.charAt(0)?to:ta,!0))),(i=this.i.toString())&&e.push("?",i),(i=this.o)&&e.push("#",Sc(i,th)),e.join("")};var ts=/[#\/\?@]/g,ta=/[#\?:]/g,to=/[#\?]/g,tl=/[#\?@]/g,th=/#/g;function Pc(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function N(e){e.g||(e.g=new Map,e.h=0,e.i&&Mc(e.i,function(t,i){e.add(decodeURIComponent(t.replace(/\+/g," ")),i)}))}function $c(e,t){N(e),t=O(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function ad(e,t){return N(e),t=O(e,t),e.g.has(t)}function kc(e,t,i){$c(e,t),0<i.length&&(e.i=null,e.g.set(O(e,t),ma(i)),e.h+=i.length)}function O(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function Xc(e,t){t&&!e.j&&(N(e),e.i=null,e.g.forEach(function(e,t){var i=t.toLowerCase();t!=i&&($c(this,t),kc(this,i,e))},e)),e.j=t}(eC=Pc.prototype).add=function(e,t){N(this),this.i=null,e=O(this,e);var i=this.g.get(e);return i||this.g.set(e,i=[]),i.push(t),this.h+=1,this},eC.forEach=function(e,t){N(this),this.g.forEach(function(i,n){i.forEach(function(i){e.call(t,i,n,this)},this)},this)},eC.ta=function(){N(this);let e=Array.from(this.g.values()),t=Array.from(this.g.keys()),i=[];for(let n=0;n<t.length;n++){let s=e[n];for(let e=0;e<s.length;e++)i.push(t[n])}return i},eC.Z=function(e){N(this);let t=[];if("string"==typeof e)ad(this,e)&&(t=t.concat(this.g.get(O(this,e))));else{e=Array.from(this.g.values());for(let i=0;i<e.length;i++)t=t.concat(e[i])}return t},eC.set=function(e,t){return N(this),this.i=null,ad(this,e=O(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},eC.get=function(e,t){return e&&0<(e=this.Z(e)).length?String(e[0]):t},eC.toString=function(){if(this.i)return this.i;if(!this.g)return"";let e=[],t=Array.from(this.g.keys());for(var i=0;i<t.length;i++){var n=t[i];let o=encodeURIComponent(String(n)),l=this.Z(n);for(n=0;n<l.length;n++){var s=o;""!==l[n]&&(s+="="+encodeURIComponent(String(l[n]))),e.push(s)}}return this.i=e.join("&")};var tu=class{constructor(e,t){this.g=e,this.map=t}};function cd(e){this.l=e||td,e=eD.PerformanceNavigationTiming?0<(e=eD.performance.getEntriesByType("navigation")).length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):!!(eD.g&&eD.g.Ka&&eD.g.Ka()&&eD.g.Ka().ec),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}var td=10;function ed(e){return!!e.h||!!e.g&&e.g.size>=e.j}function Bc(e){return e.h?1:e.g?e.g.size:0}function xc(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function Cc(e,t){e.g?e.g.add(t):e.h=t}function Ec(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function fd(e){if(null!=e.h)return e.i.concat(e.h.F);if(null!=e.g&&0!==e.g.size){let t=e.i;for(let i of e.g.values())t=t.concat(i.F);return t}return ma(e.i)}cd.prototype.cancel=function(){if(this.i=fd(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(let e of this.g.values())e.cancel();this.g.clear()}};var tp=class{stringify(e){return eD.JSON.stringify(e,void 0)}parse(e){return eD.JSON.parse(e,void 0)}};function hd(){this.g=new tp}function id(e,t,i){let n=i||"";try{Kc(e,function(e,i){let s=e;p(e)&&(s=e0(e)),t.push(n+i+"="+encodeURIComponent(s))})}catch(e){throw t.push(n+"type="+encodeURIComponent("_badmap")),e}}function jd(e,t){let i=new Gb;if(eD.Image){let n=new Image;n.onload=ha(kd,i,n,"TestLoadImage: loaded",!0,t),n.onerror=ha(kd,i,n,"TestLoadImage: error",!1,t),n.onabort=ha(kd,i,n,"TestLoadImage: abort",!1,t),n.ontimeout=ha(kd,i,n,"TestLoadImage: timeout",!1,t),eD.setTimeout(function(){n.ontimeout&&n.ontimeout()},1e4),n.src=e}else t(!1)}function kd(e,t,i,n,s){try{t.onload=null,t.onerror=null,t.onabort=null,t.ontimeout=null,s(n)}catch(e){}}function ld(e){this.l=e.fc||null,this.j=e.ob||!1}function md(e,t){B.call(this),this.F=e,this.u=t,this.m=void 0,this.readyState=tf,this.status=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.v=new Headers,this.h=null,this.C="GET",this.B="",this.g=!1,this.A=this.j=this.l=null}r(ld,Ub),ld.prototype.g=function(){return new md(this.l,this.j)},ld.prototype.i=($={},function(){return $}),r(md,B);var tf=0;function qd(e){e.j.read().then(e.Xa.bind(e)).catch(e.ka.bind(e))}function pd(e){e.readyState=4,e.l=null,e.j=null,e.A=null,od(e)}function od(e){e.onreadystatechange&&e.onreadystatechange.call(e)}(eC=md.prototype).open=function(e,t){if(this.readyState!=tf)throw this.abort(),Error("Error reopening a connection");this.C=e,this.B=t,this.readyState=1,od(this)},eC.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;let t={headers:this.v,method:this.C,credentials:this.m,cache:void 0};e&&(t.body=e),(this.F||eD).fetch(new Request(this.B,t)).then(this.$a.bind(this),this.ka.bind(this))},eC.abort=function(){this.response=this.responseText="",this.v=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,pd(this)),this.readyState=tf},eC.$a=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,od(this)),this.g&&(this.readyState=3,od(this),this.g))){if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Ya.bind(this),this.ka.bind(this));else if(void 0!==eD.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.u){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.A=new TextDecoder;qd(this)}else e.text().then(this.Za.bind(this),this.ka.bind(this))}},eC.Xa=function(e){if(this.g){if(this.u&&e.value)this.response.push(e.value);else if(!this.u){var t=e.value?e.value:new Uint8Array(0);(t=this.A.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?pd(this):od(this),3==this.readyState&&qd(this)}},eC.Za=function(e){this.g&&(this.response=this.responseText=e,pd(this))},eC.Ya=function(e){this.g&&(this.response=e,pd(this))},eC.ka=function(){this.g&&pd(this)},eC.setRequestHeader=function(e,t){this.v.append(e,t)},eC.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},eC.getAllResponseHeaders=function(){if(!this.h)return"";let e=[],t=this.h.entries();for(var i=t.next();!i.done;)e.push((i=i.value)[0]+": "+i[1]),i=t.next();return e.join("\r\n")},Object.defineProperty(md.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}});var tg=eD.JSON.parse;function P(e){B.call(this),this.headers=new Map,this.u=e||null,this.h=!1,this.C=this.g=null,this.I="",this.m=0,this.j="",this.l=this.G=this.v=this.F=!1,this.B=0,this.A=null,this.K=tm,this.L=this.M=!1}r(P,B);var tm="",t_=/^https?$/i,ty=["POST","PUT"];function xd(e){return eU&&"number"==typeof e.timeout&&void 0!==e.ontimeout}function vd(e,t){e.h=!1,e.g&&(e.l=!0,e.g.abort(),e.l=!1),e.j=t,e.m=5,yd(e),zd(e)}function yd(e){e.F||(e.F=!0,C(e,"complete"),C(e,"error"))}function Ad(e){if(e.h&&void 0!==eN&&(!e.C[1]||4!=H(e)||2!=e.da())){if(e.v&&4==H(e))yb(e.La,0,e);else if(C(e,"readystatechange"),4==H(e)){e.h=!1;try{let l=e.da();switch(l){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t,i,n=!0;break;default:n=!1}if(!(t=n)){if(i=0===l){var s=String(e.I).match(tn)[1]||null;!s&&eD.self&&eD.self.location&&(s=eD.self.location.protocol.slice(0,-1)),i=!t_.test(s?s.toLowerCase():"")}t=i}if(t)C(e,"complete"),C(e,"success");else{e.m=6;try{var o=2<H(e)?e.g.statusText:""}catch(e){o=""}e.j=o+" ["+e.da()+"]",yd(e)}}finally{zd(e)}}}}function zd(e,t){if(e.g){wd(e);let i=e.g,n=e.C[0]?()=>{}:null;e.g=null,e.C=null,t||C(e,"ready");try{i.onreadystatechange=n}catch(e){}}}function wd(e){e.g&&e.L&&(e.g.ontimeout=null),e.A&&(eD.clearTimeout(e.A),e.A=null)}function H(e){return e.g?e.g.readyState:0}function mc(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.K){case tm:case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(e){return null}}function tc(e){let t={};e=(e.g&&2<=H(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let n=0;n<e.length;n++){if(x(e[n]))continue;var i=qb(e[n]);let s=i[0];if("string"!=typeof(i=i[1]))continue;i=i.trim();let o=t[s]||[];t[s]=o,o.push(i)}Oa(t,function(e){return e.join(", ")})}function Bd(e){let t="";return Na(e,function(e,i){t+=i+":"+e+"\r\n"}),t}function Cd(e,t,i){e:{for(n in i){var n=!1;break e}n=!0}n||(i=Bd(i),"string"==typeof e?null!=i&&encodeURIComponent(String(i)):K(e,t,i))}function Dd(e,t,i){return i&&i.internalChannelParams&&i.internalChannelParams[e]||t}function Ed(e){this.Ga=0,this.j=[],this.l=new Gb,this.pa=this.wa=this.I=this.Y=this.g=this.Da=this.F=this.na=this.o=this.U=this.s=null,this.fb=this.W=0,this.cb=Dd("failFast",!1,e),this.G=this.v=this.u=this.m=this.h=null,this.aa=!0,this.Fa=this.V=-1,this.ba=this.A=this.C=0,this.ab=Dd("baseRetryDelayMs",5e3,e),this.hb=Dd("retryDelaySeedMs",1e4,e),this.eb=Dd("forwardChannelMaxRetries",2,e),this.xa=Dd("forwardChannelRequestTimeoutMs",2e4,e),this.va=e&&e.xmlHttpFactory||void 0,this.Ha=e&&e.dc||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.i=new cd(e&&e.concurrentRequestLimit),this.Ja=new hd,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.bb=e&&e.bc||!1,e&&e.Ea&&this.l.Ea(),e&&e.forceLongPolling&&(this.aa=!1),this.ca=!this.P&&this.aa&&e&&e.detectBufferingProxy||!1,this.qa=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.qa=e.longPollingTimeout),this.oa=void 0,this.S=0,this.M=!1,this.ma=this.B=null}function Hc(e){if(Fd(e),3==e.H){var t=e.W++,i=G(e.I);if(K(i,"SID",e.K),K(i,"RID",t),K(i,"TYPE","terminate"),Gd(e,i),(t=new bc(e,e.l,t)).L=2,t.v=hc(G(i)),i=!1,eD.navigator&&eD.navigator.sendBeacon)try{i=eD.navigator.sendBeacon(t.v.toString(),"")}catch(e){}!i&&eD.Image&&((new Image).src=t.v,i=!0),i||(t.g=lc(t.l,null),t.g.ha(t.v)),t.G=Date.now(),jc(t)}Hd(e)}function zc(e){e.g&&(vc(e),e.g.cancel(),e.g=null)}function Fd(e){zc(e),e.u&&(eD.clearTimeout(e.u),e.u=null),yc(e),e.i.cancel(),e.m&&("number"==typeof e.m&&eD.clearTimeout(e.m),e.m=null)}function Gc(e){if(!ed(e.i)&&!e.m){e.m=!0;var t=e.Na;e2||vb(),e9||(e2(),e9=!0),e4.add(t,e),e.C=0}}function Id(e,t){return!(Bc(e.i)>=e.i.j-(e.m?1:0))&&(e.m?(e.j=t.F.concat(e.j),!0):1!=e.H&&2!=e.H&&!(e.C>=(e.cb?0:e.eb))&&(e.m=Rb(q(e.Na,e,t),Jd(e,e.C)),e.C++,!0))}function Ld(e,t){var i;i=t?t.m:e.W++;let n=G(e.I);K(n,"SID",e.K),K(n,"RID",i),K(n,"AID",e.V),Gd(e,n),e.o&&e.s&&Cd(n,e.o,e.s),i=new bc(e,e.l,i,e.C+1),null===e.o&&(i.I=e.s),t&&(e.j=t.F.concat(e.j)),t=Kd(e,i,1e3),i.setTimeout(Math.round(.5*e.xa)+Math.round(.5*e.xa*Math.random())),Cc(e.i,i),gc(i,n,t)}function Gd(e,t){e.na&&Na(e.na,function(e,i){K(t,i,e)}),e.h&&Kc({},function(e,i){K(t,i,e)})}function Kd(e,t,i){i=Math.min(e.j.length,i);var n=e.h?q(e.h.Va,e.h,e):null;e:{var s=e.j;let t=-1;for(;;){let e=["count="+i];-1==t?0<i?(t=s[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let o=!0;for(let l=0;l<i;l++){let i=s[l].g,h=s[l].map;if(0>(i-=t))t=Math.max(0,s[l].g-100),o=!1;else try{id(h,e,"req"+i+"_")}catch(e){n&&n(h)}}if(o){n=e.join("&");break e}}}return e=e.j.splice(0,i),t.F=e,n}function Fc(e){if(!e.g&&!e.u){e.ba=1;var t=e.Ma;e2||vb(),e9||(e2(),e9=!0),e4.add(t,e),e.A=0}}function Ac(e){return!e.g&&!e.u&&!(3<=e.A)&&(e.ba++,e.u=Rb(q(e.Ma,e),Jd(e,e.A)),e.A++,!0)}function vc(e){null!=e.B&&(eD.clearTimeout(e.B),e.B=null)}function Md(e){e.g=new bc(e,e.l,"rpc",e.ba),null===e.o&&(e.g.I=e.s),e.g.O=0;var t=G(e.wa);K(t,"RID","rpc"),K(t,"SID",e.K),K(t,"AID",e.V),K(t,"CI",e.G?"0":"1"),!e.G&&e.qa&&K(t,"TO",e.qa),K(t,"TYPE","xmlhttp"),Gd(e,t),e.o&&e.s&&Cd(t,e.o,e.s),e.L&&e.g.setTimeout(e.L);var i=e.g;e=e.pa,i.L=1,i.v=hc(G(t)),i.s=null,i.S=!0,ic(i,e)}function yc(e){null!=e.v&&(eD.clearTimeout(e.v),e.v=null)}function sc(e,t){var i=null;if(e.g==t){yc(e),vc(e),e.g=null;var n=2}else{if(!xc(e.i,t))return;i=t.F,Ec(e.i,t),n=1}if(0!=e.H){if(t.i){if(1==n){i=t.s?t.s.length:0,t=Date.now()-t.G;var s=e.C;C(n=Mb(),new Qb(n,i)),Gc(e)}else Fc(e)}else if(3==(s=t.o)||0==s&&0<t.ca||!(1==n&&Id(e,t)||2==n&&Ac(e)))switch(i&&0<i.length&&((t=e.i).i=t.i.concat(i)),s){case 1:J(e,5);break;case 4:J(e,10);break;case 3:J(e,6);break;default:J(e,2)}}}function Jd(e,t){let i=e.ab+Math.floor(Math.random()*e.hb);return e.isActive()||(i*=2),i*t}function J(e,t){if(e.l.info("Error code "+t),2==t){var i=null;e.h&&(i=null);var n=q(e.pb,e);i||(i=new M("//www.google.com/images/cleardot.gif"),eD.location&&"http"==eD.location.protocol||Nc(i,"https"),hc(i)),jd(i.toString(),n)}else F(2);e.H=0,e.h&&e.h.za(t),Hd(e),Fd(e)}function Hd(e){if(e.H=0,e.ma=[],e.h){let t=fd(e.i);(0!=t.length||0!=e.j.length)&&(na(e.ma,t),na(e.ma,e.j),e.i.i.length=0,ma(e.j),e.j.length=0),e.h.ya()}}function Dc(e,t,i){var n=i instanceof M?G(i):new M(i);if(""!=n.g)t&&(n.g=t+"."+n.g),Oc(n,n.m);else{var s=eD.location;n=s.protocol,t=t?t+"."+s.hostname:s.hostname,s=+s.port;var o=new M(null);n&&Nc(o,n),t&&(o.g=t),s&&Oc(o,s),i&&(o.l=i),n=o}return i=e.F,t=e.Da,i&&t&&K(n,i,t),K(n,"VER",e.ra),Gd(e,n),n}function lc(e,t,i){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return(t=new P(i&&e.Ha&&!e.va?new ld({ob:!0}):e.va)).Oa(e.J),t}function Nd(){}function Od(){if(eU&&!(10<=Number(eK)))throw Error("Environmental error: no available transport.")}function Q(e,t){B.call(this),this.g=new Ed(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.s=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.Ca&&(e?e["X-WebChannel-Client-Profile"]=t.Ca:e={"X-WebChannel-Client-Profile":t.Ca}),this.g.U=e,(e=t&&t.cc)&&!x(e)&&(this.g.o=e),this.A=t&&t.supportsCrossDomainXhr||!1,this.v=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!x(t)&&(this.g.F=t,null!==(e=this.h)&&t in e&&t in(e=this.h)&&delete e[t]),this.j=new R(this)}function Pd(e){Yb.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(let i in t){e=i;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function Qd(){Zb.call(this),this.status=1}function R(e){this.g=e}function S(){this.blockSize=-1,this.blockSize=64,this.g=[,,,,],this.m=Array(this.blockSize),this.i=this.h=0,this.reset()}function Sd(e,t,i){i||(i=0);var n=Array(16);if("string"==typeof t)for(var s=0;16>s;++s)n[s]=t.charCodeAt(i++)|t.charCodeAt(i++)<<8|t.charCodeAt(i++)<<16|t.charCodeAt(i++)<<24;else for(s=0;16>s;++s)n[s]=t[i++]|t[i++]<<8|t[i++]<<16|t[i++]<<24;t=e.g[0],i=e.g[1],s=e.g[2];var o=e.g[3],l=t+(o^i&(s^o))+n[0]+3614090360&4294967295;l=o+(s^(t=i+(l<<7&4294967295|l>>>25))&(i^s))+n[1]+3905402710&4294967295,l=s+(i^(o=t+(l<<12&4294967295|l>>>20))&(t^i))+n[2]+606105819&4294967295,l=i+(t^(s=o+(l<<17&4294967295|l>>>15))&(o^t))+n[3]+3250441966&4294967295,l=t+(o^(i=s+(l<<22&4294967295|l>>>10))&(s^o))+n[4]+4118548399&4294967295,l=o+(s^(t=i+(l<<7&4294967295|l>>>25))&(i^s))+n[5]+1200080426&4294967295,l=s+(i^(o=t+(l<<12&4294967295|l>>>20))&(t^i))+n[6]+2821735955&4294967295,l=i+(t^(s=o+(l<<17&4294967295|l>>>15))&(o^t))+n[7]+4249261313&4294967295,l=t+(o^(i=s+(l<<22&4294967295|l>>>10))&(s^o))+n[8]+1770035416&4294967295,l=o+(s^(t=i+(l<<7&4294967295|l>>>25))&(i^s))+n[9]+2336552879&4294967295,l=s+(i^(o=t+(l<<12&4294967295|l>>>20))&(t^i))+n[10]+4294925233&4294967295,l=i+(t^(s=o+(l<<17&4294967295|l>>>15))&(o^t))+n[11]+2304563134&4294967295,l=t+(o^(i=s+(l<<22&4294967295|l>>>10))&(s^o))+n[12]+1804603682&4294967295,l=o+(s^(t=i+(l<<7&4294967295|l>>>25))&(i^s))+n[13]+4254626195&4294967295,l=s+(i^(o=t+(l<<12&4294967295|l>>>20))&(t^i))+n[14]+2792965006&4294967295,l=i+(t^(s=o+(l<<17&4294967295|l>>>15))&(o^t))+n[15]+1236535329&4294967295,i=s+(l<<22&4294967295|l>>>10),l=t+(s^o&(i^s))+n[1]+4129170786&4294967295,t=i+(l<<5&4294967295|l>>>27),l=o+(i^s&(t^i))+n[6]+3225465664&4294967295,o=t+(l<<9&4294967295|l>>>23),l=s+(t^i&(o^t))+n[11]+643717713&4294967295,s=o+(l<<14&4294967295|l>>>18),l=i+(o^t&(s^o))+n[0]+3921069994&4294967295,i=s+(l<<20&4294967295|l>>>12),l=t+(s^o&(i^s))+n[5]+3593408605&4294967295,t=i+(l<<5&4294967295|l>>>27),l=o+(i^s&(t^i))+n[10]+38016083&4294967295,o=t+(l<<9&4294967295|l>>>23),l=s+(t^i&(o^t))+n[15]+3634488961&4294967295,s=o+(l<<14&4294967295|l>>>18),l=i+(o^t&(s^o))+n[4]+3889429448&4294967295,i=s+(l<<20&4294967295|l>>>12),l=t+(s^o&(i^s))+n[9]+568446438&4294967295,t=i+(l<<5&4294967295|l>>>27),l=o+(i^s&(t^i))+n[14]+3275163606&4294967295,o=t+(l<<9&4294967295|l>>>23),l=s+(t^i&(o^t))+n[3]+4107603335&4294967295,s=o+(l<<14&4294967295|l>>>18),l=i+(o^t&(s^o))+n[8]+1163531501&4294967295,i=s+(l<<20&4294967295|l>>>12),l=t+(s^o&(i^s))+n[13]+2850285829&4294967295,t=i+(l<<5&4294967295|l>>>27),l=o+(i^s&(t^i))+n[2]+4243563512&4294967295,o=t+(l<<9&4294967295|l>>>23),l=s+(t^i&(o^t))+n[7]+1735328473&4294967295,s=o+(l<<14&4294967295|l>>>18),l=i+(o^t&(s^o))+n[12]+2368359562&4294967295,l=t+((i=s+(l<<20&4294967295|l>>>12))^s^o)+n[5]+4294588738&4294967295,l=o+((t=i+(l<<4&4294967295|l>>>28))^i^s)+n[8]+2272392833&4294967295,l=s+((o=t+(l<<11&4294967295|l>>>21))^t^i)+n[11]+1839030562&4294967295,l=i+((s=o+(l<<16&4294967295|l>>>16))^o^t)+n[14]+4259657740&4294967295,l=t+((i=s+(l<<23&4294967295|l>>>9))^s^o)+n[1]+2763975236&4294967295,l=o+((t=i+(l<<4&4294967295|l>>>28))^i^s)+n[4]+1272893353&4294967295,l=s+((o=t+(l<<11&4294967295|l>>>21))^t^i)+n[7]+4139469664&4294967295,l=i+((s=o+(l<<16&4294967295|l>>>16))^o^t)+n[10]+3200236656&4294967295,l=t+((i=s+(l<<23&4294967295|l>>>9))^s^o)+n[13]+681279174&4294967295,l=o+((t=i+(l<<4&4294967295|l>>>28))^i^s)+n[0]+3936430074&4294967295,l=s+((o=t+(l<<11&4294967295|l>>>21))^t^i)+n[3]+3572445317&4294967295,l=i+((s=o+(l<<16&4294967295|l>>>16))^o^t)+n[6]+76029189&4294967295,l=t+((i=s+(l<<23&4294967295|l>>>9))^s^o)+n[9]+3654602809&4294967295,l=o+((t=i+(l<<4&4294967295|l>>>28))^i^s)+n[12]+3873151461&4294967295,l=s+((o=t+(l<<11&4294967295|l>>>21))^t^i)+n[15]+530742520&4294967295,l=i+((s=o+(l<<16&4294967295|l>>>16))^o^t)+n[2]+3299628645&4294967295,i=s+(l<<23&4294967295|l>>>9),l=t+(s^(i|~o))+n[0]+4096336452&4294967295,t=i+(l<<6&4294967295|l>>>26),l=o+(i^(t|~s))+n[7]+1126891415&4294967295,o=t+(l<<10&4294967295|l>>>22),l=s+(t^(o|~i))+n[14]+2878612391&4294967295,s=o+(l<<15&4294967295|l>>>17),l=i+(o^(s|~t))+n[5]+4237533241&4294967295,i=s+(l<<21&4294967295|l>>>11),l=t+(s^(i|~o))+n[12]+1700485571&4294967295,t=i+(l<<6&4294967295|l>>>26),l=o+(i^(t|~s))+n[3]+2399980690&4294967295,o=t+(l<<10&4294967295|l>>>22),l=s+(t^(o|~i))+n[10]+4293915773&4294967295,s=o+(l<<15&4294967295|l>>>17),l=i+(o^(s|~t))+n[1]+2240044497&4294967295,i=s+(l<<21&4294967295|l>>>11),l=t+(s^(i|~o))+n[8]+1873313359&4294967295,t=i+(l<<6&4294967295|l>>>26),l=o+(i^(t|~s))+n[15]+4264355552&4294967295,o=t+(l<<10&4294967295|l>>>22),l=s+(t^(o|~i))+n[6]+2734768916&4294967295,s=o+(l<<15&4294967295|l>>>17),l=i+(o^(s|~t))+n[13]+1309151649&4294967295,i=s+(l<<21&4294967295|l>>>11),l=t+(s^(i|~o))+n[4]+4149444226&4294967295,t=i+(l<<6&4294967295|l>>>26),l=o+(i^(t|~s))+n[11]+3174756917&4294967295,o=t+(l<<10&4294967295|l>>>22),l=s+(t^(o|~i))+n[2]+718787259&4294967295,s=o+(l<<15&4294967295|l>>>17),l=i+(o^(s|~t))+n[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(s+(l<<21&4294967295|l>>>11))&4294967295,e.g[2]=e.g[2]+s&4294967295,e.g[3]=e.g[3]+o&4294967295}function T(e,t){this.h=t;for(var i=[],n=!0,s=e.length-1;0<=s;s--){var o=0|e[s];n&&o==t||(i[s]=o,n=!1)}this.g=i}(eC=P.prototype).Oa=function(e){this.M=e},eC.ha=function(e,t,i,n){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.I+"; newUri="+e);t=t?t.toUpperCase():"GET",this.I=e,this.j="",this.m=0,this.F=!1,this.h=!0,this.g=this.u?this.u.g():er.g(),this.C=this.u?Vb(this.u):Vb(er),this.g.onreadystatechange=q(this.La,this);try{this.G=!0,this.g.open(t,String(e),!0),this.G=!1}catch(e){vd(this,e);return}if(e=i||"",i=new Map(this.headers),n){if(Object.getPrototypeOf(n)===Object.prototype)for(var s in n)i.set(s,n[s]);else if("function"==typeof n.keys&&"function"==typeof n.get)for(let e of n.keys())i.set(e,n.get(e));else throw Error("Unknown input type for opt_headers: "+String(n))}for(let[o,l]of(n=Array.from(i.keys()).find(e=>"content-type"==e.toLowerCase()),s=eD.FormData&&e instanceof eD.FormData,!(0<=eL(ty,t))||n||s||i.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8"),i))this.g.setRequestHeader(o,l);this.K&&(this.g.responseType=this.K),"withCredentials"in this.g&&this.g.withCredentials!==this.M&&(this.g.withCredentials=this.M);try{wd(this),0<this.B&&((this.L=xd(this.g))?(this.g.timeout=this.B,this.g.ontimeout=q(this.ua,this)):this.A=yb(this.ua,this.B,this)),this.v=!0,this.g.send(e),this.v=!1}catch(e){vd(this,e)}},eC.ua=function(){void 0!==eN&&this.g&&(this.j="Timed out after "+this.B+"ms, aborting",this.m=8,C(this,"timeout"),this.abort(8))},eC.abort=function(e){this.g&&this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1,this.m=e||7,C(this,"complete"),C(this,"abort"),zd(this))},eC.N=function(){this.g&&(this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1),zd(this,!0)),P.$.N.call(this)},eC.La=function(){this.s||(this.G||this.v||this.l?Ad(this):this.kb())},eC.kb=function(){Ad(this)},eC.isActive=function(){return!!this.g},eC.da=function(){try{return 2<H(this)?this.g.status:-1}catch(e){return -1}},eC.ja=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},eC.Wa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),tg(t)}},eC.Ia=function(){return this.m},eC.Sa=function(){return"string"==typeof this.j?this.j:String(this.j)},(eC=Ed.prototype).ra=8,eC.H=1,eC.Na=function(e){if(this.m){if(this.m=null,1==this.H){if(!e){this.W=Math.floor(1e5*Math.random()),e=this.W++;let s=new bc(this,this.l,e),o=this.s;if(this.U&&(o?Ra(o=Pa(o),this.U):o=this.U),null!==this.o||this.O||(s.I=o,o=null),this.P)e:{for(var t=0,i=0;i<this.j.length;i++){t:{var n=this.j[i];if("__data__"in n.map&&"string"==typeof(n=n.map.__data__)){n=n.length;break t}n=void 0}if(void 0===n)break;if(4096<(t+=n)){t=i;break e}if(4096===t||i===this.j.length-1){t=i+1;break e}}t=1e3}else t=1e3;t=Kd(this,s,t),K(i=G(this.I),"RID",e),K(i,"CVER",22),this.F&&K(i,"X-HTTP-Session-Id",this.F),Gd(this,i),o&&(this.O?t="headers="+encodeURIComponent(String(Bd(o)))+"&"+t:this.o&&Cd(i,this.o,o)),Cc(this.i,s),this.bb&&K(i,"TYPE","init"),this.P?(K(i,"$req",t),K(i,"SID","null"),s.aa=!0,gc(s,i,null)):gc(s,i,t),this.H=2}}else 3==this.H&&(e?Ld(this,e):0==this.j.length||ed(this.i)||Ld(this))}},eC.Ma=function(){if(this.u=null,Md(this),this.ca&&!(this.M||null==this.g||0>=this.S)){var e=2*this.S;this.l.info("BP detection timer enabled: "+e),this.B=Rb(q(this.jb,this),e)}},eC.jb=function(){this.B&&(this.B=null,this.l.info("BP detection timeout reached."),this.l.info("Buffering proxy detected and switch to long-polling!"),this.G=!1,this.M=!0,F(10),zc(this),Md(this))},eC.ib=function(){null!=this.v&&(this.v=null,zc(this),Ac(this),F(19))},eC.pb=function(e){e?(this.l.info("Successfully pinged google.com"),F(2)):(this.l.info("Failed to ping google.com"),F(1))},eC.isActive=function(){return!!this.h&&this.h.isActive(this)},(eC=Nd.prototype).Ba=function(){},eC.Aa=function(){},eC.za=function(){},eC.ya=function(){},eC.isActive=function(){return!0},eC.Va=function(){},Od.prototype.g=function(e,t){return new Q(e,t)},r(Q,B),Q.prototype.m=function(){this.g.h=this.j,this.A&&(this.g.J=!0);var e=this.g,t=this.l,i=this.h||void 0;F(0),e.Y=t,e.na=i||{},e.G=e.aa,e.I=Dc(e,null,e.Y),Gc(e)},Q.prototype.close=function(){Hc(this.g)},Q.prototype.u=function(e){var t=this.g;if("string"==typeof e){var i={};i.__data__=e,e=i}else this.v&&((i={}).__data__=e0(e),e=i);t.j.push(new tu(t.fb++,e)),3==t.H&&Gc(t)},Q.prototype.N=function(){this.g.h=null,delete this.j,Hc(this.g),delete this.g,Q.$.N.call(this)},r(Pd,Yb),r(Qd,Zb),r(R,Nd),R.prototype.Ba=function(){C(this.g,"a")},R.prototype.Aa=function(e){C(this.g,new Pd(e))},R.prototype.za=function(e){C(this.g,new Qd)},R.prototype.ya=function(){C(this.g,"b")},r(S,function(){this.blockSize=-1}),S.prototype.reset=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.i=this.h=0},S.prototype.j=function(e,t){void 0===t&&(t=e.length);for(var i=t-this.blockSize,n=this.m,s=this.h,o=0;o<t;){if(0==s)for(;o<=i;)Sd(this,e,o),o+=this.blockSize;if("string"==typeof e){for(;o<t;)if(n[s++]=e.charCodeAt(o++),s==this.blockSize){Sd(this,n),s=0;break}}else for(;o<t;)if(n[s++]=e[o++],s==this.blockSize){Sd(this,n),s=0;break}}this.h=s,this.i+=t},S.prototype.l=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var i=8*this.i;for(t=e.length-8;t<e.length;++t)e[t]=255&i,i/=256;for(this.j(e),e=Array(16),t=i=0;4>t;++t)for(var n=0;32>n;n+=8)e[i++]=this.g[t]>>>n&255;return e};var tv={};function Td(e){return -128<=e&&128>e?ra(e,function(e){return new T([0|e],0>e?-1:0)}):new T([0|e],0>e?-1:0)}function U(e){if(isNaN(e)||!isFinite(e))return tw;if(0>e)return W(U(-e));for(var t=[],i=1,n=0;e>=i;n++)t[n]=e/i|0,i*=tb;return new T(t,0)}function Vd(e,t){if(0==e.length)throw Error("number format error: empty string");if(2>(t=t||10)||36<t)throw Error("radix out of range: "+t);if("-"==e.charAt(0))return W(Vd(e.substring(1),t));if(0<=e.indexOf("-"))throw Error('number format error: interior "-" character');for(var i=U(Math.pow(t,8)),n=tw,s=0;s<e.length;s+=8){var o=Math.min(8,e.length-s),l=parseInt(e.substring(s,s+o),t);8>o?(o=U(Math.pow(t,o)),n=n.R(o).add(U(l))):n=(n=n.R(i)).add(U(l))}return n}var tb=4294967296,tw=Td(0),tE=Td(1),tI=Td(16777216);function Y(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function X(e){return -1==e.h}function W(e){for(var t=e.g.length,i=[],n=0;n<t;n++)i[n]=~e.g[n];return new T(i,~e.h).add(tE)}function Zd(e,t){return e.add(W(t))}function $d(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function ae(e,t){this.g=e,this.h=t}function Yd(e,t){if(Y(t))throw Error("division by zero");if(Y(e))return new ae(tw,tw);if(X(e))return t=Yd(W(e),t),new ae(W(t.g),W(t.h));if(X(t))return t=Yd(e,W(t)),new ae(W(t.g),t.h);if(30<e.g.length){if(X(e)||X(t))throw Error("slowDivide_ only works with positive integers.");for(var i=tE,n=t;0>=n.X(e);)i=be(i),n=be(n);var s=Z(i,1),o=Z(n,1);for(n=Z(n,2),i=Z(i,2);!Y(n);){var l=o.add(n);0>=l.X(e)&&(s=s.add(i),o=l),n=Z(n,1),i=Z(i,1)}return t=Zd(e,s.R(t)),new ae(s,t)}for(s=tw;0<=e.X(t);){for(n=48>=(n=Math.ceil(Math.log(i=Math.max(1,Math.floor(e.ea()/t.ea())))/Math.LN2))?1:Math.pow(2,n-48),l=(o=U(i)).R(t);X(l)||0<l.X(e);)i-=n,l=(o=U(i)).R(t);Y(o)&&(o=tE),s=s.add(o),e=Zd(e,l)}return new ae(s,e)}function be(e){for(var t=e.g.length+1,i=[],n=0;n<t;n++)i[n]=e.D(n)<<1|e.D(n-1)>>>31;return new T(i,e.h)}function Z(e,t){var i=t>>5;t%=32;for(var n=e.g.length-i,s=[],o=0;o<n;o++)s[o]=0<t?e.D(o+i)>>>t|e.D(o+i+1)<<32-t:e.D(o+i);return new T(s,e.h)}(eC=T.prototype).ea=function(){if(X(this))return-W(this).ea();for(var e=0,t=1,i=0;i<this.g.length;i++){var n=this.D(i);e+=(0<=n?n:tb+n)*t,t*=tb}return e},eC.toString=function(e){if(2>(e=e||10)||36<e)throw Error("radix out of range: "+e);if(Y(this))return"0";if(X(this))return"-"+W(this).toString(e);for(var t=U(Math.pow(e,6)),i=this,n="";;){var s=Yd(i,t).g,o=((0<(i=Zd(i,s.R(t))).g.length?i.g[0]:i.h)>>>0).toString(e);if(Y(i=s))return o+n;for(;6>o.length;)o="0"+o;n=o+n}},eC.D=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},eC.X=function(e){return X(e=Zd(this,e))?-1:Y(e)?0:1},eC.abs=function(){return X(this)?W(this):this},eC.add=function(e){for(var t=Math.max(this.g.length,e.g.length),i=[],n=0,s=0;s<=t;s++){var o=n+(65535&this.D(s))+(65535&e.D(s)),l=(o>>>16)+(this.D(s)>>>16)+(e.D(s)>>>16);n=l>>>16,o&=65535,l&=65535,i[s]=l<<16|o}return new T(i,-2147483648&i[i.length-1]?-1:0)},eC.R=function(e){if(Y(this)||Y(e))return tw;if(X(this))return X(e)?W(this).R(W(e)):W(W(this).R(e));if(X(e))return W(this.R(W(e)));if(0>this.X(tI)&&0>e.X(tI))return U(this.ea()*e.ea());for(var t=this.g.length+e.g.length,i=[],n=0;n<2*t;n++)i[n]=0;for(n=0;n<this.g.length;n++)for(var s=0;s<e.g.length;s++){var o=this.D(n)>>>16,l=65535&this.D(n),h=e.D(s)>>>16,u=65535&e.D(s);i[2*n+2*s]+=l*u,$d(i,2*n+2*s),i[2*n+2*s+1]+=o*u,$d(i,2*n+2*s+1),i[2*n+2*s+1]+=l*h,$d(i,2*n+2*s+1),i[2*n+2*s+2]+=o*h,$d(i,2*n+2*s+2)}for(n=0;n<t;n++)i[n]=i[2*n+1]<<16|i[2*n];for(n=t;n<2*t;n++)i[n]=0;return new T(i,0)},eC.gb=function(e){return Yd(this,e).h},eC.and=function(e){for(var t=Math.max(this.g.length,e.g.length),i=[],n=0;n<t;n++)i[n]=this.D(n)&e.D(n);return new T(i,this.h&e.h)},eC.or=function(e){for(var t=Math.max(this.g.length,e.g.length),i=[],n=0;n<t;n++)i[n]=this.D(n)|e.D(n);return new T(i,this.h|e.h)},eC.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),i=[],n=0;n<t;n++)i[n]=this.D(n)^e.D(n);return new T(i,this.h^e.h)},Od.prototype.createWebChannel=Od.prototype.g,Q.prototype.send=Q.prototype.u,Q.prototype.open=Q.prototype.m,Q.prototype.close=Q.prototype.close,e3.NO_ERROR=0,e3.TIMEOUT=8,e3.HTTP_ERROR=6,e8.COMPLETE="complete",Wb.EventType=te,te.OPEN="a",te.CLOSE="b",te.ERROR="c",te.MESSAGE="d",B.prototype.listen=B.prototype.O,P.prototype.listenOnce=P.prototype.P,P.prototype.getLastError=P.prototype.Sa,P.prototype.getLastErrorCode=P.prototype.Ia,P.prototype.getStatus=P.prototype.da,P.prototype.getResponseJson=P.prototype.Wa,P.prototype.getResponseText=P.prototype.ja,P.prototype.send=P.prototype.ha,P.prototype.setWithCredentials=P.prototype.Oa,S.prototype.digest=S.prototype.l,S.prototype.reset=S.prototype.reset,S.prototype.update=S.prototype.j,T.prototype.add=T.prototype.add,T.prototype.multiply=T.prototype.R,T.prototype.modulo=T.prototype.gb,T.prototype.compare=T.prototype.X,T.prototype.toNumber=T.prototype.ea,T.prototype.toString=T.prototype.toString,T.prototype.getBits=T.prototype.D,T.fromNumber=U,T.fromString=Vd,eO.createWebChannelTransport=function(){return new Od},eO.getStatEventTarget=function(){return Mb()},eO.ErrorCode=e3,eO.EventType=e8,eO.Event=e5,eO.Stat={xb:0,Ab:1,Bb:2,Ub:3,Zb:4,Wb:5,Xb:6,Vb:7,Tb:8,Yb:9,PROXY:10,NOPROXY:11,Rb:12,Nb:13,Ob:14,Mb:15,Pb:16,Qb:17,tb:18,sb:19,ub:20},eO.FetchXmlHttpFactory=ld,eO.WebChannel=Wb,eO.XhrIo=P,eO.Md5=S;var tT=eO.Integer=T;__webpack_require__(155);let tS="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let User=class User{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};User.UNAUTHENTICATED=new User(null),User.GOOGLE_CREDENTIALS=new User("google-credentials-uid"),User.FIRST_PARTY=new User("first-party-uid"),User.MOCK_USER=new User("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tA="10.3.0",tP=new Logger("@firebase/firestore");function __PRIVATE_logDebug(e,...t){if(tP.logLevel<=eR.DEBUG){let i=t.map(__PRIVATE_argToString);tP.debug(`Firestore (${tA}): ${e}`,...i)}}function __PRIVATE_logError(e,...t){if(tP.logLevel<=eR.ERROR){let i=t.map(__PRIVATE_argToString);tP.error(`Firestore (${tA}): ${e}`,...i)}}function __PRIVATE_logWarn(e,...t){if(tP.logLevel<=eR.WARN){let i=t.map(__PRIVATE_argToString);tP.warn(`Firestore (${tA}): ${e}`,...i)}}function __PRIVATE_argToString(e){if("string"==typeof e)return e;try{/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */return JSON.stringify(e)}catch(t){return e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fail(e="Unexpected state"){let t=`FIRESTORE (${tA}) INTERNAL ASSERTION FAILED: `+e;throw __PRIVATE_logError(t),Error(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tR={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition",UNAVAILABLE:"unavailable"};let FirestoreError=class FirestoreError extends FirebaseError{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let __PRIVATE_Deferred=class __PRIVATE_Deferred{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let __PRIVATE_OAuthToken=class __PRIVATE_OAuthToken{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}};let __PRIVATE_EmptyAuthCredentialsProvider=class __PRIVATE_EmptyAuthCredentialsProvider{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(User.UNAUTHENTICATED))}shutdown(){}};let __PRIVATE_EmulatorAuthCredentialsProvider=class __PRIVATE_EmulatorAuthCredentialsProvider{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}};let __PRIVATE_FirebaseAuthCredentialsProvider=class __PRIVATE_FirebaseAuthCredentialsProvider{constructor(e){this.t=e,this.currentUser=User.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){let i=this.i,__PRIVATE_guardedChangeListener=e=>this.i!==i?(i=this.i,t(e)):Promise.resolve(),n=new __PRIVATE_Deferred;this.o=()=>{this.i++,this.currentUser=this.u(),n.resolve(),n=new __PRIVATE_Deferred,e.enqueueRetryable(()=>__PRIVATE_guardedChangeListener(this.currentUser))};let __PRIVATE_awaitNextToken=()=>{let t=n;e.enqueueRetryable(async()=>{await t.promise,await __PRIVATE_guardedChangeListener(this.currentUser)})},__PRIVATE_registerAuth=e=>{__PRIVATE_logDebug("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.auth.addAuthTokenListener(this.o),__PRIVATE_awaitNextToken()};this.t.onInit(e=>__PRIVATE_registerAuth(e)),setTimeout(()=>{if(!this.auth){let e=this.t.getImmediate({optional:!0});e?__PRIVATE_registerAuth(e):(__PRIVATE_logDebug("FirebaseAuthCredentialsProvider","Auth not yet detected"),n.resolve(),n=new __PRIVATE_Deferred)}},0),__PRIVATE_awaitNextToken()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(__PRIVATE_logDebug("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?("string"==typeof t.accessToken||fail(),new __PRIVATE_OAuthToken(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){let e=this.auth&&this.auth.getUid();return null===e||"string"==typeof e||fail(),new User(e)}};let __PRIVATE_FirstPartyToken=class __PRIVATE_FirstPartyToken{constructor(e,t,i){this.l=e,this.h=t,this.P=i,this.type="FirstParty",this.user=User.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);let e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}};let __PRIVATE_FirstPartyAuthCredentialsProvider=class __PRIVATE_FirstPartyAuthCredentialsProvider{constructor(e,t,i){this.l=e,this.h=t,this.P=i}getToken(){return Promise.resolve(new __PRIVATE_FirstPartyToken(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(User.FIRST_PARTY))}shutdown(){}invalidateToken(){}};let AppCheckToken=class AppCheckToken{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}};let __PRIVATE_FirebaseAppCheckTokenProvider=class __PRIVATE_FirebaseAppCheckTokenProvider{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){let onTokenChanged=e=>{null!=e.error&&__PRIVATE_logDebug("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);let i=e.token!==this.R;return this.R=e.token,__PRIVATE_logDebug("FirebaseAppCheckTokenProvider",`Received ${i?"new":"existing"} token.`),i?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>onTokenChanged(t))};let __PRIVATE_registerAppCheck=e=>{__PRIVATE_logDebug("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.appCheck.addTokenListener(this.o)};this.A.onInit(e=>__PRIVATE_registerAppCheck(e)),setTimeout(()=>{if(!this.appCheck){let e=this.A.getImmediate({optional:!0});e?__PRIVATE_registerAppCheck(e):__PRIVATE_logDebug("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?("string"==typeof e.token||fail(),this.R=e.token,new AppCheckToken(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function __PRIVATE_randomBytes(e){let t="undefined"!=typeof self&&(self.crypto||self.msCrypto),i=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(i);else for(let t=0;t<e;t++)i[t]=Math.floor(256*Math.random());return i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let __PRIVATE_AutoId=class __PRIVATE_AutoId{static V(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length,i="";for(;i.length<20;){let n=__PRIVATE_randomBytes(40);for(let s=0;s<n.length;++s)i.length<20&&n[s]<t&&(i+=e.charAt(n[s]%e.length))}return i}};function __PRIVATE_primitiveComparator(e,t){return e<t?-1:e>t?1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BasePath=class BasePath{constructor(e,t,i){void 0===t?t=0:t>e.length&&fail(),void 0===i?i=e.length-t:i>e.length-t&&fail(),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return 0===BasePath.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof BasePath?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let i=Math.min(e.length,t.length);for(let n=0;n<i;n++){let i=e.get(n),s=t.get(n);if(i<s)return -1;if(i>s)return 1}return e.length<t.length?-1:e.length>t.length?1:0}};let ResourcePath=class ResourcePath extends BasePath{construct(e,t,i){return new ResourcePath(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}static fromString(...e){let t=[];for(let i of e){if(i.indexOf("//")>=0)throw new FirestoreError(tR.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter(e=>e.length>0))}return new ResourcePath(t)}static emptyPath(){return new ResourcePath([])}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let DocumentKey=class DocumentKey{constructor(e){this.path=e}static fromPath(e){return new DocumentKey(ResourcePath.fromString(e))}static fromName(e){return new DocumentKey(ResourcePath.fromString(e).popFirst(5))}static empty(){return new DocumentKey(ResourcePath.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===ResourcePath.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return ResourcePath.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new DocumentKey(new ResourcePath(e.slice()))}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FieldIndex=class FieldIndex{constructor(e,t,i,n){this.indexId=e,this.collectionGroup=t,this.fields=i,this.indexState=n}};function __PRIVATE_isIndexedDbTransactionError(e){return"IndexedDbTransactionError"===e.name}FieldIndex.UNKNOWN_ID=-1;/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let __PRIVATE_ListenSequence=class __PRIVATE_ListenSequence{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.oe(e),this._e=e=>t.writeSequenceNumber(e))}oe(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this._e&&this._e(e),e}};function __PRIVATE_isNegativeZero(e){return 0===e&&1/e==-1/0}__PRIVATE_ListenSequence.ae=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let SortedMap=class SortedMap{constructor(e,t){this.comparator=e,this.root=t||LLRBNode.EMPTY}insert(e,t){return new SortedMap(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,LLRBNode.BLACK,null,null))}remove(e){return new SortedMap(this.comparator,this.root.remove(e,this.comparator).copy(null,null,LLRBNode.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let i=this.comparator(e,t.key);if(0===i)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){let n=this.comparator(e,i.key);if(0===n)return t+i.left.size;n<0?i=i.left:(t+=i.left.size+1,i=i.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,i)=>(e(t,i),!1))}toString(){let e=[];return this.inorderTraversal((t,i)=>(e.push(`${t}:${i}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new SortedMapIterator(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new SortedMapIterator(this.root,e,this.comparator,!1)}getReverseIterator(){return new SortedMapIterator(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new SortedMapIterator(this.root,e,this.comparator,!0)}};let SortedMapIterator=class SortedMapIterator{constructor(e,t,i,n){this.isReverse=n,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?i(e.key,t):1,t&&n&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(0===s){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}};let LLRBNode=class LLRBNode{constructor(e,t,i,n,s){this.key=e,this.value=t,this.color=null!=i?i:LLRBNode.RED,this.left=null!=n?n:LLRBNode.EMPTY,this.right=null!=s?s:LLRBNode.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,n,s){return new LLRBNode(null!=e?e:this.key,null!=t?t:this.value,null!=i?i:this.color,null!=n?n:this.left,null!=s?s:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let n=this,s=i(e,n.key);return(n=s<0?n.copy(null,null,null,n.left.insert(e,t,i),null):0===s?n.copy(null,t,null,null,null):n.copy(null,null,null,null,n.right.insert(e,t,i))).fixUp()}removeMin(){if(this.left.isEmpty())return LLRBNode.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let i,n=this;if(0>t(e,n.key))n.left.isEmpty()||n.left.isRed()||n.left.left.isRed()||(n=n.moveRedLeft()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed()&&(n=n.rotateRight()),n.right.isEmpty()||n.right.isRed()||n.right.left.isRed()||(n=n.moveRedRight()),0===t(e,n.key)){if(n.right.isEmpty())return LLRBNode.EMPTY;i=n.right.min(),n=n.copy(i.key,i.value,null,null,n.right.removeMin())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,LLRBNode.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,LLRBNode.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw fail();let e=this.left.check();if(e!==this.right.check())throw fail();return e+(this.isRed()?0:1)}};LLRBNode.EMPTY=null,LLRBNode.RED=!0,LLRBNode.BLACK=!1,LLRBNode.EMPTY=new class{constructor(){this.size=0}get key(){throw fail()}get value(){throw fail()}get color(){throw fail()}get left(){throw fail()}get right(){throw fail()}copy(e,t,i,n,s){return this}insert(e,t,i){return new LLRBNode(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let SortedSet=class SortedSet{constructor(e){this.comparator=e,this.data=new SortedMap(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,i)=>(e(t),!1))}forEachInRange(e,t){let i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){let n=i.getNext();if(this.comparator(n.key,e[1])>=0)return;t(n.key)}}forEachWhile(e,t){let i;for(i=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new SortedSetIterator(this.data.getIterator())}getIteratorFrom(e){return new SortedSetIterator(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof SortedSet)||this.size!==e.size)return!1;let t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,n=i.getNext().key;if(0!==this.comparator(e,n))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new SortedSet(this.comparator);return t.data=e,t}};let SortedSetIterator=class SortedSetIterator{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let __PRIVATE_Base64DecodeError=class __PRIVATE_Base64DecodeError extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ByteString=class ByteString{constructor(e){this.binaryString=e}static fromBase64String(e){let t=function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new __PRIVATE_Base64DecodeError("Invalid base64 string: "+e):e}}(e);return new ByteString(t)}static fromUint8Array(e){let t=function(e){let t="";for(let i=0;i<e.length;++i)t+=String.fromCharCode(e[i]);return t}(e);return new ByteString(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return btoa(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return __PRIVATE_primitiveComparator(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};function __PRIVATE_normalizeNumber(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function __PRIVATE_normalizeByteString(e){return"string"==typeof e?ByteString.fromBase64String(e):ByteString.fromUint8Array(e)}ByteString.EMPTY_BYTE_STRING=new ByteString("");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let DatabaseInfo=class DatabaseInfo{constructor(e,t,i,n,s,o,l,h,u){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=n,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=h,this.useFetchStreams=u}};let DatabaseId=class DatabaseId{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new DatabaseId("","")}get isDefaultDatabase(){return"(default)"===this.database}isEqual(e){return e instanceof DatabaseId&&e.projectId===this.projectId&&e.database===this.database}};function __PRIVATE_isMaxValue(e){return"__max__"===(((e.mapValue||{}).fields||{}).__type__||{}).stringValue}new SortedMap(DocumentKey.comparator),new SortedMap(DocumentKey.comparator),new SortedMap(DocumentKey.comparator),new SortedSet(DocumentKey.comparator),new SortedSet(__PRIVATE_primitiveComparator),(en=ei||(ei={}))[en.OK=0]="OK",en[en.CANCELLED=1]="CANCELLED",en[en.UNKNOWN=2]="UNKNOWN",en[en.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",en[en.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",en[en.NOT_FOUND=5]="NOT_FOUND",en[en.ALREADY_EXISTS=6]="ALREADY_EXISTS",en[en.PERMISSION_DENIED=7]="PERMISSION_DENIED",en[en.UNAUTHENTICATED=16]="UNAUTHENTICATED",en[en.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",en[en.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",en[en.ABORTED=10]="ABORTED",en[en.OUT_OF_RANGE=11]="OUT_OF_RANGE",en[en.UNIMPLEMENTED=12]="UNIMPLEMENTED",en[en.INTERNAL=13]="INTERNAL",en[en.UNAVAILABLE=14]="UNAVAILABLE",en[en.DATA_LOSS=15]="DATA_LOSS",new tT([4294967295,4294967295],0);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let __PRIVATE_FirestoreIndexValueWriter=class __PRIVATE_FirestoreIndexValueWriter{constructor(){}Tt(e,t){this.Et(e,t),t.dt()}Et(e,t){if("nullValue"in e)this.At(t,5);else if("booleanValue"in e)this.At(t,10),t.Rt(e.booleanValue?1:0);else if("integerValue"in e)this.At(t,15),t.Rt(__PRIVATE_normalizeNumber(e.integerValue));else if("doubleValue"in e){let i=__PRIVATE_normalizeNumber(e.doubleValue);isNaN(i)?this.At(t,13):(this.At(t,15),__PRIVATE_isNegativeZero(i)?t.Rt(0):t.Rt(i))}else if("timestampValue"in e){let i=e.timestampValue;this.At(t,20),"string"==typeof i?t.Vt(i):(t.Vt(`${i.seconds||""}`),t.Rt(i.nanos||0))}else if("stringValue"in e)this.ft(e.stringValue,t),this.gt(t);else if("bytesValue"in e)this.At(t,30),t.yt(__PRIVATE_normalizeByteString(e.bytesValue)),this.gt(t);else if("referenceValue"in e)this.wt(e.referenceValue,t);else if("geoPointValue"in e){let i=e.geoPointValue;this.At(t,45),t.Rt(i.latitude||0),t.Rt(i.longitude||0)}else"mapValue"in e?__PRIVATE_isMaxValue(e)?this.At(t,Number.MAX_SAFE_INTEGER):(this.St(e.mapValue,t),this.gt(t)):"arrayValue"in e?(this.bt(e.arrayValue,t),this.gt(t)):fail()}ft(e,t){this.At(t,25),this.Dt(e,t)}Dt(e,t){t.Vt(e)}St(e,t){let i=e.fields||{};for(let e of(this.At(t,55),Object.keys(i)))this.ft(e,t),this.Et(i[e],t)}bt(e,t){let i=e.values||[];for(let e of(this.At(t,50),i))this.Et(e,t)}wt(e,t){this.At(t,37),DocumentKey.fromName(e).path.forEach(e=>{this.At(t,60),this.Dt(e,t)})}At(e,t){e.Rt(t)}gt(e){e.Rt(2)}};__PRIVATE_FirestoreIndexValueWriter.vt=new __PRIVATE_FirestoreIndexValueWriter,new Uint8Array(0);let LruParams=class LruParams{constructor(e,t,i){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=i}static withCacheSize(e){return new LruParams(e,LruParams.DEFAULT_COLLECTION_PERCENTILE,LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}};function getDocument(){return"undefined"!=typeof document?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */LruParams.DEFAULT_COLLECTION_PERCENTILE=10,LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,LruParams.DEFAULT=new LruParams(41943040,LruParams.DEFAULT_COLLECTION_PERCENTILE,LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),LruParams.DISABLED=new LruParams(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let __PRIVATE_ExponentialBackoff=class __PRIVATE_ExponentialBackoff{constructor(e,t,i=1e3,n=1.5,s=6e4){this.oi=e,this.timerId=t,this.Do=i,this.vo=n,this.Co=s,this.Fo=0,this.Mo=null,this.xo=Date.now(),this.reset()}reset(){this.Fo=0}Oo(){this.Fo=this.Co}No(e){this.cancel();let t=Math.floor(this.Fo+this.Bo()),i=Math.max(0,Date.now()-this.xo),n=Math.max(0,t-i);n>0&&__PRIVATE_logDebug("ExponentialBackoff",`Backing off for ${n} ms (base delay: ${this.Fo} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.Mo=this.oi.enqueueAfterDelay(this.timerId,n,()=>(this.xo=Date.now(),e())),this.Fo*=this.vo,this.Fo<this.Do&&(this.Fo=this.Do),this.Fo>this.Co&&(this.Fo=this.Co)}Lo(){null!==this.Mo&&(this.Mo.skipDelay(),this.Mo=null)}cancel(){null!==this.Mo&&(this.Mo.cancel(),this.Mo=null)}Bo(){return(Math.random()-.5)*this.Fo}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let DelayedOperation=class DelayedOperation{constructor(e,t,i,n,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=n,this.removalCallback=s,this.deferred=new __PRIVATE_Deferred,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}static createAndSchedule(e,t,i,n,s){let o=Date.now()+i,l=new DelayedOperation(e,t,o,n,s);return l.start(i),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new FirestoreError(tR.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};function __PRIVATE_wrapInUserErrorIfRecoverable(e,t){if(__PRIVATE_logError("AsyncQueue",`${t}: ${e}`),__PRIVATE_isIndexedDbTransactionError(e))return new FirestoreError(tR.UNAVAILABLE,`${t}: ${e}`);throw e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FirestoreClient=class FirestoreClient{constructor(e,t,i,n){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this.databaseInfo=n,this.user=User.UNAUTHENTICATED,this.clientId=__PRIVATE_AutoId.V(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(i,async e=>{__PRIVATE_logDebug("FirestoreClient","Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(i,e=>(__PRIVATE_logDebug("FirestoreClient","Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}async getConfiguration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new FirestoreError(tR.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();let e=new __PRIVATE_Deferred;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(i){let t=__PRIVATE_wrapInUserErrorIfRecoverable(i,"Failed to shutdown persistence");e.reject(t)}}),e.promise}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function __PRIVATE_cloneLongPollingOptions(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tC=new Map;function __PRIVATE_validateIsNotUsedTogether(e,t,i,n){if(!0===t&&!0===n)throw new FirestoreError(tR.INVALID_ARGUMENT,`${e} and ${i} cannot be used together.`)}function __PRIVATE_valueDescription(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let i=(t=e).constructor?t.constructor.name:null;return i?`a custom ${i} object`:"an object"}}return"function"==typeof e?"a function":fail()}function __PRIVATE_cast(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new FirestoreError(tR.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let i=__PRIVATE_valueDescription(e);throw new FirestoreError(tR.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${i}`)}}return e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FirestoreSettingsImpl=class FirestoreSettingsImpl{constructor(e){var t,i;if(void 0===e.host){if(void 0!==e.ssl)throw new FirestoreError(tR.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=null===(t=e.ssl)||void 0===t||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new FirestoreError(tR.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}__PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=__PRIVATE_cloneLongPollingOptions(null!==(i=e.experimentalLongPollingOptions)&&void 0!==i?i:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new FirestoreError(tR.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new FirestoreError(tR.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new FirestoreError(tR.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,i;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,i=e.experimentalLongPollingOptions,t.timeoutSeconds===i.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}};let Firestore$1=class Firestore$1{constructor(e,t,i,n){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=n,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new FirestoreSettingsImpl({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new FirestoreError(tR.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return void 0!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new FirestoreError(tR.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new FirestoreSettingsImpl(e),void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new __PRIVATE_EmptyAuthCredentialsProvider;switch(e.type){case"firstParty":return new __PRIVATE_FirstPartyAuthCredentialsProvider(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new FirestoreError(tR.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=tC.get(e);t&&(__PRIVATE_logDebug("ComponentProvider","Removing Datastore"),tC.delete(e),t.terminate())}(this),Promise.resolve()}};function connectFirestoreEmulator(e,t,i,n={}){var s;let o=(e=__PRIVATE_cast(e,Firestore$1))._getSettings(),l=`${t}:${i}`;if("firestore.googleapis.com"!==o.host&&o.host!==l&&__PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),e._setSettings(Object.assign(Object.assign({},o),{host:l,ssl:!1})),n.mockUserToken){let t,i;if("string"==typeof n.mockUserToken)t=n.mockUserToken,i=User.MOCK_USER;else{t=createMockUserToken(n.mockUserToken,null===(s=e._app)||void 0===s?void 0:s.options.projectId);let o=n.mockUserToken.sub||n.mockUserToken.user_id;if(!o)throw new FirestoreError(tR.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");i=new User(o)}e._authCredentials=new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let __PRIVATE_AsyncQueueImpl=class __PRIVATE_AsyncQueueImpl{constructor(){this.za=Promise.resolve(),this.ja=[],this.Ha=!1,this.Ja=[],this.Ya=null,this.Za=!1,this.Xa=!1,this.eu=[],this.Uo=new __PRIVATE_ExponentialBackoff(this,"async_queue_retry"),this.tu=()=>{let e=getDocument();e&&__PRIVATE_logDebug("AsyncQueue","Visibility state changed to "+e.visibilityState),this.Uo.Lo()};let e=getDocument();e&&"function"==typeof e.addEventListener&&e.addEventListener("visibilitychange",this.tu)}get isShuttingDown(){return this.Ha}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.nu(),this.ru(e)}enterRestrictedMode(e){if(!this.Ha){this.Ha=!0,this.Xa=e||!1;let t=getDocument();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.tu)}}enqueue(e){if(this.nu(),this.Ha)return new Promise(()=>{});let t=new __PRIVATE_Deferred;return this.ru(()=>this.Ha&&this.Xa?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.ja.push(e),this.iu()))}async iu(){if(0!==this.ja.length){try{await this.ja[0](),this.ja.shift(),this.Uo.reset()}catch(e){if(!__PRIVATE_isIndexedDbTransactionError(e))throw e;__PRIVATE_logDebug("AsyncQueue","Operation failed with retryable error: "+e)}this.ja.length>0&&this.Uo.No(()=>this.iu())}}ru(e){let t=this.za.then(()=>(this.Za=!0,e().catch(e=>{let t;this.Ya=e,this.Za=!1;let i=(t=e.message||"",e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t);throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ",i),e}).then(e=>(this.Za=!1,e))));return this.za=t,t}enqueueAfterDelay(e,t,i){this.nu(),this.eu.indexOf(e)>-1&&(t=0);let n=DelayedOperation.createAndSchedule(this,e,t,i,e=>this.su(e));return this.Ja.push(n),n}nu(){this.Ya&&fail()}verifyOperationInProgress(){}async ou(){let e;do e=this.za,await e;while(e!==this.za)}_u(e){for(let t of this.Ja)if(t.timerId===e)return!0;return!1}au(e){return this.ou().then(()=>{for(let t of(this.Ja.sort((e,t)=>e.targetTimeMs-t.targetTimeMs),this.Ja))if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.ou()})}uu(e){this.eu.push(e)}su(e){let t=this.Ja.indexOf(e);this.Ja.splice(t,1)}};let Firestore=class Firestore extends Firestore$1{constructor(e,t,i,n){super(e,t,i,n),this.type="firestore",this._queue=new __PRIVATE_AsyncQueueImpl,this._persistenceKey=(null==n?void 0:n.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||__PRIVATE_configureFirestore(this),this._firestoreClient.terminate()}};function getFirestore(e,t){let i="object"==typeof e?e:getApp(),n=index_esm2017_getProvider(i,"firestore").getImmediate({identifier:"string"==typeof e?e:t||"(default)"});if(!n._initialized){let e=getDefaultEmulatorHostnameAndPort("firestore");e&&connectFirestoreEmulator(n,...e)}return n}function __PRIVATE_configureFirestore(e){var t,i,n,s;let o=e._freezeSettings(),l=(s=e._databaseId,new DatabaseInfo(s,(null===(t=e._app)||void 0===t?void 0:t.options.appId)||"",e._persistenceKey,o.host,o.ssl,o.experimentalForceLongPolling,o.experimentalAutoDetectLongPolling,__PRIVATE_cloneLongPollingOptions(o.experimentalLongPollingOptions),o.useFetchStreams));e._firestoreClient=new FirestoreClient(e._authCredentials,e._appCheckCredentials,e._queue,l),(null===(i=o.localCache)||void 0===i?void 0:i._offlineComponentProvider)&&(null===(n=o.localCache)||void 0===n?void 0:n._onlineComponentProvider)&&(e._firestoreClient._uninitializedComponentsProvider={_offlineKind:o.localCache.kind,_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider})}function __rest(e,t){var i={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(i[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var s=0,n=Object.getOwnPropertySymbols(e);s<n.length;s++)0>t.indexOf(n[s])&&Object.prototype.propertyIsEnumerable.call(e,n[s])&&(i[n[s]]=e[n[s]]);return i}function isEnterprise(e){return void 0!==e&&void 0!==e.enterprise}!function(e,t=!0){tA=eT,_registerComponent(new Component("firestore",(e,{instanceIdentifier:i,options:n})=>{let s=e.getProvider("app").getImmediate(),o=new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(e.getProvider("auth-internal")),new __PRIVATE_FirebaseAppCheckTokenProvider(e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new FirestoreError(tR.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new DatabaseId(e.options.projectId,t)}(s,i),s);return n=Object.assign({useFetchStreams:t},n),o._setSettings(n),o},"PUBLIC").setMultipleInstances(!0)),registerVersion(tS,"4.1.2",void 0),registerVersion(tS,"4.1.2","esm2017")}(),"function"==typeof SuppressedError&&SuppressedError;let RecaptchaConfig=class RecaptchaConfig{constructor(e){if(this.siteKey="",this.emailPasswordEnabled=!1,void 0===e.recaptchaKey)throw Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.emailPasswordEnabled=e.recaptchaEnforcementState.some(e=>"EMAIL_PASSWORD_PROVIDER"===e.provider&&"OFF"!==e.enforcementState)}};function _prodErrorMap(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}let tk=_prodErrorMap,tO=new ErrorFactory("auth","Firebase",_prodErrorMap()),tN=new Logger("@firebase/auth");function _logWarn(e,...t){tN.logLevel<=eR.WARN&&tN.warn(`Auth (${eT}): ${e}`,...t)}function _logError(e,...t){tN.logLevel<=eR.ERROR&&tN.error(`Auth (${eT}): ${e}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _fail(e,...t){throw createErrorInternal(e,...t)}function _createError(e,...t){return createErrorInternal(e,...t)}function _errorWithCustomMessage(e,t,i){let n=Object.assign(Object.assign({},tk()),{[t]:i}),s=new ErrorFactory("auth","Firebase",n);return s.create(t,{appName:e.name})}function createErrorInternal(e,...t){if("string"!=typeof e){let i=t[0],n=[...t.slice(1)];return n[0]&&(n[0].appName=e.name),e._errorFactory.create(i,...n)}return tO.create(e,...t)}function _assert(e,t,...i){if(!e)throw createErrorInternal(t,...i)}function debugFail(e){let t="INTERNAL ASSERTION FAILED: "+e;throw _logError(t),Error(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getCurrentUrl(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function _isHttpOrHttps(){return"http:"===_getCurrentScheme()||"https:"===_getCurrentScheme()}function _getCurrentScheme(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _isOnline(){return!("undefined"!=typeof navigator&&navigator&&"onLine"in navigator&&"boolean"==typeof navigator.onLine&&(_isHttpOrHttps()||isBrowserExtension()||"connection"in navigator))||navigator.onLine}function _getUserLanguage(){if("undefined"==typeof navigator)return null;let e=navigator;return e.languages&&e.languages[0]||e.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Delay=class Delay{constructor(e,t){this.shortDelay=e,this.longDelay=t,t>e||debugFail("Short delay should be less than long delay!"),this.isMobile=isMobileCordova()||isReactNative()}get(){return _isOnline()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _emulatorUrl(e,t){e.emulator||debugFail("Emulator should always be set here");let{url:i}=e.emulator;return t?`${i}${t.startsWith("/")?t.slice(1):t}`:i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FetchProvider=class FetchProvider{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:void debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:void debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:void debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tD={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},tL=new Delay(3e4,6e4);function _addTidIfNecessary(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function _performApiRequest(e,t,i,n,s={}){return _performFetchWithErrorHandling(e,s,async()=>{let s={},o={};n&&("GET"===t?o=n:s={body:JSON.stringify(n)});let l=index_esm2017_querystring(Object.assign({key:e.config.apiKey},o)).slice(1),h=await e._getAdditionalHeaders();return h["Content-Type"]="application/json",e.languageCode&&(h["X-Firebase-Locale"]=e.languageCode),FetchProvider.fetch()(_getFinalTarget(e,e.config.apiHost,i,l),Object.assign({method:t,headers:h,referrerPolicy:"no-referrer"},s))})}async function _performFetchWithErrorHandling(e,t,i){e._canInitEmulator=!1;let n=Object.assign(Object.assign({},tD),t);try{let t=new NetworkTimeout(e),s=await Promise.race([i(),t.promise]);t.clearNetworkTimeout();let o=await s.json();if("needConfirmation"in o)throw _makeTaggedError(e,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{let t=s.ok?o.errorMessage:o.error.message,[i,l]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===i)throw _makeTaggedError(e,"credential-already-in-use",o);if("EMAIL_EXISTS"===i)throw _makeTaggedError(e,"email-already-in-use",o);if("USER_DISABLED"===i)throw _makeTaggedError(e,"user-disabled",o);let h=n[i]||i.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw _errorWithCustomMessage(e,h,l);_fail(e,h)}}catch(t){if(t instanceof FirebaseError)throw t;_fail(e,"network-request-failed",{message:String(t)})}}async function _performSignInRequest(e,t,i,n,s={}){let o=await _performApiRequest(e,t,i,n,s);return"mfaPendingCredential"in o&&_fail(e,"multi-factor-auth-required",{_serverResponse:o}),o}function _getFinalTarget(e,t,i,n){let s=`${t}${i}?${n}`;return e.config.emulator?_emulatorUrl(e.config,s):`${e.config.apiScheme}://${s}`}let NetworkTimeout=class NetworkTimeout{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(_createError(this.auth,"network-request-failed")),tL.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}};function _makeTaggedError(e,t,i){let n={appName:e.name};i.email&&(n.email=i.email),i.phoneNumber&&(n.phoneNumber=i.phoneNumber);let s=_createError(e,t,n);return s.customData._tokenResponse=i,s}async function getRecaptchaConfig(e,t){return _performApiRequest(e,"GET","/v2/recaptchaConfig",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function deleteAccount(e,t){return _performApiRequest(e,"POST","/v1/accounts:delete",t)}async function getAccountInfo(e,t){return _performApiRequest(e,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function utcTimestampToDateString(e){if(e)try{let t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(e){}}async function getIdTokenResult(e,t=!1){let i=index_esm2017_getModularInstance(e),n=await i.getIdToken(t),s=_parseToken(n);_assert(s&&s.exp&&s.auth_time&&s.iat,i.auth,"internal-error");let o="object"==typeof s.firebase?s.firebase:void 0,l=null==o?void 0:o.sign_in_provider;return{claims:s,token:n,authTime:utcTimestampToDateString(secondsStringToMilliseconds(s.auth_time)),issuedAtTime:utcTimestampToDateString(secondsStringToMilliseconds(s.iat)),expirationTime:utcTimestampToDateString(secondsStringToMilliseconds(s.exp)),signInProvider:l||null,signInSecondFactor:(null==o?void 0:o.sign_in_second_factor)||null}}function secondsStringToMilliseconds(e){return 1e3*Number(e)}function _parseToken(e){let[t,i,n]=e.split(".");if(void 0===t||void 0===i||void 0===n)return _logError("JWT malformed, contained fewer than 3 sections"),null;try{let e=base64Decode(i);if(!e)return _logError("Failed to decode base64 JWT payload"),null;return JSON.parse(e)}catch(e){return _logError("Caught error parsing JWT payload as JSON",null==e?void 0:e.toString()),null}}function _tokenExpiresIn(e){let t=_parseToken(e);return _assert(t,"internal-error"),_assert(void 0!==t.exp,"internal-error"),_assert(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _logoutIfInvalidated(e,t,i=!1){if(i)return t;try{return await t}catch(t){throw t instanceof FirebaseError&&isUserInvalidated(t)&&e.auth.currentUser===e&&await e.auth.signOut(),t}}function isUserInvalidated({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ProactiveRefresh=class ProactiveRefresh{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){let e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;let e=null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0,i=e-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(null==e?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let UserMetadata=class UserMetadata{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=utcTimestampToDateString(this.lastLoginAt),this.creationTime=utcTimestampToDateString(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _reloadWithoutSaving(e){var t;let i=e.auth,n=await e.getIdToken(),s=await _logoutIfInvalidated(e,getAccountInfo(i,{idToken:n}));_assert(null==s?void 0:s.users.length,i,"internal-error");let o=s.users[0];e._notifyReloadListener(o);let l=(null===(t=o.providerUserInfo)||void 0===t?void 0:t.length)?extractProviderData(o.providerUserInfo):[],h=mergeProviderData(e.providerData,l),u=e.isAnonymous,d=!(e.email&&o.passwordHash)&&!(null==h?void 0:h.length),f={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new UserMetadata(o.createdAt,o.lastLoginAt),isAnonymous:!!u&&d};Object.assign(e,f)}async function reload(e){let t=index_esm2017_getModularInstance(e);await _reloadWithoutSaving(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function mergeProviderData(e,t){let i=e.filter(e=>!t.some(t=>t.providerId===e.providerId));return[...i,...t]}function extractProviderData(e){return e.map(e=>{var{providerId:t}=e,i=__rest(e,["providerId"]);return{providerId:t,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function requestStsToken(e,t){let i=await _performFetchWithErrorHandling(e,{},async()=>{let i=index_esm2017_querystring({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:n,apiKey:s}=e.config,o=_getFinalTarget(e,n,"/v1/token",`key=${s}`),l=await e._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",FetchProvider.fetch()(o,{method:"POST",headers:l,body:i})});return{accessToken:i.access_token,expiresIn:i.expires_in,refreshToken:i.refresh_token}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let StsTokenManager=class StsTokenManager{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_assert(e.idToken,"internal-error"),_assert(void 0!==e.idToken,"internal-error"),_assert(void 0!==e.refreshToken,"internal-error");let t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):_tokenExpiresIn(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}async getToken(e,t=!1){return(_assert(!this.accessToken||this.refreshToken,e,"user-token-expired"),t||!this.accessToken||this.isExpired)?this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null:this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:i,refreshToken:n,expiresIn:s}=await requestStsToken(e,t);this.updateTokensAndExpiration(i,n,Number(s))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*i}static fromJSON(e,t){let{refreshToken:i,accessToken:n,expirationTime:s}=t,o=new StsTokenManager;return i&&(_assert("string"==typeof i,"internal-error",{appName:e}),o.refreshToken=i),n&&(_assert("string"==typeof n,"internal-error",{appName:e}),o.accessToken=n),s&&(_assert("number"==typeof s,"internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new StsTokenManager,this.toJSON())}_performRefresh(){return debugFail("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function assertStringOrUndefined(e,t){_assert("string"==typeof e||void 0===e,"internal-error",{appName:t})}let UserImpl=class UserImpl{constructor(e){var{uid:t,auth:i,stsTokenManager:n}=e,s=__rest(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ProactiveRefresh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=i,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new UserMetadata(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){let t=await _logoutIfInvalidated(this,this.stsTokenManager.getToken(this.auth,e));return _assert(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return getIdTokenResult(this,e)}reload(){return reload(this)}_assign(e){this!==e&&(_assert(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>Object.assign({},e)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new UserImpl(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){_assert(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await _reloadWithoutSaving(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){let e=await this.getIdToken();return await _logoutIfInvalidated(this,deleteAccount(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var i,n,s,o,l,h,u,d;let f=null!==(i=t.displayName)&&void 0!==i?i:void 0,g=null!==(n=t.email)&&void 0!==n?n:void 0,m=null!==(s=t.phoneNumber)&&void 0!==s?s:void 0,b=null!==(o=t.photoURL)&&void 0!==o?o:void 0,E=null!==(l=t.tenantId)&&void 0!==l?l:void 0,k=null!==(h=t._redirectEventId)&&void 0!==h?h:void 0,L=null!==(u=t.createdAt)&&void 0!==u?u:void 0,j=null!==(d=t.lastLoginAt)&&void 0!==d?d:void 0,{uid:V,emailVerified:z,isAnonymous:$,providerData:ee,stsTokenManager:et}=t;_assert(V&&et,e,"internal-error");let er=StsTokenManager.fromJSON(this.name,et);_assert("string"==typeof V,e,"internal-error"),assertStringOrUndefined(f,e.name),assertStringOrUndefined(g,e.name),_assert("boolean"==typeof z,e,"internal-error"),_assert("boolean"==typeof $,e,"internal-error"),assertStringOrUndefined(m,e.name),assertStringOrUndefined(b,e.name),assertStringOrUndefined(E,e.name),assertStringOrUndefined(k,e.name),assertStringOrUndefined(L,e.name),assertStringOrUndefined(j,e.name);let ei=new UserImpl({uid:V,auth:e,email:g,emailVerified:z,displayName:f,isAnonymous:$,photoURL:b,phoneNumber:m,tenantId:E,stsTokenManager:er,createdAt:L,lastLoginAt:j});return ee&&Array.isArray(ee)&&(ei.providerData=ee.map(e=>Object.assign({},e))),k&&(ei._redirectEventId=k),ei}static async _fromIdTokenResponse(e,t,i=!1){let n=new StsTokenManager;n.updateFromServerResponse(t);let s=new UserImpl({uid:t.localId,auth:e,stsTokenManager:n,isAnonymous:i});return await _reloadWithoutSaving(s),s}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tx=new Map;function _getInstance(e){e instanceof Function||debugFail("Expected a class definition");let t=tx.get(e);return t?t instanceof e||debugFail("Instance stored in cache mismatched with class"):(t=new e,tx.set(e,t)),t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let InMemoryPersistence=class InMemoryPersistence{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _persistenceKeyName(e,t,i){return`firebase:${e}:${t}:${i}`}InMemoryPersistence.type="NONE";let PersistenceUserManager=class PersistenceUserManager{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;let{config:n,name:s}=this.auth;this.fullUserKey=_persistenceKeyName(this.userKey,n.apiKey,s),this.fullPersistenceKey=_persistenceKeyName("persistence",n.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);return e?UserImpl._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new PersistenceUserManager(_getInstance(InMemoryPersistence),e,i);let n=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e),s=n[0]||_getInstance(InMemoryPersistence),o=_persistenceKeyName(i,e.config.apiKey,e.name),l=null;for(let i of t)try{let t=await i._get(o);if(t){let n=UserImpl._fromJSON(e,t);i!==s&&(l=n),s=i;break}}catch(e){}let h=n.filter(e=>e._shouldAllowMigration);return s._shouldAllowMigration&&h.length&&(s=h[0],l&&await s._set(o,l.toJSON()),await Promise.all(t.map(async e=>{if(e!==s)try{await e._remove(o)}catch(e){}}))),new PersistenceUserManager(s,e,i)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getBrowserName(e){let t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(_isIEMobile(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";{if(t.includes("edge/"))return"Edge";if(_isFirefox(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(_isBlackBerry(t))return"Blackberry";if(_isWebOS(t))return"Webos";if(_isSafari(t))return"Safari";if((t.includes("chrome/")||_isChromeIOS(t))&&!t.includes("edge/"))return"Chrome";if(_isAndroid(t))return"Android";let i=e.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);if((null==i?void 0:i.length)===2)return i[1]}return"Other"}function _isFirefox(e=index_esm2017_getUA()){return/firefox\//i.test(e)}function _isSafari(e=index_esm2017_getUA()){let t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function _isChromeIOS(e=index_esm2017_getUA()){return/crios\//i.test(e)}function _isIEMobile(e=index_esm2017_getUA()){return/iemobile/i.test(e)}function _isAndroid(e=index_esm2017_getUA()){return/android/i.test(e)}function _isBlackBerry(e=index_esm2017_getUA()){return/blackberry/i.test(e)}function _isWebOS(e=index_esm2017_getUA()){return/webos/i.test(e)}function _isIOS(e=index_esm2017_getUA()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function _isIOSStandalone(e=index_esm2017_getUA()){var t;return _isIOS(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}function _isIE10(){return isIE()&&10===document.documentMode}function _isMobileBrowser(e=index_esm2017_getUA()){return _isIOS(e)||_isAndroid(e)||_isWebOS(e)||_isBlackBerry(e)||/windows phone/i.test(e)||_isIEMobile(e)}function _isIframe(){try{return!!(window&&window!==window.top)}catch(e){return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getClientVersion(e,t=[]){let i;switch(e){case"Browser":i=_getBrowserName(index_esm2017_getUA());break;case"Worker":i=`${_getBrowserName(index_esm2017_getUA())}-${e}`;break;default:i=e}let n=t.length?t.join(","):"FirebaseCore-web";return`${i}/JsCore/${eT}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthMiddlewareQueue=class AuthMiddlewareQueue{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let wrappedCallback=t=>new Promise((i,n)=>{try{let n=e(t);i(n)}catch(e){n(e)}});wrappedCallback.onAbort=t,this.queue.push(wrappedCallback);let i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(e){for(let e of(t.reverse(),t))try{e()}catch(e){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==e?void 0:e.message})}}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _getPasswordPolicy(e,t={}){return _performApiRequest(e,"GET","/v2/passwordPolicy",_addTidIfNecessary(e,t))}let PasswordPolicyImpl=class PasswordPolicyImpl{constructor(e){var t,i,n,s;let o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=null!==(t=o.minPasswordLength)&&void 0!==t?t:6,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),void 0!==o.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),void 0!==o.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),void 0!==o.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),void 0!==o.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=null!==(n=null===(i=e.allowedNonAlphanumericCharacters)||void 0===i?void 0:i.join(""))&&void 0!==n?n:"",this.forceUpgradeOnSignin=null!==(s=e.forceUpgradeOnSignin)&&void 0!==s&&s,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,i,n,s,o,l;let h={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,h),this.validatePasswordCharacterOptions(e,h),h.isValid&&(h.isValid=null===(t=h.meetsMinPasswordLength)||void 0===t||t),h.isValid&&(h.isValid=null===(i=h.meetsMaxPasswordLength)||void 0===i||i),h.isValid&&(h.isValid=null===(n=h.containsLowercaseLetter)||void 0===n||n),h.isValid&&(h.isValid=null===(s=h.containsUppercaseLetter)||void 0===s||s),h.isValid&&(h.isValid=null===(o=h.containsNumericCharacter)||void 0===o||o),h.isValid&&(h.isValid=null===(l=h.containsNonAlphanumericCharacter)||void 0===l||l),h}validatePasswordLengthOptions(e,t){let i=this.customStrengthOptions.minPasswordLength,n=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),n&&(t.meetsMaxPasswordLength=e.length<=n)}validatePasswordCharacterOptions(e,t){let i;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let n=0;n<e.length;n++)i=e.charAt(n),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,n,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=n)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthImpl=class AuthImpl{constructor(e,t,i,n){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=n,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Subscription(this),this.idTokenSubscription=new Subscription(this),this.beforeStateQueue=new AuthMiddlewareQueue(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=tO,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=n.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=_getInstance(t)),this._initializationPromise=this.queue(async()=>{var i,n;if(!this._deleted&&(this.persistenceManager=await PersistenceUserManager.create(this,e),!this._deleted)){if(null===(i=this._popupRedirectResolver)||void 0===i?void 0:i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(e){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(n=this.currentUser)||void 0===n?void 0:n.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(this.currentUser||e){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUser(e){var t;let i=await this.assertedPersistence.getCurrentUser(),n=i,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let i=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,o=null==n?void 0:n._redirectEventId,l=await this.tryRedirectSignIn(e);(!i||i===o)&&(null==l?void 0:l.user)&&(n=l.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(e){n=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(e))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return(_assert(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId)?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(e){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _reloadWithoutSaving(e)}catch(e){if((null==e?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=_getUserLanguage()}async _delete(){this._deleted=!0}async updateCurrentUser(e){let t=e?index_esm2017_getModularInstance(e):null;return t&&_assert(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_assert(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0)}setPersistence(e){return this.queue(async()=>{await this.assertedPersistence.setPersistence(_getInstance(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await _getPasswordPolicy(this),t=new PasswordPolicyImpl(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ErrorFactory("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let i=this.onAuthStateChanged(()=>{i(),e()},t)}})}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){let i=await this.getOrInitRedirectPersistenceManager(t);return null===e?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&_getInstance(e)||this._popupRedirectResolver;_assert(t,this,"argument-error"),this.redirectPersistenceManager=await PersistenceUserManager.create(this,[_getInstance(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return(this._isInitialized&&await this.queue(async()=>{}),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e)?this._currentUser:(null===(i=this.redirectUser)||void 0===i?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let i=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,n){if(this._deleted)return()=>{};let s="function"==typeof t?t:t.next.bind(t),o=!1,l=this._isInitialized?Promise.resolve():this._initializationPromise;if(_assert(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),"function"==typeof t){let s=e.addObserver(t,i,n);return()=>{o=!0,s()}}{let i=e.addObserver(t);return()=>{o=!0,i()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _assert(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=_getClientVersion(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;let t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);let i=await (null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());i&&(t["X-Firebase-Client"]=i);let n=await this._getAppCheckToken();return n&&(t["X-Firebase-AppCheck"]=n),t}async _getAppCheckToken(){var e;let t=await (null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null==t?void 0:t.error)&&_logWarn(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}};let Subscription=class Subscription{constructor(e){this.auth=e,this.observer=null,this.addObserver=createSubscribe(e=>this.observer=e)}get next(){return _assert(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getScriptParentElement(){var e,t;return null!==(t=null===(e=document.getElementsByTagName("head"))||void 0===e?void 0:e[0])&&void 0!==t?t:document}function _loadJS(e){return new Promise((t,i)=>{let n=document.createElement("script");n.setAttribute("src",e),n.onload=t,n.onerror=e=>{let t=_createError("internal-error");t.customData=e,i(t)},n.type="text/javascript",n.charset="UTF-8",getScriptParentElement().appendChild(n)})}function _generateCallbackName(e){return`__${e}${Math.floor(1e6*Math.random())}`}let RecaptchaEnterpriseVerifier=class RecaptchaEnterpriseVerifier{constructor(e){this.type="recaptcha-enterprise",this.auth=index_esm2017_getModularInstance(e)}async verify(e="verify",t=!1){async function retrieveSiteKey(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,i)=>{getRecaptchaConfig(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(n=>{if(void 0===n.recaptchaKey)i(Error("recaptcha Enterprise site key undefined"));else{let i=new RecaptchaConfig(n);return null==e.tenantId?e._agentRecaptchaConfig=i:e._tenantRecaptchaConfigs[e.tenantId]=i,t(i.siteKey)}}).catch(e=>{i(e)})})}function retrieveRecaptchaToken(t,i,n){let s=window.grecaptcha;isEnterprise(s)?s.enterprise.ready(()=>{s.enterprise.execute(t,{action:e}).then(e=>{i(e)}).catch(()=>{i("NO_RECAPTCHA")})}):n(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((e,i)=>{retrieveSiteKey(this.auth).then(n=>{if(!t&&isEnterprise(window.grecaptcha))retrieveRecaptchaToken(n,e,i);else{if("undefined"==typeof window){i(Error("RecaptchaVerifier is only supported in browser"));return}_loadJS("https://www.google.com/recaptcha/enterprise.js?render="+n).then(()=>{retrieveRecaptchaToken(n,e,i)}).catch(e=>{i(e)})}}).catch(e=>{i(e)})})}};async function injectRecaptchaFields(e,t,i,n=!1){let s;let o=new RecaptchaEnterpriseVerifier(e);try{s=await o.verify(i)}catch(e){s=await o.verify(i,!0)}let l=Object.assign({},t);return n?Object.assign(l,{captchaResp:s}):Object.assign(l,{captchaResponse:s}),Object.assign(l,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(l,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function initializeAuth(e,t){let i=index_esm2017_getProvider(e,"auth");if(i.isInitialized()){let e=i.getImmediate(),n=i.getOptions();if(index_esm2017_deepEqual(n,null!=t?t:{}))return e;_fail(e,"already-initialized")}let n=i.initialize({options:t});return n}function _initializeAuthInstance(e,t){let i=(null==t?void 0:t.persistence)||[],n=(Array.isArray(i)?i:[i]).map(_getInstance);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(n,null==t?void 0:t.popupRedirectResolver)}function connectAuthEmulator(e,t,i){let n=index_esm2017_getModularInstance(e);_assert(n._canInitEmulator,n,"emulator-config-failed"),_assert(/^https?:\/\//.test(t),n,"invalid-emulator-scheme");let s=!!(null==i?void 0:i.disableWarnings),o=extractProtocol(t),{host:l,port:h}=extractHostAndPort(t),u=null===h?"":`:${h}`;n.config.emulator={url:`${o}//${l}${u}/`},n.settings.appVerificationDisabledForTesting=!0,n.emulatorConfig=Object.freeze({host:l,port:h,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})}),s||emitEmulatorWarning()}function extractProtocol(e){let t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function extractHostAndPort(e){let t=extractProtocol(e),i=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!i)return{host:"",port:null};let n=i[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){let e=s[1];return{host:e,port:parsePort(n.substr(e.length+1))}}{let[e,t]=n.split(":");return{host:e,port:parsePort(t)}}}function parsePort(e){if(!e)return null;let t=Number(e);return isNaN(t)?null:t}function emitEmulatorWarning(){function attachBanner(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",attachBanner):attachBanner())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthCredential=class AuthCredential{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return debugFail("not implemented")}_getIdTokenResponse(e){return debugFail("not implemented")}_linkToIdToken(e,t){return debugFail("not implemented")}_getReauthenticationResolver(e){return debugFail("not implemented")}};async function updateEmailPassword(e,t){return _performApiRequest(e,"POST","/v1/accounts:update",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithPassword(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithPassword",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithEmailLink$1(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithEmailLink",_addTidIfNecessary(e,t))}async function signInWithEmailLinkForLinking(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithEmailLink",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let EmailAuthCredential=class EmailAuthCredential extends AuthCredential{constructor(e,t,i,n=null){super("password",i),this._email=e,this._password=t,this._tenantId=n}static _fromEmailAndPassword(e,t){return new EmailAuthCredential(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new EmailAuthCredential(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){var t;switch(this.signInMethod){case"password":let i={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};if(null===(t=e._getRecaptchaConfig())||void 0===t||!t.emailPasswordEnabled)return signInWithPassword(e,i).catch(async t=>{if("auth/missing-recaptcha-token"!==t.code)return Promise.reject(t);{console.log("Sign-in with email address and password is protected by reCAPTCHA for this project. Automatically triggering the reCAPTCHA flow and restarting the sign-in flow.");let t=await injectRecaptchaFields(e,i,"signInWithPassword");return signInWithPassword(e,t)}});{let t=await injectRecaptchaFields(e,i,"signInWithPassword");return signInWithPassword(e,t)}case"emailLink":return signInWithEmailLink$1(e,{email:this._email,oobCode:this._password});default:_fail(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return updateEmailPassword(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password});case"emailLink":return signInWithEmailLinkForLinking(e,{idToken:t,email:this._email,oobCode:this._password});default:_fail(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithIdp(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithIdp",_addTidIfNecessary(e,t))}let OAuthCredential=class OAuthCredential extends AuthCredential{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new OAuthCredential(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):_fail("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e,{providerId:i,signInMethod:n}=t,s=__rest(t,["providerId","signInMethod"]);if(!i||!n)return null;let o=new OAuthCredential(i,n);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){let t=this.buildRequest();return signInWithIdp(e,t)}_linkToIdToken(e,t){let i=this.buildRequest();return i.idToken=t,signInWithIdp(e,i)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,signInWithIdp(e,t)}buildRequest(){let e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=index_esm2017_querystring(t)}return e}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sendPhoneVerificationCode(e,t){return _performApiRequest(e,"POST","/v1/accounts:sendVerificationCode",_addTidIfNecessary(e,t))}async function signInWithPhoneNumber$1(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,t))}async function linkWithPhoneNumber$1(e,t){let i=await _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,t));if(i.temporaryProof)throw _makeTaggedError(e,"account-exists-with-different-credential",i);return i}let tM={USER_NOT_FOUND:"user-not-found"};async function verifyPhoneNumberForExisting(e,t){let i=Object.assign(Object.assign({},t),{operation:"REAUTH"});return _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,i),tM)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PhoneAuthCredential=class PhoneAuthCredential extends AuthCredential{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new PhoneAuthCredential({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new PhoneAuthCredential({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return signInWithPhoneNumber$1(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return linkWithPhoneNumber$1(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return verifyPhoneNumberForExisting(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:i,verificationCode:n}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:i,code:n}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"==typeof e&&(e=JSON.parse(e));let{verificationId:t,verificationCode:i,phoneNumber:n,temporaryProof:s}=e;return i||t||n||s?new PhoneAuthCredential({verificationId:t,verificationCode:i,phoneNumber:n,temporaryProof:s}):null}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function parseMode(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function parseDeepLink(e){let t=querystringDecode(extractQuerystring(e)).link,i=t?querystringDecode(extractQuerystring(t)).deep_link_id:null,n=querystringDecode(extractQuerystring(e)).deep_link_id,s=n?querystringDecode(extractQuerystring(n)).link:null;return s||n||i||t||e}let ActionCodeURL=class ActionCodeURL{constructor(e){var t,i,n,s,o,l;let h=querystringDecode(extractQuerystring(e)),u=null!==(t=h.apiKey)&&void 0!==t?t:null,d=null!==(i=h.oobCode)&&void 0!==i?i:null,f=parseMode(null!==(n=h.mode)&&void 0!==n?n:null);_assert(u&&d&&f,"argument-error"),this.apiKey=u,this.operation=f,this.code=d,this.continueUrl=null!==(s=h.continueUrl)&&void 0!==s?s:null,this.languageCode=null!==(o=h.languageCode)&&void 0!==o?o:null,this.tenantId=null!==(l=h.tenantId)&&void 0!==l?l:null}static parseLink(e){let t=parseDeepLink(e);try{return new ActionCodeURL(t)}catch(e){return null}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let EmailAuthProvider=class EmailAuthProvider{constructor(){this.providerId=EmailAuthProvider.PROVIDER_ID}static credential(e,t){return EmailAuthCredential._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let i=ActionCodeURL.parseLink(t);return _assert(i,"argument-error"),EmailAuthCredential._fromEmailAndCode(e,i.code,i.tenantId)}};EmailAuthProvider.PROVIDER_ID="password",EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD="password",EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FederatedAuthProvider=class FederatedAuthProvider{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BaseOAuthProvider=class BaseOAuthProvider extends FederatedAuthProvider{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FacebookAuthProvider=class FacebookAuthProvider extends BaseOAuthProvider{constructor(){super("facebook.com")}static credential(e){return OAuthCredential._fromParams({providerId:FacebookAuthProvider.PROVIDER_ID,signInMethod:FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return FacebookAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return FacebookAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return FacebookAuthProvider.credential(e.oauthAccessToken)}catch(e){return null}}};FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD="facebook.com",FacebookAuthProvider.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let GoogleAuthProvider=class GoogleAuthProvider extends BaseOAuthProvider{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return OAuthCredential._fromParams({providerId:GoogleAuthProvider.PROVIDER_ID,signInMethod:GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return GoogleAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return GoogleAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return GoogleAuthProvider.credential(t,i)}catch(e){return null}}};GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD="google.com",GoogleAuthProvider.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let GithubAuthProvider=class GithubAuthProvider extends BaseOAuthProvider{constructor(){super("github.com")}static credential(e){return OAuthCredential._fromParams({providerId:GithubAuthProvider.PROVIDER_ID,signInMethod:GithubAuthProvider.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return GithubAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return GithubAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return GithubAuthProvider.credential(e.oauthAccessToken)}catch(e){return null}}};GithubAuthProvider.GITHUB_SIGN_IN_METHOD="github.com",GithubAuthProvider.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let TwitterAuthProvider=class TwitterAuthProvider extends BaseOAuthProvider{constructor(){super("twitter.com")}static credential(e,t){return OAuthCredential._fromParams({providerId:TwitterAuthProvider.PROVIDER_ID,signInMethod:TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return TwitterAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return TwitterAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return TwitterAuthProvider.credential(t,i)}catch(e){return null}}};TwitterAuthProvider.TWITTER_SIGN_IN_METHOD="twitter.com",TwitterAuthProvider.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let UserCredentialImpl=class UserCredentialImpl{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,n=!1){let s=await UserImpl._fromIdTokenResponse(e,i,n),o=providerIdForResponse(i),l=new UserCredentialImpl({user:s,providerId:o,_tokenResponse:i,operationType:t});return l}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);let n=providerIdForResponse(i);return new UserCredentialImpl({user:e,providerId:n,_tokenResponse:i,operationType:t})}};function providerIdForResponse(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let MultiFactorError=class MultiFactorError extends FirebaseError{constructor(e,t,i,n){var s;super(t.code,t.message),this.operationType=i,this.user=n,Object.setPrototypeOf(this,MultiFactorError.prototype),this.customData={appName:e.name,tenantId:null!==(s=e.tenantId)&&void 0!==s?s:void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,n){return new MultiFactorError(e,t,i,n)}};function _processCredentialSavingMfaContextIfNecessary(e,t,i,n){let s="reauthenticate"===t?i._getReauthenticationResolver(e):i._getIdTokenResponse(e);return s.catch(i=>{if("auth/multi-factor-auth-required"===i.code)throw MultiFactorError._fromErrorAndOperation(e,i,t,n);throw i})}async function _link$1(e,t,i=!1){let n=await _logoutIfInvalidated(e,t._linkToIdToken(e.auth,await e.getIdToken()),i);return UserCredentialImpl._forOperation(e,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _reauthenticate(e,t,i=!1){let{auth:n}=e,s="reauthenticate";try{let o=await _logoutIfInvalidated(e,_processCredentialSavingMfaContextIfNecessary(n,s,t,e),i);_assert(o.idToken,n,"internal-error");let l=_parseToken(o.idToken);_assert(l,n,"internal-error");let{sub:h}=l;return _assert(e.uid===h,n,"user-mismatch"),UserCredentialImpl._forOperation(e,s,o)}catch(e){throw(null==e?void 0:e.code)==="auth/user-not-found"&&_fail(n,"user-mismatch"),e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _signInWithCredential(e,t,i=!1){let n="signIn",s=await _processCredentialSavingMfaContextIfNecessary(e,n,t),o=await UserCredentialImpl._fromIdTokenResponse(e,n,s);return i||await e._updateCurrentUser(o.user),o}function onIdTokenChanged(e,t,i,n){return index_esm2017_getModularInstance(e).onIdTokenChanged(t,i,n)}function beforeAuthStateChanged(e,t,i){return index_esm2017_getModularInstance(e).beforeAuthStateChanged(t,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function startEnrollPhoneMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:start",_addTidIfNecessary(e,t))}function finalizeEnrollPhoneMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:finalize",_addTidIfNecessary(e,t))}function startEnrollTotpMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:start",_addTidIfNecessary(e,t))}function finalizeEnrollTotpMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:finalize",_addTidIfNecessary(e,t))}new WeakMap;let tU="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BrowserPersistenceClass=class BrowserPersistenceClass{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{if(!this.storage)return Promise.resolve(!1);return this.storage.setItem(tU,"1"),this.storage.removeItem(tU),Promise.resolve(!0)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _iframeCannotSyncWebStorage(){let e=index_esm2017_getUA();return _isSafari(e)||_isIOS(e)}let BrowserLocalPersistence=class BrowserLocalPersistence extends BrowserPersistenceClass{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=_iframeCannotSyncWebStorage()&&_isIframe(),this.fallbackToPolling=_isMobileBrowser(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let i=this.storage.getItem(t),n=this.localCache[t];i!==n&&e(t,n,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((e,t,i)=>{this.notifyListeners(e,i)});return}let i=e.key;if(t?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){let n=this.storage.getItem(i);if(e.newValue!==n)null!==e.newValue?this.storage.setItem(i,e.newValue):this.storage.removeItem(i);else if(this.localCache[i]===e.newValue&&!t)return}let triggerListeners=()=>{let e=this.storage.getItem(i);(t||this.localCache[i]!==e)&&this.notifyListeners(i,e)},n=this.storage.getItem(i);_isIE10()&&n!==e.newValue&&e.newValue!==e.oldValue?setTimeout(triggerListeners,10):triggerListeners()}notifyListeners(e,t){this.localCache[e]=t;let i=this.listeners[e];if(i)for(let e of Array.from(i))e(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};BrowserLocalPersistence.type="LOCAL";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BrowserSessionPersistence=class BrowserSessionPersistence extends BrowserPersistenceClass{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _allSettled(e){return Promise.all(e.map(async e=>{try{let t=await e;return{fulfilled:!0,value:t}}catch(e){return{fulfilled:!1,reason:e}}}))}BrowserSessionPersistence.type="SESSION";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Receiver=class Receiver{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;let i=new Receiver(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let{eventId:t,eventType:i,data:n}=e.data,s=this.handlersMap[i];if(!(null==s?void 0:s.size))return;e.ports[0].postMessage({status:"ack",eventId:t,eventType:i});let o=Array.from(s).map(async t=>t(e.origin,n)),l=await _allSettled(o);e.ports[0].postMessage({status:"done",eventId:t,eventType:i,response:l})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _generateEventId(e="",t=10){let i="";for(let e=0;e<t;e++)i+=Math.floor(10*Math.random());return e+i}Receiver.receivers=[];/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Sender=class Sender{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){let n,s;let o="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!o)throw Error("connection_unavailable");return new Promise((l,h)=>{let u=_generateEventId("",20);o.port1.start();let d=setTimeout(()=>{h(Error("unsupported_event"))},i);s={messageChannel:o,onMessage(e){if(e.data.eventId===u)switch(e.data.status){case"ack":clearTimeout(d),n=setTimeout(()=>{h(Error("timeout"))},3e3);break;case"done":clearTimeout(n),l(e.data.response);break;default:clearTimeout(d),clearTimeout(n),h(Error("invalid_response"))}}},this.handlers.add(s),o.port1.addEventListener("message",s.onMessage),this.target.postMessage({eventType:e,eventId:u,data:t},[o.port2])}).finally(()=>{s&&this.removeMessageHandler(s)})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _window(){return window}function _setWindowLocation(e){_window().location.href=e}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _isWorker(){return void 0!==_window().WorkerGlobalScope&&"function"==typeof _window().importScripts}async function _getActiveServiceWorker(){if(!(null==navigator?void 0:navigator.serviceWorker))return null;try{let e=await navigator.serviceWorker.ready;return e.active}catch(e){return null}}function _getServiceWorkerController(){var e;return(null===(e=null==navigator?void 0:navigator.serviceWorker)||void 0===e?void 0:e.controller)||null}function _getWorkerGlobalScope(){return _isWorker()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tF="firebaseLocalStorageDb",tj="firebaseLocalStorage",tV="fbase_key";let DBPromise=class DBPromise{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function getObjectStore(e,t){return e.transaction([tj],t?"readwrite":"readonly").objectStore(tj)}function _deleteDatabase(){let e=indexedDB.deleteDatabase(tF);return new DBPromise(e).toPromise()}function _openDatabase(){let e=indexedDB.open(tF,1);return new Promise((t,i)=>{e.addEventListener("error",()=>{i(e.error)}),e.addEventListener("upgradeneeded",()=>{let t=e.result;try{t.createObjectStore(tj,{keyPath:tV})}catch(e){i(e)}}),e.addEventListener("success",async()=>{let i=e.result;i.objectStoreNames.contains(tj)?t(i):(i.close(),await _deleteDatabase(),t(await _openDatabase()))})})}async function _putObject(e,t,i){let n=getObjectStore(e,!0).put({[tV]:t,value:i});return new DBPromise(n).toPromise()}async function getObject(e,t){let i=getObjectStore(e,!1).get(t),n=await new DBPromise(i).toPromise();return void 0===n?null:n.value}function _deleteObject(e,t){let i=getObjectStore(e,!0).delete(t);return new DBPromise(i).toPromise()}let IndexedDBLocalPersistence=class IndexedDBLocalPersistence{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await _openDatabase()),this.db}async _withRetries(e){let t=0;for(;;)try{let t=await this._openDb();return await e(t)}catch(e){if(t++>3)throw e;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return _isWorker()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Receiver._getInstance(_getWorkerGlobalScope()),this.receiver._subscribe("keyChanged",async(e,t)=>{let i=await this._poll();return{keyProcessed:i.includes(t.key)}}),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await _getActiveServiceWorker(),!this.activeServiceWorker)return;this.sender=new Sender(this.activeServiceWorker);let i=await this.sender._send("ping",{},800);i&&(null===(e=i[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=i[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(this.sender&&this.activeServiceWorker&&_getServiceWorkerController()===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(e){}}async _isAvailable(){try{if(!indexedDB)return!1;let e=await _openDatabase();return await _putObject(e,tU,"1"),await _deleteObject(e,tU),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>_putObject(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(t=>getObject(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>_deleteObject(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){let e=await this._withRetries(e=>{let t=getObjectStore(e,!1).getAll();return new DBPromise(t).toPromise()});if(!e||0!==this.pendingWrites)return[];let t=[],i=new Set;for(let{fbase_key:n,value:s}of e)i.add(n),JSON.stringify(this.localCache[n])!==JSON.stringify(s)&&(this.notifyListeners(n,s),t.push(n));for(let e of Object.keys(this.localCache))this.localCache[e]&&!i.has(e)&&(this.notifyListeners(e,null),t.push(e));return t}notifyListeners(e,t){this.localCache[e]=t;let i=this.listeners[e];if(i)for(let e of Array.from(i))e(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function startSignInPhoneMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:start",_addTidIfNecessary(e,t))}function finalizeSignInPhoneMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:finalize",_addTidIfNecessary(e,t))}function finalizeSignInTotpMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:finalize",_addTidIfNecessary(e,t))}async function _verifyPhoneNumber(e,t,i){var n;let s=await i.verify();try{let o;if(_assert("string"==typeof s,e,"argument-error"),_assert("recaptcha"===i.type,e,"argument-error"),o="string"==typeof t?{phoneNumber:t}:t,"session"in o){let t=o.session;if("phoneNumber"in o){_assert("enroll"===t.type,e,"internal-error");let i=await startEnrollPhoneMfa(e,{idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:o.phoneNumber,recaptchaToken:s}});return i.phoneSessionInfo.sessionInfo}{_assert("signin"===t.type,e,"internal-error");let i=(null===(n=o.multiFactorHint)||void 0===n?void 0:n.uid)||o.multiFactorUid;_assert(i,e,"missing-multi-factor-info");let l=await startSignInPhoneMfa(e,{mfaPendingCredential:t.credential,mfaEnrollmentId:i,phoneSignInInfo:{recaptchaToken:s}});return l.phoneResponseInfo.sessionInfo}}{let{sessionInfo:t}=await sendPhoneVerificationCode(e,{phoneNumber:o.phoneNumber,recaptchaToken:s});return t}}finally{i._reset()}}IndexedDBLocalPersistence.type="LOCAL",_generateCallbackName("rcb"),new Delay(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PhoneAuthProvider=class PhoneAuthProvider{constructor(e){this.providerId=PhoneAuthProvider.PROVIDER_ID,this.auth=index_esm2017_getModularInstance(e)}verifyPhoneNumber(e,t){return _verifyPhoneNumber(this.auth,e,index_esm2017_getModularInstance(t))}static credential(e,t){return PhoneAuthCredential._fromVerification(e,t)}static credentialFromResult(e){return PhoneAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return PhoneAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:i}=e;return t&&i?PhoneAuthCredential._fromTokenResponse(t,i):null}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _withDefaultResolver(e,t){return t?_getInstance(t):(_assert(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}PhoneAuthProvider.PROVIDER_ID="phone",PhoneAuthProvider.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let IdpCredential=class IdpCredential extends AuthCredential{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return signInWithIdp(e,this._buildIdpRequest())}_linkToIdToken(e,t){return signInWithIdp(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return signInWithIdp(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function _signIn(e){return _signInWithCredential(e.auth,new IdpCredential(e),e.bypassAuthState)}function _reauth(e){let{auth:t,user:i}=e;return _assert(i,t,"internal-error"),_reauthenticate(i,new IdpCredential(e),e.bypassAuthState)}async function _link(e){let{auth:t,user:i}=e;return _assert(i,t,"internal-error"),_link$1(i,new IdpCredential(e),e.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AbstractPopupRedirectOperation=class AbstractPopupRedirectOperation{constructor(e,t,i,n,s=!1){this.auth=e,this.resolver=i,this.user=n,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(e){this.reject(e)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:i,postBody:n,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}let h={auth:this.auth,requestUri:t,sessionId:i,tenantId:s||void 0,postBody:n||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(h))}catch(e){this.reject(e)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return _signIn;case"linkViaPopup":case"linkViaRedirect":return _link;case"reauthViaPopup":case"reauthViaRedirect":return _reauth;default:_fail(this.auth,"internal-error")}}resolve(e){this.pendingPromise||debugFail("Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){this.pendingPromise||debugFail("Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tB=new Delay(2e3,1e4);let PopupOperation=class PopupOperation extends AbstractPopupRedirectOperation{constructor(e,t,i,n,s){super(e,t,n,s),this.provider=i,this.authWindow=null,this.pollId=null,PopupOperation.currentPopupAction&&PopupOperation.currentPopupAction.cancel(),PopupOperation.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return _assert(e,this.auth,"internal-error"),e}async onExecution(){1===this.filter.length||debugFail("Popup operations only handle one event");let e=_generateEventId();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(_createError(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(_createError(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,PopupOperation.currentPopupAction=null}pollUserCancellation(){let poll=()=>{var e,t;if(null===(t=null===(e=this.authWindow)||void 0===e?void 0:e.window)||void 0===t?void 0:t.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(_createError(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(poll,tB.get())};poll()}};PopupOperation.currentPopupAction=null;let tW=new Map;let RedirectAction=class RedirectAction extends AbstractPopupRedirectOperation{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=tW.get(this.auth._key());if(!e){try{let t=await _getAndClearPendingRedirectStatus(this.resolver,this.auth),i=t?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}tW.set(this.auth._key(),e)}return this.bypassAuthState||tW.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"===e.type){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function _getAndClearPendingRedirectStatus(e,t){let i=pendingRedirectKey(t),n=resolverPersistence(e);if(!await n._isAvailable())return!1;let s=await n._get(i)==="true";return await n._remove(i),s}function _overrideRedirectResult(e,t){tW.set(e._key(),t)}function resolverPersistence(e){return _getInstance(e._redirectPersistence)}function pendingRedirectKey(e){return _persistenceKeyName("pendingRedirect",e.config.apiKey,e.name)}async function _getRedirectResult(e,t,i=!1){let n=index_esm2017_getModularInstance(e),s=_withDefaultResolver(n,t),o=new RedirectAction(n,s,i),l=await o.execute();return l&&!i&&(delete l.user._redirectEventId,await n._persistUserIfCurrent(l.user),await n._setRedirectUser(null,t)),l}let AuthEventManager=class AuthEventManager{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!isRedirectEvent(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!isNullRedirectEvent(e)){let n=(null===(i=e.error.code)||void 0===i?void 0:i.split("auth/")[1])||"internal-error";t.onError(_createError(this.auth,n))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let i=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(eventUid(e))}saveEventToCache(e){this.cachedEventUids.add(eventUid(e)),this.lastProcessedEventTime=Date.now()}};function eventUid(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function isNullRedirectEvent({type:e,error:t}){return"unknown"===e&&(null==t?void 0:t.code)==="auth/no-auth-event"}function isRedirectEvent(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return isNullRedirectEvent(e);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _getProjectConfig(e,t={}){return _performApiRequest(e,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tH=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,tz=/^https?/;async function _validateOrigin(e){if(e.config.emulator)return;let{authorizedDomains:t}=await _getProjectConfig(e);for(let e of t)try{if(matchDomain(e))return}catch(e){}_fail(e,"unauthorized-domain")}function matchDomain(e){let t=_getCurrentUrl(),{protocol:i,hostname:n}=new URL(t);if(e.startsWith("chrome-extension://")){let s=new URL(e);return""===s.hostname&&""===n?"chrome-extension:"===i&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===i&&s.hostname===n}if(!tz.test(i))return!1;if(tH.test(e))return n===e;let s=e.replace(/\./g,"\\."),o=RegExp("^(.+\\."+s+"|"+s+")$","i");return o.test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tq=new Delay(3e4,6e4);function resetUnloadedGapiModules(){let e=_window().___jsl;if(null==e?void 0:e.H){for(let t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let t=0;t<e.CP.length;t++)e.CP[t]=null}}function loadGapi(e){return new Promise((t,i)=>{var n,s,o;function loadGapiIframe(){resetUnloadedGapiModules(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{resetUnloadedGapiModules(),i(_createError(e,"network-request-failed"))},timeout:tq.get()})}if(null===(s=null===(n=_window().gapi)||void 0===n?void 0:n.iframes)||void 0===s?void 0:s.Iframe)t(gapi.iframes.getContext());else if(null===(o=_window().gapi)||void 0===o?void 0:o.load)loadGapiIframe();else{let t=_generateCallbackName("iframefcb");return _window()[t]=()=>{gapi.load?loadGapiIframe():i(_createError(e,"network-request-failed"))},_loadJS(`https://apis.google.com/js/api.js?onload=${t}`).catch(e=>i(e))}}).catch(e=>{throw tK=null,e})}let tK=null;function _loadGapi(e){return tK=tK||loadGapi(e)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tG=new Delay(5e3,15e3),t$={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},tJ=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function getIframeUrl(e){let t=e.config;_assert(t.authDomain,e,"auth-domain-config-required");let i=t.emulator?_emulatorUrl(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,n={apiKey:t.apiKey,appName:e.name,v:eT},s=tJ.get(e.config.apiHost);s&&(n.eid=s);let o=e._getFrameworks();return o.length&&(n.fw=o.join(",")),`${i}?${index_esm2017_querystring(n).slice(1)}`}async function _openIframe(e){let t=await _loadGapi(e),i=_window().gapi;return _assert(i,e,"internal-error"),t.open({where:document.body,url:getIframeUrl(e),messageHandlersFilter:i.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:t$,dontclear:!0},t=>new Promise(async(i,n)=>{await t.restyle({setHideOnLeave:!1});let s=_createError(e,"network-request-failed"),o=_window().setTimeout(()=>{n(s)},tG.get());function clearTimerAndResolve(){_window().clearTimeout(o),i(t)}t.ping(clearTimerAndResolve).then(clearTimerAndResolve,()=>{n(s)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tX={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};let AuthPopup=class AuthPopup{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}};function _open(e,t,i,n=500,s=600){let o=Math.max((window.screen.availHeight-s)/2,0).toString(),l=Math.max((window.screen.availWidth-n)/2,0).toString(),h="",u=Object.assign(Object.assign({},tX),{width:n.toString(),height:s.toString(),top:o,left:l}),d=index_esm2017_getUA().toLowerCase();i&&(h=_isChromeIOS(d)?"_blank":i),_isFirefox(d)&&(t=t||"http://localhost",u.scrollbars="yes");let f=Object.entries(u).reduce((e,[t,i])=>`${e}${t}=${i},`,"");if(_isIOSStandalone(d)&&"_self"!==h)return openAsNewWindowIOS(t||"",h),new AuthPopup(null);let g=window.open(t||"",h,f);_assert(g,e,"popup-blocked");try{g.focus()}catch(e){}return new AuthPopup(g)}function openAsNewWindowIOS(e,t){let i=document.createElement("a");i.href=e,i.target=t;let n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),i.dispatchEvent(n)}let tY=encodeURIComponent("fac");async function _getRedirectUrl(e,t,i,n,s,o){_assert(e.config.authDomain,e,"auth-domain-config-required"),_assert(e.config.apiKey,e,"invalid-api-key");let l={apiKey:e.config.apiKey,appName:e.name,authType:i,redirectUrl:n,v:eT,eventId:s};if(t instanceof FederatedAuthProvider)for(let[i,n]of(t.setDefaultLanguage(e.languageCode),l.providerId=t.providerId||"",isEmpty(t.getCustomParameters())||(l.customParameters=JSON.stringify(t.getCustomParameters())),Object.entries(o||{})))l[i]=n;if(t instanceof BaseOAuthProvider){let e=t.getScopes().filter(e=>""!==e);e.length>0&&(l.scopes=e.join(","))}for(let t of(e.tenantId&&(l.tid=e.tenantId),Object.keys(l)))void 0===l[t]&&delete l[t];let h=await e._getAppCheckToken(),u=h?`#${tY}=${encodeURIComponent(h)}`:"";return`${getHandlerBase(e)}?${index_esm2017_querystring(l).slice(1)}${u}`}function getHandlerBase({config:e}){return e.emulator?_emulatorUrl(e,"emulator/auth/handler"):`https://${e.authDomain}/__/auth/handler`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tQ="webStorageSupport";let BrowserPopupRedirectResolver=class BrowserPopupRedirectResolver{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=BrowserSessionPersistence,this._completeRedirectFn=_getRedirectResult,this._overrideRedirectResult=_overrideRedirectResult}async _openPopup(e,t,i,n){var s;(null===(s=this.eventManagers[e._key()])||void 0===s?void 0:s.manager)||debugFail("_initialize() not called before _openPopup()");let o=await _getRedirectUrl(e,t,i,_getCurrentUrl(),n);return _open(e,o,_generateEventId())}async _openRedirect(e,t,i,n){await this._originValidation(e);let s=await _getRedirectUrl(e,t,i,_getCurrentUrl(),n);return _setWindowLocation(s),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:e,promise:i}=this.eventManagers[t];return e?Promise.resolve(e):(i||debugFail("If manager is not set, promise should be"),i)}let i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){let t=await _openIframe(e),i=new AuthEventManager(e);return t.register("authEvent",t=>{_assert(null==t?void 0:t.authEvent,e,"invalid-auth-event");let n=i.onEvent(t.authEvent);return{status:n?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){let i=this.iframes[e._key()];i.send(tQ,{type:tQ},i=>{var n;let s=null===(n=null==i?void 0:i[0])||void 0===n?void 0:n[tQ];void 0!==s&&t(!!s),_fail(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=_validateOrigin(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _isMobileBrowser()||_isSafari()||_isIOS()}};let MultiFactorAssertionImpl=class MultiFactorAssertionImpl{constructor(e){this.factorId=e}_process(e,t,i){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,i);case"signin":return this._finalizeSignIn(e,t.credential);default:return debugFail("unexpected MultiFactorSessionType")}}};let PhoneMultiFactorAssertionImpl=class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new PhoneMultiFactorAssertionImpl(e)}_finalizeEnroll(e,t,i){return finalizeEnrollPhoneMfa(e,{idToken:t,displayName:i,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return finalizeSignInPhoneMfa(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}};let PhoneMultiFactorGenerator=class PhoneMultiFactorGenerator{constructor(){}static assertion(e){return PhoneMultiFactorAssertionImpl._fromCredential(e)}};PhoneMultiFactorGenerator.FACTOR_ID="phone";let TotpMultiFactorGenerator=class TotpMultiFactorGenerator{static assertionForEnrollment(e,t){return TotpMultiFactorAssertionImpl._fromSecret(e,t)}static assertionForSignIn(e,t){return TotpMultiFactorAssertionImpl._fromEnrollmentId(e,t)}static async generateSecret(e){var t;_assert(void 0!==(null===(t=e.user)||void 0===t?void 0:t.auth),"internal-error");let i=await startEnrollTotpMfa(e.user.auth,{idToken:e.credential,totpEnrollmentInfo:{}});return TotpSecret._fromStartTotpMfaEnrollmentResponse(i,e.user.auth)}};TotpMultiFactorGenerator.FACTOR_ID="totp";let TotpMultiFactorAssertionImpl=class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl{constructor(e,t,i){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=i}static _fromSecret(e,t){return new TotpMultiFactorAssertionImpl(t,void 0,e)}static _fromEnrollmentId(e,t){return new TotpMultiFactorAssertionImpl(t,e)}async _finalizeEnroll(e,t,i){return _assert(void 0!==this.secret,e,"argument-error"),finalizeEnrollTotpMfa(e,{idToken:t,displayName:i,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){_assert(void 0!==this.enrollmentId&&void 0!==this.otp,e,"argument-error");let i={verificationCode:this.otp};return finalizeSignInTotpMfa(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:i})}};let TotpSecret=class TotpSecret{constructor(e,t,i,n,s,o,l){this.sessionInfo=o,this.auth=l,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=i,this.codeIntervalSeconds=n,this.enrollmentCompletionDeadline=s}static _fromStartTotpMfaEnrollmentResponse(e,t){return new TotpSecret(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var i;let n=!1;return(_isEmptyString(e)||_isEmptyString(t))&&(n=!0),n&&(_isEmptyString(e)&&(e=(null===(i=this.auth.currentUser)||void 0===i?void 0:i.email)||"unknownuser"),_isEmptyString(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function _isEmptyString(e){return void 0===e||(null==e?void 0:e.length)===0}var tZ="@firebase/auth",t0="1.3.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthInterop=class AuthInterop{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;let t=await this.auth.currentUser.getIdToken(e);return{accessToken:t}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_assert(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getVersionForPlatform(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";default:return}}function registerAuth(e){_registerComponent(new Component("auth",(t,{options:i})=>{let n=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),o=t.getProvider("app-check-internal"),{apiKey:l,authDomain:h}=n.options;_assert(l&&!l.includes(":"),"invalid-api-key",{appName:n.name});let u={apiKey:l,authDomain:h,clientPlatform:e,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:_getClientVersion(e)},d=new AuthImpl(n,s,o,u);return _initializeAuthInstance(d,i),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{let n=e.getProvider("auth-internal");n.initialize()})),_registerComponent(new Component("auth-internal",e=>{let t=index_esm2017_getModularInstance(e.getProvider("auth").getImmediate());return new AuthInterop(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),registerVersion(tZ,t0,getVersionForPlatform(e)),registerVersion(tZ,t0,"esm2017")}let t1=getExperimentalSetting("authIdTokenMaxAge")||300,t2=null,mintCookieFactory=e=>async t=>{let i=t&&await t.getIdTokenResult(),n=i&&(new Date().getTime()-Date.parse(i.issuedAtTime))/1e3;if(n&&n>t1)return;let s=null==i?void 0:i.token;t2!==s&&(t2=s,await fetch(e,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function getAuth(e=getApp()){let t=index_esm2017_getProvider(e,"auth");if(t.isInitialized())return t.getImmediate();let i=initializeAuth(e,{popupRedirectResolver:BrowserPopupRedirectResolver,persistence:[IndexedDBLocalPersistence,BrowserLocalPersistence,BrowserSessionPersistence]}),n=getExperimentalSetting("authTokenSyncURL");if(n){let e=mintCookieFactory(n);beforeAuthStateChanged(i,e,()=>e(i.currentUser)),onIdTokenChanged(i,t=>e(t))}let s=getDefaultEmulatorHost("auth");return s&&connectAuthEmulator(i,`http://${s}`),i}registerAuth("Browser");let t9=initializeApp({apiKey:"AIzaSyA3t-YI76Q_TlYM8Pv0QKNhaFSvxCCoK68",authDomain:"compass-a026e.firebaseapp.com",projectId:"compass-a026e",storageBucket:"compass-a026e.appspot.com",messagingSenderId:"834288613549",appId:"1:834288613549:web:ce1f9fc023a23029e56e24",measurementId:"G-7KD574QMVM"});getFirestore(t9);let t4=getAuth(t9),t6=__webpack_require__(559)();async function sendUserReminders(){try{let e=t4.currentUser;if(!e)throw t6.error("No user is currently signed in."),Error("No user is currently signed in.");let t=e.uid,i=await e.getIdToken(),n=await fetch("".concat("http://localhost:8000","/api/reminders/").concat(t),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(i)}});if(t6.info("Reminder notifications sent successfully for user ".concat(t)),!n.ok)throw t6.error("Failed to send reminder notifications for user. HTTP Status: ".concat(n.status)),Error("Failed to create reminder for user. HTTP Status: ".concat(n.status));let s=await n.json();return s}catch(e){throw t6.error("Error creating reminder entry:",e),e}}let t5=__webpack_require__(559)();async function createSubscription(e){try{let t=t4.currentUser;if(!t)throw Error("No user is currently signed in.");let i=t.uid,n=await t.getIdToken(),s=await fetch("".concat("http://localhost:8000","/api/subscription/").concat(i),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(n)},body:JSON.stringify({subscription:e})});if(t5.info("Subscription object created successfully for user ".concat(i)),!s.ok)throw t5.error("Failed to create subscription object for user. HTTP Status: ".concat(s.status)),Error("Failed to create subscription object for user. HTTP Status: ".concat(s.status));let o=await s.json();return o}catch(e){throw t5.error("Error creating subscription object:",e),e}}async function getSubscription(){try{let e=t4.currentUser;if(!e)throw Error("No user is currently signed in.");let t=e.uid,i=await e.getIdToken(),n=await fetch("".concat("http://localhost:8000","/api/subscription/").concat(t),{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(i)}});if(t5.info("Subscription object fetched successfully for user ".concat(t)),!n.ok)throw t5.error("Failed to retrieve subscription object for user. HTTP Status: ".concat(n.status)),Error("Failed to retrieve subscription object for user. HTTP Status: ".concat(n.status));let s=await n.json();return s}catch(e){throw t5.error("Error fetching subscription object:",e),e}}async function updateSubscription(e){try{let t=t4.currentUser;if(!t)throw Error("No user is currently signed in.");let i=t.uid,n=await t.getIdToken(),s=await fetch("".concat("http://localhost:8000","/api/subscription/").concat(i),{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(n)},body:JSON.stringify({subscription:e})});if(t5.info("Subscription object updated successfully for user ".concat(i)),!s.ok)throw t5.error("Failed to update subscription object for user. HTTP Status: ".concat(s.status)),Error("Failed to update subscription object for user. HTTP Status: ".concat(s.status));let o=await s.json();return o}catch(e){throw t5.error("Error updating subscription object:",e),e}}async function deleteSubscription(){try{let e=t4.currentUser;if(!e)throw t5.error("No user is currently signed in."),Error("No user is currently signed in.");let t=e.uid,i=await e.getIdToken(),n=await fetch("".concat("http://localhost:8000","/api/subscription/").concat(t),{method:"DELETE",headers:{Authorization:"Bearer ".concat(i)}});if(t5.info("Subscription object deleted successfully for user ".concat(t)),!n.ok)throw t5.error("Failed to delete subscription object for user. HTTP Status: ".concat(n.status)),Error("Failed to delete subscription object for user. HTTP Status: ".concat(n.status));return await n.json(),{message:"Subscription object deleted successfully"}}catch(e){throw t5.error("Error deleting subscription object:",e),e}}skipWaiting(),clientsClaim();let t7=[{'revision':'7b36459b5abfc254317e0aeebfd2317a','url':'/_next/static/MclrBrjrEeuPZNwLR9vTI/_buildManifest.js'},{'revision':'b6652df95db52feb4daf4eca35380933','url':'/_next/static/MclrBrjrEeuPZNwLR9vTI/_ssgManifest.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/1176-be424c0c93b828d9.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/1406-80780474c8426a33.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/2933-9b233dc9aa5b995b.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/3379-7f42fab824ed115c.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/356-65878134d030ae23.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/3698-54b22956aed98f92.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/4104-31a17c9be6b20e9a.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/41ade5dc-cbcbedfcd2b483f8.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/4881-5194aacf044410bd.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/5762-efac3411d7cc4d43.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/6074-22db6a5cb66ba184.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/6230-46d2a456160c6d35.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/6691-83f256df6eed6e12.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/6939-f73ee3a48a633655.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/757-88dbfc6bcd08fe10.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/7713-3ba3063027620c2a.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/82deed28-df0f429a45c76493.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/9184-ff3b8971824a11a6.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/9620-31be7e1cba7ce6cd.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/9804-3199c4ca14fe1c19.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/%5B...not-found%5D/page-474bdd3361e474f3.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/_not-found-904d05d96c6fe5e5.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/aboutUs/page-ec5064b5057587fe.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/contacts/%5BupdateContacts%5D/page-2ebeee7841f8aaa4.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/contacts/page-ab724405f29d40e1.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/createActivityJournal/page-8136449c26364251.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/createContacts/page-427aa9c75362a123.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/createFoodJournal/page-c794e64fb4fe286d.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/createGlucoseJournal/page-91055ef239576e2e.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/createInsulinJournal/page-3411b6318e07737d.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/createMedication/page-b3642986884bf787.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/createWeightJournal/page-68c6bbfe9934ba0f.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/editprofile/page-b76a148d3e47b735.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/forgotpassword/page-7cc2173f3a9edc24.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getActivityJournals/%5BactivityJournal%5D/%5BeditActivityJournal%5D/page-3c1b31eb4a66fdb8.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getActivityJournals/%5BactivityJournal%5D/page-e173c23612564af2.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getActivityJournals/page-5b66a883e9506a8a.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getDiabeticJournals/getGlucoseJournals/%5BglucoseJournal%5D/%5BeditGlucoseJournal%5D/page-1225fbe2305a1e39.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getDiabeticJournals/getGlucoseJournals/%5BglucoseJournal%5D/page-71588c1301303ec8.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getDiabeticJournals/getGlucoseJournals/page-32e22158aba0e770.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getDiabeticJournals/getInsulinJournals/%5BinsulinJournal%5D/%5BeditInsulinJournal%5D/page-d7c01b3aafd41635.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getDiabeticJournals/getInsulinJournals/%5BinsulinJournal%5D/page-26113f84891eb4de.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getDiabeticJournals/getInsulinJournals/page-98552fa7ab8a90da.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getDiabeticJournals/page-9820870b6be78753.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getFoodJournals/%5BfoodJournal%5D/%5BeditFoodJournal%5D/page-8bac8cf9ddd97893.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getFoodJournals/%5BfoodJournal%5D/page-b3d914b6a60d92a2.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getFoodJournals/page-47c2223ddb39f99c.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getMedications/%5Bmedication%5D/%5BeditMedication%5D/page-a226a1f1aba18214.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getMedications/%5Bmedication%5D/page-9bc1c2e9b8a03420.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getMedications/page-0bfbcb79154c5db3.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getWeightJournals/%5BweightJournal%5D/%5BeditWeightJournal%5D/page-141392b1ff79ba4d.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getWeightJournals/%5BweightJournal%5D/page-39e4b24a9f499100.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/getWeightJournals/page-9ed42a87eb941619.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/health/page-f40409c751564fb4.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/journals/page-721673f5fd954816.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/layout-058e9a49b66845cd.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/login/page-0cf2dd1d2b17a600.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/logout/page-ca25708618a5ce91.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/moodjournal/%5BviewMoodJournal%5D/%5BupdateEntryId%5D/page-6bcd752204fa7110.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/moodjournal/%5BviewMoodJournal%5D/page-480fd640d28b921d.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/moodjournal/addentry/page-bab4424742b4f0f6.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/moodjournal/page-02163c63064ce3e5.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/notifications/page-37f1b920e2233660.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/page-2039a30e5f35349d.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/profile/page-b619cf7e372666c5.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/register/page-d8d88aec225e4c3c.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/settings/page-8328bbb083503e46.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/tpage/page-6a046f4245a44953.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/viewappointments/%5Bappointment%5D/%5Bupdateappointment%5D/page-030f67afd2862ef7.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/viewappointments/%5Bappointment%5D/page-cd32684c9186b3a9.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/viewappointments/addappointment/page-a3815cae5a3aa7f7.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/viewappointments/page-f278defa58de2f80.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/welcome/page-74e35147a1063102.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/app/~offline/page-0ed22f74fdbafcc2.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/bc9c3264-414855f22aa853da.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/bc9e92e6-71e7c17d1efc74c6.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/fd9d1056-1ffe476a07116d6e.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/framework-964c2d6016b0d731.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/main-app-7c5ebb381f791808.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/main-e44d8f3360568a0a.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/pages/_app-c5876d3c9d2aa56e.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/pages/_error-54652fda7e85f1f9.js'},{'revision':'837c0df77fd5009c9e46d446188ecfd0','url':'/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/_next/static/chunks/webpack-db7ebde68064c23b.js'},{'revision':'b7f2ef73fe8c9915','url':'/_next/static/css/b7f2ef73fe8c9915.css'},{'revision':'cd20bd2a7ee362a6','url':'/_next/static/css/cd20bd2a7ee362a6.css'},{'revision':'54331e59bd1797ee446d8091239379ce','url':'/_next/static/media/activity.26632338.svg'},{'revision':'d310af8244d8cd91bd5ecdd33eac833e','url':'/_next/static/media/appointments.f610755a.svg'},{'revision':'5b50d56bf8f0f234f66d22518f91e92e','url':'/_next/static/media/compass-removebg.e66e0cba.png'},{'revision':'ce96562370c16649cc928e60e9f0331c','url':'/_next/static/media/diabetes.1e4f76f7.svg'},{'revision':'db5a1a4762cdac5f10399e915f463e55','url':'/_next/static/media/food.39cbdd14.svg'},{'revision':'0bf5e19322dacbe97ddb332876213dfb','url':'/_next/static/media/medications.46d95bc4.svg'},{'revision':'8700cd768ecdf9136c65b6b375bcaa0c','url':'/_next/static/media/mood.7f8b7264.svg'},{'revision':'ec82c7e6dd894dd2b054697a27988aab','url':'/_next/static/media/onboard1.ae34305e.svg'},{'revision':'34b909f4b4b90d61f2a273cc608e682b','url':'/_next/static/media/onboard2.296da87c.svg'},{'revision':'3f088377d57a7b7dcf6ade00425b3079','url':'/_next/static/media/onboard3.1750e1e1.svg'},{'revision':'2a010b051c605c12ed17334a43f9a0f2','url':'/_next/static/media/weight.db00cac6.svg'},{'revision':'96543e82472f79d0331aeda9b82bc273','url':'/sw.js'},{'revision':'MclrBrjrEeuPZNwLR9vTI','url':'/~offline'}];function urlBase64ToUint8Array(e){let t="=".repeat((4-e.length%4)%4),i=(e+t).replace(/-/g,"+").replace(/_/g,"/"),n=atob(i),s=new ArrayBuffer(n.length),o=new Uint8Array(s);for(let e=0;e<n.length;e++)o[e]=n.charCodeAt(e);return o}function subscribeUserToPush(){return self.registration.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:urlBase64ToUint8Array("BKlaijHeFLlg0cuC8twkPz0p-vY8EzOJSATZnUdGu5Kc49ScJL4iVMaCIaSY4xI4t-XVeJS69H6c1tPSzstO0pw")}).then(async e=>{let t=btoa(String.fromCharCode.apply(null,new Uint8Array(e.getKey("auth")))),i=btoa(String.fromCharCode.apply(null,new Uint8Array(e.getKey("p256dh")))),n={endpoint:e.endpoint,keys:{auth:t,p256dh:i}};try{let e=await getSubscription();if(e&&e.data){console.log("Found subscription object of the user"),console.log("Attempting to update it...");try{await updateSubscription(n),console.log("Updated subscription object of user")}catch(e){console.log("Error updating subscription object of user:",e)}}}catch(e){console.log("Error retrieving subscription object of user:",e),console.log("Attempting to create subscription object for user");try{await createSubscription(n),console.log("Subscription for user created!")}catch(e){console.error("Error creating subscription object for user:",e)}}}).catch(e=>{console.error("Subscription task failed:",e)})}function unsubscribeUserFromPush(){return self.registration.pushManager.getSubscription().then(async e=>{try{let e=await getSubscription();e&&e.data&&(console.log("Found subscription object of the user"),console.log("Attempting to delete it..."),await deleteSubscription(),console.log("Unsubscribed from push notifications."))}catch(e){console.error("Unsubscription task failed:",e)}}).catch(e=>{console.error("Unsubscribe task failed:",e)})}function runTaskEvery30Minutes(){console.log("Push Notification Task!"),sendUserReminders()}t7.push({url:"/~offline"}),precacheAndRoute(t7),cleanupOutdatedCaches(),registerRoute("/",new NetworkFirst({cacheName:"start-url",plugins:[new ExpirationPlugin({maxEntries:1,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),registerRoute("/~offline",new NetworkFirst({cacheName:"offline-fallback",plugins:[new ExpirationPlugin({maxEntries:1,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,new CacheFirst({cacheName:"google-fonts",plugins:[new ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3,purgeOnQuotaError:!0})]}),"GET"),registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800,purgeOnQuotaError:!0})]}),"GET"),registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new NetworkOnly({cacheName:"static-image-assets",plugins:[new ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),registerRoute(/\.(?:js)$/i,new StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),registerRoute(/\.(?:css|less)$/i,new StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),registerRoute(/\.(?:json|xml|csv)$/i,new NetworkFirst({cacheName:"static-data-assets",plugins:[new ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),registerRoute(/\/api\/.*$/i,new NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),registerRoute(/.*/i,new NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),setDefaultHandler(new StaleWhileRevalidate),setCatchHandler(e=>{let{event:t}=e;switch(t.request.destination){case"document":return matchPrecache("/~offline");case"image":return matchPrecache("/static/images/fallback.png");default:return Response.error()}}),registerRoute(e=>{let{request:t}=e;return"document"===t.destination},new CacheFirst({cacheName:"pages",plugins:[new CacheableResponsePlugin({statuses:[200]}),new ExpirationPlugin({maxEntries:60,maxAgeSeconds:2592e3})]})),self.addEventListener("message",e=>{"subscribeToPush"===e.data.action&&e.waitUntil(subscribeUserToPush()),"unsubscribeFromPush"===e.data.action&&e.waitUntil(unsubscribeUserFromPush())}),setInterval(()=>{runTaskEvery30Minutes()},18e5),self.addEventListener("push",e=>{let t={icon:"/compass-removebg.png",...e.data.json()};e.waitUntil(self.registration.showNotification(t.title,t))})}()}();