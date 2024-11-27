const openai = require('../config/openaiClient');
const saveConversation = require('../utils/saveConversation');

exports.chat = async (req, res) => {
    const { userId, prompt } = req.body;

    // 사용자 ID와 프롬프트가 전달되지 않으면 오류 응답
    if (!userId || !prompt) {
        return res.status(400).json({ error: '사용자 ID와 프롬프트가 필요합니다.' });
    }

    try {
        // 1. 사용자 ID가 'users' 테이블에 존재하는지 확인
        db.query('SELECT * FROM users WHERE id = ?', [userId], async (err, results) => {
            if (err) {
                console.error('DB 오류:', err);
                return res.status(500).json({ error: 'DB 오류' });
            }

            // 2. 사용자 ID가 없으면 오류 응답
            if (results.length === 0) {
                return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
            }

            // 기본 응답 옵션 설정
            const options = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        //필요 시 영문으로 수정
                        content: '너의 이름은 thesisfy고 너의 주요 기능은 논문 작성 보조와 논문 검색이야.'

                    },
                    {
                        role: 'user',
                        content: prompt
                    }
            ],
                temperature: 0.7,              // 창의성(0.0 ~ 1.0, 높을수록 창의적)
                max_tokens: 1000,               // 최대 응답 길이
                top_p: 1.0,                    // 샘플링에서 고려할 확률 분포
                frequency_penalty: 0.0,        // 동일 단어 반복 감소 (0.0 ~ 2.0)
                presence_penalty: 0.0          // 새로운 주제 유도 (0.0 ~ 2.0)
            });
            // 3. OpenAI API 호출
            const response = await openai.chat.completions.create(options);
            const reply = response.choices[0].message.content;  // OpenAI 응답

            // 4. 대화 내용 DB에 저장 (사용자 메시지와 응답 모두 저장)
            await saveConversation(userId, prompt);  // 사용자가 입력한 메시지 저장
            await saveConversation(userId, reply);         // 예시로 OpenAI의 응답을 저장 -수정 필요

            // 5. 클라이언트에 응답 반환
            res.status(200).json({ reply });  // OpenAI 응답을 클라이언트로 전달
        });
    } catch (error) {
        console.error('OpenAI API 호출 오류:', error);
        res.status(500).json({ error: 'OpenAI API 호출 실패' });
    }
};