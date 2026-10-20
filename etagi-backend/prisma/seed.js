const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed boshlandi...\n');

  // ============================================================
  // 1. ROLLAR
  // ============================================================
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'super_admin' },
      update: {},
      create: {
        name: 'super_admin',
        description: 'Полный доступ ко всему',
        permissions: ['*'],
      },
    }),
    prisma.role.upsert({
      where: { name: 'content_manager' },
      update: {},
      create: {
        name: 'content_manager',
        description: 'Управление контентом',
        permissions: [
          'properties:read', 'properties:create', 'properties:update',
          'complexes:read', 'complexes:create', 'complexes:update',
          'promotions:read', 'promotions:create', 'promotions:update',
          'reviews:read', 'reviews:create', 'reviews:update',
          'images:upload',
        ],
      },
    }),
    prisma.role.upsert({
      where: { name: 'manager' },
      update: {},
      create: {
        name: 'manager',
        description: 'Работа с заявками',
        permissions: [
          'applications:read', 'applications:update',
          'properties:read', 'complexes:read',
        ],
      },
    }),
  ]);
  console.log('✅ Rollar:', roles.map(r => r.name).join(', '));

  // ============================================================
  // 2. SUPER ADMIN
  // ============================================================
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@etagi.ru' },
    update: {},
    create: {
      name: 'Главный администратор',
      email: 'admin@etagi.ru',
      password: adminPassword,
      roleId: roles[0].id,
    },
  });
  console.log('✅ Admin:', admin.email, '/ admin123');

  // ============================================================
  // 3. OBYEKT TURLARI
  // ============================================================
  const types = [
    { name: 'Квартира', slug: 'apartment' },
    { name: 'Студия', slug: 'studio' },
    { name: 'Дом', slug: 'house' },
    { name: 'Офис', slug: 'office' },
    { name: 'Магазин', slug: 'shop' },
    { name: 'Парковка', slug: 'parking' },
    { name: 'Гараж', slug: 'garage' },
    { name: 'Кладовая', slug: 'storage' },
  ];
  const createdTypes = [];
  for (const t of types) {
    const type = await prisma.propertyType.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
    createdTypes.push(type);
  }
  console.log('✅ Obyekt turlari:', createdTypes.length);

  // ============================================================
  // 4. SOZLAMALAR
  // ============================================================
  const settings = [
    { key: 'site_name', value: 'Этажи', group: 'general' },
    { key: 'site_description', value: 'Федеральная компания по недвижимости', group: 'general' },
    { key: 'logo', value: '/images/logo.svg', group: 'general' },
    { key: 'phone', value: '+7 800 555-35-35', group: 'contacts' },
    { key: 'email', value: 'info@etagi.ru', group: 'contacts' },
    { key: 'address', value: 'Москва, Пресненская наб., 12', group: 'contacts' },
    { key: 'telegram', value: 'https://t.me/etagi', group: 'contacts' },
    { key: 'instagram', value: 'https://instagram.com/etagi', group: 'contacts' },
    { key: 'whatsapp', value: 'https://wa.me/78005553535', group: 'contacts' },
    { key: 'objects_per_page', value: '12', group: 'display' },
    { key: 'main_categories', value: 'new,house,com', group: 'display' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Sozlamalar:', settings.length);

  // ============================================================
  // 5. SEO
  // ============================================================
  const seoPages = [
    {
      page: 'home',
      title: 'Этажи — недвижимость в Москве',
      description: 'Новостройки, дома, коммерческая недвижимость. Более 200 офисов в России.',
      keywords: 'недвижимость, новостройки, Москва, купить квартиру',
    },
    {
      page: 'novostroyki',
      title: 'Новостройки Москвы — Этажи',
      description: 'Каталог новостроек Москвы и Московской области.',
      keywords: 'новостройки, ЖК, квартиры от застройщика',
    },
    {
      page: 'stroitelstvo',
      title: 'Строительство домов — Этажи',
      description: 'Проекты домов под ключ от проверенных компаний.',
      keywords: 'строительство домов, проекты домов, барнхаусы',
    },
    {
      page: 'commercial',
      title: 'Коммерческая недвижимость — Этажи',
      description: 'Торговые помещения, офисы, склады.',
      keywords: 'коммерческая недвижимость, офис, склад',
    },
  ];
  for (const s of seoPages) {
    await prisma.seo.upsert({
      where: { page: s.page },
      update: {},
      create: s,
    });
  }
  console.log('✅ SEO:', seoPages.length);

  // ============================================================
  // 6. DEMO USER
  // ============================================================
  const userPassword = await bcrypt.hash('demo1234', 10);
  await prisma.user.upsert({
    where: { email: 'demo@etagi.ru' },
    update: {},
    create: {
      name: 'Демо Пользователь',
      email: 'demo@etagi.ru',
      password: userPassword,
      phone: '+7 999 123-45-67',
    },
  });
  console.log('✅ Demo user: demo@etagi.ru / demo1234');

  // ============================================================
  // 7. ЖК (RESIDENTIAL COMPLEXES)
  // ============================================================
  const complexes = [
    {
      name: 'ЖК Etagi Tower',
      slug: 'etagi-tower',
      description: 'Современный жилой комплекс бизнес-класса в центре Москвы. Три башни по 25 этажей.',
      address: 'Москва, Пресненская наб., 12',
      district: 'Пресненский',
      builder: 'Etagi Development',
      completionYear: 2025,
      status: 'building',
      buildings: 3,
      floors: 25,
      infrastructure: ['Школа', 'Детский сад', 'Фитнес-центр', 'Паркинг'],
      advantages: ['Центр города', 'Панорамный вид', 'Охрана 24/7'],
      minPrice: BigInt(8000000),
      maxPrice: BigInt(25000000),
      lat: 55.749792,
      lng: 37.539271,
      published: true,
    },
    {
      name: 'ЖК Tashkent City',
      slug: 'tashkent-city',
      description: 'Премиальный жилой комплекс в центре Ташкента.',
      address: 'Ташкент, Шайхантахурский район, ул. Ислама Каримова, 1',
      district: 'Шайхантахурский',
      builder: 'Tashkent City Development',
      completionYear: 2026,
      status: 'building',
      buildings: 5,
      floors: 30,
      infrastructure: ['Торговый центр', 'Рестораны', 'Спа', 'Паркинг'],
      advantages: ['Премиум класс', 'Центр', 'Инфраструктура'],
      minPrice: BigInt(60000),
      maxPrice: BigInt(200000),
      lat: 41.315996,
      lng: 69.234978,
      published: true,
    },
    {
      name: 'ЖК Chilonzor Grand',
      slug: 'chilonzor-grand',
      description: 'Семейный жилой комплекс с развитой инфраструктурой.',
      address: 'Ташкент, Чиланзарский район, ул. Бунёдкор, 12',
      district: 'Чиланзарский',
      builder: 'Grand Construction',
      completionYear: 2024,
      status: 'completed',
      buildings: 4,
      floors: 18,
      infrastructure: ['Детский сад', 'Школа', 'Спортзал', 'Паркинг'],
      advantages: ['Для семей', 'Зелёный двор', 'Тихий район'],
      minPrice: BigInt(40000),
      maxPrice: BigInt(120000),
      lat: 41.276418,
      lng: 69.203505,
      published: true,
    },
  ];

  const createdComplexes = [];
  for (const c of complexes) {
    const complex = await prisma.residentialComplex.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    createdComplexes.push(complex);
  }
  console.log('✅ Комплексы:', createdComplexes.length);

  // ============================================================
  // 8. PROPERTIES
  // ============================================================
  const apartmentType = createdTypes.find(t => t.slug === 'apartment');
  const officeType = createdTypes.find(t => t.slug === 'office');
  const houseType = createdTypes.find(t => t.slug === 'house');

  const properties = [
    {
      name: '3-комнатная квартира — Etagi Tower',
      slug: '3-komnatnaya-etagi-tower',
      typeId: apartmentType.id,
      complexId: createdComplexes[0].id,
      apartmentNo: '101',
      rooms: 3,
      area: 85.5,
      floor: 10,
      floorsTotal: 25,
      price: BigInt(15000000),
      priceM2: BigInt(175000),
      status: 'available',
      description: 'Просторная квартира с ремонтом, панорамным видом на город.',
      address: 'Москва, Пресненская наб., 12',
      lat: 55.749792,
      lng: 37.539271,
      features: ['Балкон', 'Лифт', 'Охрана'],
      advantages: ['Центр', 'Новый дом'],
      published: true,
    },
    {
      name: '2-комнатная квартира — Tashkent City',
      slug: '2-komnatnaya-tashkent-city',
      typeId: apartmentType.id,
      complexId: createdComplexes[1].id,
      apartmentNo: '205',
      rooms: 2,
      area: 65.0,
      floor: 8,
      floorsTotal: 30,
      price: BigInt(95000),
      priceM2: BigInt(1462),
      status: 'available',
      description: 'Премиальная квартира в центре Ташкента.',
      address: 'Ташкент, ул. Ислама Каримова, 1',
      lat: 41.315996,
      lng: 69.234978,
      features: ['Панорамные окна', 'Кондиционер', 'Smart Home'],
      advantages: ['Премиум', 'Центр'],
      published: true,
    },
    {
      name: '4-комнатная квартира — Chilonzor Grand',
      slug: '4-komnatnaya-chilonzor-grand',
      typeId: apartmentType.id,
      complexId: createdComplexes[2].id,
      apartmentNo: '301',
      rooms: 4,
      area: 120.0,
      floor: 15,
      floorsTotal: 18,
      price: BigInt(110000),
      priceM2: BigInt(917),
      status: 'available',
      description: 'Большая квартира для семьи.',
      address: 'Ташкент, ул. Бунёдкор, 12',
      lat: 41.276418,
      lng: 69.203505,
      features: ['2 балкона', 'Большая кухня', 'Гараж'],
      advantages: ['Рядом школа', 'Тихий район'],
      published: true,
    },
    {
      name: '1-комнатная квартира — Etagi Tower',
      slug: '1-komnatnaya-etagi-tower',
      typeId: apartmentType.id,
      complexId: createdComplexes[0].id,
      apartmentNo: '505',
      rooms: 1,
      area: 42.0,
      floor: 15,
      floorsTotal: 25,
      price: BigInt(8000000),
      priceM2: BigInt(190476),
      status: 'available',
      description: 'Уютная квартира для одного или пары.',
      address: 'Москва, Пресненская наб., 12',
      lat: 55.749792,
      lng: 37.539271,
      features: ['Балкон', 'Лифт'],
      advantages: ['Доступная цена', 'Центр'],
      published: true,
    },
    {
      name: 'Офис — Tashkent City Business Center',
      slug: 'ofis-tashkent-city-bc',
      typeId: officeType.id,
      complexId: createdComplexes[1].id,
      apartmentNo: 'BC-12',
      rooms: 3,
      area: 95.0,
      floor: 12,
      floorsTotal: 30,
      price: BigInt(180000),
      priceM2: BigInt(1895),
      status: 'available',
      description: 'Современный офис в бизнес-центре.',
      address: 'Ташкент, ул. Ислама Каримова, 1',
      lat: 41.315996,
      lng: 69.234978,
      features: ['Open space', 'Конференц-зал', 'Паркинг'],
      advantages: ['Бизнес-центр', 'Транспорт'],
      published: true,
    },
    {
      name: 'Дом 250 м² — Барвиха',
      slug: 'dom-250-barvikha',
      typeId: houseType.id,
      complexId: null,
      rooms: 6,
      area: 250.0,
      floor: 1,
      floorsTotal: 2,
      price: BigInt(45000000),
      priceM2: BigInt(180000),
      status: 'available',
      description: 'Элитный загородный дом с участком 15 соток.',
      address: 'Московская обл., Барвиха',
      lat: 55.740488,
      lng: 37.269454,
      features: ['Бассейн', 'Сауна', 'Гараж на 3 машины'],
      advantages: ['Элитный район', 'Свой участок'],
      published: true,
    },
  ];

  const createdProperties = [];
  for (const p of properties) {
    const prop = await prisma.property.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
    createdProperties.push(prop);
  }
  console.log('✅ ОБЪЕКТЫ:', createdProperties.length);

  // ============================================================
  // 9. СОТРУДНИКИ (EMPLOYEES)
  // ============================================================
  const employees = [
    {
      name: 'Сардор Рахимов',
      position: 'Генеральный директор',
      phone: '+7 999 111-11-11',
      email: 'sardor@etagi.ru',
      photo: null,
      description: 'Опыт работы в недвижимости более 15 лет.',
      hidden: false,
      order: 1,
    },
    {
      name: 'Нилуфар Каримова',
      position: 'Руководитель отдела продаж',
      phone: '+7 999 222-22-22',
      email: 'nilufar@etagi.ru',
      photo: null,
      description: 'Эксперт по новостройкам.',
      hidden: false,
      order: 2,
    },
    {
      name: 'Жасур Тошматов',
      position: 'Консультант',
      phone: '+7 999 333-33-33',
      email: 'jasur@etagi.ru',
      photo: null,
      description: 'Помогает с подбором квартир.',
      hidden: false,
      order: 3,
    },
  ];

  const createdEmployees = [];
  for (const e of employees) {
    const existing = await prisma.employee.findFirst({
      where: { email: e.email },
    });
    if (!existing) {
      const emp = await prisma.employee.create({ data: e });
      createdEmployees.push(emp);
    }
  }
  console.log('✅ Сотрудники:', createdEmployees.length);

  // ============================================================
  // 10. АКЦИИ (PROMOTIONS)
  // ============================================================
  const promotions = [
    {
      name: 'Новогодняя скидка',
      description: 'Скидка 10% на все квартиры до конца января.',
      image: null,
      discount: 10,
      startDate: new Date('2026-12-01'),
      endDate: new Date('2027-01-31'),
      status: 'active',
    },
    {
      name: 'Летняя акция',
      description: 'Скидка 15% на офисы.',
      image: null,
      discount: 15,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-08-31'),
      status: 'inactive',
    },
  ];

  const createdPromotions = [];
  for (const p of promotions) {
    const existing = await prisma.promotion.findFirst({
      where: { name: p.name },
    });
    if (!existing) {
      const promo = await prisma.promotion.create({ data: p });
      createdPromotions.push(promo);
    }
  }
  console.log('✅ Акции:', createdPromotions.length);

  // ============================================================
  // 11. ОТЗЫВЫ (REVIEWS)
  // ============================================================
  const reviews = [
    {
      name: 'Азиз Каримов',
      text: 'Отличный сервис! Быстро и качественно помогли с выбором квартиры.',
      rating: 5,
      published: true,
      photo: null,
    },
    {
      name: 'Дилноза Юсупова',
      text: 'Хорошо, но цены немного высокие.',
      rating: 4,
      published: true,
      photo: null,
    },
    {
      name: 'Бобур Алиев',
      text: 'Менеджеры очень вежливые, всё объяснили.',
      rating: 5,
      published: false,
      photo: null,
    },
  ];

  const createdReviews = [];
  for (const r of reviews) {
    const existing = await prisma.review.findFirst({
      where: { name: r.name, text: r.text },
    });
    if (!existing) {
      const rev = await prisma.review.create({ data: r });
      createdReviews.push(rev);
    }
  }
  console.log('✅ Отзывы:', createdReviews.length);

  // ============================================================
  // YAKUNIY NATIJA
  // ============================================================
  console.log('\n🎉 Seed muvaffaqiyatli tugadi!\n');
  console.log('📋 Kirish ma\'lumotlari:');
  console.log('   Admin: admin@etagi.ru / admin123');
  console.log('   User:  demo@etagi.ru / demo1234\n');
  console.log('📊 Statistika:');
  console.log(`   Комплексы:    ${createdComplexes.length}`);
  console.log(`   Объекты:      ${createdProperties.length}`);
  console.log(`   Сотрудники:   ${createdEmployees.length}`);
  console.log(`   Акции:        ${createdPromotions.length}`);
  console.log(`   Отзывы:       ${createdReviews.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed xatosi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });