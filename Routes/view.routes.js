const { Router } = require("express");
const { Views } = require("../Model/view.model");
const useragent = require("useragent");
const viewsController = Router();

// Utility to get IP address
const getIpAddress = (req) =>
  req.headers["x-forwarded-for"] || req.socket.remoteAddress;

// Utility to parse device information from user-agent
// Utility to parse device information from user-agent
const getDeviceInfo = (req) => {
    const userAgent = req.headers['user-agent'];
    
    if (/mobile/i.test(userAgent)) {
        return 'Mobile';
    }
    if (/tablet/i.test(userAgent)) {
        return 'Tablet';
    }
    if (/iPad|Macintosh/i.test(userAgent) && 'ontouchend' in document) {
        return 'Tablet';  // iPads running as desktops in certain cases
    }
    if (/iPhone|Android/i.test(userAgent)) {
        return 'Mobile';
    }
    return 'Desktop';  // Default fallback for desktops and unknown
};


// Add IP and device info when user visits the portfolio
viewsController.post("/views", async (req, res) => {
  try {
    const userIp = getIpAddress(req);
    const deviceInfo = getDeviceInfo(req);

    console.log('User IP:', userIp);       // Log the extracted IP
    console.log('Device Info:', deviceInfo);  // Log the extracted Device info

    let views = await Views.findOne();
    if (!views) {
      views = new Views();
      views.visitors = [];
    }

    // Check if the user's IP and device are already counted
    // Check if the user's IP and device are already counted
    const existingVisitor = views.visitors.find(
      (visitor) => visitor.ip === userIp && visitor.device === deviceInfo
    );

    if (!existingVisitor) {
      views.visitors.push({ ip: userIp, device: deviceInfo }); // Push both IP and Device Info
      views.count++;
      await views.save();
    }

    res.status(200).send({ count: views.count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get total views count
viewsController.get("/views", async (req, res) => {
  try {
    let views = await Views.findOne();
    if (!views) {
      return res.status(404).send("Views not found");
    }
    res.status(200).send({ count: views.count, visitors: views.visitors });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = { viewsController };
