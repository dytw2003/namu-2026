// src/api/GraphApi.js

const API_BASE_URL = "www.adas.today";

export default function GraphApi() {
  return {
    sensor1: `http://${API_BASE_URL}/sf/backend/php_jwt_auth/php_graph_api/sensor_h1_copy.php`,
    sensor2: `http://${API_BASE_URL}/sf/backend/php_jwt_auth/php_graph_api/sensor_h2_copy.php`,
    sensor3: `http://${API_BASE_URL}/sf/backend/php_jwt_auth/php_graph_api/sensor_h3_copy.php`,
    sensor4: `http://${API_BASE_URL}/sf/backend/php_jwt_auth/php_graph_api/sensor_h4_copy.php`,
    sensor5: `http://${API_BASE_URL}/sf/backend/php_jwt_auth/php_graph_api/sensor_h5_copy.php`,
  };
}
