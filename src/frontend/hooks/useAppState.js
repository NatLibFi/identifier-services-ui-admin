import {useContext} from 'react';
import {AppStateContext} from '/src/frontend/providers/AppStateProvider';

const useAppState = () => useContext(AppStateContext);
export default useAppState;
