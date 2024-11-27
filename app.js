const express = require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const kciRoutes=require('./routes/kciRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);
app.use('/kci', kciRoutes);
app.use('/bookmarks', bookmarkRoutes);


//테스트용 나중에 삭제할 항목
app.get('/', (req, res) => {
    res.send('Hello, thesisfy server!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0',() => console.log(`서버 실행 중: http://localhost:${PORT}`));


