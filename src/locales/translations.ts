export type Language = "ka" | "en" | "ru" | "fr";

export const translations = {
  ka: {
    hero: {
      invite: "გიწვევთ\nლევანისა და ანნის\nბედნიერების გასაზიარებლად",
      dear: "ძვირფასო",
      country: "საქართველო",
      scrollDown: "შემდეგ სექციაზე გადასვლა",
    },
    countdown: {
      title: "დრო ქორწილამდე",
      subtitle: "ჩვენი ცხოვრების ყველაზე გამორჩეულ დღემდე",
      days: "დღე",
      hours: "საათი",
      minutes: "წუთი",
      seconds: "წამი",
    },
    location: {
      title: "ადგილმდებარეობა",
      desc: "ჯვრისწერა მცხეთაში.",
      btn: "რუკაზე გახსნა",
      church: {
        ceremonyGeo: "ჯვრისწერა",
        ceremonyLabel: "ჯვრისწერა",
        venue: "სვეტიცხოვლის საკათედრო ტაძარი",
        vicinity: "მცხეთა",
        time: "14:00",
        imageAlt: "სვეტიცხოვლის ტაძარი, მცხეთა",
      },
      villa: {
        sectionLabel: "ძირითადი ღონისძიება",
        venue: "ვილა მოსავალი",
        vicinity: "ახალუბანი, მცხეთის მუნიციპალიტეტი",
        time: "16:00-დან",
        imageAlt: "ვილა მოსავალი",
      },
    },
    timetable: {
      title: "განრიგი",
      subtitle: "რას გიმზადებთ ამ დღისთვის",
      items: [
        { time: "14:00", title: "ჯვრისწერა", desc: "საეკლესიო რიტუალი" },
        { time: "16:00", title: "Welcome", desc: "სტუმრების მიღება" },
        { time: "16:30", title: "ხელმოწერის ცერემონია", desc: "ოფიციალური ნაწილი" },
        { time: "17:00", title: "გალა ვახშამი", desc: "სადღესასწაულო ბანკეტი" },
      ]
    },
    dresscode: {
      title: "დრესკოდი",
      desc: "საღამოს ფორმალური",
    },
    balcony: {
      open: "გახსნა"
    },
    rsvp: {
      title: "დასწრება",
      subtitle: "გთხოვთ, დაადასტურეთ თქვენი მონაწილეობა",
      firstName: "სახელი",
      lastName: "გვარი",
      attendingQuestion: "გვეწვევით?",
      yes: "დიახ",
      no: "არა",
      submit: "გაგზავნა",
      sending: "იგზავნება…",
      thankYou: "გმადლობთ! თქვენი პასუხი მიღებულია.",
      errorGeneric: "რაღაც შეცდომა მოხდა. სცადეთ ხელახლა.",
      validation: "გთხოვთ, შეავსოთ ყველა ველი.",
    },
  },
  en: {
    hero: {
      invite: "We invite you\nto share the happiness of\nLevani and Anni",
      dear: "Dear",
      country: "Georgia",
      scrollDown: "Scroll to the next section",
    },
    countdown: {
      title: "Time until wedding",
      subtitle: "For the most special day of our lives",
      days: "Days",
      hours: "Hours",
      minutes: "Mins",
      seconds: "Secs",
    },
    location: {
      title: "Location",
      desc: "Ceremony in Mtskheta, then celebration at Villa Mosavali.",
      btn: "Open in Maps",
      church: {
        ceremonyGeo: "ჯვრისწერა",
        ceremonyLabel: "Religious ceremony",
        venue: "Svetitskhoveli Cathedral",
        vicinity: "Mtskheta",
        time: "14:00",
        imageAlt: "Svetitskhoveli Cathedral, Mtskheta",
      },
      villa: {
        sectionLabel: "Main celebration",
        venue: "Villa Mosavali",
        vicinity: "Akhalubani, Mtskheta region",
        time: "From 16:00",
        imageAlt: "Villa Mosavali",
      },
    },
    timetable: {
      title: "Timetable",
      subtitle: "What we have prepared for you",
      items: [
        { time: "14:00", title: "Church Ceremony", desc: "Religious ceremony" },
        { time: "16:00", title: "Welcome", desc: "Welcome drinks" },
        { time: "16:30", title: "Civil Ceremony", desc: "Official signing" },
        { time: "17:00", title: "Gala Dinner", desc: "Celebration banquet" },
      ]
    },
    dresscode: {
      title: "Dress Code",
      desc: "evening formal",
    },
    balcony: {
      open: "OPEN"
    },
    rsvp: {
      title: "RSVP",
      subtitle: "Please let us know if you can join us",
      firstName: "First name",
      lastName: "Surname",
      attendingQuestion: "Will you attend?",
      yes: "Yes",
      no: "No",
      submit: "Send",
      sending: "Sending…",
      thankYou: "Thank you! We have received your reply.",
      errorGeneric: "Something went wrong. Please try again.",
      validation: "Please fill in every field.",
    },
  },
  ru: {
    hero: {
      invite: "Приглашаем вас\nразделить счастье\nЛевани и Анни",
      dear: "Дорогой(ая)",
      country: "Грузия",
      scrollDown: "Перейти к следующему разделу",
    },
    countdown: {
      title: "До свадьбы осталось",
      subtitle: "Для самого особенного дня в нашей жизни",
      days: "Дней",
      hours: "Часов",
      minutes: "Минут",
      seconds: "Секунд",
    },
    location: {
      title: "Место проведения",
      desc: "Церемония в Мцхете, затем празднование в Villa Mosavali.",
      btn: "Открыть в картах",
      church: {
        ceremonyGeo: "ჯვრისწერა",
        ceremonyLabel: "Церковная церемония",
        venue: "Собор Светицховели",
        vicinity: "Мцхета",
        time: "14:00",
        imageAlt: "Собор Светицховели, Мцхета",
      },
      villa: {
        sectionLabel: "Основное торжество",
        venue: "Villa Mosavali",
        vicinity: "Ахалубани, Мцхета-Мтианети",
        time: "С 16:00",
        imageAlt: "Villa Mosavali",
      },
    },
    timetable: {
      title: "Расписание",
      subtitle: "Что мы приготовили для вас",
      items: [
        { time: "14:00", title: "Венчание", desc: "Церковный обряд" },
        { time: "16:00", title: "Welcome", desc: "Встреча гостей" },
        { time: "16:30", title: "Церемония", desc: "Официальная роспись" },
        { time: "17:00", title: "Гала-ужин", desc: "Праздничный банкет" },
      ]
    },
    dresscode: {
      title: "Дресс-код",
      desc: "вечерний формальный стиль",
    },
    balcony: {
      open: "ОТКРЫТЬ"
    },
    rsvp: {
      title: "Ответ на приглашение",
      subtitle: "Подтвердите, пожалуйста, ваше участие",
      firstName: "Имя",
      lastName: "Фамилия",
      attendingQuestion: "Вы сможете прийти?",
      yes: "Да",
      no: "Нет",
      submit: "Отправить",
      sending: "Отправка…",
      thankYou: "Спасибо! Мы получили ваш ответ.",
      errorGeneric: "Что-то пошло не так. Попробуйте ещё раз.",
      validation: "Пожалуйста, заполните все поля.",
    },
  },
  fr: {
    hero: {
      invite: "Nous vous invitons\nà partager le bonheur de\nLevani et Anni",
      dear: "Cher(e)",
      country: "Géorgie",
      scrollDown: "Aller à la section suivante",
    },
    countdown: {
      title: "Temps avant le mariage",
      subtitle: "Pour le jour le plus spécial de nos vies",
      days: "Jours",
      hours: "Heures",
      minutes: "Min",
      seconds: "Sec",
    },
    location: {
      title: "Emplacement",
      desc: "Cérémonie à Mtskheta, puis réception à la Villa Mosavali.",
      btn: "Ouvrir dans Maps",
      church: {
        ceremonyGeo: "ჯვრისწერა",
        ceremonyLabel: "Cérémonie religieuse",
        venue: "Cathédrale de Svetitskhoveli",
        vicinity: "Mtskheta",
        time: "14 h 00",
        imageAlt: "Cathédrale de Svetitskhoveli, Mtskheta",
      },
      villa: {
        sectionLabel: "Célébration principale",
        venue: "Villa Mosavali",
        vicinity: "Akhalubani, région de Mtskheta",
        time: "À partir de 16 h 00",
        imageAlt: "Villa Mosavali",
      },
    },
    timetable: {
      title: "Programme",
      subtitle: "Ce que nous avons préparé pour vous",
      items: [
        { time: "14:00", title: "Cérémonie religieuse", desc: "Mariage à l'église" },
        { time: "16:00", title: "Welcome", desc: "Verre de bienvenue" },
        { time: "16:30", title: "Cérémonie civile", desc: "Signatures officielles" },
        { time: "17:00", title: "Dîner de gala", desc: "Banquet de célébration" },
      ]
    },
    dresscode: {
      title: "Code vestimentaire",
      desc: "tenue de soirée formelle",
    },
    balcony: {
      open: "OUVRIR"
    },
    rsvp: {
      title: "RSVP",
      subtitle: "Merci de nous confirmer votre présence",
      firstName: "Prénom",
      lastName: "Nom",
      attendingQuestion: "Serez-vous des nôtres ?",
      yes: "Oui",
      no: "Non",
      submit: "Envoyer",
      sending: "Envoi…",
      thankYou: "Merci ! Nous avons bien reçu votre réponse.",
      errorGeneric: "Une erreur s’est produite. Réessayez plus tard.",
      validation: "Veuillez remplir tous les champs.",
    },
  }
};
