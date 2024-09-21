NAME=fitbreaks
DOMAIN=jluquer.com

.PHONY: all pack install clean

all: dist/extension.js

node_modules: package.json
	npm install

src/schemas/gschemas.compiled: src/schemas/org.gnome.shell.extensions.$(NAME).gschema.xml
	glib-compile-schemas src/schemas

build: src/schemas/gschemas.compiled
	tsc
	@cp -r src/schemas dist/
	@cp metadata.json dist/
	@cp -r src/icons/ dist/

$(NAME).zip: node_modules build
	@(cd dist && zip ../$(NAME).zip -9r .)

pack: $(NAME).zip

install_dev: build
	@rm -rf ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)
	@mv dist ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)
	@rm src/schemas/gschemas.compiled

install: node_modules install_dev

run:
	dbus-run-session -- gnome-shell --nested --wayland

dev: install_dev run

clean:
	@rm -rf dist node_modules $(NAME).zip src/schemas/gschemas.compiled
