// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080;

// Grab the blacklist from the command-line so that we can update the blacklist without deploying
// again. CORS Anywhere is open by design, and this blacklist is not used, except for countering
// immediate abuse (e.g. denial of service). If you want to block all origins except for some,
// use originWhitelist instead.
const originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
const originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
function parseEnvList(env) {
    if (!env) {
        return [];
    }
    return env.split(',');
}


const cors_proxy = require('./lib/cors-anywhere');
const httpServer = cors_proxy.createServer({
    originBlacklist: originBlacklist,
    originWhitelist: originWhitelist,
    requireHeader: [],
    removeHeaders: [
        'cookie',
        'cookie2',
    ],
    redirectSameOrigin: true,
    httpProxyOptions: {
        // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
        xfwd: false,
    },
}).listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

process.on('SIGINT', function onSigint() {
    // do all the cleanup, close connections, etc
    httpServer.close();
});

process.on('SIGTERM', function onSigterm() {
    // do all the cleanup, close connections, etc
    httpServer.close();
});
