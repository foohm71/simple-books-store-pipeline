import { ApiCheck, AssertionBuilder } from 'checkly/constructs'

export const apiStatusCheck = new ApiCheck('api-status-check', {
  name: 'API Status Check',
  request: {
    method: 'GET',
    url: 'https://simple-books-api.glitch.me/status',
  },
  assertions: [
    AssertionBuilder.statusCode().equals(200),
    AssertionBuilder.jsonBody('status').equals('OK'),
  ],
  frequency: 5,
  locations: ['eu-west-1'],
  activated: true,
  muted: false,
  runtimeId: '2022.10',
  tags: ['api', 'status'],
}) 