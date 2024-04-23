const { Router } = require("express");
const { Views } = require("../Model/view.model");
const viewsController = Router();

// POST request to increment view count
viewsController.post('/views', async (req, res) => {
    try {
        const ipAddress = req.connection.remoteAddress;
        if (!ipAddress) {
            return res.status(400).send('Invalid IP address');
        }

        let views = await Views.findOne({ ip: ipAddress });

        if (!views) {
            // If the IP address is not found, create a new entry
            views = new Views({ ip: ipAddress, visited: true, count: 1 });
        } else if (!views.visited) {
            // If the IP address has not visited before, increment the count
            views.visited = true;
            views.count++;
        }

        await views.save();
        res.status(200).send({ count: views.count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET request to fetch total view count
viewsController.get('/views', async (req, res) => {
    try {
        const views = await Views.aggregate([
            { $group: { _id: null, totalCount: { $sum: "$count" } } }
        ]);
        const totalCount = views.length > 0 ? views[0].totalCount : 0;
        res.status(200).send({ count: totalCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = { viewsController };
