class Input {
    constructor() {
        this._urls = []
        this._format = 'audio'
        this._changeListeners = []
    }

    get urls() {
        return this._urls
    }

    get format() {
        return this._format
    }

    set urls(value) {
        // Check urls are valid
        try {
            value.forEach(url => new URL(url))
        } catch (e) {
            throw Error('Invalid URL(s)')
        }

        this._urls = value
        this._notifyChangeListeners()
    }

    set format(value) {
        this._format = value
        this._notifyChangeListeners()
    }

    /**
     * @typedef InputState
     * @property {string[]} urls
     * @property {'audio' | 'video'} format 
     */

    /**
     * @callback changeListener
     * @param {InputState} state
     */

    /**
     * @param {changeListener} changeListener
     */
    registerChangeListener(changeListener) {
        this._changeListeners.push(changeListener)
    }

    _notifyChangeListeners() {
        this._changeListeners.forEach(listener => listener({
            urls: this._urls,
            format: this._format
        }))
    }
}

export { Input }