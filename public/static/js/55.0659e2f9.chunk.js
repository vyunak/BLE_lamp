(this.webpackJsonpmyApp=this.webpackJsonpmyApp||[]).push([[55],{153:function(t,e,n){"use strict";n.r(e),n.d(e,"startTapClick",(function(){return o}));var i=n(16),o=function(t){var e,n,o,v,l=10*-f,p=0,m=t.getBoolean("animated",!0)&&t.getBoolean("rippleEffect",!0),L=new WeakMap,h=function(t){l=Object(i.j)(t),w(t)},E=function(){clearTimeout(v),v=void 0,n&&(k(!1),n=void 0)},b=function(t){n||void 0!==e&&null!==e.parentElement||(e=void 0,j(a(t),t))},w=function(t){j(void 0,t)},j=function(t,e){if(!t||t!==n){clearTimeout(v),v=void 0;var o=Object(i.k)(e),a=o.x,c=o.y;if(n){if(L.has(n))throw new Error("internal error");n.classList.contains(s)||g(n,a,c),k(!0)}if(t){var d=L.get(t);d&&(clearTimeout(d),L.delete(t));var f=r(t)?0:u;t.classList.remove(s),v=setTimeout((function(){g(t,a,c),v=void 0}),f)}n=t}},g=function(t,e,n){p=Date.now(),t.classList.add(s);var i=m&&c(t);i&&i.addRipple&&(T(),o=i.addRipple(e,n))},T=function(){void 0!==o&&(o.then((function(t){return t()})),o=void 0)},k=function(t){T();var e=n;if(e){var i=d-Date.now()+p;if(t&&i>0&&!r(e)){var o=setTimeout((function(){e.classList.remove(s),L.delete(e)}),d);L.set(e,o)}else e.classList.remove(s)}},y=document;y.addEventListener("ionScrollStart",(function(t){e=t.target,E()})),y.addEventListener("ionScrollEnd",(function(){e=void 0})),y.addEventListener("ionGestureCaptured",E),y.addEventListener("touchstart",(function(t){l=Object(i.j)(t),b(t)}),!0),y.addEventListener("touchcancel",h,!0),y.addEventListener("touchend",h,!0),y.addEventListener("mousedown",(function(t){var e=Object(i.j)(t)-f;l<e&&b(t)}),!0),y.addEventListener("mouseup",(function(t){var e=Object(i.j)(t)-f;l<e&&w(t)}),!0)},a=function(t){if(!t.composedPath)return t.target.closest(".ion-activatable");for(var e=t.composedPath(),n=0;n<e.length-2;n++){var i=e[n];if(i.classList&&i.classList.contains("ion-activatable"))return i}},r=function(t){return t.classList.contains("ion-activatable-instant")},c=function(t){if(t.shadowRoot){var e=t.shadowRoot.querySelector("ion-ripple-effect");if(e)return e}return t.querySelector("ion-ripple-effect")},s="ion-activated",u=200,d=200,f=2500}}]);
//# sourceMappingURL=55.0659e2f9.chunk.js.map