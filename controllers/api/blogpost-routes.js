const router = require('express').Router();
const { Blogpost, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all users
router.get('/', (req, res) => {
  console.log('======================');
  Blogpost.findAll({
    attributes: [
      'id',
      'body',
      'title',
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
    .then(dbBlogPostData => res.json(dbBlogPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Blogpost.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
        'id',
        'body',
        'title',
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
    .then(dbBlogpostData => {
      if (!dbBlogpostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbBlogpostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Blogpost.create({
    title: req.body.title,
    body: req.body.body,
    user_id: req.session.user_id
  })
    .then(dbBlogpostData => res.json(dbBlogpostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.put('/:id', withAuth, (req, res) => {
  Blogpost.update(
    {
        title: req.body.title,
        body: req.body.body,
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbBlogpostData => {
      if (!dbBlogpostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbBlogpostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbBlogPostData => {
      if (!dbBlogPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbBlogpostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
