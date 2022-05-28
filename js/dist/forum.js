module.exports=function(t){var o={};function n(r){if(o[r])return o[r].exports;var a=o[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=t,n.c=o,n.d=function(t,o,r){n.o(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,o){if(1&o&&(t=n(t)),8&o)return t;if(4&o&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&o&&"string"!=typeof t)for(var a in t)n.d(r,a,function(o){return t[o]}.bind(null,a));return r},n.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(o,"a",o),o},n.o=function(t,o){return Object.prototype.hasOwnProperty.call(t,o)},n.p="",n(n.s=11)}([,function(t,o){t.exports=flarum.core.compat["common/app"]},function(t,o){t.exports=flarum.core.compat["common/components/Button"]},function(t,o){t.exports=flarum.core.compat["common/utils/Stream"]},function(t,o){t.exports=flarum.core.compat["common/extend"]},function(t,o){t.exports=flarum.core.compat["common/components/TextEditor"]},function(t,o){t.exports=flarum.core.compat["common/Component"]},function(t,o){t.exports=flarum.core.compat["common/utils/classList"]},function(t,o){t.exports=flarum.core.compat["common/components/Modal"]},function(t,o){t.exports=flarum.core.compat["common/components/Select"]},function(t,o){t.exports=flarum.core.compat["common/components/Tooltip"]},function(t,o,n){"use strict";n.r(o);var r=n(1),a=n.n(r),e=n(4),i=n(5),s=n.n(i);function u(t,o){return(u=Object.setPrototypeOf||function(t,o){return t.__proto__=o,t})(t,o)}function p(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,u(t,o)}var c=n(6),l=n.n(c),d=n(2),f=n.n(d),y=n(7),b=n.n(y),v=n(8),h=n.n(v),x=n(9),g=n.n(x),w=n(3),z=n.n(w),_=function(t){function o(){return t.apply(this,arguments)||this}p(o,t);var n=o.prototype;return n.oninit=function(o){t.prototype.oninit.call(this,o),this.country=z()(app.session.country),this.asin=z()(app.session.asin)},n.className=function(){return"Modal--large wd-amazon-product-api"},n.title=function(){return app.translator.trans("wd-amazon-product-api.forum.modal.headline")},n.content=function(){return m("div",{className:"Modal-body"},m("div",{className:"Form"},m("div",{className:"helpText"},app.translator.trans("wd-amazon-product-api.lib.help_text")),m("div",{className:"Form-group"},m("label",null,app.translator.trans("wd-amazon-product-api.forum.modal.asin")),m("input",{type:"text",autocomplete:"off",name:"asin",className:"FormControl",bidi:this.asin,disabled:this.loading})),m("div",{className:"Form-group"},m("label",null,app.translator.trans("wd-amazon-product-api.forum.modal.country")),g.a.component({value:this.country(),onchange:this.country,options:this.countryOptions()})),m("div",{className:"helpText"},app.translator.trans("wd-amazon-product-api.forum.modal.hint")),m("div",{className:"Form-group"},f.a.component({className:"Button Button--primary",type:"submit",loading:this.loading},app.translator.trans("wd-amazon-product-api.forum.modal.search")))))},n.countryOptions=function(){return["ca","de","es","fr","it","uk","us"].reduce((function(t,o){return t[o]=app.translator.trans("wd-amazon-product-api.lib.partner_tag."+o),t}),{})},n.onsubmit=function(t){var o=this;t.preventDefault(),app.request({url:app.forum.attribute("apiUrl")+"/wd-amazon-product-api-search?country="+encodeURIComponent(this.country())+"&asin="+encodeURIComponent(this.asin()),method:"GET"}).then((function(t){if(t.exception)app.alerts.show({type:""},app.translator.trans("wd-amazon-product-api.forum.modal.exception",{exception:t.exception}));else{var n="";t.resultImage&&(n+="[!["+app.translator.trans("wd-amazon-product-api.forum.text_insert.image_alt")+"]("+t.resultImage+")]("+t.resultUrl+")\n"),t.resultTitle&&(n+="["+t.resultTitle+"]("+t.resultUrl+")\n"),t.resultPrice&&(n+=app.translator.trans("wd-amazon-product-api.forum.text_insert.for")+" **"+t.resultPrice+"**",(t.resultSavings||t.resultSavingBasis)&&(n+=" _"+app.translator.trans("wd-amazon-product-api.forum.text_insert.savings.spacer"),t.resultSavings&&(n+=" "+app.translator.trans("wd-amazon-product-api.forum.text_insert.savings.savings")+" "+t.resultSavings),t.resultSavingBasis&&(n+=" "+app.translator.trans("wd-amazon-product-api.forum.text_insert.savings.basis")+" "+t.resultSavingBasis),n+="_"),n+="\n"),o.hide(),app.composer.editor.insertAtCursor(n)}}))},n.onerror=function(o){t.prototype.onerror.call(this,o)},o}(h.a),O=n(10),S=n.n(O),B=function(t){function o(){return t.apply(this,arguments)||this}p(o,t);var n=o.prototype;return n.view=function(){return m(S.a,{text:a.a.translator.trans("wd-amazon-product-api.forum.button.tooltip")},m(f.a,{className:b()(["Button","hasIcon","Button--icon","Button--link"]),icon:"fab fa-amazon",onclick:this.AmazonProductApiButtonClicked.bind(this)},m("span",{className:"Button-label"},a.a.translator.trans("wd-amazon-product-api.forum.button.label"))))},n.AmazonProductApiButtonClicked=function(t){t.preventDefault(),a.a.modal.show(_,{})},o}(l.a);Object(e.extend)(s.a.prototype,"toolbarItems",(function(t){a.a.forum.attribute("wd-amazon-product-api.post.useAmazonProductApi")&&t.add("wd-amazon-product-api",B.component(),-1)}))}]);
//# sourceMappingURL=forum.js.map