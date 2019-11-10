const CDP = require("chrome-remote-interface");

async function example() {
	let client;
	try {
		// connect to endpoint
		client = await CDP();
		// extract domains
		const {Runtime} = client;
		await Runtime.enable();
		Runtime.executionContextCreated(console.log);
		Runtime.bindingCalled(console.log);
		Runtime.addBinding("test");
	} catch (err) {
		console.error(err);
	} finally {
		if (client) {
			// await client.close();
		}
	}
}

example();
