import Link from "next/link";
import { useState } from "react";
import { signup } from "./LoginFunction";
import Img from "../common/Img";
import styles from "./Login.module.scss";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [signupOK, setSignupOK] = useState(false);
    const [signupTry, setSignupTry] = useState(false);

    return (
        <main>
            <section className={styles.login}>
                {Img("fingerorder", 150, 150)}
                {!signupOK ? (
                    <div className={styles.loginForm}>
                        <input
                            type="email"
                            placeholder="이메일을 입력해주세요."
                            onChange={(e) => setEmail(e.target.value)}
                            pattern="[a-zA-Z.].+[@][a-zA-Z].+[.][a-zA-Z]{2,4}$"
                            aria-required={signupTry}
                            required={signupTry}
                        />
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            minLength={8}
                            pattern="[0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣~!@#$%^&*()-_=+,.?]{8,}"
                            onChange={(e) => setPass1(e.target.value)}
                            aria-required={signupTry}
                            required={signupTry}
                        />
                        <input
                            type="password"
                            placeholder="비밀번호를 확인해주세요."
                            minLength={8}
                            pattern="[0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣~!@#$%^&*()-_=+,.?]{8,}"
                            onChange={(e) => setPass2(e.target.value)}
                            aria-required={signupTry}
                            required={signupTry}
                        />
                        <button
                            onClick={() => {
                                setSignupTry(true);
                                setSignupOK(signup(email, pass1, pass2));
                            }}
                        >
                            회원가입
                        </button>
                    </div>
                ) : (
                    <>
                        <p>회원가입이 완료되었습니다.</p>
                        <p>이메일 인증을 완료하신 후 로그인하여 주세요.</p>
                        <Link href={"/login"}>
                            <button>로그인</button>
                        </Link>
                    </>
                )}
            </section>
        </main>
    );
}