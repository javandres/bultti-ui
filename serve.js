const express = require('express')
const path = require('path')
const pick = require('lodash/pick')
const mustache = require('mustache')
const fs = require('fs')

const app = express()
app.use(express.static(path.join(__dirname, 'build'), { index: false }))

app.get('/check', function (req, res) {
  res.send('ok')
})

app.get('/*', function (req, res) {
  let htmlPath = path.join(__dirname, 'build', 'index.html')
  let html = fs.readFileSync(htmlPath, 'utf8')

  let envKeys = Object.keys(process.env).filter((key) => key.startsWith('REACT_APP'))
  let env = pick(process.env, envKeys)

  let scriptEnv = `
<script>
    window._ENV = ${JSON.stringify(env)};
</script>
  `

  let responsePage = mustache.render(html, {
    SCRIPT_ENV: scriptEnv,
  })

  res.writeHead(200, '{Content-Type:text/html}')
  res.end(responsePage)
})

app.listen(process.env.PORT || 3001, () =>
  console.log(`Server ready on port ${process.env.PORT}`)
)
