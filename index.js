import fastify from 'fastify';
import { Unleash } from 'unleash-client';
import { setTimeout } from 'timers/promises';

const server = fastify({
  logger: 'trace'
})

server.get('/', (_, res) => res.send('hello world'))

function setupUnleash() {
  const unleashClient = new Unleash({
    url: 'https://origin-does-not-exist.com/api',
    refreshInterval: 300 * 1000,
    appName: 'FastifyUnleashClientFailure',
    customHeaders: {
      Authorization: 'blah blah',
    }
  })

  if (Boolean(process.env.UNLEASH_EVENTS_ERROR)) {
    unleashClient.on('error', error => server.log.error(error))
  }
}

try {
  await server.listen(3000)
  server.log.info('----')

  server.log.info('unleash:setup')
  await setTimeout(1000)
  setupUnleash()
} catch (error) {
  server.log.error(err)
  setImmediate(() => process.exit(1))
}

if (Boolean(process.env.PROCESS_UNCAUGHT_EXCEPTION)) {
  process.on('uncaughtException', error => console.error(error))
}