import { Input } from "./input.js"

const API_ENDPOINT = 'https://ytdl.needssoysauce.com/api/'
const WEBSOCKET_ENDPOINT = 'ws://ytdl.needssoysauce.com/api/'
const URL_INPUT_PLACEHOLDER = `Enter urls, one per line, e.g.

https://example.com
https://example.com
https://example.com
`

const createDownloadUrl = (urls, format = 'audio') => {
    const qs = urls.map(url => `url=${url}`).join('&')
    return `${API_ENDPOINT}?format=${format}&${qs}`;
}

const setupUrlsTextArea = (input) => {
    const urlsTextArea = document.querySelector('#urls')

    urlsTextArea.placeholder = URL_INPUT_PLACEHOLDER

    urlsTextArea.addEventListener('input', (e) => {
        /**@type {string} */
        const value = e.target.value.trim()
        const urls = value.split('\n').map(url => url.trim()).filter(url => url.length > 0)

        try {
            input.urls = urls
        } catch (e) {
            console.log(e)
            urlsTextArea.classList.add('error')
            return
        }

        urlsTextArea.classList.remove('error')
    })
}

const setupFormatCheckbox = (input) => {
    const formatCheckbox = document.querySelector('#format')
    formatCheckbox.addEventListener('change', (e) => {
        input.format = e.target.checked ? 'audio' : 'video'
    })
}

const setupDownloadButton = (input) => {
    const downloadButton = document.querySelector('#download')

    const updateHref = (urls, format) => {
        if (!urls.length) {
            downloadButton.removeAttribute('href')
            return
        }
        const downloadUrl = createDownloadUrl(urls, format)
        downloadButton.href = downloadUrl
    }

    input.registerChangeListener(({ urls, format }) => updateHref(urls, format))

    updateHref(input.urls, input.format)
}

const main = () => {
    const input = new Input()
    setupUrlsTextArea(input)
    setupFormatCheckbox(input)
    setupDownloadButton(input)

    const socket = new WebSocket(WEBSOCKET_ENDPOINT)

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });
}

document.addEventListener("DOMContentLoaded", main)
