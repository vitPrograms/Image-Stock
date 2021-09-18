import {uploadFiles} from './upload.js'

uploadFiles('#image-select', {
    multi: true,
    accept: ['.jpeg', '.jpg', '.png', '.gif']
})