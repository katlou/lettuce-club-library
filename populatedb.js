#! /usr/bin/env node

console.log('This script populates a some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Book = require('./models/book')
var Author = require('./models/author')
var Genre = require('./models/genre')
var BookInstance = require('./models/bookinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var genres = []
var books = []
var bookinstances = []

function authorCreate(first_name, family_name, d_birth, d_death, cb) {
  authordetail = {first_name:first_name , family_name: family_name }
  if (d_birth != false) authordetail.date_of_birth = d_birth
  if (d_death != false) authordetail.date_of_death = d_death

  var author = new Author(authordetail);

  author.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Author: ' + author);
    authors.push(author)
    cb(null, author)
  }  );
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function bookCreate(title, summary, isbn, author, genre, cb) {
  bookdetail = {
    title: title,
    summary: summary,
    author: author,
    isbn: isbn
  }
  if (genre != false) bookdetail.genre = genre

  var book = new Book(bookdetail);
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  }  );
}


function bookInstanceCreate(book, imprint, due_back, status, cb) {
  bookinstancedetail = {
    book: book,
    imprint: imprint
  }
  if (due_back != false) bookinstancedetail.due_back = due_back
  if (status != false) bookinstancedetail.status = status

  var bookinstance = new BookInstance(bookinstancedetail);
  bookinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING BookInstance: ' + bookinstance);
      cb(err, null)
      return
    }
    console.log('New BookInstance: ' + bookinstance);
    bookinstances.push(bookinstance)
    cb(null, book)
  }  );
}


function createGenreAuthors(cb) {
    async.parallel([
        function(callback) {
          authorCreate('Buzz', 'Lightyear', '1973-06-06', false, callback);
        },
        function(callback) {
          authorCreate('Edna', 'Mode', '1932-11-8', false, callback);
        },
        function(callback) {
          authorCreate('Lightning', 'McQueen', '1920-01-02', '1992-04-06', callback);
        },
        function(callback) {
          authorCreate('Mike', 'Wazowski', false, false, callback);
        },
        function(callback) {
          authorCreate('Riley', 'Anderson', '1971-12-16', false, callback);
        },
        function(callback) {
          genreCreate("Fantasy", callback);
        },
        function(callback) {
          genreCreate("Science Fiction", callback);
        },
        function(callback) {
          genreCreate("French Poetry", callback);
        },
        ],
        // optional callback
        cb);
}


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('The Name of the Lettuce (The Lettuce Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Wise Lettuce's Fear (The Lettuce Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Slow Regard of Silent Lettuce (The Lettuce Chronicle #3)", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("Lettuce wars : ten years of work and struggle in the fields of California", "Part memoir, part informed commentary on farm labor, the U.S. labor movement, and the political economy of agriculture, Lettuce Wars is a lively account written from the perspective of the fields. Neuburger portrays the people he encountered - immigrant workers, fellow radicals, company bosses, cops and goons - vividly and indelibly, lending a human aspect to the conflict between capital and labor as it played out in the fields of California.", '9781583673331', authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate("Perception of bitterness, sweetness and liking of different genotypes of lettuce","Consumers could discern differences in taste that were quantified biochemically.•Ratio of bitter:sweet compounds determines bitterness perception and liking.8-Deoxylactucin-15-sulphate contributes most strongly to bitterness perception.•Glucose was most highly correlated with sweetness perception.There is a genetic basis to the biochemical composition of lettuce. Lettuce is an important leafy vegetable, consumed across the world, containing bitter sesquiterpenoid lactone (SL) compounds that may negatively affect consumer acceptance and consumption.", '9780765379504', authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate('Packing and shipping lettuce in fiberboard cartons and wooden crates : a comparison', 'Capicola boudin drumstick tongue pig corned beef jerky meatloaf ground round biltong bresaola andouille turkey ribeye picanha. Fatback leberkas bacon shoulder porchetta. Kevin pork loin bresaola, leberkas alcatra corned beef ground round sirloin prosciutto meatloaf salami. Pork chop jowl boudin, tri-tip chuck short loin sausage shank doner meatball jerky salami t-bone cupim.', '1583673326', authors[4], [genres[0],genres[1]], callback);
        },
        function(callback) {
          bookCreate('9 tricks with the lettuce bowl : the new rage in "He-Man" salads.', 'The only home we have ever known encyclopaedia galactica corpus callosum culture? Kindling the energy hidden in matter vastness is bearable only through love astonishment star stuff harvesting star light, birth radio telescope quasar, rings of Uranus as a patch of light corpus callosum, something incredible is waiting to be known Sea of Tranquility kindling the energy hidden in matter hearts of the stars, Hypatia.', '1583673334', authors[4], false, callback)
        }
        ],
        // optional callback
        cb);
}


function createBookInstances(cb) {
    async.parallel([
        function(callback) {
          bookInstanceCreate(books[0], 'Penguin Random House, 2014.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[1], 'Scholastic, 2011.', false, 'Loaned', callback)
        },
        function(callback) {
          bookInstanceCreate(books[2], 'Scholastic, 2015.', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'Harper Collins, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'Harper Collins, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'Harper Collins, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'McGraw-Hill Education, 2015.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'McGraw-Hill Education, 2015.', false, 'Maintenance', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'McGraw-Hill Education, 2015.', false, 'Loaned', callback)
        },
        function(callback) {
          bookInstanceCreate(books[0], 'Harvard University Press, 2017.', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(books[1], 'Harvard University Press, 2016.', false, false, callback)
        }
        ],
        // optional callback
        cb);
}



async.series([
    createGenreAuthors,
    createBooks,
    createBookInstances
],
// optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);

    }
    //All done, disconnect from database
    mongoose.connection.close();
});
