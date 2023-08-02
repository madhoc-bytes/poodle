import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const OnlineClass = () => {
  const courseId = useParams().courseId;
  const roomId = useParams().roomId;

  console.log(courseId);

  const myMeeting = async (element) => {
    const appID = 158040060;
    const serverSecret = "819c35e5261398cd9022f17d2d5fdd98";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "username"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };

  return (
    <div className="room-page">
      {/* <button onClick={() => { console.log(roomId, courseId) }}>Press</button> */}
      <div ref={myMeeting} />
    </div>
  );
};

export default OnlineClass;
