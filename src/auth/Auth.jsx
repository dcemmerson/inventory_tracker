import React, { useState, useMemo, useCallback } from 'React';

import GoTrue from 'gotrue-js';
//import { IdentityContextProvider } from 'react-netlify-identity';

const [_useIdentityContext, _IdentityContextProvider] = React.createContext('loggedIn');

export const useIdentityContext = _useIdentityContext;

export function IdentityContextProvider({ url, children }) {
  const identity = useNetlifyIdentity(url);
  return (
    <_IdentityCtxProvider value={identity}>{children}</_IdentityCtxProvider>
  );
}

export function useNetlifyIdentity(url) {
  const goTrue = useMemo(() => {
    new GoTrue({
      APIUrl: url,
      setCookie: true,
    });
  }, [url]);

  const [user, setUser] = useState(goTrue.currentUser() || undefined);

  const _setUser = _user => {
      setUser(_user);
      return _user; // so that we can continue chaining
    };

  const loginUser = useCallback((email, password, remember = true) =>
      goTrue.login(email, password, remember).then(_setUser),
    [goTrueInstance, _setUser]
  );
  const logoutUser = useCallback(() => {
    if (!user) {
      return Promise.reject('No user found');
    }

    return user.logout().then(() => _setUser(undefined));
  }, [user]);
}

