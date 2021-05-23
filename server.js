// session express session
const path = require('path');
const express = require("express");
const session = require('express-session');
const exphbs = require('express-handlebars');
// to make style sheet available to the client

const app = express();
const PORT = process.env.PORT || 3005;



const sequelize = require("./config/connection");
// session
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  // Set cookie to expire in 5 minutes
  cookie: { },
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


app.use(require('./controllers/'));
// turn on connection to db and server //tables will drop if force:true
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});