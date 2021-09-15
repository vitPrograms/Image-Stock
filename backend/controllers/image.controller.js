const db = require('../db')
class ImageController {
    async getImages(req, res) {
        const allImages = await db.query('SELECT * FROM image')
        res.json(allImages.rows)
    }

    async getOneImage(req, res) {
        const id = req.params.id
        const oneImage = await db.query('SELECT * FROM image where id = $1', [id])
        res.json(oneImage.rows[0])
    }

    async addImages(req, res) {
        const srcArray = req.body
        if(!srcArray){
            res.status(404).send('No send files')
        }

        srcArray.forEach(async file => {
            const newImage = await db.query('INSERT INTO image (lastModified, name, size, type, base64src) values ($1,$2,$3,$4,$5) RETURNING *', 
            [file.lastModified, file.name, file.size, file.type, file.base64src])
        })
        res.status(200).send('Ok')
    }
}

module.exports = new ImageController()