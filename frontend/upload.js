export function imagePlugin(selector, options = {}) {
    const input = document.querySelector(selector)
    const preview = document.createElement('div')
    const open = document.querySelector('.add-button')
    let sendButton
    preview.classList.add('add-preview')

    let files = []
    const uploadFiles = []

    if(options.multi)
        input.setAttribute('multiple', true)

    if(options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }
    
    input.insertAdjacentElement('afterend', preview)

    open.addEventListener('click', () => input.click())
    input.addEventListener('change', filesHandler)

    function filesHandler(event) {
        preview.textContent = ''
        const uploadFiles = []
        files = Array.from(event.target.files)

        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = event => {
                preview.insertAdjacentHTML('afterbegin', 
                `<div class="add-preview-card">
                    <img src="${event.target.result}" class="preview-image"/>
                </div>`
                )
                const fileObj = {
                    lastModified: file.lastModified,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    base64src: event.target.result
                }
                uploadFiles.push(fileObj)
            }
            reader.readAsDataURL(file)
            
        })

        if(files){
            sendButton = document.querySelector('.send-btn')
            sendButton.addEventListener('click', () => sendImage())
        }

        function sendImage(){
            console.log(uploadFiles)
            fetch('http://localhost:8080/api/add', {
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(uploadFiles)
            })
            .then((stat) => {
                console.log(stat)
                document.location.href = document.location
            })
        }
    }





    const loadPreview = document.querySelector('.image-list')

    fetch('http://localhost:8080/api/images')
    .then(response => response.json())
    .then(data => {
        //console.log(data)
        addCards(data)
    })

    function addCards(data){
        data.forEach(dFile => {
            console.log(dFile)
            loadPreview.innerHTML += (`<div class="add-preview-card"><img src="${dFile.base64src}" class="preview-image"/></div>`)
        })
    }
}