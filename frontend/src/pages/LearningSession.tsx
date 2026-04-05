import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LearningHeader from '../components/learning/LearningHeader';
import ContentArea from '../components/learning/ContentArea';
import NavigationControls from '../components/learning/NavigationControls';
import QuizSection from '../components/learning/QuizSection';
import CompletionScreen from '../components/learning/CompletionScreen';

type ViewMode = 'content' | 'quiz' | 'completion';

export default function LearningSession() {
  const navigate = useNavigate();
  const { catalogueId } = useParams();
  
  const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('content');

  // Mock data - replace with actual data fetching
  const topicData = {
    title: 'Neural Networks',
    subtopics: [
      {
        id: '3-1',
        title: 'Perceptrons',
        content: `
          <h2>Understanding Perceptrons</h2>
          <p>A perceptron is the simplest form of a neural network. It's a single-layer neural network that takes multiple inputs and produces a single output.</p>
          
          <h3>Key Components</h3>
          <ul>
            <li><strong>Inputs:</strong> The perceptron receives multiple input values (x₁, x₂, ..., xₙ)</li>
            <li><strong>Weights:</strong> Each input has an associated weight (w₁, w₂, ..., wₙ)</li>
            <li><strong>Bias:</strong> An additional parameter that helps adjust the output</li>
            <li><strong>Activation Function:</strong> Determines the output based on the weighted sum</li>
          </ul>

          <h3>How It Works</h3>
          <p>The perceptron computes a weighted sum of its inputs, adds the bias, and then applies an activation function to produce the output.</p>
          
          <p>The mathematical formula is:</p>
          <p><code>output = activation(Σ(wᵢ × xᵢ) + bias)</code></p>

          <h3>Applications</h3>
          <p>Perceptrons are used for binary classification tasks, where the goal is to separate data into two classes. While simple, they form the foundation for more complex neural networks.</p>
        `,
        hasQuiz: true,
      },
      {
        id: '3-2',
        title: 'Activation Functions',
        content: `
          <h2>Activation Functions in Neural Networks</h2>
          <p>Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns.</p>
          
          <h3>Common Activation Functions</h3>
          <ul>
            <li><strong>Sigmoid:</strong> Maps values to range (0, 1), useful for probability outputs</li>
            <li><strong>ReLU:</strong> Returns max(0, x), most popular in hidden layers</li>
            <li><strong>Tanh:</strong> Maps values to range (-1, 1), zero-centered</li>
            <li><strong>Softmax:</strong> Used in output layer for multi-class classification</li>
          </ul>

          <h3>Why They Matter</h3>
          <p>Without activation functions, neural networks would only be able to learn linear relationships, severely limiting their capabilities.</p>
        `,
        hasQuiz: true,
      },
      {
        id: '3-3',
        title: 'Backpropagation',
        content: `
          <h2>Backpropagation Algorithm</h2>
          <p>Backpropagation is the key algorithm for training neural networks. It efficiently computes gradients of the loss function with respect to the network's weights.</p>
          
          <h3>The Process</h3>
          <ol>
            <li><strong>Forward Pass:</strong> Input data flows through the network to produce an output</li>
            <li><strong>Calculate Loss:</strong> Compare the output with the expected result</li>
            <li><strong>Backward Pass:</strong> Propagate the error backward through the network</li>
            <li><strong>Update Weights:</strong> Adjust weights to minimize the loss</li>
          </ol>

          <h3>Gradient Descent</h3>
          <p>Backpropagation uses gradient descent to update weights. The learning rate determines how much to adjust weights in each iteration.</p>
        `,
        hasQuiz: false,
      },
    ],
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: 'What is the main purpose of an activation function in a perceptron?',
      options: [
        'To store the input values',
        'To introduce non-linearity into the model',
        'To calculate the weights',
        'To normalize the data',
      ],
      correctAnswer: 1,
    },
    {
      id: 'q2',
      question: 'Which component is NOT part of a basic perceptron?',
      options: [
        'Inputs',
        'Weights',
        'Convolutional layers',
        'Activation function',
      ],
      correctAnswer: 2,
    },
  ];

  const currentSubtopic = topicData.subtopics[currentSubtopicIndex];
  const totalSubtopics = topicData.subtopics.length;
  const hasPrevious = currentSubtopicIndex > 0;
  const isLastSubtopic = currentSubtopicIndex === totalSubtopics - 1;

  const handleExit = () => {
    navigate(`/catalogue/${catalogueId}`);
  };

  const handleNext = () => {
    if (currentSubtopic.hasQuiz && viewMode === 'content') {
      setViewMode('quiz');
    } else if (isLastSubtopic) {
      setViewMode('completion');
    } else {
      setCurrentSubtopicIndex(currentSubtopicIndex + 1);
      setViewMode('content');
    }
  };

  const handlePrevious = () => {
    if (currentSubtopicIndex > 0) {
      setCurrentSubtopicIndex(currentSubtopicIndex - 1);
      setViewMode('content');
    }
  };

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    if (isLastSubtopic) {
      setViewMode('completion');
    } else {
      setCurrentSubtopicIndex(currentSubtopicIndex + 1);
      setViewMode('content');
    }
  };

  const handleContinueAfterCompletion = () => {
    navigate(`/catalogue/${catalogueId}`);
  };

  if (viewMode === 'completion') {
    return (
      <div className="min-h-screen bg-surface">
        <CompletionScreen
          topicTitle={topicData.title}
          pointsEarned={150}
          nextTopicTitle="Deep Learning"
          onContinue={handleContinueAfterCompletion}
          quizAvailable={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <LearningHeader
        topicTitle={topicData.title}
        subtopicTitle={currentSubtopic.title}
        currentPosition={currentSubtopicIndex + 1}
        totalSections={totalSubtopics}
        onExit={handleExit}
      />

      <div className="flex-1 overflow-y-auto pb-24">
        {viewMode === 'content' ? (
          <ContentArea content={currentSubtopic.content} />
        ) : (
          <QuizSection questions={quizQuestions} onComplete={handleQuizComplete} />
        )}
      </div>

      {viewMode === 'content' && (
        <NavigationControls
          onPrevious={hasPrevious ? handlePrevious : undefined}
          onNext={handleNext}
          hasPrevious={hasPrevious}
          nextLabel={currentSubtopic.hasQuiz ? 'Take Quiz' : isLastSubtopic ? 'Complete' : 'Next'}
        />
      )}
    </div>
  );
}
