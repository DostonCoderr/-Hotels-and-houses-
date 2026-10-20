// ============================================================
// SLUGIFY — har xil matn uchun slug yaratish
// ============================================================
function slugify(text, options = {}) {
  const { separator = '-', addTimestamp = false, maxLength = 80 } = options;

  let slug = String(text)
    .toLowerCase()
    .trim()
    // Rus harflarini lotinga o'girish
    .replace(/[а-яё]/g, function (char) {
      const map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',
      };
      return map[char] || char;
    })
    // Maxsus belgilarni olib tashlash
    .replace(/[^a-z0-9\s-]/g, '')
    // Bo'shliqlarni separatorga almashtirish
    .replace(/\s+/g, separator)
    // Bir nechta separatorni bittaga
    .replace(new RegExp(separator + '+', 'g'), separator)
    // Bosh va oxirdagi separatorlarni olib tashlash
    .replace(new RegExp('^' + separator + '|' + separator + '$', 'g'), '')
    // Uzunlikni cheklash
    .substring(0, maxLength)
    .replace(new RegExp(separator + '$'), '');

  if (addTimestamp) {
    slug += separator + Date.now().toString(36);
  }

  return slug || 'item';
}

// ============================================================
// UNIQUE SLUG — bazada takrorlanmasligi uchun
// ============================================================
async function uniqueSlug(prisma, model, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const where = { slug };
    if (excludeId) where.id = { not: excludeId };

    const found = await prisma[model].findFirst({ where });
    if (!found) {
      exists = false;
    } else {
      slug = baseSlug + '-' + counter;
      counter++;
    }
  }

  return slug;
}

module.exports = { slugify, uniqueSlug };