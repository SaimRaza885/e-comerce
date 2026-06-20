function validateCreateProduct(body) {
  const errors = [];

  if (!body.title || typeof body.title !== "string" || body.title.trim().length < 3)
    errors.push("Title must be at least 3 characters");
  if (!body.urdu_name || typeof body.urdu_name !== "string" || body.urdu_name.trim().length < 1)
    errors.push("Urdu name is required");
  if (!body.description || typeof body.description !== "string" || body.description.trim().length < 3)
    errors.push("Description must be at least 3 characters");

  const price = Number(body.price);
  if (isNaN(price) || price <= 0)
    errors.push("Price must be a positive number");

  const stock = Number(body.stock);
  if (isNaN(stock) || !Number.isInteger(stock) || stock < 0)
    errors.push("Stock must be a non-negative integer");

  if (errors.length) throw errors;

  return {
    body: {
      title: body.title.trim(),
      urdu_name: body.urdu_name.trim(),
      description: body.description.trim(),
      price,
      inStock: body.inStock === "true" || body.inStock === true,
      stock,
    },
  };
}

function validateUpdateProduct(body) {
  const errors = [];
  const result = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length < 3)
      errors.push("Title must be at least 3 characters");
    else result.title = body.title.trim();
  }
  if (body.urdu_name !== undefined) {
    if (typeof body.urdu_name !== "string" || body.urdu_name.trim().length < 1)
      errors.push("Urdu name must not be empty");
    else result.urdu_name = body.urdu_name.trim();
  }
  if (body.description !== undefined) {
    if (typeof body.description !== "string" || body.description.trim().length < 3)
      errors.push("Description must be at least 3 characters");
    else result.description = body.description.trim();
  }
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (isNaN(price) || price <= 0)
      errors.push("Price must be a positive number");
    else result.price = price;
  }
  if (body.inStock !== undefined) {
    result.inStock = body.inStock === "true" || body.inStock === true;
  }
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (isNaN(stock) || !Number.isInteger(stock) || stock < 0)
      errors.push("Stock must be a non-negative integer");
    else result.stock = stock;
  }

  if (errors.length) throw errors;
  return { body: result };
}

function validateGetProductsQuery(query) {
  const errors = [];

  if (query.page !== undefined) {
    const n = Number(query.page);
    if (isNaN(n) || n < 1) errors.push("Page must be a positive integer");
  }
  if (query.limit !== undefined) {
    const n = Number(query.limit);
    if (isNaN(n) || n < 1 || n > 100) errors.push("Limit must be between 1 and 100");
  }
  if (query.minPrice !== undefined) {
    const n = Number(query.minPrice);
    if (isNaN(n) || n < 0) errors.push("Min price must be non-negative");
  }
  if (query.maxPrice !== undefined) {
    const n = Number(query.maxPrice);
    if (isNaN(n) || n < 0) errors.push("Max price must be non-negative");
  }

  if (errors.length) throw errors;
  return {};
}

export { validateCreateProduct, validateUpdateProduct, validateGetProductsQuery };
