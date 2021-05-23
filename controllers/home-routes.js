const router = require('express').Router();
const { Blogpost, User, Comment } = require('../models');

// get all posts for homepage
router.get('/', (req, res) => {
  console.log('======================');
  Blogpost.findAll({
    attributes: [
        'id',
        'title',
        'summary',
        'user_id',
        'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'blogpost_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbBlogPostData => {
      const blogposts = dbBlogPostData.map(post => post.get({ plain: true }));

      res.render('homepage', {
        blogposts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get single post
router.get('/blogpost/:id', (req, res) => {
  Blogpost.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
        'id',
        'title',
        'summary',
        'user_id',
        'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'blogpost_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render('single-blogpost', {
        post,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
