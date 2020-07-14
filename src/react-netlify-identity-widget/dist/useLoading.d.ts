export default function useLoading(): [boolean, <A>(aPromise: Promise<A>) => Promise<A>];
