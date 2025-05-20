/*eslint-disable */

import {useState} from "react";
import axios from "axios";
import './App.css'

function App() {
  //변수
  let post ="제목";
  // let [변수명,함수명]  =useState(배열 가능);
  let [글제목,글제목변경]=useState(['state입니다','state입니다2','state입니다3']);
  let [따봉,따봉변경]=useState(0);
  
  return (
      <div className="App">
        <div className="black-nav">
          <h4>상단바임</h4>
        </div>
        <button onClick={()=>{
          // ... 쓰는이유: array가 가르키는 참조변수가 변경x (기존 state는 변경)
          // ... 쓰면 참조변수 화살표가 변경되었다고 봄= 값 바로 변경됨
          // 글제목변경(['state입니다4','state입니다2','state입니다3'])
          let copy=[...글제목];
          copy[0] = 'state4';
          글제목변경(copy);
          }}>제목변경</button>
        
        <div>
          <h4>{post}</h4>
          <h4>{글제목[0]} <span onClick={()=>{따봉변경(따봉+1)}}>좋아요</span>{따봉}</h4>
        </div>
        <div>
          <h4>{post}</h4>
          <h4>{글제목[1]}</h4>
        </div>
        <div>
          <h4>{post}</h4>
          <h4>{글제목[2]}</h4>
        </div>


        <Modal/>

      </div>
  );
}

//컴포넌트 = Modal , 태그형식으로 사용 가능
//1.반복 2.페이지전환 큰페이지 하나를 컴포넌트로 제작 3.자주 변경되는UI
//위에 만든 state 사용 못함
function Modal(){

  return(
    <>
      <div className="modal">
        <h4>제목</h4>
        <p>날짜</p>
        <p>상세내용</p>
      </div>
    </>
  )
}

//컴포넌트 만드는 방법2
const Modal2 = () =>{
  //return(<></>)
}


export default App;