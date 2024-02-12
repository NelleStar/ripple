const { BadRequestError } = require("../expressError");

/**
 * Helper for generating partial update SQL queries.
 *
 * This function constructs the SET clause and parameter values for SQL UPDATE statements
 * based on the provided data to update and a mapping of JavaScript-style field names
 * to corresponding database column names.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} with these properties {sqlSetCols, dataToUpdate}
 *   - setCols: String representing the SET clause of the SQL UPDATE statement.
 *   - values: Array containing the parameter values for the SQL query.
 *
 * @example
 *   // Usage example:
 *   const dataToUpdate = {firstName: 'John', age: 30};
 *   const jsToSql = {firstName: "first_name", age: "age"};
 *   const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
 *   // setCols will be '"first_name"=$1, "age"=$2'
 *   // values will be ['John', 30]
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
