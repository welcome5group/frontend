import { useEffect, useState } from "react";
import { emailSend } from "./LoginAPI";
import Img from "../common/Img";
import { useRecoilState } from "recoil";
import { isDarkmode } from "../../states";
import styles from "./Login.module.scss";

export default function FindPassword() {
    const [darkmode] = useRecoilState<boolean>(isDarkmode);
    const [email, setEmail] = useState("");
    const [isAPI, setAPI] = useState(false);
    const [sendTry, setSendTry] = useState(false);

    useEffect(() => {
        if (localStorage["kakao"] === "true") {
            alert("카카오 로그인 사용자는 비밀번호 변경을 하실 수 없습니다.");
            location.href = "/mypage";
        }
    }, []);

    return (
        <main>
            <section className={styles.login}>
                {Img("fingerorder", 150, 150, `${darkmode ? styles.loginInvert : ""}`)}
                <div className={styles.loginForm}>
                    {!isAPI ? (
                        <>
                            <input
                                type="email"
                                placeholder="이메일을 입력해주세요."
                                pattern="[a-zA-Z.].+[@][a-zA-Z].+[.][a-zA-Z]{2,4}$"
                                className={styles.loginInput}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-required={sendTry}
                                required={sendTry}
                            />
                            <button
                                onClick={() => {
                                    const result = emailSend(email);
                                    setAPI(result.api);
                                    setSendTry(true);
                                }}
                            >
                                이메일 전송
                            </button>
                        </>
                    ) : (
                        <p className={styles.findpasswordText}>
                            이메일로 초기화 링크가 전송되었습니다.
                            <br />
                            링크에 접속하여 초기화 부탁드립니다.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}
