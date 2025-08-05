# Dahenfeld

![Build Status](https://github.com/tdittmann/dahenfeld/actions/workflows/main.yml/badge.svg)
![Known Vulnerabilities](https://snyk.io/test/github/tdittmann/dahenfeld/badge.svg)
[![codecov](https://codecov.io/gh/tdittmann/dahenfeld/graph/badge.svg?token=CdPZyndcfi)](https://codecov.io/gh/tdittmann/dahenfeld)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=bugs)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)

Web application for Dahenfeld

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI
environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Environment file

You need to configure your own environment file which contains some mandatory data. It should be
placed in `src/environment/` folder.

```
export const environment = {
  backendUrl: "https://api.backend.de",
  backendAuthUser: "user",
  backendAuthPassword: "test",
};
```