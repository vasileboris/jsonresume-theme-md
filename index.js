const fs = require("fs"),
	path = require('path'),
	Handlebars = require("handlebars");

function render(resume) {
	const tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8"),
		partialsDir = path.join(__dirname, 'partials'),
		filenames = fs.readdirSync(partialsDir);

	Handlebars.registerHelper('and', and);
	Handlebars.registerHelper('or', or);
	Handlebars.registerHelper('buildInstitution', buildInstitution);
	Handlebars.registerHelper('buildPosition', buildPosition);
    Handlebars.registerHelper('buildAchievement', buildAchievement);
    Handlebars.registerHelper('concatArray', concatArray);
	Handlebars.registerHelper('concatFields', concatFields);

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

const and = (...params) => {
	const length = params.length - 1;
	return length > 0 ? params.slice(0, length).reduce((acc, p) => acc && p) : false;
};

const or = (...params) => {
	const length = params.length - 1;
	return length > 0 ? params.slice(0, length).reduce((acc, p) => acc || p) : false;
};

const concatFields = (object, ...fields) => {
    const values = fields.slice(0, fields.length - 1).map(field => object[field]);
    return concatArray(values);
};

const concatArray = values => values.filter(value => value !== null && value !== undefined).join(", ");

const buildInstitution = (context, institutionField, websiteField) => {
	const institution = context[institutionField],
		website = context[websiteField];
	return website ? `[${institution}](${website})` : institution;
};

const buildPosition = (context, positionField, startDateField, endDateField) => {
	const position = context[positionField],
		startDate = context[startDateField],
		endDate = context[endDateField];
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

const buildAchievement = (context, achievementField, dateField) => {
	const achievement = context[achievementField],
		date = context[dateField];
    let result = '';
    if(achievement) {
        result += `**${achievement}**`;
    }
    if(date) {
        result += result ? ' ' : '';
        result += formatPeriod(date, date);
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