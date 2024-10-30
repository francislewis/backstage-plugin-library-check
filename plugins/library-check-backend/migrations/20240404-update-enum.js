/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  const isSqlite = knex.client.config.client === 'better-sqlite3';
  
  if (isSqlite) {
    // Check if column exists before adding it
    const hasColumn = await knex.schema.hasColumn('entity_libraries_updates', 'type_of_update');

    if (!hasColumn) {
      await knex.schema.table('entity_libraries_updates', table => {
        table.string('type_of_update').checkIn(['breaking', 'minor', 'patch', 'unknown', 'up-to-date']);
      });
    }
    
  } else {
    // If not sqlite, default to Postgres specific commands
    await knex.schema.raw(`
      ALTER TABLE "entity_libraries_updates"
      DROP CONSTRAINT IF EXISTS "entity_libraries_updates_type_of_update_check";
      
      ALTER TABLE "entity_libraries_updates"
      ADD CONSTRAINT "entity_libraries_updates_type_of_update_check" 
      CHECK ("type_of_update" = ANY (ARRAY['breaking'::text, 'minor'::text, 'patch'::text, 'unknown'::text, 'up-to-date'::text]));
    `);
  }
};

exports.down = async knex => {
  const isSqlite = knex.client.config.client === 'better-sqlite3';

  if (isSqlite) {
    const hasColumn = await knex.schema.hasColumn('entity_libraries_updates', 'type_of_update');

    if (hasColumn) {
      await knex.schema.table('entity_libraries_updates', table => {
        table.dropColumn('type_of_update');
      });
    }
  } else {
    // If not sqlite, default to Postgres specific commands
    await knex.schema.raw(`
      ALTER TABLE "entity_libraries_updates"
      DROP CONSTRAINT IF EXISTS "entity_libraries_updates_type_of_update_check";
    
      ALTER TABLE "entity_libraries_updates"
      ADD CONSTRAINT "entity_libraries_updates_type_of_update_check" 
      CHECK ("type_of_update" = ANY (ARRAY['breaking'::text, 'minor'::text, 'patch'::text, 'unknown'::text]));
    `);
  }
};
