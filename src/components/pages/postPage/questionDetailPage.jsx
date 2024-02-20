import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import '../../../asset/sass/pages/postPage/questionDetailPage.scss';
import { StyledPage, StyledHeader } from '../../../styledComponent.js';
import TitleHeader from '../../ui/header/titleHeader.jsx';
import Answer from '../../ui/question/answer.jsx';
import TabBar from '../../ui/tabBar/tabBar.jsx';
import Chat from '../../../asset/image/chat.svg';
import View from '../../../asset/image/view.svg';
import { BASE_URL } from '../../global/constants/index.js';

const Questioner = styled.div`
  font-family: pretendard-medium;
  letter-spacing: -1px;
  margin-left: 2%;
`;

const QuestionerTag = styled.div`
  letter-spacing: -1px;
  margin-left: -49%;
  margin-top: 0.5%;
  font-size: 13px;
`;

const QuestionTitle = styled.div`
  margin-top: 5%;
  font-family: pretendard-black;
  letter-spacing: -0.5px;
  background-color: #f6f6f6;
  border-radius: 10px;
  padding: 10px;
`;

const QuestionContent = styled.div`
  margin-top: 7%;
  margin-left: 2%;
  margin-bottom: 7%;
  letter-spacing: -1px;
  font-family: pretendard-light;
`;

const FirstLine = styled.div`
  height: 1px;
  background-color: #cecece;
  width: 100%;
  margin: 5% 0% 0% 0%;
`;

const LastLine = styled.div`
  height: 0.5px;
  background-color: #cecece;
  width: 85%;
  margin: 10% 0% 0% 9%;
`;

const AnswerList = styled.div``;

function QuestionDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [comment, setComment] = useState('');
  const [questionDetail, setQuestionDetail] = useState({
    questionId: null,
    title: '',
    questionContent: '',
    viewCount: 0,
    answerCount: 0,
    reward: 0,
    questionNickname: '',
    questionTag: '',
    createAt: '',
    answers: [],
    content: [],
  });

  function formatDate(fullDate) {
    const date = new Date(fullDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const questionId = location.state?.questionId;
    if (questionId) {
      fetchQuestionDetail(questionId);
    }
  }, [location.state]);

  const fetchQuestionDetail = (questionId) => {
    axios
      .get(`${BASE_URL}/api/question/find-question`, {
        params: {
          questionId: questionId,
        },
      })
      .then((response) => {
        if (response.data && response.data.statusCode === 'OK') {
          const questionData = response.data.data;
          const updatedQuestionDetail = {
            ...questionData,
            answers: [...questionData.answers],
            content: [...questionData.content],
          };
          setQuestionDetail(updatedQuestionDetail);
        }
      })
      .catch((error) => {
        console.error('질문과 답변을 불러오는데 실패했습니다.', error);
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const {
    questioner,
    questionerTag,
    viewCount,
    answerCount,
    questionTitle,
    questionContent,
    createAt,
  } = location.state || {};

  const handleCommentSubmit = () => {
    const questionId = questionDetail && questionDetail.questionId;

    const requestData = {
      content: comment,
      questionId: questionId,
    };

    console.log('답변 제출 중:', requestData);

    axios
      .post(`${BASE_URL}/api/answer/save-answer`, requestData)
      .then((response) => {
        console.log('답변 제출 응답:', response.data);
        if (response.data && response.data.statusCode === 'OK') {
          console.log('답변이 성공적으로 등록되었습니다.');
          alert('답변이 등록되었습니다.');

          setComment('');
          fetchQuestionDetail(questionId);
        }
      })
      .catch((error) => {
        console.error('답변 등록에 실패했습니다.', error);
      });
  };

  const formattedDate = formatDate(createAt);

  return (
    <StyledPage className="main-page-container">
      <StyledHeader>
        <TitleHeader pageTitle="상세보기" handleGoBack={handleGoBack} />
      </StyledHeader>

      <div className="question-detail-container">
        <div className="questioner-info">
          <Questioner>
            {questioner} <span className="middle">•</span>
          </Questioner>

          <QuestionerTag>{questionerTag}</QuestionerTag>
          <span className="question-date">{formattedDate}</span>
        </div>

        <FirstLine />

        <QuestionTitle>
          <span className="Q"> </span>
          {questionTitle}
        </QuestionTitle>

        <QuestionContent>{questionContent}</QuestionContent>

        <div className="view-info-container">
          <img className="answer-img" src={Chat} />
          <span className="answer-count">{answerCount}</span>
          <img className="answerview-img" src={View} />
          <span className="answerview-count">{viewCount}</span>
        </div>
      </div>

      <div className="comment-section">
        <textarea
          placeholder="답변을 입력해주세요.."
          className="comment-input"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button className="submit-comment" onClick={handleCommentSubmit}>
          등록
        </button>
      </div>
      <LastLine />
      <AnswerList>
        {questionDetail.answers.map((answer, index) => (
          <Answer
            key={index}
            answerer={answer.answerNickname}
            answererTag={answer.answerTag}
            replyCount={answer.replyCount}
            answerContent={answer.content}
            createAt={answer.createAt}
          />
        ))}
      </AnswerList>
      <TabBar />
    </StyledPage>
  );
}

export default QuestionDetailPage;
