define(['Handlebars'], function ( Handlebars ){
  function eq ( context, options ) {
    console.log((context === options))
    return (context === options);
  }

  Handlebars.registerHelper( 'eq', eq );

  return eq;
});