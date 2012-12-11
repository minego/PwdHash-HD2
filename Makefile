APP			:= pwdhash
VENDOR		:= net.minego
APPID		:= $(VENDOR).$(APP)
PKG			:= PwdHashHD
VERSION		:= 2.2.$(shell git log --pretty=format:'' | wc -l | sed 's/ *//')
DEPLOY		:= deploy/pwdhash2

# TODO	Make the "${DEPLOY}" task work by copying debug.html and the various
#		directories without running minify. Another target called "release" can
#		actually run minify, so "make clean all" will build debug and running
#		"make clean release all" will build a release.

clean:
	rm -rf *.ipk deploy build 2>/dev/null || true

${DEPLOY}:
	mkdir build
	./tools/deploy.sh

${DEPLOY}/appinfo.json: ${DEPLOY}
	cat appinfo.json | sed -e s/autoversion/$(VERSION)/ > ${DEPLOY}/appinfo.json

deploy/${APPID}_${VERSION}_all.ipk: ${DEPLOY}/appinfo.json
	palm-package ${DEPLOY}

all: ${DEPLOY}

webos: deploy/${APPID}_${VERSION}_all.ipk

install: webos
	@palm-install *.ipk

launch: install
	@palm-launch -i ${APPID}

log:
	-palm-log -f ${APPID} | sed -u										\
		-e 's/\[[0-9]*-[0-9]*:[0-9]*:[0-9]*\.[0-9]*\] [a-zA-Z]*: //'	\
		-e 's/indicated new content, but not active./\n\n\n/'

test: launch log
	@true

.PHONY: clean webos install launch log test

