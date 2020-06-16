exports.up = function(knex) {
    return knex.schema.createTable('accounts1', function(table){
      table.increments('id');
      table.text('Empresa').notNullable();
      table.text('Dominio').notNullable();
  
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('accounts1')
  };