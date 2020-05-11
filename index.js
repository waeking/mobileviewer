/*!
 * mobileview.js v1.0.0
 * https://github.com/waeking/mobileview
 *
 * Copyright 2015-present waeKing Chen
 * Released under the MIT license
 *
 * Date: 2020-05-09
 */
(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
      ? (module.exports = factory())
      : typeof define === "function" && define.amd
      ? define(factory)
      : (global.mobileview = factory());
  })(this, function () {
    "use strict";
    var toString = Object.prototype.toString;
    function isArray(val) {
      return toString.call(val) === "[object Array]";
    }
    function isObject(val) {
      return toString.call(val) === "[object Object]";
    }
    function isUndefined(val) {
      return typeof val === "undefined";
    }
    function isEmpty(val) {
      return val === "";
    }
    function isFunction(value) {
      return typeof value === "function";
    }
    function toArray(nodes) {
      return Array.from ? Array.from(nodes) : Array.prototype.slice.call(nodes);
    }
    // set style
    function setStyle(el, obj) {
      Object.getOwnPropertyNames(obj).forEach(function (ruleName) {
        el.style[ruleName] = obj[ruleName];
      });
    }
    // create element
    function createElement(ele, obj) {
      var tagName = document.createElement(ele);
      Object.getOwnPropertyNames(obj).forEach(function (attr) {
        if (isFunction(tagName[attr])) {
          let key = Object.getOwnPropertyNames(obj[attr])[0];
          let value = obj[attr][key];
          tagName[attr](key, value);
        } else {
          tagName[attr] = obj[attr];
        }
      });
      return tagName;
    }
    //  assign
    var assign =
      Object.assign ||
      function assign(obj) {
        var len = arguments.length;
        var args = new Array(len > 1 ? len - 1 : 0);
        for (let i = 1; _key < len; i++) {
          args[i - 1] = arguments[i];
        }
        if (isObject(obj) && args.length > 0) {
          args.forEach(function (arg) {
            if (isObject(arg)) {
              Object.keys(arg).forEach(function (key) {
                obj[key] = arg[key];
              });
            }
          });
        }
        return obj;
      };
    function MobileView(el) {
      this.oBody = document.getElementsByTagName("body")[0];
      this.options = arguments[1] ? arguments[1] : {};
      this.index = 0;
      this.imgList = [];
      this.clientWidth = window.innerWidth;
      this.clientHeight = window.innerHeight;
      this.isShowMessage = this.options.isShowMessage
        ? this.options.isShowMessage
        : false;
      if (isObject(el)) {
        if (!isArray(el.urls)) {
          throw new Error("The urls argument is required and must be an Array");
        }
        if (el.urls.indexOf(el.current) === -1) {
          throw new Error(
            "The current param value must be contained in urls Array"
          );
        }
        this.imgList = el.urls;
        this.index = el.urls.indexOf(el.current);
        this.generateImg();
      } else {
        if (!el || el.nodeType !== 1) {
          throw new Error(
            "The first argument is required and must be an element."
          );
        }
        this.element = el.querySelectorAll("img");
        this.getImgList();
      }
    }
    MobileView.prototype.getImgList = function () {
      var _this = this;
      toArray(this.element).forEach(function (item) {
        if (
          !isEmpty(item.attributes.src.value) &&
          !isUndefined(item.attributes.src.value)
        ) {
          _this.imgList.push(item.attributes.src.value);
        }
      });
      _this.index = window.event.target.attributes.src
        ? _this.imgList.indexOf(window.event.target.attributes.src.value)
        : 0;
      this.generateImg();
    };
    MobileView.prototype.generateImg = function () {
      var _this = this;
      this.oDiv = createElement("div", {
        className: "mobile-view-wrap",
      });
      setStyle(this.oDiv, {
        height: "100%",
        width: "100%",
        overflow: "auto",
        position: "fixed",
        top: 0,
        left: 0,
        textAlign: "center",
        backgroundColor: "#000",
        zIndex: 980,
      });
      this.imgList.forEach(function (item, index) {
        var newImgElement = new Image();
        var oImg = createElement("img", {
          setAttribute: {
            "data-index": index,
          },
        });
        newImgElement.onload = function () {
          let width = newImgElement.width;
          let height = newImgElement.height;
          let setImgWidth = width;
          let setImgHeight = height;
          if (width >= _this.clientWidth) {
            setImgWidth = _this.clientWidth;
            setImgHeight = _this.clientWidth * (height / width);
          }
          setStyle(oImg, {
            width: setImgWidth + "px",
            height: setImgHeight + "px",
            marginTop:
              setImgHeight < _this.clientHeight
                ? (_this.clientHeight - setImgHeight) / 2 + "px"
                : 0,
            display: index === _this.index ? "block" : "none",
          });
        };
        oImg.src = item;
        newImgElement.src = item;
        _this.oDiv.appendChild(oImg);
      });
      this.oBody.appendChild(this.oDiv);
      this.eventListener();
    };
    MobileView.prototype.slideImage = function () {
      var _this = this;
      if (_this.index > _this.imgList.length - 1) {
        _this.index = _this.imgList.length - 1;
        _this.showMessage();
        return;
      } else if (_this.index < 0) {
        _this.index = 0;
        _this.showMessage("已是第一张！", {
          left: "10%",
          right: 0,
        });
        return;
      }
      let nodeImgList = this.oDiv.querySelectorAll("img");
      nodeImgList.forEach(function (item, index) {
        setStyle(item, {
          display: index === _this.index ? "block" : "none",
        });
      });
    };
    MobileView.prototype.showMessage = function (msg, obj) {
      var _this = this;
      if (!_this.isShowMessage) return;
      var oSpan = createElement("span", {
        innerHTML: msg || "已是最后一张！",
      });
      var DEFAULT = {
        position: "fixed",
        right: "10%",
        top: "50%",
        width: "100px",
        height: "30px",
        display: "block",
        marginTop: "-15px",
        lineHeight: "30px",
        textAlign: "center",
        fontSize: "14px",
        color: "#000",
        zIndex: 1000,
        textShadow: "0px 1px 1px #ddd",
      };
      setStyle(oSpan, assign(DEFAULT, obj));
      this.oBody.appendChild(oSpan);
      setTimeout(function () {
        _this.oBody.removeChild(oSpan);
      }, 800);
    };
    MobileView.prototype.eventListener = function () {
      var _this = this;
      var startX = 0;
      var startY = 0;
      var isSlide = false;
      function touchstart(e) {
        if(e.targetTouches.length === 1 && e.target.height < _this.clientHeight){
          e.preventDefault();
        }
        startX = e.changedTouches[0].pageX;
        startY = e.changedTouches[0].pageY;
        isSlide = true;
      }
      function touchmove(e) {
        if (!isSlide) return;
      }
      function touchend(e) {
        if (!isSlide) return;
        var moveEndX = e.changedTouches[0].pageX;
        var moveEndY = e.changedTouches[0].pageY;
        var X = moveEndX - startX;
        var Y = moveEndY - startY;
        if (Math.abs(X) > Math.abs(Y) && X > 10) {
          // left
          _this.index--;
          isSlide = false;
          _this.slideImage();
        } else if (Math.abs(X) > Math.abs(Y) && X < -10) {
          // right
          _this.index++;
          _this.slideImage();
        }
        isSlide = false;
        if (X === 0 && Y === 0) {
          _this.oDiv.removeEventListener("touchstart", touchstart, false);
          _this.oDiv.removeEventListener("touchmove", touchmove, false);
          _this.oDiv.removeEventListener("touchend", touchend, false);
          _this.destroy();
        }
      }
      this.oDiv.addEventListener("touchstart", touchstart, false);
      this.oDiv.addEventListener("touchmove", touchmove, false);
      this.oDiv.addEventListener("touchend", touchend, false);
    };
    MobileView.prototype.destroy = function () {
      var _this = this;
      setTimeout(function () {
        _this.oBody.removeChild(_this.oDiv);
        _this.imgList = null;
        _this.index = null;
        _this.clientWidth = null;
        _this.clientHeight = null;
        _this.element = null;
        _this.oBody = null;
      }, 200);
    };
    return {
      previewImage: function (obj) {
        new MobileView(obj);
      },
      init: function (element) {
        new MobileView(element);
      },
    };
  });
  