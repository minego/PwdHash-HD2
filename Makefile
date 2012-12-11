APP			:= pwdhash
VENDOR		:= net.minego
APPID		:= $(VENDOR).$(APP)
PKG			:= PwdHashHD
VERSION		:= 2.2.$(shell git log --pretty=format:'' | wc -l | sed 's/ *//')
DEPLOY		:= deploy/pwdhash2

clean:
	rm -rf *.ipk deploy build 2>/dev/null || true

${DEPLOY}:
	./tools/deploy.sh

${DEPLOY}/appinfo.json: ${DEPLOY}
	cat appinfo.json | sed -e s/autoversion/$(VERSION)/ > ${DEPLOY}/appinfo.json

deploy/${APPID}_${VERSION}_all.ipk: ${DEPLOY}/appinfo.json
	palm-package ${DEPLOY}

all: ${DEPLOY}

webos: deploy/${APPID}_${VERSION}_all.ipk

.PHONY: clean webos

