import {useContext} from 'react';
import {RuntimeEnvContext} from '/src/frontend/AppWrapper.jsx';

const useRuntimeEnv = () => useContext(RuntimeEnvContext);
export default useRuntimeEnv;
