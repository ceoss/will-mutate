export interface ProxifyOptions {
	deep?: boolean;
	prototype?: boolean;
}
/*
	Create a Will Mutate mutation proxy for a target object.
*/
// eslint-disable-next-line @typescript-eslint/ban-types
export declare function proxify <T extends Object> (target: T, options?: ProxifyOptions): T;
export default proxify;
