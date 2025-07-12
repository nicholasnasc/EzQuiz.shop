const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

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
    options: [
      "Menos de 6 meses",
      "Entre 6 meses e 1 ano",
      "Entre 1 e 2 anos",
      "Mais de 2 anos"
    ]
  },
  {
    id: 2,
    question: "Qual é o seu principal problema com gordura localizada?",
    options: [
      "Barriga saliente",
      "Culotes e coxas",
      "Braços flácidos",
      "Múltiplas áreas"
    ]
  },
  {
    id: 3,
    question: "Você já tentou algum método para emagrecer?",
    options: [
      "Dietas restritivas",
      "Exercícios físicos",
      "Suplementos",
      "Nunca tentei nada"
    ]
  },
  {
    id: 4,
    question: "Qual é sua idade?",
    options: [
      "18-25 anos",
      "26-35 anos",
      "36-45 anos",
      "Acima de 45 anos"
    ]
  },
  {
    id: 5,
    question: "Quanto você gostaria de perder?",
    options: [
      "5-10 kg",
      "10-20 kg",
      "20-30 kg",
      "Mais de 30 kg"
    ]
  }
];

// Rotas
app.get('/', (req, res) => {
  req.session.currentQuestion = 1;
  req.session.answers = {};
  res.render('index', { 
    question: quizData[0],
    progress: 20,
    currentQuestion: 1,
    totalQuestions: quizData.length
  });
});

app.post('/quiz', (req, res) => {
  const { answer, questionId } = req.body;
  const currentQ = parseInt(questionId);
  
  // Salva a resposta
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
