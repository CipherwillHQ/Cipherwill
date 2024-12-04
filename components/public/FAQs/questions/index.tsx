import { questions as generalQuestions, name as generalName } from "./general";
import { questions as importantQuestions, name as importantName } from "./important";
const questions = {
  [importantName]: importantQuestions,
  [generalName]: generalQuestions,
};

export default questions;
