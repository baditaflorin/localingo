.PHONY: help install-hooks dev build data test test-integration smoke lint fmt pages-preview clean hooks-pre-commit hooks-commit-msg hooks-pre-push release

help:
	@printf "%s\n" \
		"make install-hooks     wire .githooks" \
		"make dev               run local Vite dev server" \
		"make build             build frontend into docs/ for GitHub Pages" \
		"make data              validate static bundled curriculum" \
		"make test              unit tests" \
		"make test-integration  integration tests" \
		"make smoke             build, serve docs, run Playwright smoke" \
		"make lint              eslint, prettier check, typecheck" \
		"make fmt               autoformat" \
		"make pages-preview     serve docs locally like Pages" \
		"make release           tag v$$(node -p \"require('./package.json').version\")" \
		"make clean             remove generated local caches"

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/*

dev:
	npm run dev

build:
	npm run build

data:
	npm run data

test:
	npm run test

test-integration:
	npm run test:integration

smoke:
	npm run smoke

lint:
	npm run lint
	npm run fmt:check
	npm run typecheck

fmt:
	npm run fmt

pages-preview:
	npm run pages-preview

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	@if [ -z "$$MSG" ]; then echo "Set MSG=.git/COMMIT_EDITMSG"; exit 1; fi
	.githooks/commit-msg "$$MSG"

hooks-pre-push:
	.githooks/pre-push

release:
	@VERSION=$$(node -p "require('./package.json').version"); \
	git tag "v$$VERSION"; \
	git push origin "v$$VERSION"

clean:
	rm -rf coverage playwright-report test-results .vite
