/// <reference types="react" />
import { User } from 'react-netlify-identity';
declare type LoginProps = {
    onLogin?: (user?: User) => void;
};
export declare function Login({ onLogin }: LoginProps): JSX.Element;
export {};
