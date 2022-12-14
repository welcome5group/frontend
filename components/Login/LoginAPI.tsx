import {
    get as APIGet,
    post as APIPost,
    put as APIPut,
    del as APIDel,
    put2 as APIPut2,
    post2 as APIPost2,
} from "../../apis/api";

const emailRegex = /[a-zA-Z.].+[@][a-zA-Z].+[.][a-zA-Z]{2,4}$/;
const passRegex = /[^0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣~!@#$%^&*()-_=+,.?]/;
const alertText = [
    "이메일과 비밀번호를 입력해주세요.",
    "비밀번호를 8자 이상 입력해주세요.",
    "알맞는 이메일 및 비밀번호 형식을 사용해주세요.",
    "이메일을 입력해주세요.",
    "알맞는 이메일 형식을 사용해주세요.",
    "비밀번호가 일치하지 않습니다.",
];

// 자동 로그인 (테스트할때 재로그인하기 귀찮아서 만듬. 삭제 예정)
export function autoLogin() {
    localStorage["login"] = "true";
    localStorage["email"] = "fingerorder@naver.com";
    localStorage["kakao"] = "true";
    location.href = "/";
}

// 일반 로그인 일 때
export function LoginDefault() {
    localStorage["kakao"] = "false";
    localStorage["login"] = "true";
}

// 카카오 로그인 일 때
export function LoginKakao() {
    localStorage.clear();
    APIGet("/api/auth/kakao/sign-in?type=MERCHANT").then((res) => {
        let kakao = window.open(res.data.slice(9), "kakaoLogin", "width=500, height=600");
        // let kakao = window.open("/login/kakaologin/test", "kakaoLogin", "width=500, height=600");
        let count = 0; // setInterval에서의 메모리 누수 방지
        let interval = setInterval(() => {
            if (kakao!.closed) {
                if (localStorage["kakao"]) location.href = "/";
                clearInterval(interval);
            } else if (count === 60) clearInterval(interval);
            count++;
        }, 1000);
    });
}

// 로그인 함수 - 동기화
export function login(email: string, pass: string, e: { preventDefault: () => void }) {
    if (!email || !pass) {
        alert(alertText[0]);
        e.preventDefault();
    } else if (pass.length < 8) {
        alert(alertText[1]);
        e.preventDefault();
    } else if (!emailRegex.exec(email) || passRegex.exec(pass)) {
        alert(alertText[2]);
        e.preventDefault();
    } else {
        return APIPost(
            "/api/auth/sign-in",
            JSON.stringify({
                email: email,
                password: pass,
                type: "MERCHANT",
            })
        ).then((res: any) => {
            return {
                api: true,
                result: res.status === 200,
                data: res.data,
            };
        });
    }
    return { api: false, result: true, data: {} };
}

// 로그아웃 함수 - 동기화
export function logout(accessToken: string) {
    return APIPost2(
        "/api/auth/sign-out",
        JSON.stringify({
            accessToken: accessToken.slice(6),
            refreshToken: "",
        }),
        accessToken
    ).then((res) => {
        localStorage.clear();
        location.href = "/";
        return {
            api: true,
            result: res.status === 200,
            data: res.data,
        };
    });
}

// 회원가입 - 동기화
export function signup(email: string, pass1: string, pass2: string) {
    if (email === "" || pass1 === "" || pass2 === "") alert(alertText[0]);
    else if (pass1 !== pass2) alert(alertText[5]);
    else if (pass1.length < 8 || pass2.length < 8) alert(alertText[1]);
    else if (!emailRegex.exec(email) || passRegex.exec(pass1) || passRegex.exec(pass2)) alert(alertText[2]);
    else {
        return APIPost(
            "/api/auth/sign-up",
            JSON.stringify({
                email: email,
                password: pass1,
                nickName: "",
                type: "MERCHANT",
            })
        ).then((res: any) => {
            return {
                api: true,
                result: res.status === 200,
                data: res.data,
            };
        });
    }
    return { api: false, result: true, data: {} };
}

// 회원가입 이메일 인증 완료 - 동기화
export function signupAuth(uuid: string) {
    if (uuid !== "") {
        APIPut("/api/auth/sign-up?uuid=" + uuid, "").then((res: any) => {
            return {
                api: true,
                result: res.status === 200,
                data: res.data,
            };
        });
    }
    return { api: false, result: true, data: {} };
}

// 비밀번호 재설정 링크 보낼 이메일 입력 - 동기화
export function emailSend(email: string) {
    if (!email) alert(alertText[3]);
    else if (!emailRegex.exec(email)) alert(alertText[4]);
    else {
        APIPost(
            "/api/users/password",
            JSON.stringify({
                email: email,
            })
        ).then((res) => {
            return {
                api: true,
                result: res.status === 200,
                data: res.data,
            };
        });
    }
    return { api: false, result: true, data: {} };
}

// 비밀번호 초기화 - 동기화
export function passwordReset(uuid: string, pass1: string, pass2: string, accessToken: string) {
    if (uuid === "" || pass1 === "" || pass2 === "") alert(alertText[0]);
    else if (pass1 !== pass2) alert(alertText[5]);
    else if (pass1.length < 8 || pass2.length < 8) alert(alertText[1]);
    else if (passRegex.exec(pass1) || passRegex.exec(pass2)) alert(alertText[2]);
    else {
        return APIPut2(
            "/api/auth/resetPassword?uuid=" + uuid,
            JSON.stringify({
                password: pass1,
            }),
            accessToken
        ).then((res: any) => {
            return {
                api: true,
                result: res.status === 200,
                data: res.data,
            };
        });
    }
    return { api: false, result: true, data: {} };
}

// 회원 탈퇴
export function withdrawal(pass: string) {
    const email = localStorage["email"];
    if (email === "" || pass === "") alert(alertText[0]);
    else if (pass.length < 8) alert(alertText[1]);
    else if (passRegex.exec(pass)) alert(alertText[2]);
    else {
        return APIPost(
            "/api/users/delete",
            JSON.stringify({
                email: email,
                password: pass,
            })
        ).then((res) => {
            return {
                api: true,
                result: res.status === 200,
                data: res.data,
            };
        });
    }
    return { api: false, result: true, data: {} };
}
