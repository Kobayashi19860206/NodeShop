const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Allows us to set any values globally on our Express application. (And this can also be keys or configuration items Express doesn't understand; in that case it just ignores them, but we could read them from the app object with app.get(), but we're not interested in this.) We can use some reserved key names, configuration items you can set, that do lead to Express.js behaving differently. Interesting to us: the views and view engine keys. View engine allows us to tell Express: for any dynamic templates we're trying to render, please use this engine we're registering here. Views allows us to tell Express where to find these dynamic views
// Pug ships with build-in Express support and auto-registers itself with Express, so to say, that's why putting Pug below works
// So, telling Express to compile dynamic templates with the Pug engine, and below, where to find these templates (views)
app.set('view engine', 'pug');
// Setting this explicity, though the main directory/views is the default location for the views for the view engine to use
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Express middleware are functions that execute during the lifecycle of a request to the Express server

// Register body parser so req.body doesn't output undefined
// Using body-parser. It's currently included with Express, but including (installing and using it as separate middleware) just in case it's removed in the future (it has been removed and added a handful of times)
// bodyParser.urlencoded() registers a middleware, i.e., passing a function like (req, res, next) => {} even though can't see it. Calls next() in the end
// Doesn't parse all types of bodies (files, JSON, etc.), but will parse bodies like one getting here (sent through form)
// When extended property is set to true, the URL-encoded data will be parsed with the qs library. qs library allows you to create a nested object from your query string. However, my purpose of using this instead of extended: false to get rid of [Object: null prototype] in console (which appears because with that setting, it's parsed by query-string library. The object returned by the querystring.parse() method does not prototypically inherit from the JavaScript Object. This means that typical Object methods such as obj.toString(), obj.hasOwnProperty(), and others are not defined and will not work. In other words, they have null prototype)
app.use(bodyParser.urlencoded({ extended: true }));
// Static method that ships with Express is a built-in method that serves static files. Files served statically: not handled by Express.js router or other middleware, but instead directly forwarded to the file system. Path to folder to be served statically is passed in; a folder to grant read access to. Can do this for CSS, JS, images...
// Reminder: __dirname, a core Node.js feature, gives the absolute path of the directory containing the currently executing file (root folder)
// Could register multiple static folders, and it would funnel the request through all of them until it were to have a first hit for the file it were looking for
app.use(express.static(path.join(__dirname, 'public')));

// The order of these doesn't matter, but only because using get rather than router.use in shop.js; with get, post, etc., it's an exact match -- not the case if you change it to router.use. still, better to care about the order in case it's changed back to router.use
// Addition of '/admin' makes it so only routes starting with /admin will go into the admin routes file, and Express will omit/ignore that segment in the URL when it tries to match the routes in the routes file; it's like stripping it out (so you don't have to keep repeating it in each route)
// So the filtering mechanism allows us to add a common starting segment for our path, which all routes in a given file use, to outsource that into this file so don't have to repeat it for all the routes in the route file
// adminData refers to all the exports from admin.js routes file (routes and products)
app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Catchall middleware; for requests to path without any fitting middleware
app.use((req, res) => {
  // Can chain status Express convenience method to set status code, setHeader ... send just has to be the last method in the chain
  // Don't have to go up a level since already in the root folder
  res.status(404).render('404');
});

// Express shorthand
app.listen(3000);
