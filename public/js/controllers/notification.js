define([
  'hbars!templates/notification',
  'lodash'
], function (template, _) {
  var errorShown = false

  function show(notification) {
    var defaultSettings = {
        type : 'error',
        message : 'Something went wrong...',
        autoRemove : true,
        log : null
      }

    _.defaults(notification, defaultSettings)
    console.log(notification);
    var $elem = $(template({type: notification.type, message : notification.message})),
        timeout = 3000

    $('body').prepend($elem)

    $elem.find('.close').on('click', function(e) {
      e.preventDefault();
      hideRemove($elem, 300);
    });

    $elem.fadeIn(500, function() {
      if (notification.autoRemove) {
        setTimeout(function(e) {
          hideRemove($elem, 500)
        }, timeout)
      }
    })

  }

  function hideRemove($elem, timeout) {
    $elem.fadeOut(timeout, function() {
      $elem.remove()
    })
  }

  function logError(msg) {
    if (msg !== null) {
      console.log(msg);
    }
  }

  return notification = {
    show: show
  }
})
