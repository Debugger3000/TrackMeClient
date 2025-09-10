// both login or register will return success boolean, and a message if success if falsey
export interface IAuthResponse {
  success: true;
  message: string;
}

export interface IUserCredentials {
  username: string;
  password: string;
}
