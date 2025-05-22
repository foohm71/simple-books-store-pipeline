import { ApiCheck, AssertionBuilder } from 'checkly/constructs'

export const booksListCheck = new ApiCheck('books-list-check', {
  name: 'Books List Check',
  request: {
    method: 'GET',
    url: 'https://simple-books-api.glitch.me/books',
  },
  assertions: [
    AssertionBuilder.statusCode().equals(200),
    AssertionBuilder.jsonBody('$[0].id').equals(1),
    AssertionBuilder.jsonBody('$[0].name').equals('The Russian'),
    AssertionBuilder.jsonBody('$[0].type').equals('fiction'),
    AssertionBuilder.jsonBody('$[0].available').equals(true),
  ],
  frequency: 5,
  locations: ['eu-west-1'],
  activated: true,
  muted: false,
  runtimeId: '2022.10',
  tags: ['api', 'books', 'list'],
}) 