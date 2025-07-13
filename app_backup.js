const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Configurações do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'quiz-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Dados das perguntas do quiz
const quizData = [
  {
    id: 1,
    question: "Há quanto tempo você luta contra a barriga estufada?",
    type: "single",
    style: "gradient",
    options: [
      { text: "Menos de 6 meses", emoji: "😐", gradient: "gradient-blue" },
      { text: "Entre 6 meses e 1 ano", emoji: "😕", gradient: "gradient-green" },
      { text: "Entre 1 e 2 anos", emoji: "😟", gradient: "gradient-purple" },
      { text: "Mais de 2 anos", emoji: "😢", gradient: "gradient-pink" }
    ]
  },
  {
    id: 2,
    question: "Quantas gestações você já teve?",
    type: "single",
    style: "gradient",
    options: [
      { text: "Uma gestação", emoji: "🤱", gradient: "gradient-pink" },
      { text: "Duas gestações", emoji: "🤱", gradient: "gradient-purple" },
      { text: "Três ou mais gestações", emoji: "🤱", gradient: "gradient-blue" },
      { text: "Nunca engravidei", emoji: "❌", special: "special-pink" }
    ]
  },
  {
    id: 3,
    question: "Se você já teve algum dos sintomas abaixo selecione:",
    subtitle: "Continue sendo sincera...",
    type: "multiple",
    style: "checkbox",
    options: [
      { text: "Me sinto cansada...", emoji: "😰" },
      { text: "Falta de ar...", emoji: "🤒" },
      { text: "Dor nas articulações...", emoji: "🤕" },
      { text: "Pressão elevada...", emoji: "😤" },
      { text: "Problema com o sono...", emoji: "😴" },
      { text: "Baixa autoestima", emoji: "😔" }
    ]
  },
  {
    id: 4,
    question: "Qual é sua idade?",
    type: "single",
    style: "default",
    options: [
      { text: "18-25 anos", emoji: "🌟" },
      { text: "26-35 anos", emoji: "✨" },
      { text: "36-45 anos", emoji: "💫" },
      { text: "Acima de 45 anos", emoji: "🌙" }
    ]
  },
  {
    id: 5,
    question: "Quanto você gostaria de perder?",
    type: "single",
    style: "default",
    options: [
      { text: "5-10 kg", emoji: "🎯" },
      { text: "10-20 kg", emoji: "💪" },
      { text: "20-30 kg", emoji: "🔥" },
      { text: "Mais de 30 kg", emoji: "🚀" }
    ]
  },
  {
    id: 6,
    question: "Você está contente com seu peso atual?",
    type: "single",
    style: "default",
    options: [
      { text: "Infelizmente não", emoji: "😢" },
      { text: "Sinto vergonha", emoji: "😳" },
      { text: "Não tenho palavras", emoji: "😶" },
      { text: "Sim, adoro meu corpo", emoji: "😍" }
    ]
  }
];

// Rotas
app.get('/', (req, res) => {
  req.session.currentQuestion = 1;
  req.session.answers = {};
  res.render('index', { 
    question: quizData[0],
    progress: 5,
    currentQuestion: 1,
    totalQuestions: quizData.length
  });
});

app.post('/quiz', (req, res) => {
  const { answer, questionId } = req.body;
  const currentQ = parseInt(questionId);
  
  // Salva a resposta (pode ser um array para múltipla escolha)
  req.session.answers[currentQ] = answer;
  
  // Próxima pergunta
  const nextQ = currentQ + 1;
  
  if (nextQ <= quizData.length) {
    req.session.currentQuestion = nextQ;
    res.render('quiz', {
      question: quizData[nextQ - 1],
      progress: (nextQ / quizData.length) * 100,
      currentQuestion: nextQ,
      totalQuestions: quizData.length
    });
  } else {
    // Quiz finalizado, redireciona para resultado
    res.redirect('/resultado');
  }
});

app.get('/resultado', (req, res) => {
  if (!req.session.answers || Object.keys(req.session.answers).length < quizData.length) {
    return res.redirect('/');
  }
  
  res.render('resultado', {
    answers: req.session.answers
  });
});

app.get('/produto', (req, res) => {
  res.render('produto');
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
