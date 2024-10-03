SHELL = '/bin/bash'
PROJECT_NAME = hmpps-assess-risks-and-needs
DEV_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.dev.yml
LOCAL_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.local.yml
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Starts/restarts the UI in a production container.
	docker compose ${LOCAL_COMPOSE_FILES} down oasys-ui
	docker compose ${LOCAL_COMPOSE_FILES} up oasys-ui --wait --no-recreate

down: ## Stops and removes all containers in the project.
	docker compose ${LOCAL_COMPOSE_FILES} down
	make dev-down

build-ui: ## Builds a production image of the UI.
	docker compose ${LOCAL_COMPOSE_FILES} build oasys-ui

dev-up: ## Starts/restarts the UI in a development container. A remote debugger can be attached on port 9229.
	docker compose ${DEV_COMPOSE_FILES} down oasys-ui
	docker compose ${DEV_COMPOSE_FILES} up oasys-ui --wait --no-recreate

dev-build: ## Builds a development image of the UI and installs Node dependencies.
	docker compose ${DEV_COMPOSE_FILES} build oasys-ui

dev-down: ## Stops and removes all dev containers.
	docker compose ${DEV_COMPOSE_FILES} down

dev-update: update dev-build ## Pulls latest docker images, re-builds the Dev UI and copies node_modules to local filesystem.
	rm -rf node_modules
	docker compose ${DEV_COMPOSE_FILES} run --no-deps --name ui-node-modules oasys-ui node -v
	docker container cp ui-node-modules:/app/node_modules .
	docker container rm -f ui-node-modules

lint: ## Runs the linter.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps oasys-ui npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps oasys-ui npm run lint:fix

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	docker compose ${LOCAL_COMPOSE_FILES} down
	rm -rf dist node_modules test_results

update: ## Downloads the latest versions of container images.
	docker compose ${LOCAL_COMPOSE_FILES} pull
