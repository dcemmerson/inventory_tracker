'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var dialog = require('@reach/dialog');
var VisuallyHidden = _interopDefault(require('@reach/visually-hidden'));
var reactNetlifyIdentity = require('react-netlify-identity');
var tabs = require('@reach/tabs');

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function useLoading() {
  var _React$useState = React.useState(false),
      isLoading = _React$useState[0],
      setState = _React$useState[1];

  var mount = React.useRef(false);
  React.useEffect(function () {
    mount.current = true;
    return function () {
      return void (mount.current = false);
    };
  }, []);

  function load(aPromise) {
    setState(true);
    return aPromise["finally"](function () {
      return mount.current && setState(false);
    });
  }

  return [isLoading, load];
}

function Login(_ref) {
  var onLogin = _ref.onLogin;

  var _useIdentityContext = reactNetlifyIdentity.useIdentityContext(),
      loginUser = _useIdentityContext.loginUser;

  var formRef = React.useRef(null);

  var _React$useState = React.useState(''),
      msg = _React$useState[0],
      setMsg = _React$useState[1];

  var _useLoading = useLoading(),
      isLoading = _useLoading[0],
      load = _useLoading[1];

  return React.createElement("form", {
    ref: formRef,
    className: "form",
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      var target = e.target;
      var email = target.email.value;
      var password = target.password.value;
      load(loginUser(email, password, true)).then(function (user) {
        console.log('Success! Logged in', user);
        if (onLogin) onLogin(user);
      })["catch"](function (err) {
        return void console.error(err) || setMsg('Error: ' + err.message);
      });
    }
  }, React.createElement("div", {
    className: "RNIW_formGroup",
    key: "email"
  }, React.createElement("label", null, React.createElement(VisuallyHidden, null, "Enter your email"), React.createElement("input", {
    className: "RNIW_formControl",
    type: "email",
    name: "email",
    placeholder: "Email",
    autoCapitalize: "off",
    required: true
  }), React.createElement("div", {
    className: "RNIW_inputFieldIcon RNIW_inputFieldEmail"
  }))), React.createElement("div", {
    className: "RNIW_formGroup",
    key: "password"
  }, React.createElement("label", null, React.createElement(VisuallyHidden, null, "Enter your password"), React.createElement("input", {
    className: "RNIW_formControl",
    type: "password",
    name: "password",
    placeholder: "Password",
    required: true
  }), React.createElement("div", {
    className: "RNIW_inputFieldIcon RNIW_inputFieldPassword"
  }))), React.createElement("div", null, React.createElement("button", {
    type: "submit",
    className: isLoading ? 'RNIW_btn RNIW_saving' : 'RNIW_btn'
  }, "Log in"), msg && React.createElement("pre", {
    style: {
      background: 'salmon',
      padding: 10
    }
  }, msg)), React.createElement("button", {
    type: "button",
    className: "RNIW_btnLink forgotPasswordLink"
  }, "Forgot password?"));
}

function Logout(_ref) {
  var onLogout = _ref.onLogout;
  var identity = reactNetlifyIdentity.useIdentityContext();

  var _React$useState = React.useState(''),
      msg = _React$useState[0],
      setMsg = _React$useState[1];

  var name = identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.full_name || 'NoName';

  var _useLoading = useLoading(),
      isLoading = _useLoading[0],
      load = _useLoading[1];

  var logout = function logout() {
    return load(identity.logoutUser()).then(function () {
      if (onLogout) onLogout();
    })["catch"](function (err) {
      return void console.error(err) || setMsg('Error: ' + err.message);
    });
  };

  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "RNIW_header"
  }, React.createElement("button", {
    className: "RNIW_btn RNIW_btnHeader active"
  }, "Logged in")), React.createElement("form", {
    className: "form "
  }, React.createElement("p", {
    className: "RNIW_infoText"
  }, "Logged in as ", React.createElement("br", null), React.createElement("span", {
    className: "RNIW_infoTextEmail"
  }, name)), React.createElement("button", {
    type: "submit",
    className: isLoading ? 'RNIW_btn RNIW_saving' : 'RNIW_btn',
    onClick: logout
  }, "Log out"), msg && React.createElement("pre", {
    style: {
      background: 'salmon',
      padding: 10
    }
  }, msg)));
}

function Signup(_ref) {
  var onSignup = _ref.onSignup;

  var _useIdentityContext = reactNetlifyIdentity.useIdentityContext(),
      signupUser = _useIdentityContext.signupUser;

  var formRef = React.useRef(null);

  var _React$useState = React.useState(''),
      msg = _React$useState[0],
      setMsg = _React$useState[1];

  var _useLoading = useLoading(),
      isLoading = _useLoading[0],
      load = _useLoading[1];

  var signup = function signup() {
    if (!formRef.current) return;
    var full_name = formRef.current.username.value;
    var email = formRef.current.email.value;
    var password = formRef.current.password.value;
    var data = {
      signupSource: 'react-netlify-identity-widget',
      full_name: full_name
    };
    load(signupUser(email, password, data)).then(function (user) {
      console.log('Success! Signed up', user);
      if (onSignup) onSignup(user);
    })["catch"](function (err) {
      return void console.error(err) || setMsg('Error: ' + err.message);
    });
  };

  return React.createElement("form", {
    ref: formRef,
    className: "form",
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      signup();
    }
  }, React.createElement("div", {
    className: "RNIW_formGroup",
    key: "username"
  }, React.createElement("label", null, React.createElement(VisuallyHidden, null, "Enter your name"), React.createElement("input", {
    id: "username",
    className: "RNIW_formControl",
    type: "name",
    name: "username",
    placeholder: "Name",
    autoCapitalize: "off",
    required: true
  }), React.createElement("div", {
    className: "RNIW_inputFieldIcon RNIW_inputFieldName"
  }))), React.createElement("div", {
    className: "RNIW_formGroup",
    key: "email"
  }, React.createElement("label", null, React.createElement(VisuallyHidden, null, "Enter your email"), React.createElement("input", {
    className: "RNIW_formControl",
    type: "email",
    name: "email",
    placeholder: "Email",
    autoCapitalize: "off",
    required: true
  }), React.createElement("div", {
    className: "RNIW_inputFieldIcon RNIW_inputFieldEmail"
  }))), React.createElement("div", {
    className: "RNIW_formGroup",
    key: "password"
  }, React.createElement("label", null, React.createElement(VisuallyHidden, null, "Enter your password"), React.createElement("input", {
    className: "RNIW_formControl",
    type: "password",
    name: "password",
    placeholder: "Password",
    required: true
  }), React.createElement("div", {
    className: "RNIW_inputFieldIcon RNIW_inputFieldPassword"
  }))), React.createElement("div", null, React.createElement("button", {
    type: "submit",
    className: isLoading ? 'RNIW_btn RNIW_saving' : 'RNIW_btn'
  }, "Sign Up"), msg && React.createElement("pre", {
    style: {
      background: 'salmon',
      padding: 10
    }
  }, msg)));
}

function Providers() {
  var _useIdentityContext = reactNetlifyIdentity.useIdentityContext(),
      settings = _useIdentityContext.settings;

  var hasProviders = Object.entries(settings.external).some(function (_ref) {
    var k = _ref[0],
        v = _ref[1];
    return ['github', 'gitlab', 'bitbucket', 'google'].includes(k) && v;
  });
  if (!hasProviders) return null;
  var isLocalhost = false;

  if (typeof window !== 'undefined') {
    isLocalhost = Boolean(window.location.hostname === 'localhost' || // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' || // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
  }

  return React.createElement("div", {
    className: "providersGroup"
  }, isLocalhost && React.createElement("pre", null, "\u26A0\uFE0FTesting providers on localhost won't work because OAuth redirects to your production site"), React.createElement("hr", {
    className: "RNIW_hr"
  }), React.createElement(ProviderButton, {
    settings: settings,
    provider: "Google"
  }), React.createElement(ProviderButton, {
    settings: settings,
    provider: "GitHub"
  }), React.createElement(ProviderButton, {
    settings: settings,
    provider: "GitLab"
  }), React.createElement(ProviderButton, {
    settings: settings,
    provider: "Bitbucket"
  }));
}

function ProviderButton(_ref2) {
  var settings = _ref2.settings,
      provider = _ref2.provider;
  var ext = settings.external;
  if (!ext[provider.toLowerCase()]) return null;

  var _useIdentityContext2 = reactNetlifyIdentity.useIdentityContext(),
      loginProvider = _useIdentityContext2.loginProvider;

  var click = function click() {
    return loginProvider(provider.toLowerCase());
  };

  return React.createElement("button", {
    onClick: click,
    className: "provider" + provider + " RNIW_btn RNIW_btnProvider"
  }, "Continue with ", provider);
}

function LoggedOutScreen(props) {
  return React.createElement("div", null, React.createElement(tabs.Tabs, {
    defaultIndex: 0
  }, React.createElement(tabs.TabList, {
    className: "RNIW_header"
  }, React.createElement(tabs.Tab, {
    className: "RNIW_btn RNIW_btnHeader"
  }, "Login"), React.createElement(tabs.Tab, {
    className: "RNIW_btn RNIW_btnHeader"
  }, "Sign Up")), React.createElement(tabs.TabPanels, null, React.createElement(tabs.TabPanel, null, React.createElement(Login, {
    onLogin: props.onLogin
  })), React.createElement(tabs.TabPanel, null, React.createElement(Signup, {
    onSignup: props.onSignup
  })))), React.createElement(Providers, null));
}

function LoggedInScreen(props) {
  return React.createElement(Logout, {
    onLogout: props.onLogout
  });
}

function Widget(props) {
  var identity = reactNetlifyIdentity.useIdentityContext();
  var isLoggedIn = Boolean(identity && identity.user);
  return isLoggedIn ? React.createElement(LoggedInScreen, Object.assign({}, props)) : React.createElement(LoggedOutScreen, Object.assign({}, props));
}

var IdentityContextProvider = reactNetlifyIdentity.IdentityContextProvider;
var useIdentityContext = reactNetlifyIdentity.useIdentityContext;
function IdentityModal(_ref) {
  var showDialog = _ref.showDialog,
      onCloseDialog = _ref.onCloseDialog,
      authprops = _objectWithoutPropertiesLoose(_ref, ["showDialog", "onCloseDialog"]);

  return React.createElement(dialog.Dialog, {
    isOpen: showDialog,
    onDismiss: onCloseDialog,
    style: {
      border: 'solid 5px hsla(0, 0%, 0%, 0.5)',
      borderRadius: '10px',
      position: 'relative',
      maxWidth: 400
    }
  }, React.createElement("button", {
    className: "RNIW_btn RNIW_btnClose",
    onClick: onCloseDialog
  }, React.createElement(VisuallyHidden, null, "Close")), React.createElement(Widget, Object.assign({}, authprops)));
}

Object.defineProperty(exports, 'useNetlifyIdentity', {
  enumerable: true,
  get: function () {
    return reactNetlifyIdentity.useNetlifyIdentity;
  }
});
exports.IdentityContextProvider = IdentityContextProvider;
exports.IdentityModal = IdentityModal;
exports.default = IdentityModal;
exports.useIdentityContext = useIdentityContext;
//# sourceMappingURL=react-netlify-identity-widget.cjs.development.js.map
