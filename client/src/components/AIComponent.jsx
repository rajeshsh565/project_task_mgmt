import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
);

const AIComponent = ({ projectId, tasks }) => {
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [isSummaryLoading, setSummaryLoading] = useState(false);
  const [isQuestionLoading, setQuestionLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
        if (projectId) {
            try {
                const res = await axios.get(`/api/v1/tasks/project/${projectId}`);
                setAllTasks(res.data);
            } catch (err) {
                console.error(err);
            }
        }
    };
    fetchTasks();
  }, [projectId, tasks]);

  const handleSummarize = async () => {
    if (!projectId) {
      alert('Please select a project first.');
      return;
    }
    setSummaryLoading(true);
    try {
      const res = await axios.post('/api/v1/ai/summarize', { projectId });
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Error summarizing tasks:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!selectedTask || !question) {
      alert('Please select a task and enter a question.');
      return;
    }
    setQuestionLoading(true);
    try {
      const res = await axios.post('/api/v1/ai/ask', { taskId: selectedTask, question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error('Error asking question:', err);
    } finally {
      setQuestionLoading(false);
    }
  };

  const components = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  }

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">AI Assistant</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="summarize-section">
          <h3 className="text-xl font-semibold mb-2 text-white">Project Summary</h3>
          <button onClick={handleSummarize} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600" disabled={isSummaryLoading}>
            {isSummaryLoading ? <LoadingSpinner /> : 'Summarize Project Tasks'}
          </button>
          {summary && 
            <div className="mt-4 p-4 bg-gray-700 rounded-md prose prose-invert">
              <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
            </div>
          }
        </div>

        <div className="ask-section">
          <h3 className="text-xl font-semibold mb-2 text-white">Ask a Question</h3>
          <select 
            onChange={(e) => setSelectedTask(e.target.value)} 
            defaultValue="" 
            className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white h-10 cursor-pointer">
            <option value="" disabled>Select a task</option>
            {allTasks.map(task => (
              <option key={task._id} value={task._id}>{task.title}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white h-10"
          />
          <button onClick={handleAsk} className="w-full mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600" disabled={isQuestionLoading}>
            {isQuestionLoading ? <LoadingSpinner /> : 'Ask'}
          </button>
          {answer && 
            <div className="mt-4 p-4 bg-gray-700 rounded-md prose prose-invert">
              <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default AIComponent;