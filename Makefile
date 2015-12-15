.PHONY : build icon	images deploy test dev

build:
	-cp -R dist ./dist.bak 
	@make deploy
	rm -rf dist
	mv build ./dist

deploy:
	npm run build

test:
	npm run test:live

dev:
	npm run dev

icon:
	cp app/favicon.ico build/favicon.ico

images:
	cp -R app/img build/img
 
