/**
 * Business Communication OS - Bilingual Translations Dictionary
 * Feature IDs: UI-005, UI-006, UI-007, UI-008
 */

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface TranslationDictionary {
  // Navigation & Shell
  appName: string;
  appTagline: string;
  navHome: string;
  navMail: string;
  navCalendar: string;
  navContacts: string;
  navTasks: string;
  navScheduled: string;
  navAI: string;
  navSettings: string;
  
  // Future Modules
  navWhatsApp: string;
  navAutomation: string;
  navCRM: string;
  navAnalytics: string;
  futureModuleBadge: string;
  futureModuleNotice: string;

  // Actions & Common
  searchPlaceholder: string;
  compose: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  refresh: string;
  retry: string;
  loading: string;
  empty: string;
  close: string;
  filter: string;
  export: string;
  signInWithGoogle: string;
  signOut: string;
  profile: string;
  preferences: string;
  language: string;
  theme: string;
  lightMode: string;
  darkMode: string;
  systemDefault: string;
  english: string;
  arabic: string;
  timezone: string;
  status: string;
  active: string;
  inactive: string;

  // Dashboard / Home (DASH-001)
  dashWelcome: string;
  dashSubtitle: string;
  dashQuickStats: string;
  dashUnreadMail: string;
  dashUpcomingEvents: string;
  dashPendingTasks: string;
  dashScheduledActions: string;
  dashRecentCommunications: string;
  dashAgendaToday: string;
  dashAiInsights: string;
  dashConnectedAccounts: string;
  dashConnectPrompt: string;

  // Mail View
  mailInbox: string;
  mailSent: string;
  mailDrafts: string;
  mailFlagged: string;
  mailArchive: string;
  mailSelectMessage: string;
  mailNoMessages: string;
  mailNoMessagesDesc: string;
  mailReply: string;
  mailForward: string;
  mailGenerateAiDraft: string;

  // Calendar View
  calendarToday: string;
  calendarNewEvent: string;
  calendarUpcoming: string;
  calendarNoEvents: string;
  calendarNoEventsDesc: string;
  calendarJoinMeeting: string;

  // Tasks View
  tasksTitle: string;
  tasksNewTask: string;
  tasksPriority: string;
  tasksDueDate: string;
  tasksSource: string;
  tasksNoTasks: string;
  tasksNoTasksDesc: string;
  tasksMarkComplete: string;

  // Scheduled View
  scheduledTitle: string;
  scheduledSubtitle: string;
  scheduledNewAction: string;
  scheduledNoActions: string;
  scheduledNoActionsDesc: string;
  scheduledQueue: string;

  // Contacts View
  contactsTitle: string;
  contactsNewContact: string;
  contactsCompany: string;
  contactsEmail: string;
  contactsPhone: string;
  contactsNoContacts: string;
  contactsNoContactsDesc: string;

  // AI Assistant View
  aiTitle: string;
  aiSubtitle: string;
  aiSummarizeAction: string;
  aiDraftAction: string;
  aiExtractTasksAction: string;
  aiInputPlaceholder: string;
  aiGenerate: string;
  aiOutputTitle: string;

  // Settings View (ACC-001, UI-009)
  settingsTitle: string;
  settingsProfileTab: string;
  settingsAccountsTab: string;
  settingsPreferencesTab: string;
  settingsArchitectureTab: string;
  settingsDisplayName: string;
  settingsEmail: string;
  settingsProfileUpdated: string;
  settingsConnectedAccountsDesc: string;
  settingsArchitectureDesc: string;

  // Error & Empty States (UI-015, UI-016)
  errorTitle: string;
  errorGeneric: string;
  errorUnauthorized: string;
  errorNotFound: string;
  emptyTitle: string;
  emptyDesc: string;
  
  // Login / Auth (ACC-002, ACC-003)
  loginTitle: string;
  loginSubtitle: string;
  loginSecurityNotice: string;
  loginFeaturesTitle: string;
  loginFeature1: string;
  loginFeature2: string;
  loginFeature3: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'Business Communication OS',
    appTagline: 'Unified Provider-Agnostic Communication Infrastructure',
    navHome: 'Home',
    navMail: 'Mail',
    navCalendar: 'Calendar',
    navContacts: 'Contacts',
    navTasks: 'Tasks',
    navScheduled: 'Scheduled',
    navAI: 'AI Assistant',
    navSettings: 'Settings',

    navWhatsApp: 'WhatsApp Business',
    navAutomation: 'Automation',
    navCRM: 'CRM Light',
    navAnalytics: 'Analytics',
    futureModuleBadge: 'Phase 2',
    futureModuleNotice: 'This module is scheduled for upcoming Phase 2. Core adapter architecture is in place.',

    searchPlaceholder: 'Search messages, contacts, tasks (Ctrl+K)...',
    compose: 'New Message',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    refresh: 'Refresh',
    retry: 'Try Again',
    loading: 'Loading data...',
    empty: 'No records found',
    close: 'Close',
    filter: 'Filter',
    export: 'Export',
    signInWithGoogle: 'Sign in with Google',
    signOut: 'Sign Out',
    profile: 'Profile',
    preferences: 'Preferences',
    language: 'Language',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    systemDefault: 'System Default',
    english: 'English (US)',
    arabic: 'العربية (Arabic)',
    timezone: 'Timezone',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',

    dashWelcome: 'Welcome to Business Communication OS',
    dashSubtitle: 'Your unified operational hub for communication, tasks, and scheduling.',
    dashQuickStats: 'Operational Overview',
    dashUnreadMail: 'Unread Messages',
    dashUpcomingEvents: 'Upcoming Events',
    dashPendingTasks: 'Pending Tasks',
    dashScheduledActions: 'Scheduled Queue',
    dashRecentCommunications: 'Recent Communications',
    dashAgendaToday: "Today's Agenda",
    dashAiInsights: 'AI Operational Highlights',
    dashConnectedAccounts: 'Connected Providers',
    dashConnectPrompt: 'Manage connected communication providers via Settings.',

    mailInbox: 'Inbox',
    mailSent: 'Sent',
    mailDrafts: 'Drafts',
    mailFlagged: 'Starred',
    mailArchive: 'Archive',
    mailSelectMessage: 'Select a conversation from the list to view details',
    mailNoMessages: 'No messages found in this mailbox',
    mailNoMessagesDesc: 'Connect a provider account or sync incoming correspondence.',
    mailReply: 'Reply',
    mailForward: 'Forward',
    mailGenerateAiDraft: 'AI Draft Reply',

    calendarToday: 'Today',
    calendarNewEvent: 'New Event',
    calendarUpcoming: 'Upcoming Agenda',
    calendarNoEvents: 'No upcoming events found',
    calendarNoEventsDesc: 'Schedule meetings or synchronize your external calendar provider.',
    calendarJoinMeeting: 'Join Meeting',

    tasksTitle: 'Unified Task Management',
    tasksNewTask: 'Add Task',
    tasksPriority: 'Priority',
    tasksDueDate: 'Due Date',
    tasksSource: 'Source',
    tasksNoTasks: 'No active tasks found',
    tasksNoTasksDesc: 'Tasks extracted from correspondence or created manually appear here.',
    tasksMarkComplete: 'Mark Completed',

    scheduledTitle: 'Scheduled Actions & Follow-ups',
    scheduledSubtitle: 'Provider-agnostic execution queue for deferred communications and reminders.',
    scheduledNewAction: 'Schedule Action',
    scheduledNoActions: 'Execution queue is currently empty',
    scheduledNoActionsDesc: 'Automated follow-ups and deferred emails will be listed here.',
    scheduledQueue: 'Queue Items',

    contactsTitle: 'Contacts Directory',
    contactsNewContact: 'New Contact',
    contactsCompany: 'Company',
    contactsEmail: 'Email Address',
    contactsPhone: 'Phone',
    contactsNoContacts: 'No contacts recorded',
    contactsNoContactsDesc: 'Directory records across synced communication channels.',

    aiTitle: 'Business AI Intelligence',
    aiSubtitle: 'Server-side intelligent synthesis, drafting, and workflow extraction.',
    aiSummarizeAction: 'Summarize Thread',
    aiDraftAction: 'Draft Professional Reply',
    aiExtractTasksAction: 'Extract Tasks from Communication',
    aiInputPlaceholder: 'Paste message text, email content, or meeting transcript...',
    aiGenerate: 'Execute AI Analysis',
    aiOutputTitle: 'Generated Result',

    settingsTitle: 'System Settings & Preferences',
    settingsProfileTab: 'User Profile',
    settingsAccountsTab: 'Connected Accounts',
    settingsPreferencesTab: 'Localization & Theme',
    settingsArchitectureTab: 'Architecture Specs',
    settingsDisplayName: 'Display Name',
    settingsEmail: 'Email Address',
    settingsProfileUpdated: 'Profile updated successfully',
    settingsConnectedAccountsDesc: 'Manage provider integrations (Google Workspace, Microsoft 365, WhatsApp Business).',
    settingsArchitectureDesc: 'Technical specifications, domain entity schema, and security boundaries.',

    errorTitle: 'Operation Encountered an Issue',
    errorGeneric: 'An unexpected system error occurred while processing your request.',
    errorUnauthorized: 'Session expired or authentication credentials missing.',
    errorNotFound: 'The requested resource was not located.',
    emptyTitle: 'No Records Available',
    emptyDesc: 'There is no data to display for the current filter or selection.',

    loginTitle: 'Business Communication OS',
    loginSubtitle: 'Unified, provider-agnostic infrastructure for modern enterprise communication.',
    loginSecurityNotice: 'Enterprise-grade zero-trust authentication. Secrets are kept server-side.',
    loginFeaturesTitle: 'Unified Capabilities',
    loginFeature1: 'Provider-agnostic email, calendar, and task harmonization',
    loginFeature2: 'Bilingual English & Arabic architecture with native RTL support',
    loginFeature3: 'Server-side AI synthesis and automated follow-up scheduling',
  },
  ar: {
    appName: 'نظام اتصالات الأعمال',
    appTagline: 'البنية التحتية الموحدة للاتصالات المستقلة عن موفري الخدمة',
    navHome: 'الرئيسية',
    navMail: 'البريد',
    navCalendar: 'التقويم',
    navContacts: 'جهات الاتصال',
    navTasks: 'المهام',
    navScheduled: 'المجدولة',
    navAI: 'المساعد الذكي',
    navSettings: 'الإعدادات',

    navWhatsApp: 'واتساب للأعمال',
    navAutomation: 'الأتمتة',
    navCRM: 'إدارة العلاقات',
    navAnalytics: 'التحليلات',
    futureModuleBadge: 'المرحلة 2',
    futureModuleNotice: 'هذه الوحدة مجدولة للمرحلة القادمة. بنية المحولات جاهزة تماماً للدمج.',

    searchPlaceholder: 'البحث في الرسائل، جهات الاتصال، والمهام (Ctrl+K)...',
    compose: 'رسالة جديدة',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    refresh: 'تحديث',
    retry: 'إعادة المحاولة',
    loading: 'جاري تحميل البيانات...',
    empty: 'لا توجد سجلات',
    close: 'إغلاق',
    filter: 'تصفية',
    export: 'تصدير',
    signInWithGoogle: 'تسجيل الدخول عبر Google',
    signOut: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    preferences: 'التفضيلات',
    language: 'اللغة',
    theme: 'المظهر',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    systemDefault: 'افتراضي النظام',
    english: 'English (US)',
    arabic: 'العربية (Arabic)',
    timezone: 'المنطقة الزمنية',
    status: 'الحالة',
    active: 'نشط',
    inactive: 'غير نشط',

    dashWelcome: 'مرحباً بك في نظام اتصالات الأعمال',
    dashSubtitle: 'مركزك التشغيلي الموحد للاتصالات، التقويم، المهام، والإجراءات المجدولة.',
    dashQuickStats: 'نظرة تشغيلية عامة',
    dashUnreadMail: 'رسائل غير مقروءة',
    dashUpcomingEvents: 'الأحداث القادمة',
    dashPendingTasks: 'مهام قيد الانتظار',
    dashScheduledActions: 'طابور الجدولة',
    dashRecentCommunications: 'أحدث الاتصالات',
    dashAgendaToday: 'جدول أعمال اليوم',
    dashAiInsights: 'أبرز الرؤى الذكية',
    dashConnectedAccounts: 'المزودات المتصلة',
    dashConnectPrompt: 'يمكنك إدارة مزودات الاتصال عبر صفحة الإعدادات.',

    mailInbox: 'صندوق الوارد',
    mailSent: 'المرسل',
    mailDrafts: 'المسودات',
    mailFlagged: 'المميزة بنجمة',
    mailArchive: 'الأرشيف',
    mailSelectMessage: 'اختر محادثة من القائمة لعرض تفاصيلها',
    mailNoMessages: 'لا توجد رسائل في هذا المجلد',
    mailNoMessagesDesc: 'قم بربط حساب مزود الخدمة لمزامنة الرسائل الواردة.',
    mailReply: 'رد',
    mailForward: 'إعادة توجيه',
    mailGenerateAiDraft: 'مسودة ذكية بالذكاء الاصطناعي',

    calendarToday: 'اليوم',
    calendarNewEvent: 'حدث جديد',
    calendarUpcoming: 'جدول الأعمال القادم',
    calendarNoEvents: 'لا توجد فعاليات قادمة',
    calendarNoEventsDesc: 'قم بجدولة اجتماعاتك أو مزامنة تقويمك الخارجي.',
    calendarJoinMeeting: 'انضمام للاجتماع',

    tasksTitle: 'إدارة المهام الموحدة',
    tasksNewTask: 'إضافة مهمة',
    tasksPriority: 'الأولوية',
    tasksDueDate: 'تاريخ الاستحقاق',
    tasksSource: 'المصدر',
    tasksNoTasks: 'لا توجد مهام نشطة حالياً',
    tasksNoTasksDesc: 'المهام المستخرجة من المراسلات أو المدخلة يدوياً ستظهر هنا.',
    tasksMarkComplete: 'تحديد كمكتمل',

    scheduledTitle: 'الإجراءات والمتابعات المجدولة',
    scheduledSubtitle: 'طابور تنفيذ مستقل عن الموفر للرسائل المؤجلة والتذكيرات الدورية.',
    scheduledNewAction: 'جدولة إجراء جديد',
    scheduledNoActions: 'طابور التنفيذ فارغ حالياً',
    scheduledNoActionsDesc: 'المتابعات التلقائية والرسائل المؤجلة ستظهر هنا.',
    scheduledQueue: 'عناصر الطابور',

    contactsTitle: 'دليل جهات الاتصال',
    contactsNewContact: 'جهة اتصال جديدة',
    contactsCompany: 'الشركة / المؤسسة',
    contactsEmail: 'البريد الإلكتروني',
    contactsPhone: 'رقم الهاتف',
    contactsNoContacts: 'لا توجد جهات اتصال مسجلة',
    contactsNoContactsDesc: 'دليل شامل عبر جميع قنوات الاتصال المتزامنة.',

    aiTitle: 'ذكاء الأعمال الاصطناعي',
    aiSubtitle: 'تحليل وتلخيص وصياغة ذكية من جانب الخادم دون كشف المفاتيح.',
    aiSummarizeAction: 'تلخيص المحادثة',
    aiDraftAction: 'صياغة رد مهني',
    aiExtractTasksAction: 'استخراج المهام من المراسلات',
    aiInputPlaceholder: 'أدخل نص الرسالة، محتوى البريد، أو محضر الاجتماع...',
    aiGenerate: 'تشغيل التحليل الذكي',
    aiOutputTitle: 'النتيجة المستخرجة',

    settingsTitle: 'إعدادات النظام والتفضيلات',
    settingsProfileTab: 'الملف الشخصي',
    settingsAccountsTab: 'الحسابات المتصلة',
    settingsPreferencesTab: 'اللغة والمظهر',
    settingsArchitectureTab: 'المواصفات المعمارية',
    settingsDisplayName: 'الاسم المعروض',
    settingsEmail: 'عنوان البريد الإلكتروني',
    settingsProfileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    settingsConnectedAccountsDesc: 'إدارة عمليات ربط المزودات (Google Workspace، Microsoft 365، واتساب للأعمال).',
    settingsArchitectureDesc: 'المواصفات التقنية ومخطط الكيانات والحدود الأمنية للنظام.',

    errorTitle: 'حدث خطأ أثناء العملية',
    errorGeneric: 'حدث خطأ غير متوقع أثناء معالجة طلبك.',
    errorUnauthorized: 'انتهت الجلسة أو بيانات الاعتماد غير متوفرة.',
    errorNotFound: 'المورد المطلوب غير موجود.',
    emptyTitle: 'لا توجد بيانات متاحة',
    emptyDesc: 'لا تتوفر عناصر للعرض وفق التصفية الحالية.',

    loginTitle: 'نظام اتصالات الأعمال',
    loginSubtitle: 'البنية التحتية الموحدة والمستقلة عن موفري الخدمة لاتصالات المؤسسات الحديثة.',
    loginSecurityNotice: 'مصادقة آمنة بمستويات أمان متقدمة. جميع المفاتيح محفوظة على جانب الخادم.',
    loginFeaturesTitle: 'الإمكانيات الموحدة',
    loginFeature1: 'تناغم شامل بين البريد والتقويم والمهام عبر شاشة واحدة',
    loginFeature2: 'بنية ثنائية اللغة تدعم العربية والإنجليزية مع تخطيط RTL أصيل',
    loginFeature3: 'تحليلات ذكية من جانب الخادم وجدولة متابعات تلقائية',
  }
};
