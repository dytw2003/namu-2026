// src/api/AuthApi.js

const API_BASE_URL = "www.adas.today";

export default function AuthApi() {
  return {
    login: `http://${API_BASE_URL}/sf/backend/php_jwt_auth/login_copy.php`,
  };
}
