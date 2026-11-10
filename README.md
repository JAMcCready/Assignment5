check node version
install node

node -v            # should be v24 or v26
npm init -y
npm pkg set type=module



npm install express csv-parse csv-stringify
npm install -D vitest @vitest/coverage-v8 supertest


npm init @eslint/config@latest

options for lint and what to add

npm install dayjs

how to make api in nodejs

what app and server does
what does route mean what each item does in route



logo file etc (static assests)
404 page


check monthly summary requirements

add to scripts

  "start": "node --env-file-if-exists=.env src/server.js",
  "dev": "node --watch --env-file-if-exists=.env src/server.js"