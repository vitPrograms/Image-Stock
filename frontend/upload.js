export function imagePlugin(selector, options = {}) {
    const input = document.querySelector(selector)
    const preview = document.createElement('div')
    let sendButton
    preview.classList.add('add-preview')

    let files = []
    
    const open = document.createElement('button')
    open.classList.add('add-button')
    open.textContent = 'Додати'

    if(options.multi)
        input.setAttribute('multiple', true)

    if(options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }
    
    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', open)

    open.addEventListener('click', () => input.click())
    input.addEventListener('change', filesHandler)

    function filesHandler(event) {
        preview.textContent = ''
        files = Array.from(event.target.files)

        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = event => {
                preview.insertAdjacentHTML('afterbegin', 
                `<div class="add-preview-card">
                    <img src="${event.target.result}" class="preview-image"/>
                </div>`
                )
            }
            reader.readAsDataURL(file)
            
        })

        if(files){

            sendButton = document.querySelector('.send-btn')
            sendButton.addEventListener('click', (event) => {
                const file = input.files[0]
                fetch('http://localhost:8080/api/add', {
                    method:'POST',
                    headers: {
                        'Content-Type':'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(file)
                })
                .then(console.log(file))
            })
        }


    }
}