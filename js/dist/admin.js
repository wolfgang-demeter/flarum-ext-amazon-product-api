module.exports=function(t){var e={};function r(a){if(e[a])return e[a].exports;var n=e[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(a,n,function(e){return t[e]}.bind(null,n));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=12)}({0:function(t,e){t.exports=flarum.core.compat["admin/app"]},12:function(t,e,r){"use strict";r.r(e);var a=r(0),n=r.n(a);n.a.initializers.add("wolfgang-demeter/flarum-ext-amazon-product-api",(function(){n.a.extensionData.for("wolfgang-demeter-amazon-product-api").registerSetting({setting:"wd-amazon-product-api.partnerTag",type:"text",label:n.a.translator.trans("wd-amazon-product-api.admin.settings.partner_tag"),placeholder:"xyz-21"}).registerSetting({setting:"wd-amazon-product-api.accessKey",type:"text",label:n.a.translator.trans("wd-amazon-product-api.admin.settings.access_key")}).registerSetting({setting:"wd-amazon-product-api.secretKey",type:"text",label:n.a.translator.trans("wd-amazon-product-api.admin.settings.secret_key")}).registerPermission({icon:"fab fa-amazon",label:n.a.translator.trans("wd-amazon-product-api.admin.permissions.use_amazon_product_api"),permission:"wd-amazon-product-api.post.useAmazonProductApi"},"start")}))}});
//# sourceMappingURL=admin.js.map