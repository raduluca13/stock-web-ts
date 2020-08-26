import { call, put, takeEvery, all } from "redux-saga/effects";
import { getUsersFromJSON } from "../state/data/UserApi";
import { getUsersSuccessActionCreator, getUsersFailureActionCreator } from "../state/actions/UserActionsCreator";
import UserActionTypes from "../state/types/UserActionTypes.enum";

export function* getUsersSaga(): any {
  try {
    const response = yield call(getUsersFromJSON);
    const users = response.data.results;
    yield put(getUsersSuccessActionCreator(users));
  } catch (e) {
    yield put(getUsersFailureActionCreator());
  }
}

// export function* searchCharactersSaga(action: ISearchCharactersAction): any {
//   try {
//     const response = yield call(searchCharactersFromApi, action.term);
//     const characters = response.data.results;
//     yield put(getCharactersSuccessActionCreator(characters));
//   } catch (e) {
//     yield put(getCharactersFailureActionCreator());
//   }
// }

export function* usersSaga(): any {
  yield all([
    takeEvery(UserActionTypes.GET_USERS_START, getUsersSaga),
    // takeEvery(CharacterActionTypes.SEARCH_CHARACTERS, searchCharactersSaga),
  ]);
}
