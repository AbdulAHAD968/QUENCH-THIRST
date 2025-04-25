import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const WelcomeLoader = () => {
  const navigate = useNavigate();

  return (
    <StyledWelcomeContainer>
      <div className="welcomeContent">
        <div className="welcomeMessage">Welcome to QUENCH THIRST!</div>
        <div className="loader">
          <div className="truckWrapper">
            <div className="waterDrop waterDrop1"></div>
            <div className="waterDrop waterDrop2"></div>
            <div className="waterDrop waterDrop3"></div>
            <div className="waterDrop waterDrop4"></div>
            <div className="waterDrop waterDrop5"></div>
            <div className="waterDrop waterDrop6"></div>
            <div className="waterDrop waterDrop7"></div>
            <div className="waterDrop waterDrop8"></div>
            <div className="waterDrop waterDrop9"></div>
            <div className="truckBody">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 198 93" className="trucksvg">
                <path strokeWidth={3} stroke="#282828" fill="#3A86FF" d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z" />
                <path strokeWidth={3} stroke="#282828" fill="#7D7C7C" d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" />
                <path strokeWidth={2} stroke="#282828" fill="#282828" d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" />
                <rect strokeWidth={2} stroke="#282828" fill="#FFFCAB" rx={1} height={7} width={5} y={63} x={187} />
                <rect strokeWidth={2} stroke="#282828" fill="#282828" rx={1} height={11} width={4} y={81} x={193} />
                <rect strokeWidth={3} stroke="#282828" fill="#DFDFDF" rx="2.5" height={90} width={121} y="1.5" x="6.5" />
                <rect strokeWidth={2} stroke="#282828" fill="#DFDFDF" rx={2} height={4} width={6} y={84} x={1} />
                <rect strokeWidth={2} stroke="#282828" fill="#3A86FF" rx="1.5" height={30} width={40} y={15} x={50} />
                <path strokeWidth={2} stroke="#282828" fill="#3A86FF" d="M90 15V45H50V15C50 15 55 10 70 10C85 10 90 15 90 15Z" />
                <circle strokeWidth={1} stroke="#282828" fill="#FFFFFF" r={3} cy={30} cx={65} />
              </svg>
            </div>
            <div className="truckTires">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="tiresvg">
                <circle strokeWidth={3} stroke="#282828" fill="#282828" r="13.5" cy={15} cx={15} />
                <circle fill="#DFDFDF" r={7} cy={15} cx={15} />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="tiresvg">
                <circle strokeWidth={3} stroke="#282828" fill="#282828" r="13.5" cy={15} cx={15} />
                <circle fill="#DFDFDF" r={7} cy={15} cx={15} />
              </svg>
            </div>
            <div className="road" />
            <svg xmlSpace="preserve" viewBox="0 0 453.459 453.459" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Capa_1" version="1.1" fill="#000000" className="lampPost">
              <path d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
                c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
                c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
                c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
                h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
                v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
                V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
                M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
                h78.747C231.693,100.736,232.77,106.162,232.77,111.694z" />
            </svg>
          </div>
        </div>
      </div>
    </StyledWelcomeContainer>
  );
};

const StyledWelcomeContainer = styled.div`
  justify-content: center;
  display: flex;
  .welcomeContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;
  }

  @keyframes typingReverse {
    0% {
      width: 24ch;
    }
    50% {
      width: 0ch;
    }
    100% {
      width: 24ch;
    }
  }

  .welcomeMessage {
    font-size: 2.8rem;
    font-weight: bold;
    color: #3A86FF;
    text-align: center;
    margin-bottom: 0.5rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    overflow: hidden;
    border-right: 2px solid #3A86FF;
    animation: typingReverse 5s linear infinite;
  }

  .loader {
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .truckWrapper {
    width: 600px;
    height: 400px;
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
    justify-content: flex-end;
    overflow-x: hidden;
  }

  .truckBody {
    width: 530px;
    height: 265px;
    margin-bottom: 10px;
    animation: motion 1s linear infinite;
    z-index: 2;
  }

  @keyframes motion {
    0% { transform: translateY(0px); }
    50% { transform: translateY(5px); }
    100% { transform: translateY(0px); }
  }

  .truckTires {
    width: 380px;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px 0px 25px;
    position: absolute;
    bottom: 0;
    z-index: 2;
  }
  
  .truckTires svg {
    width: 60px;
  }

  .road {
    width: 100%;
    height: 3px;
    background-color: #282828;
    position: relative;
    bottom: 0;
    align-self: flex-end;
    border-radius: 6px;
    z-index: 1;
  }
  
  .road::before {
    content: "";
    position: absolute;
    width: 40px;
    height: 100%;
    background-color: #282828;
    right: -0.4%;
    border-radius: 6px;
    animation: roadAnimation 2s linear infinite;
    border-left: 20px solid #f8fafc;
  }

  @keyframes roadAnimation {
    0% { transform: translateX(0px); }
    100% { transform: translateX(-500px); }
  }

  .waterDrop {
    position: absolute;
    background-color: #3A86FF;
    border-radius: 50%;
    animation: dropFall 2s linear infinite;
    opacity: 0.7;
    z-index: 3;
  }

  .waterDrop1 {
    width: 10px;
    height: 10px;
    left: 30%;
    top: 10%;
    animation-delay: 0s;
  }

  .waterDrop2 {
    width: 8px;
    height: 8px;
    left: 35%;
    top: 5%;
    animation-delay: 0.2s;
  }
  
  .waterDrop3 {
    width: 10px;
    height: 10px;
    left: 40%;
    top: 10%;
    animation-delay: 0s;
  }

  .waterDrop4 {
    width: 8px;
    height: 8px;
    left: 45%;
    top: 5%;
    animation-delay: 0.5s;
  }

  .waterDrop5 {
    width: 10px;
    height: 10px;
    left: 50%;
    top: 10%;
    animation-delay: 0.3s;
  }

  .waterDrop6 {
    width: 10px;
    height: 10px;
    left: 55%;
    top: 5%;
    animation-delay: 0.2s;
  }

  .waterDrop7 {
    width: 6px;
    height: 6px;
    left: 60%;
    top: 10%;
    animation-delay: 0s;
  }

  .waterDrop8 {
    width: 15px;
    height: 15px;
    left: 65%;
    top: 3%;
    animation-delay: 0.3s;
  }

  .waterDrop9 {
    width: 10px;
    height: 10px;
    left: 70%;
    top: 5%;
    animation-delay: 0.2s;
  }

  @keyframes dropFall {
    0% { transform: translateY(0) scale(1); opacity: 0.7; }
    80% { opacity: 0.5; }
    100% { transform: translateY(100px) scale(0.5); opacity: 0; }
  }

  .lampPost {
    position: absolute;
    bottom: 0;
    right: -0.004%;
    height: 350px;
    animation: roadAnimation 2s linear infinite;
    z-index: 1;
    fill: #282828;
  }
`;


export default WelcomeLoader;