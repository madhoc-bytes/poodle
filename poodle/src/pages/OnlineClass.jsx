import React from 'react';
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

const OnlineClass = () => {
    const { courseId } = useParams().courseId;
    const { roomId } = useParams().roomId;

    const myMeeting = async (element) => {
        const appID = 1970348594;
        const serverSecret = "91c96aaa9f049cef482d9fb5c01630c1";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), 'username');

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container:element,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            }
        })
    }

    return (
        <div className='room-page'>
            <p>{roomId}</p>
            <div ref={myMeeting}/>
        </div>
    )
}

export default OnlineClass;