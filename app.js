const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const menuToggleIcon = menuToggle?.querySelector(".menu-toggle-icon");

if (menuToggle && siteNav) {
    const closeMenu = () => {
        siteNav.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        if (menuToggleIcon) menuToggleIcon.textContent = "☰";
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
        siteNav.classList.toggle("show", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        if (menuToggleIcon) menuToggleIcon.textContent = isOpen ? "✕" : "☰";
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            siteNav.classList.contains("show") &&
            event.target instanceof Node &&
            !siteNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && siteNav.classList.contains("show")) {
            closeMenu();
            menuToggle.focus();
        }
    });

    window.matchMedia("(min-width: 681px)").addEventListener("change", closeMenu);
}

if ("IntersectionObserver" in window) {
    const sectionLinks = Array.from(document.querySelectorAll(".nav-links a"));
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            sectionLinks.forEach((link) => {
                const isCurrent = link.hash === `#${entry.target.id}`;
                link.classList.toggle("is-active", isCurrent);
                if (isCurrent) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-30% 0px -55% 0px" });

    sectionLinks.forEach((link) => {
        const section = document.querySelector(link.hash);
        if (section) sectionObserver.observe(section);
    });

    const revealElements = document.querySelectorAll(
        ".emotion-info-card, .mood-response, .quiz-card, .toolkit-item, .help-card"
    );
    if (revealElements.length) {
        document.body.classList.add("has-scroll-reveal");
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        revealElements.forEach((element) => {
            element.classList.add("scroll-reveal");
            revealObserver.observe(element);
        });
    }
}

const moodDetails = {
    alegría: {
        icon: "☀",
        title: "Qué bonito que la alegría esté aquí.",
        text: "¿Te gustaría saborear este momento o compartirlo con alguien? También puedes guardar qué lo hizo especial.",
        idea: "Disfruta algo pequeño que te guste y, si quieres, comparte tu alegría con alguien."
    },
    tristeza: {
        icon: "☁",
        title: "La tristeza merece un espacio amable.",
        text: "No tienes que apresurarte a sentirte diferente. ¿Qué te ayudaría un poquito ahora: compañía, descanso o expresarte?",
        idea: "Busca un lugar cómodo y considera contarle a alguien de confianza cómo te sientes."
    },
    enojo: {
        icon: "〰",
        title: "El enojo puede estar señalando algo importante.",
        text: "Antes de actuar, prueba hacer una pausa. Después puedes pensar qué límite o necesidad te gustaría comunicar.",
        idea: "Aléjate un momento si puedes; cuando estés listo, expresa qué te molestó sin lastimarte ni lastimar."
    },
    miedo: {
        icon: "♡",
        title: "Gracias por escuchar lo que te preocupa.",
        text: "El miedo intenta protegerte. Mira a tu alrededor y pregúntate: ¿estoy a salvo ahora?, ¿con quién podría hablar?",
        idea: "Nombra cinco cosas que ves y acércate a una persona con quien te sientas seguro."
    },
    calma: {
        icon: "≈",
        title: "Qué bien encontrar un momento de calma.",
        text: "Puedes notar qué te está ayudando a sentirte así y guardar esa idea para otro día.",
        idea: "Fíjate en qué te ayuda a estar en calma para recordarlo cuando lo necesites."
    },
    sorpresa: {
        icon: "✦",
        title: "La sorpresa puede abrir muchas preguntas.",
        text: "Date un instante para entender qué pasó. ¿Lo inesperado se siente agradable, difícil o un poco de ambas cosas?",
        idea: "Respira con naturalidad y date permiso para entender lo que ocurrió antes de responder."
    }
};

const moodOptions = document.querySelectorAll(".mood-option");
const responseIcon = document.getElementById("responseIcon");
const responseTitle = document.getElementById("responseTitle");
const responseText = document.getElementById("responseText");
const journalForm = document.getElementById("journalForm");
const journalNote = document.getElementById("journalNote");
const saveMoodButton = document.getElementById("saveMoodButton");
const journalMessage = document.getElementById("journalMessage");
const journalHistory = document.getElementById("journalHistory");
const moodStorageKey = "emociona-momentos-v1";
let selectedMood = "";

const featuredEmotions = [
    { mood: "alegría", emoji: "😊", caption: "deja que este instante bonito se quede un ratito" },
    { mood: "tristeza", emoji: "😔", caption: "aquí también hay espacio para los días nublados" },
    { mood: "enojo", emoji: "😠", caption: "tu emoción habla; tú decides qué hacer con ella" },
    { mood: "miedo", emoji: "😟", caption: "puedes ir paso a paso, no tienes que hacerlo a solas" },
    { mood: "calma", emoji: "😌", caption: "respira: este momento también es tuyo" },
    { mood: "sorpresa", emoji: "😮", caption: "lo inesperado también puede abrir algo nuevo" }
];
const emotionShowcase = document.getElementById("emotionShowcase");
const emotionScene = document.getElementById("emotionScene");
const featuredEmoji = document.getElementById("featuredEmoji");
const featuredMood = document.getElementById("featuredMood");
const featuredCaption = document.querySelector(".featured-caption");
const emotionCount = document.getElementById("emotionCount");
const previousEmotion = document.getElementById("previousEmotion");
const nextEmotion = document.getElementById("nextEmotion");
let featuredEmotionIndex = 0;
let featuredEmotionTimer = 0;

function showFeaturedEmotion(index) {
    featuredEmotionIndex = (index + featuredEmotions.length) % featuredEmotions.length;
    const emotion = featuredEmotions[featuredEmotionIndex];
    if (!emotion || !emotionScene || !featuredEmoji || !featuredMood) return;

    emotionScene.dataset.mood = emotion.mood;
    featuredEmoji.textContent = emotion.emoji;
    featuredMood.textContent = emotion.mood;
    if (featuredCaption) featuredCaption.textContent = emotion.caption;
    if (emotionCount) emotionCount.textContent = `${String(featuredEmotionIndex + 1).padStart(2, "0")} / ${String(featuredEmotions.length).padStart(2, "0")}`;
    emotionScene.classList.remove("is-changing");
    window.requestAnimationFrame(() => emotionScene.classList.add("is-changing"));
}

function moveFeaturedEmotion(direction) {
    showFeaturedEmotion(featuredEmotionIndex + direction);
}

function startFeaturedEmotionTimer() {
    if (featuredEmotionTimer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    featuredEmotionTimer = window.setInterval(() => moveFeaturedEmotion(1), 3000);
}

function stopFeaturedEmotionTimer() {
    window.clearInterval(featuredEmotionTimer);
    featuredEmotionTimer = 0;
}

if (previousEmotion && nextEmotion) {
    previousEmotion.addEventListener("click", () => moveFeaturedEmotion(-1));
    nextEmotion.addEventListener("click", () => moveFeaturedEmotion(1));
}

if (emotionShowcase) {
    emotionShowcase.addEventListener("pointerenter", stopFeaturedEmotionTimer);
    emotionShowcase.addEventListener("pointerleave", () => {
        if (!emotionShowcase.contains(document.activeElement)) startFeaturedEmotionTimer();
    });
    emotionShowcase.addEventListener("focusin", stopFeaturedEmotionTimer);
    emotionShowcase.addEventListener("focusout", () => {
        if (!emotionShowcase.matches(":hover") && !emotionShowcase.contains(document.activeElement)) {
            startFeaturedEmotionTimer();
        }
    });
}

showFeaturedEmotion(0);
startFeaturedEmotionTimer();

function readSavedMoments() {
    try {
        const saved = localStorage.getItem(moodStorageKey);
        if (!saved) return [];
        const moments = JSON.parse(saved);
        return Array.isArray(moments) ? moments.filter((moment) =>
            moment &&
            typeof moment.mood === "string" &&
            typeof moment.note === "string" &&
            typeof moment.date === "string"
        ) : [];
    } catch (error) {
        journalMessage.textContent = "No se pudieron leer tus momentos guardados en este dispositivo.";
        return [];
    }
}

function renderSavedMoments() {
    if (!journalHistory) return;
    journalHistory.replaceChildren();
    readSavedMoments().slice(0, 3).forEach((moment) => {
        const entry = document.createElement("article");
        entry.className = "journal-entry";
        const heading = document.createElement("strong");
        heading.textContent = `${moment.mood} · ${moment.date}`;
        const note = document.createElement("span");
        note.textContent = moment.note || "Me tomé un momento para escucharme.";
        entry.append(heading, note);
        journalHistory.appendChild(entry);
    });
}

moodOptions.forEach((option) => {
    option.addEventListener("click", () => {
        selectedMood = option.dataset.mood || "";
        moodOptions.forEach((item) => {
            item.setAttribute("aria-pressed", String(item === option));
        });
        const featuredEmotionIndexForMood = featuredEmotions.findIndex((emotion) => emotion.mood === selectedMood);
        if (featuredEmotionIndexForMood !== -1) showFeaturedEmotion(featuredEmotionIndexForMood);

        const detail = moodDetails[selectedMood];
        if (!detail || !responseIcon || !responseTitle || !responseText) return;
        responseIcon.textContent = detail.icon;
        responseTitle.textContent = detail.title;
        responseText.textContent = detail.text;
        if (journalNote) journalNote.placeholder = detail.idea;
        if (saveMoodButton) saveMoodButton.disabled = false;
        if (journalMessage) journalMessage.textContent = "Tus momentos se guardan solo en este dispositivo.";
    });
});

if (journalForm && journalNote && journalMessage) {
    journalForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!selectedMood) {
            journalMessage.textContent = "Elige primero la emoción que quieres guardar.";
            return;
        }

        const moments = readSavedMoments();
        moments.unshift({
            mood: selectedMood,
            note: journalNote.value.trim(),
            date: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short" })
        });

        try {
            localStorage.setItem(moodStorageKey, JSON.stringify(moments.slice(0, 30)));
            journalNote.value = "";
            journalMessage.textContent = "Tu momento quedó guardado en este dispositivo. ♡";
            renderSavedMoments();
        } catch (error) {
            journalMessage.textContent = "No se pudo guardar. Revisa el espacio disponible o la configuración del navegador.";
        }
    });
}

renderSavedMoments();

const quizQuestions = [
    {
        question: "Tu amiga parece triste y no quiere hablar todavía. ¿Qué podrías hacer?",
        answers: ["Insistir hasta que cuente todo", "Decirle que puede contar contigo cuando quiera", "Cambiar de tema y burlarte un poco"],
        correct: 1,
        feedback: "Ofrecer compañía sin presionar respeta su ritmo y le recuerda que no está sola."
    },
    {
        question: "Estás muy enojado después de una discusión. ¿Qué puede ayudarte antes de responder?",
        answers: ["Hacer una pausa y notar qué necesitas", "Enviar el primer mensaje que se te ocurra", "Guardar el enojo y fingir que no pasó"],
        correct: 0,
        feedback: "Una pausa puede ayudarte a expresar lo que pasó con más claridad y cuidado."
    },
    {
        question: "Sientes nervios antes de algo nuevo. ¿Qué frase es más amable contigo?",
        answers: ["No debería sentir esto", "Si tengo miedo, seguro saldrá mal", "Puedo sentir nervios y avanzar paso a paso"],
        correct: 2,
        feedback: "Puedes sentir nervios y aun así probar; ir paso a paso también cuenta."
    },
    {
        question: "Una emoción intensa no desaparece enseguida. ¿Qué recuerdas?",
        answers: ["Estoy haciendo algo mal", "Las emociones cambian y puedo pedir apoyo", "Tengo que resolverlo todo sin ayuda"],
        correct: 1,
        feedback: "Las emociones pueden tardar en cambiar. Buscar apoyo también es una herramienta."
    }
];

const quizProgress = document.getElementById("quizProgress");
const quizProgressBar = document.getElementById("quizProgressBar");
const quizScore = document.getElementById("quizScore");
const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");
const quizFeedback = document.getElementById("quizFeedback");
const quizNext = document.getElementById("quizNext");
let quizIndex = 0;
let score = 0;

function showQuizQuestion() {
    if (!quizQuestion || !quizAnswers || !quizProgress || !quizProgressBar || !quizNext) return;

    const question = quizQuestions[quizIndex];
    if (!question) {
        quizProgress.textContent = "RETO COMPLETADO";
        quizProgressBar.style.width = "100%";
        quizQuestion.textContent = `¡Terminaste! Tu puntaje fue ${score} de ${quizQuestions.length}.`;
        quizAnswers.replaceChildren();
        if (quizFeedback) {
            quizFeedback.textContent = "Cada respuesta es una oportunidad para practicar la empatía y el autocuidado.";
            quizFeedback.classList.remove("feedback-wrong");
        }
        quizNext.textContent = "Jugar de nuevo ↻";
        quizNext.hidden = false;
        return;
    }

    quizProgress.textContent = `RETO ${quizIndex + 1} DE ${quizQuestions.length}`;
    quizProgressBar.style.width = `${(quizIndex / quizQuestions.length) * 100}%`;
    quizQuestion.textContent = question.question;
    if (quizScore) quizScore.textContent = String(score);
    if (quizFeedback) {
        quizFeedback.textContent = "";
        quizFeedback.classList.remove("feedback-wrong");
    }
    quizNext.hidden = true;
    quizNext.textContent = "Siguiente reto →";
    quizAnswers.replaceChildren();

    question.answers.forEach((answer, answerIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-answer";
        button.textContent = answer;
        button.addEventListener("click", () => {
            if (quizAnswers.dataset.answered === "true") return;
            quizAnswers.dataset.answered = "true";
            const isCorrect = answerIndex === question.correct;
            if (isCorrect) score += 1;
            if (quizScore) quizScore.textContent = String(score);
            quizAnswers.querySelectorAll("button").forEach((answerButton, index) => {
                answerButton.disabled = true;
                if (index === question.correct) answerButton.classList.add("answer-correct");
            });
            if (!isCorrect) button.classList.add("answer-incorrect");
            if (quizFeedback) {
                quizFeedback.textContent = question.feedback;
                quizFeedback.classList.toggle("feedback-wrong", !isCorrect);
            }
            quizProgressBar.style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
            quizNext.hidden = false;
        });
        quizAnswers.appendChild(button);
    });
    quizAnswers.dataset.answered = "false";
}

if (quizNext) {
    quizNext.addEventListener("click", () => {
        if (quizIndex >= quizQuestions.length) {
            quizIndex = 0;
            score = 0;
            if (quizScore) quizScore.textContent = "0";
        } else {
            quizIndex += 1;
        }
        showQuizQuestion();
    });
}

showQuizQuestion();

const breathingToggle = document.getElementById("breathingToggle");
const breathingVisual = document.getElementById("breathingVisual");
const breathingPhase = document.getElementById("breathingPhase");
const breathingCount = document.getElementById("breathingCount");
const breathingStatus = document.getElementById("breathingStatus");
const breathingSteps = [
    { name: "inhala", seconds: 4, className: "is-inhaling" },
    { name: "sostén", seconds: 4, className: "is-holding" },
    { name: "exhala", seconds: 6, className: "is-exhaling" }
];
let breathingInterval = 0;
let breathingStepIndex = 0;
let secondsRemaining = breathingSteps[0].seconds;

function stopBreathing() {
    window.clearInterval(breathingInterval);
    breathingInterval = 0;
    breathingStepIndex = 0;
    secondsRemaining = breathingSteps[0].seconds;
    if (breathingVisual) breathingVisual.classList.remove("is-inhaling", "is-holding", "is-exhaling");
    if (breathingPhase) breathingPhase.textContent = "inhala";
    if (breathingCount) breathingCount.textContent = "4";
    if (breathingToggle) {
        breathingToggle.innerHTML = 'Comenzar respiración <span aria-hidden="true">↗</span>';
        breathingToggle.setAttribute("aria-pressed", "false");
    }
    if (breathingStatus) breathingStatus.textContent = "Tú marcas el ritmo. Puedes parar cuando quieras.";
}

function updateBreathingDisplay() {
    const step = breathingSteps[breathingStepIndex];
    if (breathingVisual) {
        breathingVisual.classList.remove("is-inhaling", "is-holding", "is-exhaling");
        breathingVisual.classList.add(step.className);
    }
    if (breathingPhase) breathingPhase.textContent = step.name;
    if (breathingCount) breathingCount.textContent = String(secondsRemaining);
}

if (breathingToggle) {
    breathingToggle.addEventListener("click", () => {
        if (breathingInterval) {
            stopBreathing();
            return;
        }

        breathingToggle.innerHTML = 'Detener ejercicio <span aria-hidden="true">■</span>';
        breathingToggle.setAttribute("aria-pressed", "true");
        if (breathingStatus) breathingStatus.textContent = "Sigue el círculo solo si se siente cómodo. Puedes detenerlo en cualquier momento.";
        updateBreathingDisplay();
        breathingInterval = window.setInterval(() => {
            secondsRemaining -= 1;
            if (secondsRemaining <= 0) {
                breathingStepIndex = (breathingStepIndex + 1) % breathingSteps.length;
                secondsRemaining = breathingSteps[breathingStepIndex].seconds;
                updateBreathingDisplay();
            } else if (breathingCount) {
                breathingCount.textContent = String(secondsRemaining);
            }
        }, 1000);
    });
}
