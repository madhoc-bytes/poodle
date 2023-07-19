import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const OnlineClass = () => {
  const courseId = useParams().courseId;
  const roomId = useParams().roomId;

  console.log(courseId);

  const myMeeting = async (element) => {
    const appID = 972905527;
    const serverSecret = "3334c71f6ac4ab8cdc93f1953ca612f1";
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
