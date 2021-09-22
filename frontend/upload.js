export function uploadFiles(selector, options) {
    let input = document.querySelector(selector)
    const addImageContainer = document.querySelector('.add-image')
    const open = addImageContainer.querySelector('.add-button')
    const send = addImageContainer.querySelector('.send-btn')
    let preview = createPreview()
    let files = []

    input = loadInputOptions(input, options)
    input.insertAdjacentElement('afterend', preview)

    open.addEventListener('click', () => input.click())

    input.addEventListener('change', (event) => {
        files = filesHandler(Array.from(event.target.files))
        hideButton(files)
    })

    preview.addEventListener('click', event => {
        imageInteractive(event)
        hideButton(files)
    })

    send.addEventListener('click', event => {
        sendImageHandler(event)
    })

    function hideButton(files) {
        send.hidden = files.length === 0 ? true : false
    }

    function filesHandler(files) {
        preview.innerHTML = ''
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = event => {
                const size = bytesToSize(file.size)
                preview.insertAdjacentHTML('beforeend', 
                `<div class="add-preview-card" >
                    <button class="delete-button" data-remove="${file.name}">&#x2716</button>
                    <span class="image-info" title="${file.name}">${file.name}</span>
                    <span class="image-size" title="${size}">${size}</span>
                    <img src="${event.target.result}" class="preview-image" data-open="${file.name}"/>
                </div>`)
                file.base64 = event.target.result
            }
            reader.readAsDataURL(file)
        })
        return files
    }

    function imageInteractive(event) {
        const dataset = event.target.dataset

        if(dataset.remove) {
            const name = dataset.remove
            const result = files.filter(file => file.name !== name)
            const block = preview.querySelector(`[data-remove="${name}"]`).closest('.add-preview-card')
            block.remove()

            files = result
        }else if(dataset.open) {
            const name = event.target.dataset.open
            const file = files.find(file => file.name === name)
            
            const modular = document.createElement('div')
            modular.classList.add('modular-window')
            modular.innerHTML = `<img src="${file.base64}" class="download" data-download="${file.name}" title="${file.name}"/>`

            preview.append(modular)
        }else if(event.target.className === 'modular-window') {
            const block = preview.querySelector('.modular-window')
            block.remove()
        }else if(event.target.className === 'download') {
            const linkSource = event.target.src
            var link = document.createElement('a')
            link.setAttribute('href',linkSource)
            link.setAttribute('download', dataset.download)
            onload=link.click()

        }
    }

    function sendImageHandler(event) {
        let data = []
        let size = 0, block
        files.forEach(file => {
            const imageData = {}
            imageData.lastModified = file.lastModified
            imageData.name = file.name
            imageData.type = file.type
            imageData.size = file.size
            imageData.base64 = file.base64

            data.push(imageData)
            size += file.size
        })
    
        files = []
        hideButton(files)
        preview.innerHTML = ''

        const loading = document.createElement('div')
        loading.classList.add('loading')
        loading.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>'

        addImageContainer.insertAdjacentElement('beforeend', loading)

        fetch('http://localhost:8080/api/add', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response)
            if(response.ok){
                block = messageBlock(`Успішно надіслано ${data.length} зображень`)
            }else if(response.status === 413){
                block = messageBlock(`Файл занадто великий [${bytesToSize(size)}] | Макс. 40Мб`, '#F47174')
            }else{
                block = messageBlock('Щось пішло не так!', '#F47174')
            }
            preview.insertAdjacentElement('beforeend', block)
            setTimeout(() => {
                block.remove()
            }, 4000)

            loading.remove()
        })
        .catch(() => {
            block = messageBlock('Щось пішло не так!', '#F47174')
            preview.insertAdjacentElement('beforeend', block)
            setTimeout(() => {
                block.remove()
            }, 4000)

            loading.remove()
        })
    }
}


function loadInputOptions(input, options) {
    input.setAttribute('multiple', options.multi)
    input.setAttribute('accept', options.accept.join(','))

    return input
}

function createPreview() {
    const preview = document.createElement('div')
    preview.classList.add('preview-container')

    return preview
}

function messageBlock(text, color = '#257A3E') {
    const block = document.createElement('div')
    block.classList.add('message-block')
    block.textContent = text
    block.style.color = color

    return block
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}