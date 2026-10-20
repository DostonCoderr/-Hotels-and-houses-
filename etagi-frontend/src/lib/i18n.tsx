'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'ru' | 'en' | 'uz';

const TRANSLATIONS = {
    ru: {
        nav_novostroyki: 'Новостройки',
        nav_stroitelstvo: 'Строительство домов',
        nav_commercial: 'Коммерческая',
        nav_consult: 'Консультация',

        // Hero
        hero_badge: 'Найдите больше, чем дом',
        hero_title: 'Найдите своё место для жизни',
        hero_sub: 'Отобранные новостройки, дома и коммерческая недвижимость. Прозрачные цены и сопровождение сделки.',
        hero_btn_view: 'Смотреть новостройки',
        hero_btn_video: 'Смотреть видео',
        hero_card_exclusive: 'ЭКСКЛЮЗИВНОЕ ПРЕДЛОЖЕНИЕ',
        hero_card_title: 'Квартал Метроном',
        hero_card_addr: 'Москва, ул. Тагильская',
        hero_card_studio: 'Студия',
        hero_card_date: '4 кв. 2026',
        hero_card_btn: 'Смотреть объект',

        // Featured
        featured_sub: 'Подборка',
        featured_title: 'Выдающиеся объекты',
        featured_desc: 'Необыкновенный образ жизни',
        featured_btn_map: 'На карте',
        featured_btn_all: 'Показать все',

        // Ad Banner
        ad_sale: 'Специальное предложение',
        ad_sale_desc: 'Скидка до 1 200 000 ₽ на новостройки бизнес-класса',
        ad_sale_btn: 'Получить скидку →',

        // Consult
        consult_title: 'Консультируем бесплатно',
        consult_desc: 'Оставьте заявку на консультацию или позвоните нам по телефону',
        consult_name: 'Ваше имя',
        consult_phone: '+7',
        consult_btn: 'Получить консультацию',
        consult_agree: 'Нажимая кнопку, вы даете согласие на обработку персональных данных',

        // Features
        ft_1: 'Проверенные объекты',
        ft_1_desc: 'Каждый объект проходит юридическую проверку.',
        ft_2: 'Выбор под ваш образ жизни',
        ft_2_desc: 'Новостройки, дома и коммерция на одной карте.',
        ft_3: 'Ипотека от 6%',
        ft_3_desc: 'Подберем программу и подадим заявку в банки.',
        ft_4: 'Строительство под ключ',
        ft_4_desc: 'Проект, смета и стройка дома с гарантией.',

        // Map
        map_sub: 'Карта',
        map_title: 'Объекты на карте',
        map_hint: 'Нажмите на объект справа',

        // Journal
        journal_title: 'Этажи Журнал',
        journal_btn: 'Перейти в журнал',

        // Mortgage
        mort_title: 'Ипотечные программы',
        mort_btn: 'Рассчитать',

        // ✅ HEADER MENU (RU)
        nav_zhk: 'Жилые комплексы',
        nav_1room: 'Однокомнатные квартиры',
        nav_2room: 'Двухкомнатные квартиры',
        nav_3room: 'Трехкомнатные квартиры',
        nav_4room: 'Многокомнатные квартиры',
        nav_studio: 'Студии',
        nav_builders: 'Застройщики',
        nav_2025: 'Новостройки 2025 год',
        nav_2026: 'Новостройки 2026 год',
        nav_2027: 'Новостройки 2027 год',
        nav_2028: 'Новостройки 2028 год',
        nav_2029: 'Новостройки 2029 год',
        nav_completed: 'Сданные ЖК',
        nav_center: 'Новостройки в центре',
        nav_commercial_nb: 'Коммерческие новостройки',
        nav_promo: 'Акции и скидки от застройщиков',
        nav_family_mort: 'Успей купить по семейной ипотеке – 6%',
        nav_installment: 'Возможна рассрочка',
        nav_about_buy: 'О покупке новостройки',
        nav_projects: 'Проекты домов',
        nav_barn: 'Барнхаусы',
        nav_module: 'Модульные дома',
        nav_frame: 'Каркасные дома',
        nav_brick: 'Кирпичные дома',
        nav_builders_comp: 'Строительные компании',
        nav_ready_homes: 'Готовые дома',
        nav_land: 'Земельные участки',
        nav_calc: 'Калькулятор стройки',
        nav_sale: 'Продажа',
        nav_rent: 'Аренда',
        nav_rented: 'С арендатором (ГАБ)',
        nav_trade: 'Торговое помещение',
        nav_free: 'Свободное назначение',
        nav_office: 'Офис',
        nav_warehouse: 'База / Склад / Производство',
        nav_land_c: 'Земельные участки',
        nav_new_c: 'Коммерческие новостройки',
        nav_gp: 'Готовый бизнес',
        nav_garage: 'Гаражи',
        nav_parking: 'Машиноместа в паркингах',
        nav_storage: 'Кладовые',

        hero_eb: 'Найдите больше, чем дом',
        hero_title_line1: 'Найдите своё',
        hero_title_line2: 'место',
        hero_title_line3: 'для жизни',


        search_tab_buy: 'Покупка',
        search_tab_rent: 'Аренда',
        search_tab_sell: 'Продать',
        search_tab_let: 'Сдать',
        search_tab_mort: 'Оформить ипотеку',
        search_all_types: 'Квартиры во вторичке и новостройке',
        search_type_new: 'Новостройки',
        search_type_house: 'Дома и участки',
        search_type_com: 'Коммерческая',
        search_rooms: 'Комнатность',
        search_studio: 'Студия',
        search_1room: '1 комната',
        search_2room: '2 комнаты',
        search_3room: '3 и более',
        search_price: 'Стоимость, ₽',
        search_price_a: 'до 15 млн',
        search_price_b: '15–30 млн',
        search_price_c: 'от 30 млн',
        search_area: 'Площадь, м²',
        search_area_a: 'до 40',
        search_area_b: '40–80',
        search_area_c: 'от 80',
        search_placeholder: 'Город, адрес, метро, район, ЖК, застройщик',
        search_more_filters: 'Еще фильтры',
        search_btn: 'Найти',
        search_cat_apartments: 'Квартиры',
        search_cat_new: 'Новостройки',
        search_cat_houses: 'Дома и участки',
        search_cat_cottages: 'Коттеджные поселки',
        search_cat_commercial: 'Коммерческая',
        search_cat_construction: 'Строительство домов',
        search_cat_garages: 'Гаражи',

        // --- AD BANNER ---
        ad_1_eb: 'Специальное предложение',
        ad_1_title: 'Скидка до 1 200 000 ₽ на новостройки бизнес-класса',
        ad_1_desc: 'Только до 31 декабря 2026. Ипотека от 2% для семей с детьми.',
        ad_1_btn: 'Получить скидку →',

        ad_2_eb: 'Новинка',
        ad_2_title: 'Квартиры с террасой',
        ad_2_desc: 'Только в новых ЖК. Панорамные виды и уникальные планировки.',
        ad_2_btn: 'Смотреть проекты →',

        ad_3_eb: 'Спецпредложение',
        ad_3_title: 'Trade-in недвижимости',
        ad_3_desc: 'Обменяйте старую квартиру на новую с минимальной доплатой.',
        ad_3_btn: 'Узнать больше →',

        ad_4_eb: 'Ипотека',
        ad_4_title: 'Семейная ипотека 6%',
        ad_4_desc: 'Государственная поддержка семей с детьми. Оформите онлайн.',
        ad_4_btn: 'Рассчитать →',

        // --- FEATURED SLIDER ---
        feat_sub: 'Подборка',
        feat_title: 'Выдающиеся объекты',
        feat_desc: 'Необыкновенный образ жизни',
        feat_btn_map: 'На карте',
        feat_btn_all: 'Показать все',

        // --- SWIPER SECTION ---
        swipe_sub: 'Рекомендуем',
        swipe_title: 'Свайпните',
        swipe_title_arrow: 'в сторону →',
        swipe_desc: 'Лучшее за эту неделю',
        swipe_btn_all: 'Показать все',


        // --- MAP SECTION ---

        map_btn_all: 'Показать все',

        // --- QUICK SEARCH ---
        quick_title: 'Быстрый поиск',
        quick_cat_apartments: 'Квартиры',
        quick_cat_new: 'Новостройки',
        quick_cat_houses: 'Дома и участки',
        quick_cat_projects: 'Проекты домов',
        quick_cat_commercial: 'Коммерческая',
        quick_cat_garages: 'Гаражи',

        // Quick tags
        quick_tag_1: 'Дом не старше 10 лет',
        quick_tag_2: 'С большой кухней',
        quick_tag_3: 'Год постройки от 2021',
        quick_tag_4: 'Панорамные окна',
        quick_tag_5: 'Сдача в 2026',
        quick_tag_6: 'С отделкой',
        quick_tag_7: 'Рядом с метро',
        quick_tag_8: 'Ипотека от 6%',
        quick_tag_9: 'У воды',
        quick_tag_10: 'С баней',
        quick_tag_11: 'В лесу',
        quick_tag_12: 'Рядом с Москвой',
        quick_tag_13: 'Одноэтажные',
        quick_tag_14: 'С мансардой',
        quick_tag_15: 'Из газобетона',
        quick_tag_16: 'До 150 м²',
        quick_tag_17: 'Офисы в центре',
        quick_tag_18: 'Первая линия',
        quick_tag_19: 'Склады',
        quick_tag_20: 'Свободное назначение',
        quick_tag_21: 'Машино-место',
        quick_tag_22: 'Подземный паркинг',
        quick_tag_23: 'Бокс',
        quick_tag_24: 'С электричеством',

        // --- NEW SECTION ---
        new_title: 'Начните свой путь с Этажи',
        new_sub: 'Оставьте заявку прямо сейчас и получите бесплатную консультацию по выбору недвижимости.',
        new_btn: 'Получить консультацию',

        // --- TEAM SECTION ---
        team_sub: 'Эксперты',
        team_title: 'Наша',
        team_title_highlight: 'команда',

        // --- TOASTS (xabarlar) ---
        toast_phone_error: 'Введите номер телефона полностью',
        toast_success: 'Заявка отправлена. Мы скоро перезвоним',


        // --- FOOTER ---
        footer_desc: 'Федеральная компания по недвижимости. Работаем с 2008 года. Более 200 офисов в России и Казахстане.',
        footer_col_realty: 'Недвижимость',
        footer_link_novostroyki: 'Новостройки',
        footer_link_houses: 'Дома и участки',
        footer_link_commercial: 'Коммерческая',
        footer_link_cottages: 'Коттеджные посёлки',
        footer_link_garages: 'Гаражи и паркинг',

        footer_col_services: 'Услуги',
        footer_link_mortgage: 'Ипотека от 6%',
        footer_link_valuation: 'Оценка недвижимости',
        footer_link_legal: 'Юридическое сопровождение',
        footer_link_construction: 'Строительство домов',
        footer_link_design: 'Дизайн и ремонт',

        footer_col_company: 'Компания',
        footer_link_about: 'О нас',
        footer_link_team: 'Команда',
        footer_link_careers: 'Вакансии',
        footer_link_reviews: 'Отзывы',
        footer_link_contacts: 'Контакты',

        footer_col_contacts: 'Контакты',
        footer_address: 'Москва, Пресненская наб., 12',
        footer_hours: 'Ежедневно 9:00 – 21:00',

        footer_copyright: '© 2008–2026 «Этажи». Все права защищены.',
        footer_privacy: 'Политика конфиденциальности',
        footer_offer: 'Договор оферты',
        footer_sitemap: 'Карта сайта',


        // --- CONSULT MODAL ---
        modal_consult_title: 'Бесплатная консультация',
        modal_consult_desc: 'Заполните форму, и мы свяжемся с вами в течение 15 минут.',
        modal_name: 'Ваше имя',
        modal_phone: '+998 (__) ___-__-__',
        modal_message: 'Ваш вопрос (необязательно)',
        modal_cancel: 'Отмена',
        modal_submit: 'Отправить',
        modal_sending: 'Отправка...',

        // --- AUTH BLOCK ---
        auth_login: 'Войти',
        auth_profile: 'Профиль и избранное',
        auth_logout: 'Выйти',

        // --- MOBILE MENU ---
        mobile_menu_sub: 'Меню',
        mobile_menu_novostroyki: 'Новостройки',
        mobile_menu_stroitelstvo: 'Строительство домов',
        mobile_menu_commercial: 'Коммерческая',
        mobile_menu_home: 'Главная',
        mobile_menu_consult: 'Консультация',

        // --- TOASTS ---
        toast_name_error: 'Введите ваше имя',
        toast_consult_success: 'Заявка на консультацию отправлена!',
        toast_error: 'Ошибка при отправке. Попробуйте позже.',


        map_tooltip_details: 'Подробнее',
        map_hover_hint: 'Наведите на маркер — покажем объект',
        card_badge_new: 'Новостройка',
        card_compare: 'Сравнить',
        card_metro: 'м.',
        card_on_map: 'На карте',
        card_details: 'Подробнее',
        toast_login_required: 'Войдите, чтобы добавить в избранное',
        toast_fav_added: 'Добавлено в избранное',
        toast_fav_removed: 'Удалено из избранного',

        // ===== NOVOSTROYKA DETAIL (CONTENT) =====
        nzd_reviews_count: '1 отзыв',
        nzd_price_from: 'от',
        nzd_per_m2: 'за м²',
        nzd_mort_from: 'В ипотеку от 16%',
        nzd_calc_payment: 'Рассчитать платеж',
        nzd_toast_scroll_mort: 'Прокрутка к ипотеке',
        nzd_on_map: 'На карте',
        nzd_open_on_map: 'Открыть на карте →',
        nzd_metro_badge: 'М',
        nzd_metro_time: '8 мин. (0.6 км)',
        nzd_spec_wall: 'Материал стен:',
        nzd_spec_builder: 'Застройщик:',
        nzd_spec_class: 'Класс жилья:',
        nzd_spec_deadline: 'Сдача:',

        nzd_choose_flat: 'Выбрать квартиру',
        nzd_rooms_label: 'Комнатность',
        nzd_room_all: 'Все',
        nzd_room_studio: 'Студия',
        nzd_room_1: '1',
        nzd_room_2: '2',
        nzd_room_3: '3',
        nzd_room_4plus: '4+',
        nzd_price_label: 'Стоимость, ₽',
        nzd_area_label: 'Площадь, м²',
        nzd_from: 'от',
        nzd_to: 'до',
        nzd_finish_opt: 'Отделка / ремонт',
        nzd_deadline_opt: 'Срок сдачи',
        nzd_more_filters: 'Еще фильтры',
        nzd_clear: 'Очистить',
        nzd_show_offers: 'Показать',
        nzd_offers_word: 'предложения',
        nzd_m2_short: 'м²',
        nzd_floor: 'этаж',
        nzd_ready_short: 'сдача',

        nzd_features_title: 'Особенности дома',
        nzd_feat_house: 'Дом',
        nzd_feat_complex: 'Комплекс',
        nzd_tab_genplan: 'Генплан',
        nzd_tab_panorama: 'Панорама',
        nzd_show_all: 'Показать все',
        nzd_desc_title: 'Описание',
        nzd_collapse: 'Свернуть',
        nzd_show_more: 'Показать больше',
        nzd_video_title: 'Видео',
        nzd_progress_title: 'Ход строительства',
        nzd_progress_filter1: '1 квартал, Метроном',
        nzd_progress_filter2: '1 кв. 2024',

        // ===== NOVOSTROYKA DETAIL (EXTRA) =====
        nzd_banner_title: 'Второй шанс не упускают',
        nzd_banner_sub: 'Ставка 6% на новостройки',
        nzd_banner_btn1: 'Заполнить анкету',
        nzd_banner_btn2: 'Подробнее',

        nzd_pay_title: 'Способы оплаты',
        nzd_tab_mortgage: 'Ипотека',
        nzd_tab_installment: 'Рассрочка',
        nzd_price_property: 'Стоимость недвижимости',
        nzd_down_payment: 'Первоначальный взнос',
        nzd_rate: 'Ставка, %',
        nzd_term: 'Срок кредита',
        nzd_years: 'лет',
        nzd_subsidy: 'Субсидирует застройщик',
        nzd_monthly_payment: 'Платёж в месяц',
        nzd_overpay: 'Переплата',
        nzd_total: 'Всего',
        nzd_apply_mortgage: 'Оформить ипотеку',
        nzd_apply_installment: 'Оформить рассрочку',

        nzd_inst_term: 'Срок рассрочки',
        nzd_inst_term_val: 'до 36 месяцев',
        nzd_inst_down: 'Первоначальный взнос',
        nzd_inst_down_val: 'от 20%',
        nzd_inst_markup: 'Удорожание',
        nzd_inst_markup_val: '0%',
        nzd_inst_fee: 'Оформление',
        nzd_inst_fee_val: 'бесплатно',

        nzd_reviews_title: 'Отзывы',
        nzd_reviews_empty_title: 'Не найдено',
        nzd_reviews_empty_desc: 'Отзывов о ЖК пока нет, будьте первыми',
        nzd_leave_review: 'Оставить отзыв',
        nzd_declarations_title: 'Проектные декларации',
        nzd_declaration_1: 'Декларация 1',
        nzd_declaration_2: 'Декларация 2',

        nzd_disclaimer_1: '1. Сайт носит исключительно информационный характер. Указанная стоимость объектов может отличаться от реальной. Компания Этажи не является Застройщиком. Не является офертой согласно ст. 435, 427 ГК РФ.',
        nzd_disclaimer_2: '2. Реальное наличие вариантов и цен может отличаться.',
        nzd_disclaimer_3: '3. Информация о минимальной ставке по ипотеке может отличаться.',


        // ===== NOVOSTROYKA DETAIL (HERO & SIDEBAR) =====
        nzd_hero_badge_default: 'Жилой комплекс',
        nzd_hero_choose_flat: 'Выбрать квартиру',
        nzd_hero_callback: 'Перезвоните мне',
        nzd_hero_on_map: 'На карте',
        nzd_hero_fav: 'В избранное',
        nzd_hero_share: 'Поделиться',
        nzd_hero_price: 'Стоимость',
        nzd_hero_deadline: 'Срок сдачи',
        nzd_hero_builder: 'Застройщик',

        nzd_toast_link_copied: 'Ссылка скопирована',
        nzd_toast_phone_copied: 'Телефон скопирован!',
        nzd_toast_invalid_form: 'Введите корректное имя и телефон',
        nzd_toast_app_sent: 'Заявка отправлена! Наш менеджер свяжется с вами.',
        nzd_app_message_prefix: 'Запрос по объекту:',

        nzd_consult_default_name: 'Консультант по новостройкам',
        nzd_consult_default_role: 'Ответит за 15 минут',
        nzd_show_phone: 'Показать телефон',
        nzd_contact_me: 'Свяжитесь со мной',

        nzd_toast_login_view: 'Войдите, чтобы записаться на просмотр',
        nzd_scheduled_name: 'Запись на просмотр',
        nzd_scheduled_message: 'Клиент хочет записаться на просмотр:',
        nzd_toast_scheduled_ok: 'Вы записаны на просмотр!',
        nzd_toast_scheduled_error: 'Ошибка при записи',
        nzd_schedule_view: 'Записаться на просмотр',

        nzd_share: 'Поделиться',
        nzd_in_fav: 'В избранном',
        nzd_add_to_fav: 'В избранное',

        nzd_fact_consult: 'Бесплатная консультация',
        nzd_fact_booking: 'Бронирование онлайн',
        nzd_fact_discounts: 'Скидки от застройщика',

        nzd_modal_title: 'Свяжитесь со мной',
        nzd_modal_desc: 'Оставьте номер, и мы ответим на все вопросы по объекту.',
        nzd_modal_name: 'Ваше имя',
        nzd_modal_phone: '+998 (__) ___-__-__',
        nzd_modal_submit: 'Отправить',
        nzd_modal_sending: 'Отправка...',

        // ===== NOVOSTROYKA DETAIL (TABS) =====
        nzd_tab_about: 'О жилом комплексе',
        nzd_tab_flats: 'Выбор квартиры',
        nzd_tab_features: 'Особенности дома',
        nzd_tab_description: 'Описание',
        nzd_tab_progress: 'Ход строительства',

        // ===== PROJECT CARD (stroitelstvo) =====
        proj_price_from: 'от',
        proj_rooms_short: 'комн.',
        proj_m2_short: 'м²',
        proj_floor: 'этаж',
        proj_floor_suffix: 'а',
        proj_phone: 'Телефон',
        proj_details: 'Подробнее',
        proj_toast_compare_added: 'Добавлено к сравнению',
        proj_toast_phone: 'Телефон: +7 800 555-35-35',

        // ===== COMMERCIAL CARD & MAP =====
        cm_type_prefix: 'Тип:',
        cm_type_default: 'Коммерческая',
        cm_m2_short: 'м²',
        cm_floor_short: 'эт.',
        cm_metro_badge: 'М',
        cm_metro_default: 'Метро',
        cm_on_map: 'На карте',
        cm_show_phone: 'Показать телефон',
        cm_map_hint: 'Нажмите на маркер или карточку',

        // ===== 404 NOT FOUND =====
        nf_title: 'It looks you are LOST!',
        nf_back_home: 'Go back home',

        // ===== LOADING =====
        loading_brand: 'ЭТАЖИ',
        loading_text: 'Загрузка данных...',

        // ===== STROITELSTVO PAGE =====
        sd_hero_eyebrow: 'Загородное строительство',
        sd_hero_title_1: 'Проекты домов',
        sd_hero_title_em: 'под ключ',
        sd_hero_sub_1: 'Более',
        sd_hero_sub_2: 'проектов от проверенных строительных компаний. Фиксированная цена, гарантия 10 лет.',
        sd_hero_stat_projects: 'Проектов',
        sd_hero_stat_companies: 'Компаний',
        sd_hero_stat_years: 'Лет опыта',

        sd_bread_home: 'Главная',
        sd_bread_current: 'Строительство домов',

        sd_title: 'Проекты домов',
        sd_count_offers: 'предложений',
        sd_sort_popular: 'Сортировать: Популярные',
        sd_sort_price: 'По цене',

        sd_filter_all: 'Все проекты',
        sd_filter_projects: 'Проекты',
        sd_filter_barn: 'Барнхаусы',
        sd_filter_module: 'Модульные',
        sd_filter_frame: 'Каркасные',
        sd_filter_brick: 'Кирпичные',
        sd_filter_rooms: 'Комнатность',
        sd_filter_price: 'Стоимость',
        sd_filter_area: 'Площадь',
        sd_filter_material: 'Материал стен',
        sd_filter_search_placeholder: 'Поиск...',
        sd_filter_find: 'Найти',

        sd_promo1_title: 'ПВ = 0',
        sd_promo1_desc: 'Нет накоплений? Ипотека без первого взноса',
        sd_promo2_desc: 'Комиссия за подбор проекта',
        sd_promo3_title: 'Гарантия 10 лет',
        sd_promo3_desc: 'На все конструктивы дома',
        sd_promo4_title: 'Индивидуальный план',
        sd_promo4_desc: 'Разработаем проект под вас',

        sd_loading: 'Загрузка...',
        sd_not_found: 'По вашему запросу ничего не найдено',

        sd_consult_title: 'Консультация бесплатно',
        sd_consult_desc: 'Оставьте заявку — подберём проект под ваш участок и бюджет. Или звоните нам по телефону',
        sd_consult_feat1: 'Ответим за 15 минут',
        sd_consult_feat2: 'Подберём 3 варианта',
        sd_consult_feat3: 'Рассчитаем смету',
        sd_consult_name: 'Ваше имя',
        sd_consult_flag: 'RU',
        sd_consult_phone: '+7',
        sd_consult_btn: 'Получить консультацию',
        sd_consult_agree_1: 'Нажимая кнопку, вы даете согласие на обработку',
        sd_consult_agree_link: 'персональных данных',

        sd_seo_title: 'Заказать строительство дома под ключ',
        sd_seo_short: 'Заказать строительство домов под ключ в России можно через компанию Этажи. Мы работаем с проверенными строительными компаниями с 2008 года.',
        sd_seo_full: 'В нашем каталоге представлены проекты домов из различных материалов: каркасные, кирпичные, барнхаусы, модульные дома и дома из СИП-панелей. Каждый проект можно адаптировать под ваш участок и бюджет.',
        sd_seo_popular_cats: 'Популярные категории',
        sd_seo_popular_queries: 'Популярные запросы',
        sd_seo_q1: 'Дома до 1 млн ₽',
        sd_seo_q2: 'Дома с террасой',
        sd_seo_q3: 'Одноэтажные дома',
        sd_seo_q4: 'Дома с мансардой',
        sd_seo_show: 'Показать больше',
        sd_seo_hide: 'Скрыть',


        // ===== PROJECT DETAIL PAGE =====
        pd_bread_home: 'Главная',
        pd_bread_stroitelstvo: 'Строительство домов',
        pd_loading: 'Загрузка...',

        // TABS
        pd_tab_gallery: 'Галерея',
        pd_tab_chars: 'Характеристики',
        pd_tab_packages: 'Комплектации',
        pd_tab_company: 'О компании',
        pd_tab_mortgage: 'Ипотека',

        // HERO / TITLE
        pd_rooms: 'комната',
        pd_m2: 'м²',
        pd_floor: 'этаж',
        pd_m: 'м',
        pd_price_from: 'от',
        pd_price_note: 'Цена под ключ, без скрытых платежей',
        pd_badge_warranty: 'Гарантия 10 лет',
        pd_badge_term: 'Срок от 30 дней',
        pd_badge_mortgage: 'Ипотека от 6%',

        // QUICK STATS
        pd_stat_area: 'Площадь',
        pd_stat_floor: 'Этаж',
        pd_stat_term: 'Срок',
        pd_stat_term_val: 'Круглый год',
        pd_stat_rooms: 'Комнат',

        // CHARACTERISTICS
        pd_chars_title: 'Характеристики',
        pd_char_area: 'Площадь дома',
        pd_char_rooms: 'Количество комнат',
        pd_char_bathrooms: 'Количество санузлов',
        pd_char_kitchen: 'Площадь кухни-гостиной',
        pd_char_floors: 'Количество этажей',
        pd_char_terrace: 'Терраса',
        pd_char_wall_height: 'Высота стен',
        pd_char_foundation: 'Фундамент',
        pd_char_roof: 'Кровля',
        pd_char_material: 'Материал стен',
        pd_yes: 'Есть',
        pd_no: 'Нет',

        // PACKAGES
        pd_packages_title: 'Комплектации',
        pd_packages_desc: 'Выберите уровень готовности дома. Цена меняется в зависимости от комплектации.',

        // COMPANY
        pd_company_title: 'О строительной компании',
        pd_company_type: 'Строительная компания',
        pd_company_desc_empty: 'Описание компании отсутствует.',

        // MORTGAGE
        pd_mort_title: 'Рассчитайте ипотеку',
        pd_mort_desc: 'Можем рассчитать ипотеку без первоначального взноса, просто укажите 0%.',
        pd_mort_price: 'Стоимость недвижимости',
        pd_mort_down: 'Первоначальный взнос',
        pd_mort_monthly: 'Платёж в месяц',
        pd_mort_btn: 'Оформить ипотеку',

        // SIDEBAR
        pd_agent_name: 'Телегина Наталья',
        pd_agent_role: 'Эксперт по загородной недвижимости',
        pd_show_phone: 'Показать телефон',
        pd_get_consult: 'Получить консультацию',
        pd_side_fixed_price: 'Фиксированная цена',

        // SCHEDULE
        pd_toast_login_view: 'Войдите, чтобы записаться на просмотр',
        pd_scheduled_name: 'Запись на просмотр',
        pd_scheduled_message: 'Клиент хочет записаться на просмотр:',
        pd_toast_scheduled_ok: 'Вы записаны на просмотр!',
        pd_toast_scheduled_error: 'Ошибка при записи',
        pd_schedule_view: 'Записаться на просмотр',

        // MODAL
        pd_modal_title: 'Получить консультацию',
        pd_modal_desc: 'Оставьте номер — перезвоним за 15 минут',
        pd_modal_name: 'Ваше имя',
        pd_modal_phone: '+7 (___) ___-__-__',
        pd_modal_submit: 'Отправить',
        pd_modal_sending: 'Отправка...',
        pd_modal_agree_1: 'Нажимая кнопку, вы даете согласие на обработку',
        pd_modal_agree_link: 'персональных данных',

        // TOASTS
        pd_toast_invalid_form: 'Введите корректное имя и номер телефона',
        pd_toast_app_sent: 'Заявка отправлена! Менеджер свяжется с вами.',
        pd_app_message_prefix: 'Заявка на консультацию по проекту:',

        // ===== AUTH: LOGIN & REGISTER =====
        auth_login_title: 'Вход в Этажи',
        auth_login_sub: 'Войдите, чтобы сохранять избранное',
        auth_login_email: 'Электронная почта',
        auth_login_password: 'Пароль',
        auth_login_btn: 'Войти',
        auth_login_loading: 'Вход...',
        auth_login_btn_short: 'Войти',

        auth_register_title: 'Регистрация',
        auth_register_sub: 'Создайте аккаунт, чтобы сохранять избранное',
        auth_register_name: 'Ваше имя',
        auth_register_email: 'Электронная почта',
        auth_register_phone_optional: 'Телефон (необязательно)',
        auth_register_password_hint: 'Пароль (мин. 6 символов)',
        auth_register_btn: 'Зарегистрироваться',
        auth_register_loading: 'Регистрация...',
        auth_register_btn_short: 'Зарегистрироваться',

        auth_have_account: 'Уже есть аккаунт?',
        auth_no_account: 'Нет аккаунта?',

        auth_toast_fill_required: 'Заполните имя, email и пароль',
        auth_toast_fill_email_password: 'Введите email и пароль',
        auth_toast_password_short: 'Пароль должен быть не менее 6 символов',
        auth_toast_register_success: 'Регистрация успешна!',
        auth_toast_register_error: 'Ошибка регистрации',
        auth_toast_welcome: 'Добро пожаловать!',
        auth_toast_invalid_credentials: 'Неверный email или пароль',


        // ===== PROJECT DETAIL (static-data) =====
        pdp_tab_gallery: 'Галерея',
        pdp_tab_chars: 'Характеристики',
        pdp_tab_compl: 'Комплектации',
        pdp_tab_company: 'О компании',
        pdp_tab_mort: 'Ипотека',
        pdp_tab_similar: 'Похожие',

        pdp_view_all_photos: 'Посмотреть все фото',
        pdp_thumb_plan: 'Планировка',
        pdp_rooms: 'комната',

        pdp_badge_warranty: 'Гарантия 10 лет',
        pdp_badge_term: 'Срок от 30 дней',
        pdp_badge_mortgage: 'Ипотека от 6%',

        pdp_quick_area: 'Площадь',
        pdp_quick_floor: 'Этаж',
        pdp_quick_term: 'Срок',
        pdp_quick_term_val: 'Круглый год',
        pdp_quick_rooms: 'Комнат',

        pdp_chars_sub: 'О доме',

        pdp_compl_cold: 'Холодный контур',
        pdp_compl_cold_sub: 'от базовой цены',
        pdp_compl_draft: 'Черновая',
        pdp_compl_prefin: 'Предчистовая',
        pdp_compl_price: 'Стоимость:',
        pdp_compl_row_price: 'Цена',
        pdp_compl_row_walls: 'Стены',
        pdp_compl_row_windows: 'Окна',
        pdp_compl_windows_val: 'ПВХ двухкамерные',
        pdp_compl_row_finish: 'Отделка',
        pdp_compl_finish_none: 'Не входит',
        pdp_compl_finish_draft: 'Черновая',

        pdp_company_year: 'год',
        pdp_company_year_label: 'Основание компании',
        pdp_company_period_label: 'Период строительства',
        pdp_company_extra: 'Дополнительно',
        pdp_company_tradein: 'Трейд-ин',

        pdp_mort_tab_fast: 'Быстро',
        pdp_mort_tab_detail: 'Подробно',
        pdp_mort_term: 'Срок кредита',
        pdp_mort_rate: 'Ставка',
        pdp_mort_rate_family: '6% (семейная)',
        pdp_mort_rate_pref: '8% (льготная)',
        pdp_mort_rate_base: '15% (базовая)',

        pdp_similar_title: 'Похожие проекты',

        pdp_seo_line: 'Заказать в России строительство дома под ключ по проекту',
        pdp_seo_popular: 'Популярные страницы',
        pdp_seo_full: 'Строительство домов под ключ в Москве и области. Проекты любой сложности.',

        pdp_toast_mort_sent: 'Заявка на ипотеку отправлена!',
        pdp_toast_app_sent: 'Заявка отправлена! Мы свяжемся с вами.',
        pdp_toast_consult_sent: 'Заявка на консультацию отправлена!',

        pd_agent_name_full: 'Телегина Наталья Борисовна',
        // ===== PROFILE PAGE =====
        prof_tab_fav: 'Избранное',
        prof_tab_views: 'История',
        prof_tab_scheduled: 'Запланированные',
        prof_tab_settings: 'Настройки',

        prof_verified: 'Проверенный',
        prof_edit: 'Редактировать',

        prof_stat_fav: 'В избранном',
        prof_stat_views: 'Просмотров',
        prof_stat_scheduled: 'Запланированные',
        prof_stat_days: 'Дней с нами',

        prof_empty_fav: 'Список избранного пуст',
        prof_find_property: 'Найти недвижимость',
        prof_empty_views: 'История просмотров пуста',
        prof_empty_scheduled: 'Нет запланированных просмотров',

        prof_settings_title: 'Личные данные',
        prof_settings_sub: 'Обновите свои данные',
        prof_label_name: 'Имя',
        prof_label_email: 'Email',
        prof_label_phone: 'Телефон',
        prof_phone_placeholder: '+7 (___) ___-__-__',
        prof_save_changes: 'Сохранить изменения',
        prof_saving: 'Сохранение...',
        prof_logout: 'Выйти',

        prof_toast_logged_out: 'Вы вышли из аккаунта',
        prof_toast_saved: 'Настройки сохранены',
        prof_toast_save_error: 'Ошибка при сохранении',
        prof_toast_avatar_updated: 'Аватар обновлен (демо)',



        // ===== NOVOSTROYKI PAGE =====
        nzp_metro_default: 'Метро',
        nzp_rooms_suffix: 'комн.',
        nzp_completion_default: 'Сдача 2026',
        nzp_imo_default: 'ЖК',
        nzp_builder_default: 'Застройщик',

        nzp_bread_current: 'Квартиры в новостройках',
        nzp_title: 'Новостройки Ташкента',

        nzp_filter_all: 'Все новостройки',
        nzp_filter_apartments: 'Квартиры',
        nzp_filter_houses: 'Дома',
        nzp_rooms_4plus: '4+ комнаты',
        nzp_year: 'год',
        nzp_price_to_50k: 'До 50 000 $',
        nzp_price_50_100k: '50 000 - 100 000 $',
        nzp_price_from_100k: 'От 100 000 $',
        nzp_search_placeholder: 'Город, метро, ЖК...',

        nzp_loading: 'Загрузка объектов...',
        nzp_show_more: 'Показать ещё',

// ===== COMMERCIAL DETAIL PAGE =====
cmd_tab_gallery: 'Галерея',
cmd_tab_about: 'О недвижимости',
cmd_tab_chars: 'Характеристики',
cmd_tab_mort: 'Ипотека',
cmd_tab_interesting: 'Интересное',
cmd_tab_journal: 'Журнал',

cmd_bread_commercial: 'Коммерческая недвижимость',
cmd_metro_time_default: '5 мин',
cmd_metro_dist_default: '0.5 км',

cmd_call: 'Позвонить',
cmd_features_title: 'Особенности',
cmd_payment_title: 'Способы оплаты недвижимости',
cmd_more: 'Подробнее',
cmd_similar_title: 'Похожие предложения',

cmd_char_code: 'Код объекта',
cmd_char_floor: 'Этаж / Этажность',
cmd_char_area: 'Общая площадь',
cmd_char_type: 'Тип',

cmd_per_month: 'мес',

cmd_agent_name: 'Пак Илья Ильич',
cmd_agent_role: 'Эксперт по коммерческой недвижимости',

cmd_toast_developing: 'Раздел в разработке',
cmd_toast_not_found: 'Объект не найден',
cmd_toast_invalid_form: 'Введите имя и корректный телефон',
cmd_toast_app_sent: 'Заявка отправлена!',
cmd_app_message_prefix: 'Заявка по коммерческому объекту:',



// ===== COMMERCIAL PAGE (list) =====
cmp_title: 'Купить: коммерческая недвижимость',
cmp_filter_all: 'Все категории',
cmp_area_to_50: 'До 50 м²',
cmp_area_50_100: '50 - 100 м²',
cmp_area_from_100: 'От 100 м²',
cmp_search_placeholder: 'Город, адрес, метро...',

// ===== PROPERTY CARD (home) =====
pcard_type_new: 'Новостройка',
pcard_type_house: 'Дом',
pcard_type_com: 'Коммерческая',
pcard_fav_aria: 'В избранное',

// ===== MOTION SECTION =====
motion_sub: 'Популярное',
motion_title: 'Выбор наших клиентов',
motion_btn_all: 'Смотреть все',








    },
    en: {
        nav_novostroyki: 'New Buildings',
        nav_stroitelstvo: 'House Construction',
        nav_commercial: 'Commercial',
        nav_consult: 'Consultation',

        hero_badge: 'Find more than a home',
        hero_title: 'Find your place for life',
        hero_sub: 'Selected new buildings, houses and commercial real estate. Transparent prices and deal support.',
        hero_btn_view: 'View new buildings',
        hero_btn_video: 'Watch video',
        hero_card_exclusive: 'EXCLUSIVE OFFER',
        hero_card_title: 'Metronome Quarter',
        hero_card_addr: 'Moscow, Tagilskaya st.',
        hero_card_studio: 'Studio',
        hero_card_date: 'Q4 2026',
        hero_card_btn: 'View property',

        featured_sub: 'Selection',
        featured_title: 'Outstanding properties',
        featured_desc: 'Extraordinary lifestyle',
        featured_btn_map: 'On map',
        featured_btn_all: 'Show all',

        ad_sale: 'Special Offer',
        ad_sale_desc: 'Discount up to 1,200,000 ₽ on business-class new buildings',
        ad_sale_btn: 'Get discount →',

        consult_title: 'Free consultation',
        consult_desc: 'Leave a request or call us',
        consult_name: 'Your name',
        consult_phone: '+7',
        consult_btn: 'Get consultation',
        consult_agree: 'By clicking the button, you consent to the processing of personal data',

        ft_1: 'Verified properties',
        ft_1_desc: 'Each property passes legal verification.',
        ft_2: 'Choice for your lifestyle',
        ft_2_desc: 'New buildings, houses and commercial on one map.',
        ft_3: 'Mortgage from 6%',
        ft_3_desc: 'We will select a program and apply to banks.',
        ft_4: 'Turnkey construction',
        ft_4_desc: 'Project, estimate and construction with guarantee.',

        map_sub: 'Map',
        map_title: 'Properties on the map',
        map_hint: 'Click on the property on the right',

        journal_title: 'Etagi Journal',
        journal_btn: 'Go to journal',

        mort_title: 'Mortgage programs',
        mort_btn: 'Calculate',

        // ✅ HEADER MENU (EN)
        nav_zhk: 'Residential complexes',
        nav_1room: 'One-room apartments',
        nav_2room: 'Two-room apartments',
        nav_3room: 'Three-room apartments',
        nav_4room: 'Multi-room apartments',
        nav_studio: 'Studios',
        nav_builders: 'Developers',
        nav_2025: 'New buildings 2025',
        nav_2026: 'New buildings 2026',
        nav_2027: 'New buildings 2027',
        nav_2028: 'New buildings 2028',
        nav_2029: 'New buildings 2029',
        nav_completed: 'Completed complexes',
        nav_center: 'New buildings in the center',
        nav_commercial_nb: 'Commercial new buildings',
        nav_promo: 'Promotions and discounts from developers',
        nav_family_mort: 'Buy with family mortgage – 6%',
        nav_installment: 'Installment available',
        nav_about_buy: 'About buying a new building',
        nav_projects: 'House projects',
        nav_barn: 'Barnhouses',
        nav_module: 'Modular houses',
        nav_frame: 'Frame houses',
        nav_brick: 'Brick houses',
        nav_builders_comp: 'Construction companies',
        nav_ready_homes: 'Ready-made houses',
        nav_land: 'Land plots',
        nav_calc: 'Construction calculator',
        nav_sale: 'Sale',
        nav_rent: 'Rent',
        nav_rented: 'With tenant (GAB)',
        nav_trade: 'Retail space',
        nav_free: 'Free purpose',
        nav_office: 'Office',
        nav_warehouse: 'Base / Warehouse / Production',
        nav_land_c: 'Land plots',
        nav_new_c: 'Commercial new buildings',
        nav_gp: 'Ready business',
        nav_garage: 'Garages',
        nav_parking: 'Parking spaces',
        nav_storage: 'Storage rooms',

        hero_eb: 'Find more than a home',
        hero_title_line1: 'Find your',
        hero_title_line2: 'place',
        hero_title_line3: 'for life',
        search_tab_buy: 'Buy',
        search_tab_rent: 'Rent',
        search_tab_sell: 'Sell',
        search_tab_let: 'Rent out',
        search_tab_mort: 'Get a mortgage',
        search_all_types: 'Apartments in secondary and new buildings',
        search_type_new: 'New buildings',
        search_type_house: 'Houses and land',
        search_type_com: 'Commercial',
        search_rooms: 'Rooms',
        search_studio: 'Studio',
        search_1room: '1 room',
        search_2room: '2 rooms',
        search_3room: '3 or more',
        search_price: 'Price, ₽',
        search_price_a: 'up to 15M',
        search_price_b: '15–30M',
        search_price_c: 'from 30M',
        search_area: 'Area, m²',
        search_area_a: 'up to 40',
        search_area_b: '40–80',
        search_area_c: 'from 80',
        search_placeholder: 'City, address, metro, district, complex, developer',
        search_more_filters: 'More filters',
        search_btn: 'Search',
        search_cat_apartments: 'Apartments',
        search_cat_new: 'New buildings',
        search_cat_houses: 'Houses and land',
        search_cat_cottages: 'Cottage villages',
        search_cat_commercial: 'Commercial',
        search_cat_construction: 'House construction',
        search_cat_garages: 'Garages',

        // EN:
        ad_1_eb: 'Special Offer',
        ad_1_title: 'Discount up to 1,200,000 ₽ on business-class new buildings',
        ad_1_desc: 'Only until Dec 31, 2026. Mortgage from 2% for families with children.',
        ad_1_btn: 'Get discount →',
        ad_2_eb: 'New',
        ad_2_title: 'Apartments with terrace',
        ad_2_desc: 'Only in new complexes. Panoramic views and unique layouts.',
        ad_2_btn: 'View projects →',
        ad_3_eb: 'Special',
        ad_3_title: 'Real estate trade-in',
        ad_3_desc: 'Exchange your old apartment for a new one with minimal extra payment.',
        ad_3_btn: 'Learn more →',
        ad_4_eb: 'Mortgage',
        ad_4_title: 'Family mortgage 6%',
        ad_4_desc: 'State support for families with children. Apply online.',
        ad_4_btn: 'Calculate →',
        feat_sub: 'Selection',
        feat_title: 'Outstanding properties',
        feat_desc: 'Extraordinary lifestyle',
        feat_btn_map: 'On map',
        feat_btn_all: 'Show all',
        swipe_sub: 'Recommended',
        swipe_title: 'Swipe',
        swipe_title_arrow: 'to the side →',
        swipe_desc: 'Best of the week',
        swipe_btn_all: 'Show all',

        map_btn_all: 'Show all',
        quick_title: 'Quick search',
        quick_cat_apartments: 'Apartments',
        quick_cat_new: 'New buildings',
        quick_cat_houses: 'Houses and land',
        quick_cat_projects: 'House projects',
        quick_cat_commercial: 'Commercial',
        quick_cat_garages: 'Garages',
        quick_tag_1: 'House under 10 years old',
        quick_tag_2: 'With large kitchen',
        quick_tag_3: 'Built from 2021',
        quick_tag_4: 'Panoramic windows',
        quick_tag_5: 'Delivery in 2026',
        quick_tag_6: 'With finishing',
        quick_tag_7: 'Near metro',
        quick_tag_8: 'Mortgage from 6%',
        quick_tag_9: 'By the water',
        quick_tag_10: 'With sauna',
        quick_tag_11: 'In the forest',
        quick_tag_12: 'Near Moscow',
        quick_tag_13: 'One-story',
        quick_tag_14: 'With attic',
        quick_tag_15: 'Aerated concrete',
        quick_tag_16: 'Up to 150 m²',
        quick_tag_17: 'Offices in center',
        quick_tag_18: 'First line',
        quick_tag_19: 'Warehouses',
        quick_tag_20: 'Free purpose',
        quick_tag_21: 'Parking space',
        quick_tag_22: 'Underground parking',
        quick_tag_23: 'Box',
        quick_tag_24: 'With electricity',
        new_title: 'Start your journey with Etagi',
        new_sub: 'Leave a request now and get a free consultation on choosing real estate.',
        new_btn: 'Get consultation',


        team_sub: 'Experts',
        team_title: 'Our',
        team_title_highlight: 'team',
        toast_phone_error: 'Enter the full phone number',
        toast_success: 'Request sent. We will call you back soon',

        footer_desc: 'Federal real estate company. Operating since 2008. More than 200 offices in Russia and Kazakhstan.',
        footer_col_realty: 'Real Estate',
        footer_link_novostroyki: 'New Buildings',
        footer_link_houses: 'Houses and Land',
        footer_link_commercial: 'Commercial',
        footer_link_cottages: 'Cottage Villages',
        footer_link_garages: 'Garages and Parking',
        footer_col_services: 'Services',
        footer_link_mortgage: 'Mortgage from 6%',
        footer_link_valuation: 'Property Valuation',
        footer_link_legal: 'Legal Support',
        footer_link_construction: 'House Construction',
        footer_link_design: 'Design and Renovation',
        footer_col_company: 'Company',
        footer_link_about: 'About Us',
        footer_link_team: 'Team',
        footer_link_careers: 'Careers',
        footer_link_reviews: 'Reviews',
        footer_link_contacts: 'Contacts',
        footer_col_contacts: 'Contacts',
        footer_address: 'Moscow, Presnenskaya Embankment, 12',
        footer_hours: 'Daily 9:00 – 21:00',
        footer_copyright: '© 2008–2026 "Etagi". All rights reserved.',
        footer_privacy: 'Privacy Policy',
        footer_offer: 'Offer Agreement',
        footer_sitemap: 'Sitemap',

        modal_consult_title: 'Free consultation',
        modal_consult_desc: 'Fill out the form and we will contact you within 15 minutes.',
        modal_name: 'Your name',
        modal_phone: '+998 (__) ___-__-__',
        modal_message: 'Your question (optional)',
        modal_cancel: 'Cancel',
        modal_submit: 'Send',
        modal_sending: 'Sending...',
        auth_login: 'Login',
        auth_profile: 'Profile and favorites',
        auth_logout: 'Logout',
        mobile_menu_sub: 'Menu',
        mobile_menu_novostroyki: 'New buildings',
        mobile_menu_stroitelstvo: 'House construction',
        mobile_menu_commercial: 'Commercial',
        mobile_menu_home: 'Home',
        mobile_menu_consult: 'Consultation',

        toast_name_error: 'Enter your name',
        toast_consult_success: 'Consultation request sent!',
        toast_error: 'Error sending. Try again later.',

        map_tooltip_details: 'Details',
        map_hover_hint: 'Hover over the marker — we will show the property',
        card_badge_new: 'New building',
        card_compare: 'Compare',
        card_metro: 'm.',
        card_on_map: 'On map',
        card_details: 'Details',
        toast_login_required: 'Log in to add to favorites',
        toast_fav_added: 'Added to favorites',
        toast_fav_removed: 'Removed from favorites',


        // ===== NOVOSTROYKA DETAIL (CONTENT) =====
        nzd_reviews_count: '1 review',
        nzd_price_from: 'from',
        nzd_per_m2: 'per m²',
        nzd_mort_from: 'Mortgage from 16%',
        nzd_calc_payment: 'Calculate payment',
        nzd_toast_scroll_mort: 'Scrolling to mortgage',
        nzd_on_map: 'On map',
        nzd_open_on_map: 'Open on map →',
        nzd_metro_badge: 'M',
        nzd_metro_time: '8 min. (0.6 km)',
        nzd_spec_wall: 'Wall material:',
        nzd_spec_builder: 'Developer:',
        nzd_spec_class: 'Housing class:',
        nzd_spec_deadline: 'Completion:',

        nzd_choose_flat: 'Choose an apartment',
        nzd_rooms_label: 'Rooms',
        nzd_room_all: 'All',
        nzd_room_studio: 'Studio',
        nzd_room_1: '1',
        nzd_room_2: '2',
        nzd_room_3: '3',
        nzd_room_4plus: '4+',
        nzd_price_label: 'Price, ₽',
        nzd_area_label: 'Area, m²',
        nzd_from: 'from',
        nzd_to: 'to',
        nzd_finish_opt: 'Finishing / renovation',
        nzd_deadline_opt: 'Completion date',
        nzd_more_filters: 'More filters',
        nzd_clear: 'Clear',
        nzd_show_offers: 'Show',
        nzd_offers_word: 'offers',
        nzd_m2_short: 'm²',
        nzd_floor: 'floor',
        nzd_ready_short: 'completion',

        nzd_features_title: 'Building features',
        nzd_feat_house: 'Building',
        nzd_feat_complex: 'Complex',
        nzd_tab_genplan: 'Master plan',
        nzd_tab_panorama: 'Panorama',
        nzd_show_all: 'Show all',
        nzd_desc_title: 'Description',
        nzd_collapse: 'Collapse',
        nzd_show_more: 'Show more',
        nzd_video_title: 'Video',
        nzd_progress_title: 'Construction progress',
        nzd_progress_filter1: 'Q1, Metronome',
        nzd_progress_filter2: 'Q1 2024',

        // ===== NOVOSTROYKA DETAIL (EXTRA) =====
        nzd_banner_title: 'Don\'t miss your second chance',
        nzd_banner_sub: '6% rate on new buildings',
        nzd_banner_btn1: 'Fill out the form',
        nzd_banner_btn2: 'Details',

        nzd_pay_title: 'Payment methods',
        nzd_tab_mortgage: 'Mortgage',
        nzd_tab_installment: 'Installment',
        nzd_price_property: 'Property price',
        nzd_down_payment: 'Down payment',
        nzd_rate: 'Rate, %',
        nzd_term: 'Loan term',
        nzd_years: 'years',
        nzd_subsidy: 'Subsidized by developer',
        nzd_monthly_payment: 'Monthly payment',
        nzd_overpay: 'Overpayment',
        nzd_total: 'Total',
        nzd_apply_mortgage: 'Apply for mortgage',
        nzd_apply_installment: 'Apply for installment',

        nzd_inst_term: 'Installment term',
        nzd_inst_term_val: 'up to 36 months',
        nzd_inst_down: 'Down payment',
        nzd_inst_down_val: 'from 20%',
        nzd_inst_markup: 'Markup',
        nzd_inst_markup_val: '0%',
        nzd_inst_fee: 'Processing',
        nzd_inst_fee_val: 'free',

        nzd_reviews_title: 'Reviews',
        nzd_reviews_empty_title: 'Not found',
        nzd_reviews_empty_desc: 'No reviews about this complex yet, be the first',
        nzd_leave_review: 'Leave a review',
        nzd_declarations_title: 'Project declarations',
        nzd_declaration_1: 'Declaration 1',
        nzd_declaration_2: 'Declaration 2',

        nzd_disclaimer_1: '1. The site is for informational purposes only. The stated cost of properties may differ from the actual one. Etagi company is not a Developer. It is not an offer under Art. 435, 427 of the Civil Code of the Russian Federation.',
        nzd_disclaimer_2: '2. Actual availability of options and prices may differ.',
        nzd_disclaimer_3: '3. Information about the minimum mortgage rate may differ.',

        // ===== NOVOSTROYKA DETAIL (HERO & SIDEBAR) =====
        nzd_hero_badge_default: 'Residential complex',
        nzd_hero_choose_flat: 'Choose an apartment',
        nzd_hero_callback: 'Call me back',
        nzd_hero_on_map: 'On map',
        nzd_hero_fav: 'Add to favorites',
        nzd_hero_share: 'Share',
        nzd_hero_price: 'Price',
        nzd_hero_deadline: 'Completion date',
        nzd_hero_builder: 'Developer',

        nzd_toast_link_copied: 'Link copied',
        nzd_toast_phone_copied: 'Phone copied!',
        nzd_toast_invalid_form: 'Enter a valid name and phone',
        nzd_toast_app_sent: 'Request sent! Our manager will contact you.',
        nzd_app_message_prefix: 'Request for property:',

        nzd_consult_default_name: 'New buildings consultant',
        nzd_consult_default_role: 'Will reply in 15 minutes',
        nzd_show_phone: 'Show phone',
        nzd_contact_me: 'Contact me',

        nzd_toast_login_view: 'Log in to schedule a viewing',
        nzd_scheduled_name: 'Viewing scheduled',
        nzd_scheduled_message: 'Client wants to schedule a viewing:',
        nzd_toast_scheduled_ok: 'You are scheduled for a viewing!',
        nzd_toast_scheduled_error: 'Scheduling error',
        nzd_schedule_view: 'Schedule a viewing',

        nzd_share: 'Share',
        nzd_in_fav: 'In favorites',
        nzd_add_to_fav: 'Add to favorites',

        nzd_fact_consult: 'Free consultation',
        nzd_fact_booking: 'Online booking',
        nzd_fact_discounts: 'Developer discounts',

        nzd_modal_title: 'Contact me',
        nzd_modal_desc: 'Leave your number and we will answer all questions about the property.',
        nzd_modal_name: 'Your name',
        nzd_modal_phone: '+998 (__) ___-__-__',
        nzd_modal_submit: 'Send',
        nzd_modal_sending: 'Sending...',

        // ===== NOVOSTROYKA DETAIL (TABS) =====
        nzd_tab_about: 'About the complex',
        nzd_tab_flats: 'Choose apartment',
        nzd_tab_features: 'Building features',
        nzd_tab_description: 'Description',
        nzd_tab_progress: 'Construction progress',

        // ===== PROJECT CARD (stroitelstvo) =====
        proj_price_from: 'from',
        proj_rooms_short: 'rooms',
        proj_m2_short: 'm²',
        proj_floor: 'floor',
        proj_floor_suffix: 's',
        proj_phone: 'Phone',
        proj_details: 'Details',
        proj_toast_compare_added: 'Added to comparison',
        proj_toast_phone: 'Phone: +7 800 555-35-35',

        // ===== COMMERCIAL CARD & MAP =====
        cm_type_prefix: 'Type:',
        cm_type_default: 'Commercial',
        cm_m2_short: 'm²',
        cm_floor_short: 'fl.',
        cm_metro_badge: 'M',
        cm_metro_default: 'Metro',
        cm_on_map: 'On map',
        cm_show_phone: 'Show phone',
        cm_map_hint: 'Click on a marker or card',


        // ===== 404 NOT FOUND =====
        nf_title: 'It looks you are LOST!',
        nf_back_home: 'Go back home',

        // ===== LOADING =====
        loading_brand: 'ETAGI',
        loading_text: 'Loading data...',

        // ===== STROITELSTVO PAGE =====
        sd_hero_eyebrow: 'Suburban construction',
        sd_hero_title_1: 'House projects',
        sd_hero_title_em: 'turnkey',
        sd_hero_sub_1: 'More than',
        sd_hero_sub_2: 'projects from verified construction companies. Fixed price, 10-year warranty.',
        sd_hero_stat_projects: 'Projects',
        sd_hero_stat_companies: 'Companies',
        sd_hero_stat_years: 'Years of experience',

        sd_bread_home: 'Home',
        sd_bread_current: 'House construction',

        sd_title: 'House projects',
        sd_count_offers: 'offers',
        sd_sort_popular: 'Sort: Popular',
        sd_sort_price: 'By price',

        sd_filter_all: 'All projects',
        sd_filter_projects: 'Projects',
        sd_filter_barn: 'Barnhouses',
        sd_filter_module: 'Modular',
        sd_filter_frame: 'Frame',
        sd_filter_brick: 'Brick',
        sd_filter_rooms: 'Rooms',
        sd_filter_price: 'Price',
        sd_filter_area: 'Area',
        sd_filter_material: 'Wall material',
        sd_filter_search_placeholder: 'Search...',
        sd_filter_find: 'Search',

        sd_promo1_title: 'DP = 0',
        sd_promo1_desc: 'No savings? Mortgage without down payment',
        sd_promo2_desc: 'Commission for project selection',
        sd_promo3_title: '10-year warranty',
        sd_promo3_desc: 'For all house structures',
        sd_promo4_title: 'Individual plan',
        sd_promo4_desc: 'We will develop a project for you',

        sd_loading: 'Loading...',
        sd_not_found: 'Nothing found for your request',

        sd_consult_title: 'Free consultation',
        sd_consult_desc: 'Leave a request — we will select a project for your plot and budget. Or call us at',
        sd_consult_feat1: 'We will reply in 15 minutes',
        sd_consult_feat2: 'We will offer 3 options',
        sd_consult_feat3: 'We will calculate the estimate',
        sd_consult_name: 'Your name',
        sd_consult_flag: 'EN',
        sd_consult_phone: '+7',
        sd_consult_btn: 'Get consultation',
        sd_consult_agree_1: 'By clicking the button, you consent to the processing of',
        sd_consult_agree_link: 'personal data',

        sd_seo_title: 'Order turnkey house construction',
        sd_seo_short: 'You can order turnkey house construction in Russia through Etagi company. We have been working with verified construction companies since 2008.',
        sd_seo_full: 'Our catalog presents house projects from various materials: frame, brick, barnhouses, modular houses and SIP-panel houses. Each project can be adapted to your plot and budget.',
        sd_seo_popular_cats: 'Popular categories',
        sd_seo_popular_queries: 'Popular queries',
        sd_seo_q1: 'Houses up to 1M ₽',
        sd_seo_q2: 'Houses with terrace',
        sd_seo_q3: 'One-story houses',
        sd_seo_q4: 'Houses with attic',
        sd_seo_show: 'Show more',
        sd_seo_hide: 'Hide',



        // ===== PROJECT DETAIL PAGE =====
        pd_bread_home: 'Home',
        pd_bread_stroitelstvo: 'House construction',
        pd_loading: 'Loading...',

        // TABS
        pd_tab_gallery: 'Gallery',
        pd_tab_chars: 'Characteristics',
        pd_tab_packages: 'Packages',
        pd_tab_company: 'About company',
        pd_tab_mortgage: 'Mortgage',

        // HERO / TITLE
        pd_rooms: 'rooms',
        pd_m2: 'm²',
        pd_floor: 'floor',
        pd_m: 'm',
        pd_price_from: 'from',
        pd_price_note: 'Turnkey price, no hidden fees',
        pd_badge_warranty: '10-year warranty',
        pd_badge_term: 'Term from 30 days',
        pd_badge_mortgage: 'Mortgage from 6%',

        // QUICK STATS
        pd_stat_area: 'Area',
        pd_stat_floor: 'Floor',
        pd_stat_term: 'Term',
        pd_stat_term_val: 'All year round',
        pd_stat_rooms: 'Rooms',

        // CHARACTERISTICS
        pd_chars_title: 'Characteristics',
        pd_char_area: 'House area',
        pd_char_rooms: 'Number of rooms',
        pd_char_bathrooms: 'Number of bathrooms',
        pd_char_kitchen: 'Kitchen-living room area',
        pd_char_floors: 'Number of floors',
        pd_char_terrace: 'Terrace',
        pd_char_wall_height: 'Wall height',
        pd_char_foundation: 'Foundation',
        pd_char_roof: 'Roof',
        pd_char_material: 'Wall material',
        pd_yes: 'Yes',
        pd_no: 'No',

        // PACKAGES
        pd_packages_title: 'Packages',
        pd_packages_desc: 'Choose the level of house completion. The price varies depending on the package.',

        // COMPANY
        pd_company_title: 'About the construction company',
        pd_company_type: 'Construction company',
        pd_company_desc_empty: 'No company description.',

        // MORTGAGE
        pd_mort_title: 'Calculate mortgage',
        pd_mort_desc: 'We can calculate a mortgage without a down payment, just enter 0%.',
        pd_mort_price: 'Property price',
        pd_mort_down: 'Down payment',
        pd_mort_monthly: 'Monthly payment',
        pd_mort_btn: 'Apply for mortgage',

        // SIDEBAR
        pd_agent_name: 'Telegina Natalya',
        pd_agent_role: 'Suburban real estate expert',
        pd_show_phone: 'Show phone',
        pd_get_consult: 'Get consultation',
        pd_side_fixed_price: 'Fixed price',

        // SCHEDULE
        pd_toast_login_view: 'Log in to schedule a viewing',
        pd_scheduled_name: 'Viewing scheduled',
        pd_scheduled_message: 'Client wants to schedule a viewing:',
        pd_toast_scheduled_ok: 'You are scheduled for a viewing!',
        pd_toast_scheduled_error: 'Scheduling error',
        pd_schedule_view: 'Schedule a viewing',

        // MODAL
        pd_modal_title: 'Get consultation',
        pd_modal_desc: 'Leave your number — we will call back in 15 minutes',
        pd_modal_name: 'Your name',
        pd_modal_phone: '+7 (___) ___-__-__',
        pd_modal_submit: 'Send',
        pd_modal_sending: 'Sending...',
        pd_modal_agree_1: 'By clicking the button, you consent to the processing of',
        pd_modal_agree_link: 'personal data',

        // TOASTS
        pd_toast_invalid_form: 'Enter a valid name and phone number',
        pd_toast_app_sent: 'Request sent! The manager will contact you.',
        pd_app_message_prefix: 'Consultation request for project:',


        // ===== AUTH: LOGIN & REGISTER =====
        auth_login_title: 'Login to Etagi',
        auth_login_sub: 'Log in to save favorites',
        auth_login_email: 'Email address',
        auth_login_password: 'Password',
        auth_login_btn: 'Log in',
        auth_login_loading: 'Logging in...',
        auth_login_btn_short: 'Log in',

        auth_register_title: 'Registration',
        auth_register_sub: 'Create an account to save favorites',
        auth_register_name: 'Your name',
        auth_register_email: 'Email address',
        auth_register_phone_optional: 'Phone (optional)',
        auth_register_password_hint: 'Password (min. 6 characters)',
        auth_register_btn: 'Sign up',
        auth_register_loading: 'Signing up...',
        auth_register_btn_short: 'Sign up',

        auth_have_account: 'Already have an account?',
        auth_no_account: 'No account?',

        auth_toast_fill_required: 'Fill in name, email and password',
        auth_toast_fill_email_password: 'Enter email and password',
        auth_toast_password_short: 'Password must be at least 6 characters',
        auth_toast_register_success: 'Registration successful!',
        auth_toast_register_error: 'Registration error',
        auth_toast_welcome: 'Welcome!',
        auth_toast_invalid_credentials: 'Invalid email or password',

        // ===== PROJECT DETAIL (static-data) =====
        pdp_tab_gallery: 'Gallery',
        pdp_tab_chars: 'Characteristics',
        pdp_tab_compl: 'Packages',
        pdp_tab_company: 'About company',
        pdp_tab_mort: 'Mortgage',
        pdp_tab_similar: 'Similar',

        pdp_view_all_photos: 'View all photos',
        pdp_thumb_plan: 'Layout',
        pdp_rooms: 'rooms',

        pdp_badge_warranty: '10-year warranty',
        pdp_badge_term: 'Term from 30 days',
        pdp_badge_mortgage: 'Mortgage from 6%',

        pdp_quick_area: 'Area',
        pdp_quick_floor: 'Floor',
        pdp_quick_term: 'Term',
        pdp_quick_term_val: 'All year round',
        pdp_quick_rooms: 'Rooms',

        pdp_chars_sub: 'About the house',

        pdp_compl_cold: 'Cold contour',
        pdp_compl_cold_sub: 'from base price',
        pdp_compl_draft: 'Draft',
        pdp_compl_prefin: 'Pre-finish',
        pdp_compl_price: 'Price:',
        pdp_compl_row_price: 'Price',
        pdp_compl_row_walls: 'Walls',
        pdp_compl_row_windows: 'Windows',
        pdp_compl_windows_val: 'Double-chamber PVC',
        pdp_compl_row_finish: 'Finishing',
        pdp_compl_finish_none: 'Not included',
        pdp_compl_finish_draft: 'Draft',

        pdp_company_year: 'year',
        pdp_company_year_label: 'Company founded',
        pdp_company_period_label: 'Construction period',
        pdp_company_extra: 'Additional',
        pdp_company_tradein: 'Trade-in',

        pdp_mort_tab_fast: 'Quick',
        pdp_mort_tab_detail: 'Detailed',
        pdp_mort_term: 'Loan term',
        pdp_mort_rate: 'Rate',
        pdp_mort_rate_family: '6% (family)',
        pdp_mort_rate_pref: '8% (preferential)',
        pdp_mort_rate_base: '15% (base)',

        pdp_similar_title: 'Similar projects',

        pdp_seo_line: 'Order turnkey house construction in Russia for project',
        pdp_seo_popular: 'Popular pages',
        pdp_seo_full: 'Turnkey house construction in Moscow and the region. Projects of any complexity.',

        pdp_toast_mort_sent: 'Mortgage application sent!',
        pdp_toast_app_sent: 'Request sent! We will contact you.',
        pdp_toast_consult_sent: 'Consultation request sent!',

        pd_agent_name_full: 'Telegina Natalya Borisovna',


        // ===== PROFILE PAGE =====
        prof_tab_fav: 'Favorites',
        prof_tab_views: 'History',
        prof_tab_scheduled: 'Scheduled',
        prof_tab_settings: 'Settings',

        prof_verified: 'Verified',
        prof_edit: 'Edit',

        prof_stat_fav: 'In favorites',
        prof_stat_views: 'Views',
        prof_stat_scheduled: 'Scheduled',
        prof_stat_days: 'Days with us',

        prof_empty_fav: 'Your favorites list is empty',
        prof_find_property: 'Find property',
        prof_empty_views: 'View history is empty',
        prof_empty_scheduled: 'No scheduled viewings',

        prof_settings_title: 'Personal data',
        prof_settings_sub: 'Update your data',
        prof_label_name: 'Name',
        prof_label_email: 'Email',
        prof_label_phone: 'Phone',
        prof_phone_placeholder: '+7 (___) ___-__-__',
        prof_save_changes: 'Save changes',
        prof_saving: 'Saving...',
        prof_logout: 'Log out',

        prof_toast_logged_out: 'You have logged out',
        prof_toast_saved: 'Settings saved',
        prof_toast_save_error: 'Error saving',
        prof_toast_avatar_updated: 'Avatar updated (demo)',





        // ===== NOVOSTROYKI PAGE =====
        nzp_metro_default: 'Metro',
        nzp_rooms_suffix: 'rooms',
        nzp_completion_default: 'Completion 2026',
        nzp_imo_default: 'Complex',
        nzp_builder_default: 'Developer',

        nzp_bread_current: 'Apartments in new buildings',
        nzp_title: 'New buildings of Tashkent',

        nzp_filter_all: 'All new buildings',
        nzp_filter_apartments: 'Apartments',
        nzp_filter_houses: 'Houses',
        nzp_rooms_4plus: '4+ rooms',
        nzp_year: 'year',
        nzp_price_to_50k: 'Up to $50,000',
        nzp_price_50_100k: '$50,000 - $100,000',
        nzp_price_from_100k: 'From $100,000',
        nzp_search_placeholder: 'City, metro, complex...',

        nzp_loading: 'Loading properties...',
        nzp_show_more: 'Show more',
// ===== COMMERCIAL DETAIL PAGE =====
cmd_tab_gallery: 'Gallery',
cmd_tab_about: 'About property',
cmd_tab_chars: 'Characteristics',
cmd_tab_mort: 'Mortgage',
cmd_tab_interesting: 'Interesting',
cmd_tab_journal: 'Journal',

cmd_bread_commercial: 'Commercial real estate',
cmd_metro_time_default: '5 min',
cmd_metro_dist_default: '0.5 km',

cmd_call: 'Call',
cmd_features_title: 'Features',
cmd_payment_title: 'Property payment methods',
cmd_more: 'Details',
cmd_similar_title: 'Similar offers',

cmd_char_code: 'Property code',
cmd_char_floor: 'Floor / Floors',
cmd_char_area: 'Total area',
cmd_char_type: 'Type',

cmd_per_month: 'mo',

cmd_agent_name: 'Pak Ilya Ilyich',
cmd_agent_role: 'Commercial real estate expert',

cmd_toast_developing: 'Section under development',
cmd_toast_not_found: 'Property not found',
cmd_toast_invalid_form: 'Enter your name and a valid phone',
cmd_toast_app_sent: 'Request sent!',
cmd_app_message_prefix: 'Request for commercial property:',



// ===== COMMERCIAL PAGE (list) =====
cmp_title: 'Buy: commercial real estate',
cmp_filter_all: 'All categories',
cmp_area_to_50: 'Up to 50 m²',
cmp_area_50_100: '50 - 100 m²',
cmp_area_from_100: 'From 100 m²',
cmp_search_placeholder: 'City, address, metro...',
pcard_type_new: 'New building',
pcard_type_house: 'House',
pcard_type_com: 'Commercial',
pcard_fav_aria: 'Add to favorites',

motion_sub: 'Popular',
motion_title: 'Our clients\' choice',
motion_btn_all: 'View all',







    },
    uz: {
        nav_novostroyki: 'Yangi binolar',
        nav_stroitelstvo: 'Uy qurilishi',
        nav_commercial: 'Tijorat',
        nav_consult: 'Maslahat',

        hero_badge: 'Uydan ko\'proq narsani toping',
        hero_title: 'Hayotingiz uchun joy toping',
        hero_sub: 'Tanlangan yangi binolar, uylar va tijorat ko\'chmas mulki. Shaffof narxlar va bitimni qo\'llab-quvvatlash.',
        hero_btn_view: 'Yangi binolarni ko\'rish',
        hero_btn_video: 'Videoni ko\'rish',
        hero_card_exclusive: 'EKSKLYUZIV TAKLIF',
        hero_card_title: 'Metronom kvartali',
        hero_card_addr: 'Moskva, Tagilskaya ko\'chasi',
        hero_card_studio: 'Studiya',
        hero_card_date: '2026 yil 4-chorak',
        hero_card_btn: 'Obyektni ko\'rish',

        featured_sub: 'Tanlov',
        featured_title: 'Ajoyib obyektlar',
        featured_desc: 'G\'ayrioddiy turmush tarzi',
        featured_btn_map: 'Xaritada',
        featured_btn_all: 'Barchasini ko\'rsatish',

        ad_sale: 'Maxsus taklif',
        ad_sale_desc: 'Biznes-klass yangi binolariga 1 200 000 ₽ gacha chegirma',
        ad_sale_btn: 'Chegirma olish →',

        consult_title: 'Bepul maslahat',
        consult_desc: 'So\'rov qoldiring yoki bizga qo\'ng\'iroq qiling',
        consult_name: 'Ismingiz',
        consult_phone: '+7',
        consult_btn: 'Maslahat olish',
        consult_agree: 'Tugmani bosish orqali siz shaxsiy ma\'lumotlarni qayta ishlashga rozilik bildirasiz',

        ft_1: 'Tekshirilgan obyektlar',
        ft_1_desc: 'Har bir obyekt yuridik tekshiruvdan o\'tadi.',
        ft_2: 'Turmush tarzingizga mos tanlov',
        ft_2_desc: 'Yangi binolar, uylar va tijorat bitta xaritada.',
        ft_3: '6% dan ipoteka',
        ft_3_desc: 'Dasturni tanlaymiz va banklarga ariza topshiramiz.',
        ft_4: 'Kalit topshirish bilan qurilish',
        ft_4_desc: 'Loyiha, smeta va kafolat bilan uy qurilishi.',

        map_sub: 'Xarita',
        map_title: 'Xaritadagi obyektlar',
        map_hint: 'O\'ngdagi obyektni bosing',

        journal_title: 'Etagi Jurnali',
        journal_btn: 'Jurnalga o\'tish',

        mort_title: 'Ipoteka dasturlari',
        mort_btn: 'Hisoblash',

        // ✅ HEADER MENU (UZ)
        nav_zhk: 'Turar-joy majmualari',
        nav_1room: 'Bir xonali kvartiralar',
        nav_2room: 'Ikki xonali kvartiralar',
        nav_3room: 'Uch xonali kvartiralar',
        nav_4room: 'Ko\'p xonali kvartiralar',
        nav_studio: 'Studiyalar',
        nav_builders: 'Quruvchilar',
        nav_2025: 'Yangi binolar 2025',
        nav_2026: 'Yangi binolar 2026',
        nav_2027: 'Yangi binolar 2027',
        nav_2028: 'Yangi binolar 2028',
        nav_2029: 'Yangi binolar 2029',
        nav_completed: 'Topshirilgan majmualar',
        nav_center: 'Markazdagi yangi binolar',
        nav_commercial_nb: 'Tijorat yangi binolari',
        nav_promo: 'Quruvchilardan aksiyalar va chegirmalar',
        nav_family_mort: 'Oilaviy ipoteka bilan sotib oling – 6%',
        nav_installment: 'Bo\'lib to\'lash mavjud',
        nav_about_buy: 'Yangi bino sotib olish haqida',
        nav_projects: 'Uy loyihalari',
        nav_barn: 'Barnxauslar',
        nav_module: 'Modulli uylar',
        nav_frame: 'Karkas uylar',
        nav_brick: 'G\'ishtli uylar',
        nav_builders_comp: 'Qurilish kompaniyalari',
        nav_ready_homes: 'Tayyor uylar',
        nav_land: 'Yer uchastkalari',
        nav_calc: 'Qurilish kalkulyatori',
        nav_sale: 'Sotuv',
        nav_rent: 'Ijara',
        nav_rented: 'Ijarachi bilan (GAB)',
        nav_trade: 'Savdo binosi',
        nav_free: 'Erkin maqsad',
        nav_office: 'Ofis',
        nav_warehouse: 'Baza / Ombor / Ishlab chiqarish',
        nav_land_c: 'Yer uchastkalari',
        nav_new_c: 'Tijorat yangi binolari',
        nav_gp: 'Tayyor biznes',
        nav_garage: 'Garajlar',
        nav_parking: 'Parking joylari',
        nav_storage: 'Kladovkalar',

        hero_eb: 'Uydan ko\'proq narsani toping',
        hero_title_line1: 'Hayotingiz uchun',
        hero_title_line2: 'joy',
        hero_title_line3: 'toping',


        search_tab_buy: 'Sotib olish',
        search_tab_rent: 'Ijara',
        search_tab_sell: 'Sotish',
        search_tab_let: 'Ijaraga berish',
        search_tab_mort: 'Ipoteka olish',
        search_all_types: 'Ikkilamchi va yangi binolardagi kvartiralar',
        search_type_new: 'Yangi binolar',
        search_type_house: 'Uylar va yer uchastkalari',
        search_type_com: 'Tijorat',
        search_rooms: 'Xonalar soni',
        search_studio: 'Studiya',
        search_1room: '1 xona',
        search_2room: '2 xona',
        search_3room: '3 va undan ko\'p',
        search_price: 'Narx, ₽',
        search_price_a: '15 mln gacha',
        search_price_b: '15–30 mln',
        search_price_c: '30 mln dan',
        search_area: 'Maydon, m²',
        search_area_a: '40 gacha',
        search_area_b: '40–80',
        search_area_c: '80 dan',
        search_placeholder: 'Shahar, manzil, metro, tuman, turar-joy majmuasi',
        search_more_filters: 'Boshqa filtrlar',
        search_btn: 'Qidirish',
        search_cat_apartments: 'Kvartiralar',
        search_cat_new: 'Yangi binolar',
        search_cat_houses: 'Uylar va yer uchastkalari',
        search_cat_cottages: 'Kottej qishloqlari',
        search_cat_commercial: 'Tijorat',
        search_cat_construction: 'Uy qurilishi',
        search_cat_garages: 'Garajlar',


        // UZ:
        ad_1_eb: 'Maxsus taklif',
        ad_1_title: 'Biznes-klass yangi binolariga 1 200 000 ₽ gacha chegirma',
        ad_1_desc: 'Faqat 2026-yil 31-dekabrgacha. Bolali oilalar uchun 2% dan ipoteka.',
        ad_1_btn: 'Chegirma olish →',
        ad_2_eb: 'Yangi',
        ad_2_title: 'Terrasali kvartiralar',
        ad_2_desc: 'Faqat yangi majmualarda. Panoramik manzaralar va noyob rejalar.',
        ad_2_btn: 'Loyihalarni ko\'rish →',
        ad_3_eb: 'Maxsus',
        ad_3_title: 'Ko\'chmas mulk trade-in',
        ad_3_desc: 'Eski kvartirangizni minimal qo\'shimcha to\'lov bilan yangisiga almashtiring.',
        ad_3_btn: 'Batafsil →',
        ad_4_eb: 'Ipoteka',
        ad_4_title: 'Oilaviy ipoteka 6%',
        ad_4_desc: 'Bolali oilalar uchun davlat yordami. Onlayn ariza bering.',
        ad_4_btn: 'Hisoblash →',
        feat_sub: 'Tanlov',
        feat_title: 'Ajoyib obyektlar',
        feat_desc: 'G\'ayrioddiy turmush tarzi',
        feat_btn_map: 'Xaritada',
        feat_btn_all: 'Barchasini ko\'rsatish',
        swipe_sub: 'Tavsiya etamiz',
        swipe_title: 'Yon tomonga',
        swipe_title_arrow: 'surib ko\'ring →',
        swipe_desc: 'Haftaning eng yaxshilari',
        swipe_btn_all: 'Barchasini ko\'rsatish',



        map_btn_all: 'Barchasini ko\'rsatish',
        quick_title: 'Tezkor qidiruv',
        quick_cat_apartments: 'Kvartiralar',
        quick_cat_new: 'Yangi binolar',
        quick_cat_houses: 'Uylar va yer uchastkalari',
        quick_cat_projects: 'Uy loyihalari',
        quick_cat_commercial: 'Tijorat',
        quick_cat_garages: 'Garajlar',
        quick_tag_1: '10 yildan oshmagan uy',
        quick_tag_2: 'Katta oshxona bilan',
        quick_tag_3: '2021 yildan qurilgan',
        quick_tag_4: 'Panoramik derazalar',
        quick_tag_5: '2026 yilda topshirish',
        quick_tag_6: 'Bezak bilan',
        quick_tag_7: 'Metroga yaqin',
        quick_tag_8: '6% dan ipoteka',
        quick_tag_9: 'Suv bo\'yida',
        quick_tag_10: 'Sauna bilan',
        quick_tag_11: 'O\'rmonda',
        quick_tag_12: 'Moskvaga yaqin',
        quick_tag_13: 'Bir qavatli',
        quick_tag_14: 'Mansardali',
        quick_tag_15: 'Gazobetondan',
        quick_tag_16: '150 m² gacha',
        quick_tag_17: 'Markazdagi ofislar',
        quick_tag_18: 'Birinchi liniya',
        quick_tag_19: 'Omborlar',
        quick_tag_20: 'Erkin maqsad',
        quick_tag_21: 'Mashina joyi',
        quick_tag_22: 'Yer osti parkovi',
        quick_tag_23: 'Boks',
        quick_tag_24: 'Elektr bilan',
        new_title: 'Etaji bilan yo\'lingizni boshlang',
        new_sub: 'Hoziroq so\'rov qoldiring va ko\'chmas mulk tanlash bo\'yicha bepul maslahat oling.',
        new_btn: 'Maslahat olish',


        team_sub: 'Ekspertlar',
        team_title: 'Bizning',
        team_title_highlight: 'jamoa',

        toast_phone_error: 'Telefon raqamini to\'liq kiriting',
        toast_success: 'So\'rov yuborildi. Tez orada qo\'ng\'iroq qilamiz',


        footer_desc: 'Federal ko\'chmas mulk kompaniyasi. 2008 yildan beri ishlaymiz. Rossiya va Qozog\'istonda 200 dan ortiq ofislar.',
        footer_col_realty: 'Ko\'chmas mulk',
        footer_link_novostroyki: 'Yangi binolar',
        footer_link_houses: 'Uylar va yer uchastkalari',
        footer_link_commercial: 'Tijorat',
        footer_link_cottages: 'Kottej qishloqlari',
        footer_link_garages: 'Garajlar va parkovka',
        footer_col_services: 'Xizmatlar',
        footer_link_mortgage: '6% dan ipoteka',
        footer_link_valuation: 'Ko\'chmas mulkni baholash',
        footer_link_legal: 'Yuridik yordam',
        footer_link_construction: 'Uy qurilishi',
        footer_link_design: 'Dizayn va ta\'mirlash',
        footer_col_company: 'Kompaniya',
        footer_link_about: 'Biz haqimizda',
        footer_link_team: 'Jamoa',
        footer_link_careers: 'Vakansiyalar',
        footer_link_reviews: 'Sharhlar',
        footer_link_contacts: 'Kontaktlar',
        footer_col_contacts: 'Kontaktlar',
        footer_address: 'Moskva, Presnenskaya qirg\'og\'i, 12',
        footer_hours: 'Har kuni 9:00 – 21:00',
        footer_copyright: '© 2008–2026 "Etaji". Barcha huquqlar himoyalangan.',
        footer_privacy: 'Maxfiylik siyosati',
        footer_offer: 'Oferta shartnomasi',
        footer_sitemap: 'Sayt xaritasi',

        modal_consult_title: 'Bepul maslahat',
        modal_consult_desc: 'Formani to\'ldiring va biz 15 daqiqa ichida siz bilan bog\'lanamiz.',
        modal_name: 'Ismingiz',
        modal_phone: '+998 (__) ___-__-__',
        modal_message: 'Savolingiz (ixtiyoriy)',
        modal_cancel: 'Bekor qilish',
        modal_submit: 'Yuborish',
        modal_sending: 'Yuborilmoqda...',
        auth_login: 'Kirish',
        auth_profile: 'Profil va sevimlilar',
        auth_logout: 'Chiqish',
        mobile_menu_sub: 'Menyu',
        mobile_menu_novostroyki: 'Yangi binolar',
        mobile_menu_stroitelstvo: 'Uy qurilishi',
        mobile_menu_commercial: 'Tijorat',
        mobile_menu_home: 'Asosiy',
        mobile_menu_consult: 'Maslahat',
        toast_name_error: 'Ismingizni kiriting',
        toast_consult_success: 'Maslahat so\'rovi yuborildi!',
        toast_error: 'Yuborishda xatolik. Keyinroq urinib ko\'ring.',
        // --- MAP & CARD (novostroyki) ---
        map_tooltip_details: 'Batafsil',
        map_hover_hint: 'Markerni ustiga olib boring — obyektni ko\'rsatamiz',
        card_badge_new: 'Yangi bino',
        card_compare: 'Taqqoslash',
        card_metro: 'm.',
        card_on_map: 'Xaritada',
        card_details: 'Batafsil',
        toast_login_required: 'Sevimlilarga qo\'shish uchun tizimga kiring',
        toast_fav_added: 'Sevimlilarga qo\'shildi',
        toast_fav_removed: 'Sevimlilardan olib tashlandi',

        // ===== NOVOSTROYKA DETAIL (CONTENT) =====
        nzd_reviews_count: '1 sharh',
        nzd_price_from: 'dan',
        nzd_per_m2: 'm² uchun',
        nzd_mort_from: '16% dan ipoteka',
        nzd_calc_payment: 'To\'lovni hisoblash',
        nzd_toast_scroll_mort: 'Ipoteka bo\'limiga o\'tish',
        nzd_on_map: 'Xaritada',
        nzd_open_on_map: 'Xaritada ochish →',
        nzd_metro_badge: 'M',
        nzd_metro_time: '8 daq. (0.6 km)',
        nzd_spec_wall: 'Devor materiali:',
        nzd_spec_builder: 'Quruvchi:',
        nzd_spec_class: 'Uy-joy klassi:',
        nzd_spec_deadline: 'Topshirish:',

        nzd_choose_flat: 'Kvartira tanlash',
        nzd_rooms_label: 'Xonalar soni',
        nzd_room_all: 'Barchasi',
        nzd_room_studio: 'Studiya',
        nzd_room_1: '1',
        nzd_room_2: '2',
        nzd_room_3: '3',
        nzd_room_4plus: '4+',
        nzd_price_label: 'Narx, ₽',
        nzd_area_label: 'Maydon, m²',
        nzd_from: 'dan',
        nzd_to: 'gacha',
        nzd_finish_opt: 'Bezak / ta\'mir',
        nzd_deadline_opt: 'Topshirish muddati',
        nzd_more_filters: 'Boshqa filtrlar',
        nzd_clear: 'Tozalash',
        nzd_show_offers: 'Ko\'rsatish',
        nzd_offers_word: 'taklif',
        nzd_m2_short: 'm²',
        nzd_floor: 'qavat',
        nzd_ready_short: 'topshirish',

        nzd_features_title: 'Uyning xususiyatlari',
        nzd_feat_house: 'Uy',
        nzd_feat_complex: 'Majmua',
        nzd_tab_genplan: 'Bosh reja',
        nzd_tab_panorama: 'Panorama',
        nzd_show_all: 'Barchasini ko\'rsatish',
        nzd_desc_title: 'Tavsif',
        nzd_collapse: 'Yig\'ish',
        nzd_show_more: 'Batafsil',
        nzd_video_title: 'Video',
        nzd_progress_title: 'Qurilish jarayoni',
        nzd_progress_filter1: '1 chorak, Metronom',
        nzd_progress_filter2: '2024 yil 1-chorak',

        // ===== NOVOSTROYKA DETAIL (EXTRA) =====
        nzd_banner_title: 'Ikkinchi imkoniyatni boy bermang',
        nzd_banner_sub: 'Yangi binolarga 6% stavka',
        nzd_banner_btn1: 'Anketani to\'ldirish',
        nzd_banner_btn2: 'Batafsil',

        nzd_pay_title: 'To\'lov usullari',
        nzd_tab_mortgage: 'Ipoteka',
        nzd_tab_installment: 'Bo\'lib to\'lash',
        nzd_price_property: 'Ko\'chmas mulk narxi',
        nzd_down_payment: 'Boshlang\'ich to\'lov',
        nzd_rate: 'Stavka, %',
        nzd_term: 'Kredit muddati',
        nzd_years: 'yil',
        nzd_subsidy: 'Quruvchi subsidiyalaydi',
        nzd_monthly_payment: 'Oylik to\'lov',
        nzd_overpay: 'Ortiqcha to\'lov',
        nzd_total: 'Jami',
        nzd_apply_mortgage: 'Ipoteka rasmiylashtirish',
        nzd_apply_installment: 'Bo\'lib to\'lashni rasmiylashtirish',

        nzd_inst_term: 'Bo\'lib to\'lash muddati',
        nzd_inst_term_val: '36 oygacha',
        nzd_inst_down: 'Boshlang\'ich to\'lov',
        nzd_inst_down_val: '20% dan',
        nzd_inst_markup: 'Qimmatlashuv',
        nzd_inst_markup_val: '0%',
        nzd_inst_fee: 'Rasmiylashtirish',
        nzd_inst_fee_val: 'bepul',

        nzd_reviews_title: 'Sharhlar',
        nzd_reviews_empty_title: 'Topilmadi',
        nzd_reviews_empty_desc: 'Bu majmua haqida hali sharhlar yo\'q, birinchi bo\'ling',
        nzd_leave_review: 'Sharh qoldirish',
        nzd_declarations_title: 'Loyiha deklaratsiyalari',
        nzd_declaration_1: 'Deklaratsiya 1',
        nzd_declaration_2: 'Deklaratsiya 2',

        nzd_disclaimer_1: '1. Sayt faqat ma\'lumot uchun mo\'ljallangan. Ko\'rsatilgan obyektlar narxi haqiqiy narxdan farq qilishi mumkin. Etaji kompaniyasi Quruvchi emas. RF Fuqarolik Kodeksining 435, 427-moddalariga muvofiq oferta hisoblanmaydi.',
        nzd_disclaimer_2: '2. Variantlar va narxlarning haqiqiy mavjudligi farq qilishi mumkin.',
        nzd_disclaimer_3: '3. Ipoteka bo\'yicha minimal stavka haqidagi ma\'lumot farq qilishi mumkin.',



        // ===== NOVOSTROYKA DETAIL (HERO & SIDEBAR) =====
        nzd_hero_badge_default: 'Turar-joy majmuasi',
        nzd_hero_choose_flat: 'Kvartira tanlash',
        nzd_hero_callback: 'Menga qo\'ng\'iroq qiling',
        nzd_hero_on_map: 'Xaritada',
        nzd_hero_fav: 'Sevimlilarga',
        nzd_hero_share: 'Ulashish',
        nzd_hero_price: 'Narx',
        nzd_hero_deadline: 'Topshirish muddati',
        nzd_hero_builder: 'Quruvchi',

        nzd_toast_link_copied: 'Havola nusxalandi',
        nzd_toast_phone_copied: 'Telefon nusxalandi!',
        nzd_toast_invalid_form: 'To\'g\'ri ism va telefon kiriting',
        nzd_toast_app_sent: 'So\'rov yuborildi! Menejerimiz siz bilan bog\'lanadi.',
        nzd_app_message_prefix: 'Obyekt bo\'yicha so\'rov:',

        nzd_consult_default_name: 'Yangi binolar bo\'yicha maslahatchi',
        nzd_consult_default_role: '15 daqiqada javob beradi',
        nzd_show_phone: 'Telefonni ko\'rsatish',
        nzd_contact_me: 'Men bilan bog\'laning',

        nzd_toast_login_view: 'Ko\'rishga yozilish uchun tizimga kiring',
        nzd_scheduled_name: 'Ko\'rishga yozilish',
        nzd_scheduled_message: 'Mijoz ko\'rishga yozilmoqchi:',
        nzd_toast_scheduled_ok: 'Siz ko\'rishga yozildingiz!',
        nzd_toast_scheduled_error: 'Yozilishda xatolik',
        nzd_schedule_view: 'Ko\'rishga yozilish',

        nzd_share: 'Ulashish',
        nzd_in_fav: 'Sevimlilarda',
        nzd_add_to_fav: 'Sevimlilarga',

        nzd_fact_consult: 'Bepul maslahat',
        nzd_fact_booking: 'Onlayn bron qilish',
        nzd_fact_discounts: 'Quruvchidan chegirmalar',

        nzd_modal_title: 'Men bilan bog\'laning',
        nzd_modal_desc: 'Raqamingizni qoldiring, obyekt bo\'yicha barcha savollarga javob beramiz.',
        nzd_modal_name: 'Ismingiz',
        nzd_modal_phone: '+998 (__) ___-__-__',
        nzd_modal_submit: 'Yuborish',
        nzd_modal_sending: 'Yuborilmoqda...',

        // ===== NOVOSTROYKA DETAIL (TABS) =====
        nzd_tab_about: 'Majmua haqida',
        nzd_tab_flats: 'Kvartira tanlash',
        nzd_tab_features: 'Uy xususiyatlari',
        nzd_tab_description: 'Tavsif',
        nzd_tab_progress: 'Qurilish jarayoni',


        // ===== PROJECT CARD (stroitelstvo) =====
        proj_price_from: 'dan',
        proj_rooms_short: 'xona',
        proj_m2_short: 'm²',
        proj_floor: 'qavat',
        proj_floor_suffix: '',
        proj_phone: 'Telefon',
        proj_details: 'Batafsil',
        proj_toast_compare_added: 'Taqqoslashga qo\'shildi',
        proj_toast_phone: 'Telefon: +7 800 555-35-35',

        // ===== COMMERCIAL CARD & MAP =====
        cm_type_prefix: 'Turi:',
        cm_type_default: 'Tijorat',
        cm_m2_short: 'm²',
        cm_floor_short: 'qav.',
        cm_metro_badge: 'M',
        cm_metro_default: 'Metro',
        cm_on_map: 'Xaritada',
        cm_show_phone: 'Telefonni ko\'rsatish',
        cm_map_hint: 'Markerni yoki kartochkani bosing',

        // ===== 404 NOT FOUND =====
        nf_title: 'Siz yo\'qotganga o\'xshaysiz!',
        nf_back_home: 'Bosh sahifaga qaytish',

        // ===== LOADING =====
        loading_brand: 'ETAGI',
        loading_text: 'Ma\'lumotlar yuklanmoqda...',




        // ===== STROITELSTVO PAGE =====
        sd_hero_eyebrow: 'Shahar tashqarisida qurilish',
        sd_hero_title_1: 'Uy loyihalari',
        sd_hero_title_em: 'kalit topshirish bilan',
        sd_hero_sub_1: 'Tekshirilgan qurilish kompaniyalaridan',
        sd_hero_sub_2: 'dan ortiq loyiha. Belgilangan narx, 10 yillik kafolat.',
        sd_hero_stat_projects: 'Loyihalar',
        sd_hero_stat_companies: 'Kompaniyalar',
        sd_hero_stat_years: 'Yillik tajriba',

        sd_bread_home: 'Asosiy',
        sd_bread_current: 'Uy qurilishi',

        sd_title: 'Uy loyihalari',
        sd_count_offers: 'taklif',
        sd_sort_popular: 'Saralash: Ommabop',
        sd_sort_price: 'Narx bo\'yicha',

        sd_filter_all: 'Barcha loyihalar',
        sd_filter_projects: 'Loyihalar',
        sd_filter_barn: 'Barnxauslar',
        sd_filter_module: 'Modulli',
        sd_filter_frame: 'Karkas',
        sd_filter_brick: 'G\'ishtli',
        sd_filter_rooms: 'Xonalar soni',
        sd_filter_price: 'Narx',
        sd_filter_area: 'Maydon',
        sd_filter_material: 'Devor materiali',
        sd_filter_search_placeholder: 'Qidirish...',
        sd_filter_find: 'Qidirish',

        sd_promo1_title: 'BT = 0',
        sd_promo1_desc: 'Jamg\'armangiz yo\'qmi? Boshlang\'ich to\'lovsiz ipoteka',
        sd_promo2_desc: 'Loyiha tanlash uchun komissiya',
        sd_promo3_title: '10 yillik kafolat',
        sd_promo3_desc: 'Uyning barcha konstruksiyalariga',
        sd_promo4_title: 'Individual reja',
        sd_promo4_desc: 'Siz uchun loyiha ishlab chiqamiz',

        sd_loading: 'Yuklanmoqda...',
        sd_not_found: 'So\'rovingiz bo\'yicha hech narsa topilmadi',

        sd_consult_title: 'Bepul maslahat',
        sd_consult_desc: 'So\'rov qoldiring — uchastkangiz va byudjetingizga mos loyiha tanlaymiz. Yoki bizga qo\'ng\'iroq qiling:',
        sd_consult_feat1: '15 daqiqada javob beramiz',
        sd_consult_feat2: '3 ta variant tanlaymiz',
        sd_consult_feat3: 'Smetani hisoblaymiz',
        sd_consult_name: 'Ismingiz',
        sd_consult_flag: 'UZ',
        sd_consult_phone: '+998',
        sd_consult_btn: 'Maslahat olish',
        sd_consult_agree_1: 'Tugmani bosish orqali siz quyidagilarni qayta ishlashga rozilik bildirasiz:',
        sd_consult_agree_link: 'shaxsiy ma\'lumotlar',

        sd_seo_title: 'Kalit topshirish bilan uy qurilishiga buyurtma berish',
        sd_seo_short: 'Rossiyada kalit topshirish bilan uy qurilishiga Etaji kompaniyasi orqali buyurtma berishingiz mumkin. Biz 2008 yildan beri tekshirilgan qurilish kompaniyalari bilan ishlaymiz.',
        sd_seo_full: 'Katalogimizda turli materiallardan uy loyihalari taqdim etilgan: karkas, g\'isht, barnxauslar, modulli uylar va SIP-panelli uylar. Har bir loyihani uchastkangiz va byudjetingizga moslashtirish mumkin.',
        sd_seo_popular_cats: 'Ommabop kategoriyalar',
        sd_seo_popular_queries: 'Ommabop so\'rovlar',
        sd_seo_q1: '1 mln ₽ gacha uylar',
        sd_seo_q2: 'Terrasali uylar',
        sd_seo_q3: 'Bir qavatli uylar',
        sd_seo_q4: 'Mansardali uylar',
        sd_seo_show: 'Batafsil',
        sd_seo_hide: 'Yig\'ish',
        // ===== PROJECT DETAIL PAGE =====
        pd_bread_home: 'Asosiy',
        pd_bread_stroitelstvo: 'Uy qurilishi',
        pd_loading: 'Yuklanmoqda...',

        // TABS
        pd_tab_gallery: 'Galereya',
        pd_tab_chars: 'Xususiyatlar',
        pd_tab_packages: 'Komplektatsiyalar',
        pd_tab_company: 'Kompaniya haqida',
        pd_tab_mortgage: 'Ipoteka',

        // HERO / TITLE
        pd_rooms: 'xona',
        pd_m2: 'm²',
        pd_floor: 'qavat',
        pd_m: 'm',
        pd_price_from: 'dan',
        pd_price_note: 'Kalit topshirish narxi, yashirin to\'lovlarsiz',
        pd_badge_warranty: '10 yillik kafolat',
        pd_badge_term: 'Muddat 30 kundan',
        pd_badge_mortgage: '6% dan ipoteka',

        // QUICK STATS
        pd_stat_area: 'Maydon',
        pd_stat_floor: 'Qavat',
        pd_stat_term: 'Muddat',
        pd_stat_term_val: 'Butun yil',
        pd_stat_rooms: 'Xonalar',

        // CHARACTERISTICS
        pd_chars_title: 'Xususiyatlar',
        pd_char_area: 'Uy maydoni',
        pd_char_rooms: 'Xonalar soni',
        pd_char_bathrooms: 'Sanuzellar soni',
        pd_char_kitchen: 'Oshxona-mehmonxona maydoni',
        pd_char_floors: 'Qavatlar soni',
        pd_char_terrace: 'Terrassa',
        pd_char_wall_height: 'Devor balandligi',
        pd_char_foundation: 'Fundament',
        pd_char_roof: 'Tom',
        pd_char_material: 'Devor materiali',
        pd_yes: 'Bor',
        pd_no: 'Yo\'q',

        // PACKAGES
        pd_packages_title: 'Komplektatsiyalar',
        pd_packages_desc: 'Uyning tayyorlik darajasini tanlang. Narx komplektatsiyaga qarab o\'zgaradi.',

        // COMPANY
        pd_company_title: 'Qurilish kompaniyasi haqida',
        pd_company_type: 'Qurilish kompaniyasi',
        pd_company_desc_empty: 'Kompaniya tavsifi yo\'q.',

        // MORTGAGE
        pd_mort_title: 'Ipotekani hisoblash',
        pd_mort_desc: 'Boshlang\'ich to\'lovsiz ipotekani hisoblashimiz mumkin, shunchaki 0% kiriting.',
        pd_mort_price: 'Ko\'chmas mulk narxi',
        pd_mort_down: 'Boshlang\'ich to\'lov',
        pd_mort_monthly: 'Oylik to\'lov',
        pd_mort_btn: 'Ipoteka rasmiylashtirish',

        // SIDEBAR
        pd_agent_name: 'Telegina Natalya',
        pd_agent_role: 'Shahar tashqarisidagi ko\'chmas mulk bo\'yicha ekspert',
        pd_show_phone: 'Telefonni ko\'rsatish',
        pd_get_consult: 'Maslahat olish',
        pd_side_fixed_price: 'Belgilangan narx',

        // SCHEDULE
        pd_toast_login_view: 'Ko\'rishga yozilish uchun tizimga kiring',
        pd_scheduled_name: 'Ko\'rishga yozilish',
        pd_scheduled_message: 'Mijoz ko\'rishga yozilmoqchi:',
        pd_toast_scheduled_ok: 'Siz ko\'rishga yozildingiz!',
        pd_toast_scheduled_error: 'Yozilishda xatolik',
        pd_schedule_view: 'Ko\'rishga yozilish',

        // MODAL
        pd_modal_title: 'Maslahat olish',
        pd_modal_desc: 'Raqamingizni qoldiring — 15 daqiqada qo\'ng\'iroq qilamiz',
        pd_modal_name: 'Ismingiz',
        pd_modal_phone: '+998 (__) ___-__-__',
        pd_modal_submit: 'Yuborish',
        pd_modal_sending: 'Yuborilmoqda...',
        pd_modal_agree_1: 'Tugmani bosish orqali siz quyidagilarni qayta ishlashga rozilik bildirasiz:',
        pd_modal_agree_link: 'shaxsiy ma\'lumotlar',

        // TOASTS
        pd_toast_invalid_form: 'To\'g\'ri ism va telefon raqamini kiriting',
        pd_toast_app_sent: 'So\'rov yuborildi! Menejer siz bilan bog\'lanadi.',
        pd_app_message_prefix: 'Loyiha bo\'yicha maslahat so\'rovi:',
        // ===== AUTH: LOGIN & REGISTER =====
        auth_login_title: 'Etajiga kirish',
        auth_login_sub: 'Sevimlilarni saqlash uchun tizimga kiring',
        auth_login_email: 'Elektron pochta',
        auth_login_password: 'Parol',
        auth_login_btn: 'Kirish',
        auth_login_loading: 'Kirish...',
        auth_login_btn_short: 'Kirish',

        auth_register_title: 'Ro\'yxatdan o\'tish',
        auth_register_sub: 'Sevimlilarni saqlash uchun akkaunt yarating',
        auth_register_name: 'Ismingiz',
        auth_register_email: 'Elektron pochta',
        auth_register_phone_optional: 'Telefon (ixtiyoriy)',
        auth_register_password_hint: 'Parol (kamida 6 belgi)',
        auth_register_btn: 'Ro\'yxatdan o\'tish',
        auth_register_loading: 'Ro\'yxatdan o\'tilmoqda...',
        auth_register_btn_short: 'Ro\'yxatdan o\'tish',

        auth_have_account: 'Akkauntingiz bormi?',
        auth_no_account: 'Akkauntingiz yo\'qmi?',

        auth_toast_fill_required: 'Ism, email va parolni to\'ldiring',
        auth_toast_fill_email_password: 'Email va parolni kiriting',
        auth_toast_password_short: 'Parol kamida 6 belgidan iborat bo\'lishi kerak',
        auth_toast_register_success: 'Ro\'yxatdan o\'tish muvaffaqiyatli!',
        auth_toast_register_error: 'Ro\'yxatdan o\'tishda xatolik',
        auth_toast_welcome: 'Xush kelibsiz!',
        auth_toast_invalid_credentials: 'Email yoki parol noto\'g\'ri',


        // ===== PROJECT DETAIL (static-data) =====
        pdp_tab_gallery: 'Galereya',
        pdp_tab_chars: 'Xususiyatlar',
        pdp_tab_compl: 'Komplektatsiyalar',
        pdp_tab_company: 'Kompaniya haqida',
        pdp_tab_mort: 'Ipoteka',
        pdp_tab_similar: 'O\'xshash',

        pdp_view_all_photos: 'Barcha rasmlarni ko\'rish',
        pdp_thumb_plan: 'Reja',
        pdp_rooms: 'xona',

        pdp_badge_warranty: '10 yillik kafolat',
        pdp_badge_term: 'Muddat 30 kundan',
        pdp_badge_mortgage: '6% dan ipoteka',

        pdp_quick_area: 'Maydon',
        pdp_quick_floor: 'Qavat',
        pdp_quick_term: 'Muddat',
        pdp_quick_term_val: 'Butun yil',
        pdp_quick_rooms: 'Xonalar',

        pdp_chars_sub: 'Uy haqida',

        pdp_compl_cold: 'Sovuq kontur',
        pdp_compl_cold_sub: 'asosiy narxdan',
        pdp_compl_draft: 'Qora',
        pdp_compl_prefin: 'Oldindan bezak',
        pdp_compl_price: 'Narx:',
        pdp_compl_row_price: 'Narx',
        pdp_compl_row_walls: 'Devorlar',
        pdp_compl_row_windows: 'Derazalar',
        pdp_compl_windows_val: 'Ikki kamerali PVX',
        pdp_compl_row_finish: 'Bezak',
        pdp_compl_finish_none: 'Kirmaydi',
        pdp_compl_finish_draft: 'Qora',

        pdp_company_year: 'yil',
        pdp_company_year_label: 'Kompaniya asos solingan',
        pdp_company_period_label: 'Qurilish davri',
        pdp_company_extra: 'Qo\'shimcha',
        pdp_company_tradein: 'Trade-in',

        pdp_mort_tab_fast: 'Tez',
        pdp_mort_tab_detail: 'Batafsil',
        pdp_mort_term: 'Kredit muddati',
        pdp_mort_rate: 'Stavka',
        pdp_mort_rate_family: '6% (oilaviy)',
        pdp_mort_rate_pref: '8% (imtiyozli)',
        pdp_mort_rate_base: '15% (asosiy)',

        pdp_similar_title: 'O\'xshash loyihalar',

        pdp_seo_line: 'Rossiyada loyiha bo\'yicha kalit topshirish bilan uy qurilishiga buyurtma bering:',
        pdp_seo_popular: 'Ommabop sahifalar',
        pdp_seo_full: 'Moskva va viloyatda kalit topshirish bilan uy qurilishi. Har qanday murakkablikdagi loyihalar.',

        pdp_toast_mort_sent: 'Ipoteka so\'rovi yuborildi!',
        pdp_toast_app_sent: 'So\'rov yuborildi! Biz siz bilan bog\'lanamiz.',
        pdp_toast_consult_sent: 'Maslahat so\'rovi yuborildi!',

        pd_agent_name_full: 'Telegina Natalya Borisovna',
        // ===== PROFILE PAGE =====
        prof_tab_fav: 'Sevimlilar',
        prof_tab_views: 'Tarix',
        prof_tab_scheduled: 'Rejalashtirilgan',
        prof_tab_settings: 'Sozlamalar',

        prof_verified: 'Tasdiqlangan',
        prof_edit: 'Tahrirlash',

        prof_stat_fav: 'Sevimlilarda',
        prof_stat_views: 'Ko\'rishlar',
        prof_stat_scheduled: 'Rejalashtirilgan',
        prof_stat_days: 'Biz bilan kunlar',

        prof_empty_fav: 'Sevimlilar ro\'yxati bo\'sh',
        prof_find_property: 'Ko\'chmas mulk topish',
        prof_empty_views: 'Ko\'rishlar tarixi bo\'sh',
        prof_empty_scheduled: 'Rejalashtirilgan ko\'rishlar yo\'q',

        prof_settings_title: 'Shaxsiy ma\'lumotlar',
        prof_settings_sub: 'Ma\'lumotlaringizni yangilang',
        prof_label_name: 'Ism',
        prof_label_email: 'Email',
        prof_label_phone: 'Telefon',
        prof_phone_placeholder: '+998 (__) ___-__-__',
        prof_save_changes: 'O\'zgarishlarni saqlash',
        prof_saving: 'Saqlanmoqda...',
        prof_logout: 'Chiqish',

        prof_toast_logged_out: 'Siz akkauntdan chiqdingiz',
        prof_toast_saved: 'Sozlamalar saqlandi',
        prof_toast_save_error: 'Saqlashda xatolik',
        prof_toast_avatar_updated: 'Avatar yangilandi (demo)',

        // ===== NOVOSTROYKI PAGE =====
        nzp_metro_default: 'Metro',
        nzp_rooms_suffix: 'xona',
        nzp_completion_default: 'Topshirish 2026',
        nzp_imo_default: 'TJ',
        nzp_builder_default: 'Quruvchi',

        nzp_bread_current: 'Yangi binolardagi kvartiralar',
        nzp_title: 'Toshkentdagi yangi binolar',

        nzp_filter_all: 'Barcha yangi binolar',
        nzp_filter_apartments: 'Kvartiralar',
        nzp_filter_houses: 'Uylar',
        nzp_rooms_4plus: '4+ xona',
        nzp_year: 'yil',
        nzp_price_to_50k: '$50 000 gacha',
        nzp_price_50_100k: '$50 000 - $100 000',
        nzp_price_from_100k: '$100 000 dan',
        nzp_search_placeholder: 'Shahar, metro, TJ...',

        nzp_loading: 'Obyektlar yuklanmoqda...',
        nzp_show_more: 'Batafsil',


// ===== COMMERCIAL DETAIL PAGE =====
cmd_tab_gallery: 'Galereya',
cmd_tab_about: 'Ko\'chmas mulk haqida',
cmd_tab_chars: 'Xususiyatlar',
cmd_tab_mort: 'Ipoteka',
cmd_tab_interesting: 'Qiziqarli',
cmd_tab_journal: 'Jurnal',

cmd_bread_commercial: 'Tijorat ko\'chmas mulki',
cmd_metro_time_default: '5 daq',
cmd_metro_dist_default: '0.5 km',

cmd_call: 'Qo\'ng\'iroq qilish',
cmd_features_title: 'Xususiyatlar',
cmd_payment_title: 'Ko\'chmas mulkni to\'lash usullari',
cmd_more: 'Batafsil',
cmd_similar_title: 'O\'xshash takliflar',

cmd_char_code: 'Obyekt kodi',
cmd_char_floor: 'Qavat / Qavatlar',
cmd_char_area: 'Umumiy maydon',
cmd_char_type: 'Turi',

cmd_per_month: 'oy',

cmd_agent_name: 'Pak Ilya Ilyich',
cmd_agent_role: 'Tijorat ko\'chmas mulki bo\'yicha ekspert',

cmd_toast_developing: 'Bo\'lim ishlab chiqilmoqda',
cmd_toast_not_found: 'Obyekt topilmadi',
cmd_toast_invalid_form: 'Ism va to\'g\'ri telefon kiriting',
cmd_toast_app_sent: 'So\'rov yuborildi!',
cmd_app_message_prefix: 'Tijorat obyekti bo\'yicha so\'rov:',
// ===== COMMERCIAL PAGE (list) =====
cmp_title: 'Sotib olish: tijorat ko\'chmas mulki',
cmp_filter_all: 'Barcha kategoriyalar',
cmp_area_to_50: '50 m² gacha',
cmp_area_50_100: '50 - 100 m²',
cmp_area_from_100: '100 m² dan',
cmp_search_placeholder: 'Shahar, manzil, metro...',
pcard_type_new: 'Yangi bino',
pcard_type_house: 'Uy',
pcard_type_com: 'Tijorat',
pcard_fav_aria: 'Sevimlilarga',

motion_sub: 'Ommabop',
motion_title: 'Mijozlarimiz tanlovi',
motion_btn_all: 'Barchasini ko\'rish',
    },
};

export type TranslationKey = keyof typeof TRANSLATIONS.ru;

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('ru');

    useEffect(() => {
        const saved = localStorage.getItem('site-lang') as Language;
        if (saved && ['ru', 'en', 'uz'].includes(saved)) {
            setLangState(saved);
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('site-lang', newLang);
    };

    const t = (key: TranslationKey) => {
        return TRANSLATIONS[lang][key] || TRANSLATIONS['ru'][key] || key;
    };

    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useTranslation must be used within LanguageProvider');
    return context;
}