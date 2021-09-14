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
        console.log(req)
        //const newImage = await db.query('INSERT INTO image src values $1 RETURNING *', [src])
        //res.json(srcArray)
    }
}

module.exports = new ImageController()