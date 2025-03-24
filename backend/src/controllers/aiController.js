const openai = require('../config/openai');
const { admin, db } = require('../config/firebase');

// AI Doubt Solver
const solveDoubt = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }
    
    // Create completion with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful educational assistant that provides clear, accurate, and informative answers to student questions. Provide detailed explanations with examples where appropriate.' },
        { role: 'user', content: question }
      ],
      max_tokens: 1000
    });
    
    const answer = completion.choices[0].message.content;
    
    // Log this interaction if needed
    await db.collection('ai_interactions').add({
      userId: req.user.uid,
      type: 'doubt_solver',
      question,
      answer,
      timestamp: admin.firestore.Timestamp.now()
    });
    
    return res.status(200).json({
      success: true,
      answer
    });
  } catch (error) {
    console.error('Error in AI doubt solver:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process your question',
      error: error.message
    });
  }
};

// Summarize Notes
const summarizeNotes = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text content is required'
      });
    }
    
    // Create completion with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an educational assistant tasked with summarizing study notes. Create a concise, well-structured summary that captures the key points, main concepts, and important details from the provided text. Use bullet points where appropriate.' },
        { role: 'user', content: `Please summarize the following study notes: ${text}` }
      ],
      max_tokens: 1500
    });
    
    const summary = completion.choices[0].message.content;
    
    // Log this interaction if needed
    await db.collection('ai_interactions').add({
      userId: req.user.uid,
      type: 'notes_summarization',
      originalLength: text.length,
      summaryLength: summary.length,
      timestamp: admin.firestore.Timestamp.now()
    });
    
    return res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error in AI notes summarization:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to summarize the notes',
      error: error.message
    });
  }
};

// Generate Quiz (Premium Mock Feature)
const generateQuiz = async (req, res) => {
  try {
    // Check if user has premium access (mock check)
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();
    
    // Mock premium check - in a real app, this would be a proper subscription check
    if (!userData.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Premium feature. Please upgrade your account to access.',
        requiresPremium: true
      });
    }
    
    const { topic, numQuestions } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required'
      });
    }
    
    const questionsCount = numQuestions || 5;
    
    // Create completion with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an educational assistant tasked with creating quiz questions. Generate multiple-choice questions with four options each and indicate the correct answer. Format the response as a JSON array of question objects.' },
        { role: 'user', content: `Please generate ${questionsCount} multiple-choice questions about ${topic}. Each question should have 4 options and indicate the correct answer. Format the response as a JSON array.` }
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });
    
    // Parse the JSON response
    const quizData = JSON.parse(completion.choices[0].message.content);
    
    // Log this interaction
    await db.collection('ai_interactions').add({
      userId: req.user.uid,
      type: 'quiz_generation',
      topic,
      questionsCount,
      timestamp: admin.firestore.Timestamp.now()
    });
    
    return res.status(200).json({
      success: true,
      quiz: quizData
    });
  } catch (error) {
    console.error('Error in AI quiz generation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: error.message
    });
  }
};

module.exports = {
  solveDoubt,
  summarizeNotes,
  generateQuiz
}; 