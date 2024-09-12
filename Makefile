NAME=fitbreaks
DOMAIN=jluquer.com

.PHONY: all pack install clean

all: dist/extension.js

node_modules: package.json
	npm install

dist/extension.js dist/prefs.js: node_modules
	tsc

# schemas/gschemas.compiled: src/schemas/org.gnome.shell.extensions.$(NAME).gschema.xml
# 	glib-compile-schemas schemas

$(NAME).zip: dist/extension.js dist/prefs.js #schemas/gschemas.compiled
	# @cp -r src/schemas dist/
	@cp metadata.json dist/
	@cp -r src/icons/ dist/
	@(cd dist && zip ../$(NAME).zip -9r .)

pack: $(NAME).zip

install: $(NAME).zip
	@touch ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)
	@rm -rf ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)
	@mv dist ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)

run:
	dbus-run-session -- gnome-shell --nested --wayland

dev: install run

clean:
	@rm -rf dist node_modules $(NAME).zip
