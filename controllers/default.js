exports.install = function() {
	F.route('/', view_index);
	F.route('/hamlet', view_hamlet);
	F.route('/conv1', view_conv1);
	F.route('/conv2', view_conv2);
	F.route('/display/{file}', view_display);
	F.route('/test2', view_test2);
}

function view_display() {
	var self = this,
		p = self.req.path[1];

	self.view('display', {path: p});
}

function view_test2() {
	var self = this;
	self.view('test2');
}

function view_index() {
	var self = this;
	self.view('index');
}

function view_hamlet() {
	var self = this;


	self.view('hamlet');
}

function view_conv1() {
	var self = this;


	self.view('conv1');
}

function view_conv2() {
	var self = this;


	self.view('conv2');
}

