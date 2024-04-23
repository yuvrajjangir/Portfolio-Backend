const {Router} = require("express");
const { Views } = require("../Model/view.model");
const viewsController = Router();

viewsController.post('/views', async (req, res) => {
    try {
        let views = await Views.findOne();
        if (!views) {
            views = new Views();
        }
        views.count++;
        await views.save();
        res.status(200).send({ count: views.count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get total views count
viewsController.get('/views', async (req, res) => {
    try {
        let views = await Views.findOne();
        if (!views) {
            return res.status(404).send('Views not found');
        }
        res.status(200).send({ count: views.count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = {viewsController};