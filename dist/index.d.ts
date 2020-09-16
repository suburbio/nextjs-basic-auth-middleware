import { IncomingMessage, ServerResponse } from 'http';
import { AuthCredentials } from './credentials';
export declare type MiddlewareOptions = {
    realm?: string;
    users?: AuthCredentials;
    includePaths?: string[];
    excludePaths?: string[];
};
/**
 * Middleware that sends a basic auth challenge to the user when enabled
 * @param req Http server incoming message
 * @param res Server response
 */
declare const basicAuthMiddleware: (req: IncomingMessage, res: ServerResponse, { realm, users, includePaths, excludePaths, }: MiddlewareOptions) => Promise<void>;
export default basicAuthMiddleware;
