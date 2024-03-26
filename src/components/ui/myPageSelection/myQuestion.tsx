import React, { useState, useEffect } from 'react';
import './myComponent.scss';
import AdminPagination from '../adminSelection/adminPagination';
import { BASE_URL, ACCESS_TOKEN } from '../../global/constants';
import { showErrorToast } from '../toast/toast';
import { useNavigate } from 'react-router-dom';

interface Questions {
  questionId: number;
  companyId: number;
  companyName: string;
  questionerNickname: string;
  questionerTag: string;
  questionTitle: string;
  questionTag: string;
  questionCategory: string;
  questionViewCount: number;
  answerCount: number;
  reward: number;
  createAt: string;
}

interface Data {
  totalPages: number;
  totalElements: number;
  statusCode: string;
  questions: Questions[];
}

interface ApiResponse {
  statusCode: string;
  data: Data;
}
interface MyQuestionProps {
  setQuestionCnt: (cnt: number) => void;
  initiateQuestion: Questions[];
}
export default function MyQuestion({
  setQuestionCnt,
  initiateQuestion,
}: MyQuestionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadUserQuestion(currentPage);
  }, [currentPage]);
  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(0);
  const [question, setQuestion] = useState<Questions[]>(initiateQuestion);

  const handlePagination = (direction) => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (typeof direction === 'number') {
      setCurrentPage(direction);
    }
  };

  const loadUserQuestion = (pageNo: number) => {
    fetch(`${BASE_URL}/api/question/me?pageNo=${pageNo}&criterion=createdAt`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    })
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        setQuestion(data.data.questions);
        setTotalPages(data.data.totalPages);
        setQuestionCnt(data.data.totalElements);
      })
      .catch(() => showErrorToast('질문 불러오기 실패:'));
  };

  return (
    <div className="my-component-width">
      {question?.map((q) => (
        <div
          className="answer-item"
          key={q.questionId}
          onClick={() =>
            navigate(`/company-info/${q.companyId}/${q.questionId}`)
          }
        >
          <div className="answer-item-title">{q.companyName}</div>
          <div className="answer-item-content">{q.questionTitle}</div>
        </div>
      ))}

      {question && (
        <AdminPagination
          className="my-question-pagination"
          currentPage={currentPage}
          totalPages={totalPages}
          handlePagination={handlePagination}
        />
      )}
    </div>
  );
}
