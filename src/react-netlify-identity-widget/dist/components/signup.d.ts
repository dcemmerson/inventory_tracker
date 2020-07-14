/// <reference types="react" />
import { User } from 'react-netlify-identity';
declare type SignupProps = {
    onSignup?: (user?: User) => void;
};
export declare function Signup({ onSignup }: SignupProps): JSX.Element;
export {};
