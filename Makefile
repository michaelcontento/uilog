BIN = ./node_modules/.bin

#
# INSTALL
#

install: node_modules/

node_modules/: package.json
	echo "> Installing ..."
	npm --loglevel=error --ignore-scripts install > /dev/null
	touch node_modules/

#
# CLEAN
#

clean:
	echo "> Cleaning ..."
	rm -rf build/

mrproper: clean
	echo "> Cleaning deep ..."
	rm -rf node_modules/

#
# BUILD
#

build: clean install
	echo "> Building ..."
	$(BIN)/babel src/ --out-dir build/

build-watch: clean install
	echo "> Building forever ..."
	$(BIN)/babel src/ --out-dir build/ --watch

#
# TEST
#

lint: install
	echo "> Linting ..."
	$(BIN)/eslint src/

#
# PUBLISH
#

_publish : NODE_ENV ?= production
_publish: lint build

publish-fix: _publish
	$(BIN)/release-it --increment patch

publish-feature: _publish
	$(BIN)/release-it --increment minor

publish-breaking: _publish
	$(BIN)/release-it --increment major

#
# MAKEFILE
#

.PHONY: \
	install \
	clean mrproper \
	build build-watch \
	lint \
	publish-fix publish-feature publish-breaking

.SILENT:
