/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  const isSqlite = knex.client.config.client === 'better-sqlite3';

  if (isSqlite) {
    await knex.schema.table('entity_libraries_updates', async table => {
      // Need to check columns exist before trying to drop them in SQLite
      const hasLibraryIdColumn = await knex.schema.hasColumn('entity_libraries_updates', 'library_id');
      const hasLibraryNameColumn = await knex.schema.hasColumn('entity_libraries_updates', 'library_name');

      if (hasLibraryIdColumn) {
        table.dropUnique(['library_id', 'current_entity_version', 'library_path']);
        table.dropColumn('library_id');
      }

      if (!hasLibraryNameColumn) {
        table.string('library_name', 255); // Add 'library_name' column if it doesn't exist
      }

      table.unique(['library_name', 'current_entity_version', 'library_path']);
    });
  } else {
    // If not sqlite, default to Postgres specific commands
    await knex.schema.table('entity_libraries_updates', table => {
      table.dropUnique(['library_id', 'current_entity_version', 'library_path']);
      table.unique(['library_name', 'current_entity_version', 'library_path']);
      table.dropColumn('library_id');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  const isSqlite = knex.client.config.client === 'better-sqlite3';

  if (isSqlite) {
    await knex.schema.table('entity_libraries_updates', async table => {
      const hasLibraryIdColumn = await knex.schema.hasColumn('entity_libraries_updates', 'library_id');
      const hasLibraryNameColumn = await knex.schema.hasColumn('entity_libraries_updates', 'library_name');
      const hasTypeOfUpdateColumn = await knex.schema.hasColumn('entity_libraries_updates', 'type_of_update');
      const hasUpdateDateColumn = await knex.schema.hasColumn('entity_libraries_updates', 'update_date');
      const hasEntityIdColumn = await knex.schema.hasColumn('entity_libraries_updates', 'entity_id');
      const hasLibraryPathColumn = await knex.schema.hasColumn('entity_libraries_updates', 'library_path');
      const hasLanguageColumn = await knex.schema.hasColumn('entity_libraries_updates', 'language');
      const hasCurrentEntityVersionColumn = await knex.schema.hasColumn('entity_libraries_updates', 'current_entity_version');
      const hasRegistryVersionColumn = await knex.schema.hasColumn('entity_libraries_updates', 'registry_version');

      if (!hasLibraryIdColumn) {
        table.integer('library_id')
          .unsigned()
          .notNullable();
      }

      if (hasLibraryNameColumn) {
        table.dropColumn('library_name');
      }
      if (!hasTypeOfUpdateColumn) {
        table.string('type_of_update', 10); // SQLite doesn't support ENUM natively
      }
      if (!hasUpdateDateColumn) {
        table.string('update_date', 255);
      }
      if (!hasEntityIdColumn) {
        table.string('entity_id', 255);
      }
      if (!hasLibraryPathColumn) {
        table.string('library_path', 255);
      }
      if (!hasLanguageColumn) {
        table.string('language', 255);
      }
      if (!hasCurrentEntityVersionColumn) {
        table.string('current_entity_version', 255);
      }
      if (!hasRegistryVersionColumn) {
        table.string('registry_version', 255);
      }

      table.unique(['library_name', 'current_entity_version', 'library_path']);
    });
  } else {
    // If not sqlite, default to Postgres specific commands
    await knex.schema.table('entity_libraries_updates', table => {
      table.string('library_name', 255);
      table.enum('type_of_update', ['breaking', 'minor', 'patch', 'unknown']);
      table.string('update_date', 255);
      table.string('entity_id', 255);
      table.string('library_path', 255);
      table.string('language', 255);
      table.string('current_entity_version', 255);
      table.string('registry_version', 255);
      table.unique(['library_name', 'current_entity_version', 'library_path']);
    });
  }
};
