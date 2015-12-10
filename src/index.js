import Log from './Log';

const instance = new Log();
instance.addLevel('debug',  0, process.stdout, {  // eslint-disable-line no-multi-spaces
    color: 'grey'
});
instance.addLevel('info',  10, process.stdout);   // eslint-disable-line no-multi-spaces
instance.addLevel('warn',  20, process.stdout, {  // eslint-disable-line no-multi-spaces
    prefix: '‼ ',
    color: 'yellow'
});
instance.addLevel('error', 30, process.stderr, {
    prefix: '✘ ',
    color: 'red'
});

export default instance;
export const debug = ::instance.debug;
export const debugWait = ::instance.debugWait;
export const error = ::instance.error;
export const errorWait = ::instance.errorWait;
export const getLines = ::instance.getLines;
export const info = ::instance.info;
export const infoWait = ::instance.infoWait;
export const namespace = ::instance.namespace;
export const setVerbose = ::instance.setVerbose;
export const warn = ::instance.warn;
export const warnWait = ::instance.warnWait;

export { default as Log } from './Log';
export { default as Spinner } from './Spinner';
