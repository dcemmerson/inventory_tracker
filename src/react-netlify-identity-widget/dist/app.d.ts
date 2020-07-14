/// <reference types="react" />
import { User } from 'react-netlify-identity';
export declare type AuthProps = {
    onLogin?: (user?: User) => void;
    onSignup?: (user?: User) => void;
    onLogout?: () => void;
};
export declare function Widget(props: AuthProps): JSX.Element;
