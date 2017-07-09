var crypto =  require('crypto');


exports.install = function() {
	F.route('/', view_index);
	F.route('/portfolio', view_portfolio);
	F.route('/aboutme', view_aboutme);
	

	F.route('/docs/{doc}', view_doc);
	F.route('/conv1', view_conv1);
	F.route('/conv2', view_conv2);
	F.route('/display/{file}', view_display);
	F.route('/encryption', view_encryption);
	F.route('/encrypt', encrypt, ['get', 'post']);



// Gallery

	F.route('/gallery', view_gallery);

	F.route('/gallery/artists', view_artists, ['get']);
	F.route('/gallery/artists', create_artist, ['post']);
	F.route('/gallery/artists/{id}/edit', show_edit_artist, ['get']);
	F.route('/gallery/artists/{id}', edit_artist, ['put']);
	F.route('/gallery/artists/{id}', delete_artist, ['delete']);

	F.route('/gallery/artists/{id}/art', view_artist_art, ['get']);
	F.route('/gallery/artists/{id}/art', create_art, ['post']);
	F.route('/gallery/artists/{id}/art/{art_id}/edit', show_edit_art, ['get']);
	F.route('/gallery/artists/{id}/art/{art_id}', edit_art, ['put']);
	F.route('/gallery/artists/{id}/art/{art_id}', delete_art, ['delete']);

	F.route('/gallery/art', view_all_art, ['get']);
	F.route('/gallery/art/{artist_id}', get_artist_art, ['get']);
}

function view_display() {
	var self = this,
		p = self.req.path[1],
		cb;

	if (p == 'conv1') cb = 'https://github.com/Hamlet-Tamaz/conversion1';
	else if (p == 'conv2') cb = 'https://github.com/Hamlet-Tamaz/conversion2';

	self.view('display', {path: p, cb: cb});
}


function view_index() {
	var self = this;
	self.view('index');
}

function view_portfolio() {
	var self = this;
	self.view('portfolio');
}

function view_aboutme() {
	var self = this;

	self.view('aboutme');
}


function view_doc() {
	var self = this;

	var model = {};

	model.path = self.req.path[1];

	self.view('doc_display', model);
}

function view_conv1() {
	var self = this;

	self.view('conv1');
}

function view_conv2() {
	var self = this;

	self.view('conv2');
}

function view_encryption() {
	var self = this;


	self.view('encryption');
}

function encrypt() {

	var self = this,
			body = self.body,
			algorithm = 'aes-256-ctr',
			inp = {},
			out;
	
	inp = {
		name: body.name,
		message: body.message,
		expiration: body.expiration,
		passphrase: body.passphrase
	}

	var passphrase = inp.passphrase;


	function encrypt(text){
	  var cipher = crypto.createCipher(algorithm, passphrase)
	  var crypted = cipher.update(text,'utf8','hex')
	  crypted += cipher.final('hex');
	  return crypted;
	}

	function decrypt(text){
	  var decipher = crypto.createDecipher(algorithm, passphrase)
	  var dec = decipher.update(text,'hex','utf8')
	  dec += decipher.final('utf8');
	  return dec;
	}
	
	if(body.mode == 'encrypt') {
		if(inp.name.length > 0) {
			if(inp.message.length > 0)  {
				inp = JSON.stringify(inp);
				out = encrypt(inp);
			} else {
				out = {error: "Sorry, your message doesn't match our requirements"};
			}
		} else {
			out = {error: "Sorry, your name doesn't match our requirements."};
		}

	}
	else {

		out = decrypt(body.secretMsg);
		console.log('out: ', out, 'secret:', body.secretMsg)

		try {
			out = JSON.parse(out);
		} catch (err) {
			out = {error: "Your passphrase isn't correct."};
		}


		if(out.expiration < new Date().toISOString().split('T')[0] && out.expiration != '') {
			out = {error: "Sorry, your message has either expired or not decryptable"};
		} 
	}	

	self.plain(out);
}


// GALLERY 


function view_gallery() {
	var self = this;

	self.view('gallery_index');
}
	
function view_artists() {
	var self = this;

	F.database(function(err, client, done) {
		client.query('SELECT id, first_name, last_name, dob, email FROM artists ORDER BY id', function(err, result) {
			done();

			if(err != null) {
				self.throw500(err);
				return;
			}
			else {
				if(self.req.query.flash) {
					self.repository.flash = self.req.query.flash;
				}

				self.view('artists', result.rows);
			}
		});
	});
}
	
function create_artist() {
	var self = this;

	DB(function(err, client, done) {
		client.query('INSERT INTO artists (first_name, last_name, dob, email) VALUES ($1, $2, $3, $4)', [self.body.fname, self.body.lname, self.body.dob, self.body.email], 
			function(err, result) {
				if(err != null) {
					self.throw500(err);
					return;
				}
				else {
					self.redirect('/gallery/artists?flash=added');
				}
		})
	})
}


function show_edit_artist() {
	var self = this;

	DB(function(err, client, done){
		client.query('SELECT id, first_name, last_name, dob, email FROM artists WHERE id='+self.req.path[2],
		function(err, result) {
			if(err != null) {
				self.throw500(err);
				return;
			}
			else {
				self.json(result.rows[0]);
			}
		})
	})
}



function edit_artist() {
	var self = this;
	
	DB(function(err, client, done) {
		client.query('UPDATE artists SET first_name=$1, last_name=$2, dob=$3, email=$4 WHERE id=$5', [self.body.fname, self.body.lname, self.body.dob, self.body.email, self.body.id], 
			function(err, result) {
				if(err != null) {
					self.throw500(err);
					return;
				}
				else {
					self.json({'updated':self.body.id});
				}
		})
	})
}


function delete_artist() {
	var self = this;


	DB(function(err, client, done) {
		client.query('DELETE from artists WHERE id=$1', [self.req.path[2]], 
			function(err, result) {
				if(err != null) {
					self.throw500(err);
					return;
				}
				else {
					self.json({'deleted':self.req.path[2]});
				}
		})
	})
}

function view_all_art() {
	var self = this;
	
	F.database(function(err, client, done) {
		client.query('SELECT artists.id AS artist_id, artists.first_name, artists.last_name, artists.dob, artists.email, art.id AS art_id, art.name, art.description, art.price FROM artists JOIN art ON artists.id=art.artist_id  ORDER BY art.id', function(err, result) {
			done();

			if(err != null) {
				self.throw500(err);
				return;
			}
			else {
				if(self.req.query.flash == 'edits_saved') {
					self.repository.flash = self.req.query.flash;
				}
				
				var ids = [];

				var artists = [{id: '0', name: 'All Artists'}]
				

				result.rows.forEach(function(el) {		
					var name = el.first_name + ' ' + el.last_name,
						obj = {id: el.artist_id, name: name};
			
					if(ids.indexOf(el.artist_id) < 0 ) {
						artists.push(obj)
						ids.push(el.artist_id);
					}
				});


				self.repository.artists = artists;
				self.view('arts', result.rows);
			}
		});
	});

}

function view_artist_art() {
	var self = this;


	F.database(function(err, client, done) {
		client.query('SELECT artists.id AS artist_id, artists.first_name, artists.last_name, artists.dob, artists.email, art.id AS art_id, art.name, art.description, art.price FROM artists LEFT JOIN art ON artists.id=art.artist_id WHERE artists.id='+self.req.path[2]+' ORDER BY art.id', function(err, result) {
			done();

			if(err != null) {
				self.throw500(err);
				return;
			}
			else {
				if(self.req.query.flash) {
					self.repository.flash = self.req.query.flash;
				}

				if (self.req.query.price) self.req.query.price = +self.req.query.price.substring(1, self.req.query.price.length);

				self.repository.art = self.req.query;
				self.view('art', result.rows);
			}
		});
	});
}
	
function create_art() {
	var self = this;
	
	DB(function(err, client, done) {
		client.query('INSERT INTO art (artist_id, name, description, price) VALUES ($1, $2, $3, $4)', [+self.body.artist_id, self.body.name, self.body.desc, +self.body.price], 
			function(err, result) {
				if(err != null) {
					self.throw500(err);
					return;
				}
				else {
					self.redirect('/gallery/artists/'+self.body.artist_id+'/art?flash=added');
				}
		})
	})
}


function get_artist_art() {
	var self = this,
	query;

	if (self.req.path[2] == '0') {
		query = 'SELECT artists.id AS artist_id, artists.first_name, artists.last_name, artists.dob, artists.email, art.id AS art_id, art.name, art.description, art.price FROM artists JOIN art ON artists.id=art.artist_id ORDER BY art.id';
	}
	else {
		query = 'SELECT artists.id AS artist_id, artists.first_name, artists.last_name, artists.dob, artists.email, art.id AS art_id, art.name, art.description, art.price FROM artists JOIN art ON artists.id=art.artist_id WHERE artists.id='+self.req.path[2]+' ORDER BY art.id';
	}

	DB(function(err, client, done){
		client.query(query, function(err, result) {
			if(err != null) {
				self.throw500(err);
				return;
			}
			else {
				self.json(result.rows);
			}
		})
	})
}

function show_edit_art() {
	var self = this;

	DB(function(err, client, done){
		client.query('SELECT id, first_name, last_name, dob, email FROM artists WHERE id='+self.req.path[2],
		function(err, result) {
			if(err != null) {
				self.throw500(err);
				return;
			}
			else {
				self.json(result.rows[0]);
			}
		})
	})
}



function edit_art() {
	var self = this;
	
	DB(function(err, client, done) {
		client.query('UPDATE art SET artist_id=$1, name=$2, price=$3, description=$4 WHERE id=$5', [self.body.artist_id, self.body.name, self.body.price, self.body.desc, self.body.id], 
			function(err, result) {
				if(err != null) {
					self.throw500(err);
					return;
				}
				else {
					self.json({'updated':self.body.id});
				}
		})
	})
}


function delete_art() {
	var self = this;

	DB(function(err, client, done) {
		client.query('DELETE from art WHERE id=$1', [self.req.path[4]], 
			function(err, result) {
				if(err != null) {
					self.throw500(err);
					return;
				}
				else {
					self.json({'deleted':self.req.path[4]});
				}
		})
	})
}