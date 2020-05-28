require('dotenv').config()

const express = require('express')
const path = require('path')
const pick = require('lodash/pick')
const mapKeys = require('lodash/mapKeys')
const mustacheExpress = require('mustache-express')
const serialize = require('serialize-javascript')

const app = express()
app.use(express.static(path.join(__dirname, 'build')))

app.engine('html', mustacheExpress(path.join(__dirname, 'build'), 'html'))
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'build'))

app.get('/check', function (req, res) {
  return res.send('ok')
})

app.get('/*', function (req, res) {
  let envKeys = Object.keys(process.env).filter((key) => key.startsWith('REACT_APP'))
  let env = pick(process.env, envKeys)

  let scriptEnv = `
<script>
    window._ENV = ${JSON.stringify(env)}
</script>
  `

  res.render(path.join(__dirname, 'build', 'index.html'), {
    SCRIPT_ENV: scriptEnv,
  })
})

app.listen(process.env.PORT || 3001, () =>
  console.log(`Server ready on port ${process.env.PORT}`)
)
