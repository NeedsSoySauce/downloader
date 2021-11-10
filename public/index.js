import { Input } from "./input.js"

const API_ENDPOINT = 'https://ytdl.needssoysauce.com/api/'
const WEBSOCKET_ENDPOINT = 'wss://ytdl.needssoysauce.com/api/'
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

const setupWebSocket = (url = WEBSOCKET_ENDPOINT) => {
    const socket = new WebSocket(url)

    socket.addEventListener('open', (event) => {
        socket.send(`WebSocket opened with ${url}`)
    });

    socket.addEventListener('message', (event) => {
        console.log(`WebSocket message from ${url}: ${event.data}`)
    });

    socket.addEventListener('close', () => {
        console.log(`WebSocket closed with ${url}`)
    })

    socket.addEventListener('error', (event) => {
        console.log(`WebSocket error with ${url}`, event)
    })
}

const main = () => {
    const input = new Input()
    setupWebSocket()
    setupUrlsTextArea(input)
    setupFormatCheckbox(input)
    setupDownloadButton(input)
}

document.addEventListener("DOMContentLoaded", main)
