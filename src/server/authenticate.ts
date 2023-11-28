import { allowedUsers } from '../secrets';
import { AUTH_MESSAGES } from '../constants';
import type WebSocket from 'ws';

export interface AuthorizedWebSocket extends WebSocket {
  isAuthorized?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const authenticateUser = (ws: AuthorizedWebSocket, message: string) => {
  const { username, password } = JSON.parse(message);
  const isValidUser = allowedUsers.some(
    (user) => user.username === username && user.password === password,
  );

  if (isValidUser) {
    ws.isAuthorized = true;
    ws.send(AUTH_MESSAGES.SUCCESS);
  } else {
    ws.send(AUTH_MESSAGES.DENIED);
    ws.close();
  }
};
