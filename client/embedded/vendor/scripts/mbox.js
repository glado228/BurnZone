var mboxCopyright = "Copyright 1996-2013. Adobe Systems Incorporated. All rights reserved.";
mboxUrlBuilder = function (a, b) {
  this.a = a;
  this.b = b;
  this.c = new Array();
  this.d = function (e) {
    return e;
  };
  this.f = null;
};
mboxUrlBuilder.prototype.addNewParameter = function (g, h) {
  this.c.push({
    name: g,
    value: h
  });
  return this;
};
mboxUrlBuilder.prototype.addParameterIfAbsent = function (g, h) {
  if (h) {
    for (var i = 0; i < this.c.length; i++) {
      var j = this.c[i];
      if (j.name === g) {
        return this;
      }
    }
    this.checkInvalidCharacters(g);
    return this.addNewParameter(g, h);
  }
};
mboxUrlBuilder.prototype.addParameter = function (g, h) {
  this.checkInvalidCharacters(g);
  for (var i = 0; i < this.c.length; i++) {
    var j = this.c[i];
    if (j.name === g) {
      j.value = h;
      return this;
    }
  }
  return this.addNewParameter(g, h);
};
mboxUrlBuilder.prototype.addParameters = function (c) {
  if (!c) {
    return this;
  }
  for (var i = 0; i < c.length; i++) {
    var k = c[i].indexOf('=');
    if (k == -1 || k == 0) {
      continue;
    }
    this.addParameter(c[i].substring(0, k), c[i].substring(k + 1, c[i].length));
  }
  return this;
};
mboxUrlBuilder.prototype.setServerType = function (l) {
  this.m = l;
};
mboxUrlBuilder.prototype.setBasePath = function (f) {
  this.f = f;
};
mboxUrlBuilder.prototype.setUrlProcessAction = function (n) {
  this.d = n;
};
mboxUrlBuilder.prototype.buildUrl = function () {
  var o = this.f ? this.f : '/m2/' + this.b + '/mbox/' + this.m;
  var p = document.location.protocol == 'file:' ? 'http:' : document.location.protocol;
  var e = p + "//" + this.a + o;
  var q = e.indexOf('?') != -1 ? '&' : '?';
  for (var i = 0; i < this.c.length; i++) {
    var j = this.c[i];
    e += q + encodeURIComponent(j.name) + '=' + encodeURIComponent(j.value);
    q = '&';
  }
  return this.r(this.d(e));
};
mboxUrlBuilder.prototype.getParameters = function () {
  return this.c;
};
mboxUrlBuilder.prototype.setParameters = function (c) {
  this.c = c;
};
mboxUrlBuilder.prototype.clone = function () {
  var s = new mboxUrlBuilder(this.a, this.b);
  s.setServerType(this.m);
  s.setBasePath(this.f);
  s.setUrlProcessAction(this.d);
  for (var i = 0; i < this.c.length; i++) {
    s.addParameter(this.c[i].name, this.c[i].value);
  }
  return s;
};
mboxUrlBuilder.prototype.r = function (t) {
  return t.replace(/\"/g, '&quot;').replace(/>/g, '&gt;');
};
mboxUrlBuilder.prototype.checkInvalidCharacters = function (g) {
  var u = new RegExp('(\'|")');
  if (u.exec(g)) {
    throw "Parameter '" + g + "' contains invalid characters";
  }
};
mboxStandardFetcher = function () {};
mboxStandardFetcher.prototype.getType = function () {
  return 'standard';
};
mboxStandardFetcher.prototype.fetch = function (v) {
  v.setServerType(this.getType());
  document.write('<' + 'scr' + 'ipt src="' + v.buildUrl() + '" language="JavaScript"><' + '\/scr' + 'ipt>');
};
mboxStandardFetcher.prototype.cancel = function () {};
mboxAjaxFetcher = function () {};
mboxAjaxFetcher.prototype.getType = function () {
  return 'ajax';
};
mboxAjaxFetcher.prototype.fetch = function (v) {
  v.setServerType(this.getType());
  var e = v.buildUrl();
  this.w = document.createElement('script');
  this.w.src = e;
  document.body.appendChild(this.w);
};
mboxAjaxFetcher.prototype.cancel = function () {};
mboxMap = function () {
  this.x = new Object();
  this.y = new Array();
};
mboxMap.prototype.put = function (z, h) {
  if (!this.x[z]) {
    this.y[this.y.length] = z;
  }
  this.x[z] = h;
};
mboxMap.prototype.get = function (z) {
  return this.x[z];
};
mboxMap.prototype.remove = function (z) {
  this.x[z] = undefined;
};
mboxMap.prototype.each = function (n) {
  for (var i = 0; i < this.y.length; i++) {
    var z = this.y[i];
    var h = this.x[z];
    if (h) {
      var A = n(z, h);
      if (A === false) {
        break;
      }
    }
  }
};
mboxFactory = function (B, b, C) {
  this.D = false;
  this.B = B;
  this.C = C;
  this.E = new mboxList();
  mboxFactories.put(C, this);
  this.F = typeof document.createElement('div').replaceChild != 'undefined' && (function () {
    return true;
  })() && typeof document.getElementById != 'undefined' && typeof (window.attachEvent || document.addEventListener || window.addEventListener) != 'undefined' && typeof encodeURIComponent != 'undefined';
  this.G = this.F && mboxGetPageParameter('mboxDisable') == null;
  var H = C == 'default';
  this.I = new mboxCookieManager('mbox' + (H ? '' : ('-' + C)), (function () {
    return mboxCookiePageDomain();
  })());
  this.G = this.G && this.I.isEnabled() && (this.I.getCookie('disable') == null);
  if (this.isAdmin()) {
    this.enable();
  }
  this.J();
  this.K = mboxGenerateId();
  this.L = mboxScreenHeight();
  this.M = mboxScreenWidth();
  this.N = mboxBrowserWidth();
  this.O = mboxBrowserHeight();
  this.P = mboxScreenColorDepth();
  this.Q = mboxBrowserTimeOffset();
  this.R = new mboxSession(this.K, 'mboxSession', 'session', 31 * 60, this.I);
  this.S = new mboxPC('PC', 1209600, this.I);
  this.v = new mboxUrlBuilder(B, b);
  this.T(this.v, H);
  this.U = new Date().getTime();
  this.V = this.U;
  var W = this;
  this.addOnLoad(function () {
    W.V = new Date().getTime();
  });
  if (this.F) {
    this.addOnLoad(function () {
      W.D = true;
      W.getMboxes().each(function (X) {
        X.setFetcher(new mboxAjaxFetcher());
        X.finalize();
      });
    });
    if (this.G) {
      this.limitTraffic(100, 10368000);
      this.Y();
      this.Z = new mboxSignaler(function (_, c) {
        return W.create(_, c);
      }, this.I);
    }
  }
};
mboxFactory.prototype.isEnabled = function () {
  return this.G;
};
mboxFactory.prototype.getDisableReason = function () {
  return this.I.getCookie('disable');
};
mboxFactory.prototype.isSupported = function () {
  return this.F;
};
mboxFactory.prototype.disable = function (ab, bb) {
  if (typeof ab == 'undefined') {
    ab = 60 * 60;
  }
  if (typeof bb == 'undefined') {
    bb = 'unspecified';
  }
  if (!this.isAdmin()) {
    this.G = false;
    this.I.setCookie('disable', bb, ab);
  }
};
mboxFactory.prototype.enable = function () {
  this.G = true;
  this.I.deleteCookie('disable');
};
mboxFactory.prototype.isAdmin = function () {
  return document.location.href.indexOf('mboxEnv') != -1;
};
mboxFactory.prototype.limitTraffic = function (cb, ab) {};
mboxFactory.prototype.addOnLoad = function (db) {
  if (this.isDomLoaded()) {
    db();
  } else {
    var eb = false;
    var fb = function () {
      if (eb) {
        return;
      }
      eb = true;
      db();
    };
    this.gb.push(fb);
    if (this.isDomLoaded() && !eb) {
      fb();
    }
  }
};
mboxFactory.prototype.getEllapsedTime = function () {
  return this.V - this.U;
};
mboxFactory.prototype.getEllapsedTimeUntil = function (hb) {
  return hb - this.U;
};
mboxFactory.prototype.getMboxes = function () {
  return this.E;
};
mboxFactory.prototype.get = function (_, ib) {
  return this.E.get(_).getById(ib || 0);
};
mboxFactory.prototype.update = function (_, c) {
  if (!this.isEnabled()) {
    return;
  }
  if (!this.isDomLoaded()) {
    var W = this;
    this.addOnLoad(function () {
      W.update(_, c);
    });
    return;
  }
  if (this.E.get(_).length() == 0) {
    throw "Mbox " + _ + " is not defined";
  }
  this.E.get(_).each(function (X) {
    X.getUrlBuilder().addParameter('mboxPage', mboxGenerateId());
    X.load(c);
  });
};
mboxFactory.prototype.setVisitorIdParameters = function (e) {
  var namespace = '';
  if (typeof Visitor == 'undefined' || typeof Visitor.ID_TYPE_AUTHENTICATED == 'undefined' || namespace.length == 0) {
    return;
  }
  var anonymousVisitorIdName = 'mboxMCVID';
  var globalVisitorIdName = 'mboxMCGVID';
  var customVisitorIdName = 'mboxMCCUSTID';
  var globalLocationHintName = 'mboxMCGLH';
  var visitor = Visitor.getInstance(namespace);
  if (visitor.isAllowed()) {
    var globalVisitorID = visitor.getGlobalVisitorID(function (callbackGlobalVisitorID) {
      e.addParameterIfAbsent(globalVisitorIdName, callbackGlobalVisitorID);
      if (callbackGlobalVisitorID) {
        e.addParameterIfAbsent(globalLocationHintName, visitor.getGlobalLocationHint());
      }
    });
    e.addParameterIfAbsent(globalVisitorIdName, globalVisitorID);
    var anonymousVisitorId = visitor.getAnonymousVisitorID(function (callbackAnonymousVisitorID) {
      e.addParameterIfAbsent(anonymousVisitorIdName, callbackAnonymousVisitorID);
    });
    e.addParameterIfAbsent(anonymousVisitorIdName, anonymousVisitorId);
    e.addParameterIfAbsent(customVisitorIdName, visitor.getAuthenticatedVisitorID());
    if (globalVisitorID) {
      e.addParameterIfAbsent(globalLocationHintName, visitor.getGlobalLocationHint());
    }
  }
};
mboxFactory.prototype.create = function (_, c, jb) {
  if (!this.isSupported()) {
    return null;
  }
  var e = this.v.clone();
  e.addParameter('mboxCount', this.E.length() + 1);
  e.addParameters(c);
  this.setVisitorIdParameters(e);
  var ib = this.E.get(_).length();
  var kb = this.C + '-' + _ + '-' + ib;
  var lb;
  if (jb) {
    lb = new mboxLocatorNode(jb);
  } else {
    if (this.D) {
      throw 'The page has already been loaded, can\'t write marker';
    }
    lb = new mboxLocatorDefault(kb);
  }
  try {
    var W = this;
    var mb = 'mboxImported-' + kb;
    var X = new mbox(_, ib, e, lb, mb);
    if (this.G) {
      X.setFetcher(this.D ? new mboxAjaxFetcher() : new mboxStandardFetcher());
    }
    X.setOnError(function (nb, l) {
      X.setMessage(nb);
      X.activate();
      if (!X.isActivated()) {
        W.disable(60 * 60, nb);
        window.location.reload(false);
      }
    });
    this.E.add(X);
  } catch (ob) {
    this.disable();
    throw 'Failed creating mbox "' + _ + '", the error was: ' + ob;
  }
  var pb = new Date();
  e.addParameter('mboxTime', pb.getTime() - (pb.getTimezoneOffset() * 60000));
  return X;
};
mboxFactory.prototype.getCookieManager = function () {
  return this.I;
};
mboxFactory.prototype.getPageId = function () {
  return this.K;
};
mboxFactory.prototype.getPCId = function () {
  return this.S;
};
mboxFactory.prototype.getSessionId = function () {
  return this.R;
};
mboxFactory.prototype.getSignaler = function () {
  return this.Z;
};
mboxFactory.prototype.getUrlBuilder = function () {
  return this.v;
};
mboxFactory.prototype.T = function (e, H) {
  e.addParameter('mboxHost', document.location.hostname).addParameter('mboxSession', this.R.getId());
  if (!H) {
    e.addParameter('mboxFactoryId', this.C);
  }
  if (this.S.getId() != null) {
    e.addParameter('mboxPC', this.S.getId());
  }
  e.addParameter('mboxPage', this.K);
  e.addParameter('screenHeight', this.L);
  e.addParameter('screenWidth', this.M);
  e.addParameter('browserWidth', this.N);
  e.addParameter('browserHeight', this.O);
  e.addParameter('browserTimeOffset', this.Q);
  e.addParameter('colorDepth', this.P);
  e.setUrlProcessAction(function (e) {
    e += '&mboxURL=' + encodeURIComponent(document.location);
    var qb = encodeURIComponent(document.referrer);
    if (e.length + qb.length < 2000) {
      e += '&mboxReferrer=' + qb;
    }
    e += '&mboxVersion=' + mboxVersion;
    return e;
  });
};
mboxFactory.prototype.rb = function () {
  return "";
};
mboxFactory.prototype.Y = function () {
  document.write('<style>.' + 'mboxDefault' + ' { visibility:hidden; }</style>');
};
mboxFactory.prototype.isDomLoaded = function () {
  return this.D;
};
mboxFactory.prototype.J = function () {
  if (this.gb != null) {
    return;
  }
  this.gb = new Array();
  var W = this;
  (function () {
    var sb = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";
    var tb = false;
    var ub = function () {
      if (tb) {
        return;
      }
      tb = true;
      for (var i = 0; i < W.gb.length; ++i) {
        W.gb[i]();
      }
    };
    if (document.addEventListener) {
      document.addEventListener(sb, function () {
        document.removeEventListener(sb, arguments.callee, false);
        ub();
      }, false);
      window.addEventListener("load", function () {
        document.removeEventListener("load", arguments.callee, false);
        ub();
      }, false);
    } else if (document.attachEvent) {
      if (self !== self.top) {
        document.attachEvent(sb, function () {
          if (document.readyState === 'complete') {
            document.detachEvent(sb, arguments.callee);
            ub();
          }
        });
      } else {
        var vb = function () {
          try {
            document.documentElement.doScroll('left');
            ub();
          } catch (wb) {
            setTimeout(vb, 13);
          }
        };
        vb();
      }
    }
    if (document.readyState === "complete") {
      ub();
    }
  })();
};
mboxSignaler = function (xb, I) {
  this.I = I;
  var yb = I.getCookieNames('signal-');
  for (var i = 0; i < yb.length; i++) {
    var zb = yb[i];
    var Ab = I.getCookie(zb).split('&');
    var X = xb(Ab[0], Ab);
    X.load();
    I.deleteCookie(zb);
  }
};
mboxSignaler.prototype.signal = function (Bb, _) {
  this.I.setCookie('signal-' + Bb, mboxShiftArray(arguments).join('&'), 45 * 60);
};
mboxList = function () {
  this.E = new Array();
};
mboxList.prototype.add = function (X) {
  if (X != null) {
    this.E[this.E.length] = X;
  }
};
mboxList.prototype.get = function (_) {
  var A = new mboxList();
  for (var i = 0; i < this.E.length; i++) {
    var X = this.E[i];
    if (X.getName() == _) {
      A.add(X);
    }
  }
  return A;
};
mboxList.prototype.getById = function (Cb) {
  return this.E[Cb];
};
mboxList.prototype.length = function () {
  return this.E.length;
};
mboxList.prototype.each = function (n) {
  if (typeof n != 'function') {
    throw 'Action must be a function, was: ' + typeof (n);
  }
  for (var i = 0; i < this.E.length; i++) {
    n(this.E[i]);
  }
};
mboxLocatorDefault = function (g) {
  this.g = 'mboxMarker-' + g;
  document.write('<div id="' + this.g + '" style="visibility:hidden;display:none">&nbsp;</div>');
};
mboxLocatorDefault.prototype.locate = function () {
  var Db = document.getElementById(this.g);
  while (Db != null) {
    if (Db.nodeType == 1) {
      if (Db.className == 'mboxDefault') {
        return Db;
      }
    }
    Db = Db.previousSibling;
  }
  return null;
};
mboxLocatorDefault.prototype.force = function () {
  var Eb = document.createElement('div');
  Eb.className = 'mboxDefault';
  var Fb = document.getElementById(this.g);
  Fb.parentNode.insertBefore(Eb, Fb);
  return Eb;
};
mboxLocatorNode = function (Gb) {
  this.Db = Gb;
};
mboxLocatorNode.prototype.locate = function () {
  return typeof this.Db == 'string' ? document.getElementById(this.Db) : this.Db;
};
mboxLocatorNode.prototype.force = function () {
  return null;
};
mboxCreate = function (_) {
  var X = mboxFactoryDefault.create(_, mboxShiftArray(arguments));
  if (X) {
    X.load();
  }
  return X;
};
mboxDefine = function (jb, _) {
  var X = mboxFactoryDefault.create(_, mboxShiftArray(mboxShiftArray(arguments)), jb);
  return X;
};
mboxUpdate = function (_) {
  mboxFactoryDefault.update(_, mboxShiftArray(arguments));
};
mbox = function (g, Hb, v, Ib, mb) {
  this.Jb = null;
  this.Kb = 0;
  this.lb = Ib;
  this.mb = mb;
  this.Lb = null;
  this.Mb = new mboxOfferContent();
  this.Eb = null;
  this.v = v;
  this.message = '';
  this.Nb = new Object();
  this.Ob = 0;
  this.Hb = Hb;
  this.g = g;
  this.Pb();
  v.addParameter('mbox', g).addParameter('mboxId', Hb);
  this.Qb = function () {};
  this.Rb = function () {};
  this.Sb = null;
};
mbox.prototype.getId = function () {
  return this.Hb;
};
mbox.prototype.Pb = function () {
  if (this.g.length > 250) {
    throw "Mbox Name " + this.g + " exceeds max length of " + "250 characters.";
  } else if (this.g.match(/^\s+|\s+$/g)) {
    throw "Mbox Name " + this.g + " has leading/trailing whitespace(s).";
  }
};
mbox.prototype.getName = function () {
  return this.g;
};
mbox.prototype.getParameters = function () {
  var c = this.v.getParameters();
  var A = new Array();
  for (var i = 0; i < c.length; i++) {
    if (c[i].name.indexOf('mbox') != 0) {
      A[A.length] = c[i].name + '=' + c[i].value;
    }
  }
  return A;
};
mbox.prototype.setOnLoad = function (n) {
  this.Rb = n;
  return this;
};
mbox.prototype.setMessage = function (nb) {
  this.message = nb;
  return this;
};
mbox.prototype.setOnError = function (Qb) {
  this.Qb = Qb;
  return this;
};
mbox.prototype.setFetcher = function (Tb) {
  if (this.Lb) {
    this.Lb.cancel();
  }
  this.Lb = Tb;
  return this;
};
mbox.prototype.getFetcher = function () {
  return this.Lb;
};
mbox.prototype.load = function (c) {
  if (this.Lb == null) {
    return this;
  }
  this.setEventTime("load.start");
  this.cancelTimeout();
  this.Kb = 0;
  var v = (c && c.length > 0) ? this.v.clone().addParameters(c) : this.v;
  this.Lb.fetch(v);
  var W = this;
  this.Ub = setTimeout(function () {
    W.Qb('browser timeout', W.Lb.getType());
  }, 15000);
  this.setEventTime("load.end");
  return this;
};
mbox.prototype.loaded = function () {
  this.cancelTimeout();
  if (!this.activate()) {
    var W = this;
    setTimeout(function () {
      W.loaded();
    }, 100);
  }
};
mbox.prototype.activate = function () {
  if (this.Kb) {
    return this.Kb;
  }
  this.setEventTime('activate' + ++this.Ob + '.start');
  if (this.show()) {
    this.cancelTimeout();
    this.Kb = 1;
  }
  this.setEventTime('activate' + this.Ob + '.end');
  return this.Kb;
};
mbox.prototype.isActivated = function () {
  return this.Kb;
};
mbox.prototype.setOffer = function (Mb) {
  if (Mb && Mb.show && Mb.setOnLoad) {
    this.Mb = Mb;
  } else {
    throw 'Invalid offer';
  }
  return this;
};
mbox.prototype.getOffer = function () {
  return this.Mb;
};
mbox.prototype.show = function () {
  this.setEventTime('show.start');
  var A = this.Mb.show(this);
  this.setEventTime(A == 1 ? "show.end.ok" : "show.end");
  return A;
};
mbox.prototype.showContent = function (Vb) {
  if (Vb == null) {
    return 0;
  }
  if (this.Eb == null || !this.Eb.parentNode) {
    this.Eb = this.getDefaultDiv();
    if (this.Eb == null) {
      return 0;
    }
  }
  if (this.Eb != Vb) {
    this.Wb(this.Eb);
    this.Eb.parentNode.replaceChild(Vb, this.Eb);
    this.Eb = Vb;
  }
  this.Xb(Vb);
  this.Rb();
  return 1;
};
mbox.prototype.hide = function () {
  this.setEventTime('hide.start');
  var A = this.showContent(this.getDefaultDiv());
  this.setEventTime(A == 1 ? 'hide.end.ok' : 'hide.end.fail');
  return A;
};
mbox.prototype.finalize = function () {
  this.setEventTime('finalize.start');
  this.cancelTimeout();
  if (this.getDefaultDiv() == null) {
    if (this.lb.force() != null) {
      this.setMessage('No default content, an empty one has been added');
    } else {
      this.setMessage('Unable to locate mbox');
    }
  }
  if (!this.activate()) {
    this.hide();
    this.setEventTime('finalize.end.hide');
  }
  this.setEventTime('finalize.end.ok');
};
mbox.prototype.cancelTimeout = function () {
  if (this.Ub) {
    clearTimeout(this.Ub);
  }
  if (this.Lb != null) {
    this.Lb.cancel();
  }
};
mbox.prototype.getDiv = function () {
  return this.Eb;
};
mbox.prototype.getDefaultDiv = function () {
  if (this.Sb == null) {
    this.Sb = this.lb.locate();
  }
  return this.Sb;
};
mbox.prototype.setEventTime = function (Yb) {
  this.Nb[Yb] = (new Date()).getTime();
};
mbox.prototype.getEventTimes = function () {
  return this.Nb;
};
mbox.prototype.getImportName = function () {
  return this.mb;
};
mbox.prototype.getURL = function () {
  return this.v.buildUrl();
};
mbox.prototype.getUrlBuilder = function () {
  return this.v;
};
mbox.prototype.Zb = function (Eb) {
  return Eb.style.display != 'none';
};
mbox.prototype.Xb = function (Eb) {
  this._b(Eb, true);
};
mbox.prototype.Wb = function (Eb) {
  this._b(Eb, false);
};
mbox.prototype._b = function (Eb, ac) {
  Eb.style.visibility = ac ? "visible" : "hidden";
  Eb.style.display = ac ? "inline-block" : "none";
};
mboxOfferContent = function () {
  this.Rb = function () {};
};
mboxOfferContent.prototype.show = function (X) {
  var A = X.showContent(document.getElementById(X.getImportName()));
  if (A == 1) {
    this.Rb();
  }
  return A;
};
mboxOfferContent.prototype.setOnLoad = function (Rb) {
  this.Rb = Rb;
};
mboxOfferAjax = function (Vb) {
  this.Vb = Vb;
  this.Rb = function () {};
};
mboxOfferAjax.prototype.setOnLoad = function (Rb) {
  this.Rb = Rb;
};
mboxOfferAjax.prototype.show = function (X) {
  var bc = document.createElement('div');
  bc.id = X.getImportName();
  bc.innerHTML = this.Vb;
  var A = X.showContent(bc);
  if (A == 1) {
    this.Rb();
  }
  return A;
};
mboxOfferDefault = function () {
  this.Rb = function () {};
};
mboxOfferDefault.prototype.setOnLoad = function (Rb) {
  this.Rb = Rb;
};
mboxOfferDefault.prototype.show = function (X) {
  var A = X.hide();
  if (A == 1) {
    this.Rb();
  }
  return A;
};
mboxCookieManager = function mboxCookieManager(g, cc) {
  this.g = g;
  this.cc = cc == '' || cc.indexOf('.') == -1 ? '' : '; domain=' + cc;
  this.dc = new mboxMap();
  this.loadCookies();
};
mboxCookieManager.prototype.isEnabled = function () {
  this.setCookie('check', 'true', 60);
  this.loadCookies();
  return this.getCookie('check') == 'true';
};
mboxCookieManager.prototype.setCookie = function (g, h, ab) {
  if (typeof g != 'undefined' && typeof h != 'undefined' && typeof ab != 'undefined') {
    var ec = new Object();
    ec.name = g;
    ec.value = escape(h);
    ec.expireOn = Math.ceil(ab + new Date().getTime() / 1000);
    this.dc.put(g, ec);
    this.saveCookies();
  }
};
mboxCookieManager.prototype.getCookie = function (g) {
  var ec = this.dc.get(g);
  return ec ? unescape(ec.value) : null;
};
mboxCookieManager.prototype.deleteCookie = function (g) {
  this.dc.remove(g);
  this.saveCookies();
};
mboxCookieManager.prototype.getCookieNames = function (fc) {
  var gc = new Array();
  this.dc.each(function (g, ec) {
    if (g.indexOf(fc) == 0) {
      gc[gc.length] = g;
    }
  });
  return gc;
};
mboxCookieManager.prototype.saveCookies = function () {
  var hc = false;
  var ic = 'disable';
  var jc = new Array();
  var kc = 0;
  this.dc.each(function (g, ec) {
    if (!hc || g === ic) {
      jc[jc.length] = g + '#' + ec.value + '#' + ec.expireOn;
      if (kc < ec.expireOn) {
        kc = ec.expireOn;
      }
    }
  });
  var lc = new Date(kc * 1000);
  document.cookie = this.g + '=' + jc.join('|') + '; expires=' + lc.toGMTString() + '; path=/' + this.cc;
};
mboxCookieManager.prototype.loadCookies = function () {
  this.dc = new mboxMap();
  var mc = document.cookie.indexOf(this.g + '=');
  if (mc != -1) {
    var nc = document.cookie.indexOf(';', mc);
    if (nc == -1) {
      nc = document.cookie.indexOf(',', mc);
      if (nc == -1) {
        nc = document.cookie.length;
      }
    }
    var oc = document.cookie.substring(mc + this.g.length + 1, nc).split('|');
    var pc = Math.ceil(new Date().getTime() / 1000);
    for (var i = 0; i < oc.length; i++) {
      var ec = oc[i].split('#');
      if (pc <= ec[2]) {
        var qc = new Object();
        qc.name = ec[0];
        qc.value = ec[1];
        qc.expireOn = ec[2];
        this.dc.put(qc.name, qc);
      }
    }
  }
};
mboxSession = function (rc, sc, zb, tc, I) {
  this.sc = sc;
  this.zb = zb;
  this.tc = tc;
  this.I = I;
  this.uc = false;
  this.Hb = typeof mboxForceSessionId != 'undefined' ? mboxForceSessionId : mboxGetPageParameter(this.sc);
  if (this.Hb == null || this.Hb.length == 0) {
    this.Hb = I.getCookie(zb);
    if (this.Hb == null || this.Hb.length == 0) {
      this.Hb = rc;
      this.uc = true;
    }
  }
  I.setCookie(zb, this.Hb, tc);
};
mboxSession.prototype.getId = function () {
  return this.Hb;
};
mboxSession.prototype.forceId = function (vc) {
  this.Hb = vc;
  this.I.setCookie(this.zb, this.Hb, this.tc);
};
mboxPC = function (zb, tc, I) {
  this.zb = zb;
  this.tc = tc;
  this.I = I;
  this.Hb = typeof mboxForcePCId != 'undefined' ? mboxForcePCId : I.getCookie(zb);
  if (this.Hb != null) {
    I.setCookie(zb, this.Hb, tc);
  }
};
mboxPC.prototype.getId = function () {
  return this.Hb;
};
mboxPC.prototype.forceId = function (vc) {
  if (this.Hb != vc) {
    this.Hb = vc;
    this.I.setCookie(this.zb, this.Hb, this.tc);
    return true;
  }
  return false;
};
mboxGetPageParameter = function (g) {
  var A = null;
  var wc = new RegExp(g + "=([^\&]*)");
  var xc = wc.exec(document.location);
  if (xc != null && xc.length >= 2) {
    A = xc[1];
  }
  return A;
};
mboxSetCookie = function (g, h, ab) {
  return mboxFactoryDefault.getCookieManager().setCookie(g, h, ab);
};
mboxGetCookie = function (g) {
  return mboxFactoryDefault.getCookieManager().getCookie(g);
};
mboxCookiePageDomain = function () {
  var cc = (/([^:]*)(:[0-9]{0,5})?/).exec(document.location.host)[1];
  var yc = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
  if (!yc.exec(cc)) {
    var zc = (/([^\.]+\.[^\.]{3}|[^\.]+\.[^\.]+\.[^\.]{2})$/).exec(cc);
    if (zc) {
      cc = zc[0];
    }
  }
  return cc ? cc : "";
};
mboxShiftArray = function (Ac) {
  var A = new Array();
  for (var i = 1; i < Ac.length; i++) {
    A[A.length] = Ac[i];
  }
  return A;
};
mboxGenerateId = function () {
  return (new Date()).getTime() + "-" + Math.floor(Math.random() * 999999);
};
mboxScreenHeight = function () {
  return screen.height;
};
mboxScreenWidth = function () {
  return screen.width;
};
mboxBrowserWidth = function () {
  return (window.innerWidth) ? window.innerWidth : document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
};
mboxBrowserHeight = function () {
  return (window.innerHeight) ? window.innerHeight : document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
};
mboxBrowserTimeOffset = function () {
  return -new Date().getTimezoneOffset();
};
mboxScreenColorDepth = function () {
  return screen.pixelDepth;
};
if (typeof mboxVersion == 'undefined') {
  var mboxVersion = 44;
  var mboxFactories = new mboxMap();
  var mboxFactoryDefault = new mboxFactory('ryanlogas.tt.omtrdc.net', 'ryanlogas', 'default');
};
if (mboxGetPageParameter("mboxDebug") != null || mboxFactoryDefault.getCookieManager().getCookie("debug") != null) {
  setTimeout(function () {
    if (typeof mboxDebugLoaded == 'undefined') {
      alert('Could not load the remote debug.\nPlease check your connection' + ' to Test&amp;Target servers');
    }
  }, 60 * 60);
  document.write('<' + 'scr' + 'ipt language="Javascript1.2" src=' + '"http://admin5.testandtarget.omniture.com/admin/mbox/mbox_debug.jsp?mboxServerHost=ryanlogas.tt.omtrdc.net' + '&clientCode=ryanlogas"><' + '\/scr' + 'ipt>');
};
mboxVizTargetUrl = function (_) {
  if (!mboxFactoryDefault.isEnabled()) {
    return;
  }
  var v = mboxFactoryDefault.getUrlBuilder().clone();
  v.setBasePath('/m2/' + 'ryanlogas' + '/viztarget');
  v.addParameter('mbox', _);
  v.addParameter('mboxId', 0);
  v.addParameter('mboxCount', mboxFactoryDefault.getMboxes().length() + 1);
  var pb = new Date();
  v.addParameter('mboxTime', pb.getTime() - (pb.getTimezoneOffset() * 60000));
  v.addParameter('mboxPage', mboxGenerateId());
  var c = mboxShiftArray(arguments);
  if (c && c.length > 0) {
    v.addParameters(c);
  }
  v.addParameter('mboxDOMLoaded', mboxFactoryDefault.isDomLoaded());
  return v.buildUrl();
};
