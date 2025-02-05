SHELL = '/bin/bash'
PROJECT_NAME = hmpps-assess-risks-and-needs
LOCAL_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.local.yml
DEV_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.local.yml -f docker/docker-compose.dev.yml
TEST_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.test.yml
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
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps oasys-ui npm run lint-fix

test-up: ## Stands up a test environment.
	docker compose ${TEST_COMPOSE_FILES} pull --policy missing
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test up --wait

test-down: ## Stops and removes all of the test containers.
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test down

BASE_URL ?= "http://localhost:7072"
e2e: ## Run the end-to-end tests locally in the Cypress app. Override the default base URL with BASE_URL=...
	npm i
	npx cypress install
	npx cypress open -c baseUrl=$(BASE_URL)

BASE_URL_CI ?= "http://oasys-ui:3000"
e2e-ci: ## Run the end-to-end tests in a headless browser. Used in CI. Override the default base URL with BASE_URL_CI=...
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test run --rm cypress --headless -c baseUrl=${BASE_URL_CI}

save-logs: ## Saves docker container logs in a directory defined by OUTPUT_LOGS_DIR=
	mkdir -p ${OUTPUT_LOGS_DIR}
	docker logs ${PROJECT_NAME}-arns-handover-1 > ${OUTPUT_LOGS_DIR}/arns-handover.log
	docker logs ${PROJECT_NAME}-coordinator-api-1 > ${OUTPUT_LOGS_DIR}/coordinator-api.log
	docker logs ${PROJECT_NAME}-oasys-ui-1 > ${OUTPUT_LOGS_DIR}/oasys-ui.log
	docker logs ${PROJECT_NAME}-hmpps-auth-1 > ${OUTPUT_LOGS_DIR}/hmpps-auth.log
	docker logs ${PROJECT_NAME}-san-ui-1 > ${OUTPUT_LOGS_DIR}/san-ui.log
	docker logs ${PROJECT_NAME}-san-api-1 > ${OUTPUT_LOGS_DIR}/san-api.log

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	docker compose ${LOCAL_COMPOSE_FILES} down
	rm -rf dist node_modules test_results

update: ## Downloads the latest versions of container images.
	docker compose ${LOCAL_COMPOSE_FILES} pull
