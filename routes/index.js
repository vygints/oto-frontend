
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
  order_url = "http://" + process.env.ORDER_SERVICE_HOST + ":" + process.env.ORDER_SERVICE_PORT + "/orders"

  console.log(prod_url)
  var products = []
  var orders = []
  request(prod_url, function (error, response, body) {
    if (!error && response.statusCode == 200)
    {
        console.log(body)
        products = JSON.parse(body)._items
        request(order_url, function (error, response, body) {
        if (!error && response.statusCode == 200)
        {
            console.log(body)
            res.render( 'index', {
                title : 'Orders',
                products : products,
                orders : JSON.parse(body)._embedded.orders
            });
        }})
    }})

};

exports.register = function ( req, res ){
    console.log(req.body);
    prod_url = "http://" + process.env.PRODUCT_SERVICE_HOST + ":" + process.env.PRODUCT_SERVICE_PORT + "/product"
    request({ url: prod_url,
              method: 'POST',
              json: {"name": req.body.Product_name, "price": req.body.price, "stock": 0 }}, res.redirect('/'))

};

exports.order = function ( req, res ){
    console.log(req.body);
    var prod_url = "http://" + process.env.PRODUCT_SERVICE_HOST + ":" + process.env.PRODUCT_SERVICE_PORT + "/product"
    console.log(prod_url)
    var products = []
    request(prod_url, function (error, response, body, products) {
        if (!error && response.statusCode == 200)
        {
            console.log(body);
            products = JSON.parse(body)._items;

            var prod_id = "";
            var total = 0;
            console.log("starting to iterate on prods");
            for (var prod of products) {
                console.log(prod.name);
                if ( prod.name == req.body.chosen )
                {
                    prod_id = prod._id;
                    total = prod.price * req.body.amount[0];
                    order_url = "http://" + process.env.ORDER_SERVICE_HOST + ":" + process.env.ORDER_SERVICE_PORT + "/orders"
                    console.log(prod_id + " amount" + req.body.amount[0] + " totalSum " + total);
                    request({ url: order_url,
                        method: 'POST',
                        json: {"productId": prod_id, "amount": req.body.amount[0], "totalSum": total }},
                               function(error, response, body){
                                   if (!error && response.statusCode == 200)
                                    {
                                        console.log(body);
                                         res.redirect('/')
                                    }
                                    else
                                    {
                                         console.log("error " + body);
                                         res.redirect('/')
                                    }})

                }
            }
        }
    })
};
