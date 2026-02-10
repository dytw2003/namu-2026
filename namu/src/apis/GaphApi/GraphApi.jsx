// src/api/GraphApi.js

const API_BASE_URL = "www.adas.today";

export default function GraphApi() {
  return {
    sensor1: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s1_graph.php`,
    sensor2: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s2_graph.php`,
    sensor3: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s3_graph.php`,
    sensor4: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s4_graph.php`,
    sensor5: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s5_graph.php`,
    sensor6: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s6_graph.php`,
    sensor7: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s7_graph.php`,
    sensor8: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s8_graph.php`,
    sensor9: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s9_graph.php`,
    sensor10: `http://${API_BASE_URL}/sf/backend/namu_php/graph_api/t_s10_graph.php`,
   
  
    
  };
}
