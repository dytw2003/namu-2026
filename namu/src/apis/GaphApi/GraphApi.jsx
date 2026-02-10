// src/api/GraphApi.js

const API_BASE_URL = "www.adas.today";

export default function GraphApi() {
  return {
    sensor1: `http://${API_BASE_URL}/sf/backend/namu_php/t_s1_stream.php`,
    sensor2: `http://${API_BASE_URL}/sf/backend/namu_php/t_s2_stream.php`,
    sensor3: `http://${API_BASE_URL}/sf/backend/namu_php/t_s3_stream.php`,
    sensor4: `http://${API_BASE_URL}/sf/backend/namu_php/t_s4_stream.php`,
    sensor5: `http://${API_BASE_URL}/sf/backend/namu_php/t_s5_stream.php`,
    sensor6: `http://${API_BASE_URL}/sf/backend/namu_php/t_s6_stream.php`,
    sensor7: `http://${API_BASE_URL}/sf/backend/namu_php/t_s7_stream.php`,
    sensor8: `http://${API_BASE_URL}/sf/backend/namu_php/t_s8_stream.php`,
    sensor9: `http://${API_BASE_URL}/sf/backend/namu_php/t_s9_stream.php`,
    sensor10: `http://${API_BASE_URL}/sf/backend/namu_php/t_s10_stream.php`,
   
    
  };
}
