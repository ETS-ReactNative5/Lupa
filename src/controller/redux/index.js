import  {createStore} from 'redux';
import ReduxThunk from 'redux-thunk';
import LupaReducer from './reducers';
import { applyMiddleware } from 'redux';

const LupaStore = createStore(LupaReducer, applyMiddleware(ReduxThunk));

LupaStore.subscribe(() => {
//Handle any subscriptions here
});

export function getCurrentStoreState() {
    return LupaStore.getState();
}


export default LupaStore;
