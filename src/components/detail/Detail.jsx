import "./detail.css";

const Detail = () => {
  return (
    <div className='detail'>
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>Jane Doe</h2>
        <p>This is his description babe.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>privacy</span>
            <img src="./arrowUp.png" alt=""/>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt=""/>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt=""/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail