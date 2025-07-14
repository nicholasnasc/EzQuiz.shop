const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Importar servidor de documentação
const DocsServer = require('./docs-server');

const app = express();
const PORT = process.env.PORT || 8080;

// Inicializar servidor de documentação
const docsServer = new DocsServer(path.join(__dirname, 'Docs'));

// Configurações do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.ADMIN_SESSION_SECRET || 'quiz-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Configurar rotas de documentação
app.use('/docs', docsServer.middleware());

// Carregar dados do quiz do arquivo JSON
function loadQuizData() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'quiz-config.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar dados do quiz:', error);
    return null;
  }
}

// Salvar dados do quiz no arquivo JSON
function saveQuizData(data) {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', 'quiz-config.json'), JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados do quiz:', error);
    return false;
  }
}

// Middleware de autenticação do admin
function requireAuth(req, res, next) {
  if (req.session.adminAuthenticated) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// Rotas principais
app.get('/teste', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'teste.html'));
});

app.get('/', (req, res) => {
  const quizConfig = loadQuizData();
  if (!quizConfig) {
    return res.status(500).send('Erro ao carregar dados do quiz');
  }
  
  req.session.currentQuestion = 1;
  req.session.answers = {};
  res.render('quiz', { 
    question: quizConfig.quiz.questions[0],
    progress: 5,
    currentQuestion: 1,
    totalQuestions: quizConfig.quiz.questions.length
  });
});

app.post('/quiz', (req, res) => {
  const quizConfig = loadQuizData();
  if (!quizConfig) {
    return res.status(500).send('Erro ao carregar dados do quiz');
  }
  
  const { answer, questionId } = req.body;
  const currentQ = parseInt(questionId);
  
  // Debug log
  console.log('Pergunta:', currentQ, 'Resposta:', answer, 'Tipo:', typeof answer);
  
  // Salva a resposta (pode ser um array para múltipla escolha)
  req.session.answers[currentQ] = answer;
  
  // Próxima pergunta
  const nextQ = currentQ + 1;
  
  if (nextQ <= quizConfig.quiz.questions.length) {
    req.session.currentQuestion = nextQ;
    res.render('quiz', {
      question: quizConfig.quiz.questions[nextQ - 1],
      progress: (nextQ / quizConfig.quiz.questions.length) * 100,
      currentQuestion: nextQ,
      totalQuestions: quizConfig.quiz.questions.length
    });
  } else {
    // Quiz finalizado, redireciona para resultado
    res.redirect('/resultado');
  }
});

app.get('/resultado', (req, res) => {
  const quizConfig = loadQuizData();
  if (!quizConfig) {
    return res.status(500).send('Erro ao carregar dados do quiz');
  }
  
  if (!req.session.answers || Object.keys(req.session.answers).length < quizConfig.quiz.questions.length) {
    return res.redirect('/');
  }
  
  // Preparar dados seguros para o frontend
  const answersData = {
    peso: req.session.answers[1] || '70',
    tempoLuta: req.session.answers[2] || 'Entre 1 e 2 anos',
    gestacoes: req.session.answers[3] || 'Duas gestações',
    sintomas: req.session.answers[4] || ['Falta de ar...'],
    idade: req.session.answers[5] || '36-45 anos',
    pesoObjetivo: req.session.answers[6] || '10-20 kg',
    satisfacao: req.session.answers[7] || 'Sinto vergonha'
  };
  
  res.render('resultado', {
    answers: req.session.answers,
    answersData: answersData
  });
});

// Rotas do Admin
app.get('/admin/login', (req, res) => {
  res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.adminAuthenticated = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: 'Credenciais inválidas' });
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.adminAuthenticated = false;
  res.redirect('/admin/login');
});

app.get('/admin/dashboard', requireAuth, (req, res) => {
  const quizConfig = loadQuizData();
  if (!quizConfig) {
    return res.status(500).send('Erro ao carregar dados do quiz');
  }
  
  res.render('admin/dashboard', { 
    quiz: quizConfig.quiz,
    product: quizConfig.product || {},
    success: req.query.success,
    error: req.query.error
  });
});

app.post('/admin/save-quiz', requireAuth, (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const currentData = loadQuizData();
    
    const quizData = {
      quiz: {
        title,
        description,
        questions: JSON.parse(questions)
      },
      product: currentData.product || {}
    };
    
    if (saveQuizData(quizData)) {
      res.redirect('/admin/dashboard?success=Quiz+salvo+com+sucesso');
    } else {
      res.redirect('/admin/dashboard?error=Erro+ao+salvar+quiz');
    }
  } catch (error) {
    res.redirect('/admin/dashboard?error=Erro+ao+processar+dados');
  }
});

app.post('/admin/save-product', requireAuth, (req, res) => {
  try {
    const currentData = loadQuizData();
    const productData = {
      active: req.body.active === 'on',
      title: req.body.title,
      subtitle: req.body.subtitle,
      price: {
        original: parseFloat(req.body.originalPrice),
        current: parseFloat(req.body.currentPrice),
        discount: parseInt(req.body.discount),
        installments: {
          count: parseInt(req.body.installmentCount),
          value: parseFloat(req.body.installmentValue)
        }
      },
      checkout: {
        platform: req.body.platform,
        url: req.body.checkoutUrl,
        buttonText: req.body.buttonText
      },
      guarantee: {
        days: parseInt(req.body.guaranteeDays),
        title: req.body.guaranteeTitle,
        description: req.body.guaranteeDescription
      },
      countdown: {
        enabled: req.body.countdownEnabled === 'on',
        hours: parseInt(req.body.countdownHours)
      },
      modules: currentData.product?.modules || [],
      bonuses: currentData.product?.bonuses || [],
      benefits: currentData.product?.benefits || [],
      faq: currentData.product?.faq || []
    };
    
    const fullData = {
      quiz: currentData.quiz,
      product: productData
    };
    
    if (saveQuizData(fullData)) {
      res.redirect('/admin/dashboard?success=Produto+salvo+com+sucesso');
    } else {
      res.redirect('/admin/dashboard?error=Erro+ao+salvar+produto');
    }
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    res.redirect('/admin/dashboard?error=Erro+ao+processar+dados+do+produto');
  }
});

app.get('/produto', (req, res) => {
  const quizConfig = loadQuizData();
  if (!quizConfig || !quizConfig.product) {
    return res.status(500).send('Erro ao carregar dados do produto');
  }
  
  res.render('produto', { product: quizConfig.product });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
