# hmpps-assess-risks-and-needs-oastub-ui
[![repo standards badge](https://img.shields.io/badge/endpoint.svg?&style=flat&logo=github&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-assess-risks-and-needs-oastub-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-assess-risks-and-needs-oastub-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-assess-risks-and-needs-oastub-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-assess-risks-and-needs-oastub-ui)

HMPPS Assess Risks and Needs (ARNS) OAStub is a small UI webservice that provides staff within the ARNS space to simulate the outcome of an OASys journey and begin the flow through the HMPPS ARNS Handover Service into one of the ARNS space applications (HMPPS Sentence Plan, HMPPS Strength Based Needs Assessment etc.)

# Instructions

## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

```bash
make up
```

The app is available on http://localhost:7072

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching

### Running the app for development

```bash
make dev-up
```

### Run linter

```bash
make lint
```

### Run tests

```bash
make test
```

### Running integration tests

Start the app with `make up` or `make dev-up`.

Start either SAN or SP so that OAStub has something to redirect to.

Then run the integration tests:

```bash
make e2e
```
