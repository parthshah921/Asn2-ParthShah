/****************************************************************************** ***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *
* Name: Parth d shah Student ID: n01550466 Date: 02/11/2023*
* ****************************************************************************** **/

var express = require('express'); // import the express package
var path = require('path'); // import the path variable
var app = express(); // creating the express app
const exphbs = require('express-handlebars'); // import the express handlebar engine for views
const port = process.env.port || 3000; //  use port environment port and if its not avaiable then use 3000
const fs = require('fs');
const jsonData = require('./ite5315-A1-Car_sales.json');
const salesData = require('./SuperSales.json');
const customHelpers = require('./custom_helper');

app.use(express.static(path.join(__dirname, 'public'))); // tellig the express that use the public folder to get the static files from the project. path join is used to join current directoty path to public.


const hbs = exphbs.create({
    handlebars: customHelpers,
    extname: '.hbs', 
    partialsDir: path.join(__dirname, 'views/partials'),
});

hbs.handlebars.registerPartial('header', fs.readFileSync(path.join(__dirname, 'views/partials/header.hbs'), 'utf8'));
hbs.handlebars.registerPartial('footer', fs.readFileSync(path.join(__dirname, 'views/partials/footer.hbs'), 'utf8'));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); //  Set 'hbs' as the view engine for rendering templates.




// Using a route ('/') and render the 'index' in the response with the title 'Express'.
app.get('/', function (req, res) {
    res.render('index', { title: 'Express', content: "Express is a fast and minimalistic web application framework for Node.js. It simplifies building web and API applications with easy-to-define routes and middleware for processing requests. Developers have the freedom to structure applications as they see fit. Express supports various template engines and is commonly used for both server-rendered web pages and RESTful APIs. It can serve static files, making it suitable for client-side assets. With a large and active community, Express offers an abundance of middleware packages and extensions. It excels in performance and scalability, making it ideal for large-scale applications. Express can integrate with databases and supports WebSocket libraries for real-time communication. Its simplicity, versatility, and strong community support make it a top choice for Node.js developers." });
});

// Using a route ('/users') and sending a text as a response.
app.get('/users', function (req, res) {
    res.send('respond with a resource');
});


app.get('/about', (req, res) => {
    res.render('about', { data: {} });
});


app.get('/data', (req, res) => {
    res.render('data', { content: JSON.stringify(jsonData) });
});

app.get('/data/invoiceNo/:index', (req, res) => {
    const index = parseInt(req.params.index);

    if (isNaN(index) || index < 0 || index >= jsonData.carSales.length) {
        res.render('error', { title: 'Error', message: 'Invalid index' });
    } else {
        const invoiceNo = jsonData.carSales[index].InvoiceNo;
        res.render('getInvoiceNo', { invoiceNo: invoiceNo });
    }
});

app.get('/data/search/invoiceNo', (req, res) => {
    res.render('searchInvoiceNo');
});

app.post('/data/search/invoiceNo', (req, res) => {

    let requestBody = '';
    req.on('data', (chunk) => {
        requestBody += chunk.toString();
    });

    req.on('end', () => {
        const formData = new URLSearchParams(requestBody);
        const enteredInvoiceNo = formData.get('invoiceNo');

        // Search for the entered InvoiceNo in the JSON data
        const info = jsonData.carSales.find((item) => item.InvoiceNo === enteredInvoiceNo);

        if (info) {

            res.render('invoiceinfo', { info: info });
        } else {
            res.render('error', { title: 'Error', message: 'Invoice not found' });
        }
    })
});

app.get('/data/search/manufacturer', (req, res) => {
    res.render('searchManufacture');
   
});

app.post('/data/search/manufacturer/result', (req, res) => {

    let requestBody = '';
    req.on('data', (chunk) => {
        requestBody += chunk.toString();
    });

    req.on('end', () => {

        const formData = new URLSearchParams(requestBody);
        const enteredManufacturer = formData.get('manufacturer');

        const matchingCars = jsonData.carSales.filter((car) =>
            car.Manufacturer.toLowerCase().includes(enteredManufacturer.toLowerCase())
        );       

        if (matchingCars.length > 0) {
                res.render('carInfo', { info: matchingCars })
        } else {
            res.render('error', { title: 'Error', message: 'No cars found for the specified Manufacturer' });
        }
    });
});

app.get('/viewData', (req, res) => {
      const salesDataInfo = salesData;
    res.render('viewTableData', { salesData: salesDataInfo });
});

app.get('/filterViewData', (req, res) => {
    const salesDataInfo = salesData;    
    res.render('viewFilteredSalesData', { salesData: salesDataInfo });
});

app.get('/showZero', (req, res) => {
    const salesDataInfo = salesData;   
    const modifiedSalesData = salesDataInfo.map((data) => {
        if (data.Rating === 0) {
            data.Rating = 'zero';
        }
        return data;
    }); 
    res.render('showZero', { salesData: modifiedSalesData });
});



const filteredSalesData = salesData.filter(data => data.Rating !== 0);





// Using a route(*) for all other URLs and render the 'error' template with the title 'Error' and a message.
app.get('*', function (req, res) {
    res.render('error', { title: 'Error', message: 'Wrong Route' });
});

// listen the app on specified port above.
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})