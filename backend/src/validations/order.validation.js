function validateCreateOrder(body) {
  const errors = [];

  if (!body.Name || typeof body.Name !== "string" || body.Name.trim().length < 2)
    errors.push("Name is required");
  if (!body.phone || typeof body.phone !== "string" || body.phone.trim().length < 10)
    errors.push("Phone number must be at least 10 digits");
  if (!body.country || typeof body.country !== "string" || body.country.trim().length < 2)
    errors.push("Country is required");
  if (!body.city || typeof body.city !== "string" || body.city.trim().length < 2)
    errors.push("City is required");
  if (!body.street || typeof body.street !== "string" || body.street.trim().length < 2)
    errors.push("Street is required");

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("At least one item is required");
  } else {
    const validItems = [];
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      if (!item.product || typeof item.product !== "string" || !/^[0-9a-fA-F]{24}$/.test(item.product)) {
        errors.push(`Item ${i + 1}: Invalid product ID`);
        continue;
      }
      const qty = Number(item.quantity) || 1;
      if (!Number.isInteger(qty) || qty < 1) {
        errors.push(`Item ${i + 1}: Quantity must be a positive integer`);
        continue;
      }
      validItems.push({ product: item.product, quantity: qty });
    }
    if (errors.length === 0) body.items = validItems;
  }

  if (errors.length) throw errors;

  return {
    body: {
      Name: body.Name.trim(),
      phone: body.phone.trim(),
      country: body.country.trim(),
      city: body.city.trim(),
      street: body.street.trim(),
      items: body.items,
    },
  };
}

export { validateCreateOrder };
