// src/api/GraphApi.js

const API_BASE_URL = "www.adas.today";

export default function GraphApi() {
  return {
    sensor1: `http://${API_BASE_URL}/sf/backend/namu_php/t_s1_stream.php`,
    sensor2: `http://${API_BASE_URL}/sf/backend/namu_php/t_s2_stream.php`,
    sensor3: `http://${API_BASE_URL}/sf/backend/namu_php/t_s3_stream.php`,
    
  };
}
