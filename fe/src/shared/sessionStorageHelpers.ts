import { State } from './types';

export const SESSION_STORAGE_KEY = 'CHAT_APP';
export const SESSION_STORAGE_USER_ID = 'CHAT_APP_MY_ID';

export const getUser = (id: string) => {
  const sessionStorageString = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionStorageString) return undefined;

  const usersArray: State[] = JSON.parse(sessionStorageString);

  return usersArray.find((user) => user.id === id);
};

export const getMeUser = () => {
  const sessionStorageString = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionStorageString) return undefined;

  const usersArray: State[] = JSON.parse(sessionStorageString);
  return usersArray.find((user) => user.isMe);
};

export const rewriteState = (state: State[]) => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  const newStateJson = JSON.stringify(state);
  sessionStorage.setItem(SESSION_STORAGE_KEY, newStateJson);
};

export const removeUserId = () => sessionStorage.removeItem(SESSION_STORAGE_USER_ID);

// export const setUser = (isMe?: boolean = false) => {
//   const sessionStorageString = sessionStorage.getItem(SESSION_STORAGE_KEY);
//   if (!sessionStorageString) return undefined;
//
//   const sessionStorageValue = JSON.parse(sessionStorageString)
//   const prepareNewValue =
// };

export const initializeSessionStorage = () => {
  const sessionStorageString = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionStorageString) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify([]));
  }
};
