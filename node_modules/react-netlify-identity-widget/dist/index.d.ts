/// <reference types="react" />
import { AuthProps } from './app';
import { IdentityContextProvider as _IdentityContextProvider } from 'react-netlify-identity';
export { User, Settings, ReactNetlifyIdentityAPI, useNetlifyIdentity } from 'react-netlify-identity';
/** URL of your Netlify Instance with Identity enabled e.g. https://netlify-gotrue-in-react.netlify.com */
declare type ModalProps = {
    /** pass a boolean to be true or false */
    showDialog: boolean;
    /** modal will call this function to set the state of showDialog to false */
    onCloseDialog?: () => void;
} & AuthProps;
export declare const IdentityContextProvider: typeof _IdentityContextProvider;
export declare const useIdentityContext: () => import("react-netlify-identity").ReactNetlifyIdentityAPI;
export declare function IdentityModal({ showDialog, onCloseDialog, ...authprops }: ModalProps): JSX.Element;
export default IdentityModal;
