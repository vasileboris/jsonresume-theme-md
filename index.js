const fs = require("fs"),
	path = require('path'),
	Handlebars = require("handlebars");

function render(resume) {
	const tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8"),
		partialsDir = path.join(__dirname, 'partials'),
		filenames = fs.readdirSync(partialsDir);

	Handlebars.registerHelper('and', (...params) => params.length ? params.reduce((acc, p) => acc && p) : false);
	Handlebars.registerHelper('buildAddress', buildAddress);

	filenames.forEach(function (filename) {
	  const matches = /^([^.]+).hbs$/.exec(filename);
	  if (!matches) {
	    return;
	  }
	  const name = matches[1],
		  filepath = path.join(partialsDir, filename),
		  template = fs.readFileSync(filepath, 'utf8');

	  Handlebars.registerPartial(name, template);
	});

	return Handlebars.compile(tpl)({
		resume: resume
	});
}

const buildAddress = location => {
	const details = ['address', 'postalCode', 'city', 'region', 'countryCode'];
	return details.reduce((acc, detail) => location[detail] ? `${acc}${location[detail]} ` : acc, '')
};

module.exports = {
	render: render
};