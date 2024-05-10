import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

export const JoinRoom = () => {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const leaveRoom = (socket: Socket | null) => {
    socket?.emit("leave_room", { name: name, room: room });
    console.log(`${socket?.id} Left room ${room}`);
    setIsSubmitted(false);
  };

  if (!isSubmitted)
    return (
      <>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Name"
        />
        <input
          type="text"
          onChange={(e) => {
            setRoom(e.target.value);
          }}
          placeholder="Room"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitted(true);
          }}
        >
          Join Room
        </button>
      </>
    );

  return (
    isSubmitted && <LiveQuiz name={name} room={room} leaveRoom={leaveRoom} />
  );
};

export const LiveQuiz = ({
  name,
  room,
  leaveRoom,
}: {
  name: string;
  room: string;
  leaveRoom: (socket: Socket | null) => void;
}) => {
  const data = {
    quiz_id: "1234",
    title: "General Knowledge",
    description: "Test your GQ about anything and everything!",
    questions: [
      {
        question_id: 1,
        title: "What is the capital of India?",
        image: null,
        options: ["Mumbai", "Kolkata", "Delhi", "Bengaluru"],
        right_answer: "Delhi",
      },
      {
        question_id: 2,
        title: "Who is the captain of the Indian cricket team?",
        image: "image url",
        options: ["Virat", "Dhoni", "Rohit", "Ganguly"],
        right_answer: "Rohit",
      },
    ],
  };
  const user = { name: name, room: room };
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [currentState, setCurrentState] = useState<any | null>(null);

  useEffect(() => {
    console.log("LiveQuiz loaded");
    // Connect to WebSocket server
    const sio = io("http://localhost:8000");

    sio.on("connect", () => {
      console.log("Connected to WebSocket server");
      setSocket(sio);
      sio.emit("join_room", user);
      console.log(`${sio?.id} Joined room ${room}`);
    });

    sio.on("user_joined", (data: { type: string; user: string; data: any }) => {
      console.log("Received message:", data);
      console.log(`${data.user} Joined room ${room}`);
      setCurrentState(data);
    });

    sio.on("user_left", (data: { type: string; user: string; data: any }) => {
      console.log("Received message:", data);
      console.log(`${data.user} Left room ${room}`);
      setCurrentState(data);
    });

    sio.on("quiz_start", (data: { type: string; user: string; data: any }) => {
      console.log("Received message:", data);
      console.log(`${data.user} Joined room ${room}`);
      setCurrentState(data);
    });

    sio.on("msg", (data: { room: string; message: string }) => {
      console.log("Received message:", data);
      setMessages((messages) => [...messages, data.message]);
    });

    sio.on("quiz_error", ({ error }: { error: string }) => {
      console.log("Received quiz error:", error);
      leaveRoom(socket);
    });

    return () => {
      // Disconnect from WebSocket server
      if (sio) {
        sio.disconnect();
        setSocket(null);
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      //   socket.emit("msg", messageToSend);
      socket.emit("msg", { ...user, message: message });
      console.log("Sent message:", message);
    }
  };

  // const selectOption = (option: string) => {
  //   if (socket) {
  //     if (option == "Delhi") {
  //       setPlayers({ ...players, [player]: true });
  //     }
  //     socket.emit("update_players", { room: room, players: players });
  //     console.log("Updated Players Sent:", players);
  //   }
  // };

  return (
    <div>
      <button
        onClick={() => {
          leaveRoom(socket);
        }}
      >
        Leave Room
      </button>
      <input
        type="text"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder="Chat"
      />
      <button onClick={sendMessage}>Send Message</button>
      <br />
      {JSON.stringify(messages)}
      <br />
      <br />
      {JSON.stringify(currentState)}
    </div>
  );
};
