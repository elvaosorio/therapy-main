import SendbirdApp from "@sendbird/uikit-react/App";

const APP_ID = process.env.SEND_BIRD_APP_ID as string;
const USER_ID = "almacuraadmin";

const Chat = () => {
    return (
        <>
            <div style={{ height: "calc(100vh - 120px)", width: "100vw" }}>
                <SendbirdApp appId={APP_ID} userId={USER_ID} />
            </div>
        </>
    );
};

export default Chat;
