const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const apiCanaryBlueprint = async function () {
    const baseUrl = '${api_base_url}';

    // Test endpoints to check
    const endpoints = [
        { path: '/api/health', method: 'GET', expectedStatus: 200 },
        { path: '/api/auth/me', method: 'GET', expectedStatus: [200, 401] }, // May be unauthorized
        { path: '/api/projects', method: 'GET', expectedStatus: [200, 401] },
        { path: '/api/tasks', method: 'GET', expectedStatus: [200, 401] }
    ];

    for (const endpoint of endpoints) {
        const requestOptions = {
            hostname: baseUrl.replace(/^https?:\/\//, ''),
            method: endpoint.method,
            path: endpoint.path,
            port: 443,
            protocol: 'https:',
            headers: {
                'User-Agent': 'CloudWatch-Synthetics',
                'Content-Type': 'application/json'
            }
        };

        log.info(`Testing endpoint: $${endpoint.method} $${endpoint.path}`);

        await synthetics.executeHttpStep(`check_$${endpoint.path.replace(/\//g, '_')}`, requestOptions, (res) => {
            return new Promise((resolve, reject) => {
                const expectedStatuses = Array.isArray(endpoint.expectedStatus)
                    ? endpoint.expectedStatus
                    : [endpoint.expectedStatus];

                if (!expectedStatuses.includes(res.statusCode)) {
                    reject(new Error(`Endpoint $${endpoint.path} failed with status $${res.statusCode}, expected $${expectedStatuses.join(' or ')}`));
                    return;
                }

                log.info(`Endpoint $${endpoint.path} responded with status $${res.statusCode}`);

                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    try {
                        // For JSON endpoints, try to parse response
                        if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
                            JSON.parse(body);
                            log.info(`Endpoint $${endpoint.path} returned valid JSON`);
                        }
                        resolve();
                    } catch (e) {
                        // Non-JSON response is OK for some endpoints
                        log.info(`Endpoint $${endpoint.path} returned non-JSON response`);
                        resolve();
                    }
                });
            });
        });
    }

    log.info('All API endpoint checks completed successfully');
};

exports.handler = async () => {
    return await synthetics.executeStep('apiEndpointsCheck', apiCanaryBlueprint);
};