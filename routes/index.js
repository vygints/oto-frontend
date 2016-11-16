
/*
 * GET home page.
 */
var request = require('request');
require('dotenv').config();

function Poduct(name, price) {
  // always initialize all instance properties
  this.name = name;
  this.price = price; // default value
}

exports.index = function(req, res){
  prod_url = "http://" + process.env.PRODUCT_SERVICE_HOST + ":" + process.env.PRODUCT_SERVICE_PORT + "/product"
  console.log(prod_url)
  request(prod_url, function (error, response, body) {
    if (!error && response.statusCode == 200)
    {
        console.log(body)
        res.render( 'index', {
            title : 'Products',
            products : JSON.parse(body)._items
        });
    }})
};
exports.register = function ( req, res ){
    console.log(req.body);
    prod_url = "http://" + process.env.PRODUCT_SERVICE_HOST + ":" + process.env.PRODUCT_SERVICE_PORT + "/product"
    request({ url: prod_url,
              method: 'POST',
              json: {"name": req.body.Product_name, "price": req.body.price, "stock": 0 }}, res.redirect('/'))

};
