import './index.scss'

const AnimatedLetters = ({ letterClass, strArray, idx }) => {
  return (
    <span>
      {strArray.map((char, i) => (
        <span
          key={char + i}
          className={letterClass}
          style={{ '--letter-animation-delay': `${(i + idx) / 10}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

export default AnimatedLetters
