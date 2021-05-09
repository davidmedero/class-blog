import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/getMessage").then((res) => {
      console.log(res.data);
      setMessages(res.data);
    });
  }, []);

  function ShowMessages() {
    return messages.map((msg, i) => (
      <div key={i}>
        {msg.message}
        <button onClick={() => handleLike(msg._id)}>Likes {msg.likes}</button>
        <button type="delete" onClick={() => handleClick(msg._id)}>
          Delete
        </button>
      </div>
    ));
  }

  function handleClick(messageId) {
    axios.delete(`http://localhost:5000/delete/${messageId}`).then(() => {
      let updatedMessages = messages.filter((message) => {
        console.log(message._id, messageId);
        return message._id != messageId;
      });

      setMessages(updatedMessages);
    });
  }

  function handleLike(id) {
    axios.patch(`http://localhost:5000/update/${id}`).then((res) => {
      console.log(res);
      let updatedMsgs = messages.map((msg) => {
        if (msg._id == id) {
          msg.likes = res.data.likes;
        }
        return msg;
      });
      setMessages(updatedMsgs);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    e.target.reset();
    axios
      .post("http://localhost:5000", { message })
      .then((res) => setMessages([...messages, res.data]));
  }

  function handleChange(e) {
    setMessage(e.target.value);
    console.log(message);
  }

  return (
    <div className="App">
      <h1>David's Blog!!</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <ShowMessages />
    </div>
  );
}

export default App;
