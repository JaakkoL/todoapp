define([
  'hbs!templates/left-panel',
  'controllers/add-list',
  'controllers/toolbar',
  'lodash'
], function (tplLeftPanel, addList, toolbar, _) {
  var element;

  function render(elem) {
    element = elem;
    element.html(tplLeftPanel());
    addList.init($('#add-list'));
    toolbar.init($('#toolbar'));

    bindEvents();
  }

  function bindEvents() {

    // Navigation
    $('#left-panel-nav a').on('click', function(e) {
      e.preventDefault();
      var link = $(this),
          target = link.data('target'),
          index = $('#' + target).index();

      link.siblings().removeClass('active');
      link.addClass('active');

      //$('#left-panel .content').css('margin-left', -index * 300 + 'px');
      $('#left-panel .content').animate({'margin-left' : -index * 300 + 'px'}, 400);
    });

  }


  return {
    init: render
  }
})
