import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { motion } from 'framer-motion';

interface MeetingRoomProps {
  roomName: string;
  userName: string;
  onClose: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({ roomName, userName, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-full relative bg-[#030508] border-r border-white/10 flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.1)] rounded-tl-[2rem] overflow-hidden"
    >
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={`SkillSync-Neural-${roomName}`}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          startScreenSharing: false,
          enableEmailInStats: false,
          prejoinPageEnabled: true, 
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#030508',
          DEFAULT_LOCAL_DISPLAY_NAME: userName,
        }}
        userInfo={{
          displayName: userName,
          email: `${userName.replace(/\s+/g, '')}@astranode.local`
        }}
        onApiReady={(externalApi) => {
          externalApi.addListener('videoConferenceLeft', () => {
             onClose();
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
          iframeRef.style.border = '0px';
        }}
      />
    </motion.div>
  );
};
