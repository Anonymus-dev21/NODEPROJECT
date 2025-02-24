import {dirname, join} from "path";
import { fileURLToPath } from "url";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__fileName), "..");
export default __dirname