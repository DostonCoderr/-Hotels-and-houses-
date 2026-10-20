// ============================================================
// PAGINATION HELPER
// ============================================================
function parsePagination(query, defaults = {}) {
  const {
    defaultPage = 1,
    defaultLimit = 20,
    maxLimit = 100,
  } = defaults;

  let page = parseInt(query.page) || defaultPage;
  let limit = parseInt(query.limit) || defaultLimit;

  if (page < 1) page = 1;
  if (limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip, take: limit };
}

// ============================================================
// BUILD PAGINATION RESPONSE
// ============================================================
function paginateResponse(items, total, page, limit) {
  return {
    items,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

// ============================================================
// SORT PARSER
// ============================================================
function parseSort(sortString, allowedFields, defaultSort = 'createdAt_desc') {
  if (!sortString) {
    return parseSortString(defaultSort);
  }

  const result = parseSortString(sortString);
  const fieldName = Object.keys(result)[0];

  if (!allowedFields.includes(fieldName)) {
    return parseSortString(defaultSort);
  }

  return result;
}

function parseSortString(str) {
  const [field, dir = 'desc'] = str.split('_');
  return { [field]: dir === 'asc' ? 'asc' : 'desc' };
}

module.exports = { parsePagination, paginateResponse, parseSort };