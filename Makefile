install:
	npm install
build:
	npm run build
start:
	npm run babel-node -- src/bin/gendiff.js
publish:
	npm publish
lint:
	npm run eslint src .
test:
	npm test
testCoverage:
	npm run coverage
