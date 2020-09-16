import auth from 'basic-auth';
declare type AuthCredentialsObject = {
    name: string;
    password: string;
};
export declare type AuthCredentials = AuthCredentialsObject[];
export declare const parseCredentials: (credentials: string) => AuthCredentials;
/**
 * Compares the basic auth credentials with the configured user and password
 * @param credentials Basic Auth credentials object from `basic-auth`
 */
export declare const compareCredentials: (user: auth.BasicAuthResult, requiredCredentials: AuthCredentials) => boolean;
export {};
