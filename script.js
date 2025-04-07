const { useState, useEffect } = React;

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">로그인</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                    로그인
                </button>
            </form>
        </div>
    );
}

function App() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');

    // 인증 상태 감지
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 질문 목록 불러오기
    useEffect(() => {
        const unsubscribe = db.collection('questions')
            .orderBy('date', 'desc')
            .onSnapshot((snapshot) => {
                const questionsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setQuestions(questionsData);
                setLoading(false);
            });

        return () => unsubscribe();
    }, []);

    // 질문 등록
    const handleSubmitQuestion = async (e) => {
        e.preventDefault();
        if (newQuestion.trim() && (user || userName.trim())) {
            try {
                await db.collection('questions').add({
                    text: newQuestion,
                    answers: [],
                    date: serverTimestamp(),
                    userId: user ? user.uid : null,
                    userEmail: user ? user.email : userName,
                    isAnonymous: !user
                });
                setNewQuestion('');
            } catch (error) {
                console.error("Error adding question: ", error);
                alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
            }
        } else {
            alert('질문과 이름을 모두 입력해주세요.');
        }
    };

    // 답변 등록
    const handleSubmitAnswer = async (questionId) => {
        if (newAnswer[questionId]?.trim() && (user || userName.trim())) {
            try {
                const answer = {
                    id: Date.now().toString(),
                    text: newAnswer[questionId],
                    date: new Date().toISOString(),
                    userId: user ? user.uid : null,
                    userEmail: user ? user.email : userName,
                    isAnonymous: !user
                };

                const questionRef = db.collection('questions').doc(questionId);
                await questionRef.update({
                    answers: firebase.firestore.FieldValue.arrayUnion(answer)
                });

                setNewAnswer({ ...newAnswer, [questionId]: '' });
            } catch (error) {
                console.error("Error adding answer: ", error);
                alert('답변 등록에 실패했습니다. 다시 시도해주세요.');
            }
        } else {
            alert('답변과 이름을 모두 입력해주세요.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-purple-600">로딩중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <header className="max-w-4xl mx-auto mb-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-purple-600">미용실 Q&A</h1>
                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">{user.email}</span>
                            <button
                                onClick={() => auth.signOut()}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
                <p className="text-center text-gray-600">미용 관련 질문을 자유롭게 남겨주세요</p>
            </header>

            <main className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmitQuestion} className="mb-8">
                    <div className="flex flex-col space-y-4">
                        {!user && (
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="이름을 입력해주세요..."
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        )}
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
                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                    <span>{question.userEmail}{question.isAnonymous ? ' (비회원)' : ''}</span>
                                    <span>
                                        {question.date ? new Date(question.date.seconds * 1000).toLocaleString() : '날짜 없음'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {question.answers && question.answers.map((answer) => (
                                    <div key={answer.id} className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">{answer.text}</p>
                                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                                            <span>{answer.userEmail}{answer.isAnonymous ? ' (비회원)' : ''}</span>
                                            <span>{new Date(answer.date).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex flex-col space-y-2">
                                    {!user && (
                                        <input
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="이름을 입력해주세요..."
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    )}
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

