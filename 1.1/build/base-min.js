/*! autocomplete - v1.1 - 2013-06-25 8:30:37 PM
* Copyright (c) 2013 舒克; Licensed  */
KISSY.add(function(a){function b(){this.initBase.apply(this,arguments)}var c="inputNode",d="query",e="results",f="results",g="afterQueryChange",h="valuechange",i="requestTemplate",j="resultListLocator";return b.ATTRS={enableCache:{value:!0},inputNode:{value:null,setter:function(b){return b instanceof a.NodeList?b:a.one(b)}},maxResults:{value:1e3},minQueryLength:{value:1},jsonpCallback:{value:"callback"},query:{value:null},queryDelay:{value:100},queryDelimiter:{value:null},requestTemplate:{value:null,setter:"_setRequestTemplate"},resultFilter:{value:null},resultFormatter:{value:function(b,c){return a.map(c,function(b){return a.substitute('<div class="ks-ac-item-inner"><span class="ks-ac-name">{cityname}</span><span class="ks-ac-intro">{py}</span></div>',{cityname:b.text,py:b.raw.py})})}},resultListLocator:{value:null,setter:"_setLocator"},results:{value:[]},resultTextLocator:{value:null,setter:"_setLocator"},source:{value:null,setter:"_setSource"},value:{value:"",setter:"_onSetVal"},allowBrowserAutocomplete:{value:!1}},b.prototype={initBase:function(){return this.get("enableCache")===!0&&(this._cache={}),this.inputNode=this.get("inputNode"),this.inputNode?(this._renderUIAcBase(),this._bindUIAcBase(),this):(a.log("error: \u6ca1\u6709\u5bf9\u5e94\u7684\u8f93\u5165\u6846\u8282\u70b9."),!1)},destructor:function(){var a=this.get("inputNode");a.detach()},_renderUIAcBase:function(){this._syncBrowserAutocomplete()},_bindUIAcBase:function(){var b=this.get(c);b.on(h,this._onInputValueChange,this),this.on("afterValueChange",this._afterValueChange,this),this.on(g,function(b){var c=a.trim(b.newVal.query);c.length<this.get("minQueryLength")||this.sendRequest(c)},this),this.on("afterAllowBrowserAutocompleteChange",this._syncBrowserAutocomplete,this)},sendRequest:function(b,c){var d,e=this.get("source");e&&(c||(c=this.get(i)),d=c?c.call(this,b):b,e.sendRequest({query:b,request:d,callback:{success:a.bind(this._onResponse,this,b)}}))},_onSetVal:function(a){this.get("inputNode").val(a)},_onInputValueChange:function(a){this.set("value",a.newVal,{silent:!1})},_afterValueChange:function(a){var b,c=this,e=a.newVal,f=this.get("queryDelimiter"),g=e;null!==f&&(b=e.split(f),g=b[b.length-1]);var h=function(){c.set(d,{query:g,inputValue:e})},i=this.get("queryDelay");i?(clearTimeout(this._delay),this._delay=setTimeout(function(){h()},i)):h()},_updateValue:function(b){var c,d,e,f=this.get("queryDelimiter");b=a.trim(b),f&&(c=a.trim(f),e=a.map(a.trim(this.get("value")).split(f),function(b){return a.trim(b)}),d=e.length,d>1&&(e[d-1]=b,b=e.join(c)),b+=c),this.set("value",b,{silent:!0})},_onResponse:function(a,b){a===(this.get("query").query||"")&&this._parseResponse(a||"",b.response,b.data)},_parseResponse:function(b,c,d){var g,h,i,k,l,m,n,o,p,q={data:d,query:b,results:[]},r=this.get(j),s=[],t=c&&c.results;if(t&&r&&(t=r.call(this,t)),t&&t.length){for(p=this.get("resultTextLocator"),i=this.get("resultFilter"),k=0,l=t.length;l>k;++k)n=t[k],o=p?p.call(this,n):n.toString(),s.push({display:o,raw:n,text:o});if(i&&(s=i.call(this,b,s.concat())),s.length&&(h=this.get("resultFormatter"),m=this.get("maxResults"),m&&m>0&&s.length>m&&(s.length=m),h))if(g=h.call(this,b,s.concat()))for(k=0,l=g.length;l>k;++k)s[k].display=g[k];else a.log("Formatter didn't return anything.","warn","autocomplete-base")}q.results=s,this.set(e,s),this.fire(f,q)},_sourceSuccess:function(a,b){b.callback.success({data:a,response:{results:a},request:b})},_setEnableCache:function(a){a===!0&&(this._cache={})},_setRequestTemplate:function(b){return a.isFunction(b)?b.call(this,query):function(c){return a.substitute(b,{query:encodeURIComponent(c)})}},_setResultFilter:function(a,b){return b},_setResultHighlighter:function(b){return a.isFunction(b)?b:!1},_setLocator:function(b){if(a.isFunction(b))return b;b=b.toString().split(".");var c=function(a,b){if(!a)return null;for(var c=0,d=b.length;d>c;c++)b[c]in a&&(a=a[b[c]]);return a};return function(a){return a&&c(a,b)}},_setSource:function(b){switch(!0){case a.isString(b):return this._createJsonpSource(b);case a.isFunction(b):return this._createJsonpSource(b);case a.isArray(b):return this._createArraySource(b);case a.isObject(b):return this._createObjectSource(b)}return b},_createJsonpSource:function(b){var c,d={type:"jsonp"},e=this,f=this.get(i);return f&&(b+=f.call(this,query)),d.sendRequest=function(d){c=d;var f=d.request;if(e._cache&&f in e._cache)return e._sourceSuccess(e._cache[f],d),void 0;var g;g=a.substitute(b,{query:d.query,maxResults:e.get("maxResults")}),a.IO({url:g,dataType:"jsonp",jsonp:e.get("jsonpCallback"),success:function(a){c===d&&(e._cache&&(e._cache[d.request]=a),e._sourceSuccess(a,d))}})},d},_createArraySource:function(a){var b=this;return{type:"Array",sendRequest:function(c){b._sourceSuccess(a,c)}}},_createObjectSource:function(a){var b=this;return{type:"Object",sendRequest:function(c){b._sourceSuccess(a,c)}}},_syncBrowserAutocomplete:function(){var a=this.get("inputNode");"input"===a.prop("nodeName").toLowerCase()&&a.attr("autocomplete",this.get("_syncBrowserAutocomplete")?"on":"off")}},b},{requires:["node","base"]});