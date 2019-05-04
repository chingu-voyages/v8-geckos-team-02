import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isAuthenticated: false,
  draft: null,
  pins: [],
  currentPin: null
});

export default Context;
