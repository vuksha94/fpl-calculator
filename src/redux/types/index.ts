import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import { ManagerAction, NumOfManagers } from '../Manager/types';

export type State = NumOfManagers;

export type Action = ManagerAction;

export type Store = ReduxStore<State, Action>;

export type Dispatch = ReduxDispatch<Action>;




