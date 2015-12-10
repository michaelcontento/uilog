import ansi from 'ansi';

import Spinner from './Spinner';

let buffer = '';
let isVerbose = false;
let spinner;

function hasSpinner() {
    return !!spinner;
}

function getSpinner() {
    if (!spinner) {
        spinner = new Spinner();
        spinner.enableProfiling(isVerbose);
    }
    return spinner;
}

export default class Log {
    constructor(namespace = '') {
        const trimmedNamespace = namespace.trim();
        this._namespace = trimmedNamespace
            ? trimmedNamespace + ' » '
            : '';
    }

    getLines() {
        return buffer;
    }

    setVerbose(flag) {
        isVerbose = flag;

        if (hasSpinner()) {
            getSpinner().enableProfiling(flag);
        }

        return this;
    }

    namespace(namespace) {
        return new Log(this._namespace + namespace);
    }

    addLevel(name, level, stream, opts = {}) {
        const cursor = ansi(stream);

        const writeToBuffer = (namespace, message) => {
            buffer += `[${name}] `
                + (opts.prefix || '')
                + namespace
                + message
                + '\n';
        };

        // Helper that writes the given message
        const write = (namespace, message) => {
            if (opts.color) {
                cursor.fg[opts.color]();
            }

            cursor
                .write(opts.prefix || '')
                .write(namespace)
                .write(message)
                .reset();
        };

        // Simply write a new line
        Log.prototype[name] = function logLine(message = '') {
            writeToBuffer(this._namespace, message);

            if (!isVerbose && level < 10) {
                return this;
            }

            if (hasSpinner()) {
                getSpinner().hide();
            }

            write(this._namespace, message);
            cursor.write('\n');

            if (hasSpinner()) {
                getSpinner().show();
            }

            return this;
        };

        // Async version that spawns the spinner
        Log.prototype[name + 'Wait'] = function logWait(message = '') {
            if (!isVerbose && level < 10) {
                const noop = () => {};
                return { done: noop, error: noop, setProgress: noop };
            }

            return getSpinner(this._isVerbose).add(cursor, () => {
                write(this._namespace, message);
            });
        };
    }
}
