import '@livekit/components-styles';
import {

    LiveKitRoom,
    VideoConference, ParticipantName,
} from '@livekit/components-react';
import {RoomServiceClient} from 'livekit-server-sdk'
import {useCallback, useEffect, useState} from "react";
import {getToken, isHost, kickUser, listParticipants, muteUser, unmuteUser} from "../../../api/meeting.js";
import {router} from "../../../router/router.js";
import {NModal} from "naive-ui";
import {useHotkeys} from "react-hotkeys-hook";
import {Button,  Modal, Space} from "antd";
import {message} from '../../../api/api.js'

const serverUrl = 'ws://101.33.210.228:7880';

export default function MeetingReact() {
    const name = window.location.href.split('/').pop();
    const [token, setToken] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const [local, setLocal] = useState();
    const [host, setHost] = useState(false);
    useHotkeys('ctrl+alt', async () => {
        if(host) {
            updateDate();
            setShowModal(!showModal);
        }

    })

    const updateDate = useCallback(() => {
        listParticipants(name).then(
            res => {
                console.log(res.data.data)
                setData(res.data.data)
            }
        );
    }, [])

    useEffect(() => {
        const name = window.location.href.split('/').pop();
        getToken(name).then(
            res => {
                if(res.data.code=== 200)
                    setToken(res.data.data);
                else {
                    router.go(-1);
                }
            }
        );
        isHost(name).then(
            res => {
                if(res.data.code === 200) {
                    setHost(res.data.data);
                }
            });

    }, []);


    const handleMuteUser = useCallback((item) => {
        muteUser(name, item.userId).then(
            () => updateDate()
        )
    },[] )

    const handleKickUser = useCallback((item) => {
        kickUser(name, item.userId).then(
            () => updateDate()
        )
    },[] )

    const handleUnmuteUser = useCallback((item) => {
        unmuteUser(name, item.userId).then(
            () => updateDate()
        )

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

                {/*<OnlineUsers/>*/}
                <Modal open={showModal}
                       onOk={() => setShowModal(!showModal)}
                       onCancel={() => setShowModal(!showModal)}
                       style={ {
                           display: 'flex',
                           flexDirection: 'column',
                           justifyContent: 'center',
                           alignItems: 'center',
                           overflow: 'auto'
                       }}
                >
                    {
                        data.length > 0 ? data.map(item => (
                            <div  key={item.userId}>
                                <Space style={ {
                                    margin: '1em'
                                }}>
                                    <div>
                                        {item.username}
                                    </div>
                                    {
                                        item.banned ? <Button onClick={() => handleUnmuteUser(item)}>解除禁言</Button>
                                            : <Button onClick={() => handleMuteUser(item)}>禁言</Button>
                                    }

                                    <Button onClick={() => handleKickUser(item)}>
                                        踢出
                                    </Button>
                                </Space>
                            </div>

                    )) : <div key={'unconnected'}>无其他成员</div>}
                </Modal>
            </LiveKitRoom>
    );
}


