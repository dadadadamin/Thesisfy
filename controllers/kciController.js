const axios = require('axios');
const xml2js = require('xml2js'); // XML을 JSON으로 변환하는 라이브러리

// KCI 논문 기본 정보 제공 검색 API
exports.searchKci = async (req, res) => {
    const { query, page = 1, displayCount = 10 } = req.query;

    if (!query) {
        return res.status(400).json({ error: '검색어(title)를 입력해주세요.' });
    }

    try {
        const apiKey = process.env.KCI_API_KEY;
        const apiUrl = `https://open.kci.go.kr/po/openapi/openApiSearch.kci`;
        const params = {
            apiCode: 'articleSearch',
            key: apiKey,
            title: encodeURIComponent(query),
            page,
            displayCount
        };

        // KCI API에 GET 요청 보내기
        const response = await axios.get(apiUrl, { params, responseType: 'text' });

        // XML 데이터를 JSON으로 변환
        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('XML 파싱 오류:', err);
                return res.status(500).json({ error: 'XML 파싱 실패' });
            }
            res.status(200).json(result); // JSON 응답 반환
        });
    } catch (error) {
        console.error('KCI API 호출 오류:', error.message);
        res.status(500).json({ error: 'KCI API 호출 실패' });
    }
};

// KCI 논문 상세 정보 API
exports.getArticleDetail = async (req, res) => {
    const { id } = req.query; //클라이언트에서 논문 제어번호를 전달받음

    if (!id) {
        return res.status(400).json({ error: '논문 제어번호(id)를 입력해주세요.' });
    }

    try {
        const apiKey = process.env.KCI_API_KEY; // .env 파일에서 KCI API 키를 가져옵니다
        const apiUrl = `https://open.kci.go.kr/po/openapi/openApiSearch.kci`;
        const params = {
            key: apiKey,
            apiCode: 'articleDetail',
            id: id
        };

        // KCI API에 GET 요청 보내기
        const response = await axios.get(apiUrl, { params, responseType: 'text' });

        // XML 데이터를 JSON으로 변환
        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('XML 파싱 오류:', err);
                return res.status(500).json({ error: 'XML 파싱 실패' });
            }
            res.status(200).json(result); // JSON 응답 반환
        });
    } catch (error) {
        console.error('KCI API 호출 오류:', error.message);
        res.status(500).json({ error: 'KCI API 호출 실패' });
    }
};