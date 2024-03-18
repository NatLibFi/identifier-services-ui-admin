import {useContext} from 'react';
import {AppStateDispatchContext} from '/src/frontend/providers/AppStateProvider';

const useAppStateDispatch = () => useContext(AppStateDispatchContext);
export default useAppStateDispatch;
