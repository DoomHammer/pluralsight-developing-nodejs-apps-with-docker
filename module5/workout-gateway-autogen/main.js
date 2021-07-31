const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const { createLogger, format, transports } = require('winston')
const morgan = require('morgan')

const WorkoutKind = new Set([
  "running",
  "jumping",
  "swimming"
])

class MissingArgumentError extends Error {
  constructor(message, argument) {
    super(message)
    this.name = "MissingArgumentError"
    this.argument = argument || ""
  }
}

class Workout {
  kind
  begin
  end
  other

  constructor(kind, begin, end, other) {
    this.kind = kind
    this.begin = begin
    this.end = end
    this.other = other
  }

  static fromObject(obj) {
    const kind = obj.kind
    if (typeof kind === 'undefined')
      throw new MissingArgumentError('Missing argument', "kind")
    if (!WorkoutKind.has(kind))
      throw new TypeError(`${kind} is not a WorkoutKind`)

    if (typeof obj.begin === 'undefined')
      throw new MissingArgumentError('Missing argument', "begin")
    const begin = parseInt(obj.begin)
    if (begin < 0 || begin > 2459)
      throw new TypeError(`Wrong value for begin!`)

    if (typeof obj.end === 'undefined')
      throw new MissingArgumentError('Missing argument', "end")
    const end = parseInt(obj.end)
    if (end < 0 || end > 2459)
      throw new TypeError(`Wrong value for end!`)

    const other = obj
    return new Workout(kind, begin, end, other)
  }
}

function timeMonotonic() {
  const NS_IN_SEC = 1e9;
  const monotonicTime = process.hrtime()
  return monotonicTime[0] + monotonicTime[1] / NS_IN_SEC
}

function doSomeWork(num) {
  /*
    Count num'th element of Fibonacci series
  */
  let a = 1,
    b = 0,
    temp;

  while (num >= 1) {
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
}

const app = express()

const logger = createLogger({
  exitOnError: false,
  level: 'info',
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  defaultMeta: { service: 'workout-gateway' },
  transports: [
    new transports.Console(),
  ],
});
const myStream = {
  write: (text) => {
    logger.info(text)
  }
}
app.use(morgan('combined', { stream: myStream }))

let RUN_CONTROLLER_URL = "please provide url via env vars"

app.use(express.json())

app.use(cors())

app.post("/", async (req, res) => {
  try {
    const mtIn = timeMonotonic()
    const requestId = uuidv4()

    log = {
      "monotonic_time": mtIn,
      "event_t": "request",
      "request_id": requestId,
      "path": "/",
      "errors": [],
    }


    const content = req.body
    let workout
    try {
      workout = Workout.fromObject(content)
    } catch (err) {
      if (err instanceof MissingArgumentError) {
        const errorMessage = `Missing required field ${err.argument}`

        log.validated = false
        log.errors.push(errorMessage)

        return res.status(400).end(errorMessage)

      } else if (err instanceof TypeError) {
        const errorMessage = err.message

        log.validated = false
        log.errors.push(errorMessage)

        return res.status(400).end(errorMessage)
      }
    }
    log.validated = true

    const work = doSomeWork(parseInt(content.intensity))
    log.p = work

    const workoutId = uuidv4()
    let response
    try {
      const payload = {
        ...content,
        workout_id: workoutId
      }
      log.endpoint = RUN_CONTROLLER_URL
      response = await axios.post(RUN_CONTROLLER_URL, payload, {
        headers: req.headers
      })
    } catch (err) {
      log.errors.push("downstream not avaible")
      return res.status(500).end("Something went wrong on our side :X")
    }

    downstreamStatus = response.status
    log.downstream_response_code = downstreamStatus

    if (downstreamStatus !== 200) {
      log.errors.push("Downstream errored")

      if (downstreamStatus === 500) {
        return res.status(500).end("Something went wrong on our side :X")
      }

      return res.status(downstreamStatus).end(response.data)
    }

    log.workout_id = workoutId
    const score = response.data.score

    const work2 = doSomeWork(score)
    log.p2_over_score = work2

    return res.json(response.data)
  } finally {
    logger.info(JSON.stringify(log))
  }
})

app.get('/health', (req, res) => {
  res.json({
    status: "ok"
  })
})

function main() {
  const port = process.env.PORT || 9000
  const debug = Boolean(process.env.DEBUG)
  RUN_CONTROLLER_URL = process.env.RUN_CONTROLLER_URL || 'http://localhost:8000'

  if (debug)
    logger.level = "debug"

  const log = {
    "event_t": "startup",
    "wall_time": Date.now(),
    "monotonic_time": timeMonotonic(),
    "config": {
      "port": port,
      "run_controller_url": RUN_CONTROLLER_URL,
      "debug": debug
    },
    "errors": [],
  }
  logger.info(JSON.stringify(log))

  app.listen(port, '0.0.0.0', () => {
    logger.info(`App listening at http://0.0.0.0:${port}`)
  })
}

main();