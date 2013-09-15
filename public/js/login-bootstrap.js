require({

  catchError: true,

  baseUrl: './js',

  paths: {
    jquery: 'lib/jquery-1.10.2.min',
    templates: '../templates',
    Handlebars: 'lib/handlebars',
    hbars: 'lib/hbars',
    text: 'lib/text',
    bacon: 'lib/bacon',
    bjq: 'lib/bacon-bjq',
    lodash: 'lib/lodash',
    moment: 'lib/moment'
  },
  shim: {
    Handlebars: { exports: 'Handlebars' },
    bacon: { exports: 'Bacon' },
    bjq: { deps: ['jquery', 'bacon'] },
    jquery: { exports: '$' },
    lodash: { exports: '_' }
  },
  hbars: {
    extension: '.hbars'
  }
})

require([
  'jquery',
  'bacon',
  'lodash',
  'controllers/login',
  'controllers/register'
], function($, bacon, _, login, register) {

  login.init($('#login'));
  register.init($('#register'));
})