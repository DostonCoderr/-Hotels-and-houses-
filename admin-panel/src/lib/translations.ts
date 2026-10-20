import type { Language } from '@/store/language';

export interface Translations {
  // ============================================================
  // SIDEBAR
  // ============================================================
  dashboard: string;
  properties: string;
  complexes: string;
  users: string;
  applications: string;
  promotions: string;
  reviews: string;
  employees: string;
  admins: string;
  settings: string;
  seo: string;
  logs: string;

  // ============================================================
  // HEADER
  // ============================================================
  search: string;
  notifications: string;
  myAccount: string;
  profile: string;
  logout: string;
  adminPanel: string;

  // ============================================================
  // UMUMIY
  // ============================================================
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  loading: string;
  noData: string;
  confirm: string;
  saving: string;
  creating: string;
  updating: string;
  yes: string;
  no: string;
  all: string;

  // ============================================================
  // AUTH
  // ============================================================
  login: string;
  email: string;
  password: string;
  forgotPassword: string;
  loginButton: string;
  welcomeBack: string;
  loginSubtitle: string;

  // ============================================================
  // LOGIN SAHIFASI
  // ============================================================
  loginPageSubtitle: string;
  manageRealEstate: string;
  totalObjects: string;
  premium: string;
  modernResidential: string;
  help: string;
  contact: string;
  uzbekistan: string;

  // ============================================================
  // DASHBOARD
  // ============================================================
  dashboardWelcome: string;
  dashboardSubtitle: string;
  propertyList: string;
  projects: string;
  allProperties: string;
  searchProperties: string;
  noPropertySelected: string;
  selectProperty: string;
  editProperty: string;
  deleteProperty: string;
  viewProperty: string;
  deleteConfirm: string;
  rooms: string;
  totalViews: string;
  savedFavorites: string;
  inquiries: string;
  scheduledViewings: string;
  conversionFunnel: string;
  conversionFunnelSubtitle: string;
  views: string;
  clicks: string;

  // ============================================================
  // ADMINS
  // ============================================================
  adminsTitle: string;
  adminsSubtitle: string;
  newAdmin: string;
  editAdmin: string;
  adminInfo: string;
  adminCount: string;
  roleAndStatus: string;
  permissions: string;
  allPermissions: string;
  permissionsCount: string;
  role: string;
  roleRequired: string;
  selectRole: string;
  activeStatus: string;
  activeStatusDesc: string;
  adminActive: string;
  adminInactive: string;
  adminCreated: string;
  adminUpdated: string;
  adminDeleted: string;
  adminDeleteConfirm: string;
  nameRequired: string;
  emailRequired: string;
  passwordRequired: string;
  nameMin: string;
  emailInvalid: string;
  passwordMin: string;
  searchAdmin: string;
  filters: string;
  resetFilters: string;
  totalAdmins: string;
  superAdmin: string;
  contentManager: string;
  manager: string;

  // ============================================================
  // PROMOTIONS
  // ============================================================
  promotionsTitle: string;
  promotionsSubtitle: string;
  newPromotion: string;
  editPromotion: string;
  promotionName: string;
  promotionDescription: string;
  promotionDiscount: string;
  promotionStartDate: string;
  promotionEndDate: string;
  promotionStatus: string;
  promotionActive: string;
  promotionInactive: string;
  promotionHidden: string;
  promotionCreated: string;
  promotionUpdated: string;
  promotionDeleted: string;
  promotionDeleteConfirm: string;
  searchPromotion: string;
  totalPromotions: string;
  propertiesCount: string;
  page: string;
  previous: string;
  next: string;
  createdAt: string;
  actions: string;
  show: string;
  hide: string;

  // ============================================================
  // PROPERTIES
  // ============================================================
  propertiesTitle: string;
  totalProperties: string;
  newProperty: string;
  newPropertySubtitle: string;
  propertyCreated: string;
  propertyUpdated: string;
  propertyDeleted: string;
  propertyDuplicated: string;
  image: string;
  propertyName: string;
  type: string;
  address: string;
  price: string;
  status: string;
  available: string;
  booked: string;
  sold: string;
  typeApartment: string;
  typeStudio: string;
  typeHouse: string;
  typeOffice: string;
  typeShop: string;
  typeParking: string;
  typeGarage: string;
  typeStorage: string;
  propertyBasicInfo: string;
  complexOptional: string;
  selectComplex: string;
  noneOption: string;
  apartmentNumber: string;
  roomsAndFloor: string;
  area: string;
  floor: string;
  floorsTotal: string;
  priceAmount: string;
  pricePerM2: string;
  oldPrice: string;
  discount: string;
  statusAndAddress: string;
  description: string;
  images: string;
  features: string;
  featuresPlaceholder: string;
  advantages: string;
  advantagesPlaceholder: string;
  publishedLabel: string;
  publishedHint: string;
  duplicate: string;
  view: string;

  // ============================================================
  // STATUSLAR
  // ============================================================
  statusAvailable: string;
  statusBooked: string;
  statusSold: string;
  statusNew: string;
  statusInWork: string;
  statusDone: string;
  statusClosed: string;
  statusActive: string;
  statusInactive: string;
  statusHidden: string;

  // ============================================================
  // VAQT
  // ============================================================
  timeNow: string;
  timeMinutesAgo: string;
  timeHoursAgo: string;
  timeDaysAgo: string;

  // ============================================================
  // PROPERTY TURLARI
  // ============================================================
  propertyTypeApartment: string;
  propertyTypeStudio: string;
  propertyTypeHouse: string;
  propertyTypeOffice: string;
  propertyTypeShop: string;
  propertyTypeParking: string;
  propertyTypeGarage: string;
  propertyTypeStorage: string;

  // ============================================================
  // DASHBOARD KOMPONENTLARI
  // ============================================================
  recentApplications: string;
  viewAll: string;
  noApplications: string;

  // ============================================================
  // COMPLEXES
  // ============================================================
  complexesTitle: string;
  complexesSubtitle: string;
  newComplex: string;
  newComplexSubtitle: string;
  complexCreated: string;
  complexUpdated: string;
  complexDeleted: string;
  complexDeleteConfirm: string;
  searchComplex: string;
  complexName: string;
  district: string;
  builder: string;
  completionYear: string;
  statusBuilding: string;
  statusCompleted: string;
  statusPlanned: string;
  hideFromSite: string;
  showOnSite: string;
  published: string;
  hidden: string;

  // Complex form specific
  complexBasicInfo: string;
  complexConstruction: string;
  buildings: string;
  floors: string;
  minPrice: string;
  maxPrice: string;
  infrastructure: string;
  infrastructurePlaceholder: string;
  imageHint: string;
  imageRequired: string;

  // ============================================================
  // USERS (YANGI)
  // ============================================================
  usersTitle: string;
  totalUsers: string;
  searchUser: string;
  user: string;
  phone: string;
  favorites: string;
  registeredAt: string;
  unblock: string;
  block: string;
  userBlocked: string;
  userUnblocked: string;
  userDeleted: string;
  userDeleteConfirm: string;
  userToday: string;
  userId: string;
  noFavorites: string;
  noViews: string;
  errorOccurred: string;


  active: string;
  blocked: string;


  // ============================================================
  // APPLICATIONS (YANGI)
  // ============================================================
  applicationsTitle: string;
  applicationsSubtitle: string;
  searchApplication: string;
  applicationsLoadFailed: string;
  statusChanged: string;
  applicationDeleteConfirm: string;
  applicationDeleted: string;
  applicationsBulkDeleteConfirm: string;
  applicationsDeleted: string;
  csvDownloaded: string;
  exportError: string;
  exportCSV: string;
  exporting: string;
  clear: string;
  clearFilters: string;
  sorting: string;
  date: string;
  selected: string;
  selectAll: string;
  deselectAll: string;
  first: string;
  last: string;
  applicationsNotFound: string;
  noResultsByFilter: string;
  noApplicationsYet: string;
  client: string;
  source: string;
  message: string;
  timeline: string;
  applicationCreated: string;
  lastUpdated: string;
  currentStatus: string;
  close: string;
  copyId: string;
  changeStatus: string;
  anonymousClient: string;
  applicationDetails: string;
  viewDetails: string;
  total: string;
  today: string;
  application: string;
  property: string;

  // ============================================================
  // REVIEWS (YANGI)
  // ============================================================
  reviewsTitle: string;
  reviewsSubtitle: string;
  searchReview: string;
  reviewsLoadFailed: string;
  reviewPublished: string;
  reviewUnpublished: string;
  reviewDeleted: string;
  reviewDeleteConfirm: string;
  reviewsNotFound: string;
  reviewsTotal: string;
  reviewsAvgRating: string;

  pending: string;
  publish: string;

  review: string;
  rating: string;

  // Reyting yorliqlari
  ratingExcellent: string;
  ratingGood: string;
  ratingAverage: string;
  ratingBad: string;
  ratingVeryBad: string;



  // ============================================================
  // EMPLOYEES (YANGI)
  // ============================================================
  employeesTitle: string;
  employeesSubtitle: string;
  newEmployee: string;
  newEmployeeSubtitle: string;
  searchEmployee: string;
  employeesLoadFailed: string;
  employeeCreated: string;
  employeeUpdated: string;
  employeeDeleted: string;
  employeeDeleteConfirm: string;
  employeeNotFound: string;
  employeesNotFound: string;
  employeeHidden: string;
  employeeShown: string;
  position: string;
  positionPlaceholder: string;
  fullName: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  order: string;
  orderNumber: string;
  orderHint: string;
  orderAndStatus: string;
  basicInfo: string;
  photo: string;
  uploadPhoto: string;
  uploading: string;
  photoUploaded: string;
  photoUploadFailed: string;
  photoHint: string;
  saveEmployeeFirst: string;

  showOnSiteDesc: string;
  name: string;

  // ============================================================
  // SETTINGS (YANGI)
  // ============================================================
  settingsTitle: string;
  settingsSubtitle: string;
  admin: string;
  settingsLoadFailed: string;
  settingsSaved: string;
  settingsResetConfirm: string;
  settingsResetDone: string;
  settingsExported: string;
  searchSettings: string;
  changesCount: string;
  unsavedChanges: string;
  allChangesSaved: string;
  settingsCount: string;
  logoPreview: string;
  noResultsFound: string;
  export: string;

  // Guruhlar
  settingsGroupGeneral: string;
  settingsGroupGeneralDesc: string;
  settingsGroupContacts: string;
  settingsGroupContactsDesc: string;
  settingsGroupDisplay: string;
  settingsGroupDisplayDesc: string;
  settingsGroupSocial: string;
  settingsGroupSocialDesc: string;

  // Sozlamalar yorliqlari
  settingSiteName: string;
  settingSiteNamePlaceholder: string;
  settingSiteNameHint: string;
  settingSiteDescription: string;
  settingSiteDescriptionPlaceholder: string;
  settingSiteDescriptionHint: string;
  settingLogo: string;
  settingLogoPlaceholder: string;
  settingLogoHint: string;
  settingPhonePlaceholder: string;
  settingPhoneHint: string;
  settingEmailPlaceholder: string;
  settingEmailHint: string;
  settingAddress: string;
  settingAddressPlaceholder: string;
  settingAddressHint: string;
  settingWorkingHours: string;
  settingWorkingHoursPlaceholder: string;
  settingWorkingHoursHint: string;
  settingTelegram: string;
  settingTelegramPlaceholder: string;
  settingTelegramHint: string;
  settingInstagram: string;
  settingInstagramPlaceholder: string;
  settingInstagramHint: string;
  settingWhatsapp: string;
  settingWhatsappPlaceholder: string;
  settingWhatsappHint: string;
  settingYoutube: string;
  settingYoutubePlaceholder: string;
  settingYoutubeHint: string;
  settingFacebook: string;
  settingFacebookPlaceholder: string;
  settingFacebookHint: string;
  settingObjectsPerPage: string;
  settingObjectsPerPagePlaceholder: string;
  settingObjectsPerPageHint: string;
  settingMainCategories: string;
  settingMainCategoriesPlaceholder: string;
  settingMainCategoriesHint: string;
  settingCurrency: string;
  settingCurrencyPlaceholder: string;
  settingCurrencyHint: string;
  settingLanguage: string;
  settingLanguagePlaceholder: string;
  settingLanguageHint: string;


  // ============================================================
  // SEO (YANGI)
  // ============================================================
  seoTitle: string;
  seoSubtitle: string;
  seoLoadFailed: string;
  seoSaved: string;
  seoData: string;
  seoTitlePlaceholder: string;
  seoDescriptionPlaceholder: string;
  seoKeywordsPlaceholder: string;
  seoKeywordsHint: string;
  seoOpenGraph: string;
  seoOgTitlePlaceholder: string;
  seoOgDescriptionPlaceholder: string;
  seoGooglePreview: string;

  // SEO sahifalari
  seoPageHome: string;
  seoPageNovostroyki: string;
  seoPageStroitelstvo: string;
  seoPageCommercial: string;
  seoPageProject: string;

  // ============================================================
  // LOGS (YANGI)
  // ============================================================
  logsTitle: string;
  logsSubtitle: string;
  logsLoadFailed: string;
  logsNotFound: string;
  searchLog: string;
  refresh: string;
  clearing: string;
  clearLogsTitle: string;
  clearLogsDesc: string;
  days: string;
  action: string;
  entity: string;
  details: string;

  thisWeek: string;
  thisMonth: string;
  complex: string;
  promotion: string;
  employee: string;
  setting: string;

  // Amal yorliqlari
  logActionLogin: string;
  logActionLogout: string;
  logActionCreate: string;
  logActionUpdate: string;
  logActionDelete: string;
  logActionUpload: string;

  // Obyekt yorliqlari
  logEntityAdmin: string;


  // ============================================================
  // ADMINS DETAIL (YANGI)
  // ============================================================
  roleSuperAdminDesc: string;
  roleContentManagerDesc: string;
  roleManagerDesc: string;
  allPermissionsDesc: string;

  // ============================================================
  // DASHBOARD (YANGI)
  // ============================================================
  quickActions: string;
  performance: string;
  responseTime: string;
  conversion: string;
  recentLeads: string;
  recentActivity: string;
  allChannels: string;
  minutes: string;
  pieces: string;
  activityViewed: string;
  activityFavorited: string;
  activityInquiry: string;
  funnelNoteClicks: string;
  funnelNoteInquiries: string;
  funnelNoteScheduled: string;
  imageNotUploaded: string;
  addImageHint: string;
  copyLink: string;
  openInNewTab: string;
  previousImage: string;
  nextImage: string;
  previousProperty: string;
  nextProperty: string;

  language: string;
  newNotifications: string;
  noNotifications: string;
  markAllRead: string;
  clearAll: string;

  // ============================================================
  // PROFILE (YANGI)
  // ============================================================
  profileTitle: string;
  profileSubtitle: string;
  personalInfo: string;
  profileUpdated: string;
  avatarUploaded: string;
  fileTooLarge: string;
  security: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  changePassword: string;
  passwordChanged: string;
  passwordMismatch: string;
  currentPasswordWrong: string;
  passwordTips: string;
  passwordTip1: string;
  passwordTip2: string;
  passwordTip3: string;
  weak: string;
  medium: string;
  strong: string;
  veryStrong: string;
  theme: string;
  themeLight: string;
  themeLightDesc: string;
  themeDark: string;
  themeDarkDesc: string;
  themeSystem: string;
  themeSystemDesc: string;
  notificationSettings: string;
  emailNotifications: string;
  emailNotificationsDesc: string;
  pushNotifications: string;
  pushNotificationsDesc: string;
  messageNotifications: string;
  messageNotificationsDesc: string;
  recentActivityLog: string;
  avatarDeleteConfirm: string;
  avatarDeleted: string;
  noActivity: string;
  noDetails: string;
  notificationsSubtitle: string;
  propertyChartTitle: string;
  propertyChartBarTitle: string;
    // ============================================================
  // PROPERTY VIEW & INSIGHTS (YANGI)
  // ============================================================
  back: string;
  share: string;
  linkCopied: string;
  last30days: string;
  interestIndex: string;
  interestHigh: string;
  interestMedium: string;
  interestLow: string;
  interestHint: string;
  funnelTitle: string;
  chartSubtitle: string;
  dayShort: string;
  vsPrevPeriod: string;
  average: string;
  perDay: string;
  bestDay: string;
  period: string;

   // Obyekt yorliqlari (to'liq)

  logEntityProperty: string;
  logEntityComplex: string;
  logEntityUser: string;
  logEntityApplication: string;
  logEntityPromotion: string;
  logEntityReview: string;
  logEntityEmployee: string;
  logEntitySetting: string;
  logEntitySeo: string;

  // Loglar — UI (YANGI)
  live: string;
  analysis: string;
  clickToFilter: string;
  viewMode: string;
  viewTable: string;
  viewTimeline: string;
  rangeAll: string;
  range7d: string;
  range30d: string;
  byAction: string;
  byEntity: string;
  topAdmins: string;
  vsDailyAvg: string;
  vsWeeklyAvg: string;
  rowsExported: string;
  resetAll: string;
  retry: string;
  yesterday: string;
  copy: string;
  copied: string;
  thisAdmin: string;
  perPage: string;
  pageShort: string;

  seoConfigured: string;
seoAvgScore: string;
seoProblems: string;
seoDuplicates: string;
seoNotConfigured: string;
seoFixErrors: string;
seoResetConfirm: string;
seoDeleted: string;
exportJson: string;
revert: string;
saveAll: string;
unsavedPages: string;
allSaved: string;
seoHeadCode: string;
seoSyncOg: string;
pagesSaved: string;
pagesSkipped: string;
}

export const translations: Record<Language, Translations> = {
  // ============================================================
  // RUSCHA
  // ============================================================
  ru: {
    // Sidebar
    dashboard: 'Дашборд',
    properties: 'Объекты',
    complexes: 'ЖК',
    users: 'Пользователи',
    applications: 'Заявки',
    promotions: 'Акции',
    reviews: 'Отзывы',
    employees: 'Сотрудники',
    admins: 'Администраторы',
    settings: 'Настройки',
    seo: 'SEO',
    logs: 'Журнал',

    // Header
    search: 'Поиск...',
    notifications: 'Уведомления',
    myAccount: 'Мой аккаунт',
    profile: 'Профиль',
    logout: 'Выйти',
    adminPanel: 'Админ панель',

    // Umumiy
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    create: 'Создать',
    loading: 'Загрузка...',
    noData: 'Нет данных',
    confirm: 'Подтвердить',
    saving: 'Сохранение...',
    creating: 'Создание...',
    updating: 'Обновление...',
    yes: 'Да',
    no: 'Нет',
    all: 'Все',

    // Auth
    login: 'Вход',
    email: 'Email',
    password: 'Пароль',
    forgotPassword: 'Забыли пароль?',
    loginButton: 'Войти',
    welcomeBack: 'Добро пожаловать',
    loginSubtitle: 'Введите данные для входа в админ панель',

    // Login sahifasi
    loginPageSubtitle: 'Современная система управления недвижимостью в Узбекистане.',
    manageRealEstate: 'Управляйте недвижимостью',
    totalObjects: 'Всего объектов',
    premium: 'Премиум',
    modernResidential: 'Современные жилые комплексы',
    help: 'Помощь',
    contact: 'Связаться',
    uzbekistan: 'Узбекистан',

    // Dashboard
    dashboardWelcome: 'Добро пожаловать',
    dashboardSubtitle: 'Здесь общая статистика',
    propertyList: 'Объекты',
    projects: 'Проекты',
    allProperties: 'Все объекты',
    searchProperties: 'Поиск объектов...',
    noPropertySelected: 'Объект не выбран',
    selectProperty: 'Выберите объект',
    editProperty: 'Редактировать',
    deleteProperty: 'Удалить',
    viewProperty: 'Просмотр',
    deleteConfirm: 'Подтвердите удаление',
    rooms: 'комнат',
    totalViews: 'Всего просмотров',
    savedFavorites: 'Сохранённые',
    inquiries: 'Запросы',
    scheduledViewings: 'Запланированные',
    conversionFunnel: 'Воронка конверсии',
    conversionFunnelSubtitle: 'Отслеживание пути покупателя',
    views: 'Просмотры',
    clicks: 'Клики',

    // Admins
    adminsTitle: 'Администраторы',
    adminsSubtitle: 'Системные администраторы и роли',
    newAdmin: 'Новый администратор',
    editAdmin: 'Редактировать администратора',
    adminInfo: 'Информация об администраторе',
    adminCount: 'администраторов',
    roleAndStatus: 'Роль и статус',
    permissions: 'Разрешения',
    allPermissions: 'Все разрешения',
    permissionsCount: 'разрешений',
    role: 'Роль',
    roleRequired: 'Роль обязательна',
    selectRole: 'Выберите роль',
    activeStatus: 'Активный статус',
    activeStatusDesc: 'Администратор может войти в систему',
    adminActive: 'Активный',
    adminInactive: 'Неактивный',
    adminCreated: 'Администратор создан',
    adminUpdated: 'Администратор сохранён',
    adminDeleted: 'Администратор удалён',
    adminDeleteConfirm: 'Удалить администратора?',
    nameRequired: 'Имя обязательно',
    emailRequired: 'Email обязателен',
    passwordRequired: 'Пароль обязателен',
    nameMin: 'Минимум 2 символа',
    emailInvalid: 'Неверный формат email',
    passwordMin: 'Минимум 6 символов',
    searchAdmin: 'Имя или email...',
    filters: 'Фильтры',
    resetFilters: 'Сбросить',
    totalAdmins: 'Всего администраторов',
    superAdmin: 'Супер админ',
    contentManager: 'Контент-менеджер',
    manager: 'Менеджер',

    // Promotions
    promotionsTitle: 'Акции',
    promotionsSubtitle: 'Скидки и специальные предложения',
    newPromotion: 'Новая акция',
    editPromotion: 'Редактировать акцию',
    promotionName: 'Название',
    promotionDescription: 'Описание',
    promotionDiscount: 'Скидка',
    promotionStartDate: 'Дата начала',
    promotionEndDate: 'Дата окончания',
    promotionStatus: 'Статус',
    promotionActive: 'Активна',
    promotionInactive: 'Неактивна',
    promotionHidden: 'Скрыта',
    promotionCreated: 'Акция создана',
    promotionUpdated: 'Акция сохранена',
    promotionDeleted: 'Акция удалена',
    promotionDeleteConfirm: 'Удалить акцию?',
    searchPromotion: 'Название акции...',
    totalPromotions: 'Всего акций',
    propertiesCount: 'объектов',
    page: 'Страница',
    previous: 'Предыдущая',
    next: 'Следующая',
    createdAt: 'Дата создания',
    actions: 'Действия',
    show: 'Показать',
    hide: 'Скрыть',

    // Properties
    propertiesTitle: 'Объекты',
    totalProperties: 'Всего объектов:',
    newProperty: 'Новый объект',
    newPropertySubtitle: 'Введите данные нового объекта',
    propertyCreated: 'Объект создан',
    propertyUpdated: 'Объект сохранён',
    propertyDeleted: 'Объект удалён',
    propertyDuplicated: 'Копия создана',
    image: 'Изображение',
    propertyName: 'Название',
    type: 'Тип',
    address: 'Адрес',
    price: 'Цена',
    status: 'Статус',
    available: 'Доступно',
    booked: 'Забронировано',
    sold: 'Продано',
    typeApartment: 'Квартира',
    typeStudio: 'Студия',
    typeHouse: 'Дом',
    typeOffice: 'Офис',
    typeShop: 'Магазин',
    typeParking: 'Парковка',
    typeGarage: 'Гараж',
    typeStorage: 'Кладовая',
    propertyBasicInfo: 'Основная информация',
    complexOptional: 'ЖК (необязательно)',
    selectComplex: 'Выберите ЖК',
    noneOption: '— Нет —',
    apartmentNumber: 'Номер квартиры',
    roomsAndFloor: 'Комнаты и этаж',
    area: 'Площадь',
    floor: 'Этаж',
    floorsTotal: 'Всего этажей',
    priceAmount: 'Цена',
    pricePerM2: 'Цена за м²',
    oldPrice: 'Старая цена',
    discount: 'Скидка',
    statusAndAddress: 'Статус и адрес',
    description: 'Описание',
    images: 'Изображения',
    features: 'Особенности',
    featuresPlaceholder: 'Балкон, Лифт, ...',
    advantages: 'Преимущества',
    advantagesPlaceholder: 'Рядом метро, Новый дом, ...',
    publishedLabel: 'Показать на сайте',
    publishedHint: 'Объект виден пользователям',
    duplicate: 'Дублировать',
    view: 'Просмотр',

    // Statuslar
    statusAvailable: 'Доступно',
    statusBooked: 'Забронировано',
    statusSold: 'Продано',
    statusNew: 'Новая',
    statusInWork: 'В работе',
    statusDone: 'Выполнена',
    statusClosed: 'Закрыта',
    statusActive: 'Активна',
    statusInactive: 'Неактивна',
    statusHidden: 'Скрыта',

    // Vaqt
    timeNow: 'только что',
    timeMinutesAgo: '{n} мин назад',
    timeHoursAgo: '{n} ч назад',
    timeDaysAgo: '{n} дн назад',

    // Property turlari
    propertyTypeApartment: 'Квартира',
    propertyTypeStudio: 'Студия',
    propertyTypeHouse: 'Дом',
    propertyTypeOffice: 'Офис',
    propertyTypeShop: 'Магазин',
    propertyTypeParking: 'Парковка',
    propertyTypeGarage: 'Гараж',
    propertyTypeStorage: 'Кладовая',

    // Dashboard komponentlari
    recentApplications: 'Последние заявки',
    viewAll: 'Все',
    noApplications: 'Нет заявок',

    // Complexes
    complexesTitle: 'Жилые комплексы',
    complexesSubtitle: 'Управление жилыми комплексами',
    newComplex: 'Новый ЖК',
    newComplexSubtitle: 'Введите данные нового ЖК',
    complexCreated: 'ЖК создан',
    complexUpdated: 'ЖК сохранён',
    complexDeleted: 'ЖК удалён',
    complexDeleteConfirm: 'Удалить ЖК?',
    searchComplex: 'Название ЖК...',
    complexName: 'Название',
    district: 'Район',
    builder: 'Застройщик',
    completionYear: 'Сдача',
    statusBuilding: 'Строится',
    statusCompleted: 'Сдан',
    statusPlanned: 'Планируется',
    hideFromSite: 'Скрыть с сайта',
    showOnSite: 'Показать на сайте',
    published: 'На сайте',
    hidden: 'Скрыт',
    complexBasicInfo: 'Основная информация',
    complexConstruction: 'Информация о строительстве',
    buildings: 'Корпусов',
    floors: 'Этажей',
    minPrice: 'Мин. цена',
    maxPrice: 'Макс. цена',
    infrastructure: 'Инфраструктура',
    infrastructurePlaceholder: 'Школа, Детский сад, ...',
    imageHint: 'Загрузите минимум 1 изображение',
    imageRequired: 'Требуется минимум 1 изображение',

    // Users (YANGI)
    usersTitle: 'Пользователи',
    totalUsers: 'Всего пользователей:',
    searchUser: 'Поиск пользователей...',
    user: 'Пользователь',
    phone: 'Телефон',
    favorites: 'Избранное',
    registeredAt: 'Дата регистрации',
    unblock: 'Разблокировать',
    block: 'Заблокировать',
    userBlocked: 'Пользователь заблокирован',
    userUnblocked: 'Пользователь разблокирован',
    userDeleted: 'Пользователь удалён',
    userDeleteConfirm: 'Удалить пользователя?',
    userToday: 'Новые сегодня',
    userId: 'ID пользователя',
    noFavorites: 'Нет избранных объектов',
    noViews: 'Нет просмотров',
    errorOccurred: 'Произошла ошибка',

    active: 'Активный',
    blocked: 'Заблокирован',


    // Applications
    applicationsTitle: 'Заявки',
    applicationsSubtitle: 'Заявки от клиентов',
    searchApplication: 'Имя, телефон или email...',
    applicationsLoadFailed: 'Не удалось загрузить заявки',
    statusChanged: 'Статус изменён',
    applicationDeleteConfirm: 'Удалить заявку?',
    applicationDeleted: 'Заявка удалена',
    applicationsBulkDeleteConfirm: 'заявок удалить?',
    applicationsDeleted: 'заявок удалено',
    csvDownloaded: 'CSV скачан',
    exportError: 'Ошибка экспорта',
    exportCSV: 'Экспорт CSV',
    exporting: 'Загрузка...',
    clear: 'Очистить',
    clearFilters: 'Очистить фильтры',
    sorting: 'Сортировка',
    date: 'Дата',
    selected: 'выбрано',
    selectAll: 'Выбрать все',
    deselectAll: 'Отменить все',
    first: 'Первая',
    last: 'Последняя',
    applicationsNotFound: 'Заявки не найдены',
    noResultsByFilter: 'По фильтру нет результатов',
    noApplicationsYet: 'Пока нет заявок',
    client: 'Клиент',
    source: 'Источник',
    message: 'Сообщение',
    timeline: 'История',
    applicationCreated: 'Заявка создана',
    lastUpdated: 'Последнее изменение',
    currentStatus: 'Текущий статус',
    close: 'Закрыть',
    copyId: 'Копировать ID',
    changeStatus: 'Изменить статус',
    anonymousClient: 'Анонимный клиент',
    applicationDetails: 'Детали заявки',
    viewDetails: 'Подробнее',
    total: 'Всего',
    today: 'Сегодня',
    application: 'Заявка',
    property: 'Объект',
    // Reviews
    reviewsTitle: 'Отзывы',
    reviewsSubtitle: 'Отзывы и рейтинг клиентов',
    searchReview: 'Имя или текст отзыва...',
    reviewsLoadFailed: 'Не удалось загрузить отзывы',
    reviewPublished: 'Отзыв опубликован',
    reviewUnpublished: 'Отзыв скрыт',
    reviewDeleted: 'Отзыв удалён',
    reviewDeleteConfirm: 'Удалить отзыв?',
    reviewsNotFound: 'Отзывы не найдены',
    reviewsTotal: 'Всего отзывов',
    reviewsAvgRating: 'Средний рейтинг',
    pending: 'Ожидает',
    publish: 'Опубликовать',
    review: 'Отзыв',
    rating: 'Рейтинг',

    // Reyting yorliqlari
    ratingExcellent: 'Отлично',
    ratingGood: 'Хорошо',
    ratingAverage: 'Средне',
    ratingBad: 'Плохо',
    ratingVeryBad: 'Очень плохо',

    // Employees
    employeesTitle: 'Сотрудники',
    employeesSubtitle: 'Сотрудники компании и менеджеры',
    newEmployee: 'Новый сотрудник',
    newEmployeeSubtitle: 'Введите данные нового сотрудника',
    searchEmployee: 'Имя или должность...',
    employeesLoadFailed: 'Не удалось загрузить сотрудников',
    employeeCreated: 'Сотрудник создан',
    employeeUpdated: 'Сотрудник сохранён',
    employeeDeleted: 'Сотрудник удалён',
    employeeDeleteConfirm: 'Удалить сотрудника?',
    employeeNotFound: 'Сотрудник не найден',
    employeesNotFound: 'Сотрудники не найдены',
    employeeHidden: 'Сотрудник скрыт',
    employeeShown: 'Сотрудник показан',
    position: 'Должность',
    positionPlaceholder: 'Главный менеджер',
    fullName: 'Имя и фамилия',
    namePlaceholder: 'Сардор Рахимов',
    descriptionPlaceholder: 'Специалист по недвижимости...',
    order: 'Порядок',
    orderNumber: 'Порядковый номер',
    orderHint: 'Меньшее число отображается первым',
    orderAndStatus: 'Порядок и статус',
    basicInfo: 'Основная информация',
    photo: 'Фото',
    uploadPhoto: 'Загрузить фото',
    uploading: 'Загрузка...',
    photoUploaded: 'Фото загружено',
    photoUploadFailed: 'Фото не загружено',
    photoHint: 'PNG, JPG · Максимум 10MB',
    saveEmployeeFirst: 'Сначала сохраните сотрудника, потом загрузите фото',
    showOnSiteDesc: 'Сотрудник виден на сайте',
    name: 'Имя',


    // Settings
    settingsTitle: 'Настройки',
    settingsSubtitle: 'Общие настройки и конфигурация сайта',
    admin: 'Админ',
    settingsLoadFailed: 'Не удалось загрузить настройки',
    settingsSaved: 'Настройки сохранены',
    settingsResetConfirm: 'Отменить все изменения?',
    settingsResetDone: 'Изменения отменены',
    settingsExported: 'Настройки экспортированы',
    searchSettings: 'Поиск настроек...',
    changesCount: 'изменений',
    unsavedChanges: 'изменений не сохранено',
    allChangesSaved: 'Все изменения сохранены',
    settingsCount: 'настроек',
    logoPreview: 'Предпросмотр логотипа',
    noResultsFound: 'результатов не найдено',
    export: 'Экспорт',

    // Группы
    settingsGroupGeneral: 'Общие',
    settingsGroupGeneralDesc: 'Основные настройки сайта',
    settingsGroupContacts: 'Контакты',
    settingsGroupContactsDesc: 'Контактная информация',
    settingsGroupDisplay: 'Отображение',
    settingsGroupDisplayDesc: 'Внешний вид и отображение',
    settingsGroupSocial: 'Соцсети',
    settingsGroupSocialDesc: 'Ссылки на социальные сети',

    // Ярлыки настроек
    settingSiteName: 'Название сайта',
    settingSiteNamePlaceholder: 'Etagi',
    settingSiteNameHint: 'Название сайта (заголовок и логотип)',
    settingSiteDescription: 'Описание сайта',
    settingSiteDescriptionPlaceholder: 'Лучший сайт недвижимости в Узбекистане',
    settingSiteDescriptionHint: 'Краткое описание (для SEO)',
    settingLogo: 'Логотип',
    settingLogoPlaceholder: '/images/logo.svg',
    settingLogoHint: 'URL-адрес логотипа',
    settingPhonePlaceholder: '+998 71 200 00 00',
    settingPhoneHint: 'Основной номер телефона',
    settingEmailPlaceholder: 'info@etagi.ru',
    settingEmailHint: 'Email адрес',
    settingAddress: 'Адрес',
    settingAddressPlaceholder: 'Ташкент, ул. Амира Темура 108',
    settingAddressHint: 'Адрес офиса',
    settingWorkingHours: 'Часы работы',
    settingWorkingHoursPlaceholder: 'Пн-Сб: 9:00 - 19:00',
    settingWorkingHoursHint: 'График работы',
    settingTelegram: 'Telegram',
    settingTelegramPlaceholder: 'https://t.me/etagi_uz',
    settingTelegramHint: 'Telegram канал или бот',
    settingInstagram: 'Instagram',
    settingInstagramPlaceholder: 'https://instagram.com/etagi_uz',
    settingInstagramHint: 'Instagram страница',
    settingWhatsapp: 'WhatsApp',
    settingWhatsappPlaceholder: 'https://wa.me/998712000000',
    settingWhatsappHint: 'Номер WhatsApp (в формате wa.me)',
    settingYoutube: 'YouTube',
    settingYoutubePlaceholder: 'https://youtube.com/@etagi_uz',
    settingYoutubeHint: 'YouTube канал',
    settingFacebook: 'Facebook',
    settingFacebookPlaceholder: 'https://facebook.com/etagi_uz',
    settingFacebookHint: 'Facebook страница',
    settingObjectsPerPage: 'Объектов на странице',
    settingObjectsPerPagePlaceholder: '12',
    settingObjectsPerPageHint: 'Сколько объектов показывать на странице',
    settingMainCategories: 'Основные категории',
    settingMainCategoriesPlaceholder: 'new,house,com',
    settingMainCategoriesHint: 'Основные категории (через запятую)',
    settingCurrency: 'Валюта',
    settingCurrencyPlaceholder: 'USD',
    settingCurrencyHint: 'Валюта (USD, UZS, RUB)',
    settingLanguage: 'Язык',
    settingLanguagePlaceholder: 'uz',
    settingLanguageHint: 'Язык сайта (uz, ru, en)',

    // SEO
    seoTitle: 'SEO',
    seoSubtitle: 'SEO информация страниц',
    seoLoadFailed: 'Не удалось загрузить SEO данные',
    seoSaved: 'SEO сохранено',
    seoData: 'SEO информация',
    seoTitlePlaceholder: 'Заголовок страницы',
    seoDescriptionPlaceholder: 'Описание страницы',
    seoKeywordsPlaceholder: 'недвижимость, квартира, ...',
    seoKeywordsHint: 'Пишите через запятую',
    seoOpenGraph: 'Open Graph (для соцсетей)',
    seoOgTitlePlaceholder: 'Заголовок, отображаемый в соцсетях',
    seoOgDescriptionPlaceholder: 'Описание, отображаемое в соцсетях',
    seoGooglePreview: 'Отображение в Google (превью)',

    // SEO страницы
    seoPageHome: 'Главная',
    seoPageNovostroyki: 'Новостройки',
    seoPageStroitelstvo: 'Строительство',
    seoPageCommercial: 'Коммерческая',
    seoPageProject: 'Проекты',

    // Logs
    logsTitle: 'Журнал',
    logsSubtitle: 'Журнал активности администраторов',
    logsLoadFailed: 'Не удалось загрузить журнал',
    logsNotFound: 'Записи журнала не найдены',
    searchLog: 'Детали или имя админа...',
    refresh: 'Обновить',

    clearing: 'Очистка...',
    clearLogsTitle: 'Очистка старых логов',
    clearLogsDesc: 'Записи старше указанных дней будут удалены',
    days: 'дней',
    action: 'Действие',
    entity: 'Объект',
    details: 'Детали',



    thisWeek: 'За неделю',
    thisMonth: 'За месяц',
    complex: 'ЖК',
    promotion: 'Акция',
    employee: 'Сотрудник',
    setting: 'Настройка',


    // Amal yorliqlari
    logActionLogin: 'Вход',
    logActionLogout: 'Выход',
    logActionCreate: 'Создание',
    logActionUpdate: 'Редактирование',
    logActionDelete: 'Удаление',
    logActionUpload: 'Загрузка',

    // Obyekt yorliqlari
    logEntityAdmin: 'Админ',
    // Admins detail
    roleSuperAdminDesc: 'Имеет все разрешения',
    roleContentManagerDesc: 'Управление контентом',
    roleManagerDesc: 'Работа с заявками',
    allPermissionsDesc: 'Полный доступ ко всем функциям системы',
    // Dashboard
    quickActions: 'Быстрые действия',
    performance: 'Производительность',
    responseTime: 'Время ответа',
    conversion: 'Конверсия',
    recentLeads: 'Последние клиенты',
    recentActivity: 'Последняя активность',
    allChannels: 'Все каналы',

    minutes: 'мин',
    pieces: 'шт',
    activityViewed: 'Просмотрел объект',
    activityFavorited: 'Добавил в избранное',
    activityInquiry: 'Отправил запрос',
    funnelNoteClicks: '−86,7% не отправили',
    funnelNoteInquiries: '−4,3% не прошли проверку',
    funnelNoteScheduled: '−16,7% потеряли источник',
    imageNotUploaded: 'Изображение не загружено',
    addImageHint: 'Добавьте изображение через редактирование',
    copyLink: 'Копировать ссылку',
    openInNewTab: 'Открыть в новой вкладке',
    previousImage: 'Предыдущее изображение',
    nextImage: 'Следующее изображение',
    previousProperty: 'Предыдущий объект',
    nextProperty: 'Следующий объект',
    language: 'Язык',
    newNotifications: 'новых',
    noNotifications: 'Нет уведомлений',
    markAllRead: 'Прочитать все',
    clearAll: 'Очистить',

    // Profile
    profileTitle: 'Профиль',
    profileSubtitle: 'Ваш личный кабинет и настройки',
    personalInfo: 'Личная информация',
    profileUpdated: 'Профиль обновлён',
    avatarUploaded: 'Аватар загружен',
    fileTooLarge: 'Файл слишком большой (макс. 5MB)',
    security: 'Безопасность',
    currentPassword: 'Текущий пароль',
    newPassword: 'Новый пароль',
    confirmPassword: 'Подтвердите пароль',
    changePassword: 'Изменить пароль',
    passwordChanged: 'Пароль изменён',
    passwordMismatch: 'Пароли не совпадают',
    currentPasswordWrong: 'Текущий пароль неверный',
    passwordTips: 'Требования к паролю:',
    passwordTip1: 'Минимум 6 символов',
    passwordTip2: 'Заглавные и строчные буквы',
    passwordTip3: 'Цифры и специальные символы',
    weak: 'Слабый',
    medium: 'Средний',
    strong: 'Сильный',
    veryStrong: 'Очень сильный',
    theme: 'Тема',
    themeLight: 'Светлая',
    themeLightDesc: 'Всегда светлая тема',
    themeDark: 'Тёмная',
    themeDarkDesc: 'Всегда тёмная тема',
    themeSystem: 'Системная',
    themeSystemDesc: 'Как в системе',
    notificationSettings: 'Настройки уведомлений',
    emailNotifications: 'Email уведомления',
    emailNotificationsDesc: 'Получать уведомления на почту',
    pushNotifications: 'Push уведомления',
    pushNotificationsDesc: 'Уведомления в браузере',
    messageNotifications: 'Сообщения',
    messageNotificationsDesc: 'Уведомления о новых сообщениях',
    recentActivityLog: 'Последняя активность',
    avatarDeleteConfirm: 'Удалить аватар?',
    avatarDeleted: 'Аватар удалён',
    noActivity: 'Нет активности',
    noDetails: 'Нет деталей',
    notificationsSubtitle: 'Все уведомления',
    propertyChartTitle: 'Статистика и динамика',
    propertyChartBarTitle: 'Недельные заявки',
        // Property View & Insights
    back: 'Назад',
    share: 'Поделиться',
    linkCopied: 'Ссылка скопирована',
    last30days: 'за последние 30 дней',
    interestIndex: 'Индекс интереса',
    interestHigh: 'Высокий спрос',
    interestMedium: 'Средний спрос',
    interestLow: 'Низкий спрос',
    interestHint: 'Рассчитывается на основе соотношения сохранений, запросов и просмотров.',
    funnelTitle: 'Путь до клиента',
    chartSubtitle: 'Показатели за последние дни',
    dayShort: 'д',
    vsPrevPeriod: 'по сравнению с прошлым периодом',
    average: 'Среднее',
    perDay: 'в день',
    bestDay: 'Лучший день',
    period: 'Период',
        // Obyekt yorliqlari (to'liq)
    logEntityProperty: 'Объект',
    logEntityComplex: 'ЖК',
    logEntityUser: 'Пользователь',
    logEntityApplication: 'Заявка',
    logEntityPromotion: 'Акция',
    logEntityReview: 'Отзыв',
    logEntityEmployee: 'Сотрудник',
    logEntitySetting: 'Настройка',
    logEntitySeo: 'SEO',

    // Loglar — UI (YANGI)
    live: 'Онлайн',
    analysis: 'Анализ',
    clickToFilter: 'нажмите для фильтра',
    viewMode: 'Вид',
    viewTable: 'Таблица',
    viewTimeline: 'Лента',
    rangeAll: 'Всё время',
    range7d: '7 дней',
    range30d: '30 дней',
    byAction: 'По действиям',
    byEntity: 'По объектам',
    topAdmins: 'Самые активные админы',
    vsDailyAvg: 'к среднедневному',
    vsWeeklyAvg: 'к среднедельному',
    rowsExported: 'записей выгружено',
    resetAll: 'Сбросить всё',
    retry: 'Повторить',
    yesterday: 'Вчера',
    copy: 'Копия',
    copied: 'Скопировано',
    thisAdmin: 'Этот админ',
    perPage: 'На странице',
    pageShort: 'стр.',

    seoConfigured: 'Настроенные страницы',
seoAvgScore: 'Средний SEO балл',
seoProblems: 'Проблемы',
seoDuplicates: 'Дубликаты',
seoNotConfigured: 'Не настроено',
seoFixErrors: 'Проверьте поля',
seoResetConfirm: 'SEO-данные этой страницы будут полностью удалены. Продолжить?',
seoDeleted: 'SEO удалено',
exportJson: 'JSON экспорт',
revert: 'Отменить',
saveAll: 'Сохранить всё',
unsavedPages: 'страниц с несохранёнными изменениями',
allSaved: 'Всё сохранено',
seoHeadCode: '<head> код',
seoSyncOg: 'Заполнить из Title и Description',
pagesSaved: 'страниц сохранено',
pagesSkipped: 'страниц с ошибками — пропущено',
   
  },

  // ============================================================
  // O'ZBEKCHA
  // ============================================================
  uz: {
    // Sidebar
    dashboard: 'Dashboard',
    properties: 'Obyektlar',
    complexes: 'ЖК',
    users: 'Foydalanuvchilar',
    applications: 'Zayavkalar',
    promotions: 'Aksiyalar',
    reviews: 'Sharhlar',
    employees: 'Xodimlar',
    admins: 'Adminlar',
    settings: 'Sozlamalar',
    seo: 'SEO',
    logs: 'Jurnal',

    // Header
    search: 'Qidirish...',
    notifications: 'Bildirishnomalar',
    myAccount: 'Mening akkauntim',
    profile: 'Profil',
    logout: 'Chiqish',
    adminPanel: 'Admin panel',

    // Umumiy
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    delete: "O'chirish",
    edit: 'Tahrirlash',
    create: 'Yaratish',
    loading: 'Yuklanmoqda...',
    noData: "Ma'lumot yo'q",
    confirm: 'Tasdiqlash',
    saving: 'Saqlanmoqda...',
    creating: 'Yaratilmoqda...',
    updating: 'Yangilanmoqda...',
    yes: 'Ha',
    no: "Yo'q",
    all: 'Barchasi',

    // Auth
    login: 'Kirish',
    email: 'Email',
    password: 'Parol',
    forgotPassword: 'Parolni tiklash',
    loginButton: 'Kirish',
    welcomeBack: 'Xush kelibsiz',
    loginSubtitle: "Admin panelga kirish uchun ma'lumotlaringizni kiriting",

    // Login sahifasi
    loginPageSubtitle: "O'zbekistondagi eng zamonaviy ko'chmas mulk boshqaruv tizimi.",
    manageRealEstate: "Boshqaring ko'chmas mulkni",
    totalObjects: 'Jami obyektlar',
    premium: 'Premium',
    modernResidential: 'Zamonaviy turar-joylar',
    help: 'Yordam',
    contact: "Bog'lanish",
    uzbekistan: "O'zbekiston",

    // Dashboard
    dashboardWelcome: 'Xush kelibsiz',
    dashboardSubtitle: "Bu yerda umumiy statistika",
    propertyList: 'Obyektlar',
    projects: 'Loyihalar',
    allProperties: 'Barcha obyektlar',
    searchProperties: 'Obyektlarni qidirish...',
    noPropertySelected: 'Obyekt tanlanmagan',
    selectProperty: 'Obyektni tanlang',
    editProperty: 'Tahrirlash',
    deleteProperty: "O'chirish",
    viewProperty: "Ko'rish",
    deleteConfirm: "O'chirishni tasdiqlaysizmi?",
    rooms: 'xona',
    totalViews: "Jami ko'rishlar",
    savedFavorites: 'Saqlangan',
    inquiries: "So'rovlar",
    scheduledViewings: 'Rejalashtirilgan',
    conversionFunnel: 'Konversiya voronkasi',
    conversionFunnelSubtitle: "Xaridor yo'lini kuzatish",
    views: "Ko'rishlar",
    clicks: 'Kliklar',

    // Admins
    adminsTitle: 'Adminlar',
    adminsSubtitle: 'Tizim adminlari va rollari',
    newAdmin: 'Yangi admin',
    editAdmin: 'Adminni tahrirlash',
    adminInfo: "Admin ma'lumotlari",
    adminCount: 'admin',
    roleAndStatus: 'Rol va status',
    permissions: 'Ruxsatlar',
    allPermissions: 'Barcha ruxsatlar',
    permissionsCount: 'ta ruxsat',
    role: 'Rol',
    roleRequired: 'Rol tanlanishi shart',
    selectRole: 'Rol tanlang',
    activeStatus: 'Faol holat',
    activeStatusDesc: 'Admin tizimga kira oladi',
    adminActive: 'Faol',
    adminInactive: 'Nofaol',
    adminCreated: 'Admin yaratildi',
    adminUpdated: 'Admin saqlandi',
    adminDeleted: "Admin o'chirildi",
    adminDeleteConfirm: "Adminni o'chirishni tasdiqlaysizmi?",
    nameRequired: 'Ism kiritilishi shart',
    emailRequired: 'Email kiritilishi shart',
    passwordRequired: 'Parol kiritilishi shart',
    nameMin: 'Kamida 2 ta belgi',
    emailInvalid: "Email formati noto'g'ri",
    passwordMin: 'Kamida 6 ta belgi',
    searchAdmin: 'Ism yoki email...',
    filters: 'Filtrlar',
    resetFilters: 'Tozalash',
    totalAdmins: 'Jami adminlar',
    superAdmin: 'Super admin',
    contentManager: 'Kontent menejer',
    manager: 'Menejer',

    // Promotions
    promotionsTitle: 'Aksiyalar',
    promotionsSubtitle: 'Chegirmalar va maxsus takliflar',
    newPromotion: 'Yangi aksiya',
    editPromotion: 'Aksiyani tahrirlash',
    promotionName: 'Nomi',
    promotionDescription: 'Tavsif',
    promotionDiscount: 'Chegirma',
    promotionStartDate: 'Boshlanish sanasi',
    promotionEndDate: 'Tugash sanasi',
    promotionStatus: 'Status',
    promotionActive: 'Faol',
    promotionInactive: 'Nofaol',
    promotionHidden: 'Yashirilgan',
    promotionCreated: 'Aksiya yaratildi',
    promotionUpdated: 'Aksiya saqlandi',
    promotionDeleted: "Aksiya o'chirildi",
    promotionDeleteConfirm: "Aksiyani o'chirishni tasdiqlaysizmi?",
    searchPromotion: 'Aksiya nomi...',
    totalPromotions: 'Jami aksiyalar',
    propertiesCount: 'obyekt',
    page: 'Sahifa',
    previous: 'Oldingi',
    next: 'Keyingi',
    createdAt: 'Yaratilgan sana',
    actions: 'Harakatlar',
    show: "Ko'rsatish",
    hide: 'Yashirish',

    // Properties
    propertiesTitle: 'Obyektlar',
    totalProperties: 'Jami obyektlar:',
    newProperty: 'Yangi obyekt',
    newPropertySubtitle: "Yangi obyekt ma'lumotlarini kiriting",
    propertyCreated: 'Obyekt yaratildi',
    propertyUpdated: 'Obyekt saqlandi',
    propertyDeleted: "Obyekt o'chirildi",
    propertyDuplicated: 'Nusxa yaratildi',
    image: 'Rasm',
    propertyName: 'Nomi',
    type: 'Tur',
    address: 'Manzil',
    price: 'Narx',
    status: 'Status',
    available: 'Mavjud',
    booked: 'Band',
    sold: 'Sotilgan',
    typeApartment: 'Kvartira',
    typeStudio: 'Studiya',
    typeHouse: 'Uy',
    typeOffice: 'Ofis',
    typeShop: "Do'kon",
    typeParking: 'Parkovka',
    typeGarage: 'Garaj',
    typeStorage: 'Kladovka',
    propertyBasicInfo: "Asosiy ma'lumot",
    complexOptional: "ЖК (majburiy emas)",
    selectComplex: 'ЖК tanlang',
    noneOption: "— Yo'q —",
    apartmentNumber: 'Kvartira raqami',
    roomsAndFloor: 'Xona va qavat',
    area: 'Maydon',
    floor: 'Qavat',
    floorsTotal: 'Jami qavat',
    priceAmount: 'Narx',
    pricePerM2: 'M² narxi',
    oldPrice: 'Eski narx',
    discount: 'Chegirma',
    statusAndAddress: 'Status va manzil',
    description: 'Tavsif',
    images: 'Rasmlar',
    features: 'Xususiyatlar',
    featuresPlaceholder: 'Balkon, Lift, ...',
    advantages: 'Afzalliklar',
    advantagesPlaceholder: 'Metroga yaqin, Yangi bino, ...',
    publishedLabel: "Saytda ko'rsatish",
    publishedHint: "Obyekt foydalanuvchilarga ko'rinadi",
    duplicate: 'Nusxalash',
    view: "Ko'rish",

    // Statuslar
    statusAvailable: 'Mavjud',
    statusBooked: 'Band',
    statusSold: 'Sotilgan',
    statusNew: 'Yangi',
    statusInWork: 'Ishlanmoqda',
    statusDone: 'Bajarilgan',
    statusClosed: 'Yopilgan',
    statusActive: 'Faol',
    statusInactive: 'Nofaol',
    statusHidden: 'Yashirilgan',

    // Vaqt
    timeNow: 'hozir',
    timeMinutesAgo: '{n} daqiqa oldin',
    timeHoursAgo: '{n} soat oldin',
    timeDaysAgo: '{n} kun oldin',

    // Property turlari
    propertyTypeApartment: 'Kvartira',
    propertyTypeStudio: 'Studiya',
    propertyTypeHouse: 'Uy',
    propertyTypeOffice: 'Ofis',
    propertyTypeShop: "Do'kon",
    propertyTypeParking: 'Parkovka',
    propertyTypeGarage: 'Garaj',
    propertyTypeStorage: 'Kladovka',

    // Dashboard komponentlari
    recentApplications: "So'nggi zayavkalar",
    viewAll: 'Barchasi',
    noApplications: "Zayavkalar yo'q",

    // Complexes
    complexesTitle: 'ЖК (Turar-joy majmualari)',
    complexesSubtitle: 'Turar-joy majmualari boshqaruvi',
    newComplex: 'Yangi ЖК',
    newComplexSubtitle: "Yangi turar-joy majmuasi ma'lumotlarini kiriting",
    complexCreated: 'ЖК yaratildi',
    complexUpdated: 'ЖК saqlandi',
    complexDeleted: "ЖК o'chirildi",
    complexDeleteConfirm: "ЖК ni o'chirishni tasdiqlaysizmi?",
    searchComplex: 'ЖК nomi...',
    complexName: 'Nomi',
    district: 'Tuman',
    builder: 'Quruvchi',
    completionYear: 'Topshirish',
    statusBuilding: 'Qurilmoqda',
    statusCompleted: 'Topshirilgan',
    statusPlanned: 'Rejalashtirilgan',
    hideFromSite: 'Saytdan yashirish',
    showOnSite: 'Saytga chiqarish',
    published: 'Saytda',
    hidden: 'Yashirilgan',
    complexBasicInfo: "Asosiy ma'lumot",
    complexConstruction: "Qurilish ma'lumotlari",
    buildings: 'Binolar',
    floors: 'Qavatlar',
    minPrice: 'Min narx',
    maxPrice: 'Max narx',
    infrastructure: 'Infratuzilma',
    infrastructurePlaceholder: "Maktab, Bog'cha, ...",
    imageHint: 'Kamida 1 ta rasm yuklang',
    imageRequired: 'Kamida 1 ta rasm majburiy',

    // Users (YANGI)
    usersTitle: 'Foydalanuvchilar',
    totalUsers: 'Jami foydalanuvchilar:',
    searchUser: 'Foydalanuvchilarni qidirish...',
    user: 'Foydalanuvchi',
    phone: 'Telefon',
    favorites: 'Sevimlilar',
    registeredAt: "Ro'yxatdan o'tgan sana",
    unblock: 'Blokdan chiqarish',
    block: 'Bloklash',
    userBlocked: 'Foydalanuvchi bloklandi',
    userUnblocked: 'Foydalanuvchi blokdan chiqarildi',
    userDeleted: "Foydalanuvchi o'chirildi",
    userDeleteConfirm: "Foydalanuvchini o'chirishni tasdiqlaysizmi?",
    userToday: 'Bugun yangi',
    userId: 'Foydalanuvchi ID',
    noFavorites: "Sevimli obyektlar yo'q",
    noViews: "Ko'rishlar yo'q",
    errorOccurred: 'Xatolik yuz berdi',


    active: 'Faol',
    blocked: 'Bloklangan',


    // Applications
    applicationsTitle: 'Zayavkalar',
    applicationsSubtitle: 'Mijozlardan kelgan zayavkalar',
    searchApplication: 'Ism, telefon yoki email...',
    applicationsLoadFailed: "Zayavkalarni yuklab bo'lmadi",
    statusChanged: "Status o'zgartirildi",
    applicationDeleteConfirm: "Zayavkani o'chirishni tasdiqlaysizmi?",
    applicationDeleted: "Zayavka o'chirildi",
    applicationsBulkDeleteConfirm: "ta zayavkani o'chirishni tasdiqlaysizmi?",
    applicationsDeleted: "ta zayavka o'chirildi",
    csvDownloaded: 'CSV yuklab olindi',
    exportError: 'Eksport xatosi',
    exportCSV: 'Export CSV',
    exporting: 'Yuklanmoqda...',
    clear: 'Tozalash',
    clearFilters: 'Filtrlarni tozalash',
    sorting: 'Saralash',
    date: 'Sana',
    selected: 'ta tanlandi',
    selectAll: 'Barchasini tanlash',
    deselectAll: 'Barchasini bekor qilish',
    first: 'Birinchi',
    last: 'Oxirgi',
    applicationsNotFound: 'Zayavkalar topilmadi',
    noResultsByFilter: "Filtr bo'yicha natija yo'q",
    noApplicationsYet: "Hozircha zayavkalar yo'q",
    client: 'Mijoz',
    source: 'Manba',
    message: 'Xabar',
    timeline: 'Timeline',
    applicationCreated: 'Zayavka yaratildi',
    lastUpdated: "Oxirgi o'zgarish",
    currentStatus: 'Hozirgi holat',
    close: 'Yopish',
    copyId: 'ID nusxalash',
    changeStatus: "Status o'zgartirish",
    anonymousClient: 'Anonim mijoz',
    applicationDetails: 'Zayavka tafsilotlari',
    viewDetails: 'Batafsil',
    total: 'Jami',
    today: 'Bugun',
    application: 'Zayavka',
    // Property (birlik)
    property: 'Obyekt',
    // Reviews
    reviewsTitle: 'Sharhlar',
    reviewsSubtitle: 'Mijozlar sharhlari va reyting',
    searchReview: 'Ism yoki sharh matni...',
    reviewsLoadFailed: "Sharhlarni yuklab bo'lmadi",
    reviewPublished: "Sharh e'lon qilindi",
    reviewUnpublished: 'Sharh yashirildi',
    reviewDeleted: "Sharh o'chirildi",
    reviewDeleteConfirm: "Sharhni o'chirishni tasdiqlaysizmi?",
    reviewsNotFound: 'Sharhlar topilmadi',
    reviewsTotal: 'Jami sharhlar',
    reviewsAvgRating: "O'rtacha reyting",

    pending: 'Kutilayotgan',
    publish: "E'lon qilish",

    review: 'Sharh',
    rating: 'Reyting',

    // Reyting yorliqlari
    ratingExcellent: 'Ajoyib',
    ratingGood: 'Yaxshi',
    ratingAverage: "O'rtacha",
    ratingBad: 'Yomon',
    ratingVeryBad: 'Juda yomon',

    // Employees
    employeesTitle: 'Xodimlar',
    employeesSubtitle: 'Kompaniya xodimlari va menejerlar',
    newEmployee: 'Yangi xodim',
    newEmployeeSubtitle: "Yangi xodim ma'lumotlarini kiriting",
    searchEmployee: 'Ism yoki lavozim...',
    employeesLoadFailed: "Xodimlarni yuklab bo'lmadi",
    employeeCreated: 'Xodim yaratildi',
    employeeUpdated: 'Xodim saqlandi',
    employeeDeleted: "Xodim o'chirildi",
    employeeDeleteConfirm: "Xodimni o'chirishni tasdiqlaysizmi?",
    employeeNotFound: 'Xodim topilmadi',
    employeesNotFound: 'Xodimlar topilmadi',
    employeeHidden: 'Xodim yashirildi',
    employeeShown: "Xodim ko'rsatildi",
    position: 'Lavozim',
    positionPlaceholder: 'Bosh menejer',
    fullName: 'Ism familiya',
    namePlaceholder: 'Sardor Rahimov',
    descriptionPlaceholder: "Ko'chmas mulk bo'yicha mutaxassis...",
    order: 'Tartib',
    orderNumber: 'Tartib raqami',
    orderHint: "Kichikroq raqam birinchi ko'rinadi",
    orderAndStatus: 'Tartib va status',
    basicInfo: "Asosiy ma'lumot",
    photo: 'Rasm',
    uploadPhoto: 'Rasm yuklash',
    uploading: 'Yuklanmoqda...',
    photoUploaded: 'Rasm yuklandi',
    photoUploadFailed: 'Rasm yuklanmadi',
    photoHint: 'PNG, JPG · Maksimal 10MB',
    saveEmployeeFirst: 'Avval xodimni saqlang, keyin rasm yuklang',

    showOnSiteDesc: 'Xodim saytda ko\'rinadi',
    name: 'Ism',

    // Settings
    settingsTitle: 'Sozlamalar',
    settingsSubtitle: "Sayt umumiy sozlamalari va konfiguratsiyasi",
    admin: 'Admin',
    settingsLoadFailed: "Sozlamalarni yuklab bo'lmadi",
    settingsSaved: 'Sozlamalar saqlandi',
    settingsResetConfirm: "Barcha o'zgarishlarni bekor qilishni tasdiqlaysizmi?",
    settingsResetDone: "O'zgarishlar bekor qilindi",
    settingsExported: 'Sozlamalar eksport qilindi',
    searchSettings: 'Sozlamalarni qidirish...',
    changesCount: "o'zgarish",
    unsavedChanges: "ta o'zgarish saqlanmagan",
    allChangesSaved: "Barcha o'zgarishlar saqlangan",
    settingsCount: 'ta sozlama',
    logoPreview: 'Logo preview',
    noResultsFound: "bo'yicha natija topilmadi",
    export: 'Export',

    // Guruhlar
    settingsGroupGeneral: 'Umumiy',
    settingsGroupGeneralDesc: 'Sayt nomi, tavsif va logo',
    settingsGroupContacts: "Bog'lanish",
    settingsGroupContactsDesc: 'Telefon, email, manzil',
    settingsGroupDisplay: "Ko'rinish",
    settingsGroupDisplayDesc: "Sahifadagi ko'rinish sozlamalari",
    settingsGroupSocial: 'Ijtimoiy tarmoqlar',
    settingsGroupSocialDesc: 'Telegram, Instagram, Facebook',

    // Sozlamalar yorliqlari
    settingSiteName: 'Sayt nomi',
    settingSiteNamePlaceholder: 'Etagi',
    settingSiteNameHint: 'Sayt nomi (sarlavha va logotip)',
    settingSiteDescription: 'Sayt tavsifi',
    settingSiteDescriptionPlaceholder: "O'zbekistondagi eng yaxshi ko'chmas mulk sayti",
    settingSiteDescriptionHint: 'Qisqa tavsif (SEO uchun)',
    settingLogo: 'Logotip',
    settingLogoPlaceholder: '/images/logo.svg',
    settingLogoHint: 'Logotip URL manzili',
    settingPhonePlaceholder: '+998 71 200 00 00',
    settingPhoneHint: 'Asosiy telefon raqami',
    settingEmailPlaceholder: 'info@etagi.ru',
    settingEmailHint: 'Email manzil',
    settingAddress: 'Manzil',
    settingAddressPlaceholder: "Toshkent, Amir Temur ko'chasi 108",
    settingAddressHint: 'Ofis manzili',
    settingWorkingHours: 'Ish vaqti',
    settingWorkingHoursPlaceholder: 'Du-Sh: 9:00 - 19:00',
    settingWorkingHoursHint: 'Ish vaqti',
    settingTelegram: 'Telegram',
    settingTelegramPlaceholder: 'https://t.me/etagi_uz',
    settingTelegramHint: 'Telegram kanal yoki bot',
    settingInstagram: 'Instagram',
    settingInstagramPlaceholder: 'https://instagram.com/etagi_uz',
    settingInstagramHint: 'Instagram sahifa',
    settingWhatsapp: 'WhatsApp',
    settingWhatsappPlaceholder: 'https://wa.me/998712000000',
    settingWhatsappHint: 'WhatsApp raqami (wa.me formatida)',
    settingYoutube: 'YouTube',
    settingYoutubePlaceholder: 'https://youtube.com/@etagi_uz',
    settingYoutubeHint: 'YouTube kanal',
    settingFacebook: 'Facebook',
    settingFacebookPlaceholder: 'https://facebook.com/etagi_uz',
    settingFacebookHint: 'Facebook sahifa',
    settingObjectsPerPage: 'Sahifadagi obyektlar',
    settingObjectsPerPagePlaceholder: '12',
    settingObjectsPerPageHint: "Sahifada nechta obyekt ko'rsatiladi",
    settingMainCategories: 'Asosiy kategoriyalar',
    settingMainCategoriesPlaceholder: 'new,house,com',
    settingMainCategoriesHint: 'Asosiy kategoriyalar (vergul bilan)',
    settingCurrency: 'Valyuta',
    settingCurrencyPlaceholder: 'USD',
    settingCurrencyHint: 'Valyuta (USD, UZS, RUB)',
    settingLanguage: 'Til',
    settingLanguagePlaceholder: 'uz',
    settingLanguageHint: 'Sayt tili (uz, ru, en)',
    // SEO
    seoTitle: 'SEO',
    seoSubtitle: "Sahifalar SEO ma'lumotlari",
    seoLoadFailed: "SEO ma'lumotlarini yuklab bo'lmadi",
    seoSaved: 'SEO saqlandi',
    seoData: "SEO ma'lumotlari",
    seoTitlePlaceholder: 'Sahifa sarlavhasi',
    seoDescriptionPlaceholder: 'Sahifa tavsifi',
    seoKeywordsPlaceholder: "ko'chmas mulk, kvartira, ...",
    seoKeywordsHint: 'Vergul bilan ajratib yozing',
    seoOpenGraph: 'Open Graph (ijtimoiy tarmoqlar uchun)',
    seoOgTitlePlaceholder: "Ijtimoiy tarmoqda ko'rinadigan sarlavha",
    seoOgDescriptionPlaceholder: "Ijtimoiy tarmoqda ko'rinadigan tavsif",
    seoGooglePreview: "Google'da ko'rinish (preview)",

    // SEO sahifalari
    seoPageHome: 'Bosh sahifa',
    seoPageNovostroyki: 'Novostroykalar',
    seoPageStroitelstvo: 'Qurilish',
    seoPageCommercial: 'Tijorat',
    seoPageProject: 'Loyihalar',
    // Logs
    logsTitle: 'Jurnal',
    logsSubtitle: 'Adminlar faoliyati jurnali',
    logsLoadFailed: "Jurnalni yuklab bo'lmadi",
    logsNotFound: 'Jurnal yozuvlari topilmadi',
    searchLog: 'Tafsilot yoki admin nomi...',
    refresh: 'Yangilash',

    clearing: 'Tozalanmoqda...',
    clearLogsTitle: 'Eski jurnallarni tozalash',
    clearLogsDesc: "Quyidagi kundan eski jurnal yozuvlari o'chiriladi",
    days: 'kun',
    action: 'Amal',
    entity: 'Obyekt',
    details: 'Tafsilot',

    thisWeek: 'Shu hafta',
    thisMonth: 'Shu oy',
    complex: 'ЖК',
    promotion: 'Aksiya',
    employee: 'Xodim',
    setting: 'Sozlama',


    // Amal yorliqlari
    logActionLogin: 'Kirish',
    logActionLogout: 'Chiqish',
    logActionCreate: 'Yaratish',
    logActionUpdate: 'Tahrirlash',
    logActionDelete: "O'chirish",
    logActionUpload: 'Yuklash',

    // Obyekt yorliqlari
    logEntityAdmin: 'Admin',
    // Admins detail
    roleSuperAdminDesc: 'Barcha ruxsatlarga ega',
    roleContentManagerDesc: 'Kontent boshqaruvi',
    roleManagerDesc: 'Zayavkalar bilan ishlash',
    allPermissionsDesc: "Barcha tizim funksiyalariga to'liq kirish",
    // Dashboard
    quickActions: 'Tezkor amallar',
    performance: 'Samaradorlik',
    responseTime: 'Javob vaqti',
    conversion: 'Konversiya',
    recentLeads: "So'nggi mijozlar",
    recentActivity: "So'nggi faollik",
    allChannels: 'Barcha kanallar',

    minutes: 'daqiqa',
    pieces: 'ta',
    activityViewed: "Obyektni ko'rdi",
    activityFavorited: "Sevimlilarga qo'shdi",
    activityInquiry: "So'rov yubordi",
    funnelNoteClicks: '−86,7% yuborilmadi',
    funnelNoteInquiries: '−4,3% tekshiruvdan o\'tmadi',
    funnelNoteScheduled: '−16,7% manba yo\'qoldi',
    imageNotUploaded: 'Rasm yuklanmagan',
    addImageHint: "Tahrirlash orqali rasm qo'shing",
    copyLink: 'Linkni nusxalash',
    openInNewTab: 'Yangi oynada ochish',
    previousImage: 'Oldingi rasm',
    nextImage: 'Keyingi rasm',
    previousProperty: 'Oldingi uy',
    nextProperty: 'Keyingi uy',
    // Notifications
    language: 'Til',
    newNotifications: 'yangi',
    noNotifications: "Bildirishnomalar yo'q",
    markAllRead: "Barchasini o'qilgan deb belgilash",
    clearAll: 'Tozalash',
    // Profile
    profileTitle: 'Profil',
    profileSubtitle: 'Shaxsiy kabinetingiz va sozlamalar',
    personalInfo: "Shaxsiy ma'lumotlar",
    profileUpdated: 'Profil yangilandi',
    avatarUploaded: 'Avatar yuklandi',
    fileTooLarge: 'Fayl juda katta (maks. 5MB)',
    security: 'Xavfsizlik',
    currentPassword: 'Joriy parol',
    newPassword: 'Yangi parol',
    confirmPassword: 'Parolni tasdiqlang',
    changePassword: "Parolni o'zgartirish",
    passwordChanged: "Parol o'zgartirildi",
    passwordMismatch: 'Parollar mos kelmadi',
    currentPasswordWrong: "Joriy parol noto'g'ri",
    passwordTips: 'Parol talablari:',
    passwordTip1: 'Kamida 6 ta belgi',
    passwordTip2: 'Katta va kichik harflar',
    passwordTip3: 'Raqamlar va maxsus belgilar',
    weak: 'Zaif',
    medium: "O'rta",
    strong: 'Kuchli',
    veryStrong: 'Juda kuchli',
    theme: 'Mavzu',
    themeLight: "Yorug'",
    themeLightDesc: "Doim yorug' mavzu",
    themeDark: "Qorong'i",
    themeDarkDesc: "Doim qorong'i mavzu",
    themeSystem: 'Tizim',
    themeSystemDesc: 'Tizimdagidek',
    notificationSettings: 'Bildirishnoma sozlamalari',
    emailNotifications: 'Email bildirishnomalar',
    emailNotificationsDesc: 'Pochtaga bildirishnoma olish',
    pushNotifications: 'Push bildirishnomalar',
    pushNotificationsDesc: 'Brauzerda bildirishnomalar',
    messageNotifications: 'Xabarlar',
    messageNotificationsDesc: 'Yangi xabarlar haqida bildirishnomalar',
    recentActivityLog: "So'nggi faollik",
    avatarDeleteConfirm: "Avatarni o'chirishni tasdiqlaysizmi?",
    avatarDeleted: "Avatar o'chirildi",
    noActivity: "Faollik yo'q",
    noDetails: "Tafsilotlar yo'q",
    notificationsSubtitle: 'Barcha bildirishnomalar',
    propertyChartTitle: 'Statistika va dinamika',
    propertyChartBarTitle: 'Haftalik Zayavkalar',


        // Property View & Insights
    back: 'Orqaga',
    share: 'Ulashish',
    linkCopied: 'Havola nusxalandi',
    last30days: 'oxirgi 30 kun',
    interestIndex: 'Qiziqish indeksi',
    interestHigh: 'Yuqori talab',
    interestMedium: "O'rtacha talab",
    interestLow: 'Past talab',
    interestHint: "Saqlash, so'rov va ko'rik so'rovlarining ko'rishlarga nisbati asosida hisoblanadi.",
    funnelTitle: "Mijozgacha yo'l",
    chartSubtitle: "Oxirgi kunlar bo'yicha ko'rsatkichlar",
    dayShort: 'k',
    vsPrevPeriod: 'oldingi davrga nisbatan',
    average: "O'rtacha",
    perDay: 'kuniga',
    bestDay: 'Eng yaxshi kun',
    period: 'Davr',
        // Obyekt yorliqlari (to'liq)
    logEntityProperty: 'Obyekt',
    logEntityComplex: 'ЖК',
    logEntityUser: 'Foydalanuvchi',
    logEntityApplication: 'Zayavka',
    logEntityPromotion: 'Aksiya',
    logEntityReview: 'Sharh',
    logEntityEmployee: 'Xodim',
    logEntitySetting: 'Sozlama',
    logEntitySeo: 'SEO',

    // Loglar — UI (YANGI)
    live: 'Jonli',
    analysis: 'Tahlil',
    clickToFilter: 'bosib filtrlang',
    viewMode: "Ko'rinish",
    viewTable: 'Jadval',
    viewTimeline: 'Lenta',
    rangeAll: 'Barcha vaqt',
    range7d: '7 kun',
    range30d: '30 kun',
    byAction: "Amallar bo'yicha",
    byEntity: "Obyektlar bo'yicha",
    topAdmins: 'Eng faol adminlar',
    vsDailyAvg: "kunlik o'rtachaga nisbatan",
    vsWeeklyAvg: "haftalik o'rtachaga nisbatan",
    rowsExported: 'ta yozuv yuklandi',
    resetAll: 'Hammasini tozalash',
    retry: 'Qayta urinish',
    yesterday: 'Kecha',
    copy: 'Nusxa',
    copied: 'Nusxalandi',
    thisAdmin: 'Shu admin',
    perPage: 'Sahifada',
    pageShort: 'sah.',
    seoConfigured: 'Sozlangan sahifalar',
seoAvgScore: "O'rtacha SEO ball",
seoProblems: 'Muammolar',
seoDuplicates: 'Takrorlanishlar',
seoNotConfigured: 'Sozlanmagan',
seoFixErrors: 'Maydonlarni tekshiring',
seoResetConfirm: "Bu sahifaning SEO ma'lumotlari butunlay o'chiriladi. Davom etasizmi?",
seoDeleted: "SEO o'chirildi",
exportJson: 'JSON eksport',
revert: 'Bekor qilish',
saveAll: 'Hammasini saqlash',
unsavedPages: "ta sahifada saqlanmagan o'zgarish",
allSaved: 'Hammasi saqlangan',
seoHeadCode: '<head> kodi',
seoSyncOg: "Title va Description'dan to'ldirish",
pagesSaved: 'ta sahifa saqlandi',
pagesSkipped: "ta sahifada xato bor — o'tkazib yuborildi",
  },

  // ============================================================
  // INGLIZCHA
  // ============================================================
  en: {
    // Sidebar
    dashboard: 'Dashboard',
    properties: 'Properties',
    complexes: 'Complexes',
    users: 'Users',
    applications: 'Applications',
    promotions: 'Promotions',
    reviews: 'Reviews',
    employees: 'Employees',
    admins: 'Admins',
    settings: 'Settings',
    seo: 'SEO',
    logs: 'Logs',

    // Header
    search: 'Search...',
    notifications: 'Notifications',
    myAccount: 'My Account',
    profile: 'Profile',
    logout: 'Logout',
    adminPanel: 'Admin Panel',

    // Umumiy
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    loading: 'Loading...',
    noData: 'No data',
    confirm: 'Confirm',
    saving: 'Saving...',
    creating: 'Creating...',
    updating: 'Updating...',
    yes: 'Yes',
    no: 'No',
    all: 'All',

    // Auth
    login: 'Sign In',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    loginButton: 'Sign In',
    welcomeBack: 'Welcome back',
    loginSubtitle: 'Enter your credentials to access the admin panel',

    // Login sahifasi
    loginPageSubtitle: 'The most modern real estate management system in Uzbekistan.',
    manageRealEstate: 'Manage your real estate',
    totalObjects: 'Total objects',
    premium: 'Premium',
    modernResidential: 'Modern residential complexes',
    help: 'Help',
    contact: 'Contact',
    uzbekistan: 'Uzbekistan',

    // Dashboard
    dashboardWelcome: 'Welcome',
    dashboardSubtitle: 'Here is the general statistics',
    propertyList: 'Properties',
    projects: 'Projects',
    allProperties: 'All properties',
    searchProperties: 'Search properties...',
    noPropertySelected: 'No property selected',
    selectProperty: 'Select a property',
    editProperty: 'Edit',
    deleteProperty: 'Delete',
    viewProperty: 'View',
    deleteConfirm: 'Confirm deletion',
    rooms: 'rooms',
    totalViews: 'Total Views',
    savedFavorites: 'Saved / Favorites',
    inquiries: 'Inquiries',
    scheduledViewings: 'Scheduled Viewings',
    conversionFunnel: 'Conversion Funnel',
    conversionFunnelSubtitle: "Tracking the buyer's journey",
    views: 'Views',
    clicks: 'Clicks',

    // Admins
    adminsTitle: 'Admins',
    adminsSubtitle: 'System administrators and roles',
    newAdmin: 'New admin',
    editAdmin: 'Edit admin',
    adminInfo: 'Admin information',
    adminCount: 'admins',
    roleAndStatus: 'Role and status',
    permissions: 'Permissions',
    allPermissions: 'All permissions',
    permissionsCount: 'permissions',
    role: 'Role',
    roleRequired: 'Role is required',
    selectRole: 'Select role',
    activeStatus: 'Active status',
    activeStatusDesc: 'Admin can log in to the system',
    adminActive: 'Active',
    adminInactive: 'Inactive',
    adminCreated: 'Admin created',
    adminUpdated: 'Admin saved',
    adminDeleted: 'Admin deleted',
    adminDeleteConfirm: 'Delete this admin?',
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    nameMin: 'Minimum 2 characters',
    emailInvalid: 'Invalid email format',
    passwordMin: 'Minimum 6 characters',
    searchAdmin: 'Name or email...',
    filters: 'Filters',
    resetFilters: 'Reset',
    totalAdmins: 'Total admins',
    superAdmin: 'Super admin',
    contentManager: 'Content manager',
    manager: 'Manager',

    // Promotions
    promotionsTitle: 'Promotions',
    promotionsSubtitle: 'Discounts and special offers',
    newPromotion: 'New promotion',
    editPromotion: 'Edit promotion',
    promotionName: 'Name',
    promotionDescription: 'Description',
    promotionDiscount: 'Discount',
    promotionStartDate: 'Start date',
    promotionEndDate: 'End date',
    promotionStatus: 'Status',
    promotionActive: 'Active',
    promotionInactive: 'Inactive',
    promotionHidden: 'Hidden',
    promotionCreated: 'Promotion created',
    promotionUpdated: 'Promotion saved',
    promotionDeleted: 'Promotion deleted',
    promotionDeleteConfirm: 'Delete this promotion?',
    searchPromotion: 'Promotion name...',
    totalPromotions: 'Total promotions',
    propertiesCount: 'properties',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    createdAt: 'Created at',
    actions: 'Actions',
    show: 'Show',
    hide: 'Hide',

    // Properties
    propertiesTitle: 'Properties',
    totalProperties: 'Total properties:',
    newProperty: 'New property',
    newPropertySubtitle: 'Enter new property data',
    propertyCreated: 'Property created',
    propertyUpdated: 'Property saved',
    propertyDeleted: 'Property deleted',
    propertyDuplicated: 'Copy created',
    image: 'Image',
    propertyName: 'Name',
    type: 'Type',
    address: 'Address',
    price: 'Price',
    status: 'Status',
    available: 'Available',
    booked: 'Booked',
    sold: 'Sold',
    typeApartment: 'Apartment',
    typeStudio: 'Studio',
    typeHouse: 'House',
    typeOffice: 'Office',
    typeShop: 'Shop',
    typeParking: 'Parking',
    typeGarage: 'Garage',
    typeStorage: 'Storage',
    propertyBasicInfo: 'Basic information',
    complexOptional: 'Complex (optional)',
    selectComplex: 'Select complex',
    noneOption: '— None —',
    apartmentNumber: 'Apartment number',
    roomsAndFloor: 'Rooms and floor',
    area: 'Area',
    floor: 'Floor',
    floorsTotal: 'Total floors',
    priceAmount: 'Price',
    pricePerM2: 'Price per m²',
    oldPrice: 'Old price',
    discount: 'Discount',
    statusAndAddress: 'Status and address',
    description: 'Description',
    images: 'Images',
    features: 'Features',
    featuresPlaceholder: 'Balcony, Elevator, ...',
    advantages: 'Advantages',
    advantagesPlaceholder: 'Near metro, New building, ...',
    publishedLabel: 'Publish on site',
    publishedHint: 'Property is visible to users',
    duplicate: 'Duplicate',
    view: 'View',

    // Statuslar
    statusAvailable: 'Available',
    statusBooked: 'Booked',
    statusSold: 'Sold',
    statusNew: 'New',
    statusInWork: 'In progress',
    statusDone: 'Done',
    statusClosed: 'Closed',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    statusHidden: 'Hidden',

    // Vaqt
    timeNow: 'just now',
    timeMinutesAgo: '{n}m ago',
    timeHoursAgo: '{n}h ago',
    timeDaysAgo: '{n}d ago',

    // Property turlari
    propertyTypeApartment: 'Apartment',
    propertyTypeStudio: 'Studio',
    propertyTypeHouse: 'House',
    propertyTypeOffice: 'Office',
    propertyTypeShop: 'Shop',
    propertyTypeParking: 'Parking',
    propertyTypeGarage: 'Garage',
    propertyTypeStorage: 'Storage',

    // Dashboard komponentlari
    recentApplications: 'Recent applications',
    viewAll: 'View all',
    noApplications: 'No applications',

    // Complexes
    complexesTitle: 'Residential Complexes',
    complexesSubtitle: 'Manage residential complexes',
    newComplex: 'New complex',
    newComplexSubtitle: 'Enter new complex data',
    complexCreated: 'Complex created',
    complexUpdated: 'Complex saved',
    complexDeleted: 'Complex deleted',
    complexDeleteConfirm: 'Delete this complex?',
    searchComplex: 'Complex name...',
    complexName: 'Name',
    district: 'District',
    builder: 'Builder',
    completionYear: 'Completion',
    statusBuilding: 'Under construction',
    statusCompleted: 'Completed',
    statusPlanned: 'Planned',
    hideFromSite: 'Hide from site',
    showOnSite: 'Show on site',
    published: 'Published',
    hidden: 'Hidden',
    complexBasicInfo: 'Basic information',
    complexConstruction: 'Construction information',
    buildings: 'Buildings',
    floors: 'Floors',
    minPrice: 'Min price',
    maxPrice: 'Max price',
    infrastructure: 'Infrastructure',
    infrastructurePlaceholder: 'School, Kindergarten, ...',
    imageHint: 'Upload at least 1 image',
    imageRequired: 'At least 1 image required',

    // Users (YANGI)
    usersTitle: 'Users',
    totalUsers: 'Total users:',
    searchUser: 'Search users...',
    user: 'User',
    phone: 'Phone',
    favorites: 'Favorites',
    registeredAt: 'Registered at',
    unblock: 'Unblock',
    block: 'Block',
    userBlocked: 'User blocked',
    userUnblocked: 'User unblocked',
    userDeleted: 'User deleted',
    userDeleteConfirm: 'Delete this user?',
    userToday: 'New today',
    userId: 'User ID',
    noFavorites: 'No favorite properties',
    noViews: 'No views',
    errorOccurred: 'An error occurred',

    active: 'Active',
    blocked: 'Blocked',

    // Applications
    applicationsTitle: 'Applications',
    applicationsSubtitle: 'Applications from clients',
    searchApplication: 'Name, phone or email...',
    applicationsLoadFailed: 'Failed to load applications',
    statusChanged: 'Status changed',
    applicationDeleteConfirm: 'Delete this application?',
    applicationDeleted: 'Application deleted',
    applicationsBulkDeleteConfirm: 'applications to delete?',
    applicationsDeleted: 'applications deleted',
    csvDownloaded: 'CSV downloaded',
    exportError: 'Export error',
    exportCSV: 'Export CSV',
    exporting: 'Loading...',
    clear: 'Clear',
    clearFilters: 'Clear filters',
    sorting: 'Sorting',
    date: 'Date',
    selected: 'selected',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    first: 'First',
    last: 'Last',
    applicationsNotFound: 'No applications found',
    noResultsByFilter: 'No results by filter',
    noApplicationsYet: 'No applications yet',
    client: 'Client',
    source: 'Source',
    message: 'Message',
    timeline: 'Timeline',
    applicationCreated: 'Application created',
    lastUpdated: 'Last updated',
    currentStatus: 'Current status',
    close: 'Close',
    copyId: 'Copy ID',
    changeStatus: 'Change status',
    anonymousClient: 'Anonymous client',
    applicationDetails: 'Application details',
    viewDetails: 'View details',
    total: 'Total',
    today: 'Today',
    application: 'Application',
    property: 'Property',
    // Reviews
    reviewsTitle: 'Reviews',
    reviewsSubtitle: 'Customer reviews and ratings',
    searchReview: 'Name or review text...',
    reviewsLoadFailed: 'Failed to load reviews',
    reviewPublished: 'Review published',
    reviewUnpublished: 'Review hidden',
    reviewDeleted: 'Review deleted',
    reviewDeleteConfirm: 'Delete this review?',
    reviewsNotFound: 'No reviews found',
    reviewsTotal: 'Total reviews',
    reviewsAvgRating: 'Average rating',

    pending: 'Pending',
    publish: 'Publish',

    review: 'Review',
    rating: 'Rating',

    // Reyting yorliqlari
    ratingExcellent: 'Excellent',
    ratingGood: 'Good',
    ratingAverage: 'Average',
    ratingBad: 'Bad',
    ratingVeryBad: 'Very bad',


    // Employees
    employeesTitle: 'Employees',
    employeesSubtitle: 'Company employees and managers',
    newEmployee: 'New employee',
    newEmployeeSubtitle: 'Enter new employee data',
    searchEmployee: 'Name or position...',
    employeesLoadFailed: 'Failed to load employees',
    employeeCreated: 'Employee created',
    employeeUpdated: 'Employee saved',
    employeeDeleted: 'Employee deleted',
    employeeDeleteConfirm: 'Delete this employee?',
    employeeNotFound: 'Employee not found',
    employeesNotFound: 'No employees found',
    employeeHidden: 'Employee hidden',
    employeeShown: 'Employee shown',
    position: 'Position',
    positionPlaceholder: 'General manager',
    fullName: 'Full name',
    namePlaceholder: 'Sardor Rahimov',
    descriptionPlaceholder: 'Real estate specialist...',
    order: 'Order',
    orderNumber: 'Order number',
    orderHint: 'Smaller number appears first',
    orderAndStatus: 'Order and status',
    basicInfo: 'Basic information',
    photo: 'Photo',
    uploadPhoto: 'Upload photo',
    uploading: 'Uploading...',
    photoUploaded: 'Photo uploaded',
    photoUploadFailed: 'Photo upload failed',
    photoHint: 'PNG, JPG · Maximum 10MB',
    saveEmployeeFirst: 'Save the employee first, then upload a photo',

    showOnSiteDesc: 'Employee is visible on the site',
    name: 'Name',


    // Settings
    settingsTitle: 'Settings',
    settingsSubtitle: 'General site settings and configuration',
    admin: 'Admin',
    settingsLoadFailed: 'Failed to load settings',
    settingsSaved: 'Settings saved',
    settingsResetConfirm: 'Cancel all changes?',
    settingsResetDone: 'Changes cancelled',
    settingsExported: 'Settings exported',
    searchSettings: 'Search settings...',
    changesCount: 'changes',
    unsavedChanges: 'unsaved changes',
    allChangesSaved: 'All changes saved',
    settingsCount: 'settings',
    logoPreview: 'Logo preview',
    noResultsFound: 'no results found',
    export: 'Export',

    // Groups
    settingsGroupGeneral: 'General',
    settingsGroupGeneralDesc: 'Site name, description and logo',
    settingsGroupContacts: 'Contacts',
    settingsGroupContactsDesc: 'Phone, email, address',
    settingsGroupDisplay: 'Display',
    settingsGroupDisplayDesc: 'Page display settings',
    settingsGroupSocial: 'Social Media',
    settingsGroupSocialDesc: 'Telegram, Instagram, Facebook',

    // Setting labels
    settingSiteName: 'Site name',
    settingSiteNamePlaceholder: 'Etagi',
    settingSiteNameHint: 'Site name (title and logo)',
    settingSiteDescription: 'Site description',
    settingSiteDescriptionPlaceholder: 'The best real estate site in Uzbekistan',
    settingSiteDescriptionHint: 'Short description (for SEO)',
    settingLogo: 'Logo',
    settingLogoPlaceholder: '/images/logo.svg',
    settingLogoHint: 'Logo URL',
    settingPhonePlaceholder: '+998 71 200 00 00',
    settingPhoneHint: 'Main phone number',
    settingEmailPlaceholder: 'info@etagi.ru',
    settingEmailHint: 'Email address',
    settingAddress: 'Address',
    settingAddressPlaceholder: 'Tashkent, Amir Temur street 108',
    settingAddressHint: 'Office address',
    settingWorkingHours: 'Working hours',
    settingWorkingHoursPlaceholder: 'Mon-Sat: 9:00 - 19:00',
    settingWorkingHoursHint: 'Working hours',
    settingTelegram: 'Telegram',
    settingTelegramPlaceholder: 'https://t.me/etagi_uz',
    settingTelegramHint: 'Telegram channel or bot',
    settingInstagram: 'Instagram',
    settingInstagramPlaceholder: 'https://instagram.com/etagi_uz',
    settingInstagramHint: 'Instagram page',
    settingWhatsapp: 'WhatsApp',
    settingWhatsappPlaceholder: 'https://wa.me/998712000000',
    settingWhatsappHint: 'WhatsApp number (in wa.me format)',
    settingYoutube: 'YouTube',
    settingYoutubePlaceholder: 'https://youtube.com/@etagi_uz',
    settingYoutubeHint: 'YouTube channel',
    settingFacebook: 'Facebook',
    settingFacebookPlaceholder: 'https://facebook.com/etagi_uz',
    settingFacebookHint: 'Facebook page',
    settingObjectsPerPage: 'Objects per page',
    settingObjectsPerPagePlaceholder: '12',
    settingObjectsPerPageHint: 'How many objects to show per page',
    settingMainCategories: 'Main categories',
    settingMainCategoriesPlaceholder: 'new,house,com',
    settingMainCategoriesHint: 'Main categories (comma separated)',
    settingCurrency: 'Currency',
    settingCurrencyPlaceholder: 'USD',
    settingCurrencyHint: 'Currency (USD, UZS, RUB)',
    settingLanguage: 'Language',
    settingLanguagePlaceholder: 'uz',
    settingLanguageHint: 'Site language (uz, ru, en)',

    // SEO
    seoTitle: 'SEO',
    seoSubtitle: 'Page SEO information',
    seoLoadFailed: 'Failed to load SEO data',
    seoSaved: 'SEO saved',
    seoData: 'SEO information',
    seoTitlePlaceholder: 'Page title',
    seoDescriptionPlaceholder: 'Page description',
    seoKeywordsPlaceholder: 'real estate, apartment, ...',
    seoKeywordsHint: 'Separate with commas',
    seoOpenGraph: 'Open Graph (for social media)',
    seoOgTitlePlaceholder: 'Title shown in social media',
    seoOgDescriptionPlaceholder: 'Description shown in social media',
    seoGooglePreview: 'Google preview',

    // SEO pages
    seoPageHome: 'Home',
    seoPageNovostroyki: 'New buildings',
    seoPageStroitelstvo: 'Construction',
    seoPageCommercial: 'Commercial',
    seoPageProject: 'Projects',
    // Logs
    logsTitle: 'Logs',
    logsSubtitle: 'Admin activity log',
    logsLoadFailed: 'Failed to load logs',
    logsNotFound: 'No log entries found',
    searchLog: 'Details or admin name...',
    refresh: 'Refresh',

    clearing: 'Clearing...',
    clearLogsTitle: 'Clear old logs',
    clearLogsDesc: 'Log entries older than the specified days will be deleted',
    days: 'days',
    action: 'Action',
    entity: 'Entity',
    details: 'Details',

    thisWeek: 'This week',
    thisMonth: 'This month',
    complex: 'Complex',
    promotion: 'Promotion',
    employee: 'Employee',
    setting: 'Setting',


    // Action labels
    logActionLogin: 'Login',
    logActionLogout: 'Logout',
    logActionCreate: 'Create',
    logActionUpdate: 'Update',
    logActionDelete: 'Delete',
    logActionUpload: 'Upload',

    // Entity labels
    logEntityAdmin: 'Admin',
    // Admins detail
    roleSuperAdminDesc: 'Has all permissions',
    roleContentManagerDesc: 'Content management',
    roleManagerDesc: 'Working with applications',
    allPermissionsDesc: 'Full access to all system functions',
    // Dashboard
    quickActions: 'Quick actions',
    performance: 'Performance',
    responseTime: 'Response time',
    conversion: 'Conversion',
    recentLeads: 'Recent leads',
    recentActivity: 'Recent activity',
    allChannels: 'All channels',

    minutes: 'min',
    pieces: 'pcs',
    activityViewed: 'Viewed property',
    activityFavorited: 'Added to favorites',
    activityInquiry: 'Sent inquiry',
    funnelNoteClicks: '−86.7% did not submit',
    funnelNoteInquiries: '−4.3% failed verification',
    funnelNoteScheduled: '−16.7% lost source attribution',
    imageNotUploaded: 'Image not uploaded',
    addImageHint: 'Add an image via editing',
    copyLink: 'Copy link',
    openInNewTab: 'Open in new tab',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    previousProperty: 'Previous property',
    nextProperty: 'Next property',
    // Notifications
    language: 'Language',
    newNotifications: 'new',
    noNotifications: 'No notifications',
    markAllRead: 'Mark all as read',
    clearAll: 'Clear all',


    // Profile
    profileTitle: 'Profile',
    profileSubtitle: 'Your personal account and settings',
    personalInfo: 'Personal information',
    profileUpdated: 'Profile updated',
    avatarUploaded: 'Avatar uploaded',
    fileTooLarge: 'File is too large (max 5MB)',
    security: 'Security',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    changePassword: 'Change password',
    passwordChanged: 'Password changed',
    passwordMismatch: 'Passwords do not match',
    currentPasswordWrong: 'Current password is incorrect',
    passwordTips: 'Password requirements:',
    passwordTip1: 'Minimum 6 characters',
    passwordTip2: 'Uppercase and lowercase letters',
    passwordTip3: 'Numbers and special characters',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    veryStrong: 'Very strong',
    theme: 'Theme',
    themeLight: 'Light',
    themeLightDesc: 'Always light theme',
    themeDark: 'Dark',
    themeDarkDesc: 'Always dark theme',
    themeSystem: 'System',
    themeSystemDesc: 'Same as system',
    notificationSettings: 'Notification settings',
    emailNotifications: 'Email notifications',
    emailNotificationsDesc: 'Receive notifications by email',
    pushNotifications: 'Push notifications',
    pushNotificationsDesc: 'Browser notifications',
    messageNotifications: 'Messages',
    messageNotificationsDesc: 'Notifications about new messages',
    recentActivityLog: 'Recent activity',
    avatarDeleteConfirm: 'Delete avatar?',
    avatarDeleted: 'Avatar deleted',
    noActivity: 'No activity',
    noDetails: 'No details',
    notificationsSubtitle: 'All notifications',
    propertyChartTitle: 'Statistics and dynamics',
    propertyChartBarTitle: 'Weekly Applications',
        // Property View & Insights
    back: 'Back',
    share: 'Share',
    linkCopied: 'Link copied',
    last30days: 'last 30 days',
    interestIndex: 'Interest Index',
    interestHigh: 'High demand',
    interestMedium: 'Medium demand',
    interestLow: 'Low demand',
    interestHint: 'Calculated based on the ratio of saves, inquiries, and views.',
    funnelTitle: 'Customer Journey',
    chartSubtitle: 'Indicators over the last days',
    dayShort: 'd',
    vsPrevPeriod: 'compared to previous period',
    average: 'Average',
    perDay: 'per day',
    bestDay: 'Best day',
    period: 'Period',
        // Entity labels (full)
    logEntityProperty: 'Property',
    logEntityComplex: 'Complex',
    logEntityUser: 'User',
    logEntityApplication: 'Application',
    logEntityPromotion: 'Promotion',
    logEntityReview: 'Review',
    logEntityEmployee: 'Employee',
    logEntitySetting: 'Setting',
    logEntitySeo: 'SEO',

    // Logs — UI (YANGI)
    live: 'Live',
    analysis: 'Analysis',
    clickToFilter: 'click to filter',
    viewMode: 'View',
    viewTable: 'Table',
    viewTimeline: 'Timeline',
    rangeAll: 'All time',
    range7d: '7 days',
    range30d: '30 days',
    byAction: 'By action',
    byEntity: 'By entity',
    topAdmins: 'Top admins',
    vsDailyAvg: 'vs daily avg',
    vsWeeklyAvg: 'vs weekly avg',
    rowsExported: 'rows exported',
    resetAll: 'Reset all',
    retry: 'Retry',
    yesterday: 'Yesterday',
    copy: 'Copy',
    copied: 'Copied',
    thisAdmin: 'This admin',
    perPage: 'Per page',
    pageShort: 'pg.',
    seoConfigured: 'Configured pages',
seoAvgScore: 'Average SEO score',
seoProblems: 'Problems',
seoDuplicates: 'Duplicates',
seoNotConfigured: 'Not configured',
seoFixErrors: 'Check the fields',
seoResetConfirm: 'SEO data for this page will be deleted. Continue?',
seoDeleted: 'SEO deleted',
exportJson: 'JSON export',
revert: 'Revert',
saveAll: 'Save all',
unsavedPages: 'pages with unsaved changes',
allSaved: 'All saved',
seoHeadCode: '<head> code',
seoSyncOg: 'Fill from Title and Description',
pagesSaved: 'pages saved',
pagesSkipped: 'pages with errors — skipped',
  },
};

// ============================================================
// HOOK — useTranslation
// ============================================================
import { useLanguageStore } from '@/store/language';

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const t = translations[language];

  return { t, language };
}