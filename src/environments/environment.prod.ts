import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  baseUrl: 'https://app.launchdarkly.com/api/v2/flags',
  projectKey: 'property-ware',
  authorizationHeader: 'api-2b78bb16-9d30-4dd7-8a54-29fbc1f61daf',
  authorizationSemanticHeader: 'api-2b78bb16-9d30-4dd7-8a54-29fbc1f61daf',
};
