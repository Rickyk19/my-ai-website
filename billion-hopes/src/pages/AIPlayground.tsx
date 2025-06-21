import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AIPlayground: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('text-generator');
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');

  const aiTools = [
    {
      id: 'text-generator',
      name: 'AI Text Generator',
      description: 'Generate creative text, stories, or content from prompts',
      category: 'text',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'chat-bot',
      name: 'AI Chatbot',
      description: 'Have conversations with an intelligent AI assistant',
      category: 'text',
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 'code-generator',
      name: 'Code Generator',
      description: 'Generate code snippets in various programming languages',
      category: 'code',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const simulateAIResponse = async (tool: string, input: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const lowerInput = input.toLowerCase();

    switch (tool) {
      case 'text-generator':
        if (lowerInput.includes('story') || lowerInput.includes('narrative')) {
          return `Generated Story:\n\nOnce upon a time, in a world where ${input.replace(/write|create|generate|story|narrative/gi, '').trim()}, there lived a curious individual who discovered that technology could change everything. Through determination and learning, they mastered the art of innovation and created solutions that helped millions of people worldwide.`;
        } else if (lowerInput.includes('blog') || lowerInput.includes('article')) {
          return `Blog Article:\n\n# ${input.replace(/write|create|generate|blog|article/gi, '').trim()}\n\nIn today's rapidly evolving digital landscape, understanding this topic is crucial for success. This comprehensive guide will walk you through the essential concepts, practical applications, and future implications.\n\n## Key Points:\n- Fundamental concepts and definitions\n- Real-world applications and use cases\n- Best practices and recommendations\n- Future trends and developments`;
        } else {
          return `Generated content about "${input}":\n\n${input.charAt(0).toUpperCase() + input.slice(1)} is a fascinating topic that deserves careful consideration. Here are some key insights:\n\n• Understanding the fundamental principles is essential\n• Practical applications can be found in various industries\n• Future developments will likely expand its impact\n• Continuous learning and adaptation are crucial for success\n\nThis topic continues to evolve and offers exciting opportunities for exploration and innovation.`;
        }
      
      case 'chat-bot':
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
          return `AI Assistant: Hello! I'm excited to help you today. What would you like to know or discuss?`;
        } else if (lowerInput.includes('how') && lowerInput.includes('work')) {
          return `AI Assistant: Great question about how things work! Let me break this down for you:\n\n1. The process typically involves several key steps\n2. Each component plays a specific role\n3. The system operates through interconnected mechanisms\n4. Results are achieved through coordinated actions\n\nWould you like me to elaborate on any specific aspect?`;
        } else if (lowerInput.includes('what') && lowerInput.includes('ai')) {
          return `AI Assistant: AI (Artificial Intelligence) refers to computer systems that can perform tasks typically requiring human intelligence. This includes:\n\n• Machine Learning - systems that learn from data\n• Natural Language Processing - understanding human language\n• Computer Vision - interpreting visual information\n• Robotics - physical AI applications\n\nAI is transforming industries like healthcare, finance, education, and transportation!`;
        } else {
          return `AI Assistant: That's an interesting point about "${input}". Based on my analysis, I can provide some insights:\n\nThis topic involves multiple factors that work together to create meaningful outcomes. Understanding the context and implications is key to making informed decisions.\n\nWould you like me to explore any specific aspect in more detail?`;
        }
      
      case 'code-generator':
        if (lowerInput.includes('tax') && lowerInput.includes('python')) {
          return `# Python Tax Calculator Function

def calculate_tax(income, tax_rate=0.25):
    """
    Calculate tax based on income and tax rate
    
    Args:
        income (float): Annual income
        tax_rate (float): Tax rate (default 25%)
    
    Returns:
        dict: Tax calculation details
    """
    
    if income <= 0:
        return {"error": "Income must be positive"}
    
    tax_amount = income * tax_rate
    net_income = income - tax_amount
    
    return {
        "gross_income": income,
        "tax_rate": tax_rate * 100,
        "tax_amount": tax_amount,
        "net_income": net_income
    }

# Example usage:
if __name__ == "__main__":
    income = 75000
    result = calculate_tax(income)
    
    print(f"Income: $" + str(result['gross_income']))
    print(f"Tax: $" + str(result['tax_amount']))
    print(f"Net: $" + str(result['net_income']))`;
        } else if (lowerInput.includes('calculator')) {
          return `# Simple Calculator

def calculator():
    """Simple calculator with basic operations"""
    
    def add(x, y):
        return x + y
    
    def subtract(x, y):
        return x - y
    
    def multiply(x, y):
        return x * y
    
    def divide(x, y):
        if y == 0:
            return "Error: Division by zero!"
        return x / y
    
    print("Simple Calculator")
    print("Operations: +, -, *, /")
    
    try:
        num1 = float(input("Enter first number: "))
        operation = input("Enter operation: ")
        num2 = float(input("Enter second number: "))
        
        if operation == '+':
            result = add(num1, num2)
        elif operation == '-':
            result = subtract(num1, num2)
        elif operation == '*':
            result = multiply(num1, num2)
        elif operation == '/':
            result = divide(num1, num2)
        else:
            result = "Invalid operation"
        
        print(f"Result: {result}")
        
    except ValueError:
        print("Error: Please enter valid numbers")

# Run calculator
calculator()`;
        } else {
          return `# Generated Python Code

def process_data(data):
    """
    Process data based on: ${input}
    
    Args:
        data: Input data to process
    
    Returns:
        Processed result
    """
    
    try:
        if isinstance(data, list):
            return [item * 2 for item in data if isinstance(item, (int, float))]
        elif isinstance(data, (int, float)):
            return data * 2
        elif isinstance(data, str):
            return data.upper()
        else:
            return str(data)
    
    except Exception as e:
        return f"Error: {e}"

# Example usage:
test_data = [1, 2, 3, 4, 5]
result = process_data(test_data)
print(f"Result: {result}")`;
        }
      
      default:
        return `AI Response: I've analyzed your request "${input}" and generated a customized response. The system has processed your input using advanced algorithms to provide relevant and helpful information.`;
    }
  };

  const handleRunAI = async () => {
    if (!userInput.trim()) return;

    setIsProcessing(true);
    try {
      const response = await simulateAIResponse(selectedTool, userInput);
      setResult(response);
    } catch (error) {
      console.error('Error processing AI request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedToolData = aiTools.find(tool => tool.id === selectedTool);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🚀 AI Playground
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experiment with cutting-edge AI tools and see artificial intelligence in action!
            </p>
          </motion.div>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {aiTools.map((tool) => (
            <motion.div
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`cursor-pointer rounded-xl border-2 transition-all duration-300 p-6 ${
                selectedTool === tool.id
                  ? 'border-blue-500 shadow-xl bg-white'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4`}>
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm">{tool.description}</p>
              {selectedTool === tool.id && (
                <span className="text-blue-600 font-medium text-sm mt-2 block">Selected</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* AI Interface */}
        {selectedToolData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Tool Header */}
            <div className={`bg-gradient-to-r ${selectedToolData.color} p-6 text-white`}>
              <h2 className="text-2xl font-bold mb-2">{selectedToolData.name}</h2>
              <p className="text-white/90">{selectedToolData.description}</p>
            </div>

            {/* Input Area */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your prompt:
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Try something like 'Write a story about AI' or 'Create a Python function'"
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isProcessing}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleRunAI}
                    disabled={!userInput.trim() || isProcessing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>🚀 Run AI</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">✨ AI Result</h3>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <pre className="text-gray-800 whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          </motion.div>
        )}

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">🚀 Coming Soon</h3>
          <p className="text-purple-100 mb-6">
            More AI tools including image generation, voice synthesis, and advanced ML models!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm">🎨 Image AI</div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm">🎵 Audio AI</div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm">🤖 Custom Models</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AIPlayground;