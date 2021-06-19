
var express = require('express')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var session = require('express-session')
const expressValidator = require('express-validator')
var expressMessage = require('express-messages')
var passport=require('passport');

const fileUpload = require('express-fileupload');
const path = require('path');


var app = express();


// parse application/x-www-form-urlencoded

app.use(express.urlencoded({ extended: false
 }));


   // Get   category model
   var Category = require('./models/category');

   // Get all categories to paas to header.ejs

 Category.find(function(err,categories){
       if(err){
           console.log(err);

       }else{
           app.locals.categories =categories;

       }
   });

 
  

// file-upload middleware
app.use(fileUpload());




// express - session
app.use(session({
    secret: 'keyboard ',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge:1000 * 60 * 60 * 24 }
}));

//Passport config
require('./config/passport')(passport);
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// express validator
app.use(expressValidator({

    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {

                case '.jpg':
                    return '.jpg';

                case '.png':
                    return '.png';

                case '.jpeg':
                    return '.jpeg';
                    case '.webp':
                    return '.webp';

                case '':
                    return '.jpg';

                default:
                    return false;


            }
        }
    }
}));



// express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//mongodb connection
// mongodb+srv://navi:navi@nav.tqjfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority;


mongoose.connect('mongodb+srv://navi:navi@nav.tqjfp.mongodb.net/ecommerce?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }
).then(function () {
    console.log("database connected");
})


//view engine

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');



//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//set global errors variable
app.locals.errors = null;




app.use(function(req,res,next){
    res.locals.cart=req.session.cart
    res.locals.user = req.user 
    next()
});







// set route
var order=require('./routes/order.js');
var products = require('./routes/products.js');
var cart=require('./routes/cart.js');
var users=require('./routes/users.js')
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminProducts = require('./routes/admin_products.js');
var adminOrders=require('./routes/admin_orders.js');



app.use('/admin/orders',adminOrders);
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/cart',cart);
app.use('/users', users);
app.use('/order',order);
app.use('/', products);



//error page

app.use(function(req,res){
    res.status(404).render('errors/error')
})




let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function () {
    console.log('server has started successfully');
});

