import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";






import { useTheme } from "../../providers/ThemeProvider/ThemeProvider"


import { loginApi } from "./Auth";



import "./Login.css";

import logodark from "../../assets/logodark.svg";
import logolight from "../../assets/logolight.svg";

import circletickeddark from "../../assets/circletickeddark.svg";
import circletickedlight from "../../assets/circletickedlight.svg";
import circleuntickdark from "../../assets/circleuntickdark.svg";
import circleunticklight from "../../assets/circleunticklight.svg";
import passwrongdark from "../../assets/passwrongdark.svg";
import passwronglight from "../../assets/passwronglight.svg";

function Login() {

    const { theme } = useTheme()


  const originalNum = 11;
  
  const { user, setUser, checkSession } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isPasswordMissing, setIsPasswordMissing] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const [isButtonActive, setIsButtonActive] = useState(false);

  // const [isChecked, setIsChecked] = useState(false);

  const [isChecked, setIsChecked] = useState(
    localStorage.getItem("rememberMe") === ""
  );




 
  

  useEffect(() => {
    const resetScroll = () => {
      // Reset animation
      const el = document.querySelector('.login-footer-company-experts');
      if (el) {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = 'scrollAnimation 55s linear infinite';
      }
  
      // ✅ Remove all .hovered classes on touchend (zoom fix)
      const hoveredEls = document.querySelectorAll('.login-footer-company-firstexp.hovered');
      hoveredEls.forEach((el) => el.classList.remove('hovered'));
    };
  
    document.addEventListener('touchend', resetScroll);
    return () => {
      document.removeEventListener('touchend', resetScroll);
    };
  }, []);
  
  

 

  useEffect(() => {
   
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    setIsChecked(rememberMe); // ✅ Ensure the checkbox state is updated

    if (rememberMe && savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
    }
  }, []);

  const handleButtonClick = () => {
    setIsButtonActive(true);
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsPasswordMissing(false);
    setWrongCredentials(false);
    setIsButtonActive(true); // Activate button when clicked

    if (!username || !password || password == " ") {
      if (!password) setWrongCredentials(true);
      return;
    }

    try {
      const response = await loginApi(username, password);
      if (response.access_token) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        localStorage.setItem("name_kr",response.name_kr)
        localStorage.setItem("housetype",response.housetype)

        const maxhouse = response.maxhouse ?? originalNum;
        
        if (maxhouse) {
          localStorage.setItem("maxhouse", maxhouse);
        }

        const decodedToken = jwtDecode(response.access_token);

        // ✅ Use 'user_id' instead of 'username'
        const extractedUsername = decodedToken.user_id;

        if (extractedUsername) {
          setUser({ username: extractedUsername });

          if (isChecked) {
            localStorage.setItem("savedUsername", username);
            localStorage.setItem("savedPassword", password);
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("savedUsername");
            localStorage.removeItem("savedPassword");
            localStorage.removeItem("rememberMe");
          }
          navigate("/home");
        } else {
          console.error("Username field not found in token!");
        }
      } else {
        setWrongCredentials(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred. Please try again.");
    }
  };

  

 
 


 

  return (
    <div
      className={`loginContainer ${
        theme === "dark" ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="logoAndName">
        {theme === "dark" ? (
          <img src={logodark} alt="Dark Mode Logo" className="logo" />
        ) : (
          <img src={logolight} alt="Light Mode Logo" className="logo" />
        )}
      </div>
      <div className="wrapper">
        <form
          className="login-form"
          onSubmit={(event) => {
            handleButtonClick();
            handleLogin(event);
          }}
        >
          <div className="inputSection">
            <div className="input-group">
              <input
                type="text"
                id="username"
                className="userNameInput"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setIsButtonActive(true);
                    handleLogin(event);
                  }
                }}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                id="password"
                // className='passwordInput'
                className={`passwordInput ${
                  isPasswordMissing ? "passwordInputError" : ""
                }`}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setIsButtonActive(true);
                    handleLogin(event);
                  }
                }}
              />
            </div>
          </div>

          <div className="rememberMe">
            <img
              src={
                theme === "dark"
                  ? !isChecked
                    ? circleunticklight
                    : circletickedlight
                  : !isChecked
                  ? circletickeddark
                  : circleuntickdark
              }
              alt="remember"
              id="stayLoggedIn"
              onClick={handleToggle}
              className="icons1"
            />
            <span className="rMe" id="rMe">
              로그인 상태 유지
            </span>
          </div>
        </form>

        {/* error message */}
        <div className="conditions">
          {isPasswordMissing && (
            <div className="missingPassword" id="noPassword">
              <img src={passwrongdark} alt="image" className="icons1" />
              <span className="again">비밀번호를 입력해주세요</span>
            </div>
          )}

          {wrongCredentials && (
            <div className="wrongInputs" id="wrongPassAndUser">
              <img src={passwrongdark} alt="image" className="icons1" />
              <span className="textPassOrUser">
                아이디 또는 비밀번호가 잘못 되었습니다. 정확히 입력해 주세요.
              </span>
            </div>
          )}

          <button
            type="submit"
            id="logInBtn"
            onClick={(event) => {
              handleButtonClick();
              handleLogin(event);
            }}
            style={{
              backgroundColor:
                theme === "dark"
                  ? isButtonActive
                    ? "#3EC696"
                    : "#CDD2E380"
                  : isButtonActive
                  ? "#1C625D"
                  : "#00000080",
            }}
          >
            로그인
          </button>
        </div>
      </div>

      
     
    </div>
  );
}

export default Login;