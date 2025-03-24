import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiLoader, FiCheck, FiX, FiArrowRight, FiSave, FiClipboard } from 'react-icons/fi';
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const QuizGenerator = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Input states
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizType, setQuizType] = useState('multiple-choice');
  const [difficulty, setDifficulty] = useState('medium');
  
  // Quiz states
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Quiz, 3: Results
  
  const handleGenerateQuiz = async () => {
    // Validate inputs
    if (!topic.trim() && !content.trim()) {
      setError('Please enter either a topic or content to generate a quiz.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.post('/ai/generate-quiz', {
        topic,
        content,
        numQuestions: parseInt(numQuestions),
        quizType,
        difficulty
      });
      
      setQuiz(response.data.quiz);
      setUserAnswers(Array(response.data.quiz.questions.length).fill(null));
      setStep(2);
      setCurrentQuestion(0);
      setQuizCompleted(false);
      
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswer = (index) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = index;
    setUserAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const completeQuiz = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
    setStep(3);
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(quiz.questions.length).fill(null));
    setQuizCompleted(false);
    setStep(2);
  };
  
  const handleNewQuiz = () => {
    setQuiz(null);
    setUserAnswers([]);
    setQuizCompleted(false);
    setStep(1);
  };
  
  const renderInputStep = () => (
    <div className="bg-white border-3 border-black p-6 shadow-neubrutalism">
      <h2 className="text-xl font-bold mb-6">Quiz Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input-neubrutalism w-full"
            placeholder="e.g. Solar System, Algebra, American History"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a specific topic or leave blank if providing content
          </p>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content (Optional)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste text content to generate quiz questions from..."
            className="input-neubrutalism w-full min-h-[150px] resize-none"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            Providing content will create more specific questions based on your material
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <select
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="input-neubrutalism w-full"
            >
              <option value="3">3 Questions</option>
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="quizType" className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Type
            </label>
            <select
              id="quizType"
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className="input-neubrutalism w-full"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True / False</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input-neubrutalism w-full"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleGenerateQuiz}
          disabled={loading || (!topic.trim() && !content.trim())}
          className="btn-neubrutalism-primary"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Generating Quiz...
            </>
          ) : (
            <>
              <FiClipboard className="mr-2" />
              Generate Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
  
  const renderQuizStep = () => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      return (
        <div className="bg-white border-3 border-black p-6 shadow-neubrutalism text-center">
          <p>No quiz questions available. Please go back and try again.</p>
          <button
            onClick={handleNewQuiz}
            className="btn-neubrutalism-primary mt-4"
          >
            Create New Quiz
          </button>
        </div>
      );
    }
    
    const question = quiz.questions[currentQuestion];
    
    return (
      <div className="bg-white border-3 border-black p-6 shadow-neubrutalism">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <span className="font-medium">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <div className="p-4 bg-primary/5 border-3 border-black mb-6">
          <p className="font-medium text-lg mb-1">{question.question}</p>
          {question.content && (
            <div className="mt-2 p-3 bg-white border border-gray-200 text-sm text-gray-700">
              {question.content}
            </div>
          )}
        </div>
        
        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full p-4 text-left border-3 border-black flex items-center transition-colors ${
                userAnswers[currentQuestion] === index
                  ? 'bg-primary text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className={`btn-neubrutalism-secondary ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNextQuestion}
            className="btn-neubrutalism-primary"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  };
  
  const renderResultsStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white border-3 border-black p-6 shadow-neubrutalism text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
          <h3 className="text-xl mb-4">{quiz.title}</h3>
          
          <div className="inline-block p-6 bg-primary/10 border-3 border-black rounded-full mb-6">
            <span className="text-4xl font-bold">{score}%</span>
          </div>
          
          <p className="mb-2">
            You answered {userAnswers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length} out of {quiz.questions.length} questions correctly.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={handleRestartQuiz}
              className="btn-neubrutalism-secondary"
            >
              Retake Quiz
            </button>
            <button
              onClick={handleNewQuiz}
              className="btn-neubrutalism-primary"
            >
              Create New Quiz
            </button>
          </div>
        </div>
        
        <div className="bg-white border-3 border-black p-6 shadow-neubrutalism">
          <h3 className="text-xl font-bold mb-4">Review Answers</h3>
          
          <div className="space-y-6">
            {quiz.questions.map((question, qIndex) => (
              <div 
                key={qIndex} 
                className={`p-4 border-l-4 ${
                  userAnswers[qIndex] === question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <p className="font-medium mb-2">{qIndex + 1}. {question.question}</p>
                
                <div className="ml-4 space-y-1">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center">
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 text-xs ${
                        oIndex === question.correctAnswer
                          ? 'bg-green-500 text-white'
                          : userAnswers[qIndex] === oIndex
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200'
                      }`}>
                        {oIndex === question.correctAnswer 
                          ? <FiCheck /> 
                          : userAnswers[qIndex] === oIndex 
                            ? <FiX />
                            : String.fromCharCode(65 + oIndex)}
                      </span>
                      <span className={`${
                        oIndex === question.correctAnswer
                          ? 'font-medium text-green-800'
                          : userAnswers[qIndex] === oIndex
                            ? 'font-medium text-red-800'
                            : ''
                      }`}>
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="mt-3 p-3 bg-white border border-gray-200 text-sm">
                    <span className="font-medium">Explanation: </span>
                    {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary font-medium mb-8 hover:underline"
      >
        <FiChevronLeft className="mr-1" /> Back to Dashboard
      </button>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Quiz Generator</h1>
          <p className="text-gray-600">
            Create custom quizzes to test your knowledge or study for exams
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-center">
            <FiX className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {step === 1 && renderInputStep()}
        {step === 2 && renderQuizStep()}
        {step === 3 && renderResultsStep()}
      </div>
    </div>
  );
};

export default QuizGenerator; 