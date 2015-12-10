export default class Spinner {
    _hidden = false;
    _id = 0;
    _interval = null;
    _profiling = false;
    _rows = {};
    _spinnerPos = 0;

    constructor(spinnerSpeed = 150, spinnerChars = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏') {
        this._intervalTime = spinnerSpeed;
        this._spinnerChars = spinnerChars;
    }

    _clearFull() {
        for (const id of Object.keys(this._rows)) {
            const row = this._rows[id];

            if (row.visible) {
                row.visible = false;
                row.cursor
                    .up()
                    .eraseLine()
                    .horizontalAbsolute(0);
            }
        }
    }

    _render() {
        if (this._hidden) {
            return;
        }

        this._clearFull();
        this._renderFinished();
        this._renderActive();
        this._stopIntervalIfPossible();
    }

    _renderFinished() {
        for (const id of Object.keys(this._rows)) {
            const row = this._rows[id];

            if (!row.remove) {
                continue;
            }
            if (row.clear) {
                delete this._rows[id];
                continue;
            }

            row.writeMessage(row.cursor);
            row.visible = true;

            if (row.success) {
                row.cursor
                    .fg.green()
                    .bold()
                    .write(' ✓');
            } else {
                row.cursor
                    .fg.red()
                    .bold()
                    .write(' ✗');
            }

            if (this._profiling && row.start) {
                const diff = '' + (Date.now() - row.start);
                row.cursor
                    .fg.blue()
                    .resetBold()
                    .write(` (${diff}ms)`);
            }

            row.cursor
                .reset()
                .write('\n');

            delete this._rows[id];
        }
    }

    _renderActive() {
        this._spinnerPos = ++this._spinnerPos % this._spinnerChars.length;
        const spinnerChar = this._spinnerChars[this._spinnerPos];

        for (const id of Object.keys(this._rows)) {
            const row = this._rows[id];

            if (row.clear) {
                continue;
            }

            row.writeMessage(row.cursor);
            row.visible = true;

            row.cursor
                .write(' ')
                .fg.yellow()
                .bold()
                .write(spinnerChar)
                .resetBold()
                .write(row.progress)
                .reset()
                .write('\n');
        }
    }

    _remove(id) {
        if (!this._rows[id]) {
            return;
        }

        this._rows[id].remove = true;
        this._clearFull();
        this._render();
    }

    _startInterval() {
        if (this._interval) {
            return;
        }

        this._interval = setInterval(
            ::this._render,
            this._intervalTime
        );
    }

    _stopIntervalIfPossible() {
        if (!Object.keys(this._rows).length) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    _setProgress(id, value) {
        if (!this._rows[id]) {
            return;
        }

        let progress = Math.round(value);
        if (progress < 10) {
            progress = ' ' + progress;
        }

        this._rows[id].progress = ` ${progress}%`;
    }

    enableProfiling(flag = true) {
        this._profiling = flag;
    }

    add(cursor, writeMessage) {
        const id = this._id++;

        this._rows[id] = {
            cursor,
            writeMessage,
            visible: false,
            remove: false,
            success: false,
            clear: false,
            progress: '',
            start: this._profiling ? Date.now() : false
        };
        this._startInterval();

        return {
            done: () => {
                this._rows[id].success = true;
                this._remove(id);
            },
            clear: () => {
                this._rows[id].clear = true;
                this._remove(id);
            },
            error: () => {
                this._remove(id);
            },
            setProgress: (value) => {
                this._setProgress(id, value);
            }
        };
    }

    hide() {
        this._hidden = true;
        this._clearFull();
    }

    show() {
        this._hidden = false;
        this._render();
    }
}
