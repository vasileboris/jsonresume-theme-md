const fs = require("fs"),
	path = require('path'),
	Handlebars = require("handlebars");

function render(resume) {
	const tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8"),
		partialsDir = path.join(__dirname, 'partials'),
		filenames = fs.readdirSync(partialsDir);

	Handlebars.registerHelper('and', (...params) => params.length ? params.reduce((acc, p) => acc && p) : false);
	Handlebars.registerHelper('or', (...params) => params.length ? params.reduce((acc, p) => acc || p) : false);
	Handlebars.registerHelper('buildAddress', buildAddress);
	Handlebars.registerHelper('buildInstitution', buildInstitution);
	Handlebars.registerHelper('buildPosition', buildPosition);

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

const buildInstitution = (institution, website) => {
	return website ? `[${institution}](${website})` : institution;
};

const buildPosition = (position, startDate, endDate) => {
	let result = '';
	if(position) {
		result += `**${position}**`;
	}
	if(startDate || endDate) {
        result += result ? ' ' : '';
        result += formatPeriod(startDate, endDate);
	}
	return result;
};

const formatPeriod = (startDate, endDate) => {
    const formattedStartDate = startDate ? formatDate(startDate) : 'N/A';
    const formattedEndDate = endDate ? formatDate(endDate) : 'Present';

    if(formattedStartDate === formattedEndDate) {
        return `(${formattedStartDate})`;
    }

    return `(${formattedStartDate} - ${formattedEndDate}})`;
};

const formatDate  = dateISO => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateISO);
    return months[date.getMonth()] +" " + date.getFullYear();
};

module.exports = {
	render: render
};