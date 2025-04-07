const { useState } = React;

function App() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState({});
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleSubmitQuestion = (e) => {
        e.preventDefault();
        if (newQuestion.trim()) {
            const question = {
                id: Date.now(),
                text: newQuestion,
                answers: [],
                date: new Date().toLocaleString()
            };
            setQuestions([...questions, question]);
            setNewQuestion('');
        }
    };

    const handleSubmitAnswer = (questionId) => {
        if (newAnswer[questionId]?.trim()) {
            setQuestions(questions.map(q => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        answers: [...q.answers, {
                            id: Date.now(),
                            text: newAnswer[questionId],
                            date: new Date().toLocaleString()
                        }]
                    };
                }
                return q;
            }));
            setNewAnswer({ ...newAnswer, [questionId]: '' });
        }
    };

    return (
        <div className="min-h-screen p-8">
            <header className="max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl font-bold text-center text-purple-600 mb-4">미용실 Q&A</h1>
                <p className="text-center text-gray-600">미용 관련 질문을 자유롭게 남겨주세요</p>
            </header>

            <main className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmitQuestion} className="mb-8">
                    <div className="flex flex-col space-y-4">
                        <textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="질문을 입력해주세요..."
                            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows="3"
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            질문 등록
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {questions.map((question) => (
                        <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="mb-4">
                                <p className="text-lg font-medium text-gray-800">{question.text}</p>
                                <p className="text-sm text-gray-500 mt-1">{question.date}</p>
                            </div>

                            <div className="space-y-4">
                                {question.answers.map((answer) => (
                                    <div key={answer.id} className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">{answer.text}</p>
                                        <p className="text-sm text-gray-500 mt-1">{answer.date}</p>
                                    </div>
                                ))}

                                <div className="flex flex-col space-y-2">
                                    <textarea
                                        value={newAnswer[question.id] || ''}
                                        onChange={(e) => setNewAnswer({ ...newAnswer, [question.id]: e.target.value })}
                                        placeholder="답변을 입력해주세요..."
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        rows="2"
                                    />
                                    <button
                                        onClick={() => handleSubmitAnswer(question.id)}
                                        className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors self-end"
                                    >
                                        답변 등록
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
