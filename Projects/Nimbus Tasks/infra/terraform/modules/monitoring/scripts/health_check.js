const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const apiCanaryBlueprint = async function () {
    const requestOptions = {
        hostname: '${health_check_url}',
        method: 'GET',
        path: '/health',
        port: 443,
        protocol: 'https:',
        headers: {
            'User-Agent': 'CloudWatch-Synthetics'
        }
    };

    const checkResult = await synthetics.executeHttpStep('checkHealthEndpoint', requestOptions, (res) => {
        return new Promise((resolve, reject) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Health check failed with status code: $${res.statusCode}`));
                return;
            }

            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const healthData = JSON.parse(body);

                    if (healthData.status === 'healthy') {
                        log.info('Health check passed');
                        resolve();
                    } else {
                        reject(new Error(`Health check failed: $${healthData.message || 'Unknown error'}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse health check response: $${e.message}`));
                }
            });
        });
    });

    return checkResult;
};

exports.handler = async () => {
    return await synthetics.executeStep('healthCheck', apiCanaryBlueprint);
};