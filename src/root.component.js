import React from '../yoshi/yoshi'

export default function Root(props) {
  const [count, setCount] = React.useState(0)
  const [dogUrl, setDogUrl] = React.useState()
  const isOdd = count % 2

  React.useEffect(() => {
    if (isOdd) {
      const abortController = new AbortController()
      fetch('https://dog.ceo/api/breeds/image/random', {signal: abortController.signal})
        .then(r => r.json())
        .then(data => setDogUrl(data.message))

      return () => {
        abortController.abort()
        setDogUrl(null)
      }
    }
  }, [isOdd])

  return (
    <section>
      <button className={props.highlight ? "orange" : ""} onclick={handleClick}>{count}</button>
      <div>{isOdd ? "Odd" : "Even"}</div>
      {Boolean(isOdd) && renderDogImg()}
    </section>
  )

  function handleClick(evt) {
    setCount(count + 1)
  }

  function renderDogImg() {
    return dogUrl ? <img src={dogUrl} alt="Dog pic" className="dog" /> : "Loading dog url"
  }
}