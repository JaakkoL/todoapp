require({

  catchError: true,

  baseUrl: './js',

  hbs : {
    templateExtension : 'hbars',
    disableI18n : true
  },

  paths: {
    jquery: 'lib/jquery-1.10.2.min',
    templates: '../templates',
    Handlebars: 'lib/handlebars',
    hbs: 'lib/hbs',
    underscore : 'lib/hbs/underscore',
    i18nprecompile : 'lib/hbs/i18nprecompile',
    json2 : 'lib/hbs/json2',
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
  }

})

require([
  'jquery',
  'bacon',
  'lodash',
  'controllers/left-panel',
  'controllers/middle-panel',
  'controllers/right-panel'
], function($, bacon, _, leftPanel, middlePanel, rightPanel) {

  leftPanel.init($('#left-panel'));
  middlePanel.init($('#middle-panel'));
  rightPanel.init($('#right-panel'));

})