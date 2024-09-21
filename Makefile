NAME=fitbreaks
DOMAIN=jluquer.com

.PHONY: all pack install clean

all: dist/extension.js

node_modules: package.json
	npm install

# schemas/gschemas.compiled: src/schemas/org.gnome.shell.extensions.$(NAME).gschema.xml
# 	glib-compile-schemas schemas

build: #schemas/gschemas.compiled
	tsc
	# @cp -r src/schemas dist/
	@cp metadata.json dist/
	@cp -r src/icons/ dist/

zip: node_modules build
	@(cd dist && zip ../$(NAME).zip -9r .)

pack: zip

install_dev: build
	@rm -rf ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)
	@mv dist ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)

install: node_modules install_dev

run:
	dbus-run-session -- gnome-shell --nested --wayland

dev: install_dev run

clean:
	@rm -rf dist node_modules $(NAME).zip
