import '@livekit/components-styles';
import {
    CarouselLayout,
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer, useParticipants, useTracks,
    FocusLayout,
    useRoomContext,

    VideoConference, ParticipantName,
} from '@livekit/components-react';
import {RoomServiceClient} from 'livekit-server-sdk'
import {RoomEvent, Track} from "livekit-client";
import {useCallback, useEffect, useState} from "react";
import {getToken, kickUser, listParticipants, muteUser, unmuteUser} from "../../../api/meeting.js";
import {router} from "../../../router/router.js";
import {NModal} from "naive-ui";
import {useHotkeys} from "react-hotkeys-hook";
import {Button, Modal, Space} from "antd";

const serverUrl = 'ws://101.33.210.228:7880';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkMzBhOGQ1YmYzNzk0ZmIyYjBiY2JlYzE0MmExY2RlZiIsImlzcyI6ImRldmtleSIsIm5hbWUiOiJyb290IiwidmlkZW8iOnsicm9vbUpvaW4iOnRydWUsInJvb20iOiJ0ZXN0MiJ9LCJleHAiOjE3MTU4OTU4OTEsImp0aSI6ImQzMGE4ZDViZjM3OTRmYjJiMGJjYmVjMTQyYTFjZGVmIn0.SsBz-FU0-2ruC4AqcVut9-SG4uSQ0YIX3WwgF9lS3Go';

export default function MeetingReact() {
    const name = router.currentRoute.value.params.name;
    const [token, setToken] = useState();
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const [local, setLocal] = useState();
    useHotkeys('ctrl+alt', async () => {
        console.log('ctrl+alt');
        setShowModal(true);
        const roomServiceClient = new RoomServiceClient(serverUrl, 'devkey', 'secret');
        roomServiceClient.listParticipants(name).then(
            res => {
                console.log('name:', name)
                console.log(res)
                setData(res
                    .map(
                        item => ({
                            userId: item.identity,
                            username: item.name,
                            banned: item.permission.canPublish === false
                        })
                    ))
            });
    })

    useEffect(() => {
        const name = router.currentRoute.value.params.name;
        getToken(name).then(
            res => {
                setToken(res.data.data);
            }
        );
    }, []);


    const handleListParticipants = useCallback(() => {
        const roomServiceClient = new RoomServiceClient(serverUrl, 'devkey', 'secret');
        const room = useRoomContext();

        const local = room.localParticipant.identity;
        roomServiceClient.listParticipants(name).then(
            res => {
                console.log('name:', name)
                console.log(res)
                setData(res
                    .filter(item => item.identity !== local)
                    .map(
                        item => ({
                            userId: item.identity,
                            username: item.name,
                            banned: item.permission.canPublish === false
                        })
                    ))
            });

    },[]);

    const handleMuteUser = useCallback((userId) => {
        const roomServiceClient = new RoomServiceClient(serverUrl, 'devkey', 'secret');
        roomServiceClient.updateParticipant(name, userId, null,{canPublish: false})
    },[] )

    const handleKickUser = useCallback((userId) => {
        const roomServiceClient = new RoomServiceClient(serverUrl, 'devkey', 'secret');
        roomServiceClient.removeParticipant(name, userId).then(r => {
            console.log(r)
        });
    },[] )

    const handleUnmuteUser = useCallback((userId) => {
        const roomServiceClient = new RoomServiceClient(serverUrl, 'devkey', 'secret');
        roomServiceClient.updateParticipant(name, userId, null,{canPublish: true})
    }, [])
    return (
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={serverUrl}
                // Use the default LiveKit theme for nice styles.
                data-lk-theme="default"
                style={{height: '100vh'}}
            >
                {/* Your custom component with basic video conferencing functionality. */}
                <VideoConference/>
                {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
                {/*<RoomAudioRenderer/>*/}
                {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}

                <ControlBar></ControlBar>
                {/*<OnlineUsers/>*/}
                <Modal open={showModal}
                       onOk={() => setShowModal(!showModal)}
                       onCancel={() => setShowModal(!showModal)}>
                    {


                        data.length > 0 ? data.map(item => (
                        <Space key={item.userId}>
                            <div>
                                {item.username}
                            </div>
                            {
                                item.banned ? <Button onClick={() => handleUnmuteUser(item.userId)}>解除禁言</Button>:
                                    <Button onClick={() => handleMuteUser(item.userId)}>禁言</Button>
                            }

                            <Button onClick={() => handleKickUser(item.userId)}>
                                踢出
                            </Button>
                        </Space>
                    )) : <div key={'unconnected'}>未连接到会议</div>}
                </Modal>
            </LiveKitRoom>
    );
}


