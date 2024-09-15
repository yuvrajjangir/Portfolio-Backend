const { Router } = require("express");
const { Views } = require("../Model/view.model");
const useragent = require('useragent');
const viewsController = Router();

// Utility to get IP address
const getIpAddress = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress;

// Utility to parse device information from user-agent
const getDeviceInfo = (req) => {
    const agent = useragent.parse(req.headers['user-agent']);
    if (agent.device.family === 'Other') {
        if (agent.isMobile) return 'Mobile';
        if (agent.isTablet) return 'Tablet';
        if (agent.isDesktop) return 'Desktop';
    }
    return agent.device.family;  // Device name (iPhone, Samsung, etc.)
};

// Add IP and device info when user visits the portfolio
viewsController.post('/views', async (req, res) => {
    try {
        const userIp = getIpAddress(req);
        const deviceInfo = getDeviceInfo(req);

        let views = await Views.findOne();
        if (!views) {
            views = new Views();
            views.visitors = [];
        }

        // Check if the user's IP and device are already counted
        const existingVisitor = views.visitors.find(visitor => visitor.ip === userIp && visitor.device === deviceInfo);

        if (!existingVisitor) {
            // If not found, increment view count and add to visitors
            views.visitors.push({ ip: userIp, device: deviceInfo });
            views.count++;
            await views.save();
        }

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
        res.status(200).send({ count: views.count, visitors: views.visitors });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = { viewsController };
