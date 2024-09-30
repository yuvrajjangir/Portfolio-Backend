 const { Router } = require("express");
 const { Views } = require("../Model/view.model");
 const axios = require('axios');
 const userAgent = require('express-useragent');
 const viewsController = Router();
 
 // Middleware to parse user-agent
 viewsController.use(userAgent.express());
 
 // Utility to get the first IP address
 const getIpAddress = (req) => {
     const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
     return ip.includes(',') ? ip.split(',')[0].trim() : ip;
 };
 
 // Combine Userstack API with fallback to express-useragent
 const getDeviceInfo = async (req) => {
     const apiKey = 'YOUR_USERSTACK_API_KEY';  // Replace with your Userstack API key
     const userAgentString = req.headers['user-agent'];
     let deviceInfo = "Unknown Device";
     
     try {
         // Try to get device info from Userstack API
         const response = await axios.get('http://api.userstack.com/detect', {
             params: {
                 access_key: apiKey,
                 ua: userAgentString
             }
         });
 
         const data = response.data;
         if (data.device && data.device.brand && data.device.name) {
             deviceInfo = `${data.device.brand} ${data.device.name}`;  // Example: "iPhone 15", "Samsung Galaxy S23"
         }
 
     } catch (error) {
         console.error('Error fetching device info from Userstack:', error.message);
     }
 
     // If Userstack returns "Unknown Device" or "Other", fallback to local parsing
     if (deviceInfo === "Unknown Device" || deviceInfo === "Other") {
         const agent = req.useragent;
         if (agent.platform && agent.browser && agent.os) {
             deviceInfo = `${agent.platform} ${agent.browser} ${agent.os}`;  // Fallback to express-useragent
         }
     }
 
     return deviceInfo;
 };
 
 // Add IP, device info, and timestamp when user visits the portfolio
 viewsController.post('/views', async (req, res) => {
     try {
         const userIp = getIpAddress(req);
         const deviceInfo = await getDeviceInfo(req);
         const visitTime = new Date();
 
         console.log('User-Agent:', req.headers['user-agent']);  
         console.log('User IP:', userIp);     
         console.log('Device Info:', deviceInfo); 
         console.log('Visit Time:', visitTime);
 
         let views = await Views.findOne();
         if (!views) {
             views = new Views();
             views.visitors = [];
         }
 
         // Check if the user's IP and device are already counted
         const existingVisitor = views.visitors.find(visitor => visitor.ip === userIp && visitor.device === deviceInfo);
 
         if (!existingVisitor) {
             views.visitors.push({ ip: userIp, device: deviceInfo, timestamp: visitTime });
             views.count++;
 
             await views.save();
             console.log('Visitor saved successfully.');
 
             // Log the document from MongoDB to check if it's saved correctly
             const savedViews = await Views.findOne();  // Fetch again after save
             console.log('Data in MongoDB:', JSON.stringify(savedViews, null, 2));
         } else {
             console.log('Visitor already exists, not counted again.');
         }
 
         res.status(200).send({ count: views.count });
     } catch (err) {
         console.error('Error during save operation:', err.message);
         res.status(500).send('Server Error');
     }
 });
 
 
 // Get total views count and visitor info
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