const express = require('express')
const morgan = require('morgan')
const { createLogger, format, transports } = require('winston');

const { v4: uuidv4 } = require('uuid')

const app = express()
const logger = createLogger({
  exitOnError: false,
  level: 'info',
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  defaultMeta: { service: 'run-controller' },
  transports: [
    new transports.Console(),
  ],
});

const myStream = {
  write: (text) => {
    logger.info(text)
  }
}

app.use(morgan('combined', { stream: myStream }));

app.use(express.json());

app.post("/", (req, res) => {
  const requestId = uuidv4()
  logger.debug("Received request %s to /", requestId)

  const content = req.body
  logger.debug("Request %s positively validated", requestId)

  const workoutId = content.workout_id;
  logger.debug("Processing workout %s in request %s", workoutId, requestId)

  const score = 73;

  res.json({
    workout_id: workoutId,
    score
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: "ok"
  })
})

function main() {
  const port = process.env.PORT || 8000

  if (process.env.DEBUG)
    logger.level = "debug"

  app.listen(port, '0.0.0.0', () => {
    console.log(`App listening at http://0.0.0.0:${port}`)
  })
}

main();
