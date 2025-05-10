var http = require('http');
var url = require('url');
const { parse } = require('querystring');
var fs = require('fs');

// Load config
const config = require('./config/config.json');
const defaultConfig = config.development;
global.gConfig = {
	config_id: defaultConfig.config_id,
	app_name: defaultConfig.app_name,
	webservice_host: process.env.BACKEND_HOST || defaultConfig.webservice_host,
	webservice_port: process.env.BACKEND_PORT || defaultConfig.webservice_port,
	exposedPort: defaultConfig.exposedPort
};

// HTML parts
var header = '<!doctype html><html><head>';
var body = '</head><body><div id="container">' +
	'<div id="logo">' + global.gConfig.app_name + '</div>' +
	'<div id="space"></div>' +
	'<div id="form">' +
	'<form id="form" method="post"><center>' +
	'<label class="control-label">Name:</label>' +
	'<input class="input" type="text" name="name" required/><br />' +
	'<label class="control-label">Ingredients:</label>' +
	'<input class="input" type="text" name="ingredients" required/><br />' +
	'<label class="control-label">Prep Time:</label>' +
	'<input class="input" type="number" name="prepTimeInMinutes" required/><br />';

var submitButton = '<button class="button button1">Submit</button>' +
	'</center></form></div>';

// JS to override form submit
var clientScript = `
<script>
document.getElementById('form').addEventListener('submit', function(event) {
	event.preventDefault();
	const name = document.querySelector('input[name="name"]').value;
	const ingredients = document.querySelector('input[name="ingredients"]').value;
	const prepTime = document.querySelector('input[name="prepTimeInMinutes"]').value;

	fetch('/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			name,
			ingredients,
			prepTimeInMinutes: prepTime
		})
	})
	.then(() => {
		window.location.reload(); // Refresh the page to show new data
	})
	.catch(err => {
		console.error('Error:', err);
		alert('Failed to save recipe');
	});
});
</script>
`;

var endBody = '</div></body></html>';

http.createServer(function (req, res) {
	console.log(req.url);

	if (req.url === '/favicon.ico') {
		res.writeHead(200, { 'Content-Type': 'image/x-icon' });
		res.end();
		console.log('favicon requested');
		return;
	}

	res.writeHead(200, { 'Content-Type': 'text/html' });

	var fileContents = fs.readFileSync('./public/default.css', { encoding: 'utf8' });
	res.write(header);
	res.write('<style>' + fileContents + '</style>');
	res.write(body);
	res.write(submitButton);
	res.write(clientScript); // JS added here

	const http = require('http');

	// Handle POST
	if (req.method === 'POST') {
		let body = '';
		req.on('data', chunk => {
			body += chunk.toString();
		});
		req.on('end', () => {
			try {
				var post = parse(body);
				var recipe = {
					name: post["name"],
					ingredients: post["ingredients"].split(',').map(item => item.trim()),
					prepTimeInMinutes: parseInt(post["prepTimeInMinutes"])
				};

				console.log("Sending recipe to backend:", JSON.stringify(recipe, null, 2));

				const options = {
					hostname: global.gConfig.webservice_host,
					port: global.gConfig.webservice_port,
					path: '/recipe',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					}
				};

				const req2 = http.request(options, (resp) => {
					let data = '';
					resp.on('data', (chunk) => { data += chunk; });
					resp.on('end', () => {
						console.log("Backend response:", data);
					});
				});

				req2.on('error', (error) => {
					console.error('Error sending recipe to backend:', error);
				});

				req2.write(JSON.stringify(recipe));
				req2.end();
			} catch (error) {
				console.error('Error processing recipe:', error);
			}
		});
	}

	// Always get and display recipes (after potential POST)
	const options = {
		hostname: global.gConfig.webservice_host,
		port: global.gConfig.webservice_port,
		path: '/recipes',
		method: 'GET'
	};

	const req3 = http.request(options, (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			try {
				res.write('<div id="space"></div>');
				res.write('<div id="logo">Your Previous Recipes</div>');
				res.write('<div id="space"></div>');
				res.write('<div id="results">Name | Ingredients | PrepTime<br/><br/>');

				const recipes = JSON.parse(data);
				if (recipes && recipes.length > 0) {
					for (let recipe of recipes) {
						res.write(recipe.name + ' | ' + recipe.ingredients.join(', ') + ' | ' + recipe.prepTimeInMinutes + '<br/>');
					}
				} else {
					res.write('No recipes found.<br/>');
				}

				res.write('</div><div id="space"></div>');
			} catch (error) {
				console.error('Error displaying recipes:', error);
				res.write('<div id="space"></div>');
				res.write('<div id="logo" style="color: red;">Error loading recipes. Please try again.</div>');
				res.write('<div id="space"></div>');
			}
			res.end(endBody);
		});
	});

	req3.on('error', (error) => {
		console.error('Error fetching recipes:', error);
		res.write('<div id="space"></div>');
		res.write('<div id="logo" style="color: red;">Error connecting to backend. Please try again.</div>');
		res.write('<div id="space"></div>');
		res.end(endBody);
	});

	req3.end();

}).listen(global.gConfig.exposedPort);

console.log(`Frontend server running on port ${global.gConfig.exposedPort}`);
