// session express session
const session = require('express-session');

// to make style sheet available to the client
const path = require('path');

const routes = require('./controllers');
const express = require("express");
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3005;

const sequelize = require("./config/connection");
// session
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  // Set cookie to expire in 5 minutes
  cookie: { maxAge: 5 * 60 * 1000 },
  resave: false,
  rolling: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// to add style sheet and serve as asset
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server //tables will drop if force:true
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});