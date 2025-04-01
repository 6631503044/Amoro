"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Localization from "expo-localization"
import { I18n } from "i18n-js"
import { format as dateFnsFormat } from "date-fns"
import { th, enUS } from "date-fns/locale"

// Define available languages
export const LANGUAGES = [
  { id: "en", name: "English" },
  { id: "th", name: "Thai" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
]

// Define the translations
const translations = {
  en: {
    // Profile screen
    profile: "Profile",
    editProfile: "Edit Profile",
    changePassword: "Change Password",
    darkMode: "Dark Mode",
    notifications: "Notifications",
    language: "Language",
    permissions: "Permissions",
    logOut: "Log Out",
    addPartner: "Add Partner",
    connectWithPartner: "Connect with your partner",
    yourPartner: "Your Partner",
    invitations: "Invitations",
    noNewInvitations: "No new invitations",
    youHaveNewInvitation: "You have a new invitation",
    partnerInvitations: "Partner Invitations",
    noInvitationsYet: "You don't have any invitations yet",
    close: "Close",
    accept: "Accept",
    reject: "Reject",
    settings: "Settings",
    account: "Account",
    with: "with",

    // Add Review screen
    addReview: "Add Review",
    howWasYourMood: "How was your mood?",
    howWasYourExperience: "How was your experience?",
    addNoteOptional: "Add a note (optional)",
    shareYourThoughts: "Share your thoughts about this activity...",
    saveReview: "Save Review",

    // Moods
    mood_happy: "Happy",
    mood_relaxed: "Relaxed",
    mood_excited: "Excited",
    mood_romantic: "Romantic",
    mood_tired: "Tired",
    mood_bored: "Bored",

    // Notifications screen
    minAgo: "min ago",
    hoursAgo: "hours ago",
    noNotifications: "No Notifications",
    noNotificationsMessage: "You don't have any notifications at the moment",

    // Show Task screen
    activityDetails: "Activity Details",
    time: "Time",
    location: "Location",
    withPartner: "With Partner",
    notification: "Notification",
    atTimeOfEvent: "At time of event",
    minutesBefore: "minutes before",
    description: "Description",
    edit: "Edit",
    complete: "Complete",
    yes: "Yes",
    no: "No",

    // Moods screen
    moods: "Moods",
    reviewAndRate: "Review and rate your past activities",
    searchActivities: "Search activities...",
    filterActivities: "Filter Activities",
    allActivities: "All Activities",
    singleActivities: "Single Activities",
    partnerActivities: "Partner Activities",
    clearFilter: "Clear Filter",
    day: "Day",
    week: "Week",
    month: "Month",
    noActivitiesFound: "No activities found matching your filters",
    single: "Single",
    partner: "Partner",

    // Notification types and messages
    reminder: "Reminder",
    request: "Request",
    activity: "Activity",
    review: "Review",
    dinnerDate: "Dinner Date",
    dinnerDateReminder: "Reminder: You have a dinner date in 30 minutes",
    partnerRequest: "Partner Request",
    partnerRequestMessage: "Jane Doe has sent you a partner request",
    movieNight: "Movie Night",
    movieNightReminder: "Reminder: Movie night starts in 1 hour",
    activityAdded: "Activity Added",
    activityAddedMessage: 'Your partner added "Shopping Trip" to your calendar',
    reviewRequest: "Review Request",
    reviewRequestMessage: "How was your Beach Day? Add a review now!",

    // Months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",

    // Short months
    jan: "Jan",
    feb: "Feb",
    mar: "Mar",
    apr: "Apr",
    may_short: "May",
    jun: "Jun",
    jul: "Jul",
    aug: "Aug",
    sep: "Sep",
    oct: "Oct",
    nov: "Nov",
    dec: "Dec",

    // Days of week
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",

    // Short days
    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",

    // Date formats
    dateFormat: "MMMM d, yyyy",
    dateTimeFormat: "MMMM d, yyyy 'at' h:mm a",
    shortDateFormat: "MMM d",
    timeFormat: "h:mm a",

    // Home screen
    homeTitle: "Amoro",
    activities: "Activities",
    viewAll: "View All",
    noActivities: "No activities for this day",
    addActivity: "Add Activity",
  },
  th: {
    // Profile screen
    profile: "โปรไฟล์",
    editProfile: "แก้ไขโปรไฟล์",
    changePassword: "เปลี่ยนรหัสผ่าน",
    darkMode: "โหมดมืด",
    notifications: "การแจ้งเตือน",
    language: "ภาษา",
    permissions: "สิทธิ์",
    logOut: "ออกจากระบบ",
    addPartner: "เพิ่มคู่",
    connectWithPartner: "เชื่อมต่อกับคู่ของคุณ",
    yourPartner: "คู่ของคุณ",
    invitations: "คำเชิญ",
    noNewInvitations: "ไม่มีคำเชิญใหม่",
    youHaveNewInvitation: "คุณมีคำเชิญใหม่",
    partnerInvitations: "คำเชิญจากคู่",
    noInvitationsYet: "คุณยังไม่มีคำเชิญ",
    close: "ปิด",
    accept: "ยอมรับ",
    reject: "ปฏิเสธ",
    settings: "ตั้งค่า",
    account: "บัญชี",
    with: "กับ",

    // Add Review screen
    addReview: "เพิ่มรีวิว",
    howWasYourMood: "อารมณ์ของคุณเป็นอย่างไร?",
    howWasYourExperience: "ประสบการณ์ของคุณเป็นอย่างไร?",
    addNoteOptional: "เพิ่มบันทึก (ไม่บังคับ)",
    shareYourThoughts: "แบ่งปันความคิดของคุณเกี่ยวกับกิจกรรมนี้...",
    saveReview: "บันทึกรีวิว",

    // Moods
    mood_happy: "มีความสุข",
    mood_relaxed: "ผ่อนคลาย",
    mood_excited: "ตื่นเต้น",
    mood_romantic: "โรแมนติก",
    mood_tired: "เหนื่อย",
    mood_bored: "เบื่อ",

    // Notifications screen
    minAgo: "นาทีที่แล้ว",
    hoursAgo: "ชั่วโมงที่แล้ว",
    noNotifications: "ไม่มีการแจ้งเตือน",
    noNotificationsMessage: "คุณไม่มีการแจ้งเตือนในขณะนี้",

    // Show Task screen
    activityDetails: "รายละเอียดกิจกรรม",
    time: "เวลา",
    location: "สถานที่",
    withPartner: "กับคู่",
    notification: "การแจ้งเตือน",
    atTimeOfEvent: "ณ เวลาของกิจกรรม",
    minutesBefore: "นาทีก่อน",
    description: "คำอธิบาย",
    edit: "แก้ไข",
    complete: "เสร็จสิ้น",
    yes: "ใช่",
    no: "ไม่",

    // Moods screen
    moods: "อารมณ์",
    reviewAndRate: "รีวิวและให้คะแนนกิจกรรมที่ผ่านมาของคุณ",
    searchActivities: "ค้นหากิจกรรม...",
    filterActivities: "กรองกิจกรรม",
    allActivities: "กิจกรรมทั้งหมด",
    singleActivities: "กิจกรรมส่วนตัว",
    partnerActivities: "กิจกรรมกับคู่",
    clearFilter: "ล้างตัวกรอง",
    day: "วัน",
    week: "สัปดาห์",
    month: "เดือน",
    noActivitiesFound: "ไม่พบกิจกรรมที่ตรงกับตัวกรองของคุณ",
    single: "ส่วนตัว",
    partner: "คู่",

    // Notification types and messages
    reminder: "การเตือน",
    request: "คำขอ",
    activity: "กิจกรรม",
    review: "รีวิว",
    dinnerDate: "นัดทานอาหารเย็น",
    dinnerDateReminder: "เตือนความจำ: คุณมีนัดทานอาหารเย็นในอีก 30 นาที",
    partnerRequest: "คำขอเป็นคู่",
    partnerRequestMessage: "Jane Doe ได้ส่งคำขอเป็นคู่ให้คุณ",
    movieNight: "คืนดูหนัง",
    movieNightReminder: "เตือนความจำ: คืนดูหนังจะเริ่มในอีก 1 ชั่วโมง",
    activityAdded: "เพิ่มกิจกรรมแล้ว",
    activityAddedMessage: 'คู่ของคุณได้เพิ่ม "ไปช็อปปิ้ง" ลงในปฏิทินของคุณ',
    reviewRequest: "ขอให้รีวิว",
    reviewRequestMessage: "วันไปเที่ยวชายหาดเป็นอย่างไรบ้าง? เพิ่มรีวิวตอนนี้!",

    // Months
    january: "มกราคม",
    february: "กุมภาพันธ์",
    march: "มีนาคม",
    april: "เมษายน",
    may: "พฤษภาคม",
    june: "มิถุนายน",
    july: "กรกฎาคม",
    august: "สิงหาคม",
    september: "กันยายน",
    october: "ตุลาคม",
    november: "พฤศจิกายน",
    december: "ธันวาคม",

    // Short months
    jan: "ม.ค.",
    feb: "ก.พ.",
    mar: "มี.ค.",
    apr: "เม.ย.",
    may_short: "พ.ค.",
    jun: "มิ.ย.",
    jul: "ก.ค.",
    aug: "ส.ค.",
    sep: "ก.ย.",
    oct: "ต.ค.",
    nov: "พ.ย.",
    dec: "ธ.ค.",

    // Days of week
    sunday: "วันอาทิตย์",
    monday: "วันจันทร์",
    tuesday: "วันอังคาร",
    wednesday: "วันพุธ",
    thursday: "วันพฤหัสบดี",
    friday: "วันศุกร์",
    saturday: "วันเสาร์",

    // Short days
    sun: "อา.",
    mon: "จ.",
    tue: "อ.",
    wed: "พ.",
    thu: "พฤ.",
    fri: "ศ.",
    sat: "ส.",

    // Date formats
    dateFormat: "d MMMM yyyy",
    dateTimeFormat: "d MMMM yyyy เวลา h:mm a",
    shortDateFormat: "d MMM",
    timeFormat: "h:mm a",

    // Home screen
    homeTitle: "อะโมโร",
    activities: "กิจกรรม",
    viewAll: "ดูทั้งหมด",
    noActivities: "ไม่มีกิจกรรมสำหรับวันนี้",
    addActivity: "เพิ่มกิจกรรม",
  },
  es: {
    // Profile screen
    profile: "Perfil",
    editProfile: "Editar Perfil",
    changePassword: "Cambiar Contraseña",
    darkMode: "Modo Oscuro",
    notifications: "Notificaciones",
    language: "Idioma",
    permissions: "Permisos",
    logOut: "Cerrar Sesión",
    addPartner: "Añadir Pareja",
    connectWithPartner: "Conectar con tu pareja",
    yourPartner: "Tu Pareja",
    invitations: "Invitaciones",
    noNewInvitations: "No hay nuevas invitaciones",
    youHaveNewInvitation: "Tienes una nueva invitación",
    partnerInvitations: "Invitaciones de Pareja",
    noInvitationsYet: "Aún no tienes invitaciones",
    close: "Cerrar",
    accept: "Aceptar",
    reject: "Rechazar",
    settings: "Configuración",
    account: "Cuenta",
    with: "con",

    // Add Review screen
    addReview: "Añadir Reseña",
    howWasYourMood: "¿Cómo estaba tu estado de ánimo?",
    howWasYourExperience: "¿Cómo fue tu experiencia?",
    addNoteOptional: "Añadir una nota (opcional)",
    shareYourThoughts: "Comparte tus pensamientos sobre esta actividad...",
    saveReview: "Guardar Reseña",

    // Moods
    mood_happy: "Feliz",
    mood_relaxed: "Relajado",
    mood_excited: "Emocionado",
    mood_romantic: "Romántico",
    mood_tired: "Cansado",
    mood_bored: "Aburrido",

    // Notifications screen
    minAgo: "min atrás",
    hoursAgo: "horas atrás",
    noNotifications: "Sin Notificaciones",
    noNotificationsMessage: "No tienes notificaciones en este momento",

    // Show Task screen
    activityDetails: "Detalles de la Actividad",
    time: "Hora",
    location: "Ubicación",
    withPartner: "Con Pareja",
    notification: "Notificación",
    atTimeOfEvent: "En el momento del evento",
    minutesBefore: "minutos antes",
    description: "Descripción",
    edit: "Editar",
    complete: "Completar",
    yes: "Sí",
    no: "No",

    // Moods screen
    moods: "Estados de Ánimo",
    reviewAndRate: "Revisa y califica tus actividades pasadas",
    searchActivities: "Buscar actividades...",
    filterActivities: "Filtrar Actividades",
    allActivities: "Todas las Actividades",
    singleActivities: "Actividades Individuales",
    partnerActivities: "Actividades con Pareja",
    clearFilter: "Borrar Filtro",
    day: "Día",
    week: "Semana",
    month: "Mes",
    noActivitiesFound: "No se encontraron actividades que coincidan con tus filtros",
    single: "Individual",
    partner: "Pareja",

    // Notification types and messages
    reminder: "Recordatorio",
    request: "Solicitud",
    activity: "Actividad",
    review: "Reseña",
    dinnerDate: "Cena Romántica",
    dinnerDateReminder: "Recordatorio: Tienes una cena romántica en 30 minutos",
    partnerRequest: "Solicitud de Pareja",
    partnerRequestMessage: "Jane Doe te ha enviado una solicitud de pareja",
    movieNight: "Noche de Cine",
    movieNightReminder: "Recordatorio: La noche de cine comienza en 1 hora",
    activityAdded: "Actividad Añadida",
    activityAddedMessage: 'Tu pareja añadió "Viaje de Compras" a tu calendario',
    reviewRequest: "Solicitud de Reseña",
    reviewRequestMessage: "¿Cómo estuvo tu Día de Playa? ¡Añade una reseña ahora!",

    // Months
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Octubre",
    november: "Noviembre",
    december: "Diciembre",

    // Short months
    jan: "Ene",
    feb: "Feb",
    mar: "Mar",
    apr: "Abr",
    may_short: "May",
    jun: "Jun",
    jul: "Jul",
    aug: "Ago",
    sep: "Sep",
    oct: "Oct",
    nov: "Nov",
    dec: "Dic",

    // Days of week
    sunday: "Domingo",
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",

    // Short days
    sun: "Dom",
    mon: "Lun",
    tue: "Mar",
    wed: "Mié",
    thu: "Jue",
    fri: "Vie",
    sat: "Sáb",

    // Date formats
    dateFormat: "d 'de' MMMM 'de' yyyy",
    dateTimeFormat: "d 'de' MMMM 'de' yyyy 'a las' h:mm a",
    shortDateFormat: "d MMM",
    timeFormat: "h:mm a",

    // Home screen
    homeTitle: "Amoro",
    activities: "Actividades",
    viewAll: "Ver Todo",
    noHayActivities: "No hay actividades para este día",
    addActivity: "Añadir Actividad",
  },
  fr: {
    // Profile screen
    profile: "Profil",
    editProfile: "Modifier le Profil",
    changePassword: "Changer le Mot de Passe",
    darkMode: "Mode Sombre",
    notifications: "Notifications",
    language: "Langue",
    permissions: "Autorisations",
    logOut: "Déconnexion",
    addPartner: "Ajouter un Partenaire",
    connectWithPartner: "Connectez-vous avec votre partenaire",
    yourPartner: "Votre Partenaire",
    invitations: "Invitations",
    noNewInvitations: "Pas de nouvelles invitations",
    youHaveNewInvitation: "Vous avez une nouvelle invitation",
    partnerInvitations: "Invitations de Partenaire",
    noInvitationsYet: "Vous n'avez pas encore d'invitations",
    close: "Fermer",
    accept: "Accepter",
    reject: "Refuser",
    settings: "Paramètres",
    account: "Compte",
    with: "avec",

    // Add Review screen
    addReview: "Ajouter un Avis",
    howWasYourMood: "Comment était votre humeur?",
    howWasYourExperience: "Comment était votre expérience?",
    addNoteOptional: "Ajouter une note (facultatif)",
    shareYourThoughts: "Partagez vos pensées sur cette activité...",
    saveReview: "Enregistrer l'Avis",

    // Moods
    mood_happy: "Heureux",
    mood_relaxed: "Détendu",
    mood_excited: "Excité",
    mood_romantic: "Romantique",
    mood_tired: "Fatigué",
    mood_bored: "Ennuyé",

    // Notifications screen
    minAgo: "min il y a",
    hoursAgo: "heures il y a",
    noNotifications: "Pas de Notifications",
    noNotificationsMessage: "Vous n'avez aucune notification pour le moment",

    // Show Task screen
    activityDetails: "Détails de l'Activité",
    time: "Heure",
    location: "Lieu",
    withPartner: "Avec Partenaire",
    notification: "Notification",
    atTimeOfEvent: "Au moment de l'événement",
    minutesBefore: "minutes avant",
    description: "Description",
    edit: "Modifier",
    complete: "Terminer",
    yes: "Oui",
    no: "Non",

    // Moods screen
    moods: "Humeurs",
    reviewAndRate: "Évaluez et notez vos activités passées",
    searchActivities: "Rechercher des activités...",
    filterActivities: "Filtrer les Activités",
    allActivities: "Toutes les Activités",
    singleActivities: "Activités Individuelles",
    partnerActivities: "Activités avec Partenaire",
    clearFilter: "Effacer le Filtre",
    day: "Jour",
    week: "Semaine",
    month: "Mois",
    noActivitiesFound: "Aucune activité correspondant à vos filtres",
    single: "Individuel",
    partner: "Partenaire",

    // Notification types and messages
    reminder: "Rappel",
    request: "Demande",
    activity: "Activité",
    review: "Avis",
    dinnerDate: "Dîner Romantique",
    dinnerDateReminder: "Rappel: Vous avez un dîner romantique dans 30 minutes",
    partnerRequest: "Demande de Partenaire",
    partnerRequestMessage: "Jane Doe vous a envoyé une demande de partenaire",
    movieNight: "Soirée Cinéma",
    movieNightReminder: "Rappel: La soirée cinéma commence dans 1 heure",
    activityAdded: "Activité Ajoutée",
    activityAddedMessage: 'Votre partenaire a ajouté "Sortie Shopping" à votre calendrier',
    reviewRequest: "Demande d'Avis",
    reviewRequestMessage: "Comment était votre Journée à la Plage? Ajoutez un avis maintenant!",

    // Months
    january: "Janvier",
    february: "Février",
    march: "Mars",
    april: "Avril",
    may: "Mai",
    june: "Juin",
    july: "Juillet",
    august: "Août",
    september: "Septembre",
    october: "Octobre",
    november: "Novembre",
    december: "Décembre",

    // Short months
    jan: "Jan",
    feb: "Fév",
    mar: "Mar",
    apr: "Avr",
    may_short: "Mai",
    jun: "Juin",
    jul: "Juil",
    aug: "Août",
    sep: "Sep",
    oct: "Oct",
    nov: "Nov",
    dec: "Déc",

    // Days of week
    sunday: "Dimanche",
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",

    // Short days
    sun: "Dim",
    mon: "Lun",
    tue: "Mar",
    wed: "Mer",
    thu: "Jeu",
    fri: "Ven",
    sat: "Sam",

    // Date formats
    dateFormat: "d MMMM yyyy",
    dateTimeFormat: "d MMMM yyyy 'à' h:mm a",
    shortDateFormat: "d MMM",
    timeFormat: "h:mm a",

    // Home screen
    homeTitle: "Amoro",
    activities: "Activités",
    viewAll: "Voir Tout",
    noActivities: "Pas d'activités pour ce jour",
    addActivity: "Ajouter une Activité",
  },
}

// Create the i18n instance
const i18n = new I18n(translations)

// Set the default locale
i18n.defaultLocale = "en"
i18n.enableFallback = true

// Define the context type
type LanguageContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, params?: object) => string
  getLocaleDisplayName: (localeId: string) => string
  formatDate: (date: Date | string, formatType?: string) => string
  getNotificationTitle: (type: string, title: string) => string
  getNotificationMessage: (type: string, message: string) => string
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Create the provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState("en")

  // Load the saved locale on mount
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("userLocale")
        if (savedLocale) {
          setLocale(savedLocale)
        } else {
          // Use device locale as fallback
          const deviceLocale = Localization.locale.split("-")[0]
          // Check if device locale is supported
          if (Object.keys(translations).includes(deviceLocale)) {
            setLocale(deviceLocale)
          }
        }
      } catch (error) {
        console.error("Failed to load locale:", error)
      }
    }

    loadLocale()
  }, [])

  // Update i18n locale when locale changes
  useEffect(() => {
    i18n.locale = locale
    // Save the locale to AsyncStorage
    AsyncStorage.setItem("userLocale", locale).catch((error) => {
      console.error("Failed to save locale:", error)
    })
  }, [locale])

  // Translate function
  const t = (key: string, params?: object) => {
    return i18n.t(key, params)
  }

  // Get display name for a locale
  const getLocaleDisplayName = (localeId: string) => {
    const language = LANGUAGES.find((lang) => lang.id === localeId)
    return language ? language.name : localeId
  }

  // Format date based on locale
  const formatDate = (date: Date | string, formatType = "dateFormat") => {
    if (!date) return ""

    const dateObj = typeof date === "string" ? new Date(date) : date
    const format = t(formatType)
    const dateLocale = locale === "th" ? th : enUS

    try {
      // Use date-fns format with the appropriate locale
      return dateFnsFormat(dateObj, format, { locale: dateLocale })
    } catch (error) {
      console.error("Error formatting date:", error)
      return String(date)
    }
  }

  // Get translated notification title
  const getNotificationTitle = (type: string, title: string) => {
    // Map common notification titles to translation keys
    const titleMap = {
      "Dinner Date": "dinnerDate",
      "Partner Request": "partnerRequest",
      "Movie Night": "movieNight",
      "Activity Added": "activityAdded",
      "Review Request": "reviewRequest",
    }

    const key = titleMap[title]
    return key ? t(key) : title
  }

  // Get translated notification message
  const getNotificationMessage = (type: string, message: string) => {
    // Map common notification messages to translation keys
    const messageMap = {
      "Reminder: You have a dinner date in 30 minutes": "dinnerDateReminder",
      "Jane Doe has sent you a partner request": "partnerRequestMessage",
      "Reminder: Movie night starts in 1 hour": "movieNightReminder",
      'Your partner added "Shopping Trip" to your calendar': "activityAddedMessage",
      "How was your Beach Day? Add a review now!": "reviewRequestMessage",
    }

    const key = messageMap[message]
    return key ? t(key) : message
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        getLocaleDisplayName,
        formatDate,
        getNotificationTitle,
        getNotificationMessage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// Create a hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

