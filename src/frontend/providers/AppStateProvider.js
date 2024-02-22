import React, {createContext, useReducer} from 'react';
import {PropTypes} from 'prop-types';

const AppStateContext = createContext(undefined);
const AppStateDispatchContext = createContext(undefined);

function AppStateProvider({children}) {
  const initialAppState = {language: 'fi', typeOfService: getInitialTypeOfService(), snackbarMessage: null};
  const [appState, setAppState] = useReducer((prev, next) => ({...prev, ...next}), initialAppState);

  return (
    <AppStateContext.Provider value={appState}>
      <AppStateDispatchContext.Provider value={setAppState}>
        {children}
      </AppStateDispatchContext.Provider>
    </AppStateContext.Provider>
  );


  /**
   * Retrieves type of service based on url. If there is definition, it is also
   * stored to local storage for consistency. If URL does not match any service
   * falls back to what is found from local storage. If local storage is empty, defaults
   * to isbn-registry service.
   * @returns {String} 'isbn' or 'issn'
   */
  function getInitialTypeOfService() {
    const pathname = window.location.pathname;

    if(pathname.startsWith('/issn-registry/')) {
      window.localStorage.setItem('identifierServicesAdmin.typeOfService', 'issn');
      return 'issn';
    }

    if(pathname.startsWith('/isbn-registry/')) {
      window.localStorage.setItem('identifierServicesAdmin.typeOfService', 'isbn');
      return 'isbn';
    }

    const localStorageValue = window.localStorage.getItem('identifierServicesAdmin.typeOfService');
    return ['isbn', 'issn'].find(t => localStorageValue === t) ?? 'isbn';
  }
}

AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export {AppStateProvider, AppStateContext, AppStateDispatchContext};
