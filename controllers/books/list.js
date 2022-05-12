const Book = require('../../models/Book');
const Author = require('../../models/Author');

module.exports = function (req, res, next) {
  const $or = [];

  if (req.query.q) {
    const searchText = decodeURI(req.query.q);
    $or.push({ title: searchText });
  }

  if (req.query.author) {
    const authorId = decodeURI(req.query.author);
    $or.push({ author: authorId });
  }

  Book
    .find($or.length ? { $or } : {}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec(function (err, listBooks) {
      if (err) return next(err);

      Author
        .find({}, 'first_name family_name id')
        .exec(function (err, listAuthors) {
          if (err) return next(err);

          res.render('book_list', { title: 'Book List', book_list: listBooks, author_list: listAuthors });
        });
    });
};
