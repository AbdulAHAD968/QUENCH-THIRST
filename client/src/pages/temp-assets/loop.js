import { useEffect, useRef } from "react";
import gsap from "gsap";

const LoopingWords = () => {
  const wordListRef = useRef(null);
  const edgeRef = useRef(null);

  useEffect(() => {
    const wordList = wordListRef.current;
    if (!wordList) return; // Avoid errors if wordList is not found

    const words = Array.from(wordList.children);
    const totalWords = words.length;
    const wordHeight = words[0].getBoundingClientRect().height; // Dynamically get height
    let currentIndex = 0;

    function updateEdgeWidth() {
      if (!edgeRef.current) return;

      const centerIndex = (currentIndex + 1) % totalWords;
      const centerWord = words[centerIndex];
      const centerWordWidth = centerWord.getBoundingClientRect().width;
      const listWidth = wordList.getBoundingClientRect().width;
      const percentageWidth = (centerWordWidth / listWidth) * 100;

      gsap.to(edgeRef.current, {
        width: `${percentageWidth}%`,
        duration: 0.5,
        ease: "Expo.easeOut",
      });
    }

    function moveWords() {
      currentIndex++;
      gsap.to(wordList, {
        y: -wordHeight * currentIndex, // Use 'y' instead of 'yPercent'
        duration: 1.2,
        ease: "elastic.out(1, 0.85)",
        onStart: updateEdgeWidth,
        onComplete: function () {
          if (currentIndex >= totalWords - 3) {
            wordList.appendChild(wordList.children[0]);
            currentIndex--;
            gsap.set(wordList, { y: -wordHeight * currentIndex });
            words.push(words.shift());
          }
        },
      });
    }

    updateEdgeWidth();
    const timeline = gsap.timeline({ repeat: -1, delay: 1 });
    timeline.call(moveWords).to({}, { duration: 2 }).repeat(-1);

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className="looping-words">
      <div className="looping-words__containers">
        <ul ref={wordListRef} data-looping-words-list className="looping-words__list">
          <li className="looping-words__item">
            <p className="looping-words__p">Water Conservation</p>
          </li>
          <li className="looping-words__item">
            <p className="looping-words__p">Smart Supply</p>
          </li>
          <li className="looping-words__item">
            <p className="looping-words__p">Sustainable Flow</p>
          </li>
          <li className="looping-words__item">
            <p className="looping-words__p">Leak Detection</p>
          </li>
          <li className="looping-words__item">
            <p className="looping-words__p">Purification</p>
          </li>
        </ul>
      </div>
      <div className="looping-words__fade"></div>
      <div ref={edgeRef} data-looping-words-selector className="looping-words__selector">
        <div className="looping-words__edge"></div>
        <div className="looping-words__edge is--2"></div>
        <div className="looping-words__edge is--3"></div>
        <div className="looping-words__edge is--4"></div>
      </div>
    </div>
  );
};

export default LoopingWords;
